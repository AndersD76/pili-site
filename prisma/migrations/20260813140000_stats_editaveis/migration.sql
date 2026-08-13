-- Numeros da home passam a ser editaveis pelo painel.
--
-- Viviam em `STATS`, em src/lib/constants.ts: trocar "850+" para "900+" exigia
-- commit e deploy. Os defaults abaixo repetem os valores que ja estavam no
-- codigo, entao a linha existente nao muda de conteudo ao migrar.
--
-- Anos de mercado nao entra aqui de proposito: continua sendo calculado a
-- partir de `fundacao`, senao viraria um numero fixo que envelhece sozinho.

ALTER TABLE "SiteSettings"
  ADD COLUMN "statsEquipamentos" TEXT NOT NULL DEFAULT '850+',
  ADD COLUMN "statsPaises" INTEGER NOT NULL DEFAULT 18,
  ADD COLUMN "statsCapacidade" TEXT NOT NULL DEFAULT '100t';
