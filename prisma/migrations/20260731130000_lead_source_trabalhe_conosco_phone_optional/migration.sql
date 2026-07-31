-- Corrige o contrato dos formulários públicos:
--   1. "Trabalhe conosco" enviava source=TRABALHE_CONOSCO, valor inexistente no
--      enum, e recebia HTTP 400 (auditoria #1).
--   2. Os gates de catálogo e calculadora convertem apenas com e-mail; `phone`
--      NOT NULL forçava o envio de "N/A", que falhava a validação (auditoria #2).

-- AlterEnum
ALTER TYPE "LeadSource" ADD VALUE 'TRABALHE_CONOSCO';

-- AlterTable
ALTER TABLE "Lead" ALTER COLUMN "phone" DROP NOT NULL;
