# Followw Deployment & Distribution Guide

This guide explains how to build, sign, and distribute Followw to end users.

## Prerequisites

### All Platforms
- Node.js 18+ installed
- Git installed
- Project cloned and dependencies installed

### Platform-Specific Requirements

**Windows**:
- Windows 10/11 or Windows Server
- (Optional) Code signing certificate for SmartScreen

**macOS**:
- macOS 10.15+ (Catalina or later)
- Xcode Command Line Tools
- (Optional) Apple Developer ID for code signing

**Linux**:
- Ubuntu 20.04+ or equivalent
- build-essential package

## Building

### 1. Install Dependencies

```bash
cd followw-app
npm install
```

### 2. Build for Specific Platform

**Windows** (from Windows or Linux/Mac with Wine):
```bash
npm run build:win
```

Output: `dist/Followw-Setup-1.0.0.exe`

**macOS** (from macOS only):
```bash
npm run build:mac
```

Output: `dist/Followw-1.0.0.dmg`

**Linux**:
```bash
npm run build:linux
```

Output: `dist/Followw-1.0.0.AppImage`

**All Platforms** (from any OS with proper tools):
```bash
npm run build:all
```

## Code Signing

### Windows Code Signing

1. **Obtain Certificate**:
   - Purchase from DigiCert, Sectigo, or similar
   - Cost: ~$200-500/year

2. **Configure electron-builder**:

```json
// package.json
"build": {
  "win": {
    "certificateFile": "path/to/certificate.pfx",
    "certificatePassword": "your-password",
    "signAndEditExecutable": true
  }
}
```

3. **Build with Signing**:
```bash
npm run build:win
```

4. **Verify**:
```powershell
signtool verify /pa dist/Followw-Setup-1.0.0.exe
```

### macOS Code Signing & Notarization

1. **Join Apple Developer Program**:
   - Cost: $99/year
   - Get Developer ID certificate

2. **Configure**:

```json
// package.json
"build": {
  "mac": {
    "identity": "Developer ID Application: Your Name (TEAM_ID)",
    "hardenedRuntime": true,
    "gatekeeperAssess": false,
    "entitlements": "build/entitlements.mac.plist",
    "entitlementsInherit": "build/entitlements.mac.plist"
  }
}
```

3. **Create Entitlements File**:

```xml
<!-- build/entitlements.mac.plist -->
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>com.apple.security.cs.allow-jit</key>
    <true/>
    <key>com.apple.security.cs.allow-unsigned-executable-memory</key>
    <true/>
    <key>com.apple.security.cs.disable-library-validation</key>
    <true/>
</dict>
</plist>
```

4. **Build & Notarize**:
```bash
# Build
npm run build:mac

# Notarize (requires Xcode installed)
xcrun notarytool submit dist/Followw-1.0.0.dmg \
  --apple-id "your@email.com" \
  --team-id "TEAM_ID" \
  --password "app-specific-password" \
  --wait

# Staple
xcrun stapler staple dist/Followw-1.0.0.dmg
```

### Linux

No code signing required for Linux distributions.

## GitHub Releases Distribution

### 1. Create Release on GitHub

```bash
# Create tag
git tag v1.0.0
git push origin v1.0.0

# Or use GitHub web interface
# Releases → Create new release
```

### 2. Upload Built Files

Upload these files to the release:

- `Followw-Setup-1.0.0.exe` (Windows)
- `Followw-1.0.0.dmg` (macOS)
- `Followw-1.0.0.AppImage` (Linux)
- `latest.yml` (auto-update metadata - Windows)
- `latest-mac.yml` (auto-update metadata - macOS)
- `latest-linux.yml` (auto-update metadata - Linux)

### 3. Configure Auto-Update

electron-builder automatically generates `latest.yml` files.

**In your app**:
```javascript
// main process
const { autoUpdater } = require('electron-updater');

app.on('ready', () => {
  autoUpdater.checkForUpdatesAndNotify();
});
```

## Alternative Hosting

### Self-Hosted Server

1. **Upload Files**:
```bash
scp dist/Followw-*.* user@yourserver.com:/var/www/downloads/
```

2. **Configure electron-builder**:
```json
// package.json
"build": {
  "publish": {
    "provider": "generic",
    "url": "https://yourserver.com/downloads"
  }
}
```

3. **Directory Structure**:
```
/var/www/downloads/
├── Followw-Setup-1.0.0.exe
├── Followw-1.0.0.dmg
├── Followw-1.0.0.AppImage
├── latest.yml
├── latest-mac.yml
└── latest-linux.yml
```

4. **CORS Headers** (if serving from different domain):
```nginx
# nginx.conf
location /downloads {
    add_header Access-Control-Allow-Origin *;
    add_header Access-Control-Allow-Methods GET;
}
```

### AWS S3

1. **Upload to S3**:
```bash
aws s3 sync dist/ s3://your-bucket/releases/1.0.0/
```

2. **Configure**:
```json
// package.json
"build": {
  "publish": {
    "provider": "s3",
    "bucket": "your-bucket",
    "path": "releases"
  }
}
```

### Microsoft Store (Windows)

1. Create Microsoft Partner Center account
2. Package as MSIX
3. Submit for review
4. ~3-5 days approval time

### Mac App Store

1. Join Apple Developer Program
2. Configure for Mac App Store:
```json
"build": {
  "mac": {
    "target": "mas"
  }
}
```
3. Submit via App Store Connect
4. ~2-7 days review time

## Continuous Integration

### GitHub Actions

Create `.github/workflows/build.yml`:

```yaml
name: Build and Release

on:
  push:
    tags:
      - 'v*'

jobs:
  build:
    strategy:
      matrix:
        os: [macos-latest, ubuntu-latest, windows-latest]

    runs-on: ${{ matrix.os }}

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18

      - name: Install dependencies
        run: |
          cd followw-app
          npm install

      - name: Build
        run: |
          cd followw-app
          npm run package

      - name: Upload artifacts
        uses: actions/upload-artifact@v3
        with:
          name: ${{ matrix.os }}-build
          path: followw-app/dist/*

      - name: Release
        uses: softprops/action-gh-release@v1
        if: startsWith(github.ref, 'refs/tags/')
        with:
          files: followw-app/dist/*
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## Testing Installations

### Windows
```powershell
# Install
.\Followw-Setup-1.0.0.exe /S

# Test
Start-Process "C:\Program Files\Followw\Followw.exe"

# Uninstall
& "C:\Program Files\Followw\Uninstall Followw.exe" /S
```

### macOS
```bash
# Mount and test
hdiutil attach Followw-1.0.0.dmg
open /Volumes/Followw/Followw.app

# Verify code signing
codesign -vv /Volumes/Followw/Followw.app

# Test launch
/Volumes/Followw/Followw.app/Contents/MacOS/Followw

# Cleanup
hdiutil detach /Volumes/Followw
```

### Linux
```bash
# Make executable
chmod +x Followw-1.0.0.AppImage

# Test
./Followw-1.0.0.AppImage

# Install to system (optional)
./Followw-1.0.0.AppImage --appimage-extract
sudo mv squashfs-root /opt/followw
sudo ln -s /opt/followw/followw /usr/local/bin/followw
```

## Update Process

### 1. Version Bump

```bash
# Update version in package.json
npm version patch  # 1.0.0 → 1.0.1
npm version minor  # 1.0.0 → 1.1.0
npm version major  # 1.0.0 → 2.0.0
```

### 2. Build New Version

```bash
npm run build:all
```

### 3. Create GitHub Release

```bash
git push origin v1.0.1
```

Upload new builds to GitHub release.

### 4. Auto-Update Triggers

When users launch the app:
1. App checks GitHub for `latest.yml`
2. Compares versions
3. Downloads if newer version exists
4. Prompts user to restart
5. Installs update on restart

## Distribution Checklist

Before releasing:

- [ ] Version bumped in `package.json`
- [ ] CHANGELOG.md updated
- [ ] All tests passing
- [ ] Built for all platforms
- [ ] Code signed (if applicable)
- [ ] Notarized (macOS only)
- [ ] Release notes written
- [ ] GitHub release created
- [ ] Files uploaded
- [ ] Auto-update metadata included
- [ ] Download links tested
- [ ] Installation tested on each platform
- [ ] Update mechanism tested

## Monitoring

Track downloads and usage:

1. **GitHub Release Stats**: Native GitHub analytics
2. **Custom Analytics**: Add opt-in telemetry
3. **Error Reporting**: Use Sentry or similar
4. **User Feedback**: GitHub Issues/Discussions

## Support & Documentation

Provide users with:

1. **Installation Guide**: Step-by-step for each platform
2. **Troubleshooting**: Common issues and solutions
3. **FAQ**: Frequent questions
4. **Contact Info**: Support email/chat
5. **Video Tutorials**: YouTube walkthroughs

## Security

### Best Practices

1. **Code Signing**: Always sign production builds
2. **HTTPS Only**: Serve updates over HTTPS
3. **Checksum Verification**: Include SHA256 hashes
4. **Update Channel**: Consider beta/stable channels
5. **Rollback Plan**: Keep previous versions available

### Vulnerability Response

1. Security issue reported
2. Assess severity (CVSS score)
3. Develop patch
4. Release hotfix version
5. Notify users
6. Publish CVE (if critical)

## Legal

- [ ] Copyright notices in place
- [ ] License file included
- [ ] Third-party licenses documented
- [ ] Privacy policy (if collecting data)
- [ ] Terms of service
- [ ] GDPR compliance (EU users)

## Cost Breakdown

**Free**:
- GitHub hosting
- Open source tools
- Linux distribution

**Paid** (optional):
- Windows code signing: $200-500/year
- macOS Developer Program: $99/year
- S3 hosting: ~$0.02/GB
- CDN: Varies by traffic

## Resources

- [electron-builder docs](https://www.electron.build/)
- [Electron docs](https://www.electronjs.org/docs)
- [GitHub Releases](https://docs.github.com/en/repositories/releasing-projects-on-github)
- [Apple Notarization](https://developer.apple.com/documentation/security/notarizing_macos_software_before_distribution)
- [Windows Code Signing](https://docs.microsoft.com/en-us/windows/win32/seccrypto/cryptography-tools)

---

**Questions?** Open an issue on GitHub or contact support@followw.app
