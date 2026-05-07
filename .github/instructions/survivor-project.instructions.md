---
applyTo: "**"
description: "Contesto tecnico del progetto Survivor. Carica sempre quando si lavora su questo workspace."
---

# Progetto Survivor — Contesto Tecnico

## Overview
Applicazione fantasy sport di tipo "survivor": gli utenti partecipano a leghe, fanno giocate settimanali scegliendo una squadra vincente. Se la squadra perde, il giocatore è eliminato. Il progetto è composto da backend Java, webapp Angular e app mobile Capacitor.

---

## Stack Tecnologico

### Backend (`survivor_backend/`)
- **Framework**: Spring Boot 3.5.8 — Java 21
- **Database**: PostgreSQL
- **ORM**: Hibernate JPA + Envers (audit/versioning delle entità)
- **Autenticazione**: JWT stateless (JJWT) + Magic Links passwordless via email
- **Sicurezza**: Spring Security, RBAC con ruoli `ADMIN` / `STANDARD`
- **Push Notifications**: Firebase Admin SDK (FCM)
- **Email**: Spring Mail
- **Mapping**: MapStruct (DTO ↔ Entity)
- **Boilerplate**: Lombok
- **Cache**: Caffeine (in-memory)
- **Documentazione API**: SpringDoc OpenAPI / Swagger UI
- **Build**: Maven
- **Package root**: `it.ddlsolution.survivor`

#### Architettura Backend
Pattern a strati: `Controller → Service → Repository → Entity`
- **Controllers** (REST): 17 controller principali
- **DTOs**: separazione netta tra request/response DTO e entity
- **AOP Logging**: aspect `dispologger`, `guardlogger`, `tracklogger`
- **Schedulazione**: `@EnableScheduling` per task in background

#### Moduli principali del backend
| Modulo | Controller |
|--------|-----------|
| Auth | `AuthController` (magic link, JWT, refresh token) |
| Giocate | `GiocataController`, `GiocataRevisionController` |
| Leghe | `LegaController`, `SospensioniLegaController`, `LegaJoinRequestController` |
| Campionati | `CampionatoController` |
| Giocatori/Squadre | `GiocatoreController`, `SquadraController`, `SportController` |
| Notifiche | `PushController`, `NotificationController` |
| Trofei | `TrofeiController` |
| Reazioni | `ReactionController` |
| Admin/Mock | `AdminController`, `MockController` |
| Utility | `VersioneController`, `UtilController` |

#### Tabelle DB principali
`users`, `giocatore`, `lega`, `giocata`, `campionato`, `squadra`, `sport`, `partita`, `notification`, `push_token`, `lega_join_request`, `reaction_giocata`, `magic_link_token`, `log_dispositiva` + tabelle trofei, sospensioni, snapshot

---

### Frontend (`survivor_webapp/`)
- **Framework**: Angular 19.2 (standalone components)
- **UI**: Angular Material 19.2 + stili custom SCSS
- **Mobile**: Capacitor 7 (Android + iOS)
- **i18n**: ngx-translate
- **Build mobile**: `npm run build:mobile` → `npx cap sync`

#### Struttura cartelle frontend (`src/app/`)
```
core/         → servizi singleton, guards, interceptors
features/     → moduli feature (una cartella per feature)
  admin/
  auth/
  home/
  lega-dettaglio/
  lega-join/
  lega-join-magic/
  lega-nuova/
  me/
  public/
  recap-giornata/
  richieste-leader/
  seleziona-giocata/
shared/       → componenti, pipe, direttive riutilizzabili
```

---

## Ambienti
- **Local dev**: `npm start` (proxy → backend locale porta 8080)
- **Test**: `npm run start:test` (server 85.235.148.177, porta 4201)
- **Production**: build `ng build` + deploy via script `deploy.sh` / `deploy-prod.sh`

## Deploy
- Script PowerShell: `rilascio-prod.ps1`, `rilascio-test.ps1`, `rilascio-ios_e_prod.ps1`
- Script bash: `deploy.sh`, `deploy-test.sh`
- Webhook: `webhook/hooks.json.template`
- Nginx config: `ngnix/liberaleidee.it`, `ngnix/survivor-test`

---

## Convenzioni di sviluppo
- I nomi in italiano (es. `giocata`, `lega`, `giocatore`, `campionato`, `squadra`) sono termini di dominio da mantenere così
- Le migration DB sono in `db/migration_*.sql`
- Le notifiche push usano FCM; la logica è in `PushController` e `NotificationController`
- I magic link sono il meccanismo di login principale (no password)
