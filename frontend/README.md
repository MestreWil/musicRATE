<div align="center">

# 🎧 MusicRate (Frontend)

Plataforma estilo RottenTomatoes / Metacritic / IMDb focada em descobrir e valorizar artistas e lançamentos independentes usando dados da API do Spotify e avaliações da comunidade.

</div>

## 🧱 Stack

- Next.js 15 (App Router, React 19, Turbopack)
- TypeScript
- Tailwind CSS v4
- ESLint (config Next) + futura adoção de Prettier (opcional)

## 🚀 Objetivo
Permitir que usuários:

- Avaliem álbuns, faixas e artistas
- Sigam artistas e vejam tendências da cena independente
- Descubram novos lançamentos filtrados por métricas (popularidade, seguidores, etc.) priorizando artistas menores
- Comentem e interajam sobre obras

## 🔌 Integração Backend
O backend (Laravel) fornecerá endpoints para:

- CRUD de avaliações / notas agregadas
- Comentários e threads
- Relacionamentos (seguir artista / usuário)
- Autenticação (provavelmente JWT ou Sanctum)
- Proxy seguro para Spotify (obter tokens e filtrar dados)

O frontend NÃO deve expor `client_secret` do Spotify. Todo fluxo OAuth ou Client Credentials ocorre no backend.

## 📁 Estrutura (inicial)

```
src/
	app/
		(rotas - App Router)
	components/
	lib/
	styles/
```

## 🔑 Variáveis de Ambiente

Copie `.env.example` para `.env.local` e ajuste conforme necessário.

| Nome | Descrição | Frontend | Exemplo |
|------|-----------|----------|---------|
| NEXT_PUBLIC_BACKEND_API_BASE_URL | URL base da API Laravel | Sim | http://localhost:8000/api |
| NEXT_PUBLIC_IMAGE_BASE_URL | CDN/host de imagens custom | Opcional | https://cdn.example.com |
| NEXT_PUBLIC_FEATURE_TRENDING | Feature flag tendências | Sim | true |
| NEXT_PUBLIC_FEATURE_RATINGS | Feature flag avaliações | Sim | true |

Credenciais Spotify: mantenha em variáveis privadas no backend (`SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`).

## 🏃‍♂️ Rodando Localmente

```bash
npm install
npm run dev
```

Acesse: http://localhost:3000

## 🧪 Próximos Passos (roadmap sugerido)

- Layout base (Navbar/Footer) e tema dark/light
- Modelos de tipos (Artist, Album, Track, Rating, User)
- Paginações e busca incremental (debounce)
- Sistema de autenticação (login, registro) integrado ao Laravel
- Rate limiter visual para evitar spam de avaliações
- Página de tendências (agregação por recorte temporal)
- Otimização de imagens e cache incremental (React Server Components + revalidate)

## 🧱 Convenções de Código

- Imports absolutos com alias `@/`
- Componentes server vs client: usar `"use client"` somente quando necessário (interações, estado, hooks)
- Separar lógica de fetch em `src/lib/`

## 🛡️ Qualidade

Executar lint:
```bash
npm run lint
```

Adicionar futuramente: testes com Vitest/Testing Library.

## 📄 Licença
Definir posteriormente (MIT sugerido se open source).

---
Made with ❤️ para apoiar artistas independentes.
