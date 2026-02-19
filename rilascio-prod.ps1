param([string]$Title)

$branch = "develop"
$base = "main"
$title = if ($Title) { $Title } else { "Rilascio in main" }

Write-Host "$branch -> $base [$title]" -ForegroundColor Green

# Creazione del body JSON
$body = @{
    title = $title
    head  = $branch
    base  = $base
} | ConvertTo-Json -Depth 10 -Compress

$headers = @{
    "Authorization"        = "Bearer $env:GITHUB_PAT"
    "Accept"               = "application/vnd.github+json"
    "X-GitHub-Api-Version" = "2022-11-28"
}

try {
    # Invio richiesta a GitHub
    $response = Invoke-RestMethod -Uri "https://api.github.com/repos/carlucci71/survivor/pulls" `
                                 -Method Post `
                                 -Body ([System.Text.Encoding]::UTF8.GetBytes($body)) `
                                 -Headers $headers `
                                 -ContentType "application/json; charset=utf-8"
    
    Write-Host "PR MAIN CREATA: $($response.html_url)" -ForegroundColor Green
} catch {
    Write-Host "Errore durante la creazione della PR:" -ForegroundColor Red
    
    # Su PowerShell Core (Mac) l'errore è in $_.ErrorDetails.Message
    if ($_.ErrorDetails.Message) {
        Write-Host "Dettaglio API: $($_.ErrorDetails.Message)" -ForegroundColor Yellow
    }
    elseif ($_.Exception.Response) {
        # Fallback per estrarre il contenuto se ErrorDetails è vuoto
        $responseStream = $_.Exception.Response.Content.ReadAsStringAsync()
        Write-Host "Dettaglio tecnico: $($responseStream.Result)" -ForegroundColor Yellow
    } else {
        Write-Host "Errore generico: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# crea app android e porta su ftp
Push-Location "$PSScriptRoot\survivor_webapp\scripts"
# Esegui lo script build-and-install.ps1 passando eventuali argomenti
& "$PSScriptRoot\survivor_webapp\scripts\build-and-install.ps1" -CopyFtp
Pop-Location
