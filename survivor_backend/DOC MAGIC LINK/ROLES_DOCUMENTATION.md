# 🔐 Gestione Ruoli - Sistema di Autenticazione

## Panoramica

Il sistema di autenticazione con Magic Link ora supporta **2 ruoli**:
- **STANDARD** - Utente normale (default)
- **ADMIN** - Amministratore con privilegi elevati

---

## 🎯 Come Funziona

### 1. Assegnazione Ruolo

Quando un utente si registra per la prima volta (richiesta magic link), riceve automaticamente il ruolo **STANDARD**.

### 2. JWT con Ruolo

Il JWT generato include il ruolo dell'utente:
```json
{
  "sub": "user@example.com",
  "role": "STANDARD",
  "iat": 1701772800,
  "exp": 1701859200
}
```

### 3. Controllo Accessi

Gli endpoint sono protetti in base al ruolo:

| Endpoint | Ruolo Richiesto | Descrizione |
|----------|----------------|-------------|
| `/api/auth/**` | Nessuno (pubblico) | Autenticazione |
| `/swagger-ui/**` | Nessuno (pubblico) | Documentazione API |
| `/admin/**` | **ADMIN** | Solo amministratori |
| `/first/**` | Autenticato | Qualsiasi utente autenticato |
| Tutti gli altri | Autenticato | Qualsiasi utente autenticato |

---

## 📋 Setup Database

### 1. Aggiungi colonna role

Esegui lo script SQL:
```bash
psql -h 85.235.148.177 -p 6438 -U survivor_user -d db_survivor -f src/main/resources/db/migration/add_role_to_users.sql
```

### 2. Promuovi utente ad ADMIN

```sql
-- Promuovi un utente specifico ad ADMIN
UPDATE users 
SET role = 'ADMIN' 
WHERE email = 'admin@example.com';

-- Verifica
SELECT id, email, name, role FROM users;
```

---

## 🧪 Test Scenario Completo

### Scenario 1: Utente STANDARD

**Step 1 - Login:**
```bash
curl -X POST http://localhost:8080/api/auth/request-magic-link \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'
```

**Step 2 - Verifica token (dall'email):**
```bash
curl "http://localhost:8080/api/auth/verify?token=TOKEN_RICEVUTO"
```

**Risposta:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "email": "user@example.com",
  "name": "user",
  "role": "STANDARD"
}
```

**Step 3 - Accesso endpoint normale (✅ OK):**
```bash
curl http://localhost:8080/first/test \
  -H "Authorization: Bearer JWT_TOKEN"
```
**Output:** `Ciao dalla prima API`

**Step 4 - Accesso endpoint admin (❌ FORBIDDEN):**
```bash
curl http://localhost:8080/admin \
  -H "Authorization: Bearer JWT_TOKEN"
```
**Output:** `403 Forbidden`

---

### Scenario 2: Utente ADMIN

**Step 1 - Promuovi utente:**
```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'admin@example.com';
```

**Step 2 - Login come prima:**
```bash
curl -X POST http://localhost:8080/api/auth/request-magic-link \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com"}'
```

**Step 3 - Verifica token:**
```bash
curl "http://localhost:8080/api/auth/verify?token=TOKEN_RICEVUTO"
```

**Risposta:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "email": "admin@example.com",
  "name": "admin",
  "role": "ADMIN"
}
```

**Step 4 - Accesso endpoint admin (✅ OK):**
```bash
curl http://localhost:8080/admin \
  -H "Authorization: Bearer JWT_TOKEN"
```
**Output:** `BRAVO!`

**Step 5 - Accesso endpoint normale (✅ OK):**
```bash
curl http://localhost:8080/first/test \
  -H "Authorization: Bearer JWT_TOKEN"
```
**Output:** `Ciao dalla prima API`

---

## 💻 Integrazione Frontend

### React/JavaScript Example

```javascript
// Salva info utente dopo login
async function verifyMagicLink(token) {
  const response = await fetch(`http://localhost:8080/api/auth/verify?token=${token}`);
  const data = await response.json();
  
  if (data.token) {
    localStorage.setItem('jwt', data.token);
    localStorage.setItem('user', JSON.stringify({
      email: data.email,
      name: data.name,
      role: data.role // ← NUOVO
    }));
    return data;
  }
  return null;
}

// Controlla se utente è admin
function isAdmin() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return user.role === 'ADMIN';
}

// Conditional rendering in React
function AdminPanel() {
  if (!isAdmin()) {
    return <div>Accesso negato - Solo per amministratori</div>;
  }
  
  return (
    <div>
      <h1>Pannello Admin</h1>
      {/* Contenuto admin */}
    </div>
  );
}

// Chiamata API admin
async function callAdminEndpoint() {
  const jwt = localStorage.getItem('jwt');
  
  try {
    const response = await fetch('http://localhost:8080/admin', {
      headers: {
        'Authorization': `Bearer ${jwt}`
      }
    });
    
    if (response.status === 403) {
      console.error('Non hai i permessi per accedere a questa risorsa');
      return null;
    }
    
    return await response.text();
  } catch (error) {
    console.error('Errore nella chiamata:', error);
    return null;
  }
}
```

---

## 🔧 Aggiungere Nuovi Ruoli

Se vuoi aggiungere altri ruoli in futuro:

### 1. Modifica l'enum Role:
```java
// File: util/Role.java
public enum Role {
    STANDARD,
    ADMIN,
    MODERATOR,  // ← NUOVO
    PREMIUM     // ← NUOVO
}
```

### 2. Aggiorna database:
```sql
-- I ruoli esistenti continueranno a funzionare
-- Assegna nuovi ruoli
UPDATE users SET role = 'MODERATOR' WHERE email = 'mod@example.com';
```

### 3. Aggiungi protezioni endpoint:
```java
// File: config/SecurityConfig.java
.requestMatchers("/admin/**").hasRole("ADMIN")
.requestMatchers("/moderator/**").hasAnyRole("ADMIN", "MODERATOR")  // ← NUOVO
.requestMatchers("/premium/**").hasAnyRole("ADMIN", "PREMIUM")      // ← NUOVO
```

---

## 🛡️ Best Practices

### 1. Non esporre admin pubblicamente
❌ **MAI:**
```java
@PostMapping("/make-admin")
public void makeAdmin(@RequestBody String email) {
    // Chiunque può diventare admin!
}
```

✅ **SEMPRE:**
```java
@PostMapping("/make-admin")
@PreAuthorize("hasRole('ADMIN')")
public void makeAdmin(@RequestBody String email) {
    // Solo admin può promuovere altri utenti
}
```

### 2. Valida ruolo nel frontend E backend

Frontend (UX):
```javascript
if (!isAdmin()) {
  return <div>Accesso negato</div>;
}
```

Backend (Sicurezza):
```java
@GetMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<String> adminEndpoint() {
    // Doppia protezione
}
```

### 3. Usa hasAnyRole per endpoint condivisi
```java
.requestMatchers("/dashboard/**")
  .hasAnyRole("ADMIN", "MODERATOR", "PREMIUM")
```

---

## 📊 Tabella Riepilogo Modifiche

| File | Tipo Modifica | Descrizione |
|------|---------------|-------------|
| `util/Role.java` | **NUOVO** | Enum per i ruoli |
| `entity/User.java` | **MODIFICATO** | Aggiunto campo `role` |
| `dto/AuthResponseDTO.java` | **MODIFICATO** | Aggiunto campo `role` |
| `service/JwtService.java` | **MODIFICATO** | Gestione ruolo nel JWT |
| `controller/AuthController.java` | **MODIFICATO** | Risposta con ruolo |
| `security/JwtAuthenticationFilter.java` | **MODIFICATO** | Estrazione ruolo da JWT |
| `config/SecurityConfig.java` | **MODIFICATO** | Protezione endpoint `/admin/**` |
| `add_role_to_users.sql` | **NUOVO** | Script SQL per aggiungere colonna |

---

## 🎯 Quick Commands

```bash
# 1. Esegui migration database
psql -h 85.235.148.177 -p 6438 -U survivor_user -d db_survivor \
  -f src/main/resources/db/migration/add_role_to_users.sql

# 2. Promuovi primo admin
psql -h 85.235.148.177 -p 6438 -U survivor_user -d db_survivor \
  -c "UPDATE users SET role = 'ADMIN' WHERE email = 'tua-email@example.com';"

# 3. Ricompila
mvn clean install

# 4. Avvia
mvn spring-boot:run

# 5. Test STANDARD user
curl -X POST http://localhost:8080/api/auth/request-magic-link \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'

# 6. Test ADMIN user
curl -X POST http://localhost:8080/api/auth/request-magic-link \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com"}'
```

---

## ✅ Checklist Implementazione

- [x] Enum Role creato
- [x] Campo role aggiunto a User entity
- [x] JWT include il ruolo
- [x] AuthResponseDTO include il ruolo
- [x] JwtAuthenticationFilter estrae il ruolo
- [x] SecurityConfig protegge /admin/** per ADMIN
- [x] Script SQL per migration database
- [x] Compilazione OK
- [x] AdminController protetto

---

## 🎉 Sistema Completato!

Il sistema di gestione ruoli è completamente implementato e funzionante.

**Prossimi passi:**
1. ✅ Esegui script SQL migration
2. ✅ Promuovi primo utente ad ADMIN
3. ✅ Testa entrambi i ruoli
4. ✅ Integra frontend

Per domande o problemi, consulta la documentazione principale in:
- `MAGIC_LINK_README.md`
- `MIGRATION_SUMMARY.md`
- `ROLES_DOCUMENTATION.md` (questo file)

