# NotchNest Sparkle Update System

This project includes an automated system to generate a Sparkle-compatible `appcast.xml` file that stays in sync with the App Store version data.

## Overview

The system consists of:
1. **What's New Page** (`whats-new.html`) - Displays release notes to users
2. **Appcast Generator** (`scripts/generate_appcast.py`) - Python script that fetches App Store data and generates `appcast.xml`
3. **GitHub Action** (`.github/workflows/generate-appcast.yml`) - Automatically updates the appcast every 6 hours

## How It Works

### Automatic Updates

The GitHub Action runs automatically:
- **Every 6 hours** via scheduled cron job
- **On push** to main branch (if workflow files change)
- **Manually** via GitHub Actions UI

When the action runs:
1. Fetches latest app data from iTunes API
2. Generates a new `appcast.xml` file
3. Commits and pushes changes if the version has updated

### Sparkle Integration

To integrate this with your NotchNest macOS app using Sparkle:

#### 1. Add Sparkle to Your Xcode Project

Follow the [Sparkle documentation](https://sparkle-project.org/documentation/) to add the framework.

**Via Swift Package Manager:**
```
https://github.com/sparkle-project/Sparkle
```

#### 2. Configure Your Info.plist

Add the `SUFeedURL` key pointing to your appcast:

```xml
<key>SUFeedURL</key>
<string>https://trynotchnest.silverseahog.com/appcast.xml</string>
```

Optional but recommended settings:

```xml
<!-- Automatically check for updates -->
<key>SUEnableAutomaticChecks</key>
<true/>

<!-- Check every 24 hours (86400 seconds) -->
<key>SUScheduledCheckInterval</key>
<integer>86400</integer>

<!-- Show release notes -->
<key>SUShowReleaseNotes</key>
<true/>

<!-- Public EdDSA key (if you add signing later) -->
<key>SUPublicEDKey</key>
<string>YOUR_PUBLIC_KEY_HERE</string>
```

#### 3. Initialize Sparkle in Your App

**Swift:**
```swift
import Sparkle

@main
struct NotchNestApp: App {
    private let updaterController: SPUStandardUpdaterController
    
    init() {
        updaterController = SPUStandardUpdaterController(
            startingUpdater: true,
            updaterDelegate: nil,
            userDriverDelegate: nil
        )
    }
    
    var body: some Scene {
        // Your app scenes
    }
}
```

**Objective-C:**
```objc
#import <Sparkle/Sparkle.h>

- (void)applicationDidFinishLaunching:(NSNotification *)notification {
    SPUStandardUpdaterController *updaterController = 
        [[SPUStandardUpdaterController alloc] initWithStartingUpdater:YES 
                                                       updaterDelegate:nil 
                                                  userDriverDelegate:nil];
}
```

#### 4. Add Check for Updates Menu Item

In your main menu, add:

```swift
Menu("Help") {
    Button("Check for Updates...") {
        updaterController.checkForUpdates(nil)
    }
}
```

## Important Notes for App Store Distribution

### Mixed Distribution Strategy

If your app is distributed through **both** the App Store and direct download:

1. **App Store Version**: Users will update through the App Store (Sparkle is not needed)
2. **Direct Distribution**: Use Sparkle for updates with signed .dmg/.zip files

For App Store-only distribution, Sparkle can still:
- Show "What's New" notifications
- Display release notes
- Link users to the App Store for updates (current setup)

### Setting Up Direct Distribution with Sparkle

If you want to distribute directly outside the App Store:

1. **Generate EdDSA Keys:**
   ```bash
   ./Sparkle.framework/Resources/bin/generate_keys
   ```

2. **Store the private key securely** (e.g., GitHub Secrets)

3. **Build and sign your app** with your Developer ID

4. **Create a .dmg or .zip** of your app

5. **Sign the update:**
   ```bash
   ./Sparkle.framework/Resources/bin/sign_update YourApp.dmg
   ```

6. **Update the Python script** to include:
   - Real download URL (e.g., GitHub releases)
   - EdDSA signature
   - Proper file size

### Version History

The appcast generator automatically maintains a complete version history:
- **All versions are preserved** - New versions are added to the top
- **Existing versions are kept** - Script loads and merges history
- **Sparkle compatible** - Format matches Sparkle's sample appcast
- **Automatic updates** - GitHub Action preserves history on every run

Just like Sparkle's official sample, users can see all available versions when checking for updates.

### Current Setup (App Store)

The current `appcast.xml` points to the App Store link. This means:
- Sparkle will show a notification about the new version
- Clicking "Update" will open the App Store
- Users update through the App Store, not Sparkle

## Manual Generation

To manually regenerate the appcast:

```bash
cd /path/to/trynotchnest.github
python3 scripts/generate_appcast.py
```

Or trigger the GitHub Action manually:
1. Go to your GitHub repository
2. Click on "Actions" tab
3. Select "Generate Appcast" workflow
4. Click "Run workflow"

## Customization

### Change Update Frequency

Edit `.github/workflows/generate-appcast.yml`:

```yaml
schedule:
  # Run every 12 hours instead of 6
  - cron: '0 */12 * * *'
```

### Modify Appcast Format

Edit `scripts/generate_appcast.py` to customize:
- Release notes formatting
- Additional Sparkle tags
- Download URLs
- Signatures

## Testing

### Test the Appcast Locally

1. Generate the appcast:
   ```bash
   python3 scripts/generate_appcast.py
   ```

2. Validate the XML:
   ```bash
   xmllint --noout appcast.xml
   ```

3. View in browser:
   ```
   file:///path/to/appcast.xml
   ```

### Test Sparkle Integration

1. Set `SUFeedURL` to your local or staging appcast
2. Lower the `SUScheduledCheckInterval` for faster testing
3. Run your app and trigger update check

## Resources

- [Sparkle Documentation](https://sparkle-project.org/documentation/)
- [Sparkle GitHub](https://github.com/sparkle-project/Sparkle)
- [iTunes Search API](https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/iTuneSearchAPI/)

## Troubleshooting

### GitHub Action Not Running

- Check that the repository has Actions enabled
- Verify the cron schedule syntax
- Check the Actions tab for error logs

### Appcast Not Updating

- Verify the App Store API returns data: `https://itunes.apple.com/lookup?id=6747612321`
- Check Python script output for errors
- Ensure GitHub Actions bot has write permissions

### Sparkle Not Checking for Updates

- Verify `SUFeedURL` is correct in Info.plist
- Check Console.app for Sparkle logs
- Ensure the app is properly signed
- Test with `SUScheduledCheckInterval` set to a low value (e.g., 60 seconds)

## Contact

For questions or issues:
- Email: 29satnam@gmail.com
- GitHub Issues: [Create an issue](https://github.com/yourusername/trynotchnest.github/issues)
