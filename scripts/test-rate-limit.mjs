/**
 * Exercita o rate limiting contra o banco real.
 *
 *   node --env-file=.env scripts/test-rate-limit.mjs
 *
 * Usa uma chave descartável e a apaga no fim, para não interferir em contadores
 * de produção.
 */
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();
const CHAVE = `teste:${Date.now()}`;
const LIMITE = 5;
const JANELA = 60;

async function consumir(key, limit, windowSeconds) {
  const rows = await db.$queryRaw`
    INSERT INTO "RateLimit" ("key", "count", "expiresAt")
    VALUES (${key}, 1, now() + make_interval(secs => ${windowSeconds}))
    ON CONFLICT ("key") DO UPDATE SET
      "count" = CASE
        WHEN "RateLimit"."expiresAt" < now() THEN 1
        ELSE "RateLimit"."count" + 1
      END,
      "expiresAt" = CASE
        WHEN "RateLimit"."expiresAt" < now() THEN EXCLUDED."expiresAt"
        ELSE "RateLimit"."expiresAt"
      END
    RETURNING "count", "expiresAt"
  `;
  const { count } = rows[0];
  return { count, permitido: count <= limit };
}

try {
  console.log(`limite: ${LIMITE} por ${JANELA}s\n`);

  for (let i = 1; i <= 7; i++) {
    const r = await consumir(CHAVE, LIMITE, JANELA);
    console.log(
      `  requisicao ${i}: count=${r.count} -> ${r.permitido ? "PERMITIDA" : "BLOQUEADA (429)"}`,
    );
  }

  console.log("\n--- concorrencia: 10 requisicoes simultaneas ---");
  const chaveConc = `${CHAVE}:conc`;
  const res = await Promise.all(
    Array.from({ length: 10 }, () => consumir(chaveConc, LIMITE, JANELA)),
  );
  const contagens = res.map((r) => r.count).sort((a, b) => a - b);
  const semPerda = JSON.stringify(contagens) === JSON.stringify([1,2,3,4,5,6,7,8,9,10]);
  console.log(`  contagens obtidas: ${contagens.join(", ")}`);
  console.log(`  atomico (sem contagem perdida): ${semPerda ? "SIM" : "NAO"}`);
  console.log(`  bloqueadas: ${res.filter((r) => !r.permitido).length} de 10`);

  console.log("\n--- reset (login bem-sucedido) ---");
  await db.$executeRaw`DELETE FROM "RateLimit" WHERE "key" = ${CHAVE}`;
  const depois = await consumir(CHAVE, LIMITE, JANELA);
  console.log(`  apos reset: count=${depois.count} -> ${depois.permitido ? "PERMITIDA" : "BLOQUEADA"}`);
} catch (e) {
  console.error("ERRO:", e.message);
  process.exitCode = 1;
} finally {
  await db.$executeRawUnsafe(`DELETE FROM "RateLimit" WHERE "key" LIKE 'teste:%'`);
  const restantes = await db.$queryRawUnsafe(`SELECT count(*)::int AS n FROM "RateLimit"`);
  console.log(`\nlimpeza feita. linhas na tabela: ${restantes[0].n}`);
  await db.$disconnect();
}
