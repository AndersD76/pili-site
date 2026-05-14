Criar um novo case/obra no CMS.

Quando eu digitar `/new-case`, faça:
1. Pergunte: slug, cliente, localização, ano, setor.
2. Gere a migration Prisma adicionando o registro (seed).
3. Crie os 3 CaseTranslation (PT/EN/ES) com placeholder.
4. Rode `pnpm prisma db seed`.
