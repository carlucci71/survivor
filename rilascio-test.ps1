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
    if ($_.Exception.Response) {
        $request = $_.Exception.Response
        $reader = New-Object System.IO.StreamReader($request.GetResponseStream())
        $reader.BaseStream.Position = 0
        $reader.DiscardBufferedData()
        $responseBody = $reader.ReadToEnd()
        $reader.Close()
        
        try {
            $errorJson = $responseBody | ConvertFrom-Json
            if ($errorJson.errors -and $errorJson.errors.Count -gt 0) {
                Write-Host "$($errorJson.errors[0].message)" -ForegroundColor Red
            } else {
                Write-Host "$($errorJson.message)" -ForegroundColor Red
            }
        } catch {
            Write-Host "Errore API: $responseBody" -ForegroundColor Red
        }
    } else {
        Write-Host "$($_.Exception.Message)" -ForegroundColor Red
    }
}