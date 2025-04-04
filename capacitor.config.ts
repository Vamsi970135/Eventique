import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.eventeaseapp',
  appName: 'EventEase',
  webDir: 'dist/public',
  server: {
    androidScheme: 'https',
    allowNavigation: [
      'localhost',
      '*.replit.app'
    ]
  },
  android: {
    buildOptions: {
      releaseType: 'APK'
    }
  }
};

export default config;
