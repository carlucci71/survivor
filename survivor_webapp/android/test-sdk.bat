echo off
echo Testing Android SDK configuration...
echo SDK Path: C:\Android\Sdk
dir "C:\Android\Sdk\platforms" | findstr "android"
echo Build Tools:
dir "C:\Android\Sdk\build-tools"
echo.
echo Gradle version check:
gradlew --version
