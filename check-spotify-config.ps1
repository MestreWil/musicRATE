# Script para verificar configurações do Spotify OAuth
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Verificando Configurações" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

$envPath = "backend\musicrate-api\.env"

if (Test-Path $envPath) {
    Write-Host "✅ Arquivo .env encontrado" -ForegroundColor Green
    Write-Host ""
    
    $content = Get-Content $envPath
    
    Write-Host "Verificando variáveis do Spotify:" -ForegroundColor Yellow
    Write-Host ""
    
    $spotifyId = $content | Select-String "SPOTIFY_CLIENT_ID="
    $spotifySecret = $content | Select-String "SPOTIFY_CLIENT_SECRET="
    $spotifyRedirect = $content | Select-String "SPOTIFY_REDIRECT_URI="
    $frontendUrl = $content | Select-String "FRONTEND_URL="
    
    if ($spotifyId) {
        $value = $spotifyId -replace "SPOTIFY_CLIENT_ID=", ""
        if ($value -and $value -ne "") {
            Write-Host "✅ SPOTIFY_CLIENT_ID: Configurado" -ForegroundColor Green
        } else {
            Write-Host "❌ SPOTIFY_CLIENT_ID: Vazio ou não configurado" -ForegroundColor Red
        }
    } else {
        Write-Host "❌ SPOTIFY_CLIENT_ID: Não encontrado" -ForegroundColor Red
    }
    
    if ($spotifySecret) {
        $value = $spotifySecret -replace "SPOTIFY_CLIENT_SECRET=", ""
        if ($value -and $value -ne "") {
            Write-Host "✅ SPOTIFY_CLIENT_SECRET: Configurado" -ForegroundColor Green
        } else {
            Write-Host "❌ SPOTIFY_CLIENT_SECRET: Vazio ou não configurado" -ForegroundColor Red
        }
    } else {
        Write-Host "❌ SPOTIFY_CLIENT_SECRET: Não encontrado" -ForegroundColor Red
    }
    
    if ($spotifyRedirect) {
        Write-Host "✅ SPOTIFY_REDIRECT_URI: $spotifyRedirect" -ForegroundColor Green
    } else {
        Write-Host "❌ SPOTIFY_REDIRECT_URI: Não encontrado" -ForegroundColor Red
        Write-Host "   Deve ser: http://localhost:8000/api/auth/callback" -ForegroundColor Yellow
    }
    
    if ($frontendUrl) {
        Write-Host "✅ FRONTEND_URL: $frontendUrl" -ForegroundColor Green
    } else {
        Write-Host "⚠️  FRONTEND_URL: Não encontrado (usando padrão)" -ForegroundColor Yellow
    }
    
} else {
    Write-Host "❌ Arquivo .env não encontrado em $envPath" -ForegroundColor Red
    Write-Host "   Copie o .env.example para .env e configure" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Instruções:" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "1. Acesse: https://developer.spotify.com/dashboard" -ForegroundColor White
Write-Host "2. Crie um app ou use um existente" -ForegroundColor White
Write-Host "3. Configure Redirect URI: http://localhost:8000/api/auth/callback" -ForegroundColor White
Write-Host "4. Copie Client ID e Client Secret para o .env" -ForegroundColor White
Write-Host ""
