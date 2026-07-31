# Migrations

## Estado anterior (o problema)

O banco de produção foi criado com `prisma db push`. O diretório de migrations
tinha **uma única entrada** (`20260515_add_password_hash`, um `ALTER TABLE`)
para um schema de 24 models — nenhuma migration criava as tabelas.

Consequências: `prisma migrate deploy` num banco vazio falhava já na primeira
migration (`ALTER TABLE "User"` sem tabela `User`), e nenhum ambiente novo
— staging, CI, máquina de outro desenvolvedor — podia ser provisionado.

## Estado atual

| Migration | Conteúdo |
|---|---|
| `0_init` | **Baseline.** Schema completo tal como está em produção hoje (commit `6c6302e`): 25 tabelas, enums, índices e FKs |
| `20260731120000_relations_indexes_soft_delete` | FKs `Note.authorId` e `ClientEquipment.userId`, índices, `Lead.deletedAt`/`consentAt` |
| `20260731130000_lead_source_trabalhe_conosco_phone_optional` | `TRABALHE_CONOSCO` no enum; `Lead.phone` passa a aceitar nulo |
| `20260731140000_unaccent_search` | Extensões `unaccent`/`pg_trgm`, função `pili_unaccent`, índices trigram |
| `20260731150000_lead_anonymized_at` | `Lead.anonymizedAt` (LGPD, Art. 18) |

`../_migrations-archive/` guarda a migration histórica que o baseline tornou
redundante. Fica **fora** de `migrations/` de propósito: o Prisma trata qualquer
subdiretório como migration e tentaria executá-la.

## Aplicar no banco de produção existente

O banco **já tem** o schema do `0_init`, mas **não tem** as quatro migrations
seguintes. Marque o baseline como aplicado e deixe o resto rodar:

```bash
# 1. Confirma que o banco corresponde ao baseline (não deve acusar diferença
#    além das 4 migrations pendentes)
pnpm exec prisma migrate status

# 2. Marca o baseline como já aplicado — NÃO executa o SQL
pnpm exec prisma migrate resolve --applied 0_init

# 3. Aplica as quatro migrations pendentes
pnpm exec prisma migrate deploy
```

> **Antes do passo 3**, verifique linhas órfãs — as FKs de
> `20260731120000` falham se existirem:
>
> ```sql
> SELECT n.id FROM "Note" n
>   LEFT JOIN "User" u ON u.id = n."authorId" WHERE u.id IS NULL;
> SELECT e.id FROM "ClientEquipment" e
>   LEFT JOIN "User" u ON u.id = e."userId" WHERE u.id IS NULL;
> ```

## Provisionar um banco novo (staging, CI, dev)

```bash
pnpm exec prisma migrate deploy
```

Roda `0_init` e as quatro seguintes, chegando ao schema atual.

## Daqui em diante

Use `pnpm db:migrate` (`prisma migrate dev`) para gerar novas migrations.
**Não** use `prisma db push` — foi o que produziu o descompasso original.
