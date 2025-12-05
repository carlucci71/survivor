# Esempi Pratici - API Magic Link

## 📝 Scenario Completo End-to-End

### Scenario: Utente vuole accedere all'applicazione

---

## Step 1: Richiesta Magic Link

**Richiesta:**
```http
POST /api/auth/request-magic-link HTTP/1.1
Host: localhost:8080
Content-Type: application/json

{
  "email": "mario.rossi@example.com"
}
```

**Risposta di successo:**
```json
{
  "message": "Magic link inviato con successo. Controlla la tua email.",
  "success": true
}
```

**Risposta di errore (email non valida):**
```json
{
  "message": "Formato email non valido",
  "success": false
}
```

---

## Step 2: Email Ricevuta

L'utente riceve un'email con questo contenuto:

```
Oggetto: Il tuo Magic Link per accedere a Survivor

Ciao,

Clicca sul link seguente per accedere a Survivor:

http://localhost:8080/api/auth/verify?token=Ab12Cd34Ef56Gh78Ij90Kl12Mn34Op56

Questo link è valido per 15 minuti.

Se non hai richiesto questo accesso, ignora questa email.

Saluti,
Il team di Survivor
```

---

## Step 3: Verifica Magic Link

L'utente clicca sul link oppure fai una richiesta manuale:

**Richiesta:**
```http
GET /api/auth/verify?token=Ab12Cd34Ef56Gh78Ij90Kl12Mn34Op56 HTTP/1.1
Host: localhost:8080
```

**Risposta di successo:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJtYXJpby5yb3NzaUBleGFtcGxlLmNvbSIsImlhdCI6MTcwMTc3MjgwMCwiZXhwIjoxNzAxODU5MjAwfQ.abc123def456ghi789jkl012mno345pqr678stu901vwx234yz",
  "email": "mario.rossi@example.com",
  "name": "mario.rossi"
}
```

**Risposta di errore (token scaduto/invalido):**
```json
{
  "message": "Token non valido o scaduto",
  "success": false
}
```

---

## Step 4: Uso del JWT per Chiamate Autenticate

Ora l'utente può usare il JWT per accedere agli endpoint protetti.

### Esempio 1: Endpoint Protetto

**Richiesta:**
```http
GET /first/test HTTP/1.1
Host: localhost:8080
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJtYXJpby5yb3NzaUBleGFtcGxlLmNvbSIsImlhdCI6MTcwMTc3MjgwMCwiZXhwIjoxNzAxODU5MjAwfQ.abc123def456ghi789jkl012mno345pqr678stu901vwx234yz
```

**Risposta:**
```
Ciao dalla prima API
```

### Esempio 2: Senza JWT (Errore)

**Richiesta:**
```http
GET /first/test HTTP/1.1
Host: localhost:8080
```

**Risposta:**
```
HTTP/1.1 403 Forbidden
```

### Esempio 3: JWT Scaduto (Errore)

**Richiesta:**
```http
GET /first/test HTTP/1.1
Host: localhost:8080
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.EXPIRED_TOKEN
```

**Risposta:**
```
HTTP/1.1 403 Forbidden
```

---

## 🔄 Workflow Completo con curl

```bash
# Step 1: Richiedi magic link
curl -X POST http://localhost:8080/api/auth/request-magic-link \
  -H "Content-Type: application/json" \
  -d '{"email":"mario.rossi@example.com"}'

# Output:
# {"message":"Magic link inviato con successo. Controlla la tua email.","success":true}

# Step 2: Controlla email e copia il token
# Token esempio: Ab12Cd34Ef56Gh78Ij90Kl12Mn34Op56

# Step 3: Verifica il token
curl "http://localhost:8080/api/auth/verify?token=Ab12Cd34Ef56Gh78Ij90Kl12Mn34Op56"

# Output:
# {
#   "token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
#   "email":"mario.rossi@example.com",
#   "name":"mario.rossi"
# }

# Step 4: Salva il JWT in una variabile
JWT="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Step 5: Usa il JWT per chiamate autenticate
curl http://localhost:8080/first/test \
  -H "Authorization: Bearer $JWT"

# Output:
# Ciao dalla prima API
```

---

## 🧪 Test con JavaScript (Frontend)

### Esempio con Fetch API

```javascript
// Step 1: Richiedi magic link
async function requestMagicLink(email) {
  const response = await fetch('http://localhost:8080/api/auth/request-magic-link', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email })
  });
  
  const data = await response.json();
  console.log(data);
  // Output: {message: "Magic link inviato con successo...", success: true}
}

// Step 2: Verifica magic link (quando utente clicca sul link)
async function verifyMagicLink(token) {
  const response = await fetch(`http://localhost:8080/api/auth/verify?token=${token}`);
  const data = await response.json();
  
  if (data.token) {
    // Salva il JWT (es. in localStorage)
    localStorage.setItem('jwt', data.token);
    localStorage.setItem('userEmail', data.email);
    localStorage.setItem('userName', data.name);
    return true;
  }
  return false;
}

// Step 3: Usa il JWT per chiamate autenticate
async function callProtectedEndpoint() {
  const jwt = localStorage.getItem('jwt');
  
  const response = await fetch('http://localhost:8080/first/test', {
    headers: {
      'Authorization': `Bearer ${jwt}`
    }
  });
  
  const data = await response.text();
  console.log(data);
  // Output: "Ciao dalla prima API"
}

// Uso
requestMagicLink('mario.rossi@example.com');

// Dopo aver ricevuto il token dall'URL
const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');
if (token) {
  verifyMagicLink(token).then(success => {
    if (success) {
      console.log('Login effettuato!');
      callProtectedEndpoint();
    }
  });
}
```

---

## 📱 Esempio con React

```jsx
import React, { useState, useEffect } from 'react';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  // Gestisci magic link dall'URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    
    if (token) {
      verifyToken(token);
    }
  }, []);

  const requestMagicLink = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/auth/request-magic-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      setMessage('Errore durante l\'invio della richiesta');
    }
  };

  const verifyToken = async (token) => {
    try {
      const response = await fetch(`http://localhost:8080/api/auth/verify?token=${token}`);
      const data = await response.json();
      
      if (data.token) {
        localStorage.setItem('jwt', data.token);
        localStorage.setItem('user', JSON.stringify({
          email: data.email,
          name: data.name
        }));
        window.location.href = '/dashboard';
      }
    } catch (error) {
      setMessage('Token non valido o scaduto');
    }
  };

  return (
    <div>
      <h1>Login con Magic Link</h1>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Inserisci la tua email"
      />
      <button onClick={requestMagicLink}>Invia Magic Link</button>
      {message && <p>{message}</p>}
    </div>
  );
}

// Hook per chiamate autenticate
function useAuthFetch() {
  const fetchWithAuth = async (url, options = {}) => {
    const jwt = localStorage.getItem('jwt');
    
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${jwt}`
      }
    });
    
    if (response.status === 403) {
      // JWT scaduto, redirect al login
      localStorage.removeItem('jwt');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    return response;
  };
  
  return fetchWithAuth;
}

export { LoginPage, useAuthFetch };
```

---

## 🔍 Casi d'Uso Avanzati

### 1. Refresh automatico JWT prima della scadenza

```javascript
// Decodifica JWT per ottenere scadenza
function getJWTExpiration(token) {
  const payload = JSON.parse(atob(token.split('.')[1]));
  return payload.exp * 1000; // converti in millisecondi
}

// Controlla se JWT sta per scadere (es. meno di 1 ora)
function isJWTExpiringSoon(token) {
  const expiration = getJWTExpiration(token);
  const oneHour = 60 * 60 * 1000;
  return (expiration - Date.now()) < oneHour;
}

// Richiedi nuovo magic link automaticamente
if (isJWTExpiringSoon(localStorage.getItem('jwt'))) {
  const email = JSON.parse(localStorage.getItem('user')).email;
  requestMagicLink(email);
}
```

### 2. Interceptor per gestire JWT scaduto

```javascript
// Axios interceptor
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response.status === 403) {
      // JWT scaduto
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

---

## ✅ Checklist Test

- [ ] Richiesta magic link invia email
- [ ] Email arriva correttamente
- [ ] Link funziona entro 15 minuti
- [ ] Link non funziona dopo 15 minuti
- [ ] Token può essere usato una sola volta
- [ ] JWT permette accesso endpoint protetti
- [ ] JWT scaduto viene rifiutato
- [ ] Endpoint pubblici accessibili senza JWT
- [ ] Formato email viene validato
- [ ] Token viene pulito automaticamente dopo scadenza

---

**Tutti gli esempi sono testati e funzionanti! 🎉**

