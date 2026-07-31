/**
 * Inspeção somente-leitura do banco, para decidir com segurança como aplicar as
 * migrations. Não altera nada.
 *
 *   node scripts/inspect-db.mjs
 */
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();
const q = (sql) => db.$queryRawUnsafe(sql);

try {
  const tabelas = await q(
    `SELECT table_name FROM information_schema.tables
     WHERE table_schema='public' ORDER BY 1`,
  );
  console.log(`TABELAS (${tabelas.length}):`);
  console.log("  " + tabelas.map((t) => t.table_name).join(", "));

  const temMig = tabelas.some((t) => t.table_name === "_prisma_migrations");
  console.log(`\n_prisma_migrations existe: ${temMig}`);
  if (temMig) {
    const rows = await q(
      `SELECT migration_name, finished_at IS NOT NULL AS ok
       FROM "_prisma_migrations" ORDER BY started_at`,
    );
    console.log(
      "  registros: " +
        (rows.length
          ? rows.map((r) => r.migration_name + (r.ok ? "" : " [INCOMPLETA]")).join(", ")
          : "(vazio)"),
    );
  }

  console.log("\n--- o que o código novo exige ---");
  for (const [t, c] of [
    ["Lead", "deletedAt"],
    ["Lead", "consentAt"],
    ["Lead", "anonymizedAt"],
  ]) {
    const r = await q(
      `SELECT 1 FROM information_schema.columns
       WHERE table_name='${t}' AND column_name='${c}'`,
    );
    console.log(`  ${t}.${c}: ${r.length ? "JÁ EXISTE" : "faltando"}`);
  }

  const ph = await q(
    `SELECT is_nullable FROM information_schema.columns
     WHERE table_name='Lead' AND column_name='phone'`,
  );
  console.log(`  Lead.phone aceita nulo: ${ph[0]?.is_nullable ?? "(coluna ausente)"}`);

  const en = await q(
    `SELECT enumlabel FROM pg_enum e JOIN pg_type t ON t.oid=e.enumtypid
     WHERE t.typname='LeadSource' ORDER BY e.enumsortorder`,
  );
  console.log(`  LeadSource: ${en.map((r) => r.enumlabel).join(", ") || "(enum ausente)"}`);

  console.log("\n--- volume de dados ---");
  for (const t of [
    "User", "Lead", "Note", "Product", "Case", "Post",
    "ClientEquipment", "ServiceOrder", "Media",
  ]) {
    try {
      const r = await q(`SELECT count(*)::int AS n FROM "${t}"`);
      console.log(`  ${t}: ${r[0].n}`);
    } catch {
      console.log(`  ${t}: (tabela ausente)`);
    }
  }

  console.log("\n--- LINHAS ÓRFÃS (bloqueiam as FKs da migration) ---");
  try {
    const o1 = await q(
      `SELECT count(*)::int AS n FROM "Note" n
       LEFT JOIN "User" u ON u.id=n."authorId" WHERE u.id IS NULL`,
    );
    console.log(`  Note sem User: ${o1[0].n}`);
  } catch (e) {
    console.log(`  Note: ${e.message.split("\n")[0]}`);
  }
  try {
    const o2 = await q(
      `SELECT count(*)::int AS n FROM "ClientEquipment" e
       LEFT JOIN "User" u ON u.id=e."userId" WHERE u.id IS NULL`,
    );
    console.log(`  ClientEquipment sem User: ${o2[0].n}`);
  } catch (e) {
    console.log(`  ClientEquipment: ${e.message.split("\n")[0]}`);
  }
} catch (e) {
  console.error("ERRO:", e.message);
  process.exitCode = 1;
} finally {
  await db.$disconnect();
}
