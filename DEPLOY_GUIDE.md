# 🚀 Guia de Deploy - MusicRATE

## 📋 Checklist de Preparação para Produção

### 🔐 Segurança

#### Backend (Laravel)

**1. Variáveis de Ambiente (.env)**
```bash
# ⚠️ CRÍTICO: Ajuste estas configurações para produção

APP_ENV=production
APP_DEBUG=false
APP_URL=https://api.seudominio.com

# Sessão - HTTPS obrigatório
SESSION_SECURE_COOKIE=true      # ✅ Requer HTTPS
SESSION_SAME_SITE=none          # ✅ Permite cross-origin com HTTPS
SESSION_HTTP_ONLY=true          # ✅ Proteção contra XSS
SESSION_DOMAIN=.seudominio.com  # ✅ Permite subdomínios

# CORS
FRONTEND_URL=https://seudominio.com
SANCTUM_STATEFUL_DOMAINS=seudominio.com,www.seudominio.com
```

**2. Comandos Pré-Deploy**
```bash
# Gerar nova APP_KEY (faça backup da antiga se tiver dados encriptados)
php artisan key:generate

# Limpar caches
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear

# Otimizar para produção
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Rodar migrações
php artisan migrate --force

# Criar tabela de sessões se não existir
php artisan session:table
php artisan migrate
```

**3. Servidor Web**
- ✅ Configure HTTPS/SSL (Let's Encrypt recomendado)
- ✅ Aponte para `/public` (não para a raiz do projeto)
- ✅ Configure redirect HTTP → HTTPS
- ✅ Configure headers de segurança

**4. Banco de Dados**
- ✅ Use senha forte
- ✅ Limite conexões apenas do servidor da aplicação
- ✅ Configure backups automáticos
- ✅ Use PostgreSQL 15+ ou MySQL 8+

---

#### Frontend (Next.js)

**1. Variáveis de Ambiente**

Crie `.env.production`:
```bash
NEXT_PUBLIC_BACKEND_URL=https://api.seudominio.com
NEXT_PUBLIC_BACKEND_API_BASE_URL=https://api.seudominio.com/api
```

**2. Build de Produção**
```bash
# Instalar dependências
npm install

# Build otimizado
npm run build

# Testar localmente antes do deploy
npm run start
```

**3. next.config.ts**
Já está configurado para aceitar imagens do Spotify CDN ✅

---

### 🌐 Opções de Deploy

#### **Opção 1: Vercel (Frontend) + Railway/Render (Backend)**

**Frontend no Vercel:**
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel --prod
```

**Backend no Railway:**
1. Conecte seu repositório GitHub
2. Configure variáveis de ambiente via dashboard
3. Railway detecta Laravel automaticamente
4. Adicione PostgreSQL como add-on

**Backend no Render:**
1. Conecte repositório GitHub
2. Configure como "Web Service"
3. Build Command: `composer install && php artisan migrate --force`
4. Start Command: `php artisan serve --host=0.0.0.0 --port=$PORT`

---

#### **Opção 2: VPS (DigitalOcean, AWS, Linode)**

**Stack Recomendada:**
- Ubuntu 22.04 LTS
- Nginx
- PHP 8.2+ com FPM
- PostgreSQL 15
- Redis (para cache e sessions)
- Certbot (SSL)

**Setup Rápido:**
```bash
# 1. Instalar dependências
sudo apt update
sudo apt install nginx php8.2-fpm php8.2-pgsql php8.2-redis postgresql redis-server

# 2. Clonar repositório
cd /var/www
git clone seu-repo.git musicrate
cd musicrate/backend/musicrate-api

# 3. Instalar dependências PHP
composer install --optimize-autoloader --no-dev

# 4. Configurar permissões
sudo chown -R www-data:www-data storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache

# 5. Configurar .env (copiar do .env.production.example)
cp .env.production.example .env
nano .env  # Edite as variáveis

# 6. Otimizar
php artisan key:generate
php artisan migrate --force
php artisan config:cache
php artisan route:cache

# 7. Configurar Nginx
sudo nano /etc/nginx/sites-available/musicrate
# (copie configuração abaixo)

# 8. SSL com Let's Encrypt
sudo certbot --nginx -d api.seudominio.com
```

**Configuração Nginx:**
```nginx
server {
    listen 80;
    server_name api.seudominio.com;
    root /var/www/musicrate/backend/musicrate-api/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

---

#### **Opção 3: Docker (Recomendado para Consistência)**

**docker-compose.production.yml:**
```yaml
version: '3.8'

services:
  app:
    build:
      context: ./backend/musicrate-api
      dockerfile: Dockerfile.production
    environment:
      - APP_ENV=production
    volumes:
      - ./backend/musicrate-api:/app
    networks:
      - musicrate-network
    depends_on:
      - db
      - redis

  db:
    image: postgres:15
    environment:
      POSTGRES_DB: musicrate_production
      POSTGRES_USER: musicrate
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - musicrate-network

  redis:
    image: redis:alpine
    networks:
      - musicrate-network

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    networks:
      - musicrate-network

networks:
  musicrate-network:
    driver: bridge

volumes:
  postgres_data:
```

---

### 🔍 Diferenças: Desenvolvimento vs Produção

| Configuração | Desenvolvimento | Produção |
|--------------|----------------|----------|
| `APP_ENV` | local | production |
| `APP_DEBUG` | true | **false** |
| `APP_URL` | http://localhost | https://api.seudominio.com |
| `SESSION_SECURE_COOKIE` | false | **true** |
| `SESSION_SAME_SITE` | lax | **none** |
| `SESSION_HTTP_ONLY` | false (debug) | **true** |
| `SESSION_DOMAIN` | vazio | .seudominio.com |
| HTTPS | Não obrigatório | **OBRIGATÓRIO** |
| Cache | Desabilitado | **config:cache, route:cache** |

---

### ✅ Testes Pós-Deploy

```bash
# 1. Verificar health
curl https://api.seudominio.com/up

# 2. Testar CORS
curl -H "Origin: https://seudominio.com" \
     -H "Access-Control-Request-Method: POST" \
     -X OPTIONS \
     https://api.seudominio.com/api/auth/me

# 3. Testar sessão
curl -c cookies.txt https://api.seudominio.com/api/auth/me
curl -b cookies.txt https://api.seudominio.com/api/auth/me
# Session ID deve ser o mesmo

# 4. Verificar logs
tail -f storage/logs/laravel.log
```

---

### 📊 Monitoramento

**Recomendações:**
- **Sentry** para tracking de erros
- **New Relic** ou **DataDog** para performance
- **Uptime Robot** para monitorar disponibilidade
- **LogRocket** ou **FullStory** para sessões de usuário (frontend)

---

### 🆘 Troubleshooting Comum

**Problema: Sessão não persiste em produção**
```bash
# Verificar:
1. HTTPS está ativo? (obrigatório para SESSION_SECURE_COOKIE=true)
2. SESSION_DOMAIN está correto? (use .seudominio.com para incluir subdomínios)
3. SANCTUM_STATEFUL_DOMAINS inclui seu domínio?
4. Frontend está enviando credentials: 'include'?
```

**Problema: CORS bloqueando requisições**
```bash
# Verificar:
1. config/cors.php tem seu domínio em allowed_origins?
2. supports_credentials está true?
3. Frontend está no mesmo domínio ou subdomínio?
```

---

### 📝 Checklist Final

- [ ] `.env` configurado com valores de produção
- [ ] APP_KEY gerado (`php artisan key:generate`)
- [ ] Migrations rodadas (`php artisan migrate --force`)
- [ ] Caches criados (`config:cache`, `route:cache`)
- [ ] HTTPS configurado e funcionando
- [ ] Domínios DNS configurados (A record, CNAME)
- [ ] Variáveis de ambiente do frontend apontando para API de produção
- [ ] Spotify App configurado com redirect_uri de produção
- [ ] Backup do banco configurado
- [ ] Monitoramento ativo
- [ ] Logs sendo salvos e rotacionados

---

### 🎯 Comandos Úteis

```bash
# Rollback de migração
php artisan migrate:rollback

# Ver status das migrações
php artisan migrate:status

# Limpar sessões expiradas
php artisan schedule:run

# Limpar todos os caches
php artisan optimize:clear

# Ver rotas
php artisan route:list

# Ver configuração atual
php artisan config:show session
```

---

## 🚨 IMPORTANTE

**Nunca faça commit de:**
- `.env` (use `.env.example`)
- `vendor/` (use `composer install`)
- `node_modules/` (use `npm install`)
- Chaves privadas
- Senhas

**Sempre:**
- Use variáveis de ambiente
- Mantenha dependências atualizadas
- Faça backup regular
- Monitore logs de erro
- Teste em staging antes de produção
