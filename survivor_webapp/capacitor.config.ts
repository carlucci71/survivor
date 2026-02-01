import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.survivor.app',
  appName: 'Survivor',
  // Angular application builder puts the browser bundle here (contains index.html)
  webDir: 'dist/survivor_webapp/browser',
  // Serve app over HTTP on Android so HTTP API calls are not blocked as mixed content during testing
  server: {
    androidScheme: 'https'
  }
};

export default config;
