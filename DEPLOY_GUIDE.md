# 🚀 GUIA COMPLETO DE DEPLOY - MusicRATE

## 📦 Estrutura do Projeto
- **Backend**: Laravel 12 + PostgreSQL
- **Frontend**: Next.js 15 + React 19
- **Autenticação**: Spotify OAuth + Laravel Sanctum
- **Deploy**: Railway (backend + DB) + Vercel (frontend)

---

## 🎯 OPÇÃO 1: RAILWAY + VERCEL (RECOMENDADA)

### **Por que essa combinação?**
✅ Railway: Melhor plataforma para Laravel com PostgreSQL integrado  
✅ Vercel: Perfeito para Next.js com deploy automático do Git  
✅ Custo: $5/mês (Railway) + Grátis (Vercel)  
✅ SSL/HTTPS automático em ambos  
✅ Deploy via Git Push  

---

## 📋 PARTE 1: PREPARAR O BACKEND

### 1.1 - Verificar arquivos criados
Os seguintes arquivos foram criados automaticamente:
- ✅ `.env.production` - Variáveis de ambiente para produção
- ✅ `Procfile` - Comandos para iniciar o servidor
- ✅ `railway.json` - Configuração do Railway
- ✅ `nixpacks.toml` - Build configuration
- ✅ `/api/health` endpoint - Health check

### 1.2 - Atualizar .gitignore
```bash
cd backend/musicrate-api
```

Verifique se o `.gitignore` NÃO ignora `.env.production`:
```gitignore
.env
.env.backup
.env.local
# .env.production <- NÃO deve estar aqui
```

### 1.3 - Configurar CORS para produção
Abra `config/cors.php` e verifique:

```php
'paths' => ['api/*', 'sanctum/csrf-cookie'],
'allowed_origins' => explode(',', env('FRONTEND_URL', 'http://localhost:3000')),
'allowed_origins_patterns' => [],
'supports_credentials' => true,
```

### 1.4 - Commit das mudanças
```bash
git add .
git commit -m "feat: adiciona configuração para deploy Railway + Vercel"
git push origin feat/reviews
```

---

## 🚂 PARTE 2: DEPLOY DO BACKEND NO RAILWAY

### 2.1 - Criar conta no Railway
1. Acesse: https://railway.app
2. Clique em **"Start a New Project"**
3. Faça login com GitHub

### 2.2 - Criar novo projeto
1. Clique em **"New Project"**
2. Escolha **"Deploy from GitHub repo"**
3. Selecione o repositório `musicRATE`
4. **IMPORTANTE**: Configure **Root Directory** para `backend/musicrate-api`
5. Railway vai detectar automaticamente que é Laravel

### 2.3 - Adicionar PostgreSQL
1. No dashboard do projeto, clique em **"+ New"**
2. Selecione **"Database" → "PostgreSQL"**
3. Railway criará automaticamente e conectará ao backend

### 2.4 - Configurar variáveis de ambiente
1. Clique no serviço **"musicrate-api"**
2. Vá em **"Variables"**
3. Adicione as seguintes variáveis:

```bash
# APP
APP_NAME=MusicRate
APP_ENV=production
APP_DEBUG=false

# Gere a chave LOCALMENTE antes: php artisan key:generate --show
APP_KEY=base64:SuaChaveAqui==

# Railway fornece automaticamente:
# DATABASE_URL, PGHOST, PGPORT, PGDATABASE, PGUSER, PGPASSWORD

# SPOTIFY (pegue em https://developer.spotify.com/dashboard)
SPOTIFY_CLIENT_ID=seu_client_id
SPOTIFY_CLIENT_SECRET=seu_client_secret

# FRONTEND (vamos pegar depois do deploy da Vercel)
FRONTEND_URL=https://seu-app.vercel.app

# SESSION
SESSION_DRIVER=database
SESSION_SECURE_COOKIE=true
SESSION_SAME_SITE=none
SESSION_HTTP_ONLY=true
```

### 2.5 - Configurar domínio
1. No serviço backend, vá em **"Settings"**
2. Em **"Networking"**, clique em **"Generate Domain"**
3. Copie a URL gerada (ex: `musicrate-production.railway.app`)
4. Volte em **"Variables"** e adicione:
   - `APP_URL=https://musicrate-production.railway.app`
   - `SPOTIFY_REDIRECT_URI=https://musicrate-production.railway.app/api/auth/callback`

### 2.6 - Deploy
1. Railway fará deploy automaticamente
2. Aguarde o build completar (~5 minutos)
3. Verifique logs em **"Deployments" → "View Logs"**
4. Teste: `https://seu-backend.railway.app/api/health`

**Resposta esperada:**
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2025-12-04T..."
}
```

---

## 🌐 PARTE 3: DEPLOY DO FRONTEND NA VERCEL

### 3.1 - Atualizar configuração do Frontend
Edite `frontend/.env.production`:
```bash
NEXT_PUBLIC_API_URL=https://musicrate-production.railway.app
NEXT_PUBLIC_APP_URL=https://seu-app.vercel.app
```

Commit:
```bash
cd frontend
git add .env.production
git commit -m "feat: adiciona variáveis de produção"
git push origin feat/reviews
```

### 3.2 - Criar conta na Vercel
1. Acesse: https://vercel.com
2. Faça login com GitHub
3. Clique em **"Add New..." → "Project"**

### 3.3 - Importar projeto
1. Selecione o repositório `musicRATE`
2. Clique em **"Import"**
3. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### 3.4 - Adicionar variáveis de ambiente
Na seção **"Environment Variables"**:

```bash
NEXT_PUBLIC_API_URL=https://musicrate-production.railway.app
NEXT_PUBLIC_APP_URL=https://seu-app.vercel.app
```

### 3.5 - Deploy
1. Clique em **"Deploy"**
2. Aguarde build (~3 minutos)
3. Vercel fornecerá uma URL: `https://music-rate-xyz.vercel.app`

### 3.6 - Atualizar URL no Backend
Volte no Railway:
1. Vá em **Variables** do backend
2. Atualize `FRONTEND_URL=https://music-rate-xyz.vercel.app`
3. Railway fará redeploy automaticamente

---

## 🎵 PARTE 4: CONFIGURAR SPOTIFY DEVELOPER

### 4.1 - Atualizar Redirect URIs
1. Acesse: https://developer.spotify.com/dashboard
2. Selecione seu app
3. Clique em **"Edit Settings"**
4. Em **"Redirect URIs"**, adicione:
   ```
   https://musicrate-production.railway.app/api/auth/callback
   https://seu-app.vercel.app/auth/callback
   ```
5. Salve

---

## ✅ PARTE 5: TESTAR O SISTEMA

### 5.1 - Testes básicos
```bash
# 1. Health check do backend
curl https://musicrate-production.railway.app/api/health

# 2. Teste Spotify search
curl https://musicrate-production.railway.app/api/spotify/search?q=Radiohead&type=artist

# 3. Acesse o frontend
# Abra: https://seu-app.vercel.app
```

### 5.2 - Fluxo completo
1. ✅ Acesse o frontend
2. ✅ Clique em "Login com Spotify"
3. ✅ Autorize o app no Spotify
4. ✅ Deve retornar logado
5. ✅ Busque um artista/álbum
6. ✅ Crie uma review
7. ✅ Siga um usuário/artista
8. ✅ Veja notificações

---

## 🔧 COMANDOS ÚTEIS - RAILWAY CLI

### Instalar Railway CLI (opcional)
```bash
# Windows (PowerShell)
iwr https://railway.app/install.ps1 -useb | iex

# Login
railway login

# Ver logs em tempo real
railway logs

# Rodar migrations manualmente
railway run php artisan migrate --force

# Acessar banco de dados
railway connect postgresql
```

---

## 💰 CUSTOS ESTIMADOS

### Railway (Backend + PostgreSQL)
- **Hobby Plan**: $5/mês
- Inclui: 500GB de bandwidth, $5 de usage
- PostgreSQL compartilhado incluído
- **Crédito grátis**: $5 no primeiro mês

### Vercel (Frontend)
- **Hobby Plan**: GRÁTIS
- Inclui: 100GB de bandwidth
- Domínio .vercel.app gratuito
- Build automático do Git

### Total: $5/mês (ou grátis no primeiro mês)

---

## 🎯 OPÇÃO 2: RENDER + VERCEL (ALTERNATIVA GRATUITA)

Se preferir começar 100% gratuito:

### Backend no Render (FREE)
1. Acesse: https://render.com
2. Crie **"New Web Service"**
3. Conecte o GitHub
4. Configure:
   - **Root Directory**: `backend/musicrate-api`
   - **Build Command**: `composer install --no-dev && php artisan key:generate --force`
   - **Start Command**: `php artisan serve --host=0.0.0.0 --port=$PORT`
5. Adicione **PostgreSQL** (Free tier)
6. Configure variáveis de ambiente (mesmas do Railway)

**⚠️ Limitações do Free tier:**
- App hiberna após 15min de inatividade
- Cold start de 50 segundos na primeira requisição
- Adequado para projetos pessoais/portfólio

---

## 🛠️ TROUBLESHOOTING COMUM

### Erro: "No application encryption key"
```bash
# Gere localmente
php artisan key:generate --show

# Copie o resultado e adicione em APP_KEY no Railway
```

### Erro: "CORS blocked"
Verifique `config/cors.php` e variável `FRONTEND_URL`

### Erro: "Database connection failed"
Verifique se as variáveis `PGHOST`, `PGPORT`, etc. estão definidas no Railway

### Erro: "419 Session expired"
Verifique:
- `SESSION_SECURE_COOKIE=true`
- `SESSION_SAME_SITE=none`
- Frontend usando HTTPS

### Frontend não conecta com backend
Verifique `NEXT_PUBLIC_API_URL` no Vercel

### Build falha no Railway
Verifique:
- Root Directory está correto: `backend/musicrate-api`
- `composer.json` existe no diretório
- Logs de build para ver erro específico

---

## 📚 DOCUMENTAÇÃO ADICIONAL

- Railway: https://docs.railway.app
- Vercel: https://vercel.com/docs
- Laravel Deploy: https://laravel.com/docs/deployment
- Next.js Deploy: https://nextjs.org/docs/deployment

---

## 🎉 PRÓXIMOS PASSOS

Após deploy bem-sucedido:

1. **Domínio customizado**
   - Railway: Adicione domínio em Settings → Networking
   - Vercel: Adicione domínio em Settings → Domains

2. **Monitoramento**
   - Railway: Veja métricas em tempo real
   - Vercel: Analytics automático

3. **CI/CD**
   - Deploy automático a cada push na branch
   - Configure branch de produção

4. **Backup do banco**
   - Railway: Snapshots automáticos
   - Configure backups periódicos

5. **Segurança**
   - Adicione rate limiting
   - Monitore logs de acesso
   - Configure alertas

---

## 📝 CHECKLIST FINAL

Antes de fazer deploy, verifique:

**Backend:**
- [ ] `.env.production` criado
- [ ] `APP_KEY` gerado
- [ ] Credenciais Spotify configuradas
- [ ] `/api/health` endpoint funciona
- [ ] CORS configurado corretamente
- [ ] Migrations testadas localmente

**Frontend:**
- [ ] `.env.production` criado
- [ ] URLs de produção configuradas
- [ ] Build local funciona (`npm run build`)
- [ ] Variáveis NEXT_PUBLIC_ estão corretas

**Spotify:**
- [ ] Redirect URIs de produção adicionados
- [ ] App está em modo Development (ou Production se aprovado)

**Git:**
- [ ] Código commitado e pushed
- [ ] Branch de produção definida
- [ ] .gitignore correto (não ignora .env.production)

---

**✅ Seu projeto está pronto para produção!**

Qualquer dúvida durante o processo, consulte a seção de troubleshooting ou a documentação oficial das plataformas. 🚀
