-- Linha do tempo da empresa, blocos de conteudo e textos da pagina de setor.
--
-- Tres trechos do site que so mudavam por deploy: a trajetoria em /empresa, a
-- secao "Ecossistema PILI" na home e os textos longos de /solucoes/[setor].
--
-- Nada e semeado com texto. Campo vazio significa "usar as mensagens", entao o
-- site continua exibindo exatamente o que exibe hoje ate alguem editar.

-- Textos da pagina /solucoes/[setor]
ALTER TABLE "SetorTranslation"
  ADD COLUMN "headline" TEXT,
  ADD COLUMN "descricaoLonga" TEXT;

-- CreateTable: marcos da trajetoria
CREATE TABLE "MarcoHistoria" (
    "id" TEXT NOT NULL,
    -- Texto e nao numero: o ultimo marco e "Hoje", que nao tem ano.
    "ano" TEXT,
    "ordem" INTEGER NOT NULL DEFAULT 0,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "MarcoHistoria_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "MarcoHistoriaTranslation" (
    "id" TEXT NOT NULL,
    "marcoId" TEXT NOT NULL,
    "locale" "Locale" NOT NULL,
    "titulo" TEXT NOT NULL,
    "texto" TEXT NOT NULL,

    CONSTRAINT "MarcoHistoriaTranslation_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "MarcoHistoria_ativo_ordem_idx" ON "MarcoHistoria"("ativo", "ordem");
CREATE UNIQUE INDEX "MarcoHistoriaTranslation_marcoId_locale_key" ON "MarcoHistoriaTranslation"("marcoId", "locale");

ALTER TABLE "MarcoHistoriaTranslation" ADD CONSTRAINT "MarcoHistoriaTranslation_marcoId_fkey"
  FOREIGN KEY ("marcoId") REFERENCES "MarcoHistoria"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable: blocos de conteudo com imagem e texto
CREATE TABLE "BlocoConteudo" (
    "chave" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "BlocoConteudo_pkey" PRIMARY KEY ("chave")
);

CREATE TABLE "BlocoConteudoTranslation" (
    "id" TEXT NOT NULL,
    "chave" TEXT NOT NULL,
    "locale" "Locale" NOT NULL,
    "titulo" TEXT,
    "subtitulo" TEXT,
    "texto" TEXT,

    CONSTRAINT "BlocoConteudoTranslation_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "BlocoConteudoTranslation_chave_locale_key" ON "BlocoConteudoTranslation"("chave", "locale");

ALTER TABLE "BlocoConteudoTranslation" ADD CONSTRAINT "BlocoConteudoTranslation_chave_fkey"
  FOREIGN KEY ("chave") REFERENCES "BlocoConteudo"("chave") ON DELETE CASCADE ON UPDATE CASCADE;

-- Vinculo da midia com o bloco
ALTER TABLE "Media" ADD COLUMN "blocoChave" TEXT;

ALTER TABLE "Media" ADD CONSTRAINT "Media_blocoChave_fkey"
  FOREIGN KEY ("blocoChave") REFERENCES "BlocoConteudo"("chave") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE INDEX "Media_blocoChave_idx" ON "Media"("blocoChave");

-- O bloco do ecossistema ja entra criado, sem texto: a secao segue usando as
-- mensagens ate alguem preencher, e o painel tem onde anexar a imagem.
INSERT INTO "BlocoConteudo" ("chave", "ativo", "createdAt", "updatedAt")
VALUES ('ecossistema', true, NOW(), NOW());
