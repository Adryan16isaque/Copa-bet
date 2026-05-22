# Copa Bet — setup e servidor de desenvolvimento
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

Write-Host "`n Copa Bet - iniciando...`n" -ForegroundColor Cyan

Set-Location "sistemaApostas\backend"

if (-not (Test-Path ".env")) {
  Copy-Item ".env.example" ".env"
  Write-Host "Arquivo .env criado." -ForegroundColor Green
}

npm install
npm run setup
npm run seed

Write-Host "`n Liberando porta 3000 se necessario..." -ForegroundColor Yellow
& "$PSScriptRoot\scripts\liberar-porta.bat" 3000 | Out-Host

Write-Host "`n Servidor: http://localhost:3000`n" -ForegroundColor Green
Start-Process "http://localhost:3000"
npm run dev
