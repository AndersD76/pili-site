-- Busca de leads insensível a acentos (auditoria #75).
--
-- `contains` com `mode: "insensitive"` do Prisma resolve apenas
-- maiúsculas/minúsculas: buscar "Joao" não encontrava "João", "Construcao" não
-- encontrava "Construção". Numa base de leads brasileira, nome e razão social
-- com acento são a regra, e o operador comercial digita sem acento.
--
-- A extensão `unaccent` é IMMUTABLE-safe apenas quando encapsulada; por isso o
-- wrapper abaixo, necessário para permitir índices funcionais.

CREATE EXTENSION IF NOT EXISTS unaccent;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- `unaccent()` do contrib é STABLE (depende de search_path). O wrapper fixa o
-- dicionário e declara IMMUTABLE, o que habilita o índice.
CREATE OR REPLACE FUNCTION pili_unaccent(text)
  RETURNS text
  LANGUAGE sql
  IMMUTABLE
  PARALLEL SAFE
  STRICT
AS $$
  SELECT public.unaccent('public.unaccent'::regdictionary, $1)
$$;

-- Índices trigram sobre o texto normalizado: cobrem `ILIKE '%termo%'`, que é o
-- padrão da busca do painel.
CREATE INDEX IF NOT EXISTS "Lead_name_unaccent_idx"
  ON "Lead" USING gin (lower(pili_unaccent("name")) gin_trgm_ops);

CREATE INDEX IF NOT EXISTS "Lead_email_unaccent_idx"
  ON "Lead" USING gin (lower(pili_unaccent("email")) gin_trgm_ops);

CREATE INDEX IF NOT EXISTS "Lead_company_unaccent_idx"
  ON "Lead" USING gin (lower(pili_unaccent(coalesce("company", ''))) gin_trgm_ops);
