# 🎵 MusicRATE API - Avaliação de Álbuns com Spotify

API REST para avaliação de álbuns musicais integrada com Spotify Web API.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Arquitetura](#arquitetura)
- [Endpoints](#endpoints)
- [Exemplos de Uso](#exemplos-de-uso)
- [Deploy](#deploy)

---

## 🎯 Visão Geral

**MusicRATE** é uma API que permite:

- ✅ Autenticação OAuth 2.0 com Spotify
- ✅ Buscar álbuns, artistas e músicas via Spotify API
- ✅ Criar, editar e deletar reviews de álbuns (rating 1-10 + texto)
- ✅ Visualizar estatísticas e rankings de álbuns
- ✅ **Apenas tabela `reviews` no banco** - todos os dados de música vêm do Spotify

### Stack Tecnológica

- **Backend:** Laravel 11.x (PHP 8.2+)
- **Autenticação:** Laravel Sanctum + OAuth 2.0 Spotify
- **Banco de Dados:** PostgreSQL 15
- **Cache:** Redis (recomendado) ou File
- **Docker:** Ambiente containerizado

---

## 🚀 Instalação

### 1. Clonar e Instalar Dependências

```bash
cd musicrate-api

# Instalar dependências PHP
composer install

# Copiar .env
cp .env.example .env

# Gerar chave da aplicação
php artisan key:generate
```

### 2. Configurar Docker

```bash
# Iniciar containers
docker-compose up -d

# Verificar status
docker ps
```

### 3. Rodar Migrations

```bash
docker exec musicrate_app php artisan migrate

# Ou localmente:
php artisan migrate
```

---

## ⚙️ Configuração

### 1. Spotify Developer Dashboard

1. Acesse: https://developer.spotify.com/dashboard
2. Crie uma aplicação
3. Configure **Redirect URI**: `http://localhost/auth/callback`
4. Copie **Client ID** e **Client Secret**

### 2. Arquivo `.env`

```env
# Banco de Dados
DB_CONNECTION=pgsql
DB_HOST=musicrate_db
DB_PORT=5432
DB_DATABASE=musicrate
DB_USERNAME=postgres
DB_PASSWORD=your_password

# Cache (recomendado: redis)
CACHE_DRIVER=redis
REDIS_HOST=127.0.0.1
REDIS_PORT=6379

# Spotify API
SPOTIFY_CLIENT_ID=dd3d3e20ba8940768e78ce4f39f48a23
SPOTIFY_CLIENT_SECRET=bd2c266f20cd4274933b2ed31bfe94bc
SPOTIFY_REDIRECT_URI=http://localhost/auth/callback
SPOTIFY_SCOPES="user-read-private user-read-email"

# Laravel Sanctum
SANCTUM_STATEFUL_DOMAINS=localhost,127.0.0.1
```

### 3. Configurar Cache

```bash
php artisan config:cache
php artisan cache:clear
```

---

## 🏗️ Arquitetura

### Estrutura de Diretórios

```
app/
├── Http/
│   ├── Controllers/
│   │   ├── AuthController.php        # OAuth Spotify
│   │   ├── ReviewController.php      # CRUD Reviews
│   │   └── SpotifyController.php     # Proxy Spotify API
│   ├── Middleware/
│   │   └── EnsureSpotifyToken.php    # Valida token Spotify
│   └── Requests/
│       ├── StoreReviewRequest.php
│       └── UpdateReviewRequest.php
├── Models/
│   └── Review.php                     # Model principal
└── Services/
    └── SpotifyService.php             # Encapsula Spotify API

database/
└── migrations/
    └── 2025_11_30_000001_create_reviews_table.php

routes/
└── api.php                            # Todas as rotas
```

### Tabela `reviews`

```sql
CREATE TABLE reviews (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    spotify_album_id VARCHAR(50) NOT NULL,  -- ID do Spotify
    album_name VARCHAR(255),                -- Cache (opcional)
    artist_name VARCHAR(255),               -- Cache (opcional)
    album_image_url VARCHAR(255),           -- Cache (opcional)
    rating SMALLINT NOT NULL,               -- 1-10
    review_text TEXT,                       -- Opcional
    created_at TIMESTAMP,
    updated_at TIMESTAMP,

    UNIQUE(user_id, spotify_album_id),      -- 1 review por usuário/álbum
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

---

## 📡 Endpoints

### Base URL: `http://localhost/api`

---

### 🔐 Autenticação

#### 1. Redirecionar para Spotify Login

```http
GET /auth/spotify
```

**Resposta:** Redirect para `accounts.spotify.com`

#### 2. Callback OAuth (automatico)

```http
GET /auth/callback?code=xxx&state=xxx
```

**Resposta:**

```json
{
    "message": "Autenticação realizada com sucesso",
    "access_token": "BQD...",
    "expires_in": 3600
}
```

#### 3. Obter Token Atual

```http
GET /auth/token
Headers: Authorization: Bearer {sanctum_token}
```

#### 4. Logout

```http
POST /auth/logout
Headers: Authorization: Bearer {sanctum_token}
```

---

### ⭐ Reviews

**Requer:** `Authorization: Bearer {sanctum_token}`

#### Listar Todas as Reviews

```http
GET /reviews?per_page=20&page=1
```

#### Reviews do Usuário Logado

```http
GET /reviews/me
```

#### Reviews de um Álbum Específico

```http
GET /reviews/album/{spotify_album_id}
```

**Resposta:**

```json
{
    "reviews": [
        {
            "id": 1,
            "user": {
                "id": 1,
                "name": "João Silva",
                "email": "joao@example.com"
            },
            "spotify_album_id": "6DEjYFkNZh67HP7R9PSZvv",
            "album_name": "Dark Side of the Moon",
            "artist_name": "Pink Floyd",
            "rating": 10,
            "review_text": "Obra-prima atemporal!",
            "created_at": "2025-11-30T10:30:00Z"
        }
    ],
    "stats": {
        "total": 42,
        "average_rating": 8.7,
        "rating_distribution": {
            "1": 0,
            "2": 1,
            "3": 2,
            "4": 3,
            "5": 5,
            "6": 4,
            "7": 8,
            "8": 10,
            "9": 6,
            "10": 3
        }
    }
}
```

#### Criar Review

```http
POST /reviews
Content-Type: application/json

{
  "spotify_album_id": "6DEjYFkNZh67HP7R9PSZvv",
  "rating": 9,
  "review_text": "Álbum incrível, revolucionário para a época!"
}
```

#### Atualizar Review

```http
PUT /reviews/{id}
Content-Type: application/json

{
  "rating": 10,
  "review_text": "Aumentando para 10 após ouvir novamente."
}
```

#### Deletar Review

```http
DELETE /reviews/{id}
```

#### Estatísticas Gerais

```http
GET /reviews/stats
```

**Resposta:**

```json
{
    "total_reviews": 1523,
    "average_rating": 7.8,
    "total_users": 342,
    "total_albums_reviewed": 856,
    "top_rated_albums": [
        {
            "spotify_album_id": "6DEjYFkNZh67HP7R9PSZvv",
            "album_name": "Dark Side of the Moon",
            "artist_name": "Pink Floyd",
            "avg_rating": 9.5,
            "review_count": 28
        }
    ]
}
```

---

### 🎵 Spotify API

**Requer:**

- `Authorization: Bearer {sanctum_token}`
- Token Spotify válido (via middleware)

#### Buscar (Geral)

```http
GET /spotify/search?q=pink floyd&type=album,artist&limit=10
```

#### Buscar Álbuns

```http
GET /spotify/search/albums?q=radiohead&limit=20
```

#### Buscar Artistas

```http
GET /spotify/search/artists?q=david bowie&limit=10
```

#### Detalhes de um Álbum

```http
GET /spotify/albums/{album_id}
```

**Exemplo:** `/spotify/albums/6DEjYFkNZh67HP7R9PSZvv`

#### Tracks de um Álbum

```http
GET /spotify/albums/{album_id}/tracks?limit=50
```

#### Detalhes de um Artista

```http
GET /spotify/artists/{artist_id}
```

#### Álbuns de um Artista

```http
GET /spotify/artists/{artist_id}/albums?limit=20
```

#### Top Tracks de um Artista

```http
GET /spotify/artists/{artist_id}/top-tracks
```

#### Artistas Relacionados

```http
GET /spotify/artists/{artist_id}/related
```

#### Detalhes de uma Track

```http
GET /spotify/tracks/{track_id}
```

#### Novos Lançamentos

```http
GET /spotify/browse/new-releases?limit=20
```

#### Categorias do Spotify

```http
GET /spotify/browse/categories?limit=20
```

#### Playlists de uma Categoria

```http
GET /spotify/browse/categories/{category_id}/playlists?limit=20
```

---

### 🌍 Rotas Públicas (sem autenticação)

```http
GET /public/reviews
GET /public/reviews/album/{spotify_album_id}
GET /public/reviews/stats
```

---

## 💡 Exemplos de Uso

### Frontend React/Vue/Angular

```javascript
// 1. Login com Spotify
window.location.href = 'http://localhost/api/auth/spotify';

// 2. Após callback, buscar álbum
const response = await fetch(
    'http://localhost/api/spotify/search/albums?q=radiohead',
    {
        headers: {
            Authorization: `Bearer ${sanctumToken}`,
        },
    },
);
const albums = await response.json();

// 3. Criar review
await fetch('http://localhost/api/reviews', {
    method: 'POST',
    headers: {
        Authorization: `Bearer ${sanctumToken}`,
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        spotify_album_id: '6DEjYFkNZh67HP7R9PSZvv',
        rating: 10,
        review_text: 'Obra-prima!',
    }),
});

// 4. Listar reviews do álbum
const reviews = await fetch(
    'http://localhost/api/reviews/album/6DEjYFkNZh67HP7R9PSZvv',
    {
        headers: { Authorization: `Bearer ${sanctumToken}` },
    },
).then((r) => r.json());
```

### cURL

```bash
# 1. Obter token (primeiro faça login via browser)
curl -X GET http://localhost/api/auth/token \
  -H "Authorization: Bearer {sanctum_token}"

# 2. Buscar álbuns
curl -X GET "http://localhost/api/spotify/search/albums?q=pink%20floyd" \
  -H "Authorization: Bearer {sanctum_token}"

# 3. Criar review
curl -X POST http://localhost/api/reviews \
  -H "Authorization: Bearer {sanctum_token}" \
  -H "Content-Type: application/json" \
  -d '{
    "spotify_album_id": "6DEjYFkNZh67HP7R9PSZvv",
    "rating": 9,
    "review_text": "Excelente álbum!"
  }'
```

---

## 🧪 Testes

### Criar Testes

```bash
# Feature tests
php artisan make:test ReviewTest
php artisan make:test SpotifyIntegrationTest

# Rodar testes
php artisan test
```

### Exemplo de Teste

```php
public function test_user_can_create_review()
{
    $user = User::factory()->create();

    $response = $this->actingAs($user)->postJson('/api/reviews', [
        'spotify_album_id' => '6DEjYFkNZh67HP7R9PSZvv',
        'rating' => 8,
        'review_text' => 'Great album!'
    ]);

    $response->assertStatus(201)
             ->assertJsonStructure(['message', 'review']);
}
```

---

## 🚀 Deploy

### Produção (Laravel Forge / DigitalOcean)

```bash
# 1. Configurar .env de produção
APP_ENV=production
APP_DEBUG=false
APP_URL=https://api.musicrate.com

SPOTIFY_REDIRECT_URI=https://api.musicrate.com/auth/callback

# 2. Otimizações
php artisan config:cache
php artisan route:cache
php artisan view:cache

# 3. Migrations
php artisan migrate --force

# 4. Configurar HTTPS (obrigatório para Spotify)
# Use Nginx + Certbot (Let's Encrypt)
```

### Docker Production

```dockerfile
# Dockerfile otimizado
FROM php:8.2-fpm-alpine
RUN docker-php-ext-install pdo pdo_pgsql redis
COPY . /var/www
RUN composer install --no-dev --optimize-autoloader
CMD ["php-fpm"]
```

---

## 🔒 Segurança

- ✅ **CSRF Protection:** State parameter na OAuth
- ✅ **Rate Limiting:** Configure em `routes/api.php`
- ✅ **Sanitização:** Form Requests validam todos os inputs
- ✅ **HTTPS:** Obrigatório em produção
- ✅ **Token Expiration:** Tokens Spotify expiram em 1 hora

---

## 📚 Recursos Adicionais

### Documentação Spotify API

- [Web API Reference](https://developer.spotify.com/documentation/web-api)
- [Authorization Guide](https://developer.spotify.com/documentation/web-api/concepts/authorization)
- [Rate Limits](https://developer.spotify.com/documentation/web-api/concepts/rate-limits)

### Laravel Resources

- [Sanctum Auth](https://laravel.com/docs/sanctum)
- [HTTP Client](https://laravel.com/docs/http-client)
- [Cache](https://laravel.com/docs/cache)

---

## 🤝 Contribuindo

```bash
# Fork, clone, branch
git checkout -b feature/nova-funcionalidade

# Commitar mudanças
git commit -m "feat: adiciona filtro por gênero"

# Push e abrir PR
git push origin feature/nova-funcionalidade
```

---

## 📝 Licença

MIT License - veja LICENSE.md

---

## 👨‍💻 Autor

Desenvolvido para **MusicRATE** - Sistema de Avaliação de Álbuns Musicais

**Stack:** Laravel 11 + PostgreSQL + Spotify Web API
