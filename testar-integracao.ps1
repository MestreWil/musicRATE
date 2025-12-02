# Script para testar a integração Backend-Frontend do MusicRATE
# Execute este script para verificar se tudo está funcionando

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  MusicRATE - Teste de Integração" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar Docker
Write-Host "1. Verificando Docker..." -ForegroundColor Yellow
try {
    $dockerVersion = docker --version
    Write-Host "✅ Docker instalado: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker não encontrado. Instale o Docker Desktop." -ForegroundColor Red
    exit 1
}

# Verificar containers rodando
Write-Host ""
Write-Host "2. Verificando containers..." -ForegroundColor Yellow
$containers = docker ps --format "{{.Names}}" 2>$null
if ($containers -match "musicrate_app" -and $containers -match "musicrate_db") {
    Write-Host "✅ Containers rodando: musicrate_app, musicrate_db" -ForegroundColor Green
} else {
    Write-Host "⚠️  Containers não estão rodando. Iniciando..." -ForegroundColor Yellow
    Push-Location "backend\musicrate-api"
    docker-compose up -d
    Start-Sleep -Seconds 5
    Pop-Location
    Write-Host "✅ Containers iniciados!" -ForegroundColor Green
}

# Testar API Backend
Write-Host ""
Write-Host "3. Testando API do Backend..." -ForegroundColor Yellow

# Teste 1: Stats
try {
    $stats = Invoke-RestMethod -Uri "http://localhost:8000/api/reviews/stats" -Method GET -ErrorAction Stop
    Write-Host "✅ Endpoint /api/reviews/stats funcionando" -ForegroundColor Green
    Write-Host "   - Total reviews: $($stats.total_reviews)" -ForegroundColor Gray
    Write-Host "   - Média: $($stats.average_rating)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Erro ao acessar /api/reviews/stats" -ForegroundColor Red
    Write-Host "   Certifique-se de que o backend está rodando em http://localhost:8000" -ForegroundColor Red
}

# Teste 2: Spotify Search
Write-Host ""
try {
    $search = Invoke-RestMethod -Uri "http://localhost:8000/api/spotify/search/albums?q=Beatles&limit=5" -Method GET -ErrorAction Stop
    $albumCount = if ($search.albums.items) { $search.albums.items.Count } else { 0 }
    Write-Host "✅ Endpoint /api/spotify/search/albums funcionando" -ForegroundColor Green
    Write-Host "   - Álbuns encontrados: $albumCount" -ForegroundColor Gray
} catch {
    Write-Host "❌ Erro ao buscar no Spotify. Verifique as credenciais no .env" -ForegroundColor Red
}

# Teste 3: New Releases
Write-Host ""
try {
    $releases = Invoke-RestMethod -Uri "http://localhost:8000/api/spotify/browse/new-releases?limit=5" -Method GET -ErrorAction Stop
    $releaseCount = if ($releases.albums.items) { $releases.albums.items.Count } else { 0 }
    Write-Host "✅ Endpoint /api/spotify/browse/new-releases funcionando" -ForegroundColor Green
    Write-Host "   - Novos lançamentos: $releaseCount" -ForegroundColor Gray
} catch {
    Write-Host "❌ Erro ao buscar novos lançamentos" -ForegroundColor Red
}

# Verificar Node.js
Write-Host ""
Write-Host "4. Verificando Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version 2>$null
    Write-Host "✅ Node.js instalado: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js não encontrado. Instale Node.js 18+" -ForegroundColor Red
    exit 1
}

# Verificar se o frontend tem dependências instaladas
Write-Host ""
Write-Host "5. Verificando frontend..." -ForegroundColor Yellow
if (Test-Path "frontend\node_modules") {
    Write-Host "✅ Dependências do frontend instaladas" -ForegroundColor Green
} else {
    Write-Host "⚠️  Dependências não instaladas. Execute 'npm install' no diretório frontend" -ForegroundColor Yellow
}

# Verificar arquivo .env.local
if (Test-Path "frontend\.env.local") {
    $envContent = Get-Content "frontend\.env.local" -Raw
    if ($envContent -match "NEXT_PUBLIC_BACKEND_API_BASE_URL") {
        Write-Host "✅ Arquivo .env.local configurado" -ForegroundColor Green
    } else {
        Write-Host "⚠️  .env.local existe mas pode estar incompleto" -ForegroundColor Yellow
    }
} else {
    Write-Host "⚠️  Arquivo .env.local não encontrado no frontend" -ForegroundColor Yellow
}

# Resumo
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Resumo do Teste" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Backend (Laravel):" -ForegroundColor White
Write-Host "  URL: http://localhost:8000/api" -ForegroundColor Gray
Write-Host "  Status: " -NoNewline
if ($stats) {
    Write-Host "✅ Funcionando" -ForegroundColor Green
} else {
    Write-Host "❌ Com problemas" -ForegroundColor Red
}

Write-Host ""
Write-Host "Frontend (Next.js):" -ForegroundColor White
Write-Host "  URL: http://localhost:3000" -ForegroundColor Gray
Write-Host "  Para iniciar: " -NoNewline
Write-Host "cd frontend ; npm run dev" -ForegroundColor Cyan

Write-Host ""
Write-Host "Próximos passos:" -ForegroundColor Yellow
Write-Host "  1. Se o backend estiver funcionando, inicie o frontend" -ForegroundColor Gray
Write-Host "  2. Acesse http://localhost:3000 no navegador" -ForegroundColor Gray
Write-Host "  3. Navegue até 'Trending' para ver dados reais da API" -ForegroundColor Gray
Write-Host "  4. Use a busca para encontrar álbuns e artistas" -ForegroundColor Gray
Write-Host ""
Write-Host "Documentação completa: INTEGRACAO_API.md e COMO_RODAR.md" -ForegroundColor Cyan
Write-Host ""
