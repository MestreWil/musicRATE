# 🚀 Guia Rápido - Como Rodar a Aplicação MusicRATE

## Pré-requisitos
- ✅ Docker Desktop instalado e rodando
- ✅ Node.js 18+ instalado (para o frontend)

## 📦 Iniciando o Backend (Laravel + PostgreSQL)

### 1. Navegar até o diretório do backend
```powershell
cd "c:\Senac\Projeto II\MusicRate (updated)\musicRATE\backend\musicrate-api"
```

### 2. Iniciar os containers Docker
```powershell
docker-compose up -d
```

Isso vai iniciar:
- **musicrate_app** - PHP 8.2 + Apache (porta 8000)
- **musicrate_db** - PostgreSQL 15 (porta 5432)

### 3. Verificar se os containers estão rodando
```powershell
docker ps
```

Você deve ver 2 containers: `musicrate_app` e `musicrate_db`

### 4. Testar a API
Abra o navegador em: http://localhost:8000/api/reviews/stats

Ou via PowerShell:
```powershell
Invoke-RestMethod -Uri "http://localhost:8000/api/reviews/stats" -Method GET
```

## 🎨 Iniciando o Frontend (Next.js)

### 1. Abrir novo terminal e navegar até o diretório do frontend
```powershell
cd "c:\Senac\Projeto II\MusicRate (updated)\musicRATE\frontend"
```

### 2. Instalar dependências (apenas na primeira vez)
```powershell
npm install
```

### 3. Iniciar o servidor de desenvolvimento
```powershell
npm run dev
```

### 4. Abrir no navegador
http://localhost:3000

## 🧪 Testando a Integração

### Testar busca no Spotify
```powershell
# Buscar álbuns
Invoke-RestMethod -Uri "http://localhost:8000/api/spotify/search/albums?q=Beatles" -Method GET

# Buscar artistas
Invoke-RestMethod -Uri "http://localhost:8000/api/spotify/search/artists?q=Coldplay" -Method GET
```

### Testar Reviews
```powershell
# Ver todas as reviews
Invoke-RestMethod -Uri "http://localhost:8000/api/reviews" -Method GET

# Ver estatísticas
Invoke-RestMethod -Uri "http://localhost:8000/api/reviews/stats" -Method GET
```

### Criar uma Review (via cURL ou Postman)
```powershell
# Nota: Isso requer autenticação, mas você pode usar a rota de desenvolvimento
Invoke-RestMethod -Uri "http://localhost:8000/api/dev/users" -Method POST -Body (@{
  spotify_id = "test_user_1"
  display_name = "Test User"
  email = "test@example.com"
} | ConvertTo-Json) -ContentType "application/json"
```

## 📋 Comandos Úteis

### Backend (Docker)
```powershell
# Parar containers
docker-compose down

# Ver logs
docker logs musicrate_app
docker logs musicrate_db

# Executar comando Artisan
docker exec -w /app musicrate_app php artisan [comando]

# Rodar migrations
docker exec -w /app musicrate_app php artisan migrate

# Limpar cache
docker exec -w /app musicrate_app php artisan cache:clear
docker exec -w /app musicrate_app php artisan config:clear
```

### Frontend (Next.js)
```powershell
# Rodar em modo desenvolvimento
npm run dev

# Build para produção
npm run build

# Rodar versão de produção
npm run start

# Lint
npm run lint
```

## 🔧 Troubleshooting

### Backend não inicia
```powershell
# Verificar se as portas estão livres
netstat -ano | findstr :8000
netstat -ano | findstr :5432

# Reiniciar containers
docker-compose restart

# Recriar containers (último recurso)
docker-compose down
docker-compose up -d --force-recreate
```

### Erro de CORS
- Verificar se `FRONTEND_URL` está correto no `.env` do backend
- Deve ser: `FRONTEND_URL=http://127.0.0.1:3000`

### Frontend não conecta com backend
- Verificar se `.env.local` existe no frontend
- Deve conter: `NEXT_PUBLIC_BACKEND_API_BASE_URL=http://127.0.0.1:8000/api`

### Spotify API não funciona
- Verificar credenciais no `.env` do backend:
  - `SPOTIFY_CLIENT_ID`
  - `SPOTIFY_CLIENT_SECRET`

## 📱 Endpoints Principais para Testar

### Públicos (não requerem autenticação)
- `GET /api/reviews` - Lista reviews
- `GET /api/reviews/stats` - Estatísticas
- `GET /api/spotify/search/albums?q=nome` - Buscar álbuns
- `GET /api/spotify/search/artists?q=nome` - Buscar artistas
- `GET /api/spotify/albums/{id}` - Detalhes de álbum
- `GET /api/spotify/artists/{id}` - Detalhes de artista
- `GET /api/spotify/browse/new-releases` - Novos lançamentos

### Autenticados (requerem Spotify OAuth)
- `POST /api/reviews` - Criar review
- `PUT /api/reviews/{id}` - Editar review
- `DELETE /api/reviews/{id}` - Deletar review
- `GET /api/reviews/me` - Minhas reviews

## ✅ Checklist - Aplicação Funcionando

- [ ] Docker containers rodando (`docker ps` mostra 2 containers)
- [ ] Backend responde em http://localhost:8000/api/reviews/stats
- [ ] Frontend rodando em http://localhost:3000
- [ ] Página "Trending" carrega novos lançamentos do Spotify
- [ ] Busca funciona na SearchBar
- [ ] Páginas de álbum/artista carregam dados reais

## 🎯 Próximos Passos

1. **Implementar Autenticação Spotify OAuth**
   - Botão de login
   - Gerenciamento de sessão
   - Páginas protegidas

2. **Substituir Dados Mockados**
   - Home page → usar `getNewReleases()`
   - Páginas de detalhes → usar `getAlbum()`, `getArtist()`, etc.

3. **Integrar Reviews**
   - Listar reviews nas páginas de álbum
   - Formulário de criação funcionando
   - Edição e exclusão de reviews próprias

## 📚 Documentação Completa

Ver arquivo: `INTEGRACAO_API.md`

## 🆘 Suporte

Se encontrar problemas:
1. Verificar logs do Docker: `docker logs musicrate_app`
2. Verificar console do navegador (F12)
3. Verificar terminal do Next.js
4. Consultar `INTEGRACAO_API.md` para mais detalhes
