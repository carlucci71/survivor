@echo off
REM Wrapper to run build-and-install.ps1 from Explorer / Win+R
REM Usage: double-click or press WIN+R and paste the full path to this file

REM Change to repo root (scripts\..)
pushd "%~dp0.."

REM Run the PowerShell script and forward any args passed to this .bat
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0build-and-install.ps1" %*

popd

rem pause