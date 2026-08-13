-- Cartoes de "Solucoes por setor" da home passam a ser editaveis.
--
-- As cinco fotos eram a mesma imagem estatica repetida em `page.tsx`, e o texto
-- vinha das mensagens: trocar qualquer um dos dois exigia deploy.
--
-- O slug e a chave primaria de proposito. Ele casa com a rota
-- /solucoes/[setor], que tem um conjunto fixo de cinco paginas, entao o painel
-- edita os setores existentes e nao cria novos: um setor inventado no painel
-- viraria um card apontando para 404.

-- CreateTable
CREATE TABLE "Setor" (
    "slug" TEXT NOT NULL,
    "ordem" INTEGER NOT NULL DEFAULT 0,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "Setor_pkey" PRIMARY KEY ("slug")
);

-- CreateTable
CREATE TABLE "SetorTranslation" (
    "id" TEXT NOT NULL,
    "setorSlug" TEXT NOT NULL,
    "locale" "Locale" NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,

    CONSTRAINT "SetorTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Setor_ativo_ordem_idx" ON "Setor"("ativo", "ordem");

-- CreateIndex
CREATE UNIQUE INDEX "SetorTranslation_setorSlug_locale_key" ON "SetorTranslation"("setorSlug", "locale");

-- AddForeignKey
ALTER TABLE "SetorTranslation" ADD CONSTRAINT "SetorTranslation_setorSlug_fkey"
  FOREIGN KEY ("setorSlug") REFERENCES "Setor"("slug") ON DELETE CASCADE ON UPDATE CASCADE;

-- AlterTable: vinculo da midia com o setor
ALTER TABLE "Media" ADD COLUMN "setorSlug" TEXT;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_setorSlug_fkey"
  FOREIGN KEY ("setorSlug") REFERENCES "Setor"("slug") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateIndex: as duas FKs novas de Media entram no filtro de cada consulta
CREATE INDEX "Media_heroSlideId_idx" ON "Media"("heroSlideId");
CREATE INDEX "Media_setorSlug_idx" ON "Media"("setorSlug");

-- Os cinco setores que ja existem como rota. Sem traducao e sem midia: o site
-- segue usando o texto das mensagens e a foto padrao ate alguem editar.
INSERT INTO "Setor" ("slug", "ordem", "ativo", "createdAt", "updatedAt") VALUES
  ('porto', 0, true, NOW(), NOW()),
  ('cooperativa', 1, true, NOW(), NOW()),
  ('industria', 2, true, NOW(), NOW()),
  ('fertilizante', 3, true, NOW(), NOW()),
  ('cimento', 4, true, NOW(), NOW());
