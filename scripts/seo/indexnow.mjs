/**
 * Avisa Bing e Yandex (IndexNow) sobre páginas novas ou alteradas.
 *
 *   node scripts/seo/indexnow.mjs            # envia só o que mudou
 *   node scripts/seo/indexnow.mjs --tudo     # reenvia todas as URLs
 *
 * Rode depois do deploy: lê o índice de sitemaps de produção, compara com o
 * que já foi enviado (data/seo/indexnow-enviadas.json) e manda só as URLs
 * novas ou com `lastmod` diferente. O Google não usa IndexNow — para ele, o
 * caminho é o sitemap enviado no Search Console.
 *
 * A chave é o arquivo public/<chave>.txt; o protocolo exige que ela esteja
 * publicada no próprio domínio.
 */
import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const RAIZ = path.resolve(import.meta.dirname, "..", "..");
const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.pili.ind.br";
const REGISTRO = path.join(RAIZ, "data", "seo", "indexnow-enviadas.json");
const LOTE = 10_000; // limite do protocolo por requisição
const TUDO = process.argv.includes("--tudo");

const arquivos = await readdir(path.join(RAIZ, "public"));
const chaveArquivo = arquivos.find((a) => /^[a-f0-9]{32}\.txt$/.test(a));
if (!chaveArquivo) throw new Error("Chave do IndexNow não encontrada em public/");
const chave = chaveArquivo.replace(".txt", "");

async function texto(url) {
  const r = await fetch(url, { signal: AbortSignal.timeout(60_000) });
  if (!r.ok) throw new Error(`${url}: HTTP ${r.status}`);
  return r.text();
}

// Confere se a chave está no ar antes de gastar a cota.
const publicada = (await texto(`${SITE}/${chaveArquivo}`)).trim();
if (publicada !== chave) throw new Error("A chave publicada não confere com a local");

const indice = await texto(`${SITE}/sitemap.xml`);
const filhos = [...indice.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const atuais = new Map();
for (const filho of filhos) {
  const xml = await texto(filho);
  for (const [, loc, lastmod] of xml.matchAll(
    /<url><loc>([^<]+)<\/loc>(?:<lastmod>([^<]+)<\/lastmod>)?/g,
  )) {
    atuais.set(loc, lastmod ?? "");
  }
}
console.log(`${atuais.size} URLs nos sitemaps de ${SITE}`);

let enviadas = {};
try {
  enviadas = JSON.parse(await readFile(REGISTRO, "utf-8"));
} catch {
  /* primeira execução */
}

const pendentes = [...atuais.entries()]
  .filter(([url, lastmod]) => TUDO || enviadas[url] !== lastmod)
  .map(([url]) => url);
console.log(`${pendentes.length} para enviar`);

const host = new URL(SITE).host;
for (let i = 0; i < pendentes.length; i += LOTE) {
  const lote = pendentes.slice(i, i + LOTE);
  const r = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host,
      key: chave,
      keyLocation: `${SITE}/${chaveArquivo}`,
      urlList: lote,
    }),
  });
  // 200 e 202 são aceite; 429 é excesso de envio — melhor parar e repetir depois.
  console.log(`lote ${i / LOTE + 1}: ${lote.length} URLs → HTTP ${r.status}`);
  if (r.status !== 200 && r.status !== 202) {
    throw new Error(`IndexNow recusou o lote: ${r.status} ${await r.text()}`);
  }
  for (const url of lote) enviadas[url] = atuais.get(url);
}

await mkdir(path.dirname(REGISTRO), { recursive: true });
await writeFile(REGISTRO, JSON.stringify(enviadas, null, 1) + "\n", "utf-8");
console.log("Registro atualizado.");
