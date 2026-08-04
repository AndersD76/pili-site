/**
 * Vincula a produtos e obras a foto que essas páginas já exibem hoje.
 *
 *   node --env-file=.env scripts/link-media.mjs
 *
 * Estado real do código antes deste script:
 *   - `src/lib/product-images.ts` — o mapa `PRODUCT_IMAGES` está VAZIO; os 18
 *     produtos caem todos no mesmo `/images/tombador-pili.jpg`
 *   - `src/components/marketing/case-card.tsx` — `APPLICATION_IMAGES` mapeia as
 *     cinco aplicações para esse mesmo arquivo
 *
 * Ou seja: existe uma única foto de equipamento no repositório. Este script
 * grava uma cópia dela para cada produto e obra, de modo que o painel mostre o
 * que o site mostra — e a partir daí cada item pode receber a foto própria.
 *
 * Idempotente: item que já tem foto é pulado.
 */
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

/** Arquivo já presente na biblioteca (ver `scripts/import-media.mjs`). */
const ORIGEM = "tombador-pili.jpg";

let vinculados = 0;
let pulados = 0;

try {
  const base = await db.media.findFirst({
    where: { filename: ORIGEM },
    select: { data: true, mimeType: true, size: true, alt: true },
  });

  if (!base) {
    console.error(
      `ERRO: "${ORIGEM}" não está na biblioteca. Rode antes:\n` +
        "  node --env-file=.env scripts/import-media.mjs",
    );
    process.exit(1);
  }

  console.log(`origem: ${ORIGEM} (${(base.size / 1024).toFixed(0)} KB)\n`);

  /* ---------- produtos ---------- */
  console.log("--- produtos ---");
  const produtos = await db.product.findMany({
    select: {
      id: true,
      slug: true,
      translations: { where: { locale: "pt_BR" }, select: { name: true } },
      _count: { select: { media: true } },
    },
    orderBy: { order: "asc" },
  });

  for (const p of produtos) {
    if (p._count.media > 0) {
      console.log(`  = ${p.slug} (já tem foto)`);
      pulados++;
      continue;
    }

    const nome = p.translations[0]?.name ?? p.slug;
    await db.media.create({
      data: {
        data: base.data,
        filename: `produtos/${p.slug}.jpg`,
        mimeType: base.mimeType,
        size: base.size,
        alt: `${nome} — tombador hidráulico PILI Industrial`,
        type: "image",
        order: 0,
        productId: p.id,
      },
    });

    console.log(`  + ${p.slug}`);
    vinculados++;
  }

  /* ---------- obras ---------- */
  console.log("\n--- obras ---");
  const obras = await db.case.findMany({
    select: {
      id: true,
      slug: true,
      client: true,
      location: true,
      _count: { select: { media: true } },
    },
    orderBy: { year: "desc" },
  });

  for (const o of obras) {
    if (o._count.media > 0) {
      console.log(`  = ${o.slug} (já tem foto)`);
      pulados++;
      continue;
    }

    await db.media.create({
      data: {
        data: base.data,
        filename: `obras/${o.slug}.jpg`,
        mimeType: base.mimeType,
        size: base.size,
        alt: `Tombador PILI em operação na ${o.client}, ${o.location}`,
        type: "image",
        order: 0,
        caseId: o.id,
      },
    });

    console.log(`  + ${o.slug}`);
    vinculados++;
  }

  console.log(`\nvinculados: ${vinculados} | já tinham: ${pulados}`);

  const total = await db.media.count();
  const bytes = await db.$queryRawUnsafe(
    'SELECT sum("size")::bigint AS n FROM "Media"',
  );
  console.log(`biblioteca: ${total} arquivos, ${(Number(bytes[0].n) / 1024 / 1024).toFixed(1)} MB`);
} catch (e) {
  console.error("ERRO:", e.message);
  process.exitCode = 1;
} finally {
  await db.$disconnect();
}
