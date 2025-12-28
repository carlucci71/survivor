param([string]$Title)

$branch = "develop"
$base = "main"

if ($Title) {
    $title = $Title
} elseif ((git log -1 --format=%s origin/develop 2>$null) -match ".") {
    $title = git log -1 --format=%s origin/develop
} else {
    $title = "Allineamento develop -> main"  # No caratteri speciali
}

Write-Host "Creating PR: $title ($branch -> $base)" -ForegroundColor Green

# Encoding UTF8 forzato per JSON pulito
$body = @{
    title = $title
    head = $branch
    base = $base
} | ConvertTo-Json -Depth 10 -Compress

Write-Host "JSON: $body"  # Debug

$headers = @{
    "Authorization" = "Bearer $env:GITHUB_PAT"
    "Accept" = "application/vnd.github+json"
    "X-GitHub-Api-Version" = "2022-11-28"
}

try {
    $response = Invoke-RestMethod -Uri "https://api.github.com/repos/carlucci71/survivor/pulls" -Method Post -Body ([System.Text.Encoding]::UTF8.GetBytes($body)) -Headers $headers -ContentType "application/json; charset=utf-8"
    Write-Host "PR MAIN CREATA: $($response.html_url)" -ForegroundColor Green
} catch {
    Write-Host "Errore API: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Response: $($_.Exception.Response)" -ForegroundColor Red
}
