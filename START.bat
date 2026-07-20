@echo off
setlocal EnableExtensions
chcp 65001 >nul
cd /d "%~dp0"
title Sodiqjonov Abbos Portfolio

echo ========================================================
echo      SODIQJONOV ABBOS PORTFOLIO - FINAL WORKING
echo ========================================================
echo.

where node >nul 2>&1
if errorlevel 1 (
  echo XATO: Node.js topilmadi. Node.js 20 yoki 22 LTS o'rnating.
  pause
  exit /b 1
)
if not exist "dist\index.html" (
  echo XATO: dist\index.html topilmadi. ZIPni Extract All qiling.
  pause
  exit /b 1
)
if not exist "node_modules\express\package.json" (
  echo XATO: server paketlari topilmadi. ZIPni qayta yuklang va to'liq oching.
  pause
  exit /b 1
)

node scripts\first-run.mjs
if errorlevel 1 (
  echo XATO: boshlang'ich sozlamalar yaratilmadi.
  pause
  exit /b 1
)

powershell -NoProfile -ExecutionPolicy Bypass -Command "Get-NetTCPConnection -LocalPort 3001 -State Listen -ErrorAction SilentlyContinue ^| ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }" >nul 2>&1

echo.
echo Sayt:  http://localhost:3001
echo Admin: http://localhost:3001/admin
echo Login va parol: ADMIN_LOGIN.txt
echo.
echo Saytdagi xabarlar lokal admin panelda saqlanadi.
echo Netlifyda esa Forms bo'limiga tushadi.
echo Terminalni yopmang va Ctrl+C bosmang.
echo.

start "" /B powershell -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File "%~dp0scripts\open-browser.ps1" "http://localhost:3001"
node server\server.js
set "EXIT_CODE=%ERRORLEVEL%"
echo.
echo Dastur to'xtadi. Xato kodi: %EXIT_CODE%
pause
exit /b %EXIT_CODE%
