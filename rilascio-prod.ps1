param([string]$Title)

$branch = "develop"
$base = "main"

if ($Title) {
    $title = $Title
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