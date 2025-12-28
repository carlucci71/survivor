param([string]$Title)

$branch = git rev-parse --abbrev-ref HEAD

# CONTROLLA COMMIT LOCALI NON PUSHATI SU QUESTO BRANCH
$localCommits = git log origin/$branch..HEAD --oneline 2>$null
if (-not $localCommits) {
    Write-Host "❌ ERRORE: Nessun commit nuovo su '$branch'!" -ForegroundColor Red
    Write-Host "💡 Questo branch non ha differenze da origin/$branch" -ForegroundColor Yellow
    Write-Host "   - Fai commit: git add . && git commit -m 'tuo messaggio'" -ForegroundColor Yellow
    Write-Host "   - O pusha prima: git push origin $branch" -ForegroundColor Yellow
    exit 1
}

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
    base = "develop"
} | ConvertTo-Json -Depth 10

Write-Host "✅ Creating PR: $title ($branch → develop)" -ForegroundColor Green

$headers = @{
    "Authorization" = "Bearer $env:GITHUB_PAT"
    "Accept" = "application/vnd.github+json"
    "X-GitHub-Api-Version" = "2022-11-28"
}

try {
    $response = Invoke-RestMethod -Uri "https://api.github.com/repos/carlucci71/survivor/pulls" -Method Post -Body $body -Headers $headers -ContentType "application/json"
    Write-Host "🎉 PR CREATA: $($response.html_url)" -ForegroundColor Green
} catch {
    Write-Host "❌ Errore API: $($_.Exception.Message)" -ForegroundColor Red
}
