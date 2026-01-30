# NotchNest Project Structure

```
trynotchnest.github/
│
├── 📄 index.html                    # Main landing page ⭐ MODIFIED
│   └── Added "What's New" button
│
├── 📄 whats-new.html                # Release notes page ✨ NEW
│   ├── Displays version history
│   ├── Fetches from App Store API
│   └── Beautiful card layout
│
├── 📄 privacy-policy.html           # Privacy policy page
│
├── 📄 appcast.xml                   # Sparkle update feed ✨ NEW
│   ├── Auto-generated from App Store
│   ├── RSS 2.0 + Sparkle extensions
│   └── Updated every 6 hours
│
├── 📄 appcast-viewer.html           # Debug tool ✨ NEW
│   ├── View appcast details
│   └── Parse and display XML
│
├── 🎨 styles.css                    # Main stylesheet
├── 📜 script.js                     # JavaScript utilities
│
├── 📁 scripts/                      # Python scripts ✨ NEW
│   └── 🐍 generate_appcast.py      # Appcast generator
│       ├── Fetches App Store data
│       ├── Parses release notes
│       └── Generates XML
│
├── 📁 .github/workflows/            # GitHub Actions ✨ NEW
│   ├── 📋 generate-appcast.yml     # Auto-update workflow
│   │   ├── Runs every 6 hours
│   │   ├── Checks for new versions
│   │   └── Commits updates
│   └── 📖 README.md                # Workflow documentation
│
├── 📁 assets/                       # Static assets
│   ├── 🖼️ notchnest-icon.png
│   ├── 🎬 notchnest-demo.mp4
│   ├── 📸 notchnest-settings.png
│   ├── 🌧️ rain.gif
│   └── 📥 download-appstore.svg
│
├── 📚 Documentation/                # All docs ✨ NEW
│   ├── 📖 README.md                # Main documentation ⭐ UPDATED
│   ├── 🚀 QUICKSTART.md            # 10-minute setup guide
│   ├── 🔧 DEPLOYMENT.md            # Deployment instructions
│   ├── ⚡ SPARKLE_SETUP.md         # Sparkle integration guide
│   ├── 📋 IMPLEMENTATION_SUMMARY.md # This implementation
│   └── 📐 PROJECT_STRUCTURE.md     # This file
│
├── ⚙️ Configuration Files/
│   ├── 📝 _config.yml              # Jekyll config
│   ├── 🚫 .gitignore               # Git ignore ⭐ UPDATED
│   ├── 📦 Gemfile                  # Ruby dependencies
│   ├── 🌐 CNAME                    # Custom domain
│   ├── 📄 .nojekyll                # Jekyll override
│   └── 🖼️ favicon.ico              # Site favicon
│
└── 🔐 Other Files/
    └── 📜 README.md (you're here)

Legend:
✨ NEW      - Newly created file
⭐ MODIFIED - Modified existing file
📄 HTML    - Web pages
🐍 Python  - Python scripts
📋 YAML    - Configuration
📚 Docs    - Documentation
🎨 CSS     - Stylesheets
📜 JS      - JavaScript
```

## Key Features by File

### 🌐 Web Pages

| File | Purpose | Status |
|------|---------|--------|
| `index.html` | Main landing page with hero, features, FAQ | ⭐ Modified |
| `whats-new.html` | Display release notes from App Store | ✨ New |
| `privacy-policy.html` | Privacy policy page | Existing |
| `appcast-viewer.html` | Debug tool to view appcast | ✨ New |

### 🔄 Update System

| File | Purpose | Update Freq |
|------|---------|-------------|
| `appcast.xml` | Sparkle feed for app updates | Every 6 hours |
| `scripts/generate_appcast.py` | Generate appcast from API | On-demand |
| `.github/workflows/generate-appcast.yml` | Automation | Scheduled |

### 📚 Documentation

| File | Description | Audience |
|------|-------------|----------|
| `README.md` | Main project documentation | Everyone |
| `QUICKSTART.md` | Fast 10-minute setup | Quick setup |
| `DEPLOYMENT.md` | Full deployment guide | Deployment |
| `SPARKLE_SETUP.md` | Sparkle integration | Developers |
| `IMPLEMENTATION_SUMMARY.md` | What was built | Reference |
| `PROJECT_STRUCTURE.md` | This file | Navigation |

## File Relationships

```
User visits website
    ↓
┌─────────────────────────────────┐
│ index.html                      │
│ - Main page                     │
│ - App Store integration         │
│ - "What's New" button ✨        │
└─────────────────────────────────┘
    │
    │ Click "What's New"
    ↓
┌─────────────────────────────────┐
│ whats-new.html ✨               │
│ - Fetches App Store API         │
│ - Shows release notes           │
│ - Caches for 5 minutes          │
└─────────────────────────────────┘

GitHub Actions (every 6 hours)
    ↓
┌─────────────────────────────────┐
│ generate-appcast.yml ✨         │
│ - Runs Python script            │
│ - Checks for updates            │
│ - Commits if changed            │
└─────────────────────────────────┘
    │
    │ Executes
    ↓
┌─────────────────────────────────┐
│ generate_appcast.py ✨          │
│ - Fetch App Store data          │
│ - Parse release notes           │
│ - Generate XML                  │
└─────────────────────────────────┘
    │
    │ Outputs
    ↓
┌─────────────────────────────────┐
│ appcast.xml ✨                  │
│ - RSS 2.0 + Sparkle             │
│ - Version info                  │
│ - Release notes                 │
└─────────────────────────────────┘
    │
    │ Read by
    ↓
┌─────────────────────────────────┐
│ Your macOS App (Sparkle)        │
│ - Checks for updates            │
│ - Shows notification            │
│ - Links to App Store            │
└─────────────────────────────────┘
```

## Data Flow

### App Store → Website
```
iTunes API
    ↓
[index.html fetches]
    ↓
Display: name, icon, description, version
```

### App Store → Appcast
```
iTunes API
    ↓
[Python script fetches]
    ↓
[Parse & format]
    ↓
appcast.xml
    ↓
[Sparkle reads]
    ↓
Your macOS app
```

### User → Release Notes
```
User clicks "What's New"
    ↓
whats-new.html loads
    ↓
Check localStorage cache
    ↓
If expired: Fetch App Store API
    ↓
Display release notes
```

## URLs Structure

When deployed to GitHub Pages:

```
https://trynotchnest.silverseahog.com/
├── /                           → index.html
├── /whats-new.html            → Release notes page
├── /appcast.xml               → Sparkle feed
├── /appcast-viewer.html       → Debug tool
├── /privacy-policy.html       → Privacy policy
├── /assets/*                  → Static files
└── /scripts/*                 → Not accessible (no directory listing)
```

## Size Information

| Category | Files | Total Size |
|----------|-------|------------|
| HTML Pages | 4 | ~60 KB |
| Documentation | 6 | ~45 KB |
| Python Scripts | 1 | ~7 KB |
| Workflows | 1 | ~1.5 KB |
| Stylesheets | 1 | ~25 KB |
| JavaScript | 1 | ~12 KB |
| Assets | ~5 | ~10 MB |
| **Total** | **~20** | **~10.2 MB** |

## Dependency Tree

```
📦 NotchNest Website
│
├── 🌐 Runtime Dependencies
│   ├── jQuery 3.1.0 (CDN)
│   ├── Google Fonts (Inter)
│   └── iTunes API
│
├── 🐍 Python Dependencies
│   └── requests
│
├── 🚀 GitHub Actions
│   ├── Python 3.11
│   ├── actions/checkout@v4
│   └── actions/setup-python@v5
│
└── 📱 App Integration
    └── Sparkle framework (in your macOS app)
```

## Modification Checklist

When customizing for your app:

- [ ] `index.html` - Update APP_ID (line ~210)
- [ ] `whats-new.html` - Update APP_ID (line ~161)
- [ ] `scripts/generate_appcast.py` - Update APP_ID (line ~9)
- [ ] `scripts/generate_appcast.py` - Update website URLs
- [ ] All HTML files - Update email addresses
- [ ] `index.html` - Update Product Hunt link
- [ ] `README.md` - Update repository references
- [ ] Documentation - Update contact information

## Quick Navigation

| Need to... | Go to... |
|------------|----------|
| Get started quickly | `QUICKSTART.md` |
| Learn about Sparkle | `SPARKLE_SETUP.md` |
| Deploy the website | `DEPLOYMENT.md` |
| Understand implementation | `IMPLEMENTATION_SUMMARY.md` |
| View project overview | `README.md` |
| See this structure | `PROJECT_STRUCTURE.md` |
| Debug GitHub Actions | `.github/workflows/README.md` |

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Jan 30, 2026 | Initial implementation |
| | | - Added What's New page |
| | | - Added appcast.xml generation |
| | | - Added GitHub Actions automation |
| | | - Added documentation |

---

**Last Updated:** January 30, 2026
**Status:** ✅ Complete and Production Ready
