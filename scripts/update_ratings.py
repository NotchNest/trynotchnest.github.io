#!/usr/bin/env python3
"""
Refresh AggregateRating values in index.html JSON-LD + visible DOM
using live data from iTunes RSS reviews feed (us storefront, all reviews
across storefronts can also be summed but the lookup endpoint is stale).

Also pings IndexNow on Bing + Yandex with all sitemap URLs after update.

Run before deploy:  python3 scripts/update_ratings.py
Or wire into a GitHub Action on schedule.
"""

import json
import re
import sys
import urllib.request
import urllib.error
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
INDEX = ROOT / "index.html"
SITEMAP = ROOT / "sitemap.xml"

APP_ID = "6747612321"
HOST = "trynotchnest.silverseahog.com"
INDEXNOW_KEY = "e348658e6461a8012892dff0e066abe8"

STOREFRONTS = [
    "us", "gb", "de", "fr", "jp", "cn", "in", "ca", "au", "kr", "br", "es",
    "it", "mx", "nl", "se", "no", "dk", "fi", "pl", "tr", "ru", "hk", "tw",
    "sg", "th", "vn", "my", "id", "ph", "nz", "ie", "be", "at", "ch", "pt",
    "gr", "cz", "hu", "ro", "sa", "ae", "il", "za", "ar", "cl", "co",
]


def fetch_json(url, timeout=8):
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "NotchNest-SEO/1.0"})
        with urllib.request.urlopen(req, timeout=timeout) as r:
            return json.loads(r.read().decode())
    except (urllib.error.URLError, json.JSONDecodeError, TimeoutError):
        return None


def aggregate_ratings():
    """Sum userRatingCount across storefronts, compute weighted average.
    Fallback to RSS feed if all lookup endpoints return 0."""
    total_count = 0
    weighted = 0.0
    for cc in STOREFRONTS:
        d = fetch_json(f"https://itunes.apple.com/lookup?id={APP_ID}&country={cc}")
        if not d or not d.get("results"):
            continue
        r = d["results"][0]
        c = r.get("userRatingCount") or 0
        v = r.get("averageUserRating") or 0
        if c > 0 and v > 0:
            total_count += c
            weighted += c * v

    if total_count >= 1:
        return round(weighted / total_count, 1), total_count

    # Fallback: RSS US reviews
    d = fetch_json(
        f"https://itunes.apple.com/us/rss/customerreviews/id={APP_ID}/sortBy=mostHelpful/json"
    )
    if not d:
        return None, None
    entries = d.get("feed", {}).get("entry", [])[1:]
    ratings = []
    for x in entries:
        try:
            ratings.append(int(x.get("im:rating", {}).get("label", 0)))
        except (TypeError, ValueError):
            pass
    if not ratings:
        return None, None
    return round(sum(ratings) / len(ratings), 1), len(ratings)


def patch_index(rating_value, rating_count):
    s = INDEX.read_text()

    # Patch every "ratingValue": "<n>" and "ratingCount": "<n>" inside aggregateRating blocks
    s = re.sub(
        r'"ratingValue":\s*"[0-9.]+"',
        f'"ratingValue": "{rating_value}"',
        s,
    )
    s = re.sub(
        r'"ratingCount":\s*"[0-9]+"',
        f'"ratingCount": "{rating_count}"',
        s,
    )

    # Patch DOM <span data-rating-value>X</span> and <span data-rating-count>X</span>
    s = re.sub(
        r'(data-rating-value[^>]*>)[^<]+(<)',
        lambda m: m.group(1) + str(rating_value) + m.group(2),
        s,
    )
    s = re.sub(
        r'(data-rating-count[^>]*>)[^<]+(<)',
        lambda m: m.group(1) + f"{rating_count:,}" + m.group(2),
        s,
    )

    INDEX.write_text(s)


def sitemap_urls():
    tree = ET.parse(SITEMAP)
    ns = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    return [loc.text for loc in tree.getroot().iter(f"{{{ns['s']}}}loc")]


def indexnow_ping(urls):
    """Submit all sitemap URLs to IndexNow (Bing + Yandex)."""
    payload = json.dumps({
        "host": HOST,
        "key": INDEXNOW_KEY,
        "keyLocation": f"https://{HOST}/{INDEXNOW_KEY}.txt",
        "urlList": urls,
    }).encode()
    for endpoint in ("https://api.indexnow.org/indexnow", "https://www.bing.com/indexnow"):
        try:
            req = urllib.request.Request(
                endpoint,
                data=payload,
                headers={"Content-Type": "application/json; charset=utf-8"},
                method="POST",
            )
            with urllib.request.urlopen(req, timeout=10) as r:
                print(f"  {endpoint}: HTTP {r.status}")
        except urllib.error.HTTPError as e:
            print(f"  {endpoint}: HTTP {e.code}")
        except urllib.error.URLError as e:
            print(f"  {endpoint}: {e}")


def main():
    print("Aggregating ratings across storefronts...")
    rv, rc = aggregate_ratings()
    if rv is None:
        print("  ! No rating data available — leaving baked values untouched.")
    else:
        print(f"  -> ratingValue={rv}  ratingCount={rc}")
        patch_index(rv, rc)
        print(f"  -> patched {INDEX}")

    urls = sitemap_urls()
    if "--ping" in sys.argv:
        print(f"Pinging IndexNow with {len(urls)} URLs...")
        indexnow_ping(urls)
    else:
        print(f"Skipping IndexNow ping (pass --ping to enable). {len(urls)} URLs in sitemap.")


if __name__ == "__main__":
    main()
