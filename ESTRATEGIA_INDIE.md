# Estratégia de Priorização de Artistas Independentes

## Objetivo
Dar destaque a artistas independentes e menores, alinhado com a proposta do MusicRate de ser uma plataforma voltada ao público independente e underground.

## Implementação Atual

### 1. Filtros de Artistas (Artists for you)

**Buscas por gêneros indie/alternativos:**
- `indie` (15 resultados)
- `alternative` (15 resultados)  
- `underground` (10 resultados)
- `lo-fi` (10 resultados)

**Critérios de filtragem:**
- ✅ Popularidade < 60 (escala Spotify: 0-100)
- ✅ Seguidores < 500.000
- ✅ Ordenação: Menor popularidade primeiro (mais independente)

**Resultado:** Apenas artistas que atendem AMBOS os critérios aparecem na seção "Artists for you"

### 2. Filtros de Álbuns e Singles

**Busca adicional:**
- Álbuns com termo "indie" (30 resultados)

**Função de detecção:** `isIndependentRelease()`
- Verifica se artistas do lançamento têm gêneros indie/alternativos
- Gêneros detectados: `indie`, `alternative`, `underground`, `lo-fi`, `bedroom`

**Priorização:**
- Singles: ~70% indie, ~30% mainstream
- Álbuns: Independentes aparecem primeiro na lista

### 3. Métricas de Monitoramento

**Console logs adicionados:**
```javascript
✅ Independent Artists (filtered): X items
📊 Popularidade média: Y
🎵 Singles: X (Y indie)
💿 Full Albums: X (Y indie)
```

## Limitações da API do Spotify

### Endpoint `/browse/new-releases`
- ❌ Não retorna `popularity` dos artistas
- ❌ Não permite filtro direto por popularidade
- ✅ Retorna gêneros dos artistas (quando disponível)

### Endpoint `/search/artists`
- ✅ Retorna `popularity` e `followers`
- ✅ Permite busca por termos/gêneros
- ⚠️ Resultados ainda incluem artistas maiores se correspondem ao termo

## Melhorias Futuras

### 1. Backend Custom (Recomendado)
```php
// Criar endpoint no Laravel que:
- Busca múltiplas páginas de resultados
- Aplica filtros mais rigorosos
- Cache de artistas indie verificados
- Integra com banco de dados próprio
```

### 2. Sistema de Curadoria
- Lista mantida manualmente de artistas independentes verificados
- Reviews e ratings próprios da plataforma
- Algoritmo que combina métricas Spotify + engajamento MusicRate

### 3. Filtros Adicionais
- Data de lançamento (priorizar recentes)
- País/região (foco em cenas locais)
- Selos independentes conhecidos
- Número de lançamentos (artistas emergentes têm poucos)

### 4. Machine Learning (Longo prazo)
- Modelo treinado para identificar características indie
- Análise de metadados musicais
- Detecção de nicho/subgênero

## Configuração Atual

### Thresholds (ajustáveis em `page.tsx`)
```typescript
const INDIE_MAX_FOLLOWERS = 500000;    // 500k seguidores
const INDIE_MAX_POPULARITY = 60;        // 60/100 popularidade

// Para ser mais restritivo:
const INDIE_MAX_FOLLOWERS = 100000;    // 100k seguidores
const INDIE_MAX_POPULARITY = 40;        // 40/100 popularidade
```

### Gêneros monitorados
```typescript
const INDIE_GENRES = [
  'indie',
  'alternative', 
  'underground',
  'lo-fi',
  'bedroom',
  // Adicionar mais conforme necessário:
  // 'shoegaze', 'post-punk', 'dream pop', etc.
];
```

## Como Testar

1. Abrir DevTools (F12) → Console
2. Recarregar página inicial
3. Verificar logs:
   - Quantos artistas foram filtrados
   - Popularidade média (quanto menor, melhor)
   - Proporção indie vs mainstream

## Próximos Passos

1. ✅ Implementado filtros básicos
2. ⏳ Ajustar thresholds baseado em feedback
3. ⏳ Adicionar mais gêneros indie ao filtro
4. ⏳ Criar endpoint backend dedicado
5. ⏳ Implementar sistema de reviews próprio
6. ⏳ Integrar métricas MusicRate (quando disponível)

---

**Data de implementação:** 2 de dezembro de 2025  
**Autor:** Sistema de desenvolvimento MusicRate
