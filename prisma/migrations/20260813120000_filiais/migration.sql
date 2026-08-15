-- Unidades da PILI alem da matriz.
--
-- O rodape mostrava so o endereco de Erechim, que vem de `SiteSettings`. As
-- demais unidades nao existiam em lugar nenhum do sistema: nao havia onde
-- cadastra-las nem de onde le-las.
--
-- A matriz continua em `SiteSettings` de proposito. Traze-la para ca criaria
-- duas fontes para o mesmo endereco, e uma delas ficaria desatualizada.

-- CreateEnum
CREATE TYPE "FilialTipo" AS ENUM ('FILIAL', 'ESCRITORIO', 'ASSISTENCIA');

-- CreateTable
CREATE TABLE "Filial" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "tipo" "FilialTipo" NOT NULL DEFAULT 'FILIAL',
    "cidade" TEXT NOT NULL,
    "uf" TEXT NOT NULL,
    "endereco" TEXT NOT NULL,
    "cep" TEXT,
    "telefone" TEXT,
    -- Sem coordenadas a unidade ainda aparece como endereco, so nao entra no mapa.
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "ordem" INTEGER NOT NULL DEFAULT 0,
    "ativa" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "Filial_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Filial_ativa_ordem_idx" ON "Filial"("ativa", "ordem");
