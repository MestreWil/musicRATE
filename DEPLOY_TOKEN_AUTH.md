# 🚀 Deploy com Autenticação por Tokens

## Resumo da Arquitetura

A aplicação agora usa **Sanctum Bearer Tokens** armazenados no **localStorage** do navegador, eliminando problemas com cookies cross-domain.

### Fluxo de Autenticação

```
1. Usuário clica em "Login with Spotify"
   ↓
2. Backend redireciona para Spotify OAuth
   ↓
3. Spotify redireciona para /api/auth/callback
   ↓
4. Backend cria token Sanctum e redireciona para:
   /auth/callback?token=SANCTUM_TOKEN
   ↓
5. Frontend salva token no localStorage
   ↓
6. Todas as requisições incluem header:
   Authorization: Bearer SANCTUM_TOKEN
```

## ✅ Vantagens em Produção

- **Zero configuração de CORS complexa** - Não precisa de `credentials: include`
- **Funciona com domínios diferentes** - Frontend e backend podem estar em qualquer lugar
- **Mobile-ready** - Apps nativos funcionam sem problemas
- **Escalável** - Tokens são stateless
- **Seguro** - Tokens podem ter expiração e ser revogados

## 📦 Deploy do Backend

### Opção 1: Railway.app (Recomendado)

```bash
# 1. Criar projeto no Railway
railway login
railway init

# 2. Adicionar PostgreSQL
railway add postgresql

# 3. Configurar variáveis de ambiente
railway variables set APP_ENV=production
railway variables set APP_DEBUG=false
railway variables set APP_URL=https://seu-app.railway.app
railway variables set FRONTEND_URL=https://seu-frontend.vercel.app

# Spotify
railway variables set SPOTIFY_CLIENT_ID=seu_client_id
railway variables set SPOTIFY_CLIENT_SECRET=seu_secret
railway variables set SPOTIFY_REDIRECT_URI=https://seu-app.railway.app/api/auth/callback

# Session (mantido por compatibilidade, mas não necessário para auth)
railway variables set SESSION_DRIVER=database
railway variables set SESSION_SECURE_COOKIE=false
railway variables set SESSION_SAME_SITE=lax

# 4. Deploy
cd backend/musicrate-api
railway up
```

### Opção 2: Heroku

```bash
# 1. Criar app
heroku create musicrate-api

# 2. Adicionar PostgreSQL
heroku addons:create heroku-postgresql:mini

# 3. Configurar variáveis
heroku config:set APP_ENV=production
heroku config:set APP_KEY=$(php artisan key:generate --show)
heroku config:set FRONTEND_URL=https://seu-frontend.vercel.app
heroku config:set SPOTIFY_CLIENT_ID=seu_client_id
heroku config:set SPOTIFY_CLIENT_SECRET=seu_secret
heroku config:set SPOTIFY_REDIRECT_URI=https://musicrate-api.herokuapp.com/api/auth/callback

# 4. Deploy
git push heroku main

# 5. Rodar migrations
heroku run php artisan migrate --force
```

## 🌐 Deploy do Frontend

### Vercel (Recomendado para Next.js)

```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Deploy
cd frontend
vercel

# 3. Configurar variável de ambiente no dashboard Vercel:
# NEXT_PUBLIC_BACKEND_API_BASE_URL=https://seu-backend.railway.app/api
```

### Netlify

```bash
# 1. Build
cd frontend
npm run build

# 2. Deploy no dashboard Netlify
# Upload da pasta .next

# 3. Variáveis de ambiente:
# NEXT_PUBLIC_BACKEND_API_BASE_URL=https://seu-backend.railway.app/api
```

## 🔐 Configuração CORS no Backend

O backend já está configurado para aceitar requisições de qualquer origem em desenvolvimento. Para produção, **NÃO é necessário** configurar domínios específicos porque usamos **Bearer tokens**.

Arquivo `config/cors.php` (já configurado):

```php
'paths' => ['api/*', 'sanctum/csrf-cookie'],
'allowed_methods' => ['*'],
'allowed_origins' => ['*'], // ✅ Seguro com Bearer tokens
'allowed_origins_patterns' => [],
'allowed_headers' => ['*'],
'exposed_headers' => [],
'max_age' => 0,
'supports_credentials' => false, // ✅ Não precisa mais!
```

## 🔒 Segurança

### O que NÃO precisa mais:

- ❌ Configurar `SESSION_DOMAIN`
- ❌ Configurar `SESSION_SECURE_COOKIE`
- ❌ Configurar `SANCTUM_STATEFUL_DOMAINS`
- ❌ Configurar `supports_credentials: true` no CORS
- ❌ Usar `credentials: 'include'` no fetch

### O que PRECISA:

- ✅ **HTTPS em produção** (para proteger tokens em trânsito)
- ✅ **APP_KEY forte** no backend
- ✅ **Rate limiting** nas rotas de autenticação
- ✅ **Tokens com expiração** (já implementado)

## 📝 Checklist de Deploy

### Backend
- [ ] APP_ENV=production
- [ ] APP_DEBUG=false
- [ ] APP_KEY gerado
- [ ] Banco de dados PostgreSQL configurado
- [ ] SPOTIFY_CLIENT_ID e SECRET de produção
- [ ] SPOTIFY_REDIRECT_URI correto
- [ ] FRONTEND_URL configurado
- [ ] Migrations executadas
- [ ] Storage/logs com permissões corretas

### Frontend
- [ ] NEXT_PUBLIC_BACKEND_API_BASE_URL configurado
- [ ] Build production testado localmente
- [ ] Domínio customizado configurado (opcional)

## 🧪 Testar Autenticação em Produção

```bash
# 1. Login
curl https://seu-backend.railway.app/api/auth/spotify
# → Redireciona para Spotify

# 2. Após callback, verificar se recebeu token
# (Frontend salva automaticamente no localStorage)

# 3. Testar endpoint protegido
curl https://seu-backend.railway.app/api/auth/me \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"

# Deve retornar:
# {
#   "authenticated": true,
#   "user": { ... }
# }
```

## 🐛 Troubleshooting

### Token não está sendo enviado nas requisições

Verifique no navegador (DevTools → Application → Local Storage):
- Deve existir chave `sanctum_token` com valor do token

### Erro 401 em requisições autenticadas

Verifique:
1. Token está no localStorage?
2. Header `Authorization` está sendo enviado?
3. Backend recebeu o token (verificar logs)?

### Login redireciona mas não salva token

Verifique:
1. URL de callback no Spotify Developer Dashboard está correta
2. Backend está retornando token na URL de callback
3. Frontend está lendo query param `?token=...`

## 📊 Monitoramento

Para produção, considere adicionar:

```bash
# Logs estruturados
composer require monolog/monolog

# APM
composer require sentry/sentry-laravel
```

## 🔄 Rollback (se necessário)

Se precisar voltar para cookies de sessão:

1. Reverter alterações no `AuthController.php`
2. Remover código de token do `callback/page.tsx`
3. Restaurar `credentials: 'include'` no `useAuth.ts`
4. Configurar CORS com `supports_credentials: true`

Mas **não recomendado** - a solução com tokens é superior! ✨
