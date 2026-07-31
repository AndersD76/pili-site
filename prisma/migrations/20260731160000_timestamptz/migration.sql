-- Datas passam a guardar fuso horário (auditoria #7).
--
-- O Prisma mapeia `DateTime` para `timestamp(3)` SEM time zone. Os valores eram
-- gravados em UTC (runtime da Vercel) e lidos sem essa informação; a formatação
-- usava o fuso do servidor. Um lead criado às 21:30 BRT de 31/07 aparecia como
-- 01/08 para o time comercial — erro sistemático de um dia para tudo criado
-- após 21:00.
--
-- O `USING ... AT TIME ZONE 'UTC'` é essencial: sem ele o Postgres reinterpreta
-- o valor existente no fuso da sessão, deslocando TODO o histórico. Com ele,
-- cada valor é lido como o UTC que de fato é.

-- AlterTable
ALTER TABLE "User"
  ALTER COLUMN "emailVerified" SET DATA TYPE TIMESTAMPTZ(3)
    USING "emailVerified" AT TIME ZONE 'UTC',
  ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMPTZ(3)
    USING "createdAt" AT TIME ZONE 'UTC',
  ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMPTZ(3)
    USING "updatedAt" AT TIME ZONE 'UTC';

-- AlterTable
ALTER TABLE "Session"
  ALTER COLUMN "expires" SET DATA TYPE TIMESTAMPTZ(3)
    USING "expires" AT TIME ZONE 'UTC';

-- AlterTable
ALTER TABLE "VerificationToken"
  ALTER COLUMN "expires" SET DATA TYPE TIMESTAMPTZ(3)
    USING "expires" AT TIME ZONE 'UTC';

-- AlterTable
ALTER TABLE "Product"
  ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMPTZ(3)
    USING "createdAt" AT TIME ZONE 'UTC',
  ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMPTZ(3)
    USING "updatedAt" AT TIME ZONE 'UTC';

-- AlterTable
ALTER TABLE "Media"
  ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMPTZ(3)
    USING "createdAt" AT TIME ZONE 'UTC';

-- AlterTable
ALTER TABLE "Case"
  ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMPTZ(3)
    USING "createdAt" AT TIME ZONE 'UTC',
  ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMPTZ(3)
    USING "updatedAt" AT TIME ZONE 'UTC';

-- AlterTable
ALTER TABLE "Post"
  ALTER COLUMN "publishedAt" SET DATA TYPE TIMESTAMPTZ(3)
    USING "publishedAt" AT TIME ZONE 'UTC',
  ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMPTZ(3)
    USING "createdAt" AT TIME ZONE 'UTC',
  ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMPTZ(3)
    USING "updatedAt" AT TIME ZONE 'UTC';

-- AlterTable
ALTER TABLE "Lead"
  ALTER COLUMN "consentAt" SET DATA TYPE TIMESTAMPTZ(3)
    USING "consentAt" AT TIME ZONE 'UTC',
  ALTER COLUMN "anonymizedAt" SET DATA TYPE TIMESTAMPTZ(3)
    USING "anonymizedAt" AT TIME ZONE 'UTC',
  ALTER COLUMN "deletedAt" SET DATA TYPE TIMESTAMPTZ(3)
    USING "deletedAt" AT TIME ZONE 'UTC',
  ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMPTZ(3)
    USING "createdAt" AT TIME ZONE 'UTC',
  ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMPTZ(3)
    USING "updatedAt" AT TIME ZONE 'UTC';

-- AlterTable
ALTER TABLE "Note"
  ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMPTZ(3)
    USING "createdAt" AT TIME ZONE 'UTC';

-- AlterTable
ALTER TABLE "Job"
  ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMPTZ(3)
    USING "createdAt" AT TIME ZONE 'UTC';

-- AlterTable
ALTER TABLE "JobApplication"
  ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMPTZ(3)
    USING "createdAt" AT TIME ZONE 'UTC';

-- AlterTable
ALTER TABLE "ClientEquipment"
  ALTER COLUMN "installedAt" SET DATA TYPE TIMESTAMPTZ(3)
    USING "installedAt" AT TIME ZONE 'UTC',
  ALTER COLUMN "warrantyEndsAt" SET DATA TYPE TIMESTAMPTZ(3)
    USING "warrantyEndsAt" AT TIME ZONE 'UTC',
  ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMPTZ(3)
    USING "createdAt" AT TIME ZONE 'UTC';

-- AlterTable
ALTER TABLE "ServiceOrder"
  ALTER COLUMN "scheduledAt" SET DATA TYPE TIMESTAMPTZ(3)
    USING "scheduledAt" AT TIME ZONE 'UTC',
  ALTER COLUMN "completedAt" SET DATA TYPE TIMESTAMPTZ(3)
    USING "completedAt" AT TIME ZONE 'UTC',
  ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMPTZ(3)
    USING "createdAt" AT TIME ZONE 'UTC',
  ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMPTZ(3)
    USING "updatedAt" AT TIME ZONE 'UTC';

