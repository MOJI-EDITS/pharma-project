import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.futuretech.pharmaplus',
  appName: 'Pharma Plus',
  webDir: '.next', // Point to Next.js build output
  server: {
    androidScheme: 'https',
    url: 'http://localhost:3000', // For development with live reload
    cleartext: true
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: false
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      launchAutoHide: true,
      backgroundColor: '#2563eb'
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#2563eb'
    },
    Keyboard: {
      resize: 'body'
    }
  }
};

export default config;
