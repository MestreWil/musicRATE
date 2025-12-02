# Integração Frontend-Backend - MusicRATE

## ✅ Status da Integração

### Backend (Laravel 12)
- ✅ Docker configurado e rodando
- ✅ Dependências instaladas via Composer
- ✅ Migrations executadas com sucesso
- ✅ CORS configurado para aceitar requisições do frontend
- ✅ Rotas da API definidas e funcionais

### Configuração do Backend

**URL da API:** `http://localhost:8000/api`

**Containers Docker:**
- `musicrate_app` - PHP 8.2 + Apache (portas 80 e 8000)
- `musicrate_db` - PostgreSQL 15 (porta 5432)

**Comandos úteis:**
```powershell
# Verificar status dos containers
docker ps

# Parar os containers
docker-compose -f "c:\Senac\Projeto II\MusicRate (updated)\musicRATE\backend\musicrate-api\docker-compose.yml" down

# Iniciar os containers
docker-compose -f "c:\Senac\Projeto II\MusicRate (updated)\musicRATE\backend\musicrate-api\docker-compose.yml" up -d

# Ver logs
docker logs musicrate_app
docker logs musicrate_db

# Executar comandos Artisan
docker exec -w /app musicrate_app php artisan [comando]
```

### Frontend (Next.js 15)

**Configuração:** 
- Arquivo: `frontend/.env.local`
- Variável: `NEXT_PUBLIC_BACKEND_API_BASE_URL=http://127.0.0.1:8000/api`

**Arquivo de API:** `frontend/src/lib/api.ts`
- ✅ Funções `apiGet`, `apiPost`, `apiDelete` configuradas
- ✅ Headers corretos para JSON
- ✅ Tratamento de erros implementado

## 🔗 Rotas da API Disponíveis

### 🌐 Rotas Públicas (sem autenticação)

#### Reviews
- `GET /api/reviews` - Lista todas as reviews (com paginação)
- `GET /api/reviews/{id}` - Detalhes de uma review
- `GET /api/reviews/album/{spotifyAlbumId}` - Reviews de um álbum específico
- `GET /api/reviews/stats` - Estatísticas gerais

#### Spotify (via Client Credentials - Acesso Público)
- `GET /api/spotify/search?q={query}&type={types}&limit={limit}` - Busca geral
- `GET /api/spotify/search/albums?q={query}` - Buscar apenas álbuns
- `GET /api/spotify/search/artists?q={query}` - Buscar apenas artistas
- `GET /api/spotify/albums/{id}` - Detalhes de um álbum
- `GET /api/spotify/albums/{id}/tracks` - Tracks de um álbum
- `GET /api/spotify/artists/{id}` - Detalhes de um artista
- `GET /api/spotify/artists/{id}/albums` - Álbuns de um artista
- `GET /api/spotify/artists/{id}/top-tracks` - Top tracks de um artista
- `GET /api/spotify/artists/{id}/related` - Artistas relacionados
- `GET /api/spotify/tracks/{id}` - Detalhes de uma track
- `GET /api/spotify/browse/new-releases` - Novos lançamentos
- `GET /api/spotify/browse/categories` - Categorias de música

### 🔐 Rotas Autenticadas (Spotify OAuth + Sanctum)

#### Autenticação
- `GET /api/auth/spotify` - Redireciona para login Spotify
- `GET /api/auth/callback` - Callback do Spotify OAuth
- `GET /api/auth/token` - Obtém token atual (autenticado)
- `POST /api/auth/logout` - Faz logout

#### Reviews (operações protegidas)
- `GET /api/reviews/me` - Reviews do usuário logado
- `POST /api/reviews` - Criar uma review
  ```json
  {
    "spotify_album_id": "album_id",
    "rating": 8,
    "review_text": "Ótimo álbum!"
  }
  ```
- `PUT /api/reviews/{id}` - Atualizar review
- `DELETE /api/reviews/{id}` - Deletar review

## 🧪 Testando a API

### Via Browser
Abra: http://localhost:8000/api/reviews/stats

### Via PowerShell
```powershell
# Testar endpoint de estatísticas
Invoke-RestMethod -Uri "http://localhost:8000/api/reviews/stats" -Method GET

# Buscar no Spotify
Invoke-RestMethod -Uri "http://localhost:8000/api/spotify/search/albums?q=The+Beatles" -Method GET

# Detalhes de um artista
Invoke-RestMethod -Uri "http://localhost:8000/api/spotify/artists/3WrFJ7ztbogyGnTHbHJFl2" -Method GET
```

### Via cURL (Git Bash)
```bash
# Testar endpoint de estatísticas
curl http://localhost:8000/api/reviews/stats

# Buscar álbuns
curl "http://localhost:8000/api/spotify/search/albums?q=The+Beatles"
```

## 📝 Próximos Passos para Integração Completa

### 1. Substituir dados mockados por dados reais

Arquivos que ainda usam `mockData`:
- `frontend/src/app/page.tsx` - Landing page (artistas, álbuns, tracks)
- `frontend/src/app/albums/[id]/page.tsx` - Detalhes do álbum
- `frontend/src/app/artists/[id]/page.tsx` - Detalhes do artista
- `frontend/src/app/tracks/[id]/page.tsx` - Detalhes da track
- `frontend/src/app/profile/page.tsx` - Perfil do usuário

### 2. Implementar chamadas da API real

Exemplo de conversão:

**Antes (mockado):**
```typescript
import { mockAlbums } from '@/lib/mockData';
const albums = mockAlbums;
```

**Depois (API real):**
```typescript
import { apiGet } from '@/lib/api';
const albums = await apiGet('/spotify/browse/new-releases');
```

### 3. Implementar autenticação Spotify OAuth

Criar páginas/componentes:
- Botão "Login com Spotify" que chama `/api/auth/spotify`
- Página de callback que processa o token
- Context ou hook para gerenciar estado de autenticação
- Proteção de rotas que requerem autenticação

### 4. Integrar Reviews

- Listar reviews na página de álbum (usando `/api/reviews/album/{id}`)
- Formulário de review já está pronto em `ReviewForm.tsx`
- Adicionar edição/exclusão de reviews próprias

## 🔧 Troubleshooting

### Backend não responde
```powershell
# Verificar se containers estão rodando
docker ps

# Reiniciar containers
cd "c:\Senac\Projeto II\MusicRate (updated)\musicRATE\backend\musicrate-api"
docker-compose restart

# Ver logs de erro
docker logs musicrate_app --tail 50
```

### Erro de CORS
- ✅ Já configurado em `config/cors.php` e `bootstrap/app.php`
- Verificar se `FRONTEND_URL` está correto no `.env`

### Erro de conexão com banco
```powershell
# Verificar se PostgreSQL está rodando
docker exec musicrate_db pg_isready

# Reconectar ao banco
docker-compose restart musicrate_db
```

### Spotify API não funciona
- Verificar credenciais em `.env`:
  - `SPOTIFY_CLIENT_ID`
  - `SPOTIFY_CLIENT_SECRET`
- O token é obtido automaticamente via Client Credentials

## 📚 Documentação Adicional

- **API Laravel:** `backend/musicrate-api/API_DOCUMENTATION.md`
- **Setup Rápido:** `backend/musicrate-api/SETUP_RAPIDO.md`
- **Queries SQL:** `backend/musicrate-api/SQL_QUERIES.md`
- **Melhorias Auth:** `backend/musicrate-api/MELHORIAS_AUTH.md`

## 🎯 Estrutura da Integração

```
Frontend (Next.js)          Backend (Laravel)           Spotify API
     |                             |                          |
     |---- apiGet/apiPost -------->|                          |
     |                             |---- HTTP Request ------->|
     |                             |<--- JSON Response -------|
     |<---- JSON Response ---------|                          |
```

### Fluxo de Dados

1. **Busca de Música:** Frontend → Backend → Spotify API → Backend → Frontend
2. **Leitura de Reviews:** Frontend → Backend → PostgreSQL → Backend → Frontend
3. **Criar Review (autenticado):** Frontend → Backend (verifica token) → PostgreSQL → Frontend

## ✨ Funcionalidades Implementadas

- ✅ Busca de álbuns, artistas e tracks no Spotify
- ✅ Visualização de detalhes (álbum, artista, track)
- ✅ Listagem de reviews públicas
- ✅ Estatísticas de reviews
- ✅ CORS configurado para integração
- ✅ Estrutura pronta para autenticação OAuth

## 🚀 Pronto para desenvolvimento!

O backend está rodando e pronto para receber requisições do frontend. As rotas públicas da API já funcionam e podem ser testadas.
