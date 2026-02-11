# 🔔 SISTEMA NOTIFICHE IN-APP - IMPLEMENTAZIONE COMPLETATA

## ✅ COSA HO FATTO

### 1. **Migration Database** 
- ✅ `migration_add_notification_image_url.sql` - Aggiunge campo `image_url` alla tabella `notification`

**Esegui su PostgreSQL:**
```sql
psql -U postgres -d survivor_db -f "C:\Users\ddari\Desktop\survivor\db\migration_add_notification_image_url.sql"
```

---

### 2. **Frontend Angular - Componenti Creati**

#### **Service: `notification.service.ts`**
- Gestisce chiamate API al backend (`GET /push`, `POST /push/{id}/read`)
- Polling automatico ogni 30 secondi
- Observable per notifiche e conteggio non lette
- Metodi:
  - `getNotifications(userId, activeOnly)` - Recupera notifiche
  - `markAsRead(notificationId)` - Marca come letta
  - `startPolling(userId)` - Avvia polling automatico
  - `stopPolling()` - Ferma polling

#### **Component: `notification-bell.component`**
- Campanella in header (top-right)
- Badge rosso con numero notifiche non lette
- Menu dropdown Material con lista notifiche
- Features:
  - ✅ Mostra ultime 5 notifiche
  - ✅ Icona dinamica per tipo notifica
  - ✅ Timestamp "tempo fa" (es: "5m fa", "2h fa")
  - ✅ Marca come letta al click
  - ✅ Responsive mobile/desktop
  - ✅ Traduzioni IT/EN

#### **Modelli TypeScript**
- `Notification` interface aggiunta in `interfaces.model.ts`

---

### 3. **Integrazione Header**
- ✅ Campanella aggiunta nell'header tra "Indietro" e "Logout"
- ✅ Visibile solo per utenti autenticati (`visLogout === 'S'`)

---

### 4. **Traduzioni**
- ✅ IT: `NOTIFICATIONS.TITLE`, `NOTIFICATIONS.NO_NOTIFICATIONS`, ecc.
- ✅ EN: Traduzioni complete

---

## 🚀 COME FUNZIONA

### **Flusso Utente:**
1. Utente fa **login** → Header mostra campanella 🔔
2. **Polling automatico** ogni 30s chiama `GET /push?userId=X&active=true`
3. Backend risponde con notifiche attive (non lette + non scadute)
4. Badge rosso mostra **numero non lette** (es: "3")
5. Click su campanella → **Menu dropdown** con lista notifiche
6. Click su notifica → **Marca come letta** + aggiorna badge

### **Polling:**
- ✅ Avvio automatico quando header si carica
- ✅ Stop automatico quando componente viene distrutto
- ✅ Intervallo: **30 secondi**

---

## 🎨 DESIGN

### **Colori App:**
- Primario: `#0A3D91` (Blu scuro)
- Secondario: `#4FC3F7` (Azzurro)
- Badge: Rosso Material (`matBadgeColor="warn"`)

### **Layout:**
- Header gradiente blu: `linear-gradient(135deg, #0A3D91, #4FC3F7)`
- Icone dinamiche per tipo:
  - `MATCH_STARTING` → ⚽ `sports_soccer`
  - `MATCH_REMINDER` → ⏰ `alarm`
  - `LEAGUE_UPDATE` → 🔄 `update`
  - `INFO` → ℹ️ `info`

### **Responsive:**
- Desktop: Menu 360-400px
- Mobile: Menu 90-95vw (adatta schermo)

---

## 🧪 TEST

### **Test 1: Verifica Visibilità**
1. Fai login
2. Vai su home
3. ✅ Verifica campanella in header (top-right)

### **Test 2: Notifica Fittizia**
Usa l'endpoint di test backend:
```bash
curl -X GET "http://localhost:8389/api/survivorBe/push/notificaFittizia/{userId}?type=MATCH_STARTING&minutesExpiring=60"
```

Sostituisci `{userId}` con il tuo ID.

Dopo 30s (o ricarica pagina):
- ✅ Badge rosso appare con "1"
- ✅ Click campanella → Vedi notifica

### **Test 3: Marca come Letta**
1. Click su notifica nel menu
2. ✅ Badge decrementa
3. ✅ Pallino blu (unread indicator) scompare

### **Test 4: Responsive Mobile**
1. F12 → Device Toolbar → iPhone
2. Click campanella
3. ✅ Menu occupa 90% larghezza schermo

---

## 📊 API BACKEND UTILIZZATE

| Endpoint | Metodo | Descrizione |
|----------|--------|-------------|
| `/push?userId=X&active=true` | GET | Recupera notifiche attive |
| `/push/{id}/read` | POST | Marca notifica come letta |
| `/push/notificaFittizia/{userId}` | GET | Test manuale (solo dev) |

---

## 🔮 PROSSIMI STEP (OPZIONALE)

### **Fase 2: Push Native (Opzione B)**
Quando pronto per notifiche anche **app chiusa**:

1. **Setup Firebase**:
   - File `google-services.json` (Android)
   - File `GoogleService-Info.plist` (iOS)
   - Variabili env backend:
     ```
     PUSH_FCM_ENABLED=true
     PUSH_FCM_CREDENTIALS_PATH=/path/to/service-account.json
     ```

2. **Integra `push.service.ts` esistente**:
   - Dopo login → Chiama `POST /push/register` con token FCM
   - Listener `pushNotificationReceived` → Aggiorna badge in-app

3. **Scheduler Backend**:
   - Completa `findUpcomingMatches()` in `ScheduledPushNotifications.java`
   - Completa `findUsersToNotifyForMatch()`
   - Test invio automatico T-1h

4. **WebSocket (Opzionale)**:
   - Real-time sync senza polling
   - Server-Sent Events (SSE) come alternativa

---

## 🐛 TROUBLESHOOTING

### **Badge non appare**
- Verifica login funzionante
- Controlla console browser: errori chiamata `/push`?
- Verifica backend attivo su porta `8389`

### **Polling non parte**
- Controlla `AuthService.getCurrentUser()` restituisce user con ID
- Verifica `ngOnInit()` del componente campanella

### **Notifiche non si vedono**
- Esegui migration SQL per `image_url`
- Verifica tabella `notification` con dati:
  ```sql
  SELECT * FROM notification WHERE user_id = {tuo_id};
  ```

### **Traduzioni mancanti**
- Hard refresh (Ctrl+Shift+R)
- Verifica file `it.json` e `en.json` aggiornati

---

## 📁 FILE CREATI/MODIFICATI

### **Nuovi File:**
```
db/migration_add_notification_image_url.sql
src/app/core/services/notification.service.ts
src/app/shared/components/notification-bell/notification-bell.component.ts
src/app/shared/components/notification-bell/notification-bell.component.html
src/app/shared/components/notification-bell/notification-bell.component.scss
```

### **File Modificati:**
```
src/app/core/models/interfaces.model.ts (+ Notification interface)
src/app/shared/components/header/header.component.ts (+ campanella)
src/assets/i18n/it.json (+ traduzioni NOTIFICATIONS)
src/assets/i18n/en.json (+ traduzioni NOTIFICATIONS)
```

---

## ✨ CARATTERISTICHE

- ✅ **Polling automatico** ogni 30s
- ✅ **Badge dinamico** con conteggio
- ✅ **Material Design** coerente con app
- ✅ **Responsive** mobile/desktop
- ✅ **Traduzioni** IT/EN
- ✅ **Icone dinamiche** per tipo notifica
- ✅ **Timestamp relativo** (es: "5m fa")
- ✅ **Gestione unread/read**
- ✅ **Performance ottimizzate** (RxJS Observables)
- ✅ **Styling app colors** (blu #0A3D91)

---

## 🎉 PRONTO ALL'USO!

Il sistema notifiche **In-App (Opzione A)** è **completamente implementato** e pronto per il test!

**Prossimi passi:**
1. Esegui migration SQL
2. Riavvia frontend
3. Fai login
4. Testa con endpoint `/notificaFittizia`
5. 🎊 Enjoy!

