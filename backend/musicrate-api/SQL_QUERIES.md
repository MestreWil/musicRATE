# 📊 Queries SQL Úteis - MusicRATE

## Estatísticas e Analytics

### Top 10 Álbuns Mais Avaliados

```sql
SELECT
    spotify_album_id,
    album_name,
    artist_name,
    COUNT(*) as review_count,
    AVG(rating) as avg_rating,
    MIN(rating) as min_rating,
    MAX(rating) as max_rating
FROM reviews
GROUP BY spotify_album_id, album_name, artist_name
HAVING COUNT(*) >= 5
ORDER BY review_count DESC
LIMIT 10;
```

### Top 10 Álbuns Melhor Avaliados (mínimo 3 reviews)

```sql
SELECT
    spotify_album_id,
    album_name,
    artist_name,
    AVG(rating) as avg_rating,
    COUNT(*) as review_count
FROM reviews
GROUP BY spotify_album_id, album_name, artist_name
HAVING COUNT(*) >= 3
ORDER BY avg_rating DESC
LIMIT 10;
```

### Usuários Mais Ativos (mais reviews)

```sql
SELECT
    u.id,
    u.name,
    u.email,
    COUNT(r.id) as total_reviews,
    AVG(r.rating) as avg_rating_given
FROM users u
LEFT JOIN reviews r ON u.id = r.user_id
GROUP BY u.id, u.name, u.email
ORDER BY total_reviews DESC
LIMIT 20;
```

### Distribuição de Ratings Geral

```sql
SELECT
    rating,
    COUNT(*) as count,
    ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM reviews)), 2) as percentage
FROM reviews
GROUP BY rating
ORDER BY rating DESC;
```

### Reviews Recentes (última semana)

```sql
SELECT
    r.*,
    u.name as user_name,
    u.email as user_email
FROM reviews r
JOIN users u ON r.user_id = u.id
WHERE r.created_at >= NOW() - INTERVAL '7 days'
ORDER BY r.created_at DESC;
```

### Artistas Mais Bem Avaliados

```sql
SELECT
    artist_name,
    COUNT(DISTINCT spotify_album_id) as album_count,
    COUNT(*) as total_reviews,
    AVG(rating) as avg_rating
FROM reviews
WHERE artist_name IS NOT NULL
GROUP BY artist_name
HAVING COUNT(*) >= 5
ORDER BY avg_rating DESC
LIMIT 20;
```

### Reviews Mais Longas (com texto)

```sql
SELECT
    r.id,
    u.name as user_name,
    r.album_name,
    r.rating,
    LENGTH(r.review_text) as text_length,
    r.review_text
FROM reviews r
JOIN users u ON r.user_id = u.id
WHERE r.review_text IS NOT NULL
ORDER BY text_length DESC
LIMIT 10;
```

### Comparar Rating de um Usuário vs Média Geral

```sql
SELECT
    r.spotify_album_id,
    r.album_name,
    r.rating as user_rating,
    (SELECT AVG(rating) FROM reviews WHERE spotify_album_id = r.spotify_album_id) as avg_rating,
    r.rating - (SELECT AVG(rating) FROM reviews WHERE spotify_album_id = r.spotify_album_id) as difference
FROM reviews r
WHERE r.user_id = 1  -- Altere para o ID do usuário
ORDER BY ABS(difference) DESC;
```

### Álbuns Mais Controversos (maior desvio padrão)

```sql
SELECT
    spotify_album_id,
    album_name,
    artist_name,
    COUNT(*) as review_count,
    AVG(rating) as avg_rating,
    STDDEV(rating) as rating_stddev
FROM reviews
GROUP BY spotify_album_id, album_name, artist_name
HAVING COUNT(*) >= 5
ORDER BY rating_stddev DESC
LIMIT 10;
```

### Timeline de Atividade (reviews por dia)

```sql
SELECT
    DATE(created_at) as date,
    COUNT(*) as reviews_count,
    AVG(rating) as avg_rating
FROM reviews
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;
```

---

## Queries de Manutenção

### Remover Duplicatas (caso existam)

```sql
-- Encontrar duplicatas
SELECT user_id, spotify_album_id, COUNT(*)
FROM reviews
GROUP BY user_id, spotify_album_id
HAVING COUNT(*) > 1;

-- Deletar duplicatas (mantém a mais recente)
DELETE FROM reviews
WHERE id NOT IN (
    SELECT MAX(id)
    FROM reviews
    GROUP BY user_id, spotify_album_id
);
```

### Atualizar Cache de Álbuns (se necessário)

```sql
-- Caso precise resetar os campos de cache
UPDATE reviews
SET album_name = NULL, artist_name = NULL, album_image_url = NULL
WHERE album_name IS NOT NULL;
```

### Verificar Integridade dos Dados

```sql
-- Reviews sem usuário (não deveria existir)
SELECT * FROM reviews
WHERE user_id NOT IN (SELECT id FROM users);

-- Reviews com rating fora do range
SELECT * FROM reviews
WHERE rating < 1 OR rating > 10;

-- Reviews muito antigas (mais de 1 ano)
SELECT COUNT(*) as old_reviews
FROM reviews
WHERE created_at < NOW() - INTERVAL '1 year';
```

---

## Índices Recomendados (já criados na migration)

```sql
-- Criados automaticamente:
CREATE INDEX idx_reviews_album_created ON reviews(spotify_album_id, created_at);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE UNIQUE INDEX idx_reviews_user_album ON reviews(user_id, spotify_album_id);
```

---

## Views Úteis

### View de Álbuns com Estatísticas

```sql
CREATE OR REPLACE VIEW album_stats AS
SELECT
    spotify_album_id,
    MAX(album_name) as album_name,
    MAX(artist_name) as artist_name,
    MAX(album_image_url) as album_image_url,
    COUNT(*) as review_count,
    AVG(rating) as avg_rating,
    MIN(rating) as min_rating,
    MAX(rating) as max_rating,
    STDDEV(rating) as rating_stddev,
    MAX(created_at) as last_review_date
FROM reviews
GROUP BY spotify_album_id;

-- Usar:
SELECT * FROM album_stats WHERE review_count >= 5 ORDER BY avg_rating DESC;
```

### View de Usuários com Estatísticas

```sql
CREATE OR REPLACE VIEW user_stats AS
SELECT
    u.id,
    u.name,
    u.email,
    COUNT(r.id) as total_reviews,
    AVG(r.rating) as avg_rating_given,
    MIN(r.created_at) as first_review_date,
    MAX(r.created_at) as last_review_date
FROM users u
LEFT JOIN reviews r ON u.id = r.user_id
GROUP BY u.id, u.name, u.email;

-- Usar:
SELECT * FROM user_stats ORDER BY total_reviews DESC;
```

---

## Backup e Restore

### Exportar Reviews

```bash
# PostgreSQL
pg_dump -U postgres -t reviews musicrate > reviews_backup.sql

# Docker
docker exec musicrate_db pg_dump -U postgres -t reviews musicrate > reviews_backup.sql
```

### Importar Reviews

```bash
psql -U postgres musicrate < reviews_backup.sql

# Docker
docker exec -i musicrate_db psql -U postgres musicrate < reviews_backup.sql
```

---

## Queries para Dashboard

### Cards Principais

```sql
-- Total de Reviews
SELECT COUNT(*) as total_reviews FROM reviews;

-- Média Geral
SELECT ROUND(AVG(rating), 2) as average_rating FROM reviews;

-- Total de Usuários Ativos
SELECT COUNT(DISTINCT user_id) as active_users FROM reviews;

-- Total de Álbuns Avaliados
SELECT COUNT(DISTINCT spotify_album_id) as albums_reviewed FROM reviews;
```

### Gráfico de Crescimento (últimos 12 meses)

```sql
SELECT
    TO_CHAR(created_at, 'YYYY-MM') as month,
    COUNT(*) as reviews,
    COUNT(DISTINCT user_id) as unique_users,
    AVG(rating) as avg_rating
FROM reviews
WHERE created_at >= NOW() - INTERVAL '12 months'
GROUP BY TO_CHAR(created_at, 'YYYY-MM')
ORDER BY month;
```

---

## Performance Tips

1. **Sempre use índices em WHERE/JOIN:**
    - `spotify_album_id`, `user_id`, `created_at`, `rating`

2. **Use EXPLAIN ANALYZE para queries lentas:**

    ```sql
    EXPLAIN ANALYZE
    SELECT * FROM reviews WHERE spotify_album_id = 'xxx';
    ```

3. **Considere particionamento por data se crescer muito:**

    ```sql
    -- Particionar por ano
    CREATE TABLE reviews_2025 PARTITION OF reviews
    FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');
    ```

4. **Cache queries caras no Redis/Laravel Cache**

---

**Dica:** Use essas queries no Tinker ou crie Commands Artisan para relatórios automatizados!
