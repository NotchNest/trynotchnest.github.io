# GitHub Actions Workflows

## Generate Appcast Workflow

This workflow automatically generates the Sparkle-compatible `appcast.xml` file by fetching the latest version information from the App Store.

### Trigger Schedule

The workflow runs:
- **Every 6 hours** (at 00:00, 06:00, 12:00, 18:00 UTC)
- **On push** to main branch (when workflow files change)
- **Manually** via GitHub UI

### Manual Trigger

To manually trigger the workflow:

1. Go to your repository on GitHub
2. Click on the **Actions** tab
3. Select **Generate Appcast** from the workflows list
4. Click **Run workflow** button
5. Select the branch (usually `main`)
6. Click **Run workflow**

### How It Works

1. Checks out the repository
2. Sets up Python 3.11
3. Installs required Python packages (`requests`)
4. Runs `scripts/generate_appcast.py` to fetch App Store data and generate `appcast.xml`
5. Checks if the appcast has changed
6. If changed, commits and pushes the updated `appcast.xml` to the repository

### Permissions

The workflow requires:
- **contents: write** - To commit and push the updated appcast.xml

This is already configured in the workflow file.

### Troubleshooting

#### Workflow Not Running

- **Check Actions are enabled**: Go to Settings → Actions → General → Allow all actions
- **Verify cron syntax**: The schedule uses standard cron syntax
- **Check logs**: Click on a workflow run to see detailed logs

#### Appcast Not Updating

- **API Issues**: Check if iTunes API is accessible: `https://itunes.apple.com/lookup?id=6747612321`
- **Script Errors**: Review the Python script output in the workflow logs
- **Git Conflicts**: Ensure no merge conflicts in the appcast.xml file

#### Permission Denied

If you get permission errors:
1. Go to Settings → Actions → General
2. Scroll to "Workflow permissions"
3. Select "Read and write permissions"
4. Click Save

### Customization

#### Change Update Frequency

To change how often the appcast updates, edit the cron schedule in `generate-appcast.yml`:

```yaml
schedule:
  # Every 12 hours
  - cron: '0 */12 * * *'
  
  # Every day at midnight
  - cron: '0 0 * * *'
  
  # Every 3 hours
  - cron: '0 */3 * * *'
```

Cron syntax: `minute hour day month weekday`

#### Modify Python Script

To customize the appcast generation, edit `scripts/generate_appcast.py`:

- Change the appcast format
- Add additional metadata
- Modify release notes parsing
- Add EdDSA signatures (for direct distribution)

### Monitoring

You can monitor workflow runs:
1. Go to the **Actions** tab
2. View recent runs and their status
3. Click on a run to see detailed logs
4. Set up notifications in your GitHub profile settings

### Local Testing

Test the workflow locally:

```bash
# Install dependencies
pip install requests

# Run the script
python3 scripts/generate_appcast.py

# Verify the output
cat appcast.xml
```

### Notes

- The workflow uses GitHub's automatic token authentication
- Commits are made by "GitHub Actions Bot"
- The appcast.xml will only be committed if it has actually changed
- Old workflow runs are automatically cleaned up after 90 days
