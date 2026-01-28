# Guida Setup Push Notifications Backend

## 📋 Struttura implementata

### 1. Entity e Repository
- ✅ `PushToken` - Entity per salvare i token push degli utenti
- ✅ `PushTokenRepository` - Repository con query per gestire i token

### 2. Service Layer
- ✅ `PushNotificationService` - Gestisce registrazione token e invio notifiche via FCM
  - Inizializzazione Firebase Admin SDK
  - Registrazione/aggiornamento token per utente autenticato
  - Invio notifiche a uno o più utenti
  - Gestione token invalidi (auto-disattivazione)
  - Supporto Android e iOS

### 3. Controller
- ✅ `PushController` - Endpoint REST per registrazione token
  - `POST /push/register` - Registra token da app mobile (autenticato)
  - `DELETE /push/token` - Disattiva token

### 4. Scheduler
- ✅ `ScheduledPushNotifications` - Job schedulato ogni 15 minuti
  - **TODO**: Inserisci la tua query custom in `findUpcomingMatches()`
  - **TODO**: Inserisci la logica in `findUsersToNotifyForMatch()`
  - Invia notifiche T-1h (finestra 50-70 minuti prima)

### 5. Configurazione
- ✅ `application.yaml` - Variabili env per FCM e toggle
- ✅ `pom.xml` - Dipendenza `firebase-admin:9.2.0`
- ✅ `SecurityConfig` - Endpoint `/push/**` autenticato
- ✅ Migration SQL - Tabella `push_token`

---

## 🚀 Setup Firebase Cloud Messaging (FCM)

### 1. Crea progetto Firebase
1. Vai su [Firebase Console](https://console.firebase.google.com/)
2. Crea nuovo progetto o usa uno esistente
3. Vai su **Project Settings** → **Service accounts**
4. Clicca **Generate new private key** → scarica il file JSON

### 2. Configura credenziali BE (una delle due opzioni)

**Opzione A: File JSON**
```bash
# Metti il file google-service-account.json in una cartella sicura
# poi imposta la variabile env:
PUSH_FCM_CREDENTIALS_PATH=/path/to/google-service-account.json
```

**Opzione B: JSON inline (env var)**
```bash
# Oppure passa tutto il JSON come variabile env (base64 o escaped):
PUSH_FCM_CREDENTIALS_JSON='{"type":"service_account","project_id":"...","private_key":"..."}'
```

### 3. Abilita le notifiche
```bash
PUSH_NOTIFICATIONS_ENABLED=true
PUSH_FCM_ENABLED=true
```

---

## 📱 Setup Mobile (Capacitor)

### Android

1. **Aggiungi google-services.json**
   ```bash
   # Scarica da Firebase Console → Project Settings → General → Your apps → Android
   # Metti il file in:
   android/app/google-services.json
   ```

2. **Aggiungi plugin FCM in android/build.gradle**
   ```gradle
   classpath 'com.google.gms:google-services:4.3.15'
   ```

3. **In android/app/build.gradle aggiungi**
   ```gradle
   apply plugin: 'com.google.gms.google-services'
   ```

### iOS

1. **Aggiungi GoogleService-Info.plist**
   ```bash
   # Scarica da Firebase Console → Project Settings → General → Your apps → iOS
   # Metti il file in:
   ios/App/App/GoogleService-Info.plist
   ```

2. **Abilita Push Notifications in Xcode**
   - Apri `ios/App/App.xcworkspace`
   - Vai su **Signing & Capabilities**
   - Clicca **+ Capability** → **Push Notifications**
   - Clicca **+ Capability** → **Background Modes** → abilita **Remote notifications**

3. **Configura APNs su Firebase**
   - Vai su Firebase Console → Project Settings → Cloud Messaging → iOS
   - Carica il certificato APNs (.p8 o .p12) generato da Apple Developer

### Sync e build

```bash
# Dopo aver aggiunto i file:
npx cap sync

# Apri i progetti nativi:
npx cap open android
npx cap open ios
```

---

## 🔧 TODO - Query personalizzate

Nel file `ScheduledPushNotifications.java` devi implementare:

### 1. `findUpcomingMatches(windowStart, windowEnd)`
Trova le partite in arrivo nella finestra T-1h:
```java
// Esempio query custom:
@Query("SELECT p FROM Partita p WHERE p.orario BETWEEN :start AND :end " +
       "AND p.stato = :stato " +
       "AND EXISTS (SELECT l FROM Lega l WHERE l.campionato.id = p.campionato.id AND l.stato != :terminata)")
List<Partita> findUpcomingMatchesWithActiveLeagues(
    @Param("start") LocalDateTime start, 
    @Param("end") LocalDateTime end,
    @Param("stato") Enumeratori.StatoPartita stato,
    @Param("terminata") Enumeratori.StatoLega terminata
);
```

### 2. `findUsersToNotifyForMatch(Partita partita)`
Trova gli utenti da notificare per quella partita:
```java
// Strategia A: Tutti i membri delle leghe del campionato
// Strategia B: Solo chi non ha ancora giocato la giornata
// Strategia C: Tutti gli utenti attivi nelle leghe collegate
```

---

## 🧪 Test

### Test endpoint registrazione
```bash
# Autentica e ottieni JWT
curl -X POST http://localhost:8080/api/survivorBe/push/register \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "token": "fake-fcm-token-12345",
    "platform": "android",
    "deviceId": "device-uuid"
  }'
```

### Test invio manuale (da service)
Aggiungi un controller di test admin per verificare:
```java
@PostMapping("/admin/test-push/{userId}")
public ResponseEntity<Void> testPush(@PathVariable Long userId) {
    pushNotificationService.sendNotificationToUser(userId, 
        PushNotificationDTO.builder()
            .title("Test")
            .body("Notifica di test")
            .build()
    );
    return ResponseEntity.ok().build();
}
```

---

## 📝 Variabili Environment richieste

```bash
# Database (già esistenti)
DB_URL=jdbc:postgresql://...
DB_USER=...
DB_PASSWORD=...

# Push notifications
PUSH_NOTIFICATIONS_ENABLED=true
PUSH_FCM_ENABLED=true
PUSH_FCM_CREDENTIALS_PATH=/path/to/google-service-account.json
# OPPURE
PUSH_FCM_CREDENTIALS_JSON={"type":"service_account",...}
```

---

## 🎯 Prossimi passi

1. ✅ Esegui migration SQL per creare tabella `push_token`
2. ✅ Compila il BE con `change-java 21 && mvn clean install`
3. 🔄 Configura Firebase e scarica credenziali
4. 🔄 Aggiungi `google-services.json` e `GoogleService-Info.plist` nel mobile
5. 🔄 Esegui `npx cap sync` e apri i progetti nativi
6. 🔄 Implementa le query custom nello scheduler
7. ✅ Avvia il BE e testa la registrazione token
8. ✅ Verifica che lo scheduler invii notifiche T-1h

---

## 📚 Note aggiuntive

- Le notifiche vengono inviate **anche ad app chiusa** (gestite dal SO)
- FCM funziona sia per iOS che Android
- I token invalidi vengono automaticamente disattivati
- Lo scheduler gira ogni 15 min per evitare duplicati (finestra 50-70 min)
- Puoi personalizzare titolo/body/sound/data payload
- Deep link: aggiungi `data.deepLink` e gestiscilo in `pushNotificationActionPerformed`
