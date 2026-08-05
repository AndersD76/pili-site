-- Candidaturas passam a viver em JobApplication, não em Lead.
--
-- `jobId` vira opcional porque o site não publica vagas: o formulário de
-- "Trabalhe conosco" alimenta um banco de talentos. `cvUrl` sai em favor do
-- currículo guardado no próprio banco, como já é feito com as fotos — assim o
-- arquivo pode ser servido só para o admin autenticado, que é o correto para
-- dado pessoal.
--
-- A tabela está vazia em produção (0 linhas), então as colunas novas obrigatórias
-- não precisam de valor de retrocompatibilidade.

ALTER TABLE "JobApplication" DROP CONSTRAINT IF EXISTS "JobApplication_jobId_fkey";

ALTER TABLE "JobApplication" ALTER COLUMN "jobId" DROP NOT NULL;

ALTER TABLE "JobApplication" DROP COLUMN IF EXISTS "cvUrl";

ALTER TABLE "JobApplication"
  ADD COLUMN "area"       TEXT NOT NULL DEFAULT 'outra',
  ADD COLUMN "cvData"     BYTEA,
  ADD COLUMN "cvFilename" TEXT,
  ADD COLUMN "cvMimeType" TEXT,
  ADD COLUMN "cvSize"     INTEGER,
  ADD COLUMN "consentAt"  TIMESTAMPTZ(3),
  ADD COLUMN "reviewedAt" TIMESTAMPTZ(3),
  ADD COLUMN "deletedAt"  TIMESTAMPTZ(3);

ALTER TABLE "JobApplication" ALTER COLUMN "area" DROP DEFAULT;

ALTER TABLE "JobApplication"
  ADD CONSTRAINT "JobApplication_jobId_fkey"
  FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE INDEX "JobApplication_deletedAt_createdAt_idx" ON "JobApplication" ("deletedAt", "createdAt");
CREATE INDEX "JobApplication_area_idx" ON "JobApplication" ("area");
