@echo off
REM Encerra processos que estao escutando na porta informada (padrao 3000)
set "PORT=%~1"
if "%PORT%"=="" set "PORT=3000"

set "FOUND=0"
for /f "tokens=5" %%p in ('netstat -ano 2^>nul ^| findstr ":%PORT% " ^| findstr "LISTENING"') do (
  set "FOUND=1"
  echo   Encerrando PID %%p na porta %PORT%...
  taskkill /F /PID %%p >nul 2>&1
)

if "%FOUND%"=="1" (
  ping 127.0.0.1 -n 3 >nul
  echo   Porta %PORT% liberada.
) else (
  echo   Porta %PORT% livre.
)
