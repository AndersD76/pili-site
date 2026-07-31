-- Relações faltantes (Note.authorId, ClientEquipment.userId), índices para os
-- filtros do painel e soft delete + registro de consentimento em Lead.
--
-- PRÉ-REQUISITO: as duas constraints de chave estrangeira abaixo falham se
-- houver linhas órfãs. Verifique antes de aplicar em um banco com dados:
--
--   SELECT n.id FROM "Note" n
--     LEFT JOIN "User" u ON u.id = n."authorId" WHERE u.id IS NULL;
--   SELECT e.id FROM "ClientEquipment" e
--     LEFT JOIN "User" u ON u.id = e."userId" WHERE u.id IS NULL;
--
-- Se retornarem linhas, decida caso a caso (reatribuir ou remover) antes de
-- rodar a migration.

-- DropForeignKey
ALTER TABLE "ServiceOrder" DROP CONSTRAINT "ServiceOrder_equipmentId_fkey";

-- AlterTable
ALTER TABLE "Lead" ADD COLUMN     "consentAt" TIMESTAMP(3),
ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "Spec_productId_idx" ON "Spec"("productId");

-- CreateIndex
CREATE INDEX "Feature_productId_idx" ON "Feature"("productId");

-- CreateIndex
CREATE INDEX "FAQ_productId_idx" ON "FAQ"("productId");

-- CreateIndex
CREATE INDEX "Media_productId_idx" ON "Media"("productId");

-- CreateIndex
CREATE INDEX "Media_caseId_idx" ON "Media"("caseId");

-- CreateIndex
CREATE INDEX "CaseMetric_caseId_idx" ON "CaseMetric"("caseId");

-- CreateIndex
CREATE INDEX "Lead_deletedAt_createdAt_idx" ON "Lead"("deletedAt", "createdAt");

-- CreateIndex
CREATE INDEX "Lead_status_idx" ON "Lead"("status");

-- CreateIndex
CREATE INDEX "Lead_source_idx" ON "Lead"("source");

-- CreateIndex
CREATE INDEX "Note_leadId_idx" ON "Note"("leadId");

-- CreateIndex
CREATE INDEX "Note_authorId_idx" ON "Note"("authorId");

-- CreateIndex
CREATE INDEX "ClientEquipment_userId_idx" ON "ClientEquipment"("userId");

-- CreateIndex
CREATE INDEX "ServiceOrder_equipmentId_idx" ON "ServiceOrder"("equipmentId");

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientEquipment" ADD CONSTRAINT "ClientEquipment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceOrder" ADD CONSTRAINT "ServiceOrder_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "ClientEquipment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
