# Pharma Plus Mobile App - Deployment Guide for Google Play

This guide covers deploying the Pharma Plus mobile app to Google Play Store.

## Prerequisites

- Node.js 18+ and npm
- Java Development Kit (JDK) 17 or higher
- Android SDK with SDK Platform 34+
- Android Studio (recommended) or command-line tools
- Gradle
- Git

## Step 1: Build the Next.js App

The app uses Next.js with Capacitor for mobile bridging.

```bash
npm install
npm run build
```

The build output is generated in the `.next` directory.

## Step 2: Initialize/Update Capacitor

Capacitor bridges the web app to Android native code.

```bash
# Sync Capacitor configuration with Android project
npm run cap:sync
```

This syncs the web files and configuration to the Android project located in `android/`.

## Step 3: Android Project Setup

The Android project is in the `android/` directory.

### Check Java Version
```bash
java -version
```
Should be JDK 17 or higher.

### Generate Signed APK for Production

1. **Open Android Studio**:
   - File → Open → Select `android/` folder
   - Wait for Gradle sync to complete

2. **Create a Keystore** (if you don't have one):
   ```bash
   keytool -genkey -v -keystore ~/.android/pharma-plus.keystore -keyalg RSA -keysize 2048 -validity 10000 -alias pharma-plus
   ```

3. **Build Release AAB** (Bundle for Play Store):
   ```bash
   cd android
   ./gradlew bundleRelease
   ```
   Output: `android/app/build/outputs/bundle/release/app-release.aab`

4. **Or Build Release APK**:
   ```bash
   ./gradlew assembleRelease
   ```
   Output: `android/app/build/outputs/apk/release/app-release.apk`

## Step 4: Sign the Build

Create/Update `android/app/build.gradle` with signing config:

```gradle
android {
    ...
    signingConfigs {
        release {
            storeFile file('../../pharma-plus.keystore')
            storePassword 'your-store-password'
            keyAlias 'pharma-plus'
            keyPassword 'your-key-password'
        }
    }
    
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

## Step 5: Prepare for Google Play Store

### App Information
- **App Name**: Pharma Plus
- **App ID**: com.futuretech.pharmaplus
- **Version Code**: Increment with each release (1, 2, 3...)
- **Version Name**: Follow semantic versioning (1.0.0, 1.0.1, 1.1.0...)

### Update in `capacitor.config.ts` and `android/app/build.gradle`:
```
versionCode 1
versionName "1.0.0"
```

### App Store Listing Preparation
- [ ] App description
- [ ] Screenshots (phone, tablet)
- [ ] Feature graphic (1024x500px)
- [ ] Promo graphics
- [ ] Privacy Policy URL
- [ ] Terms of Service URL
- [ ] App category and content rating

## Step 6: Upload to Google Play Console

1. **Create Developer Account**:
   - Visit [Google Play Console](https://play.google.com/console)
   - Sign in with Google account
   - Pay $25 registration fee

2. **Create New App**:
   - Click "Create app"
   - Fill in app name: "Pharma Plus"
   - Select app category
   - Choose content rating

3. **Upload Build**:
   - Navigate to "Release" → "Production"
   - Click "Create new release"
   - Upload `.aab` file (Android App Bundle)
   - Add release notes

4. **Complete Store Listing**:
   - Add app description
   - Upload screenshots
   - Add feature graphic
   - Set content rating
   - Add privacy policy URL

5. **Submit for Review**:
   - Review all information
   - Click "Submit"
   - Wait for Google Play's review (typically 2-3 hours)

## Step 7: Monitoring and Updates

### Check Build Status
After uploading:
- Google Play will validate the APK/AAB
- Wait for review status notifications
- Check [Google Play Console](https://play.google.com/console) for status

### Release Management
- **Staged Rollout**: Start with 5-10%, increase gradually
- **Monitoring**: Check crash reports and reviews
- **Update Process**: Upload new AAB with incremented versionCode

## Troubleshooting

### Build Fails with Gradle Errors
```bash
cd android
./gradlew clean
./gradlew bundleRelease
```

### Capacitor Sync Issues
```bash
npm run cap:sync
cd android
./gradlew clean
```

### APK/AAB Validation Issues
- Check minimum SDK version in `android/app/build.gradle`
- Verify target SDK is 34+
- Ensure app is signed properly

## Development Build for Testing

### Debug APK (for emulator/device testing):
```bash
npm run build
npm run cap:sync
cd android
./gradlew assembleDebug
```

Output: `android/app/build/outputs/apk/debug/app-debug.apk`

Install on device:
```bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

## Authentication in Mobile App

The app uses NextAuth for authentication:
- **Sign Up**: Email + password registration with verification
- **Sign In**: Credentials or Google OAuth
- **Session**: JWT-based with 24-hour expiry
- **Refresh**: Automatic token refresh on app open

**Note**: Ensure `NEXTAUTH_URL` environment variable is set to your production server URL for proper OAuth redirects.

## Backend Server

For production, you'll need a running Next.js server that handles:
- Authentication (NextAuth)
- API routes
- Database connections (MongoDB)
- Email services (Nodemailer)

Deploy to platforms like:
- Vercel (recommended for Next.js)
- AWS
- DigitalOcean
- Heroku

## Key Configurations

### Mobile-Specific Settings in `capacitor.config.ts`:
```typescript
{
  appId: 'com.futuretech.pharmaplus',
  appName: 'Pharma Plus',
  server: {
    androidScheme: 'https',
    cleartext: true  // Allow HTTP for dev
  },
  plugins: {
    StatusBar: {
      style: 'dark',
      backgroundColor: '#2563eb'
    },
    Keyboard: {
      resize: 'body'
    }
  }
}
```

## Security Checklist

- [ ] API endpoints use HTTPS
- [ ] Sensitive data not logged
- [ ] Authentication tokens stored securely
- [ ] Privacy policy is public and clear
- [ ] Data collection is minimal and transparent
- [ ] App requests only necessary permissions

## Performance Optimization

- Lazy load images
- Code splitting implemented
- Minification enabled in release builds
- Compression enabled on server

## Release Notes Template

For each update, provide:
```
Version X.X.X

What's new:
• Feature 1
• Feature 2
• Bug fixes and improvements

Known issues:
• Issue 1 (will be fixed in next release)

Performance improvements:
• Faster loading
• Better memory management
```

## Support & Maintenance

### Monitoring
- Crash reports: Google Play Console
- User ratings and reviews
- Performance metrics

### Regular Updates
- Monthly security patches
- Quarterly feature releases
- Bug fixes as needed

## Contact & Documentation

For support or questions:
- Email: support@futuretech.com
- Privacy Policy: [URL]
- Terms of Service: [URL]

---

**Last Updated**: 2026-06-11
**Current Version**: 1.0.0
