/**
 * Importa para a tabela `Media` as imagens que hoje estão fixas no código.
 *
 *   node --env-file=.env scripts/import-media.mjs
 *
 * Origem:
 *   1. `public/images/**` — arquivos versionados no repositório
 *   2. capas dos artigos em `src/lib/data/blog.ts`, incluindo as remotas do
 *      Unsplash, que são baixadas e passam a viver no banco
 *
 * Idempotente: um arquivo já importado (mesmo `filename`) é pulado.
 */
import { PrismaClient } from "@prisma/client";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

const db = new PrismaClient();

const RAIZ = path.resolve(import.meta.dirname, "..");
const PUBLIC_IMAGES = path.join(RAIZ, "public", "images");

const MIME_POR_EXT = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".svg": "image/svg+xml",
};

/** Descrições melhores que o nome do arquivo, para `alt`. */
const ALT_CONHECIDO = {
  "tombador-pili.jpg": "Tombador hidráulico PILI descarregando caminhão graneleiro",
  "logo-pili.png": "Logotipo PILI Industrial",
  "logo-pili-white.png": "Logotipo PILI Industrial em branco",
  "hero-tombador.svg": "Ilustração de tombador hidráulico",
  "pili-footer.png": "Tombador PILI em operação",
  "placeholder.svg": "Imagem provisória de equipamento",
  "placeholder-fixo.svg": "Imagem provisória de tombador fixo",
  "placeholder-movel.svg": "Imagem provisória de tombador móvel",
  "placeholder-coletor.svg": "Imagem provisória de coletor de amostras",
  "placeholder-transbordo.svg": "Imagem provisória de unidade de transbordo",
  "placeholder-especial.svg": "Imagem provisória de equipamento especial",
};

async function listarArquivos(dir, prefixo = "") {
  const entradas = await readdir(dir, { withFileTypes: true });
  const arquivos = [];
  for (const e of entradas) {
    const completo = path.join(dir, e.name);
    if (e.isDirectory()) {
      arquivos.push(...(await listarArquivos(completo, `${prefixo}${e.name}/`)));
    } else if (MIME_POR_EXT[path.extname(e.name).toLowerCase()]) {
      arquivos.push({ caminho: completo, nome: prefixo + e.name });
    }
  }
  return arquivos;
}

async function jaImportado(filename) {
  const existe = await db.media.findFirst({
    where: { filename },
    select: { id: true },
  });
  return existe?.id ?? null;
}

async function gravar({ filename, bytes, mimeType, alt, postId }) {
  return db.media.create({
    data: {
      data: Buffer.from(bytes),
      filename,
      mimeType,
      size: bytes.length,
      alt,
      type: "image",
      postId: postId ?? null,
    },
    select: { id: true },
  });
}

let importados = 0;
let pulados = 0;

try {
  /* ---------- 1. arquivos de public/images ---------- */
  console.log("--- arquivos locais ---");
  const arquivos = await listarArquivos(PUBLIC_IMAGES);

  for (const { caminho, nome } of arquivos) {
    if (await jaImportado(nome)) {
      console.log(`  = ${nome} (já importado)`);
      pulados++;
      continue;
    }

    const bytes = await readFile(caminho);
    const mimeType = MIME_POR_EXT[path.extname(nome).toLowerCase()];
    const base = path.basename(nome);

    const { id } = await gravar({
      filename: nome,
      bytes,
      mimeType,
      alt: ALT_CONHECIDO[base] ?? base.replace(/[-_]/g, " ").replace(/\.\w+$/, ""),
    });

    console.log(`  + ${nome} (${(bytes.length / 1024).toFixed(0)} KB) -> ${id}`);
    importados++;
  }

  /* ---------- 2. capas dos artigos ---------- */
  console.log("\n--- capas do blog ---");
  // `blog.ts` é TypeScript e não pode ser importado direto pelo Node. Ler o
  // arquivo como texto e extrair os pares slug/imagem evita depender de um
  // transpilador só para um script de importação pontual.
  // `readFile` não normaliza quebras de linha: o arquivo está em CRLF no
  // Windows e as expressões abaixo esperam LF.
  const fonteBlog = (
    await readFile(path.join(RAIZ, "src", "lib", "data", "blog.ts"), "utf-8")
  ).replace(/\r\n/g, "\n");

  const capas = [];
  // Cada artigo começa com `    slug: "..."`; a capa vem depois, em `image:`,
  // que pode estar na mesma linha ou na seguinte.
  const blocos = fonteBlog.split(/\n  \{\n/).slice(1);
  for (const bloco of blocos) {
    const slug = bloco.match(/slug:\s*"([^"]+)"/)?.[1];
    const url = bloco.match(/image:\s*\n?\s*"([^"]+)"/)?.[1];
    if (slug && url) capas.push({ slug, url });
  }
  console.log(`  ${capas.length} capa(s) encontradas em blog.ts`);

  const posts = await db.post.findMany({ select: { id: true, slug: true } });
  const porSlug = new Map(posts.map((p) => [p.slug, p.id]));

  for (const { slug, url } of capas) {
    const postId = porSlug.get(slug);
    if (!postId) {
      console.log(`  ! ${slug}: artigo não existe no banco`);
      continue;
    }

    // `new URL()` só vale para as remotas; as locais são caminhos relativos.
    const ext = url.startsWith("http")
      ? path.extname(new URL(url).pathname)
      : path.extname(url);
    const filename = `blog/${slug}${ext || ".jpg"}`;
    if (await jaImportado(filename)) {
      console.log(`  = ${filename} (já importado)`);
      pulados++;
      continue;
    }

    let bytes;
    let mimeType = "image/jpeg";

    if (url.startsWith("http")) {
      const res = await fetch(url);
      if (!res.ok) {
        console.log(`  ! ${slug}: download falhou (HTTP ${res.status})`);
        continue;
      }
      bytes = Buffer.from(await res.arrayBuffer());
      mimeType = res.headers.get("content-type")?.split(";")[0] ?? "image/jpeg";
    } else {
      bytes = await readFile(path.join(RAIZ, "public", url));
      mimeType = MIME_POR_EXT[path.extname(url).toLowerCase()] ?? "image/jpeg";
    }

    const { id } = await gravar({ filename, bytes, mimeType, alt: null, postId });
    console.log(`  + ${filename} (${(bytes.length / 1024).toFixed(0)} KB) -> ${id}`);
    importados++;
  }

  console.log(`\nimportados: ${importados} | já existiam: ${pulados}`);
  const total = await db.media.count();
  console.log(`total na biblioteca: ${total}`);
} catch (e) {
  console.error("ERRO:", e.message);
  process.exitCode = 1;
} finally {
  await db.$disconnect();
}
