# Script de teste para o endpoint /api/auth/me
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Testando endpoint /api/auth/me" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://127.0.0.1:8000/api"

Write-Host "1. Testando sem autenticação (deve retornar authenticated: false)..." -ForegroundColor Yellow
Write-Host ""

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/auth/me" -Method Get -ContentType "application/json"
    
    Write-Host "Resposta recebida:" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 3
    Write-Host ""
    
    if ($response.authenticated -eq $false) {
        Write-Host "✅ SUCESSO: Usuário não autenticado detectado corretamente" -ForegroundColor Green
    } else {
        Write-Host "❌ ERRO: Esperava authenticated = false" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ ERRO na requisição:" -ForegroundColor Red
    Write-Host $_.Exception.Message
}

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Próximo passo:" -ForegroundColor Cyan
Write-Host "1. Acesse http://localhost:3000/login" -ForegroundColor White
Write-Host "2. Clique em 'Continue with Spotify'" -ForegroundColor White
Write-Host "3. Faça login no Spotify" -ForegroundColor White
Write-Host "4. Depois execute este script novamente" -ForegroundColor White
Write-Host "=====================================" -ForegroundColor Cyan
