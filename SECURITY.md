# Security Policy

## Public Repository Safety

This repository is safe to be public. All information contained is either:
- ✅ Public data (App Store ID, public URLs)
- ✅ Contact information (public email)
- ✅ Open-source code (MIT License)

## What's Included (Safe)

### Public Information
- **App Store ID**: `6747612321` - Public, anyone can see this on the App Store
- **Website URL**: `trynotchnest.silverseahog.com` - Public website
- **Contact Email**: `29satnam@gmail.com` - Public contact for support
- **App Name**: NotchNest - Public app name

### No Sensitive Data
This repository does **NOT** contain:
- ❌ Private API keys
- ❌ EdDSA signing keys (for app distribution)
- ❌ Authentication tokens
- ❌ Database credentials
- ❌ Personal data
- ❌ Financial information
- ❌ Analytics keys

## For Direct Distribution (Future)

If you plan to distribute your app directly (not through App Store), you'll need:

1. **EdDSA Key Pair** (for signing updates)
   - Generated with Sparkle's `generate_keys` tool
   - **Private key** → Store in GitHub Secrets (never commit!)
   - **Public key** → Add to `Info.plist` (safe to commit)

2. **GitHub Secrets** (for signing in CI/CD)
   - `SPARKLE_PRIVATE_KEY` → Your EdDSA private key
   - Never expose in logs or code

## Best Practices

### What You Should Change

Before deploying, replace these with your own:

```bash
# 1. App Store ID
find . -type f \( -name "*.html" -o -name "*.py" \) -exec grep -l "6747612321" {} \;

# 2. Contact email
find . -type f \( -name "*.html" -o -name "*.md" \) -exec grep -l "29satnam@gmail.com" {} \;

# 3. Website URL
grep -r "trynotchnest.silverseahog.com" scripts/
```

### GitHub Actions Tokens

The workflow uses GitHub's automatic token (`GITHUB_TOKEN`):
- ✅ Automatically provided by GitHub
- ✅ Scoped to repository only
- ✅ Expires after workflow completes
- ✅ No configuration needed

## Data Flow Security

### App Store API
- **Source**: Public iTunes Search API
- **Data**: Public app information
- **Authentication**: None required (public endpoint)
- **Rate Limit**: Reasonable usage (we cache for 5 minutes)

### GitHub Actions
- **Trigger**: Scheduled (every 6 hours) or manual
- **Access**: Read repo, write appcast.xml
- **Credentials**: GitHub's automatic token
- **Audit**: All runs logged in Actions tab

### User Data
- **Website**: No user data collected
- **Caching**: Uses browser localStorage (stays on user's device)
- **Analytics**: None by default (you can add if needed)
- **Cookies**: None used

## Reporting Security Issues

If you find a security vulnerability:

1. **Do NOT** open a public issue
2. Email: 29satnam@gmail.com
3. Include:
   - Description of vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

We'll respond within 48 hours.

## App Store Guidelines

This repository helps you create a website for your Mac App Store app. Ensure your app complies with:

- [Apple's App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Apple's Privacy Policy Requirements](https://developer.apple.com/privacy/)
- Your local laws and regulations

## Updates & Maintenance

### Dependency Security

This project has minimal dependencies:
- **Python**: Standard library only (except `requests` for API calls)
- **JavaScript**: jQuery from CDN (update URL if needed)
- **GitHub Actions**: Official actions from GitHub and Python

### Keeping Dependencies Updated

```bash
# Update Python packages
pip install --upgrade requests

# Check for GitHub Actions updates
# Visit: https://github.com/actions
```

## License

This project is MIT licensed. You're free to:
- ✅ Use commercially
- ✅ Modify
- ✅ Distribute
- ✅ Private use

See [LICENSE](LICENSE) for full details.

---

**Last Updated**: January 30, 2026
**Maintainer**: NotchNest Team
**Contact**: 29satnam@gmail.com
