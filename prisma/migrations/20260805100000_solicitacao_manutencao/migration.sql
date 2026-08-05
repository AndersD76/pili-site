-- Troca `ServiceOrder` por `MaintenanceRequest`.
--
-- A ordem de serviço é emitida no ERP da PILI, não aqui: manter uma segunda
-- fonte da mesma informação só criaria divergência. O que o portal precisa é
-- do passo anterior — o chamado que o cliente abre e que o comercial converte
-- em OS do lado do ERP.
--
-- `ServiceOrder` está vazia em produção (0 linhas verificadas antes do DROP),
-- então não há dado a preservar nem migração de conteúdo a fazer.

DROP TABLE IF EXISTS "ServiceOrder";

CREATE TYPE "MaintenanceType" AS ENUM (
  'CORRETIVA', 'PREVENTIVA', 'INSTALACAO', 'DUVIDA_TECNICA', 'OUTRO'
);

CREATE TYPE "MaintenanceUrgency" AS ENUM ('BAIXA', 'MEDIA', 'ALTA', 'PARADA');

CREATE TYPE "MaintenanceStatus" AS ENUM (
  'ABERTA', 'EM_ANDAMENTO', 'CONCLUIDA', 'CANCELADA'
);

CREATE TABLE "MaintenanceRequest" (
  "id"           TEXT NOT NULL,
  -- Sequencial próprio: o cliente cita este número ao telefone, e um cuid não
  -- se dita em voz alta.
  "number"       SERIAL NOT NULL,
  "equipmentId"  TEXT NOT NULL,
  "userId"       TEXT NOT NULL,
  "type"         "MaintenanceType" NOT NULL,
  "urgency"      "MaintenanceUrgency" NOT NULL,
  "status"       "MaintenanceStatus" NOT NULL DEFAULT 'ABERTA',
  "description"  TEXT NOT NULL,
  "contactName"  TEXT NOT NULL,
  "contactPhone" TEXT NOT NULL,
  "internalNote" TEXT,
  "notifiedAt"   TIMESTAMPTZ(3),
  "createdAt"    TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"    TIMESTAMPTZ(3) NOT NULL,

  CONSTRAINT "MaintenanceRequest_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "MaintenanceRequest_number_key" ON "MaintenanceRequest" ("number");
CREATE INDEX "MaintenanceRequest_status_createdAt_idx" ON "MaintenanceRequest" ("status", "createdAt");
CREATE INDEX "MaintenanceRequest_equipmentId_idx" ON "MaintenanceRequest" ("equipmentId");
-- Usado pelo reenvio em lote quando o transporte de e-mail for configurado.
CREATE INDEX "MaintenanceRequest_notifiedAt_idx" ON "MaintenanceRequest" ("notifiedAt");

ALTER TABLE "MaintenanceRequest"
  ADD CONSTRAINT "MaintenanceRequest_equipmentId_fkey"
  FOREIGN KEY ("equipmentId") REFERENCES "ClientEquipment"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "MaintenanceRequest"
  ADD CONSTRAINT "MaintenanceRequest_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;
