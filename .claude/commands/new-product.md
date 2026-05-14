Criar um novo produto no CMS.

Quando eu digitar `/new-product`, faça:
1. Pergunte: slug, categoria, nome PT, capacidade, comprimento.
2. Gere a migration Prisma adicionando o registro (seed).
3. Crie os 3 ProductTranslation (PT/EN/ES) com placeholder.
4. Rode `pnpm prisma db seed`.
