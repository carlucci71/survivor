param([string]$Title)

$branch = git rev-parse --abbrev-ref HEAD
Write-Host "🔄 Pushing $branch..." -ForegroundColor Yellow
$title = if ($Title) { $Title } else { (git log -1 --format=%s HEAD 2>$null) ? (git log -1 --format=%s HEAD) : "Rilascio" }

$body = @{
	title = $title
	head = $branch
	base = "develop"
} | ConvertTo-Json -Depth 10

Write-Host "✅ Creating PR: $title" -ForegroundColor Green

$headers = @{
	"Authorization" = "Bearer $env:GITHUB_PAT"
	"Accept" = "application/vnd.github+json"
	"X-GitHub-Api-Version" = "2022-11-28"
}

$response = Invoke-RestMethod -Uri "https://api.github.com/repos/carlucci71/survivor/pulls" -Method Post -Body $body -Headers $headers -ContentType "application/json"

Write-Host "🎉 PR CREATA: $($response.html_url)" -ForegroundColor Green
