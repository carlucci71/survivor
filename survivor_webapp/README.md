# SurvivorWebapp

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.19.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.



##PER APP

#Installa ionic capacitor
npm install -g @ionic/cli
npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor/ios

#inizializza
npx cap init Survivor com.survivor.app --web-dir=dist/survivor_webapp

#Build Angular per mobile (usa base href relativa, senza toccare il web build con /survivor/):
npm run build -- --configuration development  --base-href ./ --deploy-url ./

#Copia nel container Capacitor e aggiungi piattaforme
npx cap sync #per funzionare in capacitor.config.ts ho messo webDir: 'dist/survivor_webapp/browser'
npx cap add android #dal secondo giro "npx cap sync android" (fa sia copy che update dei plugin) oppure, "npx cap copy android" per solo aggiornare i web assets.
npx cap add ios #add solo la prima, poi o sync o copy


#HTTP/HTTPS
in capacitator.config.ts (togliere o mettere https per prod)
  server: {
    androidScheme: 'http'
  }


#Apri nei tool nativi:
npx cap open android   # Android Studio, genera APK/AAB da installare da https://developer.android.com/studio?hl=it (se non lo trova setx CAPACITOR_ANDROID_STUDIO_PATH "C:\Program Files\Android\Android Studio\bin\studio64.exe")
npx cap open ios       # Xcode, per simulatore/dispositivo/TestFlight CON MAC!

#(Opzionale) Genera icone/splash:
npm install -D @capacitor/assets
npx capacitor-assets generate

se errore classe duplicate in:
build.gradle

    // Align all Kotlin stdlib artifacts to the same version to avoid duplicate-class errors
    configurations.all {
        resolutionStrategy.eachDependency { details ->
            if (details.requested.group == 'org.jetbrains.kotlin' &&
                    details.requested.name.startsWith('kotlin-stdlib')) {
                details.useVersion '1.8.22'
                details.because 'Capacitor stack pulls mixed kotlin-stdlib versions (1.8.22 vs 1.6.21)'
            }
        }
    }
}

per verificare se si avvia il device:
$sdk="C:\Users\<utente>\AppData\Local\Android\Sdk"
$Env:PATH="$sdk\platform-tools;$Env:PATH"
adb devices

adb shell am force-stop com.survivor.app
adb shell am start -a android.intent.action.VIEW -d "survivor://auth/verify?token=J5bKz2w389lFfiYyFmYPow.NO_DATA.DFoj9TEhX15SuhaKhyJMX8rA-50tP7wCIYmjJBkNGJA&codiceTipoMagicLink=L"


      <domain includeSubdomains="true">10.0.2.2</domain>  Quando passerai a HTTPS, potrai restringere/rimuovere le eccezioni cleartext.