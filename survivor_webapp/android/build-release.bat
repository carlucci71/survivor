@echo off
echo ===========================================
echo SURVIVOR APP - Android Build Script
echo ===========================================
echo.

echo Current directory: %CD%
echo Java version: %JAVA_HOME%
java -version
echo.

echo [1/6] Checking Gradle version...
gradlew --version
echo.

echo [2/6] Cleaning all builds and cache...
gradlew clean cleanBuildCache
echo.

echo [3/6] Checking project structure...
echo Capacitor modules:
dir ..\node_modules\@capacitor\ /b
echo.

echo [4/6] Checking dependencies...
gradlew dependencies --configuration releaseRuntimeClasspath | findstr "capacitor"
echo.

echo [5/6] Building AAB bundle...
gradlew bundleRelease --info
echo.

echo Build completed!
echo Check: app\build\outputs\bundle\release\app-release.aab
echo.
pause
