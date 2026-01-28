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



## ***************************** PREDISPOSIZIONE APP *****************************

#Installa ionic capacitor
npm install -g @ionic/cli
npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor/ios

#inizializza
npx cap init Survivor com.survivor.app --web-dir=dist/survivor_webapp

#Build Angular per mobile
npm run build -- --configuration development  --base-href ./ --deploy-url ./

#Personalizzazioni capacitator.config.ts
webDir: 'dist/survivor_webapp/browser'
androidScheme: 'http' **N.B. da rimuover con passaggio ad HTTPS
#Personalizzazioni  network_security_config.xml
<domain includeSubdomains="true">10.0.2.2</domain>  **N.B. Quando passerai a HTTPS, potrai restringere/rimuovere le eccezioni cleartext.

#Copia nel container Capacitor e aggiungi piattaforme - Inizializzazione
npx cap sync
npx cap add android 
npx cap add ios 

#Apri nei tool nativi:
npx cap open android   ** Lancia Android Studio (https://developer.android.com/studio?hl=it). N.B. se installato in directory diversa  aggiungere variabile d'ambiente con path adeguato: CAPACITOR_ANDROID_STUDIO_PATH "C:\Program Files\Android\Android Studio\bin\studio64.exe"
npx cap open ios       **N.B. Xcode, per simulatore/dispositivo/TestFlight CON MAC!

#(Opzionale) Genera icone/splash:
npm install -D @capacitor/assets
npx capacitor-assets generate

#Aggiornamento container Capacitor per Android
1) ng build --configuration mobile
2) copia con uno dei due comandi:
npx cap sync android **N.B fa sia copy che update dei plugin
npx cap copy android **N.B. per solo aggiornare i web assets
3) in Android Studio attendere indexing
4) lanciare app


##Problemi risolti
**se errore classe duplicate in build.gradle
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

##comandi per emulatore
**Variabili d'ambiente 
SDK="C:\Users\<USERNAME>\AppData\Local\Android\Sdk"
aggiungere %SDK%\platform-tools a PATH


**per verificare se si avvia il device:
adb devices

**per inviare il magic link:
adb shell am force-stop com.survivor.app
adb shell am start -a android.intent.action.VIEW -d "survivor://auth/verify?token=**<TOKEN>**&codiceTipoMagicLink=L"


**resettare emulatore
adb reboot

**rimuovere app
adb uninstall com.survivor.app

**visualizzare device su chrome
chrome://inspect/#devices

**copiare APK su device
adb -d install -t <PATH_APP>\survivor\survivor_webapp\android\app\build\intermediates\apk\debug\app-debug.apk


