# Survivor App — Istruzioni di progetto

Progetto "Survivor": app di pronostici/eliminazione a squadre (modalità Survivor ed Campionato).
- `survivor_webapp/`: frontend Angular + Capacitor (Android/iOS), Angular Material.
- `survivor_backend/`: backend Java Spring Boot (Maven).

## Regole sempre valide

1. **Multilingua obbligatoria**: nessun testo hardcoded nei componenti. Tutte le stringhe rivolte all'utente passano da `survivor_webapp/src/assets/i18n/it.json`, `en.json`, `es.json` tramite il pipe `| translate` (ngx-translate). Ogni nuova chiave va aggiunta in tutti e tre i file.

2. **Coerenza visiva col tema esistente**: usare le CSS variable definite in `survivor_webapp/src/themes.scss` (es. `var(--gradient-primary)`, `var(--bg-card)`, `var(--text-primary)`, `var(--shadow-xl)`, ecc.) invece di colori fissi, così i componenti restano coerenti con i temi ambiente (dev = verde, test = rosso, prod = blu/navy). Colori hardcoded solo per scelte di design deliberatamente "speciali" (es. una schermata di celebrazione).

3. **Verificare le modifiche UI dal vivo**: prima di considerare finita una modifica visiva, avviare il dev server (`.claude/launch.json` → configurazione `survivor_webapp`) e controllarla nel browser, non solo leggendo il codice. **Eccezione**: per le pagine che richiedono login (quasi tutta l'app autenticata) NON aprire la webapp per verificare — Dario controlla lui stesso dal vivo. Verificare solo con build (`tsc --noEmit`, `ng build --configuration production`, `mvn compile`) e, se serve controllare visivamente qualcosa che NON richiede login (es. un singolo asset, un'icona in isolamento), farlo con una pagina di test a parte, non aprendo la webapp vera.

4. **Responsive su tutti i dispositivi**: ogni modifica UI deve essere testata e funzionare correttamente sia su schermi piccoli (mobile, ~320-360px di larghezza) sia su desktop, senza overflow orizzontale né elementi tagliati o sovrapposti.

5. **Vincolo sigla+nazione sulla tabella `squadra`**: due squadre della stessa nazione non possono condividere la sigla, anche se sono di campionati diversi (es. una squadra sale/scende tra Serie A e Serie B mantenendo lo stesso nome). Se una nuova squadra vorrebbe una sigla già usata da un'altra, non riusarla: crearne una interna diversa (es. `PISB` per la Pisa di Serie B, quando `PIS` di Serie A era già occupata) — l'enum `IEnumSquadre` separa già sigla interna (`name()`, quella nel DB) da sigla esterna (`siglaEsterna`, quella dell'API), quindi l'API esterna continua a restituire il codice reale anche se internamente usiamo un nome diverso. Prima di un `UPDATE`/`INSERT` su `squadra` in prod, controllare sempre se la riga coinvolta ha già `giocata` storiche collegate (spostare una riga già scelta da qualcuno falserebbe la sua storia).

6. **Testare il `calcola()` di un campionato senza aspettare risultati reali**: usare il sistema mock del backend (`MockController`, endpoint `/mock/**`, richiede il profilo Spring `CALENDARIO_MOCK` attivo e un token con ruolo ADMIN) — permette di impostare punteggi e una data di riferimento finta su leghe di prova nel DB di test, senza toccare gli altri sport che restano su `CALENDARIO_API2`. Attenzione: nel mock una partita diventa "TERMINATA" solo 2 ore dopo il suo orario (prima resta "IN_CORSO"), quindi la data di riferimento va spostata oltre quella soglia per l'ultima partita della squadra scelta.
