import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'ionic.habittracker',
  appName: 'habittracker',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
