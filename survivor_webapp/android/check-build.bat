@echo off
echo Checking Android build configuration...
echo.
echo Current directory: %CD%
echo.
echo Gradle version:
gradlew --version
echo.
echo SDK components:
C:\Android\Sdk\cmdline-tools\latest\bin\sdkmanager.bat --list_installed | findstr "platforms\|build-tools"
echo.
echo Starting clean build...
gradlew clean
echo.
echo Starting release bundle build...
gradlew bundleRelease
