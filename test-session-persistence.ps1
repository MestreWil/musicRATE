# Script para testar persistência de sessão com cookies
$baseUrl = "http://127.0.0.1:8000/api"

Write-Host "`n=== Teste de Persistência de Sessão com Cookies ===" -ForegroundColor Cyan
Write-Host ""

# Criar uma sessão persistente
$session = New-Object Microsoft.PowerShell.Commands.WebRequestSession

Write-Host "1. Primeira requisição para /auth/me (criar sessão)..." -ForegroundColor Yellow
try {
    $response1 = Invoke-WebRequest -Uri "$baseUrl/auth/me" `
        -Method GET `
        -WebSession $session `
        -Headers @{
            "Accept" = "application/json"
            "Origin" = "http://127.0.0.1:3000"
        }
    
    Write-Host "   Status: $($response1.StatusCode)" -ForegroundColor Green
    $data1 = $response1.Content | ConvertFrom-Json
    Write-Host "   Authenticated: $($data1.authenticated)" -ForegroundColor Gray
    Write-Host "   Cookies recebidos: $($session.Cookies.Count)" -ForegroundColor Gray
    
    # Mostrar cookies
    $cookies = $session.Cookies.GetCookies("http://127.0.0.1:8000")
    foreach ($cookie in $cookies) {
        Write-Host "      - $($cookie.Name): $($cookie.Value.Substring(0, [Math]::Min(20, $cookie.Value.Length)))..." -ForegroundColor DarkGray
    }
} catch {
    Write-Host "   Erro: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "2. Segunda requisição usando MESMA sessão..." -ForegroundColor Yellow
try {
    $response2 = Invoke-WebRequest -Uri "$baseUrl/auth/me" `
        -Method GET `
        -WebSession $session `
        -Headers @{
            "Accept" = "application/json"
            "Origin" = "http://127.0.0.1:3000"
        }
    
    Write-Host "   Status: $($response2.StatusCode)" -ForegroundColor Green
    $data2 = $response2.Content | ConvertFrom-Json
    Write-Host "   Authenticated: $($data2.authenticated)" -ForegroundColor Gray
    Write-Host "   Cookies na sessão: $($session.Cookies.Count)" -ForegroundColor Gray
} catch {
    Write-Host "   Erro: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "3. Verificando logs do Laravel para ver session_id..." -ForegroundColor Yellow
docker exec musicrate_app tail -n 5 /app/storage/logs/laravel.log | Select-String "Auth check" | ForEach-Object {
    Write-Host "   $_" -ForegroundColor DarkGray
}

Write-Host ""
Write-Host "=== Teste Concluído ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "PRÓXIMOS PASSOS:" -ForegroundColor Yellow
Write-Host "1. Limpe os cookies do navegador (F12 > Application > Cookies > Delete All)" -ForegroundColor White
Write-Host "2. Faça login novamente via Spotify" -ForegroundColor White
Write-Host "3. Navegue para a home e verifique se continua logado" -ForegroundColor White
