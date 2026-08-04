-- Midia armazenada no proprio banco e configuracoes editaveis pelo painel.
--
-- MIDIA
-- A tabela `Media` existia com uma coluna `url` e nunca recebeu um registro:
-- nao havia rota de upload. Passa a guardar os bytes em `data` (bytea). O
-- volume do site e pequeno (dezenas de fotos) e nao justifica contratar
-- armazenamento externo; a entrega usa cache imutavel, entao o banco e lido
-- uma vez por arquivo.
--
-- SITE SETTINGS
-- CNPJ, telefone, e-mails, redes sociais e URL do PILI Tech viviam em
-- `src/lib/constants.ts`: mudar um telefone exigia deploy.

-- Nenhuma linha existe em Media (verificado: count = 0), entao as colunas
-- obrigatorias podem ser adicionadas sem default.
ALTER TABLE "Media" DROP COLUMN "url";
ALTER TABLE "Media" ADD COLUMN "postId" TEXT;
ALTER TABLE "Media" ADD COLUMN "data" BYTEA NOT NULL;
ALTER TABLE "Media" ADD COLUMN "filename" TEXT NOT NULL;
ALTER TABLE "Media" ADD COLUMN "mimeType" TEXT NOT NULL;
ALTER TABLE "Media" ADD COLUMN "size" INTEGER NOT NULL;
ALTER TABLE "Media" ALTER COLUMN "type" SET DEFAULT 'image';

CREATE INDEX "Media_postId_idx" ON "Media"("postId");

ALTER TABLE "Media" ADD CONSTRAINT "Media_postId_fkey"
  FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ---------------------------------------------------------------- settings

CREATE TABLE "SiteSettings" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "razaoSocial" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "endereco" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailComercial" TEXT NOT NULL,
    "fundacao" INTEGER NOT NULL,
    "instagram" TEXT,
    "linkedin" TEXT,
    "facebook" TEXT,
    "youtube" TEXT,
    "piliTechUrl" TEXT,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);

-- Valores atuais de `constants.ts`, para o painel abrir preenchido.
INSERT INTO "SiteSettings" (
  "id", "razaoSocial", "cnpj", "endereco", "telefone", "whatsapp",
  "email", "emailComercial", "fundacao",
  "instagram", "linkedin", "facebook", "youtube", "piliTechUrl", "updatedAt"
) VALUES (
  'default',
  'M.B. Pili Equipamentos Industriais Ltda',
  '05.620.512/0001-74',
  'Erechim/RS',
  '+55 54 3522-2828',
  '+55 54 99141-2971',
  'atendimento@pili.ind.br',
  'comercial@pili.ind.br',
  1979,
  'https://www.instagram.com/pili.ind',
  'https://www.linkedin.com/company/103457141',
  'https://www.facebook.com/pilierechim',
  'https://www.youtube.com/channel/UCkjB-kHuDaB9tKHtFcp-S8g',
  'https://tech.pili.ind.br',
  now()
);
