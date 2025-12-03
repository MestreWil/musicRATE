# 🎵 MusicRATE - Plataforma de Avaliação Musical

Sistema completo de avaliação de músicas integrado com a API do Spotify, permitindo aos usuários descobrir, avaliar e discutir álbuns, artistas e faixas.

## 📋 Índice
- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Como Rodar](#como-rodar)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [API Endpoints](#api-endpoints)
- [Status da Integração](#status-da-integração)

## 🎯 Sobre o Projeto

MusicRATE é uma plataforma web que permite:
- 🔍 Buscar álbuns, artistas e faixas do Spotify
- ⭐ Avaliar álbuns com notas de 1 a 10
- 📝 Escrever reviews detalhadas
- 📊 Ver estatísticas e rankings
- 👥 Autenticação via Spotify OAuth

## ✨ Funcionalidades

### Já Implementadas ✅
- ✅ Busca integrada com Spotify API
- ✅ Visualização de álbuns, artistas e faixas
- ✅ Sistema completo de reviews (CRUD)
- ✅ Estatísticas e rankings
- ✅ Interface responsiva e moderna
- ✅ Dark mode
- ✅ CORS configurado
- ✅ Backend rodando via Docker

### Em Desenvolvimento 🚧
- 🚧 Autenticação Spotify OAuth no frontend
- 🚧 Perfil de usuário
- 🚧 Sistema de favoritos
- 🚧 Comentários em reviews
- 🚧 Compartilhamento social

## 🛠️ Tecnologias

### Backend
- **Laravel 12** - Framework PHP
- **PostgreSQL 15** - Banco de dados
- **Docker** - Containerização
- **Sanctum** - Autenticação API
- **Guzzle** - HTTP Client para Spotify API

### Frontend
- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Estilização
- **Turbopack** - Build tool

### Integrações
- **Spotify Web API** - Dados musicais
- **Spotify OAuth** - Autenticação de usuários

## 🚀 Como Rodar

### Pré-requisitos
- Docker Desktop
- Node.js 18+
- Git

### Passo a Passo

#### 1. Backend (Laravel + PostgreSQL)
```powershell
# Navegar até o backend
cd "backend\musicrate-api"

# Iniciar containers Docker
docker-compose up -d

# Verificar se está rodando
docker ps

# Testar API
Invoke-RestMethod -Uri "http://localhost:8000/api/reviews/stats"
```

#### 2. Frontend (Next.js)
```powershell
# Em outro terminal, navegar até o frontend
cd "frontend"

# Instalar dependências (primeira vez)
npm install

# Iniciar servidor dev
npm run dev

# Abrir navegador em:
# http://localhost:3000
```

### Documentação Detalhada
- 📘 [Como Rodar - Guia Completo](COMO_RODAR.md)
- 📗 [Integração API](INTEGRACAO_API.md)
- 📕 [API Documentation](backend/musicrate-api/API_DOCUMENTATION.md)

## 📁 Estrutura do Projeto

```
musicRATE/
├── backend/
│   └── musicrate-api/           # Laravel 12 API
│       ├── app/
│       │   ├── Http/
│       │   │   └── Controllers/ # AuthController, SpotifyController, ReviewController
│       │   ├── Models/          # User, Review, ArtistFollow
│       │   └── Services/        # SpotifyService
│       ├── routes/
│       │   └── api.php          # Rotas da API
│       ├── config/
│       │   ├── cors.php         # Configuração CORS
│       │   └── services.php     # Credenciais Spotify
│       └── docker-compose.yml   # Docker config
│
├── frontend/
│   ├── src/
│   │   ├── app/                 # Pages (Next.js App Router)
│   │   │   ├── albums/          # Páginas de álbuns
│   │   │   ├── artists/         # Páginas de artistas
│   │   │   ├── tracks/          # Páginas de faixas
│   │   │   └── trending/        # Página de tendências (usa API real)
│   │   ├── components/          # Componentes React
│   │   │   ├── AlbumCard.tsx
│   │   │   ├── ReviewCard.tsx
│   │   │   ├── ReviewForm.tsx
│   │   │   └── SearchBar.tsx
│   │   └── lib/                 # Utilities
│   │       ├── api.ts           # Client API base
│   │       ├── spotify.ts       # Funções Spotify API
│   │       ├── reviews.ts       # Funções Reviews API
│   │       └── types.ts         # TypeScript types
│   │
│   └── .env.local               # Config (NEXT_PUBLIC_BACKEND_API_BASE_URL)
│
├── COMO_RODAR.md               # Guia rápido de inicialização
├── INTEGRACAO_API.md           # Documentação da integração
└── README.md                   # Este arquivo
```

## 🔌 API Endpoints

### Públicos (Sem Autenticação)

#### Reviews
```
GET  /api/reviews                    # Lista todas as reviews
GET  /api/reviews/{id}               # Detalhes de uma review
GET  /api/reviews/album/{albumId}    # Reviews de um álbum
GET  /api/reviews/stats              # Estatísticas gerais
```

#### Spotify
```
GET  /api/spotify/search/albums?q={query}        # Buscar álbuns
GET  /api/spotify/search/artists?q={query}       # Buscar artistas
GET  /api/spotify/albums/{id}                    # Detalhes de álbum
GET  /api/spotify/artists/{id}                   # Detalhes de artista
GET  /api/spotify/artists/{id}/albums            # Álbuns do artista
GET  /api/spotify/artists/{id}/top-tracks        # Top tracks
GET  /api/spotify/tracks/{id}                    # Detalhes de track
GET  /api/spotify/browse/new-releases            # Novos lançamentos
```

### Autenticados (Requer Spotify OAuth)

```
GET   /api/auth/spotify              # Inicia login Spotify
GET   /api/auth/callback             # Callback OAuth
POST  /api/reviews                   # Criar review
PUT   /api/reviews/{id}              # Editar review
DELETE /api/reviews/{id}             # Deletar review
GET   /api/reviews/me                # Minhas reviews
```

## ✅ Status da Integração

### Backend
- ✅ Docker configurado e funcionando
- ✅ Banco de dados PostgreSQL rodando
- ✅ Migrations executadas
- ✅ CORS configurado
- ✅ Spotify API integrada (Client Credentials)
- ✅ Sistema de reviews completo
- ✅ Rotas públicas funcionais

### Frontend
- ✅ Next.js 15 configurado
- ✅ Tailwind CSS 4 funcionando
- ✅ Client API (`lib/api.ts`) implementado
- ✅ Funções Spotify (`lib/spotify.ts`) criadas
- ✅ Funções Reviews (`lib/reviews.ts`) criadas
- ✅ Página "Trending" usando dados reais
- ✅ Componentes reutilizáveis prontos

### A Fazer
- 🚧 Implementar Spotify OAuth no frontend
- 🚧 Substituir dados mockados por API real em todas as páginas
- 🚧 Sistema de perfil de usuário
- 🚧 Upload de avatar
- 🚧 Sistema de favoritos/seguir artistas

## 🧪 Testando

### Testar Backend
```powershell
# Ver estatísticas
Invoke-RestMethod -Uri "http://localhost:8000/api/reviews/stats"

# Buscar álbuns
Invoke-RestMethod -Uri "http://localhost:8000/api/spotify/search/albums?q=Beatles"

# Ver novos lançamentos
Invoke-RestMethod -Uri "http://localhost:8000/api/spotify/browse/new-releases"
```

### Testar Frontend
1. Acessar http://localhost:3000
2. Clicar em "Trending" no menu
3. Deve carregar novos lançamentos do Spotify
4. Usar a barra de busca
5. Clicar em um álbum/artista para ver detalhes

## 📚 Documentação Adicional

- [Como Rodar - Guia Rápido](COMO_RODAR.md)
- [Integração Backend-Frontend](INTEGRACAO_API.md)
- [API Documentation](backend/musicrate-api/API_DOCUMENTATION.md)
- [Setup Rápido Backend](backend/musicrate-api/SETUP_RAPIDO.md)
- [SQL Queries](backend/musicrate-api/SQL_QUERIES.md)

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT.

## 👨‍💻 Desenvolvido por

Projeto desenvolvido como trabalho acadêmico para o Senac.

Desenvolvedor FrontEnd: Thiago Schiedeck Dias
Desenvolvedor Backend: William Tavares de Moura

---

**Status:** 🟢 Backend funcionando | 🟡 Frontend em integração

Para iniciar rapidamente, veja: [COMO_RODAR.md](COMO_RODAR.md)
