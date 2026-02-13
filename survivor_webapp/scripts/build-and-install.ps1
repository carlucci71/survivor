param(
    [string]$Configuration = "mobile",
    [switch]$Release,
    [switch]$Install,
    [switch]$CopyFtp,
    [switch]$Pause
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Check-Command($cmd) {
    $which = Get-Command $cmd -ErrorAction SilentlyContinue
    if (-not $which) {
        Write-Error "Command '$cmd' not found in PATH. Install it and retry."
        exit 2
    }
}

Set-Location -Path $PSScriptRoot

Get-Date -Format "dd/MM/yyyy HH:mm" > ..\src\assets\build_fe.html

Write-Host "Configuration: $Configuration; Release: $($Release.IsPresent); Install after build: $($Install.IsPresent)"

# Check required commands
Check-Command npm
Check-Command npx
Check-Command adb

# Resolve project root and run project commands from there so npm/capacitor/gradle
# are executed in the correct directory regardless of where this script is invoked.
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$projectRoot = Resolve-Path (Join-Path $scriptDir "..")
$gradleWrapper = Join-Path -Path $projectRoot -ChildPath "android\gradlew.bat"
$locationPushed = $false
Push-Location $projectRoot
$locationPushed = $true

# 1) Build web
Write-Host "1) Building Angular web assets..."
npm run build -- --configuration $Configuration

# 2) Capacitor copy + sync
Write-Host "2) Running Capacitor sync (copy plugins/resources)..."
npx cap sync android

Write-Host "--- Verifica file in Android ---"
$androidFile = "android\app\src\main\assets\public\assets\build_fe.html"
Get-Content $androidFile
$fileInfo = Get-Item $androidFile
Write-Host "Ultima modifica: $($fileInfo.LastWriteTime)"

# 3) Build with Gradle wrapper
if (-not (Test-Path $gradleWrapper)) {
    Write-Error "Gradle wrapper not found at: $gradleWrapper"
    if ($locationPushed) { Pop-Location }
    exit 3
}
# Optional: ensure correct Java version by running external helper (if present)
$gradleTask = if ($Release.IsPresent) { 'assembleRelease' } else { 'assembleDebug' }

Write-Host "3) Building Android APK with Gradle: $gradleTask"

# Run gradle from the android subfolder so Gradle finds settings.gradle/build.gradle
$androidDir = Join-Path $projectRoot "android"
if (-not (Test-Path $androidDir)) {
    Write-Error "Android directory not found at: $androidDir"
    if ($locationPushed) { Pop-Location }
    exit 3
}


# 4) Locate APK
if ($Release.IsPresent) {
    $apkCandidate = "android\app\build\outputs\apk\release\app-release-unsigned.apk"
    if (Test-Path $apkCandidate) { $apkPath = $apkCandidate }
    else {
        $matches = Get-ChildItem -Path "android\app\build\outputs\apk\release" -Filter "*.apk" -Recurse -ErrorAction SilentlyContinue | Sort-Object LastWriteTime -Descending
        if ($matches) { $apkPath = $matches[0].FullName }
    }
} else {
    $apkPath = "android\app\build\outputs\apk\debug\app-debug.apk"
}

if (-not $apkPath -or -not (Test-Path $apkPath)) {
    Write-Error "APK not found. Expected path: $apkPath"
    exit 4
}

Write-Host "Built APK: $apkPath"

# 4) Locate APK - Corretto per macOS
if ($Release.IsPresent) {
    $apkCandidate = "android/app/build/outputs/apk/release/app-release-unsigned.apk"
    if (Test-Path $apkCandidate) { $apkPath = $apkCandidate }
    else {
        # Uso lo slash / e cerco in modo ricorsivo
        $matches = Get-ChildItem -Path "android/app/build/outputs/apk/release" -Filter "*.apk" -Recurse -ErrorAction SilentlyContinue | Sort-Object LastWriteTime -Descending
        if ($matches) { $apkPath = $matches[0].FullName }
    }
} else {
    $apkPath = "android/app/build/outputs/apk/debug/app-debug.apk"
}

Write-Host "APK trovato in: $apkPath"

# 5) Copy to FTP server
if ($CopyFtp.IsPresent) {
    Write-Host "6) Uploading APK via FTP"
    $ftpHost = '85.235.148.177'
    $ftpPort = 2121
    $ftpUser = $env:user_ftp_apk
    $ftpPass = $env:password_ftp_apk

    if ([string]::IsNullOrEmpty($ftpUser) -or [string]::IsNullOrEmpty($ftpPass)) {
        Write-Error "Environment variables 'user_ftp_apk' and 'password_ftp_apk' non impostate."
        if ($locationPushed) { Pop-Location }
        exit 5
    }

    # Estrae solo il nome del file (es: app-debug.apk) per l'URI remoto
    $remoteFileName = [System.IO.Path]::GetFileName($apkPath)
    $uri = "ftp://$ftpHost`:$ftpPort/$remoteFileName"

    try {
        # Risolve il percorso assoluto usando lo stile Unix
        $fullApk = (Resolve-Path $apkPath).Path
        $bytes = [System.IO.File]::ReadAllBytes($fullApk)
        
        $req = [System.Net.FtpWebRequest]::Create($uri)
        $req.Method = [System.Net.WebRequestMethods+Ftp]::UploadFile
        $req.Credentials = New-Object System.Net.NetworkCredential($ftpUser, $ftpPass)
        
        # --- MODIFICHE CRITICHE PER MAC ---
        $req.UseBinary = $true
        $req.UsePassive = $true  # Obbligatorio su molti server/firewall moderni
        $req.KeepAlive = $false
        # ----------------------------------

        $req.ContentLength = $bytes.Length
        $stream = $req.GetRequestStream()
        $stream.Write($bytes, 0, $bytes.Length)
        $stream.Close()
        
        $res = $req.GetResponse()
        Write-Host "FTP upload completed: $remoteFileName (Status: $($res.StatusDescription))"
        $res.Close()
    } catch {
        Write-Error "FTP upload failed: $_"
        if ($locationPushed) { Pop-Location }
        exit 5
    }
}

# 5) Optional: install via adb
if ($Install.IsPresent) {
    Write-Host "5) Installing APK on connected device via adb..."
    & adb install -r $apkPath
    Write-Host "Installed (or attempted install)."
} else {
    Write-Host "Skipping adb install. Use -Install to install on a connected device."
}

# Restore original working directory if we changed it
if ($locationPushed) { Pop-Location }

Write-Host "Done."

# Optional pause to keep console open for inspection
if ($Pause.IsPresent) {
    Write-Host "Paused. Press Enter to exit..."
    Read-Host | Out-Null
}
