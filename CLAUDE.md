# Survivor App — Istruzioni di progetto

Progetto "Survivor": app di pronostici/eliminazione a squadre (modalità Survivor ed Campionato).
- `survivor_webapp/`: frontend Angular + Capacitor (Android/iOS), Angular Material.
- `survivor_backend/`: backend Java Spring Boot (Maven).

## Regole sempre valide

1. **Multilingua obbligatoria**: nessun testo hardcoded nei componenti. Tutte le stringhe rivolte all'utente passano da `survivor_webapp/src/assets/i18n/it.json`, `en.json`, `es.json` tramite il pipe `| translate` (ngx-translate). Ogni nuova chiave va aggiunta in tutti e tre i file.

2. **Coerenza visiva col tema esistente**: usare le CSS variable definite in `survivor_webapp/src/themes.scss` (es. `var(--gradient-primary)`, `var(--bg-card)`, `var(--text-primary)`, `var(--shadow-xl)`, ecc.) invece di colori fissi, così i componenti restano coerenti con i temi ambiente (dev = verde, test = rosso, prod = blu/navy). Colori hardcoded solo per scelte di design deliberatamente "speciali" (es. una schermata di celebrazione).

3. **Verificare le modifiche UI dal vivo**: prima di considerare finita una modifica visiva, avviare il dev server (`.claude/launch.json` → configurazione `survivor_webapp`) e controllarla nel browser, non solo leggendo il codice.

4. **Responsive su tutti i dispositivi**: ogni modifica UI deve essere testata e funzionare correttamente sia su schermi piccoli (mobile, ~320-360px di larghezza) sia su desktop, senza overflow orizzontale né elementi tagliati o sovrapposti.
