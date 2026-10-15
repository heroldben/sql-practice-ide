@echo off
setlocal
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is required. Install the LTS build from https://nodejs.org/.
  echo.
  pause
  exit /b 1
)
node "%~dp0stop.mjs" %*
echo.
echo Press any key to close this window.
pause >nul
