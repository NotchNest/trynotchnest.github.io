# NotchNest Website Deployment Guide

This guide will help you deploy your NotchNest website with the complete Sparkle update system.

## 📋 Pre-Deployment Checklist

### 1. Update App Store ID

Update the App Store ID in **all** these files:

**`index.html`** (line ~210):
```javascript
const APP_ID = "6747612321";  // Change to your App Store ID
```

**`whats-new.html`** (line ~161):
```javascript
const APP_ID = "6747612321";  // Change to your App Store ID
```

**`scripts/generate_appcast.py`** (line ~9):
```python
APP_ID = "6747612321"  # Change to your App Store ID
```

### 2. Update Website URLs

**`scripts/generate_appcast.py`** (line ~12-13):
```python
# Update if you're hosting downloads elsewhere
DOWNLOAD_BASE_URL = "https://github.com/yourusername/notchnest/releases/download"
```

**`scripts/generate_appcast.py`** (line ~98, 103):
```python
ET.SubElement(channel, 'link').text = "https://trynotchnest.silverseahog.com"
# and
ET.SubElement(item, 'link').text = "https://trynotchnest.silverseahog.com"
```

### 3. Update Contact Information

Replace email in:
- `index.html`
- `whats-new.html`
- `privacy-policy.html`
- `SPARKLE_SETUP.md`

## 🚀 Deployment Steps

### Step 1: Push to GitHub

```bash
cd /path/to/trynotchnest.github
git add .
git commit -m "Add Sparkle appcast system and What's New page"
git push origin main
```

### Step 2: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under "Build and deployment":
   - Source: **Deploy from a branch**
   - Branch: **main** / **root**
4. Click **Save**
5. Wait 2-3 minutes for deployment

Your site will be at: `https://[username].github.io/[repo-name]`

### Step 3: Enable GitHub Actions

1. Go to **Settings** → **Actions** → **General**
2. Under "Actions permissions": Select **Allow all actions and reusable workflows**
3. Under "Workflow permissions": Select **Read and write permissions**
4. Click **Save**

### Step 4: Manually Trigger First Appcast Generation

1. Go to **Actions** tab
2. Select **Generate Appcast** workflow
3. Click **Run workflow** → **Run workflow**
4. Wait for it to complete (should take ~30 seconds)
5. Check that `appcast.xml` was updated in your repository

### Step 5: Verify Deployment

Visit these URLs and verify they work:

- Main page: `https://yourdomain.com/`
- What's New: `https://yourdomain.com/whats-new.html`
- Appcast: `https://yourdomain.com/appcast.xml`
- Appcast Viewer: `https://yourdomain.com/appcast-viewer.html` (debug tool)
- Privacy Policy: `https://yourdomain.com/privacy-policy.html`

## 🔧 Custom Domain Setup (Optional)

If you're using a custom domain like `trynotchnest.silverseahog.com`:

### Step 1: Configure GitHub Pages

1. Go to **Settings** → **Pages**
2. Under "Custom domain", enter: `trynotchnest.silverseahog.com`
3. Check **Enforce HTTPS** (after DNS propagates)
4. Click **Save**

### Step 2: Configure DNS

Add these DNS records at your domain provider:

**For subdomain (trynotchnest.silverseahog.com):**
```
Type: CNAME
Name: trynotchnest
Value: [your-github-username].github.io
TTL: 3600
```

**For apex domain (silverseahog.com):**
```
Type: A
Name: @
Value: 185.199.108.153
TTL: 3600

Type: A
Name: @
Value: 185.199.109.153

Type: A
Name: @
Value: 185.199.110.153

Type: A
Name: @
Value: 185.199.111.153
```

### Step 3: Update Appcast URL

After custom domain is working, update the appcast URL in your macOS app's `Info.plist`:

```xml
<key>SUFeedURL</key>
<string>https://trynotchnest.silverseahog.com/appcast.xml</string>
```

## 🔄 Ongoing Maintenance

### Automatic Updates

The GitHub Action will automatically:
- Run every 6 hours
- Check for new App Store versions
- Update `appcast.xml` if version changed
- Commit and push changes

### Manual Updates

To manually update the appcast:

**Option 1: Via GitHub UI**
1. Go to **Actions** tab
2. Select **Generate Appcast**
3. Click **Run workflow**

**Option 2: Via Command Line**
```bash
cd /path/to/repo
python3 scripts/generate_appcast.py
git add appcast.xml
git commit -m "Update appcast"
git push
```

### Monitoring

Check that everything is working:
1. Visit `appcast-viewer.html` to see current version
2. Check **Actions** tab for workflow status
3. Monitor your app's Sparkle update checks in Console.app

## 🐛 Troubleshooting

### Appcast Not Updating

**Check the workflow logs:**
1. Go to **Actions** tab
2. Click on the latest "Generate Appcast" run
3. Review the logs for errors

**Common issues:**
- iTunes API is down or slow
- App Store ID is incorrect
- Python dependencies missing (shouldn't happen with GitHub Actions)

**Quick fix:**
```bash
# Test locally
python3 scripts/generate_appcast.py

# Check iTunes API directly
curl "https://itunes.apple.com/lookup?id=6747612321"
```

### GitHub Actions Failing

**Permission error:**
- Go to Settings → Actions → General
- Select "Read and write permissions"
- Save and re-run workflow

**Workflow not running:**
- Ensure Actions are enabled in repository settings
- Check that the workflow file is in `.github/workflows/`
- Verify YAML syntax is correct

### Website Not Loading

**GitHub Pages not enabled:**
- Check Settings → Pages
- Ensure source is set to main branch

**Custom domain not working:**
- Verify DNS settings
- Wait 24-48 hours for DNS propagation
- Check CNAME file in repository

**App Store data not loading:**
- Check browser console for errors
- Verify App Store ID is correct
- Test API directly: `https://itunes.apple.com/lookup?id=YOUR_ID`

## 📱 Testing

### Local Testing

```bash
# Start a local server
python3 -m http.server 8000

# Visit in browser
open http://localhost:8000
```

Test these pages:
- `http://localhost:8000/` - Main page
- `http://localhost:8000/whats-new.html` - Release notes
- `http://localhost:8000/appcast.xml` - Appcast feed
- `http://localhost:8000/appcast-viewer.html` - Debug viewer

### Sparkle Testing in Your App

1. Set `SUFeedURL` in Info.plist to your deployed appcast URL
2. Set `SUScheduledCheckInterval` to `60` (1 minute) for testing
3. Run your app and trigger "Check for Updates"
4. Watch Console.app for Sparkle logs
5. Filter logs by your app name to see Sparkle activity

## 📊 Analytics (Optional)

To add analytics:

### Google Analytics

Add to `<head>` in all HTML files:
```html
<!-- Global site tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Plausible Analytics (Privacy-friendly)

Add to `<head>`:
```html
<script defer data-domain="yourdomain.com" src="https://plausible.io/js/script.js"></script>
```

## 🔐 Security Best Practices

1. **Enable HTTPS**: Always enforce HTTPS in GitHub Pages settings
2. **Review commits**: Monitor what the GitHub Action commits
3. **Keep dependencies updated**: Regularly update Python packages
4. **Validate input**: The script validates App Store API responses
5. **Use secure CDNs**: jQuery and fonts are loaded from official CDNs

## 📚 Additional Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Sparkle Documentation](https://sparkle-project.org/documentation/)
- [iTunes Search API](https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/iTuneSearchAPI/)

## 🎉 Post-Deployment

After successful deployment:

1. ✅ Test all pages on mobile and desktop
2. ✅ Verify appcast.xml is accessible
3. ✅ Confirm "What's New" button works
4. ✅ Test Sparkle integration in your app
5. ✅ Share your website URL
6. ✅ Monitor GitHub Actions for the first week
7. ✅ Update your App Store description with the website link

---

**Questions?** Contact: 29satnam@gmail.com
