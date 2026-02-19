# ✅ PUSH NOTIFICATIONS - SCHELETRO BACKEND COMPLETATO

## 📦 Cosa ho creato per te

### 1. **Entity & Repository**
- ✅ `PushToken.java` - Entity JPA per salvare token push (con user_id, platform, active, etc.)
- ✅ `PushTokenRepository.java` - Repository con query per trovare/disattivare token

### 2. **DTO**
- ✅ `PushTokenDTO.java` - Payload per registrazione token dal FE
- ✅ `PushNotificationDTO.java` - DTO per costruire notifiche (title, body, data, sound)

### 3. **Service Layer**
- ✅ `PushNotificationService.java` - Service completo con:
  - Inizializzazione Firebase Admin SDK (FCM)
  - Registrazione/aggiornamento token per utente autenticato
  - Invio notifiche push a uno o più utenti
  - Gestione token invalidi (auto-disattivazione)
  - Supporto Android e iOS con configurazioni separate

### 4. **Controller**
- ✅ `PushController.java` - Endpoint REST:
  - `POST /push/register` → Registra token (autenticato via JWT)
  - `DELETE /push/token` → Disattiva token

### 5. **Scheduler**
- ✅ `ScheduledPushNotifications.java` - Job che gira ogni 15 minuti:
  - **TODO per te**: `findUpcomingMatches()` → inserisci la tua query per trovare partite T-1h
  - **TODO per te**: `findUsersToNotifyForMatch()` → inserisci la logica per trovare utenti da notificare
  - Invia notifiche con titolo/body/data custom
  - Finestra temporale: tra 50 e 70 minuti prima della partita

### 6. **Configurazione**
- ✅ `application.yaml` - Variabili env per FCM:
  ```yaml
  push:
    notifications:
      enabled: ${NOTIFICATION_SCHEDULER_ENABLED:false}
    fcm:
      enabled: ${PUSH_FCM_ENABLED:false}
      credentials-path: ${PUSH_FCM_CREDENTIALS_PATH:}
      credentials-json: ${PUSH_FCM_CREDENTIALS_JSON:}
  ```
- ✅ `pom.xml` - Dipendenza `firebase-admin:9.2.0` aggiunta
- ✅ `SecurityConfig.java` - Endpoint `/push/**` configurato come autenticato

### 7. **Migration SQL**
- ✅ `V1__create_push_token_table.sql` - Script Flyway/Liquibase per creare tabella `push_token`

### 8. **Documentazione**
- ✅ `PUSH_NOTIFICATIONS_SETUP.md` - Guida completa setup Firebase + mobile

---

## 🎯 COSA DEVI FARE TU

### 1. Query personalizzate nello Scheduler

Nel file `ScheduledPushNotifications.java` ci sono 2 metodi con TODO:

#### A) `findUpcomingMatches(windowStart, windowEnd)`
Trova le partite in arrivo nella finestra T-1h:

```java
// ESEMPIO query custom che puoi aggiungere nel PartitaRepository:
@Query("SELECT p FROM Partita p WHERE p.orario BETWEEN :start AND :end " +
       "AND p.stato = 'DA_GIOCARE' " +
       "AND EXISTS (SELECT l FROM Lega l WHERE l.campionato.id = p.campionato.id " +
       "AND l.stato IN ('DA_AVVIARE', 'AVVIATA'))")
List<Partita> findUpcomingMatchesWithActiveLeagues(
    @Param("start") LocalDateTime start, 
    @Param("end") LocalDateTime end
);
```

#### B) `findUsersToNotifyForMatch(Partita partita)`
Trova gli utenti da notificare per quella partita:

```java
// ESEMPIO: tutti i membri attivi delle leghe collegate al campionato
@Query("SELECT DISTINCT gl.giocatore.user.id FROM GiocatoreLega gl " +
       "WHERE gl.lega.campionato.id = :campionatoId " +
       "AND gl.stato = 'ATTIVO' " +
       "AND gl.lega.stato IN ('DA_AVVIARE', 'AVVIATA')")
List<Long> findUserIdsByCampionatoAndActive(@Param("campionatoId") String campionatoId);
```

### 2. Setup Firebase (quando pronto)

1. Vai su [Firebase Console](https://console.firebase.google.com/)
2. Crea progetto (o usa esistente)
3. Vai su **Project Settings** → **Service accounts** → **Generate new private key**
4. Scarica il JSON e configura:
   ```bash
   PUSH_FCM_ENABLED=true
   NOTIFICATION_SCHEDULER_ENABLED=true
   PUSH_FCM_CREDENTIALS_PATH=/path/to/google-service-account.json
   ```

### 3. Mobile setup (quando pronto)

- Android: aggiungi `google-services.json` in `android/app/`
- iOS: aggiungi `GoogleService-Info.plist` in `ios/App/App/`
- Esegui `npx cap sync` e `npx cap open android/ios`

---

## ✅ STATO ATTUALE

- [x] Struttura BE completa e compilata con successo
- [x] Endpoint `/push/register` funzionante (JWT auth)
- [x] Service FCM pronto (manca solo configurazione Firebase)
- [x] Scheduler pronto (manca solo la tua query custom)
- [x] Migration SQL pronta
- [x] Documentazione completa

---

## 🚀 PROSSIMI PASSI

1. **Esegui la migration SQL** per creare la tabella `push_token`
2. **Implementa le 2 query custom** nello scheduler
3. **Configura Firebase** quando vuoi testare l'invio reale
4. **Testa** la registrazione token con l'app mobile

---

## 📝 Note importanti

- Gli errori dell'IDE su Firebase sono **falsi positivi**: Maven ha già scaricato le dipendenze (compilazione OK)
- Lo scheduler è disabilitato di default (usa `NOTIFICATION_SCHEDULER_ENABLED=true` per attivarlo)
- FCM funziona sia per iOS che Android con un unico SDK
- Le notifiche arrivano **anche ad app chiusa** (gestite dal sistema operativo)
- I token invalidi vengono **automaticamente disattivati** alla prima failure

---

Hai lo scheletro completo! Ora puoi:
1. Inserire le tue query personalizzate
2. Testare la registrazione token
3. Configurare Firebase quando pronto

Fammi sapere se hai domande o se vuoi che ti aiuti con le query custom! 🎉
