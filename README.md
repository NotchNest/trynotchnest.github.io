# NotchNest - App Landing Page with Sparkle Updates

> A beautiful, modern landing page for macOS apps with auto-generated Sparkle update feeds. Features App Store integration, release notes, and GitHub Actions automation.

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://notchnest.app)
[![Sparkle Compatible](https://img.shields.io/badge/Sparkle-2.x-blue)](https://sparkle-project.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 🌟 Features

- 🎨 **Modern Design** - Glassmorphism effects, dark theme, fully responsive
- 🔄 **Sparkle Integration** - Auto-generated `appcast.xml` with version history
- 📱 **App Store Sync** - Fetches app data, version, and release notes automatically
- 🤖 **GitHub Actions** - Updates appcast every 6 hours (configurable)
- 📝 **What's New Page** - Beautiful release notes display
- 🛠️ **Debug Tools** - Built-in appcast viewer for testing
- ⚡ **Fast & Cached** - LocalStorage caching, optimized performance
- 🔐 **Privacy First** - No tracking, all data stays local

## 🚀 Quick Start

### 1. Update Your App Store ID

**⚠️ Critical Step** - Change this in 3 files:

```bash
# Files to update:
- index.html (line ~210)
- whats-new.html (line ~161)
- scripts/generate_appcast.py (line ~9)

# Find and replace:
"6747612321" → "YOUR_APP_STORE_ID"
```

**How to find your App Store ID:**
Your App Store URL: `https://apps.apple.com/app/id6747612321`
Your App ID is: `6747612321`

### 2. Test Locally

```bash
# Generate appcast
python3 scripts/generate_appcast.py

# Start local server
python3 -m http.server 8000

# Open in browser
open http://localhost:8000
```

### 3. Deploy to GitHub Pages

```bash
# Push to GitHub
git add .
git commit -m "Setup NotchNest website"
git push origin main

# Enable GitHub Pages
# Go to: Settings → Pages → Deploy from main branch
```

Your site will be live at: `https://[username].github.io/[repo-name]`

## 📋 Important URLs

Once deployed, your website will have these pages:

| Page | URL | Purpose |
|------|-----|---------|
| 🏠 **Homepage** | `/` | Main landing page with download buttons |
| 📰 **What's New** | `/whats-new.html` | Release notes from App Store |
| 📡 **Appcast Feed** | `/appcast.xml` | Sparkle update feed (for your macOS app) |
| 🐛 **Debug Viewer** | `/appcast-viewer.html` | Debug tool to inspect appcast |
| 📜 **Privacy** | `/privacy-policy.html` | Privacy policy page |

### Testing Your Appcast

**Debug URL:** `https://yourdomain.com/appcast-viewer.html`

This shows:
- Current version in appcast
- All historical versions
- Publication dates
- File sizes
- Minimum macOS requirements
- Raw XML content

## 🔄 Sparkle Integration

### For Your macOS App

Add this to your `Info.plist`:

```xml
<key>SUFeedURL</key>
<string>https://yourdomain.com/appcast.xml</string>
```

**Full Setup Guide:** [SPARKLE_SETUP.md](SPARKLE_SETUP.md)

### Appcast Features

✅ **Version History** - Maintains all previous versions (like Sparkle's sample)
✅ **Auto-Generated** - Fetches from App Store API every 6 hours
✅ **Sparkle 2.x Compatible** - Uses proper RSS 2.0 + Sparkle namespace
✅ **Embedded Release Notes** - Full HTML release notes in CDATA
✅ **No Manual Updates** - GitHub Actions handles everything

### Manual Appcast Generation

```bash
# Generate/update appcast manually
python3 scripts/generate_appcast.py

# Output shows:
# - Current version detected
# - Number of versions in history
# - File location
# - Sparkle compatibility status
```

## 🛠️ Configuration

### Update Frequency

Edit `.github/workflows/generate-appcast.yml`:

```yaml
schedule:
  # Every 6 hours (default)
  - cron: '0 */6 * * *'
  
  # Other options:
  # Every 12 hours: '0 */12 * * *'
  # Daily at midnight: '0 0 * * *'
  # Every 3 hours: '0 */3 * * *'
```

### Cache Duration

Update in HTML files (default: 5 minutes):

```javascript
const CACHE_DURATION = 5 * 60 * 1000; // milliseconds
```

### Website URLs

Update in `scripts/generate_appcast.py`:

```python
# Line 92, 110
ET.SubElement(channel, 'link').text = "https://your-domain.com"
```

## 🔐 Security & Privacy

### What This Repo Does NOT Contain

- ❌ No private API keys
- ❌ No EdDSA signing keys
- ❌ No authentication tokens
- ❌ No personal data
- ❌ No analytics tracking

### What's Public & Safe

- ✅ App Store ID (public info)
- ✅ Contact email (your choice)
- ✅ Website URLs (public)
- ✅ All source code (MIT licensed)

### App Store Distribution

Current setup points to **App Store updates**:
- Users update through Mac App Store
- Sparkle shows "What's New" notifications
- Clicking "Update" opens App Store
- No code signing keys needed

**For Direct Distribution:**
See [SPARKLE_SETUP.md](SPARKLE_SETUP.md#setting-up-direct-distribution-with-sparkle) for EdDSA signatures.

## 📝 Customization

### Required Changes

Before deploying, update these:

```bash
# 1. App Store ID (3 files)
grep -r "6747612321" . --include="*.html" --include="*.py"

# 2. Email addresses (multiple files)
grep -r "29satnam@gmail.com" . --include="*.html" --include="*.md"

# 3. Website URLs (Python script)
# Edit scripts/generate_appcast.py lines 92, 110
```

### Optional Changes

- **Product Hunt Button** - Update or remove in `index.html`
- **FAQ Section** - Customize questions/answers
- **Features List** - Update bullet points
- **Demo Video** - Replace `assets/notchnest-demo.mp4`
- **App Icon** - Auto-fetched from App Store (or add custom)
- **Privacy Policy** - Update with your app's practices

## 🧪 Testing Checklist

Before going live:

```bash
# ✅ Local testing
- [ ] Run generate_appcast.py successfully
- [ ] Verify appcast.xml has correct version
- [ ] Check appcast-viewer.html shows data
- [ ] Test all pages load (index, whats-new, privacy)
- [ ] Validate XML: xmllint --noout appcast.xml

# ✅ GitHub Pages
- [ ] Push to repository
- [ ] Enable GitHub Pages in settings
- [ ] Wait 2-3 minutes for deployment
- [ ] Visit live URL
- [ ] Check appcast.xml is accessible

# ✅ GitHub Actions
- [ ] Enable Actions in repository settings
- [ ] Grant "Read and write permissions"
- [ ] Manually trigger workflow once
- [ ] Verify appcast.xml was updated
- [ ] Check Actions tab for success status

# ✅ Sparkle Integration (in your app)
- [ ] Add Sparkle framework to Xcode
- [ ] Set SUFeedURL in Info.plist
- [ ] Build and run app
- [ ] Trigger "Check for Updates"
- [ ] Verify Sparkle reads appcast
- [ ] Check Console.app for logs
```

## 🐛 Troubleshooting

### Appcast Not Updating

**Check GitHub Actions:**
1. Go to Actions tab
2. View latest "Generate Appcast" run
3. Check for errors

**Test API manually:**
```bash
curl "https://itunes.apple.com/lookup?id=YOUR_APP_ID"
```

**Validate XML:**
```bash
xmllint --noout appcast.xml
# or
python3 -c "import xml.etree.ElementTree as ET; ET.parse('appcast.xml')"
```

### GitHub Actions Failing

**Permission Issues:**
- Settings → Actions → General
- Select "Read and write permissions"
- Save and re-run workflow

**Workflow Not Running:**
- Check Actions are enabled
- Verify YAML syntax
- Trigger manually to test

### Sparkle Not Working

**In Console.app, filter by your app name:**
```
# Look for Sparkle logs showing:
- "Checking for updates..."
- "Appcast loaded successfully"
- "Latest version: X.X.X"
```

**Common issues:**
- Wrong `SUFeedURL` in Info.plist
- Appcast XML not accessible (404)
- Invalid XML format
- Version comparison issues

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [QUICKSTART.md](QUICKSTART.md) | 10-minute setup guide |
| [SPARKLE_SETUP.md](SPARKLE_SETUP.md) | Complete Sparkle integration |
| [DEPLOYMENT.md](DEPLOYMENT.md) | Deployment & DNS setup |
| [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) | File organization |
| [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) | Technical details |

## 🔗 Useful Links

- **Live Demo**: https://notchnest.app
- **Sparkle Documentation**: https://sparkle-project.org/documentation/
- **iTunes API**: https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/iTuneSearchAPI/
- **GitHub Pages**: https://docs.github.com/en/pages

## 🎯 Next Steps After Setup

1. ✅ Deploy website to GitHub Pages
2. ✅ Verify all pages work
3. ✅ Check appcast-viewer.html shows correct data
4. ✅ Add Sparkle to your macOS app
5. ✅ Set SUFeedURL to your appcast URL
6. ✅ Test update checking in your app
7. ✅ Monitor GitHub Actions (first week)
8. ✅ Share your website URL!

## 💬 Support

Need help?

- 📖 Check documentation files in this repo
- 🐛 Open an issue on GitHub
- 📧 Email: your-email@example.com *(update this)*

## 📄 License

MIT License - feel free to use for your own projects!

## 🙏 Credits

Built for the macOS developer community. Inspired by Sparkle's excellent update framework.

---

**⚡ Quick Commands Reference**

```bash
# Generate appcast
python3 scripts/generate_appcast.py

# Test locally
python3 -m http.server 8000

# Validate XML
xmllint --noout appcast.xml

# Check versions
python3 -c "import xml.etree.ElementTree as ET; tree=ET.parse('appcast.xml'); print(f'Versions: {len(tree.findall(\".//item\"))}')"

# Trigger GitHub Action
gh workflow run generate-appcast.yml

# View workflow status
gh run list --workflow=generate-appcast.yml
```

**Made with ❤️ for macOS developers**
