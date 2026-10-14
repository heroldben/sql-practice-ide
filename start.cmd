@echo off
setlocal
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is required to serve the SQL Practice IDE.
  echo Install the LTS build from https://nodejs.org/ and double-click this file again.
  echo.
  pause
  exit /b 1
)
node "%~dp0serve.mjs" --open
set CODE=%ERRORLEVEL%
if "%CODE%"=="3" (
  echo The IDE is already running - reuse the tab you already have.
  timeout /t 5 >nul
  exit /b 0
)
if not "%CODE%"=="0" pause
