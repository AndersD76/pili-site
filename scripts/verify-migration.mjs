/**
 * Verifica as duas partes mais arriscadas da migração: a extensão `unaccent`
 * (exige privilégio para CREATE EXTENSION) e a conversão para `timestamptz`
 * (que só preserva os valores com o `USING ... AT TIME ZONE 'UTC'`).
 *
 *   node --env-file=.env scripts/verify-migration.mjs
 */
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();
const q = (sql) => db.$queryRawUnsafe(sql);

try {
  console.log("--- extensões ---");
  const ext = await q(
    `SELECT extname FROM pg_extension WHERE extname IN ('unaccent','pg_trgm') ORDER BY 1`,
  );
  console.log("  " + (ext.map((e) => e.extname).join(", ") || "(nenhuma)"));

  console.log("\n--- função pili_unaccent ---");
  const fn = await q(`SELECT pili_unaccent('Construção Agrícola') AS r`);
  console.log(`  pili_unaccent('Construção Agrícola') = '${fn[0].r}'`);

  console.log("\n--- índices de busca ---");
  const idx = await q(
    `SELECT indexname FROM pg_indexes
     WHERE tablename='Lead' AND indexname LIKE '%unaccent%' ORDER BY 1`,
  );
  console.log("  " + (idx.map((i) => i.indexname).join(", ") || "(nenhum)"));

  console.log("\n--- tipo das colunas de data ---");
  const cols = await q(
    `SELECT table_name, column_name, data_type
     FROM information_schema.columns
     WHERE table_schema='public' AND column_name IN ('createdAt','updatedAt')
     ORDER BY table_name, column_name`,
  );
  const semTz = cols.filter((c) => !c.data_type.includes("with time zone"));
  console.log(`  total verificado: ${cols.length}`);
  console.log(`  ainda SEM fuso: ${semTz.length}`);
  if (semTz.length) {
    console.log("  " + semTz.map((c) => `${c.table_name}.${c.column_name}`).join(", "));
  }

  console.log("\n--- amostra de data preservada ---");
  const amostra = await q(
    `SELECT email, "createdAt" AT TIME ZONE 'America/Sao_Paulo' AS brt
     FROM "User" ORDER BY "createdAt" LIMIT 2`,
  );
  for (const r of amostra) {
    const dominio = r.email.split("@")[1];
    console.log(`  usuário @${dominio}: criado em ${r.brt.toISOString().slice(0, 19)} (BRT)`);
  }

  console.log("\n--- FKs criadas ---");
  const fks = await q(
    `SELECT conname FROM pg_constraint
     WHERE conname IN ('Note_authorId_fkey','ClientEquipment_userId_fkey','ServiceOrder_equipmentId_fkey')
     ORDER BY 1`,
  );
  console.log("  " + (fks.map((f) => f.conname).join(", ") || "(nenhuma)"));
} catch (e) {
  console.error("ERRO:", e.message);
  process.exitCode = 1;
} finally {
  await db.$disconnect();
}
