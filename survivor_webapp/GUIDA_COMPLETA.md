# Survivor WebApp - Guida Rapida

## Stato del Progetto

L'applicazione Angular 19 è stata creata con successo con la seguente struttura:

### ✅ Completato

1. **Struttura del progetto** completa con:
   - Core (guards, interceptors, models, services)
   - Features (auth, home, admin)
   - Shared components

2. **Autenticazione** completa:
   - Login con Magic Link
   - Verifica token
   - JWT storage
   - Auth service con RxJS

3. **Componenti UI**:
   - Login Component con form
   - Verify Component per magic link
   - Home Component con lista leghe
   - Admin Component protetto

4. **Routing**:
   - Routes configurate con lazy loading
   - Auth Guard per rotte protette
   - Admin Guard per area admin

5. **HTTP**:
   - Auth Interceptor per JWT automatico
   - Services per API calls
   - Error handling

### 📋 File Creati

```
src/app/
├── core/
│   ├── guards/
│   │   ├── auth.guard.ts          ✅
│   │   └── admin.guard.ts         ✅
│   ├── interceptors/
│   │   └── auth.interceptor.ts    ✅
│   ├── models/
│   │   ├── auth.model.ts          ✅
│   │   └── lega.model.ts          ✅
│   └── services/
│       ├── auth.service.ts        ✅
│       └── lega.service.ts        ✅
├── features/
│   ├── auth/
│   │   ├── login.component.ts     ✅
│   │   ├── login.component.html   ✅
│   │   ├── login.component.scss   ✅
│   │   ├── verify.component.ts    ✅
│   │   ├── verify.component.html  ✅
│   │   └── verify.component.scss  ✅
│   ├── home/
│   │   ├── home.component.ts      ✅
│   │   ├── home.component.html    ✅
│   │   └── home.component.scss    ✅
│   └── admin/
│       ├── admin.component.ts     ✅
│       ├── admin.component.html   ✅
│       └── admin.component.scss   ✅
├── app.config.ts                  ✅ (aggiornato)
├── app.routes.ts                  ✅ (aggiornato)
└── app.component.html             ✅ (aggiornato)
```

## 🚀 Come Avviare l'Applicazione

### 1. Prerequisiti
- Node.js 20.x o superiore
- npm 10.x o superiore
- Backend Spring Boot avviato su http://localhost:8080

### 2. Prima installazione

```bash
cd survivor_webapp

# Elimina node_modules e package-lock.json se esistono
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue

# Reinstalla le dipendenze
npm cache clean --force
npm install
```

### 3. Avvio in modalità sviluppo

```bash
# Avvia il server di sviluppo
npm start

# Oppure
npx ng serve
```

L'applicazione sarà disponibile su: **http://localhost:4200**

### 4. Build per produzione

```bash
npm run build

# I file saranno in dist/survivor_webapp/browser/
```

## 🔐 Flusso Applicazione

### 1. Login (http://localhost:4200/auth/login)
- L'utente inserisce la propria email
- Il sistema invia un magic link via email
- Messaggio di conferma visualizzato

### 2. Verifica Magic Link (http://localhost:4200/auth/verify?token=...)
- L'utente clicca sul link ricevuto via email
- Il sistema verifica il token
- JWT salvato in localStorage
- Redirect automatico alla home

### 3. Home (http://localhost:4200/home)
- Protetta da AuthGuard
- Visualizza nome utente e ruolo
- Mostra lista delle leghe disponibili
- Pulsante logout
- Pulsante "Area Admin" (solo per ADMIN)

### 4. Admin (http://localhost:4200/admin)
- Protetta da AuthGuard + AdminGuard
- Solo per utenti con ruolo ADMIN
- Dashboard amministratore
- Test endpoint /admin del backend

## 🔧 Configurazione API

Le URL delle API sono configurate nei servizi:

**auth.service.ts:**
```typescript
private apiUrl = 'http://localhost:8080/api/auth';
```

**lega.service.ts:**
```typescript
private apiUrl = 'http://localhost:8080';
```

Per modificare l'URL del backend, aggiorna queste proprietà.

## 📱 Caratteristiche UI

- **Design Moderno**: Gradients viola/blu per il tema principale
- **Responsive**: Layout adattivo per mobile e desktop
- **Animazioni**: Transizioni smooth sui pulsanti e card
- **Feedback Visuale**: Messaggi di successo/errore chiari
- **Loading States**: Spinner durante le operazioni async

## 🧪 Test Backend

Prima di testare l'applicazione, assicurati che il backend risponda:

```bash
# Test endpoint pubblico
curl http://localhost:8080/first

# Test magic link
curl -X POST http://localhost:8080/api/auth/request-magic-link \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

## ⚠️ Note Importanti

1. **CORS**: Il backend deve permettere richieste da http://localhost:4200
2. **Email**: Configurare correttamente il servizio email nel backend
3. **JWT**: Il token JWT deve essere valido e non scaduto
4. **Ruoli**: Gli utenti devono avere ruoli "USER" o "ADMIN" nel database

## 🐛 Troubleshooting

### L'applicazione non compila
```bash
# Pulisci cache npm
npm cache clean --force

# Reinstalla dipendenze
rm -rf node_modules package-lock.json
npm install
```

### Errori CORS
Aggiungi al backend Spring Boot:
```java
@CrossOrigin(origins = "http://localhost:4200")
```

### JWT non funziona
- Verifica che l'interceptor sia configurato in app.config.ts
- Controlla che il token sia salvato in localStorage
- Verifica il formato: "Bearer {token}"

## 📚 Documentazione Aggiuntiva

- [Angular 19 Docs](https://angular.dev)
- [RxJS Documentation](https://rxjs.dev)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)

## 👨‍💻 Struttura Codice

L'applicazione segue le best practices Angular 19:
- **Standalone Components**: No NgModules
- **Functional Guards**: CanActivateFn
- **Functional Interceptors**: HttpInterceptorFn
- **Signals**: Pronto per l'adozione futura
- **Lazy Loading**: Per ottimizzare le performance
