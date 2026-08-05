# Auditoria completa — PILI Industrial (pili-site)

**Data:** 2026-07-31
**Auditor:** Claude Opus 5
**Commit base:** `6c6302e` + 25 arquivos modificados não commitados

> **Estado auditado.** O working tree contém 25 arquivos com correções de
> segurança aplicadas em sessão anterior e **ainda não commitadas**. Esta
> auditoria analisa o **estado atual do working tree** (com essas correções).
> Onde um achado é consequência dessas correções, isso está explicitamente
> marcado como `[REGRESSÃO DA SESSÃO ANTERIOR]`.
>
> Nenhum arquivo do projeto foi modificado durante a Fase 1. O único arquivo
> criado é este `AUDITORIA.md`.

---

## Status das correções (Fase 2) — FINAL

| Situação | Qtd | Itens |
|---|---|---|
| ✅ **Corrigido** | **82** | todos, exceto os listados abaixo |
| 🔒 **Bloqueado por dado externo** | **1** | #68 |
| | **83** | |

### Rodada de encerramento (2026-08-05)

Os cinco itens que dependiam de decisão foram executados. O que mudou desde a
tabela anterior:

| Item | O que era | O que foi feito |
|---|---|---|
| **#5** | Candidaturas gravadas como `Lead` com `company: "Candidato"`, sem lugar para currículo | Model `JobApplication` em uso: `jobId` opcional (o site não publica vagas, é banco de talentos), área em coluna própria, currículo em `bytea` no banco, consentimento datado. Rota `POST /api/candidaturas`, download em `/api/candidaturas/[id]/cv` **atrás de `requireAdmin`** — currículo é dado pessoal e não podia ficar em URL pública. Tela em `/admin/candidaturas` com marcação de análise e exclusão que apaga o binário junto. Migração `20260804120000_job_application_talentos` |
| **#6** | `en`/`es` nunca escritos; painel monolíngue | Site inteiro em pt-BR e es: 560 chaves com paridade verificada e nenhum texto fixo em português nas páginas. `content.ts` traz os dois idiomas numa consulta e cai para o português quando falta tradução. Conteúdo semeado em espanhol (18 produtos, 8 obras, 8 artigos, 66 diferenciais) e editável no painel, em seção própria por formulário |
| **#9** | `FAQ`, `Application`, `ApplicationTranslation` e `ServiceOrder` órfãos | `Application` populado no backfill de #18 e lido por `content.ts`. `FAQ` implementado ponta a ponta: editor no formulário de produto, seção visível na página e `FAQPage` em JSON-LD — a marcação só é emitida quando as perguntas aparecem na página, como o Google exige. 160 perguntas semeadas nos dois idiomas. `ServiceOrder` passa a aparecer no portal: histórico por equipamento e contador de ordens em aberto no painel do cliente |
| **#13** | `Post.cover` e mídia nunca preenchidos; exigia `uploadthing` | Resolvido **sem dependência nova**: os binários ficam no Postgres, como o restante. O `MediaUploader` já está nas três entidades e `content.ts` passou a usar `Post.cover` como fallback quando não há mídia própria |
| **#18** | Site lia de `lib/data/*`, painel escrevia no Postgres | `src/lib/content.ts` substituiu os arquivos estáticos; 11 páginas reescritas. Concluído na rodada anterior |
| **#68** | Redirects VK2 vazios | **Continua bloqueado.** Depende do mapa de URLs indexadas do site anterior (Search Console → Cobertura, ou `site:pili.ind.br`). O array `redirects()` em `next.config.ts` segue vazio e pronto para receber o mapeamento — não há como obtê-lo a partir do repositório |

### Verificação ao final

| Comando | Resultado |
|---|---|
| `pnpm typecheck` | ✅ sem erros |
| `pnpm lint` | ✅ 0 erros (6 avisos de `<img>`, decisão anterior do projeto) |
| `pnpm test` | ✅ **33 testes** em 3 arquivos (antes: nenhum) |
| `pnpm build` | ✅ 203 páginas; **21 das 22 rotas públicas pré-renderizadas** |
| `pnpm audit` | ✅ **0 críticos** (antes: 3); 26 advisories → 1 falso positivo |

### Migrations criadas (nenhuma aplicada a banco algum)

| Migration | Conteúdo |
|---|---|
| `0_init` | Baseline com o schema de produção — destrava `migrate deploy` |
| `20260731120000_...` | FKs, índices, `deletedAt`/`consentAt` |
| `20260731130000_...` | `TRABALHE_CONOSCO`, `phone` nulo |
| `20260731140000_unaccent_search` | `unaccent`, `pg_trgm`, índices trigram |
| `20260731150000_lead_anonymized_at` | `anonymizedAt` (LGPD) |
| `20260731160000_timestamptz` | 28 colunas de data com fuso, preservando UTC |

Procedimento de aplicação documentado em `prisma/migrations/README.md`.

---

## Mapa da estrutura do projeto

### Stack

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 16.2.6 (App Router, Turbopack) |
| Runtime UI | React 19.2.4 |
| Linguagem | TypeScript 5 (`strict` via `tsconfig.json`) |
| Estilo | Tailwind CSS 4 (`@tailwindcss/postcss`), tema único claro |
| Componentes | Radix UI + shadcn-style (`components.json`), lucide-react, framer-motion |
| i18n | next-intl 4.12 (`pt-BR`, `en`, `es`, prefixo sempre presente) |
| ORM | Prisma 5.22 → PostgreSQL (NeonDB, `DATABASE_URL` + `DIRECT_URL`) |
| Auth | NextAuth 5.0.0-beta.31 (JWT), PrismaAdapter, providers Google + Resend + Credentials |
| E-mail | Resend 6.12 + @react-email/components |
| Rate limit | Upstash Redis + @upstash/ratelimit |
| Forms | react-hook-form + zod 3.25 + @hookform/resolvers |
| Analytics | @vercel/analytics |
| Gerenciador | pnpm 11.1.2 |

### Onde fica cada coisa

```
prisma/
  schema.prisma                     20 models, 5 enums
  migrations/
    20260515_add_password_hash/     única migration histórica (1 ALTER TABLE)
    20260731120000_relations_.../   migration nova (não aplicada)

src/
  app/
    layout.tsx                      root layout: <html>, fontes, metadata default
    globals.css                     tema, vars --pili-*
    not-found.tsx                   404 global
    robots.ts / sitemap.ts          SEO estático
    [locale]/                       SITE PÚBLICO (pt-BR | en | es)
      layout.tsx                    NextIntlClientProvider, generateStaticParams
      (marketing)/                  22 páginas públicas + layout com Header/Footer
    admin/                          PAINEL ADMIN
      login/                        redireciona para /portal/login
      (panel)/                      layout com requireRole(STAFF) + 5 módulos CRUD
    portal/                         PORTAL DO CLIENTE
      login/                        login unificado (admin + cliente)
      (dashboard)/                  layout com auth() + 4 páginas
    api/
      auth/[...nextauth]/route.ts   handlers NextAuth (GET, POST)
      leads/route.ts                POST público de captação
  components/
    ui/ (17)  marketing/ (10)  admin/ (8)  portal/ (2)  shared/ (8)
  lib/
    auth.ts  auth-guard.ts  db.ts  rate-limit.ts  seo.ts  constants.ts
    utils.ts  product-images.ts
    data/                           products.ts, cases.ts, blog.ts, ecosystem.ts
                                    ← CONTEÚDO ESTÁTICO do site público
    email/                          client.ts, send-lead-emails.tsx, templates/
    validators/                     lead.ts, admin.ts
  i18n/                             routing.ts, request.ts
  messages/                         pt-BR.json, en.json, es.json
  middleware.ts                     APENAS i18n (exclui /api, /admin, /portal)
  scripts/                          seed-admin.ts, seed-all.ts (1484 linhas)
  types/next-auth.d.ts              augmentation de Session/User/JWT
```

### Backend real

Não há servidor separado. O "backend" são **duas rotas de API** e
**24 Server Actions**:

| Arquivo | Actions |
|---|---|
| `admin/(panel)/leads/actions.ts` | getLeads, updateLeadStatus, addNote, deleteLead, exportLeadsCsv |
| `admin/(panel)/produtos/actions.ts` | getProducts, getProductById, createProduct, updateProduct, deleteProduct, toggleProductFeatured |
| `admin/(panel)/obras/actions.ts` | getCases, getCaseById, createCase, updateCase, deleteCase |
| `admin/(panel)/blog/actions.ts` | getPosts, getPostById, createPost, updatePost, deletePost, togglePublish |
| `admin/(panel)/usuarios/actions.ts` | createUser, resetPassword |

### Variáveis de ambiente

`.env.example` documenta 19 variáveis. `.env` local **não existe** no
repositório (correto — `.gitignore` cobre `.env*`).

### Arquitetura de dados — observação estrutural

O site público **não lê o banco**. As 22 páginas de marketing consomem
`src/lib/data/*.ts` (arquivos TypeScript estáticos). O painel admin escreve em
PostgreSQL. **Os dois sistemas são completamente desconectados.** Isso é a raiz
de vários achados abaixo e está registrado como item próprio (#18).

---

# ACHADOS

## 🔴 CRÍTICO

### #1 — Formulário "Trabalhe conosco" envia `source` inexistente no enum → HTTP 400

> **STATUS: CORRIGIDO.**

**Arquivo:** `src/app/[locale]/(marketing)/trabalhe-conosco/page.tsx:67`
**Relacionado:** #2, #5

```ts
source: "TRABALHE_CONOSCO",
```

O enum `LeadSource` (`prisma/schema.prisma:29-38`) contém apenas: `ORGANICO`,
`PAGO`, `REFERRAL`, `WHATSAPP`, `CATALOGO`, `CALCULADORA`, `COMPARATIVO`,
`FORMULARIO`. O validador `leadRequestSchema`
(`src/lib/validators/lead.ts:47-58`) espelha exatamente essa lista.

`"TRABALHE_CONOSCO"` falha o `z.enum` → `safeParse` retorna erro →
`src/app/api/leads/route.ts:43-48` responde **400** → o `catch` do formulário
(`page.tsx:75-77`) exibe erro genérico. **Nenhuma candidatura é registrada.**

`[REGRESSÃO DA SESSÃO ANTERIOR]` — antes da correção, o `leadSchema` antigo não
declarava `source`; o zod descartava a chave desconhecida silenciosamente e a
rota devolvia 201 (sem gravar nada). A correção transformou uma falha silenciosa
em falha visível. O contrato já estava errado; agora ele quebra alto.

**Correção proposta:** adicionar `TRABALHE_CONOSCO` ao enum `LeadSource` (migration)
e ao `leadRequestSchema` — ou, preferencialmente, migrar o formulário para os
models `Job`/`JobApplication` que já existem e estão órfãos (#5).
**Risco:** baixo. Adicionar valor a enum Postgres é `ALTER TYPE ... ADD VALUE`,
não destrutivo. Migrar para `JobApplication` exige nova rota + UI no admin.

---

### #2 — Calculadora e Catálogo enviam `phone: "N/A"` → HTTP 400

> **STATUS: CORRIGIDO.**

**Arquivos:**
- `src/app/[locale]/(marketing)/calculadora/page.tsx:124`
- `src/app/[locale]/(marketing)/catalogo/page.tsx:50`

Ambos enviam `phone: "N/A"` (3 caracteres). O schema exige
`phone: z.string().min(8).max(20)` (`src/lib/validators/lead.ts:6`).
Falha a validação → **400** → o gate nunca abre.

Na calculadora (`page.tsx:132-135`), o `catch` seta `gateStatus = "error"` e
`unlocked` permanece `false`: **o usuário nunca vê o resultado do cálculo que já
foi computado.** No catálogo, `status = "error"` e o download nunca é liberado.

**Pré-existente** — o `min(8)` já existia antes da sessão anterior e a rota
antiga já respondia 400. Estes dois formulários **nunca funcionaram**.

**Correção proposta:** tornar `phone` opcional no `leadRequestSchema` e exigi-lo
apenas no formulário completo (`lead-form.tsx`), ou coletar telefone de verdade
nos dois gates.
**Risco:** baixo. Tornar opcional relaxa validação; `Lead.phone` é `String` NOT
NULL no banco (`schema.prisma:280`), então precisa de default `""` ou migration
para nullable.

---

### #3 — Catálogo entrega link para PDF que não existe

> **STATUS: CORRIGIDO.**

> **Severidade revisada na Revisão (H.2): CRÍTICO → ALTO.**

**Arquivo:** `src/app/[locale]/(marketing)/catalogo/page.tsx:92`

```tsx
<a href="/documents/catalogo-pili-industrial.pdf" download>
```

`public/` não contém diretório `documents/` (verificado: `find public -type f`
retorna 16 arquivos, todos em `public/images/` ou SVGs na raiz). O link resulta
em **404**. O texto acima ainda promete "O catálogo também foi enviado para o
seu e-mail" (`page.tsx:88-90`) — não há envio de catálogo em lugar nenhum do
código.

Este achado só se manifesta **depois** de #2 ser corrigido (hoje o gate nunca
abre). Ambos precisam ser resolvidos juntos.

**Correção proposta:** publicar o PDF em `public/documents/` ou remover a página
até o material existir; remover a promessa de envio por e-mail ou implementá-la.
**Risco:** nenhum.

---

## 🟠 ALTO

### #4 — `consent: true` fixo no código em 3 formulários (consentimento não coletado)

> **STATUS: CORRIGIDO.**

**Arquivos:**
- `src/app/[locale]/(marketing)/calculadora/page.tsx:126`
- `src/app/[locale]/(marketing)/catalogo/page.tsx:51`
- `src/app/[locale]/(marketing)/trabalhe-conosco/page.tsx:66`

Os três enviam `consent: true` sem que exista qualquer checkbox na interface. O
schema exige `consent: z.literal(true)` (`validators/lead.ts:27-29`) e a rota
grava `consentAt: new Date()` (`api/leads/route.ts:64`) — ou seja, **o sistema
registra prova de um consentimento que o usuário nunca deu.**

Apenas `src/components/marketing/lead-form.tsx:152-160` tem checkbox real.

Registrar consentimento falso é pior do que não registrar: cria evidência
documental incorreta em caso de fiscalização LGPD. Ver também #55 (Bloco F).

**Correção proposta:** adicionar checkbox de aceite nos três formulários.
**Risco:** nenhum técnico; aumenta atrito de conversão (esperado e correto).

---

### #5 — Models `Job`, `JobTranslation`, `JobApplication` órfãos; candidaturas gravadas como Lead

> **STATUS: PARCIALMENTE CORRIGIDO.** O contrato foi consertado (#1: `TRABALHE_CONOSCO` no enum, formulário funcionando de novo). **Migrar de `Lead` para `JobApplication` continua pendente** — exige rota, upload de currículo (#13) e tela no admin, senão as candidaturas ficam inacessíveis.

**Arquivos:** `prisma/schema.prisma:314-345`;
`src/app/[locale]/(marketing)/trabalhe-conosco/page.tsx:61-71`

Verificado por varredura de `db.<model>.`: `job`, `jobTranslation` e
`jobApplication` têm **0 referências** em `src/` (app e scripts). Os três models
existem no banco e nunca são lidos nem escritos.

Enquanto isso, o formulário de candidatura grava na tabela `Lead` com
`company: "Candidato"` (`page.tsx:65`) e a área concatenada dentro de `message`
(`page.tsx:68`). Consequências:
- `JobApplication.cvUrl` existe no schema mas o formulário não aceita upload de
  currículo;
- candidaturas poluem o funil comercial e o export CSV de leads;
- a área da vaga fica em texto livre, não filtrável.

**Correção proposta:** criar rota/action para `JobApplication` e migrar o
formulário; ou remover os três models se o recrutamento não for do escopo.
**Risco:** médio — exige nova UI no admin para as candidaturas não ficarem
inacessíveis.

---

### #6 — CMS é monolíngue na prática: `en` e `es` nunca são escritos

> **STATUS: NÃO EXECUTADO — requer decisão sua.** Feature nova de porte médio: seletor de locale nos 3 formulários do admin + as 3 actions passando a aceitar o idioma, mais fallback na leitura. **Depende de #18** — sem o site lendo do banco, produzir conteúdo em `en`/`es` no painel não muda nada no site.

**Arquivos:** `prisma/schema.prisma:48-52`; todas as actions do admin

O enum `Locale` declara `pt_BR`, `en`, `es`, e os models `ProductTranslation`,
`CaseTranslation`, `PostTranslation`, `ApplicationTranslation`,
`JobTranslation` são modelados por idioma. Porém **todas as 12 ocorrências de
`locale:` no código do admin são `"pt_BR"` fixo**:

- `produtos/actions.ts:53, 106, 156, 160`
- `obras/actions.ts:56, 120, 181, 185`
- `blog/actions.ts:49, 100, 155, 159`

Não existe seletor de idioma em nenhum dos formulários (`product-form.tsx`,
`case-form.tsx`, `post-form.tsx` — verificado campo a campo). O site serve 3
idiomas via next-intl, mas **não há caminho no produto para produzir conteúdo em
`en` ou `es`**. Um visitante em `/en/produtos` verá a UI traduzida e o conteúdo
em português.

**Correção proposta:** adicionar aba/seletor de locale nos formulários do admin e
fallback explícito para `pt_BR` na leitura.
**Risco:** médio — mexe nas três actions de conteúdo e nos três formulários.

---

### #7 — `DateTime` gravado sem timezone + formatação com fuso do servidor

> **STATUS: CORRIGIDO.**

**Arquivos:** `prisma/schema.prisma` (todos os campos `DateTime`);
`prisma/migrations/20260731120000_.../migration.sql:31-32`;
`src/app/admin/(panel)/leads/actions.ts:233`;
`src/app/portal/(dashboard)/equipamentos/[id]/page.tsx:18-23`

O Prisma mapeia `DateTime` para `TIMESTAMP(3)` **sem time zone** — confirmado no
SQL gerado: `ADD COLUMN "consentAt" TIMESTAMP(3)`. Os valores são gravados em
UTC (o runtime do Vercel roda em UTC) e lidos sem informação de fuso.

A formatação acontece em Server Components, usando o fuso do **servidor**:
- `new Intl.DateTimeFormat("pt-BR").format(lead.createdAt)` (export CSV)
- `date.toLocaleDateString("pt-BR", {...})` (portal, equipamentos)

Um lead criado às 21:30 BRT de 31/07 é gravado como 00:30 UTC de 01/08 e
exibido como **01/08/2026** para o time comercial. Erro sistemático de um dia
para tudo criado após 21:00 BRT.

**Correção proposta:** usar `@db.Timestamptz(3)` nos campos `DateTime` do schema
e fixar `timeZone: "America/Sao_Paulo"` nas chamadas de formatação.
**Risco:** médio — a migration `ALTER TABLE ... TYPE timestamptz` reinterpreta os
valores existentes; precisa de `USING ... AT TIME ZONE 'UTC'` para não deslocar
o histórico.

---

### #8 — Histórico de migrations não reconstrói o banco (drift)

> **STATUS: CORRIGIDO.**

**Arquivos:** `prisma/migrations/`

Existem apenas duas migrations: `20260515_add_password_hash` (um único
`ALTER TABLE "User" ADD COLUMN "passwordHash" TEXT`) e a nova
`20260731120000_relations_indexes_soft_delete` (ainda não aplicada). O schema
tem **20 models**.

Não existe migration que crie as tabelas. O banco foi criado com `prisma db push`
— exatamente o que `CLAUDE.md` proíbe ("Versioned migrations, never `db push` in
production"). Consequências: impossível recriar o ambiente do zero via
`prisma migrate deploy`; a primeira migration falharia (`ALTER TABLE "User"` sem
tabela `User`); nenhum ambiente novo (staging, CI, dev de outro
desenvolvedor) pode ser provisionado.

**Correção proposta:** gerar migration de baseline (`prisma migrate diff
--from-empty --to-schema-datamodel`) e marcá-la aplicada em produção com
`prisma migrate resolve --applied`.
**Risco:** ALTO se feito errado. Exige acesso ao banco de produção e ordem
correta das operações. `CLAUDE.md` exige aviso antes de mexer em migrations.

---

## 🟡 MÉDIO

### #9 — Models órfãos: `FAQ`, `Application`, `ApplicationTranslation`, `ServiceOrder`

> **STATUS: NÃO EXECUTADO — requer decisão sua.** "Implementar ou remover" — as duas pontas são decisão de produto, não correção. Remover exige `DROP TABLE` (destrutivo e irreversível); implementar são 4 funcionalidades novas. **`ServiceOrder` é a mais relevante**: o portal do cliente não mostra ordens de serviço, que é o principal valor de um portal de pós-venda.

**Arquivo:** `prisma/schema.prisma:166-195, 361-373`

Varredura de `db.<model>.` em `src/` (0 referências em app e scripts):

| Model | Situação |
|---|---|
| `FAQ` | nunca lido/escrito. Perde-se rich result de FAQPage (ver Bloco E) |
| `Application` | relacionado a `Product` e `Case`, nunca populado |
| `ApplicationTranslation` | idem |
| `ServiceOrder` | model + relação com `ClientEquipment` existem; o portal do cliente não exibe ordens de serviço |

`Case.applicationId` e a relação `Product.applications` ficam sempre vazias,
tornando a taxonomia de aplicações (porto, cooperativa, indústria…) inexistente
no banco — ela vive apenas como string literal em `lib/constants.ts:43-49` e no
`<select>` de `lead-form.tsx:117-123`.

**Correção proposta:** implementar ou remover. Manter model morto no schema custa
migrations e confunde quem lê.
**Risco:** baixo para remover (requer migration `DROP TABLE`); médio para
implementar.

---

### #10 — `Feature` é lido mas não tem interface de edição

> **STATUS: CORRIGIDO.**

**Arquivos:** `src/app/admin/(panel)/produtos/actions.ts:74`;
`src/components/admin/product-form.tsx:134-142`

`getProductById` faz `include: { features: { orderBy: { order: "asc" } } }`, e o
tipo `ProductWithRelations` (`product-form.tsx:32-36`) declara `features:
Feature[]`. Mas o `onSubmit` monta o FormData com apenas 8 campos — `features`
não está entre eles — e não há nenhum `useFieldArray` para features (só para
`specs`, linha 118-121).

Resultado: features criadas pelo seed são carregadas, exibidas em lugar nenhum e
**silenciosamente preservadas** (o update não as toca). Não há como criar ou
editar uma feature pelo painel.

**Correção proposta:** adicionar `useFieldArray` de features ao formulário, igual
ao de specs; ou remover o `include` e o campo do tipo.
**Risco:** baixo.

---

### #11 — `metaTitle` / `metaDesc` existem no schema e nunca são usados

> **STATUS: CORRIGIDO.**

**Arquivo:** `prisma/schema.prisma:135-136, 280-281`

`ProductTranslation.metaTitle`, `ProductTranslation.metaDesc`,
`PostTranslation.metaTitle`, `PostTranslation.metaDesc` — 0 escritas, 0 leituras.
Os formulários do admin não os coletam e o site público (que lê de
`lib/data/*.ts`) não os consumiria de qualquer forma.

São exatamente os campos que dariam title/description únicos por página, o maior
alavanca de CTR orgânico. Ver Bloco E.

**Correção proposta:** coletar nos formulários e consumir em `generateMetadata`
quando o site migrar para o banco (#18).
**Risco:** baixo.

---

### #12 — `Product.order` nunca é definido; ordenação do catálogo é arbitrária

> **STATUS: CORRIGIDO.**

**Arquivos:** `prisma/schema.prisma:115`;
`src/app/admin/(panel)/produtos/actions.ts:56`

`getProducts` ordena por `orderBy: { order: "asc" }`, mas `createProduct`
(linhas 98-120) não define `order` e `updateProduct` (145-177) também não. O
campo fica sempre no default `0` para todos os produtos, e o Postgres devolve
ordem indefinida entre empates.

O `product-form.tsx` não tem campo de ordem (verificado: 8 `formData.set`).

**Correção proposta:** definir `order` na criação (ex.: `max(order) + 1`) e expor
reordenação no admin.
**Risco:** baixo.

---

### #13 — `Post.cover` e mídia de `Case`/`Product` nunca são preenchidos

> **STATUS: NÃO EXECUTADO — requer decisão sua.** Exige adicionar a dependência `uploadthing` — o `CLAUDE.md` proíbe adicionar dependências sem confirmar. As variáveis `UPLOADTHING_*` foram removidas do `.env.example` justamente por descreverem um pacote não instalado. **Precisa da sua autorização para instalar.**

**Arquivos:** `prisma/schema.prisma:264, 199-215`;
`src/components/admin/post-form.tsx:90-96`; `src/components/admin/case-form.tsx:116-125`

Nenhum dos três formulários do admin envia `cover` ou qualquer mídia. `Media` só
aparece em `db.media.findMany` (`admin/(panel)/media/page.tsx:34`) — **nunca em
um `create`**. A "Biblioteca de mídia" é uma listagem de uma tabela que nada
popula: sempre vazia. Não há rota de upload (`UPLOADTHING_SECRET` está no
`.env.example` mas o pacote `uploadthing` não está no `package.json`).

**Correção proposta:** implementar upload (UploadThing já previsto) ou remover a
página de mídia e os campos.
**Risco:** médio — adicionar upload é feature nova com implicações de segurança
(validação de tipo/tamanho — ver Bloco B).

---

### #14 — `Lead.assignedTo` existe e nunca é usado

> **STATUS: CORRIGIDO.**

**Arquivo:** `prisma/schema.prisma:297`

Campo `assignedTo String?` — 0 escritas, 0 leituras. A tela de detalhe do lead
(`admin/(panel)/leads/[id]/page.tsx`) não oferece atribuição de responsável.
Numa equipe comercial com 3 papéis (`ADMIN`, `COMERCIAL`, `TECNICO`), a ausência
de dono do lead é lacuna funcional relevante.

**Correção proposta:** implementar atribuição, com FK para `User` (hoje é String
solta, mesmo problema que `Note.authorId` tinha).
**Risco:** baixo.

---

### #15 — `catalogSchema` e `newsletterSchema` são código morto; validação do catálogo diverge do servidor

> **STATUS: CORRIGIDO.**

**Arquivo:** `src/lib/validators/lead.ts:62-75`

Ambos exportados e nunca importados em lugar nenhum (verificado por grep). O
`catalogSchema` foi escrito exatamente para o formulário de catálogo, mas
`catalogo/page.tsx:28-37` implementa validação manual própria, divergente:

| Campo | `catalogSchema` (não usado) | Validação manual (usada) |
|---|---|---|
| `name` | `min(2).max(120)` | `length < 2` (sem máximo) |
| `email` | `z.string().email()` | regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` |
| `company` | `min(2).max(120)` | `length < 2` (sem máximo) |
| `country` | `length(2)` | `length !== 2` |

Contraria `CLAUDE.md` ("Always `react-hook-form + zod`"). A página não usa
react-hook-form nem zod.

**Correção proposta:** migrar `catalogo/page.tsx` e `trabalhe-conosco/page.tsx`
para react-hook-form + zod usando os schemas existentes, ou remover os schemas
mortos.
**Risco:** baixo.

---

### #16 — `country: "XX"` não é código ISO válido

> **STATUS: CORRIGIDO.**

**Arquivo:** `src/app/[locale]/(marketing)/catalogo/page.tsx:184`

```tsx
<option value="XX">Outro</option>
```

Passa na validação (`length === 2`) e é gravado em `Lead.country`. `XX` não é
código ISO 3166-1 alpha-2 atribuído. Quebra qualquer segmentação geográfica
posterior e o export CSV.

**Correção proposta:** usar `ZZ` (reservado para "desconhecido" pela ISO) ou um
campo `countryOther` em texto livre.
**Risco:** nenhum.

---

### #17 — Enum `LeadSource` duplicado entre Prisma e zod

> **STATUS: CORRIGIDO.**

**Arquivos:** `prisma/schema.prisma:29-38`; `src/lib/validators/lead.ts:47-58`

A lista de valores é escrita duas vezes. A duplicação é intencional (evitar
`@prisma/client` no bundle do cliente, comentado em `lead.ts:41-45`) e há
verificação em tempo de compilação em `api/leads/route.ts:53`
(`const leadSource: LeadSource = source;`), que quebra o build se o zod tiver um
valor que o Prisma não tem.

**Porém a verificação é unidirecional:** adicionar um valor ao Prisma sem
adicioná-lo ao zod não gera erro — o valor simplesmente nunca poderá ser enviado
pelo site. É exatamente a situação de #1.

**Correção proposta:** adicionar a asserção inversa, ex.:
`const _exhaustive: LeadSourceLiteral = "" as LeadSource;`
**Risco:** nenhum.

---

### #18 — Site público e painel admin operam sobre fontes de dados desconectadas

> **STATUS: NÃO EXECUTADO — requer decisão sua.** Decisão arquitetural do proprietário, com três caminhos possíveis (site lê do banco / admin descontinuado / admin gera os arquivos estáticos). Reescreve 11 páginas e exige o banco populado. É o item de maior alcance do relatório e **não deve ser decidido por mim**.

> **Severidade revisada na Revisão (H.2): MÉDIO → ALTO.**

**Arquivos:** `src/lib/data/products.ts` (877 linhas), `cases.ts` (226),
`blog.ts` (212), `ecosystem.ts` (468) × todas as actions do admin

As 11 páginas públicas que exibem conteúdo importam de `@/lib/data/*`:
`produtos/page.tsx`, `produtos/[slug]`, `produtos/comparar`, `obras/page.tsx`,
`obras/[slug]`, `blog/page.tsx`, `blog/[slug]`, `solucoes/[setor]`,
`ecossistema/page.tsx`, `ecossistema/[projeto]`, `(marketing)/page.tsx`.

O admin escreve em `Product`, `Case`, `Post` no PostgreSQL. **Editar um produto
no painel não altera nada no site.** Publicar um artigo no admin não o publica.

Esta é a decisão arquitetural mais importante em aberto do projeto e é
pré-requisito de #6, #11, #12, #13 e de boa parte do Bloco E.

**Correção proposta:** decisão do proprietário — (a) site lê do banco e
`lib/data/*` vira seed; (b) admin é descontinuado; (c) admin gera os arquivos
estáticos. Não é correção mecânica.
**Risco:** ALTO — reescreve 11 páginas e exige banco populado. Não deve ser feito
sem decisão explícita.

---

## 🔵 BAIXO

### #19 — `middleware.ts` usa convenção deprecada no Next.js 16

> **STATUS: CORRIGIDO.**

**Arquivo:** `src/middleware.ts`

O build emite: `⚠ The "middleware" file convention is deprecated. Please use
"proxy" instead.` O arquivo funciona, mas a convenção sairá em versão futura.

**Correção proposta:** renomear para `src/proxy.ts` conforme o guia de migração
do Next.js 16.
**Risco:** baixo — mudança de nome + verificação do matcher.

---

### #20 — Rotas do site público renderizam dinamicamente sem necessidade

> **STATUS: CORRIGIDO.**

> **Descrição corrigida na Revisão (H.1).** A causa raiz não é ausência de
> `generateStaticParams` (que existe em 5 rotas), e sim a falta de
> `setRequestLocale` nas páginas. Análise canônica em **#62**.

**Evidência:** saída de `pnpm build` — todas as 22 rotas `[locale]/*` marcadas
com `ƒ (Dynamic) server-rendered on demand`.

`[locale]/layout.tsx:11-13` declara `generateStaticParams`, e `setRequestLocale`
(linha 25) é chamado — a intenção era rendering estático. Mas nenhuma página
declara `generateStaticParams` para seus próprios params (`[slug]`, `[setor]`,
`[projeto]`), e o conteúdo vem de arquivos estáticos que poderiam ser
pré-renderizados integralmente.

Impacto em TTFB e Core Web Vitals; detalhado no Bloco E.

**Correção proposta:** adicionar `generateStaticParams` nas rotas dinâmicas e
`export const dynamic = "force-static"` onde aplicável.
**Risco:** baixo, mas exige verificar que nenhuma página usa `cookies()`/`headers()`.

---

## Autocheck — BLOCO A

Confirmação, subitem a subitem, do que foi verificado e onde.

### Seção 1 — Rotas x chamadas de API

| Subitem | Verificado | Onde |
|---|---|---|
| Listar rotas do backend | ✅ | `find src/app -name route.ts` → 2 rotas. `POST /api/leads` (body `leadRequestSchema`, respostas 201/400/429/503/500); `GET\|POST /api/auth/[...nextauth]` (handlers NextAuth, `runtime = "nodejs"`) |
| Listar chamadas HTTP do frontend | ✅ | `grep -rn "fetch(\|axios\|XMLHttpRequest" src/` → 4 chamadas, todas `POST /api/leads` |
| Chamadas para rotas inexistentes | ✅ | Nenhuma. As 4 chamadas apontam para rota existente |
| Rotas nunca consumidas | ✅ | Nenhuma rota HTTP órfã. As 24 Server Actions são todas consumidas (verificado por grep de import) |
| Método HTTP divergente | ✅ | Todas as 4 chamadas usam POST; a rota só exporta POST |
| Paths com typo | ✅ | Todos `/api/leads`, idênticos |
| Versões de API misturadas | ✅ | Não se aplica — não há versionamento de API |
| baseURL/prefixos inconsistentes | ✅ | Todas as chamadas usam path relativo `/api/leads`. Sem baseURL configurável |
| Rotas duplicadas/conflitantes | ✅ | Nenhuma. `/admin/login` redireciona para `/portal/login` (intencional, `admin/login/page.tsx:4`) |

**Achados:** #1, #2, #3, #5.

### Seção 2 — Contratos de dados

| Subitem | Verificado | Onde |
|---|---|---|
| Campos enviados pelo front x validados no back | ✅ | 4 formulários comparados campo a campo contra `leadRequestSchema` |
| Campos retornados pelo back x consumidos no front | ✅ | Rota devolve `{success, id}` / `{error, issues}`; os 4 clientes só checam `res.ok` — nenhum consome `issues`, então erros de validação não chegam ao usuário (contribui para #1, #2) |
| Nomes divergentes (camelCase x snake_case) | ✅ | Consistente em camelCase nos dois lados. Exceção: `Account` usa snake_case (`refresh_token`, `access_token`, `id_token`, `session_state`) por exigência do PrismaAdapter do Auth.js — correto |
| Tipos incompatíveis | ✅ | `truckVolume` usa `z.coerce.number().int()` contra `Int?` no banco — compatível |
| Campos obrigatórios ausentes | ✅ | #2 (`phone`) |
| Opcionais tratados como garantidos | ✅ | `result?.model` em `calculadora/page.tsx:128` usa optional chaining corretamente |
| Estruturas aninhadas divergentes | ✅ | `utm` é `Record<string,string>` no zod e `Json?` no Prisma — compatível |
| Enums com valores diferentes | ✅ | #1, #17 |
| Data/hora e timezone | ✅ | #7 |

**Achados:** #1, #2, #4, #7, #15, #16, #17.

### Seção 3 — Banco de dados x código

| Subitem | Verificado | Onde |
|---|---|---|
| Schema x uso real | ✅ | Varredura `db.<model>.` para os 20 models (tabela no corpo do relatório) |
| Colunas órfãs | ✅ | #11 (metaTitle/metaDesc), #14 (assignedTo), #12 (order), #13 (cover) |
| Campos usados que não existem no banco | ✅ | Nenhum — `pnpm typecheck` limpo garante isso via tipos gerados do Prisma |
| Tipos divergentes | ✅ | #7 (timestamp sem timezone) |
| Nullable inconsistente | ✅ | `Lead.phone` NOT NULL vs. formulários que não coletam telefone (relacionado a #2) |
| Defaults divergentes | ✅ | `Product.order` default 0 nunca sobrescrito (#12); `Lead.country` default "BR" sobrescrito por "XX" (#16) |
| Falta de índices | ✅ | Corrigido na sessão anterior (migration `20260731120000`): índices em `Lead(deletedAt,createdAt)`, `Lead(status)`, `Lead(source)` e nas 8 FKs. Verificado no SQL da migration |
| Foreign keys ausentes | ✅ | Corrigido na sessão anterior: `Note.authorId`→`User`, `ClientEquipment.userId`→`User`. **Nenhuma FK ausente remanescente** exceto `Lead.assignedTo` (#14), que é String solta |
| Migrations fora de sincronia | ✅ | #8 |
| Relacionamentos mal modelados | ✅ | #5 (candidaturas em `Lead`), #9 (`Application` órfã), #14 |

**Achados:** #5, #6, #7, #8, #9, #10, #11, #12, #13, #14, #18.

---

# BLOCO B — Seções 4 (erros e bugs) e 5 (segurança)

## 🔴 CRÍTICO

### #21 — Dashboard do admin conta e exibe leads excluídos (soft delete ignorado)

> **STATUS: CORRIGIDO.**

**Arquivo:** `src/app/admin/(panel)/page.tsx:34-45`

As quatro consultas do dashboard não filtram `deletedAt`:

```ts
db.lead.count({ where: { createdAt: { gte: startOfMonth } } }),
db.lead.count(),
db.lead.groupBy({ by: ["status"], _count: { id: true } }),
db.lead.findMany({ orderBy: { createdAt: "desc" }, take: 10 }),
```

`deleteLead` (`leads/actions.ts:159-173`) passou a fazer soft delete
(`deletedAt: new Date()`), e `getLeads`/`exportLeadsCsv` filtram corretamente via
`buildWhere` (`leads/actions.ts:43`). O dashboard não. Resultado: um lead
excluído some da listagem mas **continua contando** em "Total de leads", "Leads
este mês", na taxa de conversão e **reaparece em "Leads recentes"** com link
funcional para o detalhe.

`[REGRESSÃO DA SESSÃO ANTERIOR]` — o soft delete foi introduzido sem atualizar
este arquivo.

**Correção proposta:** adicionar `where: { deletedAt: null }` às quatro consultas.
**Risco:** nenhum.

---

## 🟠 ALTO

### #22 — Política de senha do formulário diverge da do servidor

> **STATUS: CORRIGIDO.**

**Arquivos:** `src/app/admin/(panel)/usuarios/novo/page.tsx:29` ×
`src/app/admin/(panel)/usuarios/actions.ts:12, 35-49`

| Camada | Regra |
|---|---|
| Formulário (zod cliente) | `z.string().min(6, "Minimo 6 caracteres")` |
| Servidor | `MIN_PASSWORD_LENGTH = 10` + ao menos 2 classes de caracteres |

O usuário digita uma senha de 6 caracteres, passa na validação do cliente, envia,
e recebe `serverError` genérico depois do round-trip. A mensagem do servidor é
exibida (`novo/page.tsx:95`), então não é silencioso — mas a experiência é ruim e
o rótulo do campo continua prometendo 6 caracteres.

`[REGRESSÃO DA SESSÃO ANTERIOR]` — o backend foi endurecido sem atualizar o
formulário.

**Correção proposta:** extrair a regra para um módulo compartilhado
(`lib/validators/`) e usá-la nos dois lados, corrigindo também o texto de ajuda.
**Risco:** nenhum.

---

### #23 — Erros de Server Action não são tratados no cliente; não há error boundary

> **STATUS: CORRIGIDO.**

**Arquivos:**
- `src/components/admin/lead-actions-dropdown.tsx:36-46`
- `src/components/admin/lead-status-select.tsx:34-38`
- `src/app/admin/(panel)/blog/page.tsx:85-87, 118-120`
- `src/app/admin/(panel)/obras/page.tsx:106-108`
- `src/app/admin/(panel)/produtos/page.tsx:98-100, 132-134`

```ts
function handleDelete() {
  startTransition(async () => {
    await deleteLead(leadId);      // sem try/catch
  });
}
```

`updateLeadStatus`, `addNote` e `deleteLead` **lançam** `Error`
(`leads/actions.ts:111, 123, 134, 137, 152, 171`) e todas as 24 actions podem
lançar `AuthorizationError` (`lib/auth-guard.ts:52-66`). Nenhum chamador tem
`try/catch`.

Agravante verificado: **o projeto não tem nenhum `error.tsx` nem
`global-error.tsx`** (`find src/app -name "error.tsx" -o -name "global-error.tsx"`
retorna vazio). Sem error boundary, a exceção sobe até o handler padrão do
Next.js e o usuário vê a página de erro genérica, perdendo o contexto do painel.

**Correção proposta:** `try/catch` nos handlers com feedback ao usuário (o pacote
`sonner` já está declarado no `package.json` e nunca foi usado — ver #35), mais
`error.tsx` em `admin/(panel)/` e `portal/(dashboard)/`.
**Risco:** baixo.

---

### #24 — Login sem rate limiting (força bruta de credenciais)

> **STATUS: CORRIGIDO.**

**Arquivos:** `src/app/api/auth/[...nextauth]/route.ts`;
`src/lib/auth.ts:24-59`; `src/lib/rate-limit.ts`

`checkRateLimit` é chamado em **um único lugar**: `api/leads/route.ts:15`
(verificado por grep). A rota `/api/auth/[...nextauth]`, que processa o
`signIn("credentials")`, não tem qualquer limitação.

O provider `Credentials` (`auth.ts:24-59`) permite tentativas ilimitadas de
e-mail/senha contra contas `ADMIN`. Combinado com a ausência de bloqueio de conta
e de 2FA, é o vetor mais direto contra o painel. A seção 5 do escopo pede
explicitamente rate limiting em login e criação de conta.

Nota: o hash descartável em `auth.ts:12-13` já equaliza o tempo de resposta
(evita enumeração de contas), mas isso não impede força bruta.

**Correção proposta:** limitar por IP **e** por e-mail dentro de `authorize()`
(ex.: 5 tentativas / 15 min), com contador em Redis. Considerar bloqueio
temporário da conta após N falhas.
**Risco:** médio — um limitador mal calibrado tranca administradores legítimos.
Exige Upstash configurado (ver #30).

---

## 🟡 MÉDIO

### #25 — Falhas de banco são engolidas e viram "não encontrado" ou zeros

> **STATUS: CORRIGIDO.**

**Arquivos:**
- `src/app/admin/(panel)/leads/[id]/page.tsx:87-101`
- `src/app/admin/(panel)/page.tsx:63-71`

```ts
let lead;
try {
  lead = await db.lead.findUnique({ ... });
} catch {
  lead = null;          // sem log
}
if (!lead) notFound();  // banco fora do ar => 404
```

Indisponibilidade do banco é apresentada como "este lead não existe". No
dashboard, o `catch` devolve zeros: a equipe vê "Total de leads: 0" e conclui que
perdeu a base. Nenhum dos dois registra log (as actions em `leads/actions.ts` já
usam `logError`; estas duas páginas não).

**Correção proposta:** deixar a exceção subir para um `error.tsx` (#23), ou
capturar, chamar `logError` e renderizar estado de erro distinto de "vazio".
**Risco:** baixo.

---

### #26 — Paginação exibe valores inválidos vindos da query string

> **STATUS: CORRIGIDO.**

**Arquivo:** `src/app/admin/(panel)/leads/page.tsx:84, 246`

```ts
const page = Number(params.page ?? "1");   // ?page=abc  => NaN
...
<p>Página {page} de {totalPages}</p>        // "Página NaN de 3"
```

A action `getLeads` sanitiza corretamente (`leads/actions.ts:80-83`:
`Number.isFinite` + `Math.max(1, ...)`), então **a consulta não quebra** — o
defeito é apenas de exibição. Com `?page=-5` mostra "Página -5 de 3"; com
`?page=999` mostra "Página 999 de 3" e ambos os botões de navegação ficam
desabilitados, prendendo o usuário na página.

**Correção proposta:** sanitizar `page` também na página, ou fazer `getLeads`
devolver a página efetivamente usada.
**Risco:** nenhum.

---

### #27 — Autor da nota exibido como CUID cru

> **STATUS: CORRIGIDO.**

**Arquivo:** `src/app/admin/(panel)/leads/[id]/page.tsx:243`

```tsx
<span className="font-mono">{note.authorId}</span>
```

Mostra `cmd8x2k1p0000abcd...` em vez do nome de quem escreveu. O `findUnique`
(linhas 89-96) faz `include: { notes: ... }` sem incluir o autor.

A relação `Note.author → User` **agora existe** (adicionada na sessão anterior,
`schema.prisma:306`), então basta
`notes: { include: { author: { select: { name: true, email: true } } } }`.

**Correção proposta:** incluir o autor e exibir `note.author.name ?? note.author.email`.
**Risco:** nenhum. Depende da migration `20260731120000` estar aplicada.

---

### #28 — "Leads este mês" usa o fuso do servidor

> **STATUS: CORRIGIDO.**

**Arquivo:** `src/app/admin/(panel)/page.tsx:29-30`

```ts
const now = new Date();
const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
```

Em produção o runtime roda em UTC, então o mês começa às 21:00 BRT do último dia
do mês anterior. Leads criados nessa janela de 3 horas caem no mês errado.
Mesma raiz de #7.

**Correção proposta:** calcular o início do mês em `America/Sao_Paulo`.
**Risco:** baixo.

---

### #29 — JSON-LD injetado sem escapar `<`

> **STATUS: CORRIGIDO.**

**Arquivos:**
- `src/app/[locale]/(marketing)/produtos/[slug]/page.tsx:56, 60`
- `src/app/[locale]/(marketing)/blog/[slug]/page.tsx:75`
- `src/app/[locale]/(marketing)/obras/[slug]/page.tsx:52`
- `src/app/[locale]/(marketing)/solucoes/[setor]/page.tsx:132`

```tsx
dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
```

`JSON.stringify` não escapa `<`. Um valor contendo `</script><script>...` fecha o
bloco e executa script arbitrário.

**Hoje o risco é baixo:** os dados vêm de `src/lib/data/*.ts`, arquivos estáticos
sob controle dos desenvolvedores. **O risco vira ALTO no momento em que o site
passar a ler do banco (#18)**, porque aí o conteúdo é editável pelo painel — e o
painel tem 3 papéis com acesso de escrita.

**Correção proposta:** `JSON.stringify(x).replace(/</g, "\\u003c")`.
**Risco:** nenhum. Correção de 1 linha × 5 ocorrências; fazer agora evita
esquecer depois.

---

### #30 — Rate limit do endpoint público depende de Upstash configurado

> **STATUS: CORRIGIDO.**

**Arquivo:** `src/lib/rate-limit.ts:41-56`

Comportamento atual (corrigido na sessão anterior): sem `UPSTASH_REDIS_REST_URL`
e `UPSTASH_REDIS_REST_TOKEN`, em produção `checkRateLimit` devolve
`{ success: false, reason: "unconfigured" }` e `api/leads/route.ts:17-27` responde
**503**.

Isso é correto do ponto de vista de segurança (falha fechada), mas significa que
**esquecer de configurar o Upstash derruba silenciosamente toda a captação de
leads** — o formulário passa a responder 503 e o único sinal é uma linha de
`logError` no servidor.

**Correção proposta:** validar as variáveis obrigatórias no boot da aplicação
(ex.: zod sobre `process.env`) e falhar o build/deploy em vez de degradar em
runtime. Ver #37.
**Risco:** baixo.

---

## 🔵 BAIXO

### #31 — `utm` sofre type assertion sem validação em runtime

> **STATUS: CORRIGIDO.**

**Arquivo:** `src/app/admin/(panel)/leads/[id]/page.tsx:111, 326, 335`

```ts
const utm = lead.utm as Record<string, string> | null;
...
{utm && Object.keys(utm).length > 0 && ( ... Object.entries(utm).map(...) )}
```

`Lead.utm` é `Json?` — pode conter escalar ou array. Se contiver a string
`"abc"`, `Object.keys` devolve `["0","1","2"]` e a UI renderiza três cards com
letras soltas.

**Na prática está protegido:** `leadRequestSchema` valida `utm` como
`z.record(z.string().max(300))` (`validators/lead.ts:60`), então tudo que a rota
grava é objeto de strings. A exposição só existe para registros inseridos por
outro caminho (seed, importação manual, `psql`).

**Correção proposta:** validar com zod na leitura em vez de fazer cast.
**Risco:** nenhum.

---

### #32 — Formulário de nota descarta entrada só com espaços sem avisar

> **STATUS: CORRIGIDO.**

**Arquivo:** `src/app/admin/(panel)/leads/[id]/page.tsx:104-109`

```ts
const content = formData.get("content") as string;
if (!content?.trim()) return;   // retorna em silêncio
```

O `<Textarea required>` (linha 219) cobre o caso vazio no navegador, mas conteúdo
só com espaços passa pelo `required` e é descartado sem feedback.

**Correção proposta:** devolver estado de erro via `useActionState`.
**Risco:** nenhum.

---

## Não se aplica — Seção 5

Registrado conforme exigido, com justificativa:

| Subitem | Situação | Justificativa |
|---|---|---|
| Injeção de SQL/NoSQL | **Não se aplica** | Todo acesso a dados passa pelo Prisma Client com queries parametrizadas. Nenhuma ocorrência de `$queryRaw`, `$executeRaw` ou `$queryRawUnsafe` (grep em `src/`) |
| CORS mal configurado | **Não se aplica** | Não há configuração de CORS. As rotas são same-origin; Next.js 16 aplica verificação de origem nativa em Server Actions |
| Upload de arquivos sem validação | **Não se aplica** | Não existe endpoint de upload. `UPLOADTHING_SECRET`/`UPLOADTHING_APP_ID` estão no `.env.example` mas o pacote não está instalado — ver #13 e #36 |
| Tokens sem expiração | **Não se aplica** | Sessão é JWT do NextAuth com `maxAge` padrão de 30 dias. Não há tokens de aplicação próprios (não existe fluxo de "esqueci minha senha") |
| IDs previsíveis expostos | **Não se aplica** | Todos os IDs são `cuid()` nos 20 models. Não há IDs sequenciais |
| Senhas sem hash adequado | **Não se aplica** | bcrypt com custo 12 (`usuarios/actions.ts:13`, `seed-admin.ts:6`, `seed-all.ts:6`) |
| Cookies/sessões sem flags | **Não se aplica** | NextAuth v5 aplica `httpOnly`, `sameSite=lax` e `secure` em produção por padrão; não há `cookies.set` manual no projeto |
| Secrets hardcoded | **Não se aplica** | Corrigido na sessão anterior. Único literal remanescente é `DUMMY_PASSWORD_HASH` (`auth.ts:12-13`), que é um hash descartável proposital, não um segredo |

---

## Autocheck — BLOCO B

### Seção 4 — Erros e bugs

| Subitem | Verificado | Onde |
|---|---|---|
| Erros não tratados / promises sem tratamento | ✅ | #23 — 6 chamadores de Server Action sem `try/catch`; ausência total de `error.tsx` confirmada por `find` |
| Exceções engolidas | ✅ | #25 — `leads/[id]/page.tsx:97`, `admin/(panel)/page.tsx:63`. As 5 actions usam `logError` (corrigido na sessão anterior) |
| Inputs sem validação | ✅ | Todas as actions validam com zod (`validators/admin.ts`); rota pública valida com `leadRequestSchema`. #26 (page) e #31 (utm) são os resíduos |
| Status codes incorretos | ✅ | `api/leads/route.ts`: 201/400/429/503/500 — todos semanticamente corretos. #25 aponta 404 usado para falha de banco |
| Mensagens de erro inconsistentes | ✅ | Actions devolvem `{success,error}`; `leads/actions.ts` **lança** em vez de devolver — inconsistência registrada em #23 |
| Race conditions | ✅ | Duplo clique em submit registrado em #48 (Bloco F). `togglePublish`/`toggleProductFeatured` fazem read-then-write sem transação — janela real mas de impacto trivial (inverter um booleano) |
| Queries N+1 | ✅ | Nenhuma encontrada. `admin/(panel)/media/page.tsx:34-37` usa `include` (JOIN, não N+1); dashboard usa `Promise.all` com 4 queries agregadas |
| Transações ausentes | ✅ | `updateProduct` e `updateCase` usam `db.$transaction`. `createProduct`/`createCase` usam nested writes, transacionais por natureza |
| Null/undefined não tratados | ✅ | #31. Demais acessos usam `??` ou optional chaining |
| Condições de borda | ✅ | #26 (paginação). Listas vazias têm estado vazio em todas as 6 listagens do admin. `MAX_PER_PAGE=100` limita o teto |

**Achados:** #21, #22, #23, #25, #26, #27, #28, #31, #32.

### Seção 5 — Segurança

| Subitem | Verificado | Onde |
|---|---|---|
| Rotas sem autenticação/autorização | ✅ | As 24 Server Actions têm guard (corrigido na sessão anterior; verificado guard a guard). Guards das actions espelham os das páginas |
| Permissão só no frontend | ✅ | Nenhum caso. `lead-actions-dropdown.tsx` e `lead-status-select.tsx` são client components, mas as actions revalidam no servidor |
| Injeção SQL/NoSQL | ✅ | Não se aplica (tabela acima) |
| XSS | ✅ | #29 — 5 pontos de `dangerouslySetInnerHTML`. Nenhum outro; React escapa por padrão |
| Dados sensíveis em logs/respostas/URLs | ✅ | `console.log("[LEAD]", leadData)` removido na sessão anterior. `logError` nunca recebe corpo de requisição (`api/leads/route.ts:80`). Nenhum PII em query string |
| Secrets hardcoded/versionados | ✅ | Não se aplica (tabela acima). `.gitignore` cobre `.env*`; `.env` não está no repositório |
| CORS | ✅ | Não se aplica |
| Cookies/sessões/tokens | ✅ | Não se aplica |
| Senhas sem hash | ✅ | Não se aplica (bcrypt custo 12) |
| Tokens sem expiração | ✅ | Não se aplica |
| IDs previsíveis | ✅ | Não se aplica (cuid) |
| Upload sem validação | ✅ | Não se aplica (não existe upload) |
| **Rate limiting em rotas sensíveis** | ✅ | **#24** — login sem proteção. `/api/leads` protegido (#30) |

**Achados:** #24, #29, #30.

---

# BLOCO C — Seções 6 (configuração), 7 (dependências) e 8 (qualidade)

## 🔴 CRÍTICO

### #33 — `next-auth` em beta com 3 CVEs críticos, um deles atinge exatamente o padrão de guard do projeto

> **STATUS: CORRIGIDO.**

**Arquivo:** `package.json:30` — `"next-auth": "5.0.0-beta.31"`
**Evidência:** `pnpm audit` — 26 advisories no total (3 críticos, 13 altos, 9 moderados, 1 baixo)

| Severidade | Advisory | Versão corrigida |
|---|---|---|
| **CRÍTICO** | Auth.js: *Configuration errors can cause existence-based auth checks to fail open (auth object populated with an error)* — GHSA-8fpg-xm3f-6cx3 | `>=5.0.0` |
| **CRÍTICO** | Auth.js: *Email normalizer validates the address before Unicode normalization, allowing a homoglyph @ bypass* — GHSA-7rqj-j65f-68wh | `>=5.0.0` |
| ALTO | Auth.js: `getToken()` lança exceção não capturada em header Bearer malformado | `>=5.0.0` |
| MODERADO | Auth.js: cookies de state/nonce/PKCE do OAuth não vinculados ao provider | `>=5.0.0` |

O mesmo conjunto atinge `@auth/core` (via `@auth/prisma-adapter`), corrigido em
`>=0.41.3`.

**Por que o primeiro CVE é especialmente grave neste projeto:** o padrão de
autorização usado em **todo** o sistema é uma checagem baseada em existência do
objeto de sessão:

- `src/lib/auth-guard.ts:36` — `if (!session?.user) redirect(...)`
- `src/lib/auth-guard.ts:54` — `if (!session?.user) throw new AuthorizationError(...)`
- `src/app/portal/(dashboard)/layout.tsx:12` — `if (!session?.user) redirect(...)`
- `src/app/portal/(dashboard)/equipamentos/page.tsx:29` — idem
- `src/app/portal/(dashboard)/equipamentos/[id]/page.tsx:38, 57` — idem
- `src/app/portal/(dashboard)/page.tsx` — idem

Se um erro de configuração popular o objeto de auth com um erro em vez de
`null`, `session?.user` pode ser truthy e **todos esses guards liberam o
acesso**. É exatamente o cenário descrito no advisory.

**Correção proposta:** atualizar para `next-auth@^5.0.0` (estável) e
`@auth/prisma-adapter` com `@auth/core >= 0.41.3`. Reforçar os guards para
validar `session.user.id` e `session.user.role` explicitamente, em vez de apenas
a existência do objeto.
**Risco:** MÉDIO-ALTO. Saída de beta para estável pode ter breaking changes na
API de `auth()`, callbacks e tipos. Exige testar os 3 providers (Google, Resend,
Credentials) e o fluxo de sessão JWT. Não é atualização mecânica.

---

## 🟠 ALTO

### #34 — `next` 16.2.6 com 9 advisories, incluindo bypass de middleware com Turbopack

> **STATUS: CORRIGIDO.**

**Arquivo:** `package.json:29` — `"next": "16.2.6"` (corrigido em `>=16.2.11`)

| Severidade | Advisory |
|---|---|
| ALTO | *Middleware / Proxy bypass in App Router applications using Turbopack* |
| ALTO | *Denial of Service in App Router using Server Actions* |
| ALTO | *Server-Side Request Forgery in Server Actions on custom servers* |
| ALTO | *Server-Side Request Forgery in rewrites via attacker-controlled...* |
| MODERADO | *Cache confusion of response bodies for requests with bodies* (×2) |
| MODERADO | *Unbounded Server Action payload in Edge runtime* |
| MODERADO | *Denial of Service in the Image Optimization API using SVGs* |
| MODERADO | *Unauthenticated disclosure of internal Server Function endpoint* |

**Aplicabilidade confirmada neste projeto:**
- *Turbopack middleware bypass* — o build roda com Turbopack (saída de
  `pnpm build`: `▲ Next.js 16.2.6 (Turbopack)`) e existe `src/middleware.ts`.
- *DoS via Server Actions* e *disclosure de endpoint de Server Function* — o
  projeto tem 24 Server Actions, que são o backend inteiro.
- *Image Optimization com SVG* — `public/images/tombadores/*.svg` são servidos
  como placeholders de produto.

**Correção proposta:** `pnpm up next@^16.2.11 eslint-config-next@^16.2.11`.
**Risco:** baixo — patch dentro da mesma minor. Rodar `pnpm build` depois.

---

### #35 — Painel admin não tem navegação em telas menores que `lg` (1024px)

> **STATUS: CORRIGIDO.**

**Arquivos:** `src/components/admin/sidebar.tsx:84, 98-113`;
`src/components/admin/top-bar.tsx`; `src/app/admin/(panel)/layout.tsx:15`

```tsx
// sidebar.tsx:84
<aside className="hidden lg:flex lg:w-60 ...">      // desktop apenas

// sidebar.tsx:98
export function MobileSidebar() { ... }              // existe, nunca renderizado
```

`MobileSidebar` está implementado (Sheet + botão hambúrguer `lg:hidden`,
linhas 98-113) e **não é importado nem renderizado em lugar nenhum** — confirmado
por `grep -rn "<MobileSidebar"` (zero resultados) e por inspeção de
`admin/top-bar.tsx`, que não menciona `Menu` nem `MobileSidebar`.

O layout (`layout.tsx:15-17`) renderiza `<Sidebar />` (desktop-only) e
`<TopBar />`. **Abaixo de 1024px o administrador não tem nenhuma forma de navegar
entre Leads, Produtos, Obras, Blog, Usuários, Mídia e Configurações.**

**O portal do cliente faz certo:** `portal/top-bar.tsx:16, 43` importa e renderiza
`<PortalMobileSidebar />`. A assimetria confirma que se trata de esquecimento, não
de decisão.

**Correção proposta:** importar e renderizar `<MobileSidebar />` em
`admin/top-bar.tsx`, espelhando `portal/top-bar.tsx:43`.
**Risco:** nenhum — o componente já existe e é análogo ao do portal.

---

### #36 — Analytics documentado, exibido como "configurado" no painel, e inexistente no site

> **STATUS: CORRIGIDO.**

> **Severidade revisada na Revisão (H.2): MÉDIO → ALTO.**

**Arquivos:** `package.json:24` (`@vercel/analytics`); `.env.example` (`NEXT_PUBLIC_GA_ID`,
`NEXT_PUBLIC_META_PIXEL_ID`); `src/app/admin/(panel)/config/page.tsx:82-88`

Três camadas de analytics estão aparentemente configuradas e **nenhuma funciona**:

1. `@vercel/analytics` está em `dependencies` e **nunca é importado**
   (`grep -rn "@vercel/analytics" src/` → nada). O componente `<Analytics />`
   não existe em nenhum layout.
2. `NEXT_PUBLIC_GA_ID` e `NEXT_PUBLIC_META_PIXEL_ID` são lidos em **um único
   lugar**: para serem **exibidos** na tela de configurações do admin
   (`config/page.tsx:83, 87`). Nenhum `<Script>` de GA ou Meta Pixel existe no
   projeto.
3. O admin mostra o valor da variável ao lado do rótulo "Google Analytics",
   sugerindo ao operador que o rastreamento está ativo.

**Consequência direta para o objetivo de tração orgânica (seção 13):** não há
como medir sessões, origem de tráfego, conversão de formulário ou desempenho de
página. Nenhuma decisão de SEO pode ser validada.

**Correção proposta:** montar `<Analytics />` do Vercel no root layout e/ou
adicionar GA4 via `next/script` com `strategy="afterInteractive"`, **condicionado
ao consentimento do cookie banner** (ver #53).
**Risco:** baixo, mas interage com LGPD — não carregar antes do consentimento.

---

## 🟡 MÉDIO

### #37 — Vulnerabilidades em dependências de build

> **STATUS: CORRIGIDO.**

**Evidência:** `pnpm audit`

| Pacote | Severidade | Corrigido em | Natureza |
|---|---|---|---|
| `sharp` | ALTA | `>=0.35.0` | Vulnerabilidades herdadas do libvips (CVE-2026-33327 e outras). **Runtime** — usado pelo `next/image` |
| `postcss` | ALTA (×2) + MODERADA | `>=8.5.18` | Leitura arbitrária de arquivo e path traversal via source map. Build-time |
| `brace-expansion` | ALTA (×3) | `>=5.0.8` | DoS por expansão exponencial. Transitiva (glob/eslint) |
| `js-yaml` | ALTA + MODERADA | `>=4.3.0` | DoS quadrático em merge keys. Transitiva |
| `@babel/core` | BAIXA | `>=7.29.1` | Leitura arbitrária via `sourceMappingURL`. Transitiva |

`sharp` é o mais relevante por ser a única dependência **de runtime** da lista —
processa imagens enviadas ao `/_next/image`.

**Correção proposta:** `pnpm up sharp@^0.35.0` e `pnpm dedupe`; para as
transitivas, usar `pnpm.overrides` no `package.json`.
**Risco:** baixo. `sharp` 0.34→0.35 é minor; verificar build em Windows (binários
nativos).

---

### #38 — Variáveis de ambiente usadas e não documentadas / documentadas e não usadas

> **STATUS: CORRIGIDO.**

**Arquivos:** `.env.example`; `src/scripts/seed-admin.ts`; `src/scripts/seed-all.ts`

**Usadas no código, ausentes do `.env.example`:**

| Variável | Onde | Efeito de não documentar |
|---|---|---|
| `ALLOW_PROD_SEED` | `seed-admin.ts:24`, `seed-all.ts:1424` | Trava de proteção invisível: quem rodar o seed em produção verá o erro sem saber que existe a variável |
| `SEED_ADMIN_NAME` | `seed-admin.ts:43` | Opcional, com default |
| `SEED_CLIENT_NAME` | `seed-all.ts` | Opcional, com default |

**Documentadas no `.env.example`, nunca lidas pelo código:**

| Variável | Situação |
|---|---|
| `UPLOADTHING_SECRET` | O pacote `uploadthing` **não está no `package.json`**. Não existe upload (ver #13) |
| `UPLOADTHING_APP_ID` | idem |
| `AUTH_SECRET`, `AUTH_URL`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET` | Lidas implicitamente pelo NextAuth — **correto**, não é achado |
| `DATABASE_URL`, `DIRECT_URL` | Lidas pelo Prisma via `schema.prisma:7-8` — **correto** |

**Correção proposta:** documentar as três primeiras; remover as duas do
UploadThing enquanto o upload não existir.
**Risco:** nenhum.

---

### #39 — Três endereços de remetente diferentes espalhados pelo código

> **STATUS: CORRIGIDO.**

**Arquivos:** `src/lib/constants.ts:13-14`; `src/lib/auth.ts:21`;
`src/lib/email/client.ts:29-31`

| Local | Valor | Uso |
|---|---|---|
| `constants.ts:13` | `atendimento@pili.ind.br` | `COMPANY.email` — exibido no site (footer, contato, catálogo) |
| `constants.ts:14` | `comercial@pili.ind.br` | `COMPANY.emailComercial` |
| `auth.ts:21` | `contato@pili.ind.br` | fallback do provider Resend (magic link) |
| `email/client.ts:29` | `contato@pili.ind.br` | fallback de `FROM_EMAIL` |
| `email/client.ts:31` | `comercial@pili.ind.br` | fallback de `LEAD_NOTIFY_EMAIL` |

`contato@pili.ind.br` aparece só como fallback de código e **não existe em
`COMPANY`** — não há garantia de que a caixa exista. Se `RESEND_FROM_EMAIL` não
for definida, os e-mails saem de um endereço possivelmente inexistente e, se o
domínio não estiver verificado no Resend para ele, são rejeitados.

**Correção proposta:** centralizar em `constants.ts` e referenciar `COMPANY.email`
nos fallbacks.
**Risco:** nenhum.

---

### #40 — Nenhuma validação de variáveis de ambiente no boot

> **STATUS: CORRIGIDO.**

**Arquivos:** todo o projeto (ausência)

Não existe schema de validação de `process.env`. As variáveis são lidas com `??`
e defaults espalhados (`constants.ts:5, 19-22`; `email/client.ts:28-31`;
`auth.ts:21`), ou testadas em runtime (`rate-limit.ts:9-14`;
`email/client.ts:14`).

Consequência: uma variável faltando não impede o deploy — degrada o
comportamento silenciosamente em produção. Casos concretos já mapeados: #30
(sem Upstash → 503 na captação de leads), #36 (sem GA → nada acontece),
`RESEND_API_KEY` ausente → e-mails silenciosamente não enviados
(`send-lead-emails.tsx:29-36` apenas loga).

**Correção proposta:** módulo `src/lib/env.ts` com zod validando `process.env` no
import, lançando no boot. Padrão `@t3-oss/env-nextjs` ou zod puro.
**Risco:** baixo, mas **exige cuidado**: um schema estrito demais quebra o build
em ambientes que hoje funcionam parcialmente.

---

### #41 — Mapeamento de status de lead duplicado em 5 arquivos, com divergência visual real

> **STATUS: CORRIGIDO.**

**Arquivos:**

| Arquivo | Constante | Estilo do status "NOVO" |
|---|---|---|
| `admin/(panel)/leads/page.tsx:42-49` | `STATUS_COLORS` | `bg-blue-100 text-blue-800 border-blue-200` |
| `admin/(panel)/leads/[id]/page.tsx:46-53` | `STATUS_COLORS` | `bg-blue-100 text-blue-800 border-blue-200` |
| `components/admin/status-badge.tsx:5-12` | `statusConfig` | `bg-blue-100 text-blue-800` (**sem borda**) |
| `components/admin/lead-actions-dropdown.tsx:20-27` | `STATUS_OPTIONS` | `bg-blue-500` (bolinha) |
| `components/admin/lead-status-select.tsx:14-21` | `STATUS_OPTIONS` | `bg-blue-500` (bolinha) |

`SOURCE_LABELS` está duplicado em 2 dos arquivos acima
(`leads/page.tsx:51-60` e `leads/[id]/page.tsx:55-64`).

A divergência é observável: o **dashboard** usa `<StatusBadge>` (sem borda) e a
**listagem de leads** usa `STATUS_COLORS` (com borda). O mesmo lead com o mesmo
status aparece com dois visuais diferentes em duas telas do mesmo painel.

Adicionar um valor ao enum `LeadStatus` exige editar 5 arquivos. O
`Record<LeadStatus, …>` garante que o TypeScript acuse a falta, então não há
risco de runtime — mas é retrabalho garantido.

**Correção proposta:** um único módulo `lib/lead-display.ts` exportando labels,
cores e opções; os 5 arquivos passam a consumi-lo.
**Risco:** baixo.

---

### #42 — Inconsistência no contrato de erro entre Server Actions

> **STATUS: CORRIGIDO.**

**Arquivos:** `admin/(panel)/leads/actions.ts` × as outras 4 actions

| Módulo | Padrão em caso de erro |
|---|---|
| `produtos/actions.ts`, `obras/actions.ts`, `blog/actions.ts`, `usuarios/actions.ts` | **Retorna** `{ success: false, error: "..." }` |
| `leads/actions.ts:111, 123, 134, 137, 152, 171` | **Lança** `new Error("...")` |
| `leads/actions.ts:75-101` (`getLeads`) | **Retorna** lista vazia (nem lança nem sinaliza erro) |

Três estratégias diferentes no mesmo diretório. Isso é a causa direta de #23: os
chamadores de `leads/actions.ts` foram escritos como se as actions retornassem
resultado, e não tratam a exceção.

**Correção proposta:** padronizar em `{ success, error }` (o formato majoritário)
e ajustar os 4 chamadores.
**Risco:** baixo.

---

## 🔵 BAIXO

### #43 — 13 exports públicos nunca referenciados (código morto)

> **STATUS: CORRIGIDO.**

**Verificado por varredura de cada `export` em `src/lib` e `src/components/{shared,marketing,admin}` contra o restante de `src/`:**

| Arquivo | Símbolo | Observação |
|---|---|---|
| `lib/auth-guard.ts` | `PORTAL_ROLES` | O layout do portal (`portal/(dashboard)/layout.tsx:11-18`) refaz a checagem à mão |
| `lib/auth-guard.ts` | `requirePortalAuth` | idem — nunca chamado |
| `lib/auth-guard.ts` | `AuthorizationError` | Lançado internamente; **nunca capturado** — ver #23 |
| `lib/constants.ts` | `DEFAULT_LOCALE` | `i18n/routing.ts:6` repete `"pt-BR"` literal |
| `lib/constants.ts` | `APPLICATIONS` | `lead-form.tsx:117-123` repete as opções à mão |
| `lib/data/blog.ts` | `getFeaturedPosts` | |
| `lib/data/cases.ts` | `getCasesByApplication` | |
| `lib/data/products.ts` | `getProductsByCategory` | |
| `lib/prisma-errors.ts` | `isNotFoundError` | Criado na sessão anterior, nunca usado |
| `lib/rate-limit.ts` | `getRateLimiter` | Só usado internamente; não precisa ser export |
| `lib/seo.ts` | `generateOrganizationJsonLd` | **Schema Organization nunca é emitido** — ver Bloco E |
| `lib/validators/lead.ts` | `newsletterSchema` | Não existe formulário de newsletter |
| `lib/validators/lead.ts` | `catalogSchema` | Ver #15 |
| `components/admin/sidebar.tsx` | `MobileSidebar` | **Ver #35 — não é só código morto, é funcionalidade faltando** |

**Correção proposta:** remover os mortos de fato; consumir os que existem por
esquecimento (`DEFAULT_LOCALE`, `APPLICATIONS`, `generateOrganizationJsonLd`,
`MobileSidebar`, `requirePortalAuth`).
**Risco:** nenhum para remover; baixo para passar a usar.

---

### #44 — Dependências declaradas e nunca importadas

> **STATUS: CORRIGIDO.**

**Arquivo:** `package.json`

| Pacote | Situação |
|---|---|
| `@vercel/analytics` | Nunca importado — ver #36 |
| `sonner` | Nunca importado. É a biblioteca de toast que resolveria a falta de feedback em #23 e #47 |

Verificado também: `react-dom` e `sharp` aparecem como "não importados" por grep
mas são exigidos pelo React DOM e pelo `next/image` respectivamente —
**não são achados**.

**Correção proposta:** usar `sonner` (há necessidade real) e montar
`<Analytics />`; ou remover ambos.
**Risco:** nenhum.

---

### #45 — Nomenclatura mista português/inglês sem regra clara

> **STATUS: CORRIGIDO.**

**Evidência:** rotas em português (`/produtos`, `/obras`, `/orcamento`,
`/usuarios`); identificadores de código em inglês (`getProducts`, `createCase`,
`LeadStatus`); models Prisma em inglês (`Case`, `Post`) com enums em português
(`NOVO`, `GANHO`, `TOMBADOR_FIXO`); comentários mistos — `leads/actions.ts` em
português, `product-form.tsx:73` (`slugify`) sem comentário, `seo.ts` em inglês.

As rotas em português são **corretas e desejáveis para SEO** (ver Bloco E). O
problema é a ausência de regra registrada: `CLAUDE.md` não define idioma para
código, comentários ou enums.

Também há mistura dentro do mesmo arquivo — ex.: `admin/(panel)/leads/page.tsx`
tem comentários em inglês (`/* ---------- helpers ---------- */`,
`/* --- build filter query strings --- */`) e strings de UI em português.

**Correção proposta:** registrar a convenção em `CLAUDE.md` (sugestão: rotas e UI
em pt-BR, código e comentários em inglês, ou tudo em pt-BR — o que importa é
escolher).
**Risco:** nenhum.

---

## Não se aplica — Bloco C

| Subitem | Situação | Justificativa |
|---|---|---|
| Arquivos sensíveis versionados (seção 6) | **Não se aplica** | `.gitignore` cobre `.env*`, `*.pem`, `/.vercel`. `git ls-files` não retorna nenhum arquivo de credencial. `.env.example` contém apenas placeholders vazios |
| Configurações divergentes entre ambientes (seção 6) | **Não se aplica** | Não existem arquivos de configuração por ambiente (`config.dev.*`, `config.prod.*`). A diferenciação é feita por `NODE_ENV` em 6 pontos, todos coerentes |
| Duplicação de bibliotecas com mesma função (seção 7) | **Não se aplica** | Nenhuma. `clsx` + `tailwind-merge` são complementares (combinados em `lib/utils.ts` via `cn`); `framer-motion` é a única de animação; `zod` a única de validação |
| TODOs/FIXMEs esquecidos (seção 8) | **Não se aplica** | `grep -rn "TODO\|FIXME\|XXX\|HACK" src/` → zero ocorrências. Os dois `TODO` que existiam em `api/leads/route.ts` foram removidos na sessão anterior |
| `console.log` de debug (seção 8) | **Não se aplica** | Nenhum `console.log` no código da aplicação. Os `console.log` restantes estão em `src/scripts/*` (saída legítima de CLI de seed) e `console.error` dentro de `logError` (`lib/prisma-errors.ts:22`), que é intencional |

---

## Autocheck — BLOCO C

### Seção 6 — Configuração e ambiente

| Subitem | Verificado | Onde |
|---|---|---|
| Env usadas no código × documentadas | ✅ | #38 — comparação item a item entre `sed` sobre `.env.example` (24 vars) e `grep` de `process.env.*` no código (18 vars + 2 lidas via `process.env[name]` em `requireEnv`) |
| Valores hardcoded que deveriam ser configuráveis | ✅ | #39 (e-mails). `COMPANY` (CNPJ, telefone, endereço) é constante de marca, aceitável. `ECOSYSTEM` e `SITE_URL` já têm override por env |
| Configurações divergentes entre ambientes | ✅ | Não se aplica (tabela acima) |
| Arquivos sensíveis versionados | ✅ | Não se aplica (tabela acima) |

**Achados:** #36, #38, #39, #40.

### Seção 7 — Dependências

| Subitem | Verificado | Onde |
|---|---|---|
| Declaradas e nunca usadas | ✅ | #44 — verificação de import por pacote sobre `dependencies` |
| Usadas e não declaradas | ✅ | Nenhuma. `pnpm build` e `pnpm typecheck` resolvem todos os imports; `uploadthing` está documentado no `.env` mas **não é importado** (logo não é dependência faltando, é config órfã — #38) |
| Versões com vulnerabilidades conhecidas | ✅ | #33, #34, #37 — `pnpm audit` completo: 26 advisories (3 críticos, 13 altos, 9 moderados, 1 baixo) |
| Versões muito desatualizadas | ✅ | `next-auth` em beta (#33); `prisma`/`@prisma/client` 5.22 com 7.9.1 disponível (major atrás — registrado como contexto de #33, não como achado próprio: v5 é estável e suportada) |
| Duplicação de bibliotecas | ✅ | Não se aplica (tabela acima) |

**Achados:** #33, #34, #37, #44.

### Seção 8 — Qualidade e consistência

| Subitem | Verificado | Onde |
|---|---|---|
| Código morto (funções, componentes, arquivos, rotas) | ✅ | #43 — 14 exports varridos um a um; #35 (`MobileSidebar`); #9/#5 (models órfãos, Bloco A) |
| Duplicação de lógica | ✅ | #41 (status em 5 arquivos), #15 (validação do catálogo divergindo do zod), #43 (`DEFAULT_LOCALE`, `APPLICATIONS` reescritos à mão) |
| Padrões inconsistentes de tratamento de erro | ✅ | #42 — três estratégias entre os 5 módulos de action |
| Nomenclatura / estrutura de pastas | ✅ | #45. Estrutura de pastas é consistente (`(marketing)`, `(panel)`, `(dashboard)` como route groups; `components/` segmentado por domínio) |
| TODOs/FIXMEs | ✅ | Não se aplica (tabela acima) |
| console.log de debug | ✅ | Não se aplica (tabela acima) |

**Achados:** #35, #41, #42, #43, #45.

---

# BLOCO D — Seções 9 (frontend), 10 (performance) e 11 (testes e build)

## 🟠 ALTO

### #46 — Link de edição de usuário aponta para rota inexistente (404)

> **STATUS: CORRIGIDO.**

**Arquivo:** `src/app/admin/(panel)/usuarios/page.tsx:113-119`

```tsx
<Button variant="ghost" size="icon" asChild>
  <Link href={`/admin/usuarios/${user.id}`}>
    <Pencil className="size-4" />
    <span className="sr-only">Editar</span>
  </Link>
</Button>
```

A rota `/admin/usuarios/[id]` **não existe**. Confirmado por inventário completo
de `page.tsx` sob `src/app`: em `admin/usuarios/` existem apenas `page.tsx` e
`novo/page.tsx`. Clicar no lápis de qualquer linha da tabela leva ao 404
(`src/app/not-found.tsx`).

**Consequência em cadeia:** a action `resetPassword`
(`usuarios/actions.ts:97-131`) é a única forma de redefinir a senha de um usuário
e **não é chamada de lugar nenhum** — a tela que a consumiria é justamente esta.
Não existe fluxo de "esqueci minha senha" no site. Portanto: **hoje não há
nenhuma forma, pela interface, de recuperar o acesso de um usuário que perdeu a
senha.**

**Correção proposta:** criar `admin/usuarios/[id]/page.tsx` com edição de dados,
troca de papel e redefinição de senha (consumindo `resetPassword`); ou remover o
botão até a tela existir.
**Risco:** baixo para remover o botão; médio para construir a tela (é
funcionalidade nova, com implicações de segurança — deve exigir `requireAdmin`).

---

### #47 — `exportLeadsCsv` carrega a tabela inteira sem limite

> **STATUS: CORRIGIDO.**

**Arquivo:** `src/app/admin/(panel)/leads/actions.ts:184-187`

```ts
const leads = await db.lead.findMany({
  where: buildWhere(params),
  orderBy: { createdAt: "desc" },
});         // sem take, sem cursor
```

Todos os leads que casam com o filtro são carregados em memória, mapeados para
strings e concatenados em uma única string retornada pela Server Action. Sem
filtro aplicado, é a tabela inteira.

Três limites são atingidos conforme a base cresce, todos em produção serverless:
memória do processo, tempo máximo de execução da função, e o tamanho da resposta
da Server Action (que é serializada por inteiro).

Como `getLeads` já foi limitado a `MAX_PER_PAGE = 100` (linha 11), o export é
hoje o único caminho para extrair a base completa — e é o que vai quebrar
primeiro.

**Correção proposta:** paginar internamente com cursor e emitir via
`ReadableStream` em uma Route Handler (`GET /api/admin/leads/export`) com
`Content-Disposition: attachment`, em vez de Server Action.
**Risco:** médio — muda o mecanismo de download no `export-leads-button.tsx`.

---

### #48 — Nenhum teste automatizado em todo o projeto

> **STATUS: CORRIGIDO.**

**Evidência:** `find` por `*.test.*`, `*.spec.*`, `vitest.config.*`,
`jest.config.*`, `playwright.config.*` → **zero resultados**. `package.json`
não tem script `test` nem dependência de teste.

Módulos críticos sem cobertura:

| Módulo | Por que importa |
|---|---|
| `lib/auth-guard.ts` | Único ponto de autorização de todo o sistema (24 actions) |
| `lib/validators/lead.ts` + `api/leads/route.ts` | Captação de leads — a função de negócio do site. **Três dos quatro formulários estão quebrados hoje (#1, #2) e nenhum teste acusaria isso** |
| `lib/validators/admin.ts` | Validação de todo o CMS |
| `leads/actions.ts::csvCell` | Escape de CSV — função pura, trivial de testar, com implicação de segurança |
| `calculadora/page.tsx::calculateRecommendation` | Regra de negócio pura (densidade × volume → modelo). Recomenda equipamento de centenas de milhares de reais |
| `lib/rate-limit.ts::getClientIp` | Função pura, decide a chave de rate limit |

O ponto mais forte: os itens #1 e #2 são exatamente o tipo de defeito que um
único teste de integração da rota `/api/leads` por formulário teria pego no
primeiro dia.

**Correção proposta:** Vitest para as funções puras acima (custo baixo, retorno
alto) e um teste de integração por formulário contra `leadRequestSchema`.
**Risco:** nenhum — código novo, não altera produção.

---

## 🟡 MÉDIO

### #49 — Links de categoria do rodapé são inertes e geram conteúdo duplicado

> **STATUS: CORRIGIDO.**

**Arquivos:** `src/components/shared/footer.tsx:7-14` ×
`src/app/[locale]/(marketing)/produtos/page.tsx:27`

```tsx
const PRODUCT_LINKS = [
  { label: "Tombador fixo",         href: "/produtos?cat=TOMBADOR_FIXO" },
  { label: "Tombador móvel",        href: "/produtos?cat=TOMBADOR_MOVEL" },
  { label: "Coletor de amostras",   href: "/produtos?cat=COLETOR_AMOSTRAS" },
  { label: "Unidade de transbordo", href: "/produtos?cat=UNIDADE_TRANSBORDO" },
  ...
```

`ProdutosPage` é declarada como `export default function ProdutosPage()` — **sem
parâmetro `searchParams`**. O `?cat=` é ignorado por completo: as quatro URLs
renderizam a página inteira, com todas as categorias.

Duplo impacto:
1. **UX:** o usuário clica em "Tombador móvel" e recebe a listagem completa, sem
   filtro nem rolagem para a seção.
2. **SEO:** quatro URLs distintas servem conteúdo idêntico. O `canonical` gerado
   por `generatePageMetadata` (`lib/seo.ts:21`) ignora a query string, então
   todas se autodeclaram `/{locale}/produtos` — o que evita indexação duplicada,
   mas desperdiça quatro oportunidades de página de categoria com intenção de
   busca própria (ver Bloco E).

**Correção proposta:** criar rotas reais `/produtos/categoria/[slug]` com
conteúdo e metadata próprios (ganho de SEO), ou fazer a página ler `searchParams`
e filtrar (ganho de UX apenas).
**Risco:** baixo.

---

### #50 — Cinco listagens do admin sem paginação

> **STATUS: CORRIGIDO.**

**Arquivos:**

| Local | Query | Limite |
|---|---|---|
| `admin/(panel)/blog/actions.ts:46` | `db.post.findMany` | nenhum |
| `admin/(panel)/obras/actions.ts:53` | `db.case.findMany` | nenhum |
| `admin/(panel)/produtos/actions.ts:50` | `db.product.findMany` | nenhum |
| `admin/(panel)/usuarios/page.tsx:42` | `db.user.findMany` | nenhum |
| `portal/(dashboard)/equipamentos/page.tsx:31` | `db.clientEquipment.findMany` | nenhum |

`leads` (paginado, `take: safePerPage`), `media` (`take: 50`) e o dashboard
(`take: 10`) estão corretos.

Volume esperado é modesto (produtos, obras, artigos e usuários são dezenas), mas
`usuarios` e `clientEquipment` crescem com a base de clientes e a listagem de
usuários carrega o registro **inteiro**, incluindo `passwordHash`, para o
servidor renderizar 5 colunas.

**Correção proposta:** `select` explícito em `usuarios/page.tsx` (não trazer
`passwordHash`) e paginação nas cinco.
**Risco:** baixo.

---

### #51 — Cinco `<img>` nativos sem otimização nem dimensões declaradas

> **STATUS: CORRIGIDO.**

**Arquivos (confirmados por `pnpm lint`, regra `@next/next/no-img-element`):**

| Arquivo:linha | Imagem |
|---|---|
| `src/components/shared/header.tsx:63` | `logo-pili-white.png`, `className="h-14 w-auto"` |
| `src/app/portal/login/page.tsx:46` | `logo-pili.png`, `className="mb-4 h-16 w-auto"` |
| `src/app/not-found.tsx:26` | logo |
| `src/components/marketing/product-card.tsx:53` | imagem de produto |
| `src/app/admin/(panel)/media/page.tsx:94` | miniatura da biblioteca |

Nenhum declara `width`/`height`. Sem dimensões intrínsecas, o navegador não
reserva espaço → **layout shift (CLS)** enquanto a imagem carrega. O header é o
caso mais sensível: aparece em todas as 22 páginas públicas, acima da dobra.

O rodapé (`footer.tsx:32-38`) usa `next/image` com `width`/`height` corretos —
prova de que o padrão do projeto é `next/image` e estes cinco são exceções.

**Contexto:** o commit `af86ae1` ("logo com img nativo") indica que a troca do
header foi **deliberada**, provavelmente para contornar algum problema de
renderização. A correção precisa entender esse motivo antes de reverter.

**Correção proposta:** voltar para `next/image` com `width`/`height` explícitos e
`priority` no logo do header; ou manter `<img>` adicionando `width`/`height` e
`fetchpriority="high"`.
**Risco:** baixo, mas verificar o motivo original da troca.

---

### #52 — Validações do lado do cliente que falham em silêncio

> **STATUS: CORRIGIDO.**

**Arquivo:** `src/app/[locale]/(marketing)/calculadora/page.tsx:105, 114`

```ts
function handleCalculate(e) {
  const trucks = parseInt(trucksPerDay, 10);
  if (!trucks || trucks <= 0) return;        // sem feedback
  ...
}

async function handleUnlock(e) {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;   // sem feedback
  ...
}
```

Em ambos os casos o formulário é submetido, nada acontece na tela e nenhuma
mensagem aparece. O campo de e-mail (linha 303-309) não tem `required` nem
exibição de erro — só o `type="email"` do HTML, que o `onSubmit` do React
contorna quando o campo está vazio? Não: `type="email"` vazio com `required`
ausente **passa** na validação nativa, então o `return` silencioso é atingido.

Esta página não usa react-hook-form nem zod, contrariando `CLAUDE.md`
(mesma causa de #15).

**Nota de verificação:** o estado `gateStatus` **não** fica preso em `"loading"`
após o sucesso — `setUnlocked(true)` troca todo o bloco do gate pela versão
desbloqueada (linhas 269-326), então o valor obsoleto nunca é renderizado. Isso
foi checado e **não** é defeito.

**Correção proposta:** migrar para react-hook-form + zod com exibição de erro.
**Risco:** nenhum.

---

## 🔵 BAIXO

### #53 — `setTimeout` sem limpeza em handler do chat

> **STATUS: CORRIGIDO.**

**Arquivo:** `src/components/shared/pili-robo.tsx:127-129`

```ts
setTimeout(() => {
  setMessages((prev) => [...prev, { text: AUTO_REPLY, from: "bot" }]);
}, 1000);
```

Único timer do projeto sem `clearTimeout`. Se o usuário fechar o chat e navegar
para outra rota dentro de 1 segundo, o `setState` roda sobre um componente
desmontado.

**Impacto real é nulo** no React 19 (o aviso de "setState em componente
desmontado" foi removido e a operação é descartada). Registrado por completude.

Os demais 5 efeitos com timer/listener do projeto têm cleanup correto:
`animated-counter.tsx:24, 45`; `header.tsx:38`; `pili-robo.tsx:81, 93`;
`cookie-banner.tsx:13`.

**Correção proposta:** guardar o id e limpar no unmount.
**Risco:** nenhum.

---

### #54 — Chaves de lista por índice em 14 pontos

> **STATUS: CORRIGIDO.**

**Arquivos:** `blog/[slug]/page.tsx:139`; `certificacoes/page.tsx:105`;
`ecossistema/[projeto]/page.tsx:390`; `empresa/page.tsx:120`;
`obras/[slug]/page.tsx:115`; `politica-ambiental/page.tsx:114`;
`politica-privacidade/page.tsx:75, 101, 126, 148, 193`; `termos/page.tsx:97`;
`trabalhe-conosco/page.tsx:129`; `pili-robo.tsx:205`

Todas as ocorrências iteram **arrays estáticos que nunca são reordenados,
filtrados ou removidos** (parágrafos de texto legal, itens de certificação,
mensagens do chat em ordem de chegada). Nessas condições, `key={i}` é
tecnicamente correto e não causa bug de reconciliação.

Registrado como dívida de padrão, não como defeito: se algum desses arrays passar
a ser dinâmico (por exemplo, conteúdo vindo do banco após #18), as chaves viram
fonte de bug silencioso.

**Correção proposta:** usar um campo estável quando disponível.
**Risco:** nenhum.

---

### #55 — Build emite aviso de múltiplos lockfiles

> **STATUS: CORRIGIDO.**

**Evidência:** saída de `pnpm build`

```
⚠ Warning: Next.js inferred your workspace root, but it may not be correct.
 We detected multiple lockfiles and selected the directory of
 C:\Users\Daniel Anders\package-lock.json as the root directory.
 Detected additional lockfiles:
   * C:\Users\Daniel Anders\dev\pili-site\pnpm-workspace.yaml
```

Existe um `package-lock.json` órfão no diretório home do usuário
(`C:\Users\Daniel Anders\`), acima do projeto. O Next.js o elege como raiz do
workspace, o que pode afetar a resolução de módulos e o tracing de arquivos no
build de produção (`outputFileTracingRoot`).

Não afeta o build atual (que completa com sucesso), mas é fonte conhecida de
falhas de deploy difíceis de diagnosticar.

**Correção proposta:** definir `turbopack.root` (ou `outputFileTracingRoot`) em
`next.config.ts` apontando para o diretório do projeto. O `package-lock.json` do
home é externo ao repositório e deve ser removido pelo usuário.
**Risco:** nenhum.

---

## Não se aplica — Bloco D

| Subitem | Situação | Justificativa |
|---|---|---|
| Memory leaks (seção 9) | **Não se aplica** | Verificados os 6 pontos com listener/timer do projeto. Cinco têm cleanup correto; o sexto (#53) não tem impacto no React 19. Nenhum `IntersectionObserver`, `requestAnimationFrame` ou subscription manual sem cleanup |
| Chamadas de API redundantes ou em loop (seção 10) | **Não se aplica** | Existem 4 chamadas HTTP no projeto inteiro, todas disparadas por submit de formulário. Nenhuma em `useEffect`, nenhuma em loop, nenhuma polling. A única redundância que existia (`fetch("/api/auth/session")` após login) foi removida na sessão anterior |
| Ausência de cache onde óbvio (seção 10) | **Parcialmente aplicável** | Coberto por #20 (Bloco A): todas as 22 rotas públicas renderizam sob demanda apesar de servirem conteúdo estático. Não há uso de `unstable_cache`, `revalidate` ou `generateStaticParams` nas rotas dinâmicas |
| Operações bloqueantes em fluxos críticos (seção 10) | **Não se aplica** | `bcrypt.hashSync` (síncrono, bloqueia o event loop) permanece apenas nos scripts de seed (`seed-admin.ts:37`, `seed-all.ts`), que são CLI. O caminho de autenticação usa `compare` assíncrono (`auth.ts:44`) e a criação de usuário usa `hash` assíncrono (`usuarios/actions.ts:73`) — ambos corrigidos na sessão anterior |
| Testes quebrados ou desativados (seção 11) | **Não se aplica** | Não existe nenhum teste para estar quebrado — ver #48 |
| Scripts quebrados (seção 11) | **Não se aplica** | Os 9 scripts do `package.json` foram exercitados: `typecheck` ✅, `lint` ✅ (0 erros, 5 avisos), `build` ✅. Os `db:*` dependem de `DATABASE_URL` e não foram executados por decisão de não tocar em banco durante a auditoria |

---

## Autocheck — BLOCO D

### Seção 9 — Frontend específico

| Subitem | Verificado | Onde |
|---|---|---|
| Estados de loading/erro em chamadas de API | ✅ | 4 formulários inspecionados. `lead-form.tsx:32` tem os 4 estados; `catalogo:23-25` e `trabalhe-conosco:36-38` têm loading/erro/sucesso; `calculadora:98-100` tem loading/erro mas com validação silenciosa (#52) |
| Memory leaks | ✅ | Não se aplica / #53 (tabela acima) |
| Formulários sem validação ou divergente do backend | ✅ | #52 (calculadora sem zod), #15 (catálogo sem zod), #22 (senha: min 6 × min 10) |
| Renderizações com dados possivelmente nulos | ✅ | #31 (utm, Bloco B). Demais usam `??`/optional chaining. `result?.model` em `calculadora:128` correto |
| Chaves de lista instáveis | ✅ | #54 — 14 ocorrências, todas sobre arrays estáticos |
| Rotas de navegação quebradas | ✅ | **#46** (`/admin/usuarios/[id]`). Validação cruzada de 26 hrefs literais + 24 hrefs dinâmicos contra o inventário de 43 `page.tsx`. Único link quebrado do projeto, além do PDF de #3 |

**Achados:** #46, #49, #52, #53, #54.

### Seção 10 — Performance

| Subitem | Verificado | Onde |
|---|---|---|
| Queries pesadas sem paginação | ✅ | **#47** (export sem limite), **#50** (5 listagens) |
| Dados demais por requisição | ✅ | #50 — `usuarios/page.tsx:42` traz o `User` inteiro, incluindo `passwordHash`, para renderizar 5 colunas |
| Chamadas de API redundantes / em loop | ✅ | Não se aplica (tabela acima) |
| Ausência de cache | ✅ | #20 (Bloco A) |
| Operações bloqueantes | ✅ | Não se aplica (tabela acima) |
| Peso de imagem / CWV | ✅ | #51 — 5 `<img>` sem dimensões. Aprofundado no Bloco E |

**Achados:** #47, #50, #51.

### Seção 11 — Testes e build

| Subitem | Verificado | Onde |
|---|---|---|
| Cobertura × módulos críticos | ✅ | **#48** — zero testes; 6 módulos críticos mapeados sem cobertura |
| Testes quebrados/desativados | ✅ | Não se aplica (tabela acima) |
| Warnings/erros no build | ✅ | #55 (lockfiles), #19 (middleware deprecado, Bloco A). `pnpm build` completa com sucesso: 203 páginas geradas |
| Scripts quebrados | ✅ | Não se aplica (tabela acima) |

**Achados:** #48, #55.

---

# BLOCO E — Seções 12 (URLs amigáveis) e 13 (SEO on-page e tração orgânica)

> **Método.** Este bloco não foi deduzido do código: o build de produção foi
> executado e servido (`pnpm start`, porta 3111) e o **HTML realmente entregue**
> foi inspecionado com `curl` em 9 rotas. Todos os achados abaixo têm evidência
> do documento servido.

---

## 🔴 CRÍTICO

### #56 — `canonical` das versões `en` e `es` aponta para `pt-BR`: os dois idiomas estão desindexados

> **STATUS: CORRIGIDO.**

**Arquivo:** `src/lib/seo.ts:18, 21, 28`

```ts
locale = "pt-BR",              // default do parâmetro
...
const url = `${SITE_URL}/${locale}${path}`;
alternates: { canonical: url, ... }
```

**Nenhuma das 18 páginas que chamam `generatePageMetadata` passa `locale`.**
Verificado por grep: todas as chamadas usam apenas `title`, `description` e
`path`. O default `"pt-BR"` prevalece sempre.

**Evidência do HTML servido:**

```
GET /en/produtos
<link rel="canonical" href="https://pili.ind.br/pt-BR/produtos"/>
<meta property="og:url" content="https://pili.ind.br/pt-BR/produtos"/>
```

A página em inglês declara a página em português como sua versão canônica. Isso é
uma instrução explícita ao Google para **não indexar** `/en/*` nem `/es/*` e
consolidar toda a autoridade em `/pt-BR/*`.

**Impacto na tração orgânica:** o site foi construído para 3 mercados
(`LOCALES` em `constants.ts:32`, 3 arquivos de mensagens, `hreflang` correto no
sitemap e nas alternates). Dois terços dessa estrutura estão anulados por um
parâmetro default. As tags `hreflang` corretas coexistem com o canonical errado —
sinais contraditórios, e o Google prioriza o canonical.

**Correção proposta:** propagar o `locale` recebido em `params` para
`generatePageMetadata` nas 18 páginas.
**Risco:** baixo tecnicamente. Após a correção, `/en` e `/es` entram no índice —
é preciso garantir que o **conteúdo** esteja de fato traduzido, o que hoje não
acontece (#6): a UI é traduzida mas produtos, obras e blog vêm de
`lib/data/*.ts` em português. Corrigir o canonical sem resolver #6 faz o Google
indexar páginas em inglês com corpo em português.

---

### #57 — `<html>` não declara `lang`

> **STATUS: CORRIGIDO.**

> **Severidade revisada na Revisão (H.2): CRÍTICO → ALTO.**

**Arquivo:** `src/app/layout.tsx:33-36`

```tsx
<html
  suppressHydrationWarning
  className={`${montserrat.variable} ${jetbrainsMono.variable}`}
>
```

**Evidência do HTML servido** (busca por `lang="` em todo o documento de
`/pt-BR/produtos/tombador-10m-fixo`): **zero ocorrências**.

Consequências:
- **Acessibilidade (seção 15):** leitores de tela não sabem qual idioma
  pronunciar; conteúdo em português é lido com fonética de inglês. É falha de
  WCAG 2.1 nível A (critério 3.1.1 — *Language of Page*).
- **SEO:** o Google usa `lang` como sinal de idioma junto com `hreflang`. Num
  site trilíngue, a ausência agrava #56.
- **Navegador:** hifenização e correção ortográfica em campos de formulário ficam
  sem idioma.

**Causa estrutural:** o `<html>` está no root layout (`src/app/layout.tsx`), que
fica **acima** do segmento `[locale]` — não tem acesso ao locale da requisição.

**Correção proposta:** mover o `<html>`/`<body>` para `src/app/[locale]/layout.tsx`
(que já recebe `locale`), ou usar um root layout que leia o locale via
`headers()`. As rotas `/admin` e `/portal` (fora de `[locale]`) precisam de um
layout próprio com `lang="pt-BR"`.
**Risco:** MÉDIO — reestruturar layouts raiz afeta todas as rotas, incluindo
admin e portal, que hoje herdam o `<html>` do root.

---

## 🟠 ALTO

### #58 — Sufixo de marca duplicado no `<title>` de 18 páginas

> **STATUS: CORRIGIDO.**

**Arquivos:** `src/app/layout.tsx:19-22` × `src/lib/seo.ts:24`

```ts
// layout.tsx — template do root
title: { default: "PILI Industrial — Tombadores Hidráulicos",
         template: "%s | PILI Industrial" }

// seo.ts:24 — o helper JÁ concatena a marca
title: `${title} | ${SITE_NAME}`,
```

O template do layout pai é aplicado sobre a string que o helper já sufixou.

**Evidência do HTML servido:**

```
/pt-BR/produtos              <title>Produtos | PILI Industrial | PILI Industrial</title>
/pt-BR/produtos/tombador-10m-fixo
                             <title>Tombador 10 Metros Fixo | PILI Industrial | PILI Industrial</title>
/pt-BR/obras/cargill-paranagua
   <title>Descarga de alta performance no Porto de Paranaguá | PILI Industrial | PILI Industrial</title>
```

**Impacto na tração orgânica:** o Google trunca títulos em ~580px (≈60
caracteres). "` | PILI Industrial`" desperdiçado consome 18 caracteres. No
exemplo da obra, o título tem 88 caracteres — o SERP mostrará
*"Descarga de alta performance no Porto de Paranaguá | PILI…"* e a repetição
aparece como descuido. Perda direta de CTR em **todas as 18 páginas** que usam o
helper.

**Correção proposta:** remover a concatenação em `seo.ts:24` (deixar só
`title: title`) e deixar o `template` do root layout fazer o trabalho.
**Risco:** nenhum. Correção de uma linha.

---

### #59 — Homepage e 3 páginas sem metadata própria (sem canonical, OG ou hreflang)

> **STATUS: CORRIGIDO.**

**Arquivos sem `generateMetadata` nem `export const metadata`:**
`src/app/[locale]/(marketing)/page.tsx` (**homepage**),
`calculadora/page.tsx`, `catalogo/page.tsx`, `trabalhe-conosco/page.tsx`

**Evidência do HTML servido em `/pt-BR` (a página mais importante do site):**

```
<title>PILI Industrial — Tombadores Hidráulicos</title>     ← default do root layout
<meta name="description" content="Fabricante de tombadores hidráulicos...">  ← default
canonical: (ausente)
og:*:      (ausente)
hreflang:  (ausente)
```

A homepage não tem: canonical próprio, nenhuma tag Open Graph, nenhum
`hreflang`, nenhum Twitter Card. Compartilhar `pili.ind.br` no WhatsApp,
LinkedIn ou Slack não gera cartão de preview.

`/pt-BR/calculadora` e `/pt-BR/catalogo` são **páginas de captação de lead** —
justamente as que mais se beneficiariam de título e descrição otimizados para
busca ("calculadora de tombador", "catálogo tombador hidráulico PDF").

**Correção proposta:** adicionar `generateMetadata` nas quatro, com título e
descrição próprios.
**Risco:** nenhum.

---

### #60 — `sitemap.xml` não contém nenhuma página de conteúdo

> **STATUS: CORRIGIDO.**

**Arquivo:** `src/app/sitemap.ts:5-22`

O array `staticRoutes` lista 16 rotas fixas. Não há geração dinâmica.

**Evidência do sitemap servido:** 48 `<loc>` (16 rotas × 3 locales).
`grep -c "produtos/\|obras/\|blog/"` → **0**.

Páginas de detalhe existentes e **ausentes do sitemap**:

| Tipo | Itens | URLs faltando (× 3 locales) |
|---|---|---|
| Produtos (`lib/data/products.ts`) | 18 | 54 |
| Obras (`lib/data/cases.ts`) | 8 | 24 |
| Artigos (`lib/data/blog.ts`) | 8 | 24 |
| Ecossistema (`lib/data/ecosystem.ts`) | 4 | 12 |
| Soluções por setor | 5 | 15 |
| **Total** | **43** | **129 URLs** |

**Impacto na tração orgânica:** as 129 URLs ausentes são exatamente as que têm
intenção de busca específica ("tombador 30 metros", "descarga de grãos porto
Paranaguá"). As 48 que estão no sitemap são institucionais e de baixa cauda
longa. O sitemap atual comunica ao Google que o site tem 48 páginas, quando tem
177.

As páginas ainda podem ser descobertas por links internos — mas a descoberta é
mais lenta, e mudanças de conteúdo não são sinalizadas por `lastModified`
(que hoje é `new Date()` em todas, ou seja, sempre "modificado agora" —
sinal ruidoso que o Google aprende a ignorar).

**Correção proposta:** gerar as entradas a partir de `lib/data/*` (ou do banco,
após #18), com `lastModified` real por item.
**Risco:** baixo.

---

### #61 — `og:image` aponta para arquivo inexistente em todas as páginas

> **STATUS: CORRIGIDO.**

**Arquivo:** `src/lib/seo.ts:17` — `image = "/images/og-default.jpg"`

**Evidência do HTML servido:**
```
<meta property="og:image" content="https://pili.ind.br/images/og-default.jpg"/>
<meta property="og:image:width" content="1200"/>
<meta property="og:image:height" content="630"/>
```

`public/images/og-default.jpg` **não existe**. Inventário completo de `public/`
(16 arquivos): `hero-tombador.svg`, `logo-pili.png`, `logo-pili-white.png`,
`tombador-pili.jpg`, 6 placeholders em `tombadores/`, e 5 SVGs da base do
Next.js. Nenhum `og-default.jpg`.

Nenhuma página sobrescreve o parâmetro `image` — verificado nas 18 chamadas.

**Impacto:** todo compartilhamento em WhatsApp, LinkedIn, Facebook, X e Slack
mostra cartão sem imagem. Em canais B2B (LinkedIn e WhatsApp são os principais
para agro/industrial), o cartão sem imagem reduz drasticamente o clique.

**Correção proposta:** criar `public/images/og-default.jpg` (1200×630) e, nas
páginas de produto e obra, passar a imagem real do item.
**Risco:** nenhum.

---

### #62 — Todas as 22 rotas públicas renderizam sob demanda apesar de terem conteúdo estático

> **STATUS: CORRIGIDO.**

**Arquivos:** `src/app/[locale]/layout.tsx:25` (único `setRequestLocale` do
projeto) × as 22 páginas de `(marketing)`

**Evidência:** saída de `pnpm build` — todas as rotas `[locale]/*` marcadas
`ƒ (Dynamic) server-rendered on demand`.

**Causa raiz identificada:** o next-intl exige `setRequestLocale(locale)` em
**cada página e layout** que deva ser renderizado estaticamente. Verificado por
grep: `setRequestLocale` aparece em **um único lugar**, `[locale]/layout.tsx:25`.
Nenhuma das 22 páginas o chama, então todas optam por renderização dinâmica.

Isso apesar de o projeto já ter feito o resto do trabalho: `generateStaticParams`
existe em 5 rotas dinâmicas (`produtos/[slug]`, `obras/[slug]`, `blog/[slug]`,
`solucoes/[setor]`, `ecossistema/[projeto]`) e no layout de locale.

**Impacto em Core Web Vitals:** cada visita paga renderização no servidor em vez
de servir HTML de CDN. Afeta TTFB e, por consequência, LCP — que é fator de
ranking. O conteúdo é 100% estático (arquivos `.ts`), então não há nenhum motivo
funcional para ser dinâmico.

**Correção proposta:** chamar `setRequestLocale(locale)` no topo de cada página
de `(marketing)`; as duas que usam `useTranslations` (`page.tsx` e
`produtos/page.tsx`) precisam receber `params` para isso.
**Risco:** baixo. Verificar que nenhuma página passe a servir conteúdo obsoleto —
como tudo vem de arquivo estático, o rebuild resolve.

---

## 🟡 MÉDIO

### #63 — Artigos do blog sem schema `Article`/`BlogPosting`

> **STATUS: CORRIGIDO.**

**Arquivo:** `src/app/[locale]/(marketing)/blog/[slug]/page.tsx:65-77`

**Evidência do HTML servido** em `/pt-BR/blog/pili-industrial-agrishow-2025` —
tipos de JSON-LD presentes: `BreadcrumbList`, `ListItem`. **Só isso.**

Falta `Article` (ou `BlogPosting`) com `headline`, `datePublished`,
`dateModified`, `author` e `image`. `lib/seo.ts` não tem helper para isso —
existem apenas `generateProductJsonLd` e `generateBreadcrumbJsonLd`.

**Ganho esperado:** elegibilidade a rich results de artigo (data de publicação e
miniatura no SERP) e ao Google Discover, que é canal relevante para conteúdo
técnico do agronegócio. Os 8 artigos existentes já têm autor e data em
`lib/data/blog.ts` — os dados estão lá, só não são emitidos.

**Correção proposta:** adicionar `generateArticleJsonLd` em `lib/seo.ts` e emitir
na página do artigo.
**Risco:** nenhum.

---

### #64 — Schema `Organization` nunca é emitido no site

> **STATUS: CORRIGIDO.**

**Arquivo:** `src/lib/seo.ts:54-77`

`generateOrganizationJsonLd()` está implementada (com `legalName`, `foundingDate`,
`address`, `contactPoint`, `taxID`/CNPJ) e **nunca é chamada** — confirmado por
grep e listado em #43 como export morto.

**Evidência:** o `"@type":"Organization"` que aparece no HTML da página de produto
vem do campo `manufacturer` **dentro** do schema `Product`
(`seo.ts:98-101`), não de um nó `Organization` de nível superior. A homepage e
todas as demais páginas não têm nenhum.

Dois problemas adicionais na função, caso venha a ser usada:
- `logo: ${SITE_URL}/images/logo.svg` — **arquivo não existe** (o logo real é
  `logo-pili.png`). Mesmo tipo de erro de #61.
- Faltam `sameAs` com os perfis sociais, que já existem em `constants.ts:25-30`
  (`SOCIAL`) — é o campo que alimenta o Knowledge Panel.

**Ganho esperado:** Knowledge Panel da marca, vínculo entre o site e os perfis
sociais, e o CNPJ como sinal de entidade brasileira.

**Correção proposta:** emitir no root layout (ou no layout de marketing),
corrigir o caminho do logo e adicionar `sameAs: Object.values(SOCIAL)`.
**Risco:** nenhum.

---

### #65 — Breadcrumbs existem só como JSON-LD, sem versão visível na página

> **STATUS: CORRIGIDO.**

**Arquivos:** `produtos/[slug]/page.tsx:46-53`; `obras/[slug]/page.tsx:40-47`;
`blog/[slug]/page.tsx:65-72`; `solucoes/[setor]/page.tsx:122-129`

**Evidência do HTML servido** em `/pt-BR/produtos/tombador-10m-fixo`:
`<ol>` → 0 ocorrências; `<nav aria-label="...">` → nenhuma.

O `BreadcrumbList` é declarado corretamente no JSON-LD, mas não há trilha visível.
A orientação do Google é que o marcador de breadcrumb reflita uma navegação
presente na página; a divergência reduz a confiança no marcador e pode fazer o
rich result não ser exibido.

Perde-se também o benefício de UX e de linkagem interna: uma trilha
`Produtos › Tombadores fixos › Tombador 10m` distribui autoridade para as páginas
intermediárias (relacionado a #49, que aponta a ausência de páginas de categoria).

**Correção proposta:** componente `<Breadcrumbs>` renderizando `<nav
aria-label="Breadcrumb"><ol>…` alimentado pelos mesmos dados do JSON-LD.
**Risco:** nenhum.

---

### #66 — Três páginas públicas sem nenhum link interno (órfãs)

> **STATUS: CORRIGIDO.**

**Verificado** por busca de cada rota em `src/app` e `src/components`,
descontando a própria página:

| Página | Links internos apontando para ela | Está no sitemap? |
|---|---|---|
| `/certificacoes` | **0** | sim |
| `/trabalhe-conosco` | **0** | sim |
| `/politica-ambiental` | **0** | sim |

Nenhuma das três aparece no `NAV_ITEMS` do header (`header.tsx:12-19`) nem no
rodapé (`footer.tsx` — que linka apenas `/produtos?cat=*`, `/produtos/comparar`,
`/catalogo`, `/ecossistema`, `/politica-privacidade`, `/termos`).

Páginas alcançáveis apenas pelo sitemap recebem rastreamento e autoridade
mínimos. `/certificacoes` é conteúdo de confiança (ISO, laudos) com valor
comercial direto no B2B industrial; `/trabalhe-conosco` tem intenção de busca
própria ("trabalhe conosco PILI").

Para contraste, `/orcamento` está linkada em 12 arquivos — o padrão correto.

**Correção proposta:** incluir `/certificacoes` no menu (ou em "Empresa") e
`/trabalhe-conosco` + `/politica-ambiental` no rodapé.
**Risco:** nenhum.

---

### #67 — Fuso horário do next-intl não é declarado; herda o do servidor

> **STATUS: CORRIGIDO.**

**Arquivo:** `src/i18n/request.ts:11-14`

```ts
return {
  locale,
  messages: (await import(`../messages/${locale}.json`)).default,
};      // sem timeZone
```

**Evidência do HTML servido:** o payload RSC contém
`"timeZone":"America/Sao_Paulo"` — valor herdado do fuso da **máquina de
desenvolvimento**. Em produção (Vercel, UTC) o mesmo código produzirá
`"timeZone":"UTC"`.

Isso significa que qualquer formatação de data feita pelo next-intl muda de
comportamento entre ambientes, e o desenvolvedor não vê o bug localmente. É a
mesma raiz de #7 e #28, agora confirmada empiricamente por diferença
dev × produção.

**Correção proposta:** `timeZone: "America/Sao_Paulo"` no retorno de
`getRequestConfig`, e migrar as formatações manuais (`Intl.DateTimeFormat`,
`toLocaleDateString`) para `useFormatter`/`getFormatter` do next-intl, que
respeitam essa configuração.
**Risco:** baixo.

---

### #68 — `next.config.ts` tem bloco de redirects vazio para uma migração declarada

> **STATUS: NÃO EXECUTADO — requer decisão sua.** **Impossível a partir do repositório.** Depende do mapa de URLs indexadas do site anterior, obtido no Search Console (Cobertura) ou por `site:pili.ind.br`. O bloco `redirects()` em `next.config.ts` continua vazio, pronto para receber o mapeamento.

**Arquivo:** `next.config.ts:27-31`

```ts
async redirects() {
  return [
    // VK2 legacy redirects (add mappings as discovered)
  ];
},
```

O comentário indica migração de um sistema anterior ("VK2") e a intenção de
mapear as URLs antigas. O array está vazio.

Sem 301 das URLs antigas para as novas, toda a autoridade de domínio acumulada
pelo site anterior é perdida: backlinks apontam para 404, e as posições
conquistadas nas SERPs caem. É a causa mais comum de perda de tráfego orgânico
após replataformação.

**Não é possível auditar quais URLs faltam** a partir do repositório — depende do
mapa de URLs do site antigo. Registrado como pendência ativa, não como defeito
de código.

**Correção proposta:** levantar as URLs indexadas do site anterior (Search
Console → Cobertura, ou `site:pili.ind.br` no Google) e mapear cada uma para a
rota nova com `permanent: true`.
**Risco:** baixo tecnicamente; **alto valor**. Redirect mal mapeado é pior que
404 (soft 404 / conteúdo irrelevante).

---

## 🔵 BAIXO

### #69 — Rich result de FAQ disponível e não aproveitado

> **STATUS: PARCIALMENTE CORRIGIDO.** Emitido nas 4 páginas do ecossistema, que têm `faq` populado. **Não emitido nas páginas de produto**: `lib/data/products.ts` não tem campo de FAQ — falta conteúdo, não código.

**Arquivo:** `prisma/schema.prisma:166-176` (model `FAQ`, órfão — ver #9)

O model `FAQ` existe com `question`, `answer`, `locale` e vínculo opcional a
`Product`. Nenhuma página emite `FAQPage` no JSON-LD (verificado nos tipos do
HTML servido: apenas `Product`, `Brand`, `Organization`, `BreadcrumbList`,
`ListItem`).

FAQ em página de produto industrial responde a buscas de cauda longa
("qual a capacidade do tombador de 30 metros", "tombador fixo ou móvel") e o
rich result de FAQ ocupa espaço adicional no SERP.

**Correção proposta:** popular `FAQ` e emitir `FAQPage` nas páginas de produto.
Depende de #9 e #18.
**Risco:** nenhum.

---

### #70 — `lastModified` do sitemap é sempre "agora"

> **STATUS: CORRIGIDO.**

**Arquivo:** `src/app/sitemap.ts:30` — `lastModified: new Date()`

Todas as 48 entradas declaram a data da requisição. O Google interpreta
`lastModified` sempre-atual como ruído e passa a ignorá-lo, perdendo-se o sinal
de "esta página mudou, revisite".

**Correção proposta:** usar a data real de modificação por item (após #60 e #18).
**Risco:** nenhum.

---

## Verificações com resultado POSITIVO

Registrado para não gerar retrabalho — estes pontos foram auditados e **estão
corretos**:

| Item | Situação | Evidência |
|---|---|---|
| **Renderização SSR** | ✅ Correto | Conteúdo principal presente no HTML servido em todas as rotas testadas. Nenhuma rota pública depende de JS para renderizar conteúdo indexável |
| **Um único H1 por página** | ✅ Correto | Contagem em todas as 22 páginas: exatamente `h1=1` em cada, com hierarquia H2/H3 coerente |
| **URLs amigáveis (seção 12)** | ✅ Correto | Nenhuma URL com ID numérico, hash ou parâmetro técnico. Todos os slugs são descritivos: `/produtos/tombador-10m-fixo`, `/obras/cargill-paranagua`, `/solucoes/porto`. Hierarquia rasa e coerente |
| **Slugs** | ✅ Correto | Minúsculas, hífens, sem acentos. `slugify()` em `product-form.tsx:73-80` normaliza NFD e remove diacríticos |
| **404 real (sem soft 404)** | ✅ Correto | `/pt-BR/nao-existe` e `/pt-BR/produtos/nao-existe` → **HTTP 404**. Página 404 customizada em `src/app/not-found.tsx` |
| **Trailing slash** | ✅ Correto | `/pt-BR/produtos/` → **308** para `/pt-BR/produtos`. Sem duplicação |
| **Case sensitivity** | ✅ Correto | `/pt-BR/PRODUTOS` → **404**. Sem conteúdo duplicado por maiúsculas |
| **robots.txt** | ✅ Correto | Permite `/`, bloqueia `/admin/`, `/portal/`, `/api/`; referencia o sitemap. Nenhum recurso necessário à renderização bloqueado |
| **`noindex` acidental** | ✅ Nenhum | `generatePageMetadata` só emite `robots` quando `noIndex: true`, e **nenhuma** chamada passa esse parâmetro |
| **Viewport / mobile** | ✅ Correto | `<meta name="viewport" content="width=device-width, initial-scale=1"/>` presente. Layout responsivo com breakpoints Tailwind em todas as páginas |
| **`alt` em imagens** | ✅ Correto | 5/5 e 2/2 imagens com `alt` nas páginas inspecionadas. Nomes de arquivo descritivos (`logo-pili-white.png`, `tombador-pili.jpg`) |
| **Lazy loading** | ✅ Parcial correto | `next/image` aplica `loading="lazy"` automaticamente abaixo da dobra. Ressalva em #51 (5 `<img>` nativos) |
| **`font-display`** | ✅ Correto | `next/font/google` aplica `font-display: swap` por padrão e auto-hospeda as fontes (sem requisição a `fonts.googleapis.com`) |
| **Âncoras descritivas** | ✅ Majoritariamente | Apenas 3 âncoras genéricas ("Ver todos") em todo o site; nenhuma "clique aqui". As demais são descritivas |
| **Redirect de locale** | ✅ Aceitável | `/` → 307 para `/pt-BR`. 307 (temporário) é o correto para negociação por `Accept-Language`, já que o destino varia por usuário |

---

## Autocheck — BLOCO E

### Seção 12 — URLs amigáveis e arquitetura para SEO

| Subitem | Verificado | Onde |
|---|---|---|
| URLs com IDs/hashes/query onde deveria haver slug | ✅ | Positivo (tabela acima). Ressalva: `?cat=` do rodapé (#49, Bloco D) |
| Slugs gerados do título, únicos, estáveis | ✅ | Positivo. **Ressalva registrada:** `updateProduct`/`updateCase`/`updatePost` permitem alterar o slug sem gravar redirect da URL antiga — hoje inócuo (o site não lê do banco), mas vira quebra de links quando #18 for resolvido |
| Hierarquia coerente e rasa | ✅ | Máximo de 3 níveis: `/{locale}/{secao}/{item}` |
| Redirects 301, sem cadeias, sem 302 indevido | ✅ | #68 (redirects da migração vazios). Sem cadeias: `/produtos` → 307 → `/pt-BR/produtos` (200), um salto |
| www × sem-www e http→https | ⚠️ **Não auditável no repositório** | É configuração de plataforma (Vercel/DNS), não existe no código. `SITE_URL` fixa o host canônico como `https://pili.ind.br`. **Recomendação:** confirmar no painel da Vercel que `www.pili.ind.br` faz 308 para o apex e que HTTPS é forçado |
| Páginas inexistentes com 200 / soft 404 | ✅ | Positivo — 404 real confirmado |
| Trailing slash e maiúsculas | ✅ | Positivo — 308 e 404 respectivamente |

**Achados:** #68. (Ver também #49 no Bloco D.)

### Seção 13 — SEO on-page e tração orgânica

| Subitem | Verificado | Onde |
|---|---|---|
| Renderização visível ao Googlebot | ✅ | Positivo — SSR em todas as rotas |
| `<title>` e meta description: existência, unicidade, tamanho | ✅ | #58 (duplicação de marca), #59 (4 páginas sem metadata própria) |
| Headings: H1 único e hierarquia | ✅ | Positivo — verificado nas 22 páginas |
| Dados estruturados (Product, Article, FAQ, Breadcrumb, Organization) | ✅ | #63 (Article), #64 (Organization), #69 (FAQ). `Product` e `BreadcrumbList` presentes e corretos |
| Open Graph e Twitter Cards | ✅ | #61 (imagem inexistente), #59 (ausentes em 4 páginas). Estrutura correta nas demais |
| Canonical e conteúdo duplicado | ✅ | **#56** (canonical cross-locale), #49 (`?cat=`), #59 (homepage sem canonical) |
| sitemap.xml | ✅ | **#60** (129 URLs ausentes), #70 (`lastModified` ruidoso) |
| robots.txt | ✅ | Positivo |
| Meta robots / noindex | ✅ | Positivo — nenhum noindex acidental |
| Imagens: alt, nome, lazy, formato, dimensões | ✅ | Positivo para alt/nome/lazy. #51 (Bloco D) para dimensões |
| Core Web Vitals no código | ✅ | **#62** (renderização dinâmica → TTFB/LCP), #51 (CLS por `<img>` sem dimensões). Fontes ✅, sem CSS/JS bloqueante de terceiros (nenhum script externo — ver #36) |
| Links internos, âncoras, breadcrumbs | ✅ | #65 (breadcrumb sem versão visível), #66 (3 páginas órfãs), âncoras ✅ |
| Mobile | ✅ | Positivo — viewport e layout responsivo |
| 404 customizada e status HTTP | ✅ | Positivo |
| hreflang / idioma declarado | ✅ | **#57** (`<html>` sem `lang`), **#56** (canonical anula o hreflang). Tags `hreflang` em si estão corretas |

**Achados:** #56, #57, #58, #59, #60, #61, #62, #63, #64, #65, #66, #67, #69, #70.

---

# BLOCO F — Seções 14 (textos/idioma), 15 (acessibilidade), 16 (UX), 17 (LGPD) e 18 (observabilidade)

## 🟠 ALTO

### #71 — Acentuação ausente de forma sistemática no painel admin e no portal do cliente

> **STATUS: CORRIGIDO.**

**Escopo medido** (varredura por 40 palavras que exigem acento, comparando áreas):

| Área | Arquivos afetados |
|---|---|
| `src/app/[locale]` (site público) | **0** |
| `src/components/marketing` | **0** |
| `src/components/shared` | **0** |
| `src/messages` (traduções) | **0** |
| `src/app/admin` | **6** |
| `src/app/portal` | **4** |
| `src/components/admin` | **1** |

O site público está correto (o commit `fb56603` — *"fix: acentuação PT-BR"* —
resolveu essa área). O painel e o portal, construídos depois, não receberam o
mesmo tratamento.

**Strings visíveis ao usuário, verificadas uma a uma:**

| Arquivo:linha | Texto atual | Correto |
|---|---|---|
| `components/admin/sidebar.tsx:32` | `Midia` | Mídia |
| `admin/(panel)/media/page.tsx:45` | `Biblioteca de midia` | Biblioteca de mídia |
| `admin/(panel)/media/page.tsx:48` | `Gerencie arquivos de midia do site` | …de mídia… |
| `admin/(panel)/media/page.tsx:72` | `Nenhuma midia cadastrada` | Nenhuma mídia cadastrada |
| `admin/(panel)/page.tsx:86` | `Leads este mes` | Leads este mês |
| `admin/(panel)/usuarios/page.tsx:22` | `Tecnico` | Técnico |
| `admin/(panel)/usuarios/page.tsx:52` | `Usuarios` | Usuários |
| `admin/(panel)/usuarios/page.tsx:56` | `usuario cadastrado` / `usuarios cadastrados` | usuário / usuários |
| `admin/(panel)/usuarios/page.tsx:62` | `Novo usuario` | Novo usuário |
| `admin/(panel)/usuarios/page.tsx:72` | `Nenhum usuario cadastrado` | Nenhum usuário cadastrado |
| `admin/(panel)/usuarios/page.tsx:75` | `Os usuarios aparecerao aqui…` | Os usuários aparecerão aqui… |
| `admin/(panel)/usuarios/page.tsx:88` | `Acoes` | Ações |
| `admin/(panel)/usuarios/novo/page.tsx:27` | `Nome obrigatorio` | Nome obrigatório |
| `admin/(panel)/usuarios/novo/page.tsx:28` | `Email invalido` | E-mail inválido |
| `admin/(panel)/usuarios/novo/page.tsx:29` | `Minimo 6 caracteres` | Mínimo 6 caracteres |
| `admin/(panel)/usuarios/novo/page.tsx:37` | `As senhas nao coincidem` | As senhas não coincidem |
| `admin/(panel)/usuarios/novo/page.tsx:47` | `Tecnico` | Técnico |
| `admin/(panel)/usuarios/novo/page.tsx:111` | `Novo usuario` | Novo usuário |
| `admin/(panel)/usuarios/novo/page.tsx:114` | `Preencha os dados do novo usuario` | …usuário |
| `admin/(panel)/usuarios/novo/page.tsx:249` | `Criar usuario` | Criar usuário |
| `admin/(panel)/leads/page.tsx:186` | `Os leads aparecerao aqui…` | …aparecerão… |
| `portal/(dashboard)/equipamentos/[id]/page.tsx:110` | `Informacoes gerais` | Informações gerais |
| `portal/(dashboard)/equipamentos/[id]/page.tsx:118` | `Numero de serie` | Número de série |
| `portal/(dashboard)/equipamentos/[id]/page.tsx:131` | `Local de instalacao` | Local de instalação |
| `portal/(dashboard)/equipamentos/[id]/page.tsx:144` | `Data de instalacao` | Data de instalação |
| `portal/(dashboard)/equipamentos/[id]/page.tsx:168` | `Valida ate {data}` | Válida até {data} |
| `portal/(dashboard)/equipamentos/[id]/page.tsx:171` | `Sem informacao de garantia` | Sem informação de garantia |
| `portal/(dashboard)/documentos/page.tsx:27,30-31` | `Seus documentos estarao disponiveis…`, `laudos tecnicos`, `aparecerao aqui` | estarão disponíveis, técnicos, aparecerão |
| `portal/(dashboard)/equipamentos/page.tsx:57` | `Seus equipamentos aparecerao aqui` | …aparecerão… |
| `portal/(dashboard)/page.tsx:119` | `Seus equipamentos aparecerao aqui` | …aparecerão… |
| `admin/(panel)/produtos/actions.ts`, `obras`, `blog` | `Slug ja existe` | Slug já existe |

**Nota de encoding — não é problema de charset.** Verificado no HTML servido:
`<meta charSet="utf-8">` e header HTTP `Content-Type: text/html; charset=utf-8`.
Acentos que **existem** no código (site público, `messages/*.json`) são
renderizados corretamente. O defeito é de **digitação**, não de codificação.

**Correção proposta:** revisão texto a texto nos 11 arquivos.
**Risco:** nenhum — são literais de string sem lógica associada.

---

### #72 — Contraste insuficiente: `text-pili-cement` falha WCAG AA em 195 usos

> **STATUS: CORRIGIDO.**

**Arquivo:** `src/app/globals.css:10` — `--pili-cement: #9A9A9A`

**Razões de contraste calculadas** (fórmula WCAG 2.1, sobre a paleta real):

| Combinação | Razão | AA texto normal (4,5:1) | AA texto grande (3:1) |
|---|---|---|---|
| `cement` sobre `white` | **2,81:1** | ❌ FALHA | ❌ FALHA |
| `cement` sobre `paper` (#F5F5F5) | **2,58:1** | ❌ FALHA | ❌ FALHA |
| `mist` (#D4D4D4) sobre `white` | **1,48:1** | ❌ FALHA | ❌ FALHA |
| `warning` (#D97706) sobre `white` | **3,19:1** | ❌ FALHA | ✅ passa |
| `black` sobre `safety` (skip link) | **4,22:1** | ❌ FALHA | ✅ passa |
| `concrete` (#6B6B6B) sobre `white` | 5,33:1 | ✅ passa | ✅ passa |
| `safety` (#E31E24) sobre `white` | 4,69:1 | ✅ passa | ✅ passa |
| `cement` sobre `graphite` (#1A1A1A) | 6,19:1 | ✅ passa | ✅ passa |

`text-pili-cement` aparece **195 vezes em 20 arquivos**, concentrado no admin e
no portal — onde o fundo é `bg-pili-white` ou `bg-pili-paper`. É o texto
secundário de praticamente toda a interface autenticada: subtítulos, descrições
de estado vazio, textos de apoio de formulário.

Sobre fundo escuro (`graphite`) a mesma cor passa com folga — o problema é
exclusivamente o uso em fundo claro, que foi introduzido junto com o painel.

Além do impacto de acessibilidade, contraste insuficiente é sinal negativo
indireto de SEO (Lighthouse Accessibility) e prejudica leitura em telas de
campo — contexto real do usuário deste produto (pátio, luz solar).

**Correção proposta:** trocar `text-pili-cement` por `text-pili-concrete`
(5,33:1) nas ocorrências sobre fundo claro; corrigir a cor de texto do skip link
para `--pili-white` (contraste 4,69:1 sobre `safety`).
**Risco:** baixo — mudança puramente visual, mas afeta 195 pontos. Requer
revisão visual.

---

### #73 — Cookie banner é decorativo: o consentimento não governa nada

> **STATUS: CORRIGIDO.**

> **Severidade revisada na Revisão (H.2): CRÍTICO → ALTO.**

**Arquivo:** `src/components/shared/cookie-banner.tsx`

```ts
function accept() { localStorage.setItem("pili-cookie-consent", "accepted"); ... }
function reject() { localStorage.setItem("pili-cookie-consent", "rejected"); ... }
```

**Nenhum outro arquivo lê `pili-cookie-consent`** — verificado por grep: as três
ocorrências da chave estão todas dentro do próprio componente.

Clicar em "Recusar" grava a string e esconde o banner. Nada muda.

**Circunstância atenuante verificada:** hoje não existe nenhum script de
rastreamento carregado (#36 — `@vercel/analytics` nunca é montado, GA e Meta
Pixel nunca são injetados). Portanto **não há, neste momento, cookie não
essencial sendo depositado sem consentimento** — ou seja, não há violação
material de LGPD em produção hoje.

O problema é duplo e prospectivo:
1. O banner **afirma ao usuário** que cookies estão sendo usados ("Utilizamos
   cookies para melhorar sua experiência"), o que não é verdade. É informação
   incorreta ao titular.
2. No momento em que #36 for corrigido e o analytics for ligado, o rastreamento
   passará a rodar **independentemente da escolha do usuário**, e aí a violação
   passa a ser real.

**Problema adicional de conformidade:** o texto adota consentimento tácito —
*"Ao continuar navegando, você concorda"*. A LGPD (Art. 8) exige manifestação
**inequívoca** para finalidades não essenciais; "continuar navegando" não
qualifica.

**Correção proposta:** ligar o carregamento de qualquer script de analytics à
leitura de `pili-cookie-consent === "accepted"`, reescrever o texto para
consentimento ativo e adicionar granularidade (essenciais × analytics).
**Risco:** baixo tecnicamente. Deve ser feito **junto** com #36, nunca depois.

---

## 🟡 MÉDIO

### #74 — Nenhuma ação destrutiva pede confirmação

> **STATUS: CORRIGIDO.**

**Verificado:** `grep -rn "confirm(\|AlertDialog\|Tem certeza\|Confirmar exclus"`
em todo `src/` → **zero ocorrências**.

Ações destrutivas que disparam imediatamente ao clique:

| Local | Ação | Efeito |
|---|---|---|
| `components/admin/lead-actions-dropdown.tsx:80-83` | `deleteLead` | Soft delete (recuperável no banco, mas sem UI de restauração) |
| `admin/(panel)/produtos/page.tsx:132-134` | `deleteProduct` | **Hard delete** — cascata em translations, specs, features, media, FAQs |
| `admin/(panel)/obras/page.tsx:106-108` | `deleteCase` | **Hard delete** — cascata em translations, metrics, media |
| `admin/(panel)/blog/page.tsx:118-120` | `deletePost` | **Hard delete** — cascata em translations |

Os três últimos são irreversíveis e ficam em um ícone de lixeira dentro de uma
linha de tabela, adjacente ao ícone de edição. Um clique errado destrói o
registro e todos os seus relacionamentos, sem desfazer.

O componente `AlertDialog` do Radix **não está instalado** (`components/ui/`
tem `dialog.tsx` mas não `alert-dialog.tsx`), então a correção envolve adicionar
o componente.

**Correção proposta:** `AlertDialog` de confirmação nas quatro, com o nome do
item no texto ("Excluir o produto *Tombador 10m fixo*?").
**Risco:** baixo.

---

### #75 — Busca de leads não ignora acentos

> **STATUS: CORRIGIDO.**

**Arquivo:** `src/app/admin/(panel)/leads/actions.ts:51-57`

```ts
where.OR = [
  { name:    { contains: params.search, mode: "insensitive" } },
  { email:   { contains: params.search, mode: "insensitive" } },
  { company: { contains: params.search, mode: "insensitive" } },
];
```

`mode: "insensitive"` resolve apenas maiúsculas/minúsculas. Buscar `"Joao"` **não
encontra** `"João"`; `"Construcao"` não encontra `"Construção"`; `"Parana"` não
encontra `"Paraná"`.

Em uma base de leads brasileira, nomes e razões sociais com acento são a regra —
`José`, `Antônio`, `Conceição`, `Agropecuária`, `Distribuição`. O operador
comercial digita sem acento (mais rápido) e conclui que o lead não existe.

**Correção proposta:** habilitar a extensão `unaccent` no PostgreSQL e usar
`$queryRaw` com `unaccent(name) ILIKE unaccent($1)`, ou manter uma coluna
normalizada indexada (`nameNormalized`) preenchida na escrita.
**Risco:** médio — a extensão `unaccent` precisa estar disponível no NeonDB
(está, mas requer `CREATE EXTENSION`) e `$queryRaw` sai do caminho seguro do
Prisma, exigindo parametrização cuidadosa.

---

### #76 — CPF/CNPJ e telefone sem máscara e sem validação

> **STATUS: CORRIGIDO.**

**Arquivos:** `src/app/admin/(panel)/usuarios/novo/page.tsx:33-34, 200-218`;
`src/lib/validators/lead.ts:8`

```ts
// formulário de usuário
phone:   z.string().optional(),
cpfCnpj: z.string().optional(),

// schema de lead
cnpj: z.string().optional(),
```

Nenhuma máscara de entrada, nenhuma validação de formato, nenhuma verificação de
dígito verificador. Os campos aceitam qualquer string — inclusive
`"123"`, `"abc"` ou um CPF com dígito inválido.

Consequências: base com documentos em formatos heterogêneos
(`12.345.678/0001-90`, `12345678000190`, `12345678/0001-90`), impossível de
cruzar com ERP ou emitir nota; e `Lead.cnpj` é campo comercial usado para
qualificação.

O campo `phone` do lead público tem apenas `min(8).max(20)`
(`validators/lead.ts:6`) — aceita `"00000000"`.

**Correção proposta:** máscara na entrada e validação de dígito verificador de
CPF/CNPJ no schema zod (compartilhado cliente/servidor); normalizar para dígitos
antes de gravar.
**Risco:** baixo. Atenção: registros já gravados em formatos variados precisam de
normalização retroativa.

---

### #77 — Sem healthcheck, sem tratamento explícito de indisponibilidade do banco

> **STATUS: CORRIGIDO.**

**Verificado:** `find src/app -path "*health*" -o -path "*status*"` → nenhuma rota.

Não existe endpoint de saúde da aplicação. Consequências operacionais:

- Nenhum monitor externo (UptimeRobot, Better Stack, checagem da Vercel) tem um
  alvo barato para verificar se a aplicação **e o banco** estão respondendo. Um
  `GET /` responde 307 mesmo com o banco fora do ar, porque o site público não
  consulta o banco (#18).
- Quando o banco cai, a falha se manifesta como 404 no detalhe do lead e zeros no
  dashboard (#25) — sintomas que parecem perda de dados, não indisponibilidade.
- Não há referência a rotina de backup em nenhum arquivo de configuração. O
  NeonDB oferece PITR, mas a política (janela de retenção, teste de restauração)
  não está documentada no repositório.

**Correção proposta:** `GET /api/health` executando `SELECT 1` via
`db.$queryRaw`, devolvendo 200/503, com `export const dynamic = "force-dynamic"`.
Documentar a política de backup no `README.md`.
**Risco:** nenhum. Atenção: não expor detalhes de infraestrutura na resposta.

---

### #78 — Observabilidade limitada a `console.error`

> **STATUS: CORRIGIDO.**

**Arquivo:** `src/lib/prisma-errors.ts:18-24`

```ts
export function logError(scope: string, error: unknown) {
  console.error(`[${scope}]`, error);
}
```

Pontos positivos verificados: `logError` é usado consistentemente nas 5 actions
(19 chamadas), o escopo é sempre nomeado (`LEADS_EXPORT`, `PRODUTOS_CREATE`…), e
**nenhum dado pessoal é registrado** — `api/leads/route.ts:80` loga o erro sem o
corpo da requisição, com comentário explicando o motivo.

Limitações:
- Sem níveis (não há `warn`, `info`, `debug`) — tudo é `error`.
- Sem correlação: não há request id, user id ou timestamp estruturado. Dois erros
  simultâneos de usuários diferentes são indistinguíveis.
- Sem destino: em produção na Vercel, `console.error` vai para os logs de função,
  com retenção limitada e sem alerta. **Ninguém é notificado quando algo quebra.**
- Duas páginas engolem erro sem sequer chamar `logError` (#25).

Combinado com #36 (nenhum analytics), o resultado é: **não há nenhuma forma de
saber que os três formulários quebrados (#1, #2) estão falhando em produção.**
Nenhum alerta dispara, nenhuma métrica cai, nenhum log é lido.

**Correção proposta:** Sentry (ou equivalente) com captura de exceção no servidor
e no cliente; níveis de log; request id propagado.
**Risco:** baixo. Atenção ao configurar o scrubbing de PII antes de enviar
eventos para fora.

---

### #79 — Nenhum mecanismo de exclusão ou anonimização de dados pessoais

> **STATUS: CORRIGIDO.**

**Arquivos:** `src/app/[locale]/(marketing)/politica-privacidade/page.tsx:174-200`;
`src/app/admin/(panel)/leads/actions.ts:159-173`

A política de privacidade declara corretamente os direitos do titular (Art. 18),
incluindo *"Anonimização, bloqueio ou eliminação de dados desnecessários"* e
*"Eliminação dos dados tratados com consentimento"*, e indica um e-mail de
contato para exercê-los.

**O canal manual por e-mail é aceitável perante a LGPD** — a lei não exige
autoatendimento. Portanto isto **não é violação**, e sim risco operacional:

- `deleteLead` faz **soft delete** (`deletedAt`), mantendo nome, e-mail,
  telefone, empresa, CNPJ, cidade e mensagem **indefinidamente** no banco. Um
  pedido de eliminação atendido pela interface do admin **não elimina o dado**.
- Não há função de anonimização, nem política de retenção, nem expurgo
  programado.
- Não há trilha de auditoria de quem acessou ou exportou dados de um titular —
  e `exportLeadsCsv` permite baixar a base inteira (#47) sem registro.

**Correção proposta:** função de anonimização (sobrescrever PII, preservar
métricas agregadas), política de retenção com expurgo automático de leads
inativos, e log de auditoria para exportações.
**Risco:** médio — decidir o que anonimizar × o que preservar é decisão de
negócio, não técnica.

---

## 🔵 BAIXO

### #80 — Formulário de nota permite envio duplicado

> **STATUS: CORRIGIDO.**

**Arquivo:** `src/app/admin/(panel)/leads/[id]/page.tsx:215-225`

```tsx
<form action={handleAddNote} className="space-y-3">
  <Textarea name="content" required ... />
  <Button type="submit" size="sm">Adicionar nota</Button>
</form>
```

Sem `useFormStatus`/`pending`, o botão permanece habilitado durante o envio. Dois
cliques rápidos criam duas notas idênticas.

**Verificado que os outros 4 formulários estão protegidos:**
`lead-form.tsx:166` (`disabled={status === "loading"}`), `catalogo:196`,
`trabalhe-conosco`, `calculadora:312` (`disabled={gateStatus === "loading"}`),
e os formulários do admin usam `disabled={isPending}`.

**Correção proposta:** componente cliente com `useFormStatus` para desabilitar o
botão.
**Risco:** nenhum.

---

### #81 — Rótulo "Role" em inglês na tabela de usuários

> **STATUS: CORRIGIDO.**

**Arquivo:** `src/app/admin/(panel)/usuarios/page.tsx:86`

```tsx
<TableHead>Role</TableHead>
```

O mesmo conceito é rotulado **"Perfil"** no formulário de criação
(`usuarios/novo/page.tsx:221`). Duas telas do mesmo módulo, dois nomes, um deles
em inglês.

**Correção proposta:** padronizar em "Perfil".
**Risco:** nenhum.

---

### #82 — Botão de fechar de diálogos anuncia "Close" para leitores de tela

> **STATUS: CORRIGIDO.**

**Arquivos:** `src/components/ui/dialog.tsx:76, 114`; `src/components/ui/sheet.tsx:80`

Texto `sr-only` em inglês, herdado do shadcn/ui. Um usuário de leitor de tela em
português ouve "Close" no meio de uma interface em português.

Afeta o menu mobile do portal (`Sheet`) e todos os diálogos.

**Correção proposta:** traduzir para "Fechar".
**Risco:** nenhum.

---

## Verificações com resultado POSITIVO — Bloco F

| Item | Situação | Evidência |
|---|---|---|
| **Charset UTF-8** | ✅ Correto | `<meta charSet="utf-8">` no HTML servido e header HTTP `Content-Type: text/html; charset=utf-8`. Acentos existentes renderizam corretamente. O problema de #71 é digitação, não encoding |
| **Labels em campos de formulário** | ✅ Correto | Todos os 8 campos de `usuarios/novo` têm `<Label htmlFor>` casando com `id`. Mesmo padrão em `lead-form.tsx`, `product-form.tsx`, `case-form.tsx`, `post-form.tsx` |
| **Skip link** | ✅ Presente | `(marketing)/layout.tsx:14-16` + estilo `.skip-to-content:focus` em `globals.css:100-115`. Ressalva de contraste em #72 |
| **Foco visível** | ✅ Correto | `*:focus-visible { outline: 2px solid var(--pili-safety); outline-offset: 2px }` — regra global, `globals.css:117-120` |
| **HTML semântico** | ✅ Correto | `<button>` para ações, `<a>`/`<Link>` para navegação, `<header>`, `<footer>`, `<nav>`, `<main>`, `<aside>` usados corretamente. `<time>` em `leads/[id]/page.tsx:245` |
| **`alt` em imagens** | ✅ Correto | Verificado no HTML servido: 5/5 e 2/2 imagens com `alt` |
| **Formato de moeda** | ✅ Correto | `financing-simulator.tsx:24` — `toLocaleString("pt-BR", { style: "currency", currency: "BRL" })` → `R$ 1.234,56` |
| **Formato de data** | ✅ Correto (formato) | `Intl.DateTimeFormat("pt-BR")` → `dd/mm/aaaa` em todos os pontos. **Ressalva de fuso em #7, #28, #67**, não de formato |
| **Proteção contra duplo clique** | ✅ 4 de 5 | Ver #80 |
| **Estados vazios** | ✅ Correto | Todas as 6 listagens do admin e as 3 do portal têm estado vazio com ícone e texto orientativo (ex.: `leads/page.tsx:177-188`, `usuarios/page.tsx:68-77`). Nenhuma tela em branco |
| **Política de privacidade** | ✅ Presente e completa | 276 linhas, cita bases legais (Art. 7), direitos do titular (Art. 18), e canal de contato. Ver #79 para a lacuna de execução |
| **Aviso de cookies** | ✅ Presente | Componente existe e é montado no layout de marketing. Ver #73 para a lacuna funcional |
| **PII em logs** | ✅ Correto | `api/leads/route.ts:78-80` loga o erro sem o corpo da requisição, com comentário justificando. `console.log("[LEAD]", leadData)` foi removido na sessão anterior |
| **Coleta mínima de dados** | ✅ Adequada | `leadSchema` coleta nome, e-mail, telefone, empresa e mensagem — proporcional à finalidade comercial declarada. Nenhum dado sensível (Art. 5, II) é coletado |
| **Inglês na interface** | ✅ Quase limpo | Apenas 3 ocorrências (`Close` ×3, `sr-only`) e 1 rótulo (`Role`). Nenhuma mensagem crua de framework ou de banco exposta ao usuário — todos os erros passam por strings próprias |

---

## Autocheck — BLOCO F

### Seção 14 — Textos, idioma e encoding

| Subitem | Verificado | Onde |
|---|---|---|
| Revisão de textos visíveis (labels, botões, menus, títulos, placeholders, mensagens, e-mails) | ✅ | #71 — varredura por área, 31 strings catalogadas com arquivo:linha. Templates de e-mail (`lead-notification.tsx`, `lead-confirmation.tsx`) revisados: **acentuação correta** |
| Ortografia, acentuação, cedilha, concordância | ✅ | #71 |
| Encoding: HTML, headers HTTP, banco, e-mails | ✅ | Positivo (tabela acima). **Banco:** não auditável sem acesso — PostgreSQL usa UTF-8 por padrão no NeonDB e o Prisma sempre transmite UTF-8; registrado como não verificável no repositório |
| Inglês misturado na interface | ✅ | #81 (`Role`), #82 (`Close`) |
| Padronização de tom e termos | ✅ | #81 (Perfil × Role). Demais termos consistentes: "Obras" na UI para o model `Case`, "Leads", "Produtos" — cada conceito com um único nome visível |
| Formatos brasileiros (data, moeda, telefone, CPF/CNPJ, CEP) | ✅ | Data ✅, moeda ✅, **#76** (CPF/CNPJ e telefone sem máscara). CEP não é coletado em lugar nenhum |
| Busca ignorando acentos | ✅ | **#75** |

**Achados:** #71, #75, #76, #81, #82.

### Seção 15 — Acessibilidade

| Subitem | Verificado | Onde |
|---|---|---|
| Textos alternativos em imagens | ✅ | Positivo |
| Labels em campos de formulário | ✅ | Positivo |
| Contraste de cores | ✅ | **#72** — 14 combinações calculadas pela fórmula WCAG |
| Tamanhos de fonte fixos | ✅ | Não se aplica — a tipografia usa escala relativa via variáveis CSS (`--text-h2`, `--text-display-2`) e classes Tailwind (`text-sm`, `text-lg`), todas em `rem`. Nenhum `px` fixo em texto |
| Navegação por teclado / foco visível / ordem de tabulação | ✅ | Positivo — `*:focus-visible` global, skip link, componentes Radix (que implementam foco e teclado nativamente) |
| HTML semântico e ARIA | ✅ | Positivo. `aria-label` presente em ícones sociais (`footer.tsx:143`) e `sr-only` em botões só de ícone |
| `lang="pt-BR"` no HTML | ✅ | **#57 (Bloco E)** — ausente. Falha WCAG 2.1 nível A, critério 3.1.1 |

**Achados:** #72, #82. (Ver também #57 no Bloco E.)

### Seção 16 — UX e consistência visual

| Subitem | Verificado | Onde |
|---|---|---|
| Comportamentos inconsistentes entre telas | ✅ | #41 (Bloco C — mesmo status com dois visuais), #81 (mesmo conceito com dois rótulos). Padrão de navegação consistente: todos os CRUDs usam listagem → `/novo` e `/[id]`, sem mistura de modal e redirect |
| Feedback ausente após ações | ✅ | **#23 (Bloco B)** — erros de action sem tratamento; #32 (nota descartada em silêncio); #52 (validação silenciosa na calculadora). Sucesso tem feedback: os formulários redirecionam ou trocam de estado |
| Estados vazios sem orientação | ✅ | Positivo (tabela acima) |
| Ações destrutivas sem confirmação | ✅ | **#74** |
| Duplo clique gerando duplicidade | ✅ | **#80** (1 de 5 formulários) |

**Achados:** #74, #80.

### Seção 17 — Privacidade e LGPD

| Subitem | Verificado | Onde |
|---|---|---|
| Dados pessoais coletados sem necessidade | ✅ | Positivo — coleta proporcional, sem dados sensíveis |
| Dados trafegados/armazenados sem proteção | ✅ | HTTPS forçado por HSTS (`next.config.ts`, adicionado na sessão anterior). **Ressalva:** PII em repouso não é criptografada em coluna — aceitável para o volume e a natureza (dado comercial B2B), registrado como observação, não achado |
| Dados sensíveis em logs | ✅ | Positivo |
| Política de privacidade | ✅ | Positivo |
| Aviso de cookies | ✅ | **#73** |
| Exclusão/anonimização de dados | ✅ | **#79** |
| Consentimento para comunicações | ✅ | **#4 (Bloco A)** — `consent: true` fixo em 3 formulários. Adicionalmente: o consentimento coletado é genérico ("aceito a política de privacidade"), **sem opt-in separado para comunicações de marketing** — se a base de leads for usada para e-mail marketing, a base legal é frágil |

**Achados:** #73, #79. (Ver também #4 no Bloco A.)

### Seção 18 — Observabilidade e operação

| Subitem | Verificado | Onde |
|---|---|---|
| Logs existem, nível adequado, sem dados sensíveis | ✅ | **#78** — existem e não vazam PII, mas sem níveis nem destino |
| Erros do servidor rastreáveis | ✅ | **#78**, **#25 (Bloco B)** |
| Healthcheck | ✅ | **#77** |
| Tratamento de indisponibilidade do banco | ✅ | **#25 (Bloco B)**, **#77** |
| Rotinas de backup referenciadas | ✅ | **#77** — nenhuma referência em `README.md`, `next.config.ts` ou `package.json` |

**Achados:** #77, #78.

---

# BLOCO G — Seções 19 (pagamentos) e 20 (SaaS: planos, trial, landing)

## Resultado: NÃO SE APLICA

Registrado conforme exigido, com a evidência que sustenta a conclusão — a seção
**não foi omitida**, foi auditada e o resultado é ausência de escopo.

### Evidência levantada

| Verificação | Comando / arquivo | Resultado |
|---|---|---|
| Dependências de gateway de pagamento | `package.json` (28 dependências + 10 dev) filtrado por `stripe\|paypal\|mercado\|pagar\|asaas\|iugu\|pagseguro\|billing\|subscri` | **nenhuma** |
| Código de pagamento/assinatura | `grep -rniE "stripe\|mercadopago\|pagar\.?me\|asaas\|iugu\|paypal\|pagseguro\|checkout\|webhook\|subscription\|assinatura\|plano\|trial\|billing\|invoice\|fatura\|cobran\|cupom\|coupon\|desconto"` em `src/`, `prisma/`, `package.json` | **0 ocorrências reais** — todos os casamentos são falsos positivos: a palavra "Industrial" (contém `stri`), a classe CSS `.stripe-pattern` (`globals.css:145-146`) e "plataforma" |
| Models de cobrança no schema | `prisma/schema.prisma` — 20 models inventariados | **nenhum** model de plano, assinatura, transação, fatura ou cupom |
| Rotas de webhook | `find src/app -name "route.ts"` | 2 rotas: `api/auth/[...nextauth]` e `api/leads`. **Nenhum webhook** |
| Preços no conteúdo | `grep -rn "R\$\|preco\|price" src/lib/data/products.ts` | **nenhum preço** exibido em nenhum dos 18 produtos |
| Página de planos/preços | inventário das 22 páginas de `(marketing)` | **não existe** página de preços ou de planos |

### Por que não se aplica

O projeto é um **site institucional B2B com CMS e portal de pós-venda**, não um
SaaS. O modelo comercial é geração de lead: o visitante pede orçamento
(`/orcamento`), a equipe comercial negocia fora do sistema, e o equipamento
(bem de capital de alto valor, sem preço público) é vendido por contrato.

Não há: checkout, cobrança, assinatura, plano, trial, limite de uso por plano,
feature gating, ciclo de renovação, inadimplência ou reembolso. Portanto os 8
subitens da seção 19 e os 4 grupos de subitens da seção 20 não têm objeto.

### O que existe e poderia ser confundido

**`FinancingSimulator`** (`src/components/marketing/financing-simulator.tsx`) —
simulador de financiamento de equipamento. Auditado especificamente:

- É **100% client-side**: 5 `useState`, uma função pura `calculatePayment`
  (Tabela Price) e `formatCurrency`. **Nenhum `fetch`, nenhuma Server Action,
  nenhuma submissão.**
- Não cria cobrança, não coleta dados de pagamento, não persiste nada.
- É peça de marketing (mostra parcela estimada para linhas de crédito rural do
  tipo Moderfrota/Finame) que termina em CTA para `/orcamento`.

Como não trafega nem armazena dado financeiro, **não incorre em nenhum dos riscos
da seção 19** — em particular, não há dado de cartão em lugar nenhum do sistema
(o subitem "dados de cartão nunca armazenados" é atendido por inexistência).

### Ressalva para o futuro

O ecossistema declarado inclui **PILI Store** (`constants.ts:19` →
`store.pili.ind.br`), descrita no rodapé como "Peças e acessórios". Se essa loja
processa pagamentos, ela é **outra aplicação, fora deste repositório**, e precisa
de auditoria própria — as seções 19 e 20 se aplicariam integralmente a ela.
Neste repositório, `PILI_STORE_URL` é usada apenas como link externo
(`footer.tsx:74`, `header.tsx:22`, `pili-robo.tsx:113`).

### Autocheck — BLOCO G

| Seção | Subitens | Status |
|---|---|---|
| 19 — Pagamentos | fluxo de checkout; webhooks (assinatura, eventos, idempotência); validação de valor no backend; consistência de estado com o gateway; divergência checkout × cobrança; cupons; falhas e retry; dados de cartão; reembolso/cancelamento; auditoria de transações | **Todos não se aplicam** — não existe fluxo de pagamento. Evidência na tabela acima |
| 20 — SaaS | mapeamento de planos e features; feature gating no backend; limites de uso; trial (início/fim/burla/avisos); ciclo de vida da assinatura (renovação, upgrade/downgrade, pró-rata, cancelamento, inadimplência); promessa da landing × produto | **Todos não se aplicam** — não existe plano, trial nem assinatura. Evidência na tabela acima |

**Observação sobre o subitem "promessa da landing × produto real"**, que é o
único da seção 20 com análogo neste projeto: a comparação entre o que o site
público promete e o que o produto entrega **foi feita** e gerou achados reais,
registrados nos blocos anteriores — #3 (catálogo prometido em PDF e por e-mail,
sem PDF e sem envio), #13 (biblioteca de mídia sem upload), #66 (página de
certificações inalcançável) e #6 (site trilíngue sem conteúdo traduzido).

---

# BLOCO H — Revisão final (seção 21)

Revisão conduzida como segundo auditor, cético e independente, sobre os 82 itens
registrados nos blocos A–G.

## H.1 — Verificação: itens reabertos e conferidos no código

Foram reabertos e reconferidos no código **todos os 7 itens CRÍTICO e os 22
ALTO** (29 itens), mais os 12 itens MÉDIO/BAIXO cuja formulação dependia de
inferência em vez de leitura direta. Total reverificado: **41 de 82**.

Correções de descrição aplicadas durante a revisão:

| Item | Imprecisão encontrada | Correção aplicada |
|---|---|---|
| #20 | Afirmava que faltava `generateStaticParams` nas rotas dinâmicas | **Falso.** `generateStaticParams` existe em 5 rotas dinâmicas. A causa real é a ausência de `setRequestLocale` nas páginas. Descrição corrigida e a análise completa foi consolidada em **#62** (Bloco E), que agora é o item canônico. #20 permanece como registro do sintoma, referenciando #62 |
| #52 | Rascunho inicial acusava `gateStatus` preso em `"loading"` após sucesso | **Falso positivo removido** antes da publicação. Verificado nas linhas 269-326 que `setUnlocked(true)` troca todo o bloco, e o valor obsoleto nunca é renderizado. A nota de verificação foi mantida no corpo de #52 para evitar que a análise seja refeita |
| #64 | Rascunho afirmava que nenhum `Organization` aparecia no HTML | **Impreciso.** O HTML servido **tem** `"@type":"Organization"`, mas como campo `manufacturer` **dentro** do schema `Product`, não como nó de nível superior. Descrição corrigida com essa distinção |
| #43 | `AuthorizationError` listado apenas como export morto | **Incompleto.** É lançado internamente e nunca capturado — o que é a causa de #23, não mera ausência de uso. Referência cruzada adicionada |
| #29 | Severidade descrita sem contexto temporal | Ajustado: risco **baixo hoje** (dados estáticos, autorais), **alto após #18** (conteúdo editável por 3 papéis) |

**Falsos positivos removidos (não constam do relatório):** 1 — o `gateStatus`
da calculadora (registrado acima em #52).

**Candidatos descartados durante a auditoria, antes de virarem item:**
- `react-dom` e `sharp` apareceram como "dependências não importadas" no grep,
  mas são exigidos pelo React DOM e pelo `next/image`. Descartados.
- `font-display` — suspeita inicial de fonte sem `swap`. Verificado que
  `next/font/google` aplica `swap` por padrão e auto-hospeda. Descartado.
- Redirect `/` → 307 — suspeita de "302 onde deveria ser 301". Verificado que
  307 é correto para negociação por `Accept-Language`. Registrado como positivo.
- `pages.signIn: "/portal/login"` — suspeita de apontar para o portal em vez do
  admin. Verificado que `/admin/login/page.tsx:4` apenas redireciona para
  `/portal/login`, que é a tela unificada. Correto. Descartado.

## H.2 — Severidades ajustadas

| Item | De | Para | Justificativa |
|---|---|---|---|
| #3 (PDF do catálogo inexistente) | CRÍTICO | **ALTO** | O defeito só se manifesta **depois** que #2 for corrigido — hoje o gate nunca abre, então nenhum usuário chega ao link. Impacto real presente é zero; impacto potencial é alto. "Crítico" estava superestimado |
| #57 (`<html>` sem `lang`) | CRÍTICO | **ALTO** | É falha WCAG 2.1 nível A e sinal de SEO degradado, mas **não quebra funcionalidade nem expõe vulnerabilidade**. Pelo critério adotado para CRÍTICO (quebra de função central ou exposição de segurança), pertence a ALTO |
| #18 (site estático × banco desconectados) | MÉDIO | **ALTO** | **Subestimado.** É a causa raiz de #6, #11, #12, #13, e condiciona a correção de #56, #60 e #63. Um painel de CMS que não altera o site é falha funcional de primeira ordem, não dívida técnica |
| #36 (analytics inexistente) | MÉDIO | **ALTO** | **Subestimado** no contexto do objetivo declarado. Sem medição, nenhuma correção de SEO deste relatório pode ser validada, e os formulários quebrados (#1, #2) permaneceriam invisíveis indefinidamente |
| #73 (cookie banner decorativo) | CRÍTICO | **ALTO** | **Superestimado no rascunho.** Verificado que hoje **não há nenhum script de rastreamento carregado** (#36), logo não há cookie não essencial depositado sem consentimento — não há violação material de LGPD em produção. O risco é prospectivo e o defeito atual é de informação incorreta ao titular |

## H.3 — Completude: segunda passada

Para cada seção foi perguntado "o que um auditor experiente ainda procuraria
aqui?". As seções com resposta não vazia receberam segunda passada:

| Seção | O que faltou procurar | Resultado |
|---|---|---|
| **5 — Segurança** | Ciclo de vida do JWT: a `role` gravada no token é revalidada? Sessão pode ser revogada? | **Novo achado #83** (ALTO) |
| **4 — Erros** | `revalidatePath` com escopo incorreto após mutação | Verificado: as 19 chamadas usam o path do módulo correspondente. Correto, sem achado |
| **1 — Rotas** | Server Actions órfãs (exportadas e nunca chamadas) | Verificado: `resetPassword` é a única — já registrada como consequência em #46 |
| **13 — SEO** | `noindex` acidental; recursos bloqueados no robots; paginação com `rel=next/prev` | Verificado: nenhum `noindex`; robots correto; não há paginação em rota pública (só no admin, que é `Disallow`). Sem achado |
| **14 — Textos** | Templates de e-mail e `messages/*.json` (fora do escopo do grep inicial) | Verificado individualmente: `lead-notification.tsx`, `lead-confirmation.tsx` e os 3 arquivos de mensagens têm **acentuação correta**. Registrado como positivo |
| **17 — LGPD** | Base legal para e-mail marketing separada do aceite genérico | Incorporado ao autocheck da seção 17 como ressalva de #4 |
| **11 — Build** | Execução real dos scripts do `package.json` | `typecheck` ✅, `lint` ✅, `build` ✅ executados. `db:*` não executados por decisão de não tocar em banco |

### Achado novo da segunda passada

### #83 — `role` do JWT nunca é revalidada; rebaixamento de permissão leva até 30 dias para valer

> **STATUS: CORRIGIDO.**

**Arquivo:** `src/lib/auth.ts:17, 65-72`

```ts
session: { strategy: "jwt" },          // sem maxAge => padrão de 30 dias
...
jwt({ token, user }) {
  if (user) {                          // só verdadeiro no sign-in
    token.id = user.id as string;
    token.role = user.role ?? "CLIENTE";
  }
  return token;                        // nas demais chamadas, devolve o token como está
}
```

O bloco só executa quando `user` está presente, o que ocorre **exclusivamente no
momento do login**. Em toda requisição subsequente o callback devolve o token
intacto, sem consultar o banco. Não há tratamento de `trigger: "update"` nem
`maxAge` configurado — o padrão do NextAuth é **30 dias**.

Consequências:

1. **Rebaixamento não tem efeito.** Um `ADMIN` alterado para `CLIENTE` no banco
   continua com `role: "ADMIN"` no JWT. Como `requireRole` e `requireRoleOrThrow`
   leem `session.user.role`, que vem de `token.role` (`auth.ts:76`), o usuário
   **mantém acesso total ao painel por até 30 dias**. Hoje isso é parcialmente
   mascarado porque não existe tela de edição de usuário (#46) — mas a alteração
   feita direto no banco tem o mesmo problema.
2. **Não há revogação de sessão.** Com estratégia JWT o token é auto-contido: o
   `signOut` (`admin/top-bar.tsx:68`, `portal/top-bar.tsx:91`) apenas apaga o
   cookie no navegador. Um token copiado antes do logout continua válido até
   expirar. O model `Session` existe no schema (`schema.prisma:93-99`) e **nunca
   é usado** (0 referências a `db.session`) — é resíduo do PrismaAdapter,
   inoperante sob JWT.
3. **Desligamento de funcionário não corta o acesso.** É o cenário concreto: uma
   equipe comercial com rotatividade, e o acesso a toda a base de leads (PII de
   clientes) permanece por semanas após o desligamento.

**Correção proposta:** revalidar a `role` no callback `jwt` a cada N minutos
(guardando um `roleCheckedAt` no token e refazendo `db.user.findUnique` quando
vencido) e reduzir `session.maxAge` para algo compatível com o risco (ex.: 8h
para staff). Para revogação imediata, manter uma lista de tokens/usuários
invalidados em Redis (o Upstash já é dependência) consultada no `jwt`.
**Risco:** MÉDIO — revalidar a cada requisição adiciona uma query ao banco em
todo request autenticado; o intervalo precisa ser calibrado. Reduzir `maxAge`
força relogin mais frequente.

**Relacionado:** #33 (o CVE crítico do `next-auth` também afeta a confiabilidade
do objeto de sessão), #46 (ausência da tela que faria o rebaixamento).

## H.4 — Consistência

- **Duplicatas mescladas:** nenhuma duplicata literal encontrada. Três itens
  compartilham raiz (fuso horário: #7, #28, #67) e foram mantidos separados por
  estarem em arquivos e camadas distintas — cada um exige correção própria — mas
  agora referenciam-se mutuamente.
- **Referências cruzadas adicionadas:** #1↔#5, #2↔#3, #18↔{#6,#11,#12,#13,#29},
  #23↔{#42,#43}, #25↔#78, #33↔{#83}, #36↔#73, #46↔#83, #49↔#65, #56↔#6,
  #57↔#72, #62↔#20, #77↔#25.
- **Numeração:** contígua de #1 a #83, sem lacunas nem repetições. Conferida
  item a item.

## H.5 — Contagem conferida

Tabela-resumo recontada após os 5 ajustes de severidade de H.2 e a inclusão de
#83.

---

# TABELA-RESUMO

## Por severidade

| Severidade | Qtd | Itens |
|---|---|---|
| 🔴 **CRÍTICO** | **5** | #1, #2, #21, #33, #56 |
| 🟠 **ALTO** | **26** | #3, #4, #5, #6, #7, #8, #18, #22, #23, #24, #34, #35, #36, #46, #47, #48, #57, #58, #59, #60, #61, #62, #71, #72, #73, #83 |
| 🟡 **MÉDIO** | **37** | #9, #10, #11, #12, #13, #14, #15, #16, #17, #25, #26, #27, #28, #29, #30, #37, #38, #39, #40, #41, #42, #49, #50, #51, #52, #63, #64, #65, #66, #67, #68, #74, #75, #76, #77, #78, #79 |
| 🔵 **BAIXO** | **15** | #19, #20, #31, #32, #43, #44, #45, #53, #54, #55, #69, #70, #80, #81, #82 |
| | **83** | |

Conferência: 5 + 26 + 37 + 15 = **83** ✅ (numeração #1–#83, sem lacunas)

## Por seção do escopo

| # | Seção | Itens | Qtd |
|---|---|---|---|
| 1 | Rotas × chamadas de API | #1, #2, #3, #5 | 4 |
| 2 | Contratos de dados | #1, #2, #4, #7, #15, #16, #17 | 7 |
| 3 | Banco de dados × código | #5, #6, #7, #8, #9, #10, #11, #12, #13, #14, #18 | 11 |
| 4 | Erros e bugs | #21, #22, #23, #25, #26, #27, #28, #31, #32 | 9 |
| 5 | Segurança | #24, #29, #30, #83 | 4 |
| 6 | Configuração e ambiente | #36, #38, #39, #40 | 4 |
| 7 | Dependências | #33, #34, #37, #44 | 4 |
| 8 | Qualidade e consistência | #35, #41, #42, #43, #45 | 5 |
| 9 | Frontend | #46, #49, #52, #53, #54 | 5 |
| 10 | Performance | #47, #50, #51 | 3 |
| 11 | Testes e build | #48, #55 | 2 |
| 12 | URLs amigáveis | #68 | 1 |
| 13 | SEO on-page | #56, #57, #58, #59, #60, #61, #62, #63, #64, #65, #66, #67, #69, #70 | 14 |
| 14 | Textos, idioma e encoding | #71, #75, #76, #81, #82 | 5 |
| 15 | Acessibilidade | #72, #82 | 2 |
| 16 | UX e consistência visual | #74, #80 | 2 |
| 17 | Privacidade e LGPD | #73, #79 | 2 |
| 18 | Observabilidade | #77, #78 | 2 |
| 19 | Pagamentos | — | **não se aplica** |
| 20 | SaaS: planos e trial | — | **não se aplica** |

> A soma por seção (**88**) excede o total de itens (**83**) porque 5 itens são
> contados em duas seções cada — são achados que atendem a dois critérios do
> escopo simultaneamente: #1, #2 (seções 1 e 2), #5, #7 (seções 2/3 e 1/3),
> #82 (seções 14 e 15). Cada um aparece **uma única vez** no corpo do relatório,
> na seção de origem.

## Blocos concluídos

| Bloco | Seções | Status | Achados |
|---|---|---|---|
| **A** | 1, 2, 3 | ✅ concluído | #1–#20 |
| **B** | 4, 5 | ✅ concluído | #21–#32 |
| **C** | 6, 7, 8 | ✅ concluído | #33–#45 |
| **D** | 9, 10, 11 | ✅ concluído | #46–#55 |
| **E** | 12, 13 | ✅ concluído | #56–#70 |
| **F** | 14, 15, 16, 17, 18 | ✅ concluído | #71–#82 |
| **G** | 19, 20 | ✅ concluído | não se aplica (com evidência) |
| **H** | revisão final | ✅ concluído | #83 |

---

# Revisão

Conforme exigido pela seção 21:

| Métrica | Valor |
|---|---|
| **Itens registrados** | 83 |
| **Itens reverificados no código** | 41 (todos os 5 CRÍTICO, todos os 26 ALTO, e 10 MÉDIO/BAIXO de formulação inferida) |
| **Falsos positivos removidos** | 1 (`gateStatus` preso em `"loading"` na calculadora — refutado por leitura das linhas 269-326) |
| **Candidatos descartados antes de virarem item** | 4 (`react-dom`/`sharp` como deps não usadas; `font-display`; redirect 307 da raiz; `pages.signIn`) |
| **Descrições corrigidas por imprecisão** | 5 (#20, #29, #43, #52, #64) |
| **Severidades ajustadas** | 5 — rebaixadas: #3 (CRÍTICO→ALTO), #57 (CRÍTICO→ALTO), #73 (CRÍTICO→ALTO); elevadas: #18 (MÉDIO→ALTO), #36 (MÉDIO→ALTO) |
| **Seções com segunda passada** | 7 — seções 1, 4, 5, 11, 13, 14 e 17 |
| **Achados novos na segunda passada** | 1 (#83 — revalidação de `role` no JWT, seção 5) |
| **Referências cruzadas adicionadas** | 14 pares |
| **Seções "não se aplica"** | 2 (19 e 20), com evidência documentada — nenhuma seção omitida |

## Nota de método

Os achados dos Blocos A–D e F derivam de leitura de código e de varreduras
verificáveis (`grep`, `find`, inventário de `export`, `pnpm audit`). Os achados
do Bloco E derivam de **inspeção do HTML de produção realmente servido**: o build
foi executado e servido em `localhost:3111` e 9 rotas foram inspecionadas com
`curl` — nenhuma conclusão de SEO foi deduzida do código-fonte quando podia ser
observada na resposta HTTP. As razões de contraste de #72 foram calculadas pela
fórmula da WCAG 2.1 sobre os valores reais da paleta, não estimadas.

## Limitações declaradas

Três verificações do escopo **não puderam ser concluídas** a partir do
repositório e estão registradas como tal, não como aprovação:

1. **www × sem-www e http→https** (seção 12) — configuração de plataforma
   (Vercel/DNS), inexistente no código. Requer verificação no painel.
2. **Charset/collation do banco** (seção 14) — requer acesso ao PostgreSQL. O
   NeonDB usa UTF-8 por padrão e o Prisma sempre transmite UTF-8, mas isso não
   foi confirmado na instância real.
3. **Mapa de redirects da migração "VK2"** (#68) — depende das URLs indexadas do
   site anterior, obtidas no Search Console. Não é derivável do repositório.

Nenhum arquivo do projeto foi modificado durante a Fase 1.
