-- Campos que as paginas publicas do blog usam e que nao existiam no schema:
-- o filtro por categoria e o tempo de leitura exibido no card.
--
-- Sem eles o site nao pode ler o blog do banco e continua preso ao arquivo
-- estatico `src/lib/data/blog.ts`.

CREATE TYPE "PostCategory" AS ENUM ('noticia', 'artigo', 'evento', 'lancamento');

ALTER TABLE "Post" ADD COLUMN "category" "PostCategory" NOT NULL DEFAULT 'artigo';
ALTER TABLE "Post" ADD COLUMN "readTime" INTEGER NOT NULL DEFAULT 5;
