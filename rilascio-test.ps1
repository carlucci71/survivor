param([string]$Title)


# Controllo preventivo dello stato di Git
$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-Host "ERRORE: Il working tree non è pulito. Commit o stash le modifiche prima di procedere." -ForegroundColor Red
    Write-Host "`nModifiche presenti:" -ForegroundColor Yellow
    git status --short
    Write-Host "Paused. Press Enter to exit..."
    Read-Host | Out-Null
    exit 1
}

$branch = git rev-parse --abbrev-ref HEAD
$base = "develop"

# LOGICA TITOLO
if ($Title) {
    $title = $Title
} elseif ((git log -1 --format=%s HEAD 2>$null) -match ".") {
    $title = git log -1 --format=%s HEAD
} else {
    $title = "Rilascio"
}

$body = @{
    title = $title
    head = $branch
    base = $base
} | ConvertTo-Json -Depth 10

Write-Host "$branch -> $base [$title]" -ForegroundColor Green

$headers = @{
    "Authorization" = "Bearer $env:GITHUB_PAT"
    "Accept" = "application/vnd.github+json"
    "X-GitHub-Api-Version" = "2022-11-28"
}

try {
    $response = Invoke-RestMethod -Uri "https://api.github.com/repos/carlucci71/survivor/pulls" -Method Post -Body $body -Headers $headers -ContentType "application/json"
    Write-Host "PR CREATA: $($response.html_url)" -ForegroundColor Green
} catch {
    # PowerShell 7 (Mac) e Windows PS gestiscono gli errori di Invoke-RestMethod in modo differente.
    # Questo approccio estrae il JSON di errore indipendentemente dalla piattaforma.
    
    $errorResponseBody = ""

    if ($null -ne $_.ErrorDetails -and $null -ne $_.ErrorDetails.Message) {
        # Su molte versioni, il corpo della risposta JSON di GitHub è già qui
        $errorResponseBody = $_.ErrorDetails.Message
    } elseif ($null -ne $_.Exception.Response) {
        # Fallback per versioni di PS che non popolano ErrorDetails
        $responseStream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($responseStream)
        $errorResponseBody = $reader.ReadToEnd()
        $reader.Close()
    }

    if ($errorResponseBody) {
        try {
            $errorJson = $errorResponseBody | ConvertFrom-Json
            # GitHub spesso restituisce una lista di errori specifici
            if ($errorJson.errors) {
                $detailedError = $errorJson.errors[0].message
                Write-Host "Errore GitHub: $detailedError" -ForegroundColor Red
            } else {
                Write-Host "Errore GitHub: $($errorJson.message)" -ForegroundColor Red
            }
        } catch {
            # Se non è JSON, stampa il corpo grezzo
            Write-Host "Errore API: $errorResponseBody" -ForegroundColor Red
        }
    } else {
        # Se non c'è una risposta dal server (es. timeout o DNS)
        Write-Host "Eccezione: $($_.Exception.Message)" -ForegroundColor Red
    }
}

