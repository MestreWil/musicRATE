# Script para testar persistência de sessão
$baseUrl = "http://127.0.0.1:8000/api"

Write-Host "=== Teste de Persistência de Sessão ===" -ForegroundColor Cyan
Write-Host ""

# Criar uma sessão com WebRequestSession
$session = New-Object Microsoft.PowerShell.Commands.WebRequestSession

# 1. Verificar autenticação (deve retornar authenticated: false)
Write-Host "1. Verificando autenticação inicial..." -ForegroundColor Yellow
$response1 = Invoke-WebRequest -Uri "$baseUrl/auth/me" -Method GET -WebSession $session -ContentType "application/json"
Write-Host "Status: $($response1.StatusCode)" -ForegroundColor Green
Write-Host "Response: $($response1.Content)" -ForegroundColor Gray
Write-Host "Cookies recebidos: $($session.Cookies.Count)" -ForegroundColor Gray
Write-Host ""

# Mostrar cookies
Write-Host "2. Cookies na sessão:" -ForegroundColor Yellow
$cookies = $session.Cookies.GetCookies($baseUrl)
foreach ($cookie in $cookies) {
    Write-Host "  - $($cookie.Name): $($cookie.Value)" -ForegroundColor Gray
    Write-Host "    Domain: $($cookie.Domain), Path: $($cookie.Path)" -ForegroundColor DarkGray
}
Write-Host ""

# 2. Fazer segunda requisição com mesma sessão
Write-Host "3. Segunda requisição com mesma sessão..." -ForegroundColor Yellow
$response2 = Invoke-WebRequest -Uri "$baseUrl/auth/me" -Method GET -WebSession $session -ContentType "application/json"
Write-Host "Status: $($response2.StatusCode)" -ForegroundColor Green
Write-Host "Response: $($response2.Content)" -ForegroundColor Gray
Write-Host ""

# 3. Verificar se session ID é o mesmo
Write-Host "4. Verificando logs do Laravel..." -ForegroundColor Yellow
docker exec musicrate_app tail -n 20 /app/storage/logs/laravel.log | Select-String "Auth check"
Write-Host ""

Write-Host "=== Teste Concluído ===" -ForegroundColor Cyan
