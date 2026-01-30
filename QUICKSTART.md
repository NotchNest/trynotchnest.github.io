# 🚀 Quick Start Guide

Get your NotchNest website with Sparkle updates running in 10 minutes!

## Step 1: Update Your App Store ID (2 minutes)

Find and replace `6747612321` with your App Store ID in these 3 files:

1. **`index.html`** - Line ~210
2. **`whats-new.html`** - Line ~161  
3. **`scripts/generate_appcast.py`** - Line ~9

**How to find your App Store ID:**
Look at your App Store URL: `https://apps.apple.com/app/id[YOUR-NUMBER]`

## Step 2: Generate Your Appcast (1 minute)

```bash
cd /path/to/trynotchnest.github
python3 scripts/generate_appcast.py
```

You should see:
```
✓ Appcast generated successfully!
  Version: X.X.X
  File: appcast.xml
```

## Step 3: Push to GitHub (2 minutes)

```bash
git add .
git commit -m "Setup NotchNest website with Sparkle"
git push origin main
```

## Step 4: Enable GitHub Pages (2 minutes)

1. Go to your repo → **Settings** → **Pages**
2. Source: **Deploy from a branch**
3. Branch: **main** / **root**
4. Click **Save**

## Step 5: Enable GitHub Actions (1 minute)

1. Go to **Settings** → **Actions** → **General**
2. Workflow permissions: **Read and write permissions**
3. Click **Save**

## Step 6: Test Everything (2 minutes)

Visit these URLs (replace with your domain):

- ✅ Main page: `https://[username].github.io/[repo]/`
- ✅ What's New: `https://[username].github.io/[repo]/whats-new.html`
- ✅ Appcast: `https://[username].github.io/[repo]/appcast.xml`

## That's It! 🎉

Your website is now live with:
- ✅ Auto-updating appcast for Sparkle
- ✅ Beautiful What's New page
- ✅ App Store integration
- ✅ GitHub Actions automation

## Next Steps

1. **Add Sparkle to your app** - See [SPARKLE_SETUP.md](SPARKLE_SETUP.md)
2. **Customize content** - Update FAQ, features, etc.
3. **Add custom domain** - See [DEPLOYMENT.md](DEPLOYMENT.md)

## Need Help?

- 📖 Full documentation: [README.md](README.md)
- 🔧 Deployment guide: [DEPLOYMENT.md](DEPLOYMENT.md)
- 💬 Email: 29satnam@gmail.com

---

**Total Time:** ~10 minutes | **Difficulty:** Easy ⭐
