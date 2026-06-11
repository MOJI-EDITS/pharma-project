# Mobile App Build & Test Guide

## Development Setup

### Quick Start
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# The app runs on http://localhost:3000
# On mobile: access via http://<your-ip>:3000
```

### Build for Testing

```bash
# Production build
npm run build

# Sync to Capacitor
npm run cap:sync

# Build debug APK for testing
npm run android:build-debug

# Or build release APK
npm run android:build
```

## Testing on Device

### Prerequisites
- Android device or emulator (Android 9+)
- USB cable (for device)
- Developer mode enabled on device
- USB debugging enabled

### Steps

1. **Connect Device**:
   ```bash
   adb devices  # List connected devices
   ```

2. **Install Debug APK**:
   ```bash
   adb install android/app/build/outputs/apk/debug/app-debug.apk
   ```

3. **Or Build and Install**:
   ```bash
   cd android
   ./gradlew installDebug
   ```

4. **Launch App**:
   ```bash
   adb shell am start -n com.futuretech.pharmaplus/.MainActivity
   ```

## Testing Checklist

### Authentication
- [ ] Sign up with new email
- [ ] Receive verification email
- [ ] Click verification link
- [ ] Sign in with credentials
- [ ] Sign in with Google OAuth
- [ ] Reset password flow
- [ ] Session persistence
- [ ] Logout functionality

### Core Features
- [ ] Browse products
- [ ] Search products
- [ ] View product details
- [ ] Add to cart
- [ ] Cart functionality
- [ ] Checkout process
- [ ] Order placement
- [ ] Order tracking
- [ ] View profile
- [ ] Edit profile

### Mobile Specific
- [ ] Responsive layout
- [ ] Touch gestures work
- [ ] Keyboard input works
- [ ] Forms are usable
- [ ] Images load properly
- [ ] No console errors
- [ ] No network errors

### Performance
- [ ] App loads quickly
- [ ] Scrolling is smooth
- [ ] No crashes
- [ ] Memory usage reasonable
- [ ] Battery drain minimal

## Debugging

### View Console Logs
```bash
adb logcat | grep "com.futuretech.pharmaplus"
```

### Debug with Chrome DevTools
1. Open Chrome
2. Navigate to `chrome://inspect`
3. Select your device/app
4. Start debugging

### Common Issues

**App doesn't load**:
```bash
# Clear app cache
adb shell pm clear com.futuretech.pharmaplus

# Reinstall
adb uninstall com.futuretech.pharmaplus
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

**Build fails**:
```bash
cd android
./gradlew clean
./gradlew assembleDebug
```

**Can't connect to server**:
- Check server is running: `npm run dev`
- Update device IP in `capacitor.config.ts`
- Ensure device and PC on same network

## Build Variants

### Debug Build (Development)
```bash
npm run android:build-debug
# Output: android/app/build/outputs/apk/debug/app-debug.apk
```

### Release Build (Production)
```bash
npm run android:build
# Output: android/app/build/outputs/apk/release/app-release.apk
```

### AAB Build (Google Play)
```bash
cd android
./gradlew bundleRelease
# Output: android/app/build/outputs/bundle/release/app-release.aab
```

## Environment Configuration

### Development (`capacitor.config.ts`)
```typescript
server: {
  url: 'http://localhost:3000',
  cleartext: true  // Allow HTTP
}
```

### Production (`capacitor.config.ts`)
```typescript
server: {
  androidScheme: 'https',
  cleartext: false  // Require HTTPS
}
```

Update before release build:
```bash
# Set production server URL
# Edit capacitor.config.ts
npm run cap:sync
npm run android:build
```

## Size Optimization

### Check APK Size
```bash
# Debug
ls -lh android/app/build/outputs/apk/debug/app-debug.apk

# Release
ls -lh android/app/build/outputs/apk/release/app-release.apk
```

### Reduce Size
- ProGuard rules already configured
- Remove unused dependencies
- Optimize images
- Use dynamic imports

## Version Management

Update version before release:

### In `android/app/build.gradle`:
```gradle
versionCode 1      // Increment for each build
versionName "1.0.0"  // Semantic versioning
```

### In `capacitor.config.ts`:
```typescript
export default {
  appId: 'com.futuretech.pharmaplus',
  appName: 'Pharma Plus'
  // versionCode and versionName from gradle
}
```

## Release Process

1. **Update Version**:
   ```bash
   # Update build.gradle
   versionCode: 2
   versionName: "1.0.1"
   ```

2. **Build**:
   ```bash
   npm run build
   npm run cap:sync
   npm run android:build
   ```

3. **Test**:
   - Install APK on device
   - Run full testing suite
   - Check for crashes

4. **Sign**:
   ```bash
   # Already configured with release signing
   cd android
   ./gradlew bundleRelease
   ```

5. **Upload**:
   - Go to Google Play Console
   - Upload AAB file
   - Add release notes
   - Submit for review

## CI/CD Setup (Optional)

For automated builds:

### GitHub Actions Example
```yaml
name: Build APK

on: [push]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - run: npm run cap:sync
      - name: Build APK
        run: cd android && ./gradlew assembleRelease
      - name: Upload
        uses: actions/upload-artifact@v2
        with:
          name: app-release
          path: android/app/build/outputs/apk/release/
```

## Performance Profiling

### Check Build Time
```bash
cd android
./gradlew assembleRelease --profile
```

Report saved in `android/build/reports/profile/`

### Monitor Runtime Performance
- Use Chrome DevTools (Lighthouse, Performance tab)
- Check frame rates during scrolling
- Monitor memory usage with `adb shell dumpsys meminfo`

## Analytics & Crash Reporting (Future)

Consider integrating:
- Firebase Crashlytics
- Google Analytics
- Sentry for error tracking

## Documentation

- [Capacitor Docs](https://capacitorjs.com)
- [Android Docs](https://developer.android.com)
- [Next.js Docs](https://nextjs.org)
- [Google Play Console Guide](https://support.google.com/googleplay/android-developer)

---

**Last Updated**: 2026-06-11
**Version**: 1.0.0
