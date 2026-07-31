-- Rate limiting no proprio Postgres, no lugar de um Redis externo.
--
-- O contador precisa ser compartilhado entre instancias e sobreviver a
-- redeploys, o que descarta memoria do processo. O volume do site nao
-- justifica contratar outro servico.

CREATE TABLE "RateLimit" (
    "key" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 1,
    "expiresAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "RateLimit_pkey" PRIMARY KEY ("key")
);

-- Usado pela limpeza periodica das janelas vencidas.
CREATE INDEX "RateLimit_expiresAt_idx" ON "RateLimit"("expiresAt");
