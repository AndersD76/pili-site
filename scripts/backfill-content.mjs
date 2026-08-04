/**
 * Preenche no banco os dados que só existiam nos arquivos estáticos.
 *
 *   node --env-file=.env scripts/backfill-content.mjs
 *
 * O seed original criou produtos, obras e artigos, mas deixou de fora:
 *   - a tabela `Application` e as relações produto↔aplicação (0 vínculos)
 *   - `Case.applicationId` (NULL em todas as obras)
 *   - `Post.category` e `Post.readTime` (colunas recém-criadas)
 *
 * Sem isso o site não pode ler o conteúdo do banco: `/solucoes/[setor]` filtra
 * produtos por aplicação e o blog filtra por categoria.
 *
 * Idempotente.
 */
import { PrismaClient } from "@prisma/client";
import { readFile } from "node:fs/promises";
import path from "node:path";

const db = new PrismaClient();
const RAIZ = path.resolve(import.meta.dirname, "..");

/** Lê um `.ts` de dados como texto — o Node não importa TypeScript. */
async function lerFonte(nome) {
  return (
    await readFile(path.join(RAIZ, "src", "lib", "data", nome), "utf-8")
  ).replace(/\r\n/g, "\n");
}

/** Divide o array em blocos por item de primeiro nível. */
function blocos(fonte) {
  return fonte.split(/\n  \{\n/).slice(1);
}

const APLICACOES = {
  porto: { nome: "Porto", desc: "Terminais portuários de alto fluxo" },
  cooperativa: { nome: "Cooperativa", desc: "Recebimento e armazenagem de grãos" },
  industria: { nome: "Indústria alimentícia", desc: "Processamento e moagem" },
  fertilizante: { nome: "Fertilizante", desc: "Descarga de insumos agrícolas" },
  cimento: { nome: "Cimento", desc: "Clínquer e materiais de alta densidade" },
};

try {
  /* ---------- 1. tabela Application ---------- */
  console.log("--- aplicações ---");
  const idPorSlug = new Map();

  for (const [slug, { nome, desc }] of Object.entries(APLICACOES)) {
    const app = await db.application.upsert({
      where: { slug },
      update: {},
      create: {
        slug,
        translations: {
          create: { locale: "pt_BR", name: nome, description: desc },
        },
      },
      select: { id: true },
    });
    idPorSlug.set(slug, app.id);
    console.log(`  ${slug}`);
  }

  /* ---------- 2. produto ↔ aplicações ---------- */
  console.log("\n--- produtos ---");
  const fonteProd = await lerFonte("products.ts");
  let vinculosProduto = 0;

  for (const bloco of blocos(fonteProd)) {
    const slug = bloco.match(/slug:\s*"([^"]+)"/)?.[1];
    if (!slug) continue;

    const lista = bloco.match(/applications:\s*\[([^\]]*)\]/)?.[1] ?? "";
    const apps = [...lista.matchAll(/"([^"]+)"/g)]
      .map((m) => m[1])
      .filter((a) => idPorSlug.has(a));

    if (apps.length === 0) continue;

    // `products.ts` tem slugs acentuados ("tombador-10m-móvel") enquanto o
    // banco guarda a forma sem acento, que é a correta para URL. Tenta as duas.
    const semAcento = slug.normalize("NFD").replace(/[̀-ͯ]/g, "");

    const produto =
      (await db.product.findUnique({
        where: { slug },
        select: { id: true, _count: { select: { applications: true } } },
      })) ??
      (await db.product.findUnique({
        where: { slug: semAcento },
        select: { id: true, _count: { select: { applications: true } } },
      }));
    if (!produto) {
      console.log(`  ! ${slug}: não existe no banco`);
      continue;
    }
    if (produto._count.applications > 0) {
      console.log(`  = ${slug} (já vinculado)`);
      continue;
    }

    await db.product.update({
      where: { id: produto.id },
      data: {
        applications: { connect: apps.map((a) => ({ id: idPorSlug.get(a) })) },
      },
    });
    console.log(`  + ${slug} -> ${apps.join(", ")}`);
    vinculosProduto++;
  }

  /* ---------- 3. obra → aplicação ---------- */
  console.log("\n--- obras ---");
  const fonteCases = await lerFonte("cases.ts");
  let vinculosObra = 0;

  for (const bloco of blocos(fonteCases)) {
    const slug = bloco.match(/slug:\s*"([^"]+)"/)?.[1];
    const app = bloco.match(/application:\s*"([^"]+)"/)?.[1];
    if (!slug || !app || !idPorSlug.has(app)) continue;

    const obra = await db.case.findUnique({
      where: { slug },
      select: { id: true, applicationId: true },
    });
    if (!obra) continue;
    if (obra.applicationId) {
      console.log(`  = ${slug} (já vinculada)`);
      continue;
    }

    await db.case.update({
      where: { id: obra.id },
      data: { applicationId: idPorSlug.get(app) },
    });
    console.log(`  + ${slug} -> ${app}`);
    vinculosObra++;
  }

  /* ---------- 4. categoria e tempo de leitura dos artigos ---------- */
  console.log("\n--- artigos ---");
  const fonteBlog = await lerFonte("blog.ts");
  let artigos = 0;

  for (const bloco of blocos(fonteBlog)) {
    const slug = bloco.match(/slug:\s*"([^"]+)"/)?.[1];
    const categoria = bloco.match(/category:\s*"([^"]+)"/)?.[1];
    const readTime = bloco.match(/readTime:\s*(\d+)/)?.[1];
    const featured = /featured:\s*true/.test(bloco);
    if (!slug) continue;

    const post = await db.post.findUnique({
      where: { slug },
      select: { id: true },
    });
    if (!post) continue;

    await db.post.update({
      where: { id: post.id },
      data: {
        category: categoria ?? "artigo",
        readTime: readTime ? Number(readTime) : 5,
        published: true,
      },
    });
    console.log(`  + ${slug} (${categoria}, ${readTime}min${featured ? ", destaque" : ""})`);
    artigos++;
  }

  console.log(
    `\nprodutos vinculados: ${vinculosProduto} | obras: ${vinculosObra} | artigos: ${artigos}`,
  );
} catch (e) {
  console.error("ERRO:", e.message);
  process.exitCode = 1;
} finally {
  await db.$disconnect();
}
