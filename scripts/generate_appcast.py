#!/usr/bin/env python3
"""
NotchNest Appcast Generator for Sparkle
Fetches version information from App Store and generates Sparkle-compatible appcast.xml
"""

import json
import urllib.request
import urllib.error
import xml.etree.ElementTree as ET
from datetime import datetime
from xml.dom import minidom

APP_ID = "6747612321"
APP_STORE_URL = f"https://itunes.apple.com/lookup?id={APP_ID}"
APPCAST_FILE = "appcast.xml"

# You'll need to update these values when you have actual download links
DOWNLOAD_BASE_URL = "https://github.com/yourusername/notchnest/releases/download"
APP_NAME = "NotchNest"


def fetch_app_store_data():
    """Fetch app information from iTunes API"""
    try:
        with urllib.request.urlopen(APP_STORE_URL) as response:
            data = json.loads(response.read().decode())
            if data.get('results') and len(data['results']) > 0:
                return data['results'][0]
            else:
                print("No results found in App Store API response")
                return None
    except urllib.error.URLError as e:
        print(f"Error fetching App Store data: {e}")
        return None


def parse_release_notes(notes):
    """Parse and clean release notes"""
    if not notes:
        return "No release notes available."
    
    # Clean up the notes
    cleaned = notes.strip()
    
    # Convert to HTML-friendly format
    lines = cleaned.split('\n')
    formatted_lines = []
    
    for line in lines:
        line = line.strip()
        if line:
            # Check for bullet points
            if line.startswith('•') or line.startswith('-'):
                formatted_lines.append(f"    <li>{line[1:].strip()}</li>")
            elif line.startswith('Version') or line.startswith('What\'s New') or line.startswith('Thanks'):
                formatted_lines.append(f"    <h3>{line}</h3>")
            else:
                formatted_lines.append(f"    <p>{line}</p>")
    
    return '\n'.join(formatted_lines)


def format_date_rfc822(date_string):
    """Convert ISO date to RFC 822 format for RSS"""
    try:
        # Parse the ISO date from App Store
        dt = datetime.strptime(date_string, "%Y-%m-%dT%H:%M:%SZ")
        # Format as RFC 822
        return dt.strftime("%a, %d %b %Y %H:%M:%S +0000")
    except Exception as e:
        print(f"Error parsing date: {e}")
        # Return current date as fallback
        return datetime.utcnow().strftime("%a, %d %b %Y %H:%M:%S +0000")


def create_appcast_xml(app_info):
    """Create Sparkle-compatible appcast.xml"""
    
    # Create root RSS element
    rss = ET.Element('rss')
    rss.set('version', '2.0')
    rss.set('xmlns:sparkle', 'http://www.andymatuschak.org/xml-namespaces/sparkle')
    rss.set('xmlns:dc', 'http://purl.org/dc/elements/1.1/')
    
    channel = ET.SubElement(rss, 'channel')
    
    # Channel metadata
    ET.SubElement(channel, 'title').text = f"{APP_NAME}'s Changelog"
    ET.SubElement(channel, 'description').text = "Most recent changes with links to updates."
    ET.SubElement(channel, 'language').text = "en"
    ET.SubElement(channel, 'link').text = "https://trynotchnest.silverseahog.com"
    
    # Create item for current version
    item = ET.SubElement(channel, 'item')
    
    version = app_info.get('version', '1.0.0')
    bundle_version = app_info.get('version', '1.0.0')
    
    # Title
    title = f"Version {version}"
    if app_info.get('releaseNotes'):
        # Try to extract a brief summary from first line
        first_line = app_info['releaseNotes'].split('\n')[0].strip()
        if first_line and len(first_line) < 100:
            title = f"Version {version} - {first_line}"
    ET.SubElement(item, 'title').text = title
    
    # Link to website
    ET.SubElement(item, 'link').text = "https://trynotchnest.silverseahog.com"
    
    # Sparkle version
    sparkle_version = ET.SubElement(item, 'sparkle:version')
    sparkle_version.text = bundle_version
    
    # Short version string
    sparkle_short_version = ET.SubElement(item, 'sparkle:shortVersionString')
    sparkle_short_version.text = version
    
    # Release notes (embedded)
    description = ET.SubElement(item, 'description')
    release_notes = app_info.get('releaseNotes', 'No release notes available.')
    description.text = f"<![CDATA[\n{parse_release_notes(release_notes)}\n]]>"
    
    # Publication date
    pub_date = format_date_rfc822(
        app_info.get('currentVersionReleaseDate', 
                    app_info.get('releaseDate', datetime.utcnow().isoformat() + 'Z'))
    )
    ET.SubElement(item, 'pubDate').text = pub_date
    
    # Enclosure (download link) - This needs to be updated with actual download URL
    # For now, we'll use a placeholder that points to the App Store
    enclosure = ET.SubElement(item, 'enclosure')
    
    # In a real scenario, you'd host the .dmg or .zip on GitHub releases
    # For App Store apps, users update through App Store, but Sparkle can still
    # show the notification and link to App Store
    download_url = app_info.get('trackViewUrl', 'https://apps.apple.com/us/app/notchnest-power-your-notch/id6747612321')
    
    enclosure.set('url', download_url)
    enclosure.set('type', 'application/octet-stream')
    enclosure.set('length', str(app_info.get('fileSizeBytes', '0')))
    
    # Sparkle attributes for enclosure
    # Note: For App Store apps, you won't have EdDSA signatures
    # This is mainly for direct distribution outside App Store
    # enclosure.set('sparkle:edSignature', 'YOUR_SIGNATURE_HERE')
    
    # Minimum system version
    min_os = app_info.get('minimumOsVersion', '14.0')
    sparkle_min_os = ET.SubElement(item, 'sparkle:minimumSystemVersion')
    sparkle_min_os.text = min_os
    
    # Pretty print the XML
    xml_string = ET.tostring(rss, encoding='unicode')
    dom = minidom.parseString(xml_string)
    pretty_xml = dom.toprettyxml(indent="  ")
    
    # Remove extra blank lines
    lines = [line for line in pretty_xml.split('\n') if line.strip()]
    return '\n'.join(lines)


def main():
    """Main function to generate appcast"""
    print("Fetching App Store data...")
    app_info = fetch_app_store_data()
    
    if not app_info:
        print("Failed to fetch app data. Exiting.")
        return 1
    
    print(f"Found app: {app_info.get('trackName', 'Unknown')} v{app_info.get('version', 'Unknown')}")
    
    print("Generating appcast.xml...")
    appcast_xml = create_appcast_xml(app_info)
    
    print(f"Writing to {APPCAST_FILE}...")
    with open(APPCAST_FILE, 'w', encoding='utf-8') as f:
        f.write(appcast_xml)
    
    print("✓ Appcast generated successfully!")
    print(f"  Version: {app_info.get('version', 'Unknown')}")
    print(f"  Release Date: {app_info.get('currentVersionReleaseDate', 'Unknown')}")
    print(f"  File: {APPCAST_FILE}")
    
    return 0


if __name__ == "__main__":
    exit(main())
