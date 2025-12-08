# Survivor WebApp - Angular 19

Applicazione Angular 19 per il progetto Survivor, integrata con il backend Spring Boot.

## Caratteristiche

- **Angular 19** con standalone components
- **Autenticazione** via Magic Link (email)
- **JWT** per la gestione delle sessioni
- **Guards** per la protezione delle rotte
- **Interceptor HTTP** per aggiungere automaticamente il token JWT
- **Routing** con lazy loading
- **Responsive Design**

## Struttura del Progetto

```
src/app/
├── core/
│   ├── guards/         # Guards per la protezione delle rotte
│   │   ├── auth.guard.ts
│   │   └── admin.guard.ts
│   ├── interceptors/   # HTTP Interceptors
│   │   └── auth.interceptor.ts
│   ├── models/         # Interfacce TypeScript
│   │   ├── auth.model.ts
│   │   └── lega.model.ts
│   └── services/       # Servizi Angular
│       ├── auth.service.ts
│       └── lega.service.ts
├── features/
│   ├── auth/           # Modulo autenticazione
│   │   ├── login.component.*
│   │   └── verify.component.*
│   ├── home/           # Pagina principale
│   │   └── home.component.*
│   └── admin/          # Area amministratore
│       └── admin.component.*
└── shared/
    └── components/     # Componenti condivisi
```

## API Endpoints Utilizzati

### Autenticazione
- `POST /api/auth/request-magic-link` - Richiede l'invio di un magic link
- `GET /api/auth/verify?token={token}` - Verifica il magic link e restituisce JWT

### Leghe
- `GET /first` - Recupera l'elenco delle leghe

### Admin
- `GET /admin` - Endpoint protetto per amministratori

## Come Avviare

1. **Installare le dipendenze:**
   ```bash
   npm install
   ```

2. **Avviare il server di sviluppo:**
   ```bash
   ng serve
   ```

3. **Aprire il browser:**
   Navigare su `http://localhost:4200`

## Configurazione Backend

Assicurarsi che il backend Spring Boot sia avviato su `http://localhost:8080`.

Per modificare l'URL del backend, aggiornare le proprietà `apiUrl` nei servizi:
- `src/app/core/services/auth.service.ts`
- `src/app/core/services/lega.service.ts`

## Flusso di Autenticazione

1. L'utente inserisce l'email nella pagina di login
2. Il sistema invia un magic link all'email
3. L'utente clicca sul link ricevuto
4. Il sistema verifica il token e restituisce un JWT
5. Il JWT viene salvato nel localStorage e utilizzato per le richieste successive

## Ruoli Utente

- **USER**: Accesso all'area home
- **ADMIN**: Accesso all'area home + area admin

## Build per Produzione

```bash
ng build --configuration production
```

I file compilati saranno disponibili nella cartella `dist/`.

## Tecnologie Utilizzate

- Angular 19
- TypeScript
- SCSS
- RxJS
- Angular Router
- Angular HttpClient

## Note di Sviluppo

- L'applicazione utilizza **standalone components** (nessun modulo NgModule)
- Gli **interceptors** sono functional interceptors (Angular 19)
- I **guards** sono functional guards (CanActivateFn)
- Tutti i componenti utilizzano **OnPush change detection** dove possibile
