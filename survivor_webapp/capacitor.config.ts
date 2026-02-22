import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.survivor.app',
  appName: 'Survivor',
  // Angular application builder puts the browser bundle here (contains index.html)
  webDir: 'dist/survivor_webapp/browser',
  // Serve app over HTTP on Android so HTTP API calls are not blocked as mixed content during testing
  server: {
    androidScheme: 'https'
  },
  plugins: {
    StatusBar: {
      // Non sovrapporre la status bar all'app
      overlay: false,
      // Colore di sfondo della status bar (il colore del tuo header)
      backgroundColor: '#0A3D91',
      // Stile del testo della status bar (light = bianco)
      style: 'light'
    }
  }
};

export default config;
