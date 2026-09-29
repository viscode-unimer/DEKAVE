@echo off
title Push DEKAVE ke GitHub
cd /d "%~dp0"

echo ========================================================
echo   MENGIRIM SEMUA KODE DEKAVE KE GITHUB...
echo ========================================================
echo.
echo Jika muncul jendela browser login GitHub:
echo Silakan klik tombol hijau "Authorize GitCredentialManager" / Login.
echo.

git push -u origin main --tags --force

echo.
echo ========================================================
echo   SELESAI! Cek Vercel sekarang, deploy akan otomatis jalan.
echo ========================================================
pause
