-- Carrossel do hero da home.
--
-- O fundo era uma imagem fixa em `page.tsx` e o titulo vinha das mensagens:
-- trocar qualquer um dos dois exigia commit e deploy.
--
-- A imagem reaproveita a biblioteca de midia ja existente. `Media` ganha
-- `heroSlideId` seguindo o mesmo padrao de `productId`, `caseId` e `postId`,
-- entao o `MediaUploader` do painel funciona aqui sem codigo novo de upload.

-- CreateTable
CREATE TABLE "HeroSlide" (
    "id" TEXT NOT NULL,
    "ordem" INTEGER NOT NULL DEFAULT 0,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "HeroSlide_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HeroSlideTranslation" (
    "id" TEXT NOT NULL,
    "slideId" TEXT NOT NULL,
    "locale" "Locale" NOT NULL,
    "titulo" TEXT NOT NULL,
    "subtitulo" TEXT,

    CONSTRAINT "HeroSlideTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "HeroSlide_ativo_ordem_idx" ON "HeroSlide"("ativo", "ordem");

-- CreateIndex
CREATE UNIQUE INDEX "HeroSlideTranslation_slideId_locale_key" ON "HeroSlideTranslation"("slideId", "locale");

-- AddForeignKey
ALTER TABLE "HeroSlideTranslation" ADD CONSTRAINT "HeroSlideTranslation_slideId_fkey"
  FOREIGN KEY ("slideId") REFERENCES "HeroSlide"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AlterTable: vinculo da midia com o slide
ALTER TABLE "Media" ADD COLUMN "heroSlideId" TEXT;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_heroSlideId_fkey"
  FOREIGN KEY ("heroSlideId") REFERENCES "HeroSlide"("id") ON DELETE CASCADE ON UPDATE CASCADE;
