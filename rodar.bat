@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo.
echo  Copa Bet - iniciando...
echo.

cd sistemaApostas\backend

if not exist .env (
  echo Criando .env...
  copy /Y .env.example .env >nul
)

echo Instalando dependencias...
call npm install
if errorlevel 1 goto erro

echo Preparando ambiente...
call npm run setup
if errorlevel 1 goto erro

echo Populando banco de dados...
call npm run seed
if errorlevel 1 goto erro

echo.
echo  Verificando porta 3000...
cd /d "%~dp0"
call scripts\liberar-porta.bat 3000
cd sistemaApostas\backend

echo.
echo  Abrindo servidor em http://localhost:3000
echo  Pressione Ctrl+C para parar.
echo.
start "" "http://localhost:3000"
call npm run dev
goto fim

:erro
echo.
echo  Erro na instalacao. Tente manualmente:
echo    cd sistemaApostas\backend
echo    npm install
echo    npm rebuild better-sqlite3
echo    npm run seed
echo    npm run dev
echo.
pause
exit /b 1

:fim
