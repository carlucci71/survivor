# Survivor App — Istruzioni di progetto

Progetto "Survivor": app di pronostici/eliminazione a squadre (modalità Survivor ed Campionato).
- `survivor_webapp/`: frontend Angular + Capacitor (Android/iOS), Angular Material.
- `survivor_backend/`: backend Java Spring Boot (Maven).

## Regole sempre valide

1. **Multilingua obbligatoria**: nessun testo hardcoded nei componenti. Tutte le stringhe rivolte all'utente passano da `survivor_webapp/src/assets/i18n/it.json`, `en.json`, `es.json` tramite il pipe `| translate` (ngx-translate). Ogni nuova chiave va aggiunta in tutti e tre i file.

2. **Coerenza visiva col tema esistente**: usare le CSS variable definite in `survivor_webapp/src/themes.scss` (es. `var(--gradient-primary)`, `var(--bg-card)`, `var(--text-primary)`, `var(--shadow-xl)`, ecc.) invece di colori fissi, così i componenti restano coerenti con i temi ambiente (dev = verde, test = rosso, prod = blu/navy). Colori hardcoded solo per scelte di design deliberatamente "speciali" (es. una schermata di celebrazione).

3. **Non aprire il browser per verificare le modifiche UI, se non richiesto**: NON lanciare dev server, preview, pagine di test o il browser integrato per controllare una modifica visiva — Dario controlla lui stesso dal vivo e, se vuole che io guardi qualcosa, lo chiede esplicitamente. Verificare solo con build (`tsc --noEmit`, `ng build --configuration production`, `mvn compile`, poi `rm -rf dist`) e dire chiaramente nella risposta che la parte visiva non è stata vista dal vivo. Vale anche per pagine che non richiedono login e per le anteprime "isolate": se serve mostrare un'anteprima, aspettare che venga chiesta.

4. **Responsive su tutti i dispositivi**: ogni modifica UI deve essere testata e funzionare correttamente sia su schermi piccoli (mobile, ~320-360px di larghezza) sia su desktop, senza overflow orizzontale né elementi tagliati o sovrapposti.

8. **Aggiornare la guida ad ogni nuova funzionalità**: ogni volta che si introduce qualcosa di NUOVO nell'app (una feature, non un semplice restyling visivo) va aggiornata anche la Guida (`survivor_webapp/src/app/features/public/guida.component.ts`, linkata nel footer dell'app) — non solo `CLAUDE.md`. La guida è la spiegazione rivolta all'utente finale, quindi va scritta in modo semplice e nella stessa lingua/tono delle altre sezioni, con le chiavi aggiunte in tutti e tre i file i18n. Un restyling (nuovi colori, animazioni, layout) NON richiede una nuova sezione in guida, a meno che cambi anche il comportamento per l'utente.

9. **File con CRLF**: quando si patchano file con script, normalizzare i fine riga prima (sostituire CRLF con LF) e riconvertire una volta sola, altrimenti compaiono righe con doppio ritorno a capo (CR CR LF).

## Indice dei documenti per area (leggere il file quando si lavora su quell'area)

Il dettaglio completo (decisioni, strade scartate, trappole già incontrate) sta in `docs/`. Nulla è stato tolto: le regole lunghe sono state spostate qui sotto, con testo invariato.

- `docs/sfida-1v1.md` — duello 1v1: riconoscimento (`maxPartecipanti = 2`), guard in `calcola()`, colori/bronzo, inviti e condivisione, scheda `duel-versus`, popup vittoria.
- `docs/ui-componenti.md` — home (moneta, liste, selettore leghe a pillola), popup forzatura, `lega-join`/`lega-card`, chip LIVE sull'hero, X di chiusura SVG, vite iniziali alla creazione lega (max 5).
- `docs/regole-gioco-e-dati.md` — vincolo sigla+nazione su `squadra`, test con mock, esito settimanale NBA, passaggio d'anno dei campionati.
- `docs/account-richieste-rilascio.md` — Google login (in sospeso), endpoint richieste di ingresso, popup di aggiornamento obbligatorio e ordine di rilascio.

Altri file utili già presenti: `deploy-prod-guide.md`, `NOTIFICHE_IN_APP_README.md`.
