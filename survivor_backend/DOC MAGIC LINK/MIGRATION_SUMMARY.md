# Riepilogo Migrazione a Magic Link Authentication

## Data: 2025-12-05

## Panoramica
Il sistema di autenticazione è stato completamente migrato da **Basic Authentication** a **Magic Link Authentication** con **JWT**.

---

## File Creati

### Entità (Entity)
1. **User.java** - Entità per gli utenti del sistema
2. **MagicLinkToken.java** - Entità per i token magic link

### Repository
3. **UserRepository.java** - Repository per gestire gli utenti
4. **MagicLinkTokenRepository.java** - Repository per gestire i token magic link

### DTO (Data Transfer Objects)
5. **MagicLinkRequestDTO.java** - DTO per richiedere un magic link
6. **MagicLinkResponseDTO.java** - DTO per la risposta della richiesta magic link
7. **AuthResponseDTO.java** - DTO per la risposta dopo autenticazione

### Service
8. **MagicLinkService.java** - Logica business per i magic link
9. **EmailService.java** - Servizio per l'invio delle email
10. **JwtService.java** - Servizio per generare e validare JWT

### Controller
11. **AuthController.java** - Controller REST per l'autenticazione

### Security
12. **JwtAuthenticationFilter.java** - Filtro per validare JWT nelle richieste

### Configuration
13. **SchedulingConfig.java** - Configurazione per task schedulati

### Task
14. **TokenCleanupTask.java** - Task schedulato per pulire i token scaduti

### Exception
15. **GlobalExceptionHandler.java** - Gestore globale delle eccezioni

### Test
16. **MagicLinkServiceTest.java** - Test unitari per il MagicLinkService

### Documentazione
17. **MAGIC_LINK_README.md** - Documentazione completa del sistema
18. **.env.example** - Template per le variabili d'ambiente
19. **postman_collection.json** - Collection Postman per testare le API

### Database
20. **create_auth_tables.sql** - Script SQL per creare le tabelle

---

## File Modificati

### 1. SecurityConfig.java
**Cambiamenti:**
- Rimossa autenticazione Basic
- Rimosso UserDetailsService in memoria
- Rimosso PasswordEncoder
- Aggiunto JwtAuthenticationFilter
- Configurata politica di sessione STATELESS
- Endpoint `/api/auth/**` impostati come pubblici

**Prima:**
```java
.httpBasic(Customizer.withDefaults())
```

**Dopo:**
```java
.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
```

### 2. pom.xml
**Dipendenze aggiunte:**
- `io.jsonwebtoken:jjwt-api:0.11.5`
- `io.jsonwebtoken:jjwt-impl:0.11.5`
- `io.jsonwebtoken:jjwt-jackson:0.11.5`
- `spring-boot-starter-mail`

### 3. application.yaml
**Configurazioni aggiunte:**
- Configurazione email (SMTP)
- Configurazione JWT (secret, expiration)
- Configurazione Magic Link (expiration-minutes, base-url)

---

## Architettura del Sistema

### Flusso di Autenticazione

1. **Richiesta Magic Link**
   ```
   POST /api/auth/request-magic-link
   Body: { "email": "user@example.com" }
   ```
   - Valida l'email
   - Crea o recupera l'utente
   - Genera un token sicuro (32 byte random)
   - Salva il token nel database (valido 15 minuti)
   - Invia email con il magic link

2. **Verifica Magic Link**
   ```
   GET /api/auth/verify?token={token}
   ```
   - Valida il token (non scaduto, non usato)
   - Marca il token come usato
   - Genera un JWT (valido 24 ore)
   - Restituisce JWT + info utente

3. **Utilizzo JWT**
   ```
   GET /protected-endpoint
   Headers: Authorization: Bearer {jwt}
   ```
   - JwtAuthenticationFilter intercetta la richiesta
   - Estrae e valida il JWT
   - Imposta l'autenticazione nel SecurityContext

### Database Schema

**Tabella: users**
- id (BIGSERIAL, PK)
- email (VARCHAR, UNIQUE, NOT NULL)
- name (VARCHAR, NOT NULL)
- enabled (BOOLEAN, DEFAULT TRUE)
- created_at (TIMESTAMP, NOT NULL)
- last_login_at (TIMESTAMP)

**Tabella: magic_link_tokens**
- id (BIGSERIAL, PK)
- token (VARCHAR, UNIQUE, NOT NULL)
- user_id (BIGINT, FK -> users)
- expires_at (TIMESTAMP, NOT NULL)
- created_at (TIMESTAMP, NOT NULL)
- used_at (TIMESTAMP)
- used (BOOLEAN, DEFAULT FALSE)

---

## Configurazione Richiesta

### Variabili d'Ambiente Obbligatorie

```bash
# Database (già esistente)
pwddb=your_database_password

# Email Configuration (NUOVO)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_FROM=noreply@survivor.com

# JWT Configuration (NUOVO)
JWT_SECRET=yourSecretKeyMustBeAtLeast256BitsLongForHS256AlgorithmToWorkProperly

# Magic Link Configuration (NUOVO)
MAGIC_LINK_BASE_URL=http://localhost:8389
```

### Note per Gmail
Per usare Gmail come SMTP:
1. Vai su Google Account > Sicurezza
2. Abilita "Verifica in due passaggi"
3. Vai su "Password per le app"
4. Genera una password per "Mail"
5. Usa questa password in `MAIL_PASSWORD`

---

## Setup del Database

Esegui lo script SQL:
```bash
psql -h 85.235.148.177 -p 6438 -U survivor_user -d db_survivor -f src/main/resources/db/migration/create_auth_tables.sql
```

---

## Testing

### 1. Con Postman
Importa la collection: `postman_collection.json`

### 2. Con curl

**Richiedi magic link:**
```bash
curl -X POST http://localhost:8389/api/auth/request-magic-link \
  -H "Content-Type: application/json" \
  -d '{"email":"your-email@example.com"}'
```

**Verifica token:**
```bash
curl "http://localhost:8389/api/auth/verify?token={TOKEN}"
```

**Usa JWT:**
```bash
curl http://localhost:8389/first/test \
  -H "Authorization: Bearer {JWT}"
```

---

## Sicurezza Implementata

1. **Token sicuri**: Generati con SecureRandom (32 byte)
2. **Scadenza token**: Magic link validi 15 minuti
3. **One-time use**: Token utilizzabili una sola volta
4. **JWT scadenza**: Token JWT validi 24 ore
5. **Pulizia automatica**: Task schedulato ogni ora
6. **Validazione email**: Formato email validato
7. **HTTPS ready**: Sistema pronto per HTTPS in produzione

---

## Breaking Changes

### ⚠️ IMPORTANTE
Tutti i client devono essere aggiornati per usare il nuovo sistema:

**Prima (Basic Auth):**
```
Authorization: Basic YWRtaW46cGFzc3dvcmQ=
```

**Dopo (JWT):**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Prossimi Passi

1. ✅ Eseguire script SQL per creare tabelle
2. ✅ Configurare variabili d'ambiente
3. ✅ Testare il flusso completo
4. 🔲 Aggiornare frontend/client per usare magic link
5. 🔲 Configurare dominio personalizzato per email
6. 🔲 Implementare rate limiting per prevenire spam
7. 🔲 Aggiungere logging dettagliato
8. 🔲 Configurare HTTPS in produzione

---

## Rollback

Se necessario, per tornare al sistema precedente:

1. Ripristina `SecurityConfig.java` dalla versione precedente
2. Rimuovi le dipendenze JWT e Mail dal `pom.xml`
3. Ripristina `application.yaml` alla versione precedente
4. Esegui `mvn clean install`

---

## Contatti & Supporto

Per domande o problemi:
- Consulta `MAGIC_LINK_README.md` per documentazione dettagliata
- Verifica i log dell'applicazione per errori
- Testa con Postman collection inclusa

---

## Note Tecniche

- **Java Version**: 21
- **Spring Boot**: 3.5.8
- **JWT Library**: jjwt 0.11.5
- **Database**: PostgreSQL
- **Email**: Jakarta Mail 2.0.5

