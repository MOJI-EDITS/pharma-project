import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.futuretech.pharmaplus',
  appName: 'Pharma Plus',
  webDir: 'out',
  server: {
    url: 'http://192.168.100.4:3000',
    cleartext: true
  }
};

export default config;
