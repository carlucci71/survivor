# Script di avvio per Survivor WebApp
# Questo script pulisce, installa e avvia l'applicazione Angular

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "   SURVIVOR WEBAPP - Setup e Avvio" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Controlla se Node.js è installato
Write-Host "Controllo prerequisiti..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js installato: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js non trovato. Installare Node.js 20.x o superiore." -ForegroundColor Red
    exit 1
}

try {
    $npmVersion = npm --version
    Write-Host "✓ npm installato: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ npm non trovato." -ForegroundColor Red
    exit 1
}

Write-Host ""

# Chiede se reinstallare node_modules
$reinstall = Read-Host "Vuoi reinstallare le dipendenze? (s/N)"

if ($reinstall -eq 's' -or $reinstall -eq 'S') {
    Write-Host ""
    Write-Host "Pulizia node_modules e package-lock.json..." -ForegroundColor Yellow
    
    if (Test-Path "node_modules") {
        Remove-Item -Recurse -Force "node_modules"
        Write-Host "✓ node_modules rimosso" -ForegroundColor Green
    }
    
    if (Test-Path "package-lock.json") {
        Remove-Item -Force "package-lock.json"
        Write-Host "✓ package-lock.json rimosso" -ForegroundColor Green
    }
    
    Write-Host ""
    Write-Host "Pulizia cache npm..." -ForegroundColor Yellow
    npm cache clean --force
    Write-Host "✓ Cache npm pulita" -ForegroundColor Green
    
    Write-Host ""
    Write-Host "Installazione dipendenze (questo potrebbe richiedere alcuni minuti)..." -ForegroundColor Yellow
    npm install
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Dipendenze installate con successo" -ForegroundColor Green
    } else {
        Write-Host "✗ Errore nell'installazione delle dipendenze" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "   INFORMAZIONI IMPORTANTI" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Backend:" -ForegroundColor Yellow
Write-Host "  Assicurati che il backend Spring Boot sia avviato su:" -ForegroundColor White
Write-Host "  http://localhost:8389" -ForegroundColor Cyan
Write-Host ""
Write-Host "Frontend:" -ForegroundColor Yellow
Write-Host "  L'applicazione Angular sarà disponibile su:" -ForegroundColor White
Write-Host "  http://localhost:4200" -ForegroundColor Cyan
Write-Host ""
Write-Host "Proxy:" -ForegroundColor Yellow
Write-Host "  Il proxy è configurato per reindirizzare:" -ForegroundColor White
Write-Host "  /api    -> http://localhost:8389/api" -ForegroundColor Cyan
Write-Host "  /admin  -> http://localhost:8389/admin" -ForegroundColor Cyan
Write-Host "  /first  -> http://localhost:8389/first" -ForegroundColor Cyan
Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Chiede se avviare il server
$start = Read-Host "Vuoi avviare il server di sviluppo? (S/n)"

if ($start -ne 'n' -and $start -ne 'N') {
    Write-Host ""
    Write-Host "Avvio server di sviluppo Angular..." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Premi CTRL+C per terminare il server" -ForegroundColor Gray
    Write-Host ""
    npm start
} else {
    Write-Host ""
    Write-Host "Per avviare manualmente il server esegui:" -ForegroundColor Yellow
    Write-Host "  npm start" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Oppure:" -ForegroundColor Yellow
    Write-Host "  npx ng serve --proxy-config proxy.conf.json" -ForegroundColor Cyan
    Write-Host ""
}
