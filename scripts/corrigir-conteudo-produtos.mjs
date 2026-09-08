/**
 * Corrige o conteúdo de produtos que o catálogo em PDF expôs.
 *
 *   node --env-file=.env scripts/corrigir-conteudo-produtos.mjs          # simula
 *   node --env-file=.env scripts/corrigir-conteudo-produtos.mjs --aplicar
 *
 * O que arruma:
 *   1. Acentuação do pt-BR. O seed original gravou "Operacao pesada para
 *      terminais graneleiros"; os textos corretos sempre estiveram em
 *      src/lib/data/products.ts e nunca chegaram ao banco.
 *   2. Textos dos produtos cadastrados direto no painel, que entraram com
 *      tagline de rascunho ("tombador coco", "volcador-papas-frutas").
 *   3. Espanhol neutro para a América Latina: "bitrenes" no lugar de "trenes
 *      de carretera" e "granallado" no lugar de "arenado".
 *   4. Galeria: remove imagens geradas por IA e a foto do 26 m que estava
 *      cadastrada no 30 m, e reordena as fotos do cilindro externo.
 *
 * Idempotente.
 */
import { PrismaClient } from "@prisma/client";
import { readFile, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { pathToFileURL } from "node:url";
import path from "node:path";

const db = new PrismaClient();
const RAIZ = path.resolve(import.meta.dirname, "..");
const APLICAR = process.argv.includes("--aplicar");

let mudancas = 0;
function registrar(descricao) {
  mudancas += 1;
  console.log(`${APLICAR ? "  " : "  [simulação] "}${descricao}`);
}

const semAcento = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "");

/**
 * Lê o products.ts como módulo. O Node não importa TypeScript, mas o arquivo
 * é JS válido depois de tirar a interface e a anotação de tipo.
 */
async function lerProdutosTs() {
  const texto = (
    await readFile(path.join(RAIZ, "src", "lib", "data", "products.ts"), "utf-8")
  ).replace(/\r\n/g, "\n");
  // Só o array interessa: o resto do arquivo tem tipos que o Node não entende.
  const inicio = texto.indexOf("export const PRODUCTS");
  const fim = texto.indexOf("\n];", inicio) + "\n];".length;
  const js = texto
    .slice(inicio, fim)
    .replace("PRODUCTS: ProductData[] =", "PRODUCTS =");

  const destino = path.join(tmpdir(), `pili-products-${process.pid}.mjs`);
  await writeFile(destino, js, "utf-8");
  try {
    return (await import(pathToFileURL(destino).href)).PRODUCTS;
  } finally {
    await rm(destino, { force: true });
  }
}

/** 1. Acentuação do pt-BR, a partir do arquivo de dados. */
async function corrigirAcentos() {
  console.log("\n1. Acentuação do pt-BR");
  const fonte = await lerProdutosTs();

  for (const item of fonte) {
    const slug = semAcento(item.slug);
    const produto = await db.product.findUnique({
      where: { slug },
      select: {
        id: true,
        translations: {
          where: { locale: "pt_BR" },
          select: { id: true, name: true, tagline: true, description: true },
        },
        features: {
          where: { locale: "pt_BR" },
          orderBy: { order: "asc" },
          select: { id: true, title: true, description: true },
        },
      },
    });
    if (!produto) {
      console.log(`  ! ${slug}: não existe no banco, ignorado`);
      continue;
    }

    const t = produto.translations[0];
    if (
      t &&
      (t.name !== item.name ||
        t.tagline !== item.tagline ||
        t.description !== item.description)
    ) {
      registrar(`${slug}: texto pt-BR reacentuado`);
      if (APLICAR) {
        await db.productTranslation.update({
          where: { id: t.id },
          data: {
            name: item.name,
            tagline: item.tagline,
            description: item.description,
          },
        });
      }
    }

    // Só casa por posição quando a quantidade bate — ordem é a mesma do seed.
    if (produto.features.length === item.features.length) {
      for (const [i, f] of produto.features.entries()) {
        const origem = item.features[i];
        if (f.title === origem.title && f.description === origem.description) {
          continue;
        }
        registrar(`${slug}: diferencial "${origem.title}" reacentuado`);
        if (APLICAR) {
          await db.feature.update({
            where: { id: f.id },
            data: { title: origem.title, description: origem.description },
          });
        }
      }
    } else if (produto.features.length > 0) {
      console.log(
        `  ! ${slug}: ${produto.features.length} diferenciais no banco x ${item.features.length} no arquivo, revisar à mão`,
      );
    }
  }
}

/**
 * 2. Produtos cadastrados pelo painel, com tagline de rascunho.
 * `es: null` significa "criar a tradução que falta".
 */
const TEXTOS = {
  "tombador-26m": {
    pt_BR: {
      name: "Tombador 26m Cilindro Externo",
      tagline: "Cilindros hidráulicos externos, com acesso direto",
      description:
        "Tombador fixo de 26 metros com os cilindros hidráulicos montados fora da estrutura da plataforma, o que deixa os pontos de inspeção, lubrificação e troca de vedações ao alcance direto da equipe de manutenção.",
    },
    es: {
      name: "Volcador 26m Cilindro Externo",
      tagline: "Cilindros hidráulicos externos, con acceso directo",
      description:
        "Volcador fijo de 26 metros con los cilindros hidráulicos montados fuera de la estructura de la plataforma, lo que deja los puntos de inspección, lubricación y cambio de sellos al alcance directo del equipo de mantenimiento.",
    },
  },
  "trava-chassi-21m-movel-patenteado": {
    pt_BR: {
      name: "Trava Chassi Patenteado para Tombador Móvel 21m",
      tagline: "Sistema patenteado de travamento de chassi",
      description:
        "Sistema de trava de chassi projetado para atender à necessidade do tombador móvel de 21 metros, garantindo exclusividade de produção desse tipo de plataforma para a PILI Industrial.",
    },
    es: {
      name: "Traba de Chasis Patentada para Volcador Móvil 21m",
      tagline: "Sistema patentado de trabado de chasis",
      description:
        "Sistema de traba de chasis diseñado para atender la necesidad del volcador móvil de 21 metros, garantizando exclusividad de producción de ese tipo de plataforma para PILI Industrial.",
    },
  },
  "coletor-de-amostra-de-graos-movel": {
    pt_BR: {
      name: "Coletor de Amostra de Grãos Móvel",
      tagline: "Amostragem móvel para pontos de recebimento",
      description:
        "Sistema pneumático de coleta de amostras de grãos com profundidade de até 2,5 metros.",
    },
    es: {
      name: "Calador de Muestras de Granos Móvil",
      tagline: "Muestreo móvil para puntos de recepción",
      description:
        "Sistema neumático de toma de muestras de granos con profundidad de hasta 2,5 metros.",
    },
  },
  "tombador-com-sistema-de-pesagem": {
    pt_BR: {
      name: "Tombador com sistema de pesagem",
      tagline: "Pesagem por células de carga integrada à plataforma",
      description:
        "Tombador com sistema de pesagem por células de carga integrado à plataforma.",
    },
    es: {
      name: "Volcador con sistema de pesaje",
      tagline: "Pesaje por celdas de carga integrado a la plataforma",
      description:
        "Volcador con sistema de pesaje por celdas de carga integrado a la plataforma.",
    },
  },
  "tombador-de-batatas": {
    pt_BR: {
      name: "Tombador de Batatas",
      tagline: "Descarga de batatas e outras hortifrútis",
      description:
        "Tombador desenvolvido para a descarga de batatas e outras hortifrútis.",
    },
    es: {
      name: "Volcador de Papas",
      tagline: "Descarga de papas y otras frutas y hortalizas",
      description:
        "Volcador desarrollado para la descarga de papas y otras frutas y hortalizas.",
    },
  },
  "tombador-industria-de-sucos": {
    pt_BR: {
      name: "Tombador Indústria de Sucos",
      tagline: "Descarga para a indústria de água de coco e sucos",
      description:
        "Tombador para a indústria de sucos, aplicado na descarga de coco para a produção de água de coco.",
    },
    es: {
      name: "Volcador Industria de Jugos",
      tagline: "Descarga para la industria de agua de coco y jugos",
      description:
        "Volcador para la industria de jugos, aplicado en la descarga de coco para la producción de agua de coco.",
    },
  },
};

async function corrigirTextosDoPainel() {
  console.log("\n2. Textos cadastrados pelo painel");
  for (const [slug, porLocale] of Object.entries(TEXTOS)) {
    const produto = await db.product.findUnique({
      where: { slug },
      select: { id: true, translations: true },
    });
    if (!produto) {
      console.log(`  ! ${slug}: não existe no banco, ignorado`);
      continue;
    }

    for (const [locale, texto] of Object.entries(porLocale)) {
      const atual = produto.translations.find((t) => t.locale === locale);
      if (!atual) {
        registrar(`${slug}: tradução ${locale} criada`);
        if (APLICAR) {
          await db.productTranslation.create({
            data: { productId: produto.id, locale, ...texto },
          });
        }
        continue;
      }
      if (
        atual.name === texto.name &&
        atual.tagline === texto.tagline &&
        atual.description === texto.description
      ) {
        continue;
      }
      registrar(`${slug}: texto ${locale} revisado`);
      if (APLICAR) {
        await db.productTranslation.update({
          where: { id: atual.id },
          data: texto,
        });
      }
    }
  }
}

/** 3. Espanhol neutro da América Latina. */
const TERMOS_LATAM = [
  ["trenes de carretera", "bitrenes"],
  ["Trenes de carretera", "Bitrenes"],
  ["arenado", "granallado"],
  ["Arenado", "Granallado"],
];

function paraLatam(texto) {
  if (!texto) return texto;
  return TERMOS_LATAM.reduce(
    (acc, [de, para]) => acc.split(de).join(para),
    texto,
  );
}

async function corrigirEspanhol() {
  console.log("\n3. Espanhol da América Latina");

  const traducoes = await db.productTranslation.findMany({
    where: { locale: "es" },
    select: { id: true, tagline: true, description: true },
  });
  for (const t of traducoes) {
    const tagline = paraLatam(t.tagline);
    const description = paraLatam(t.description);
    if (tagline === t.tagline && description === t.description) continue;
    registrar(`tradução es ${t.id}: termos regionais ajustados`);
    if (APLICAR) {
      await db.productTranslation.update({
        where: { id: t.id },
        data: { tagline, description },
      });
    }
  }

  const features = await db.feature.findMany({
    where: { locale: "es" },
    select: { id: true, title: true, description: true },
  });
  for (const f of features) {
    const title = paraLatam(f.title);
    const description = paraLatam(f.description);
    if (title === f.title && description === f.description) continue;
    registrar(`diferencial es "${f.title}": termos regionais ajustados`);
    if (APLICAR) {
      await db.feature.update({
        where: { id: f.id },
        data: { title, description },
      });
    }
  }
}

/**
 * 4. Galeria.
 *
 * As `Gemini_Generated_*` são imagens de IA em galerias de equipamento real —
 * não podem ir para material comercial. A `tombador26m.jpg` no 30 m é a mesma
 * foto do 26 m, byte a byte.
 */
const MIDIA_PARA_REMOVER = [
  { slug: null, prefixo: "Gemini_Generated" },
  { slug: "tombador-30m-fixo", filename: "tombador26m.jpg" },
];

/** Ordem editorial das fotos do cilindro externo, da melhor para a pior. */
const ORDEM_26M = [
  "WhatsApp Image 2026-06-17 at 17.28.40 (3).jpeg",
  "WhatsApp Image 2026-06-17 at 17.28.41.jpeg",
  "WhatsApp Image 2026-06-17 at 17.28.37.jpeg",
  "WhatsApp Image 2026-06-17 at 17.28.39.jpeg",
  "WhatsApp Image 2026-06-17 at 17.28.40 (1).jpeg",
  "WhatsApp Image 2026-06-17 at 17.28.41 (1).jpeg",
  "WhatsApp Image 2026-06-17 at 17.28.40 (2).jpeg",
  "WhatsApp Image 2026-06-17 at 17.28.40.jpeg",
  "WhatsApp Image 2026-06-17 at 17.28.39 (1).jpeg",
  "WhatsApp Image 2026-06-17 at 17.28.39 (2).jpeg",
];

async function corrigirGaleria() {
  console.log("\n4. Galeria");

  for (const regra of MIDIA_PARA_REMOVER) {
    const where = {
      ...(regra.prefixo ? { filename: { startsWith: regra.prefixo } } : {}),
      ...(regra.filename ? { filename: regra.filename } : {}),
      ...(regra.slug ? { product: { slug: regra.slug } } : {}),
      productId: { not: null },
    };
    const achadas = await db.media.findMany({
      where,
      select: { id: true, filename: true, product: { select: { slug: true } } },
    });
    for (const m of achadas) {
      registrar(`${m.product?.slug}: removida "${m.filename}"`);
      if (APLICAR) await db.media.delete({ where: { id: m.id } });
    }
  }

  // Fotos idênticas repetidas dentro do mesmo produto.
  const duplicadas = await db.$queryRaw`
    SELECT m.id, m.filename, p.slug
    FROM "Media" m
    JOIN "Product" p ON p.id = m."productId"
    WHERE m.id NOT IN (
      SELECT MIN(id) FROM "Media"
      WHERE "productId" IS NOT NULL
      GROUP BY "productId", filename, size
    )
    AND m."productId" IS NOT NULL
  `;
  for (const m of duplicadas) {
    registrar(`${m.slug}: removida cópia duplicada de "${m.filename}"`);
    if (APLICAR) await db.media.delete({ where: { id: m.id } });
  }

  const cilindro = await db.product.findUnique({
    where: { slug: "tombador-26m" },
    select: { media: { select: { id: true, filename: true, order: true } } },
  });
  if (cilindro) {
    for (const [i, filename] of ORDEM_26M.entries()) {
      const foto = cilindro.media.find((m) => m.filename === filename);
      if (!foto || foto.order === i) continue;
      registrar(`tombador-26m: "${filename}" para a posição ${i}`);
      if (APLICAR) {
        await db.media.update({ where: { id: foto.id }, data: { order: i } });
      }
    }
  }
}

try {
  await corrigirAcentos();
  await corrigirTextosDoPainel();
  await corrigirEspanhol();
  await corrigirGaleria();
  console.log(
    `\n${mudancas} alteração(ões) ${APLICAR ? "aplicadas" : "pendentes — rode com --aplicar"}.`,
  );
} finally {
  await db.$disconnect();
}
