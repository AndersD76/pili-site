/**
 * Monta a base das páginas de mercado de grãos (SEO programático).
 *
 *   node scripts/seo/atualizar-base.mjs
 *
 * Cruza duas fontes oficiais e grava um retrato versionado em src/data/seo/:
 *
 *   - Conab/SICARM: cadastro nacional de armazéns (capacidade estática, tipo,
 *     entidade, município). Arquivo público, atualizado pela própria Conab.
 *   - IBGE/PAM (SIDRA, tabela 1612): produção, área colhida e rendimento de
 *     soja, milho, trigo, arroz e feijão por município.
 *   - IBGE/Localidades: nome, microrregião e UF de cada município.
 *
 * O site nunca consulta essas fontes em tempo de execução nem no build: lê o
 * retrato gravado aqui. Se a Conab ou o IBGE estiverem fora do ar, o deploy
 * não quebra — só este script falha, e o retrato anterior continua valendo.
 *
 * Privacidade: um terço dos armazéns é de pessoa física. Nome, endereço e
 * e-mail de pessoa física nunca saem deste script; essas unidades entram só
 * nos totais. E-mail não é gravado para ninguém.
 *
 * O gate de qualidade também é aplicado aqui, com os limites de
 * src/data/seo/gate.json. Cada entidade recusada vai para
 * data/seo/relatorio-gate.json com o motivo.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const RAIZ = path.resolve(import.meta.dirname, "..", "..");
const SAIDA = path.join(RAIZ, "src", "data", "seo");
const RELATORIO = path.join(RAIZ, "data", "seo");

const CONAB_URL =
  "https://portaldeinformacoes.conab.gov.br/downloads/arquivos/ArmazensCadastrados.txt";
const SIDRA = "https://apisidra.ibge.gov.br/values/t/1612/n6/all";
const LOCALIDADES =
  "https://servicodados.ibge.gov.br/api/v1/localidades/municipios?view=nivelado";

/** Código do produto na tabela 1612 → chave usada no site. */
const CULTURAS = {
  2713: "soja",
  2711: "milho",
  2716: "trigo",
  2692: "arroz",
  2702: "feijao",
};

const gate = JSON.parse(await readFile(path.join(SAIDA, "gate.json"), "utf-8"));

// ------------------------------------------------------------------ util

function slug(texto) {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function baixar(url, tentativas = 3) {
  for (let i = 1; i <= tentativas; i++) {
    try {
      const resposta = await fetch(url, {
        headers: { "User-Agent": "PILI Industrial (https://www.pili.ind.br)" },
        signal: AbortSignal.timeout(180_000),
      });
      if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
      return resposta;
    } catch (err) {
      if (i === tentativas) throw new Error(`${url}: ${err.message}`);
      console.log(`  tentativa ${i} falhou (${err.message}), repetindo...`);
      await new Promise((r) => setTimeout(r, 3000 * i));
    }
  }
}

/** "3861,0" → 3861. O cadastro usa vírgula decimal e, às vezes, ponto de milhar. */
function numeroConab(valor) {
  const limpo = (valor ?? "").trim();
  if (!limpo) return 0;
  const n = Number(limpo.replace(/\./g, "").replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}

/**
 * Valor da SIDRA. "-" é zero absoluto; "..", "..." e "X" são dado
 * indisponível ou sigiloso — e indisponível não é zero.
 */
function numeroSidra(valor) {
  if (valor === "-") return 0;
  const n = Number(valor);
  return Number.isFinite(n) ? n : null;
}

const arred = (n) => (n === null ? null : Math.round(n));

// --------------------------------------------------------------- Conab

console.log("1/4 Conab — cadastro de armazéns");
const respostaConab = await baixar(CONAB_URL);
const conabAtualizadoEm = new Date(
  respostaConab.headers.get("last-modified") ?? Date.now(),
).toISOString();
const bytes = Buffer.from(await respostaConab.arrayBuffer());
let textoConab;
try {
  textoConab = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
} catch {
  textoConab = new TextDecoder("latin1").decode(bytes);
}

const linhasConab = textoConab.split(/\r?\n/).filter((l) => l.trim());
const cabecalho = linhasConab[0].split(";").map((c) => c.trim());
const col = Object.fromEntries(cabecalho.map((c, i) => [c, i]));
const exigidas = [
  "cod_ibge",
  "dsc_especie_armazem",
  "dsc_tipo_entidade",
  "dsc_tipo_pessoa",
  "qtd_capacidade_estatica(t)",
  "nome_armazenador",
];
for (const c of exigidas) {
  if (!(c in col)) throw new Error(`Conab mudou o layout: coluna "${c}" sumiu`);
}

const armazens = [];
for (const linha of linhasConab.slice(1)) {
  const c = linha.split(";").map((v) => v.trim());
  if (c.length < cabecalho.length) continue;
  const pessoa = c[col["dsc_tipo_pessoa"]].toUpperCase();
  armazens.push({
    cod: c[col["cod_ibge"]],
    granel: c[col["dsc_especie_armazem"]].toUpperCase().includes("GRANEL"),
    entidade: c[col["dsc_tipo_entidade"]].toUpperCase(),
    juridica: pessoa.includes("JUR"),
    estatica: numeroConab(c[col["qtd_capacidade_estatica(t)"]]),
    // Nome só de pessoa jurídica. Pessoa física não é identificada.
    nome: pessoa.includes("JUR") ? c[col["nome_armazenador"]] : null,
  });
}
console.log(`  ${armazens.length} armazéns, atualizado em ${conabAtualizadoEm}`);

// ----------------------------------------------------------- Localidades

console.log("2/4 IBGE — localidades");
const localidades = await (await baixar(LOCALIDADES)).json();
const municipioInfo = new Map(
  localidades.map((m) => [
    String(m["municipio-id"]),
    {
      nome: m["municipio-nome"],
      uf: m["UF-sigla"],
      ufNome: m["UF-nome"],
      regiao: m["regiao-nome"],
      micro: m["microrregiao-id"]
        ? { id: m["microrregiao-id"], nome: m["microrregiao-nome"] }
        : { id: m["regiao-imediata-id"], nome: m["regiao-imediata-nome"] },
    },
  ]),
);
console.log(`  ${municipioInfo.size} municípios`);

// ------------------------------------------------------------------ PAM

console.log("3/4 IBGE — produção agrícola municipal");
const produtos = Object.keys(CULTURAS).join(",");
/**
 * A SIDRA recusa (HTTP 400) consultas acima de ~50 mil valores. 5.564
 * municípios × 5 culturas cabe num ano só, então cada ano e cada variável
 * vão em uma chamada.
 */
async function sidra(variavel, periodo) {
  const url = `${SIDRA}/v/${variavel}/p/${periodo}/c81/${produtos}`;
  const dados = await (await baixar(url)).json();
  return dados.slice(1);
}
const producaoAtual = await sidra(214, "last%201"); // quantidade produzida (t)
const ano = Number(producaoAtual[0].D3N);
const anoAnterior = ano - 1;
const [producaoAnterior, area, rendimento] = await Promise.all([
  sidra(214, String(anoAnterior)), // para a variação de um ano para o outro
  sidra(216, "last%201"), // área colhida (ha)
  sidra(112, "last%201"), // rendimento médio (kg/ha)
]);
const producao = [...producaoAtual, ...producaoAnterior];
console.log(`  safra ${ano} (comparação com ${anoAnterior})`);

/** cod → cultura → { t, tAnterior, ha, kgHa } */
const pam = new Map();
function registrar(linhas, campo, filtroAno) {
  for (const l of linhas) {
    const cultura = CULTURAS[l.D4C];
    if (!cultura) continue;
    const anoLinha = Number(l.D3N);
    let destino = campo;
    if (campo === "t" && anoLinha !== filtroAno) {
      if (anoLinha !== anoAnterior) continue;
      destino = "tAnterior";
    }
    const porCultura = pam.get(l.D1C) ?? {};
    porCultura[cultura] ??= { t: null, tAnterior: null, ha: null, kgHa: null };
    porCultura[cultura][destino] = numeroSidra(l.V);
    pam.set(l.D1C, porCultura);
  }
}
registrar(producao, "t", ano);
registrar(area, "ha", ano);
registrar(rendimento, "kgHa", ano);

// -------------------------------------------------------------- agregação

console.log("4/4 cruzando e aplicando o gate");

/** Armazenagem de um conjunto de unidades. */
function resumoArmazens(lista) {
  return {
    unidades: lista.length,
    juridicas: lista.filter((a) => a.juridica).length,
    fisicas: lista.filter((a) => !a.juridica).length,
    granel: lista.filter((a) => a.granel).length,
    convencional: lista.filter((a) => !a.granel).length,
    cooperativas: lista.filter((a) => a.entidade.includes("COOPERATIVA")).length,
    privadas: lista.filter((a) => a.entidade.includes("PRIVADA")).length,
    oficiais: lista.filter((a) => a.entidade.includes("OFICIAL")).length,
    estatica: arred(lista.reduce((s, a) => s + a.estatica, 0)),
  };
}

const armazensPorMunicipio = new Map();
for (const a of armazens) {
  const lista = armazensPorMunicipio.get(a.cod) ?? [];
  lista.push(a);
  armazensPorMunicipio.set(a.cod, lista);
}

// --- empresas (só pessoa jurídica) ---
const porEmpresa = new Map();
for (const a of armazens) {
  if (!a.juridica || !a.nome) continue;
  const lista = porEmpresa.get(a.nome) ?? [];
  lista.push(a);
  porEmpresa.set(a.nome, lista);
}

const relatorio = { municipio: [], municipioCultura: [], ufCultura: [], empresa: [] };

const empresas = [];
const slugsEmpresa = new Set();
for (const [nome, lista] of porEmpresa) {
  const municipiosDaEmpresa = new Set(lista.map((a) => a.cod));
  const motivos = [];
  if (lista.length < gate.empresa.unidadesMinimas) {
    motivos.push(`menos de ${gate.empresa.unidadesMinimas} unidades`);
  }
  if (municipiosDaEmpresa.size < gate.empresa.municipiosMinimos) {
    motivos.push(`menos de ${gate.empresa.municipiosMinimos} municípios`);
  }
  if (motivos.length) {
    relatorio.empresa.push({ nome, unidades: lista.length, motivos });
    continue;
  }
  let s = slug(nome);
  for (let n = 2; slugsEmpresa.has(s); n++) s = `${slug(nome)}-${n}`;
  slugsEmpresa.add(s);

  const porMun = new Map();
  for (const a of lista) {
    const item = porMun.get(a.cod) ?? { cod: a.cod, unidades: 0, estatica: 0 };
    item.unidades += 1;
    item.estatica += a.estatica;
    porMun.set(a.cod, item);
  }
  empresas.push({
    slug: s,
    nome,
    ...resumoArmazens(lista),
    ufs: [...new Set(lista.map((a) => municipioInfo.get(a.cod)?.uf).filter(Boolean))].sort(),
    municipios: [...porMun.values()]
      .map((m) => ({
        cod: m.cod,
        nome: municipioInfo.get(m.cod)?.nome ?? m.cod,
        uf: municipioInfo.get(m.cod)?.uf ?? "",
        unidades: m.unidades,
        estatica: arred(m.estatica),
      }))
      .sort((a, b) => b.estatica - a.estatica),
  });
}
empresas.sort((a, b) => b.estatica - a.estatica);
const empresaPorNome = new Map(empresas.map((e) => [e.nome, e.slug]));

// --- municípios ---
const municipios = [];
for (const [cod, info] of municipioInfo) {
  const culturas = pam.get(cod) ?? {};
  const total = Object.values(culturas).reduce((s, c) => s + (c.t ?? 0), 0);
  const lista = armazensPorMunicipio.get(cod) ?? [];

  if (total < gate.municipio.producaoMinimaT) {
    relatorio.municipio.push({
      cod,
      nome: `${info.nome} (${info.uf})`,
      motivos: [
        total === 0
          ? "sem produção de grãos no IBGE"
          : `produção de ${arred(total)} t, abaixo de ${gate.municipio.producaoMinimaT} t`,
      ],
    });
    continue;
  }

  const empresasLocais = new Map();
  for (const a of lista) {
    if (!a.juridica || !a.nome) continue;
    const e = empresasLocais.get(a.nome) ?? { nome: a.nome, unidades: 0, estatica: 0 };
    e.unidades += 1;
    e.estatica += a.estatica;
    empresasLocais.set(a.nome, e);
  }

  const culturasLimpas = {};
  for (const [k, v] of Object.entries(culturas)) {
    if (!v.t) continue;
    culturasLimpas[k] = {
      t: arred(v.t),
      tAnterior: arred(v.tAnterior),
      ha: arred(v.ha),
      kgHa: arred(v.kgHa),
    };
  }

  municipios.push({
    cod,
    nome: info.nome,
    slug: slug(info.nome),
    uf: info.uf,
    micro: info.micro,
    producaoT: arred(total),
    culturas: culturasLimpas,
    armazenagem: resumoArmazens(lista),
    empresas: [...empresasLocais.values()]
      .sort((a, b) => b.estatica - a.estatica)
      .slice(0, 15)
      .map((e) => ({
        nome: e.nome,
        slug: empresaPorNome.get(e.nome) ?? null,
        unidades: e.unidades,
        estatica: arred(e.estatica),
      })),
  });
}
municipios.sort((a, b) => b.producaoT - a.producaoT);

// Gate por cultura: cada município só ganha página da cultura que realmente colhe.
for (const m of municipios) {
  for (const [cultura, dado] of Object.entries(m.culturas)) {
    dado.pagina = dado.t >= gate.municipioCultura.producaoMinimaT;
    if (!dado.pagina) {
      relatorio.municipioCultura.push({
        cod: m.cod,
        nome: `${m.nome} (${m.uf})`,
        cultura,
        motivos: [`${dado.t} t, abaixo de ${gate.municipioCultura.producaoMinimaT} t`],
      });
    }
  }
}

// --- UFs (todos os municípios entram no total, não só os com página) ---
const ufs = new Map();
for (const [cod, info] of municipioInfo) {
  const u = ufs.get(info.uf) ?? {
    sigla: info.uf,
    nome: info.ufNome,
    regiao: info.regiao,
    culturas: {},
    armazens: [],
  };
  for (const [k, v] of Object.entries(pam.get(cod) ?? {})) {
    const c = (u.culturas[k] ??= { t: 0, tAnterior: 0, ha: 0 });
    c.t += v.t ?? 0;
    c.tAnterior += v.tAnterior ?? 0;
    c.ha += v.ha ?? 0;
  }
  u.armazens.push(...(armazensPorMunicipio.get(cod) ?? []));
  ufs.set(info.uf, u);
}
const listaUfs = [...ufs.values()]
  .map((u) => {
    const culturas = {};
    for (const [k, v] of Object.entries(u.culturas)) {
      if (!v.t) continue;
      culturas[k] = {
        t: arred(v.t),
        tAnterior: arred(v.tAnterior),
        ha: arred(v.ha),
        pagina: v.t >= gate.ufCultura.producaoMinimaT,
      };
      if (!culturas[k].pagina) {
        relatorio.ufCultura.push({
          uf: u.sigla,
          cultura: k,
          motivos: [`${arred(v.t)} t, abaixo de ${gate.ufCultura.producaoMinimaT} t`],
        });
      }
    }
    return {
      sigla: u.sigla,
      slug: u.sigla.toLowerCase(),
      nome: u.nome,
      regiao: u.regiao,
      producaoT: arred(Object.values(u.culturas).reduce((s, c) => s + c.t, 0)),
      culturas,
      armazenagem: resumoArmazens(u.armazens),
      municipiosComPagina: municipios.filter((m) => m.uf === u.sigla).length,
    };
  })
  .sort((a, b) => b.producaoT - a.producaoT);

// Unicidade de slug de município dentro da UF (homônimos existem no país, não na UF).
const vistos = new Set();
for (const m of municipios) {
  const chave = `${m.uf}/${m.slug}`;
  if (vistos.has(chave)) m.slug = `${m.slug}-${m.cod}`;
  vistos.add(`${m.uf}/${m.slug}`);
}

// --- portes de unidade (sacas de 60 kg) ---
// Para cada porte, quantos armazéns do cadastro têm capacidade parecida
// (±25%). É o que ancora a página de porte em dado real, não só em conta.
const PORTES_SACAS = [10000, 20000, 30000, 50000, 80000, 100000, 150000, 200000, 300000, 500000];
const portes = PORTES_SACAS.map((sacas) => {
  const t = (sacas * 60) / 1000;
  const parecidos = armazens.filter((a) => a.estatica >= t * 0.75 && a.estatica <= t * 1.25);
  return {
    sacas,
    t,
    armazensParecidos: parecidos.length,
    granel: parecidos.filter((a) => a.granel).length,
    cooperativas: parecidos.filter((a) => a.entidade.includes("COOPERATIVA")).length,
    fisicas: parecidos.filter((a) => !a.juridica).length,
    // Municípios com página cujo déficit sozinho já cabe uma unidade deste porte.
    municipiosComDeficitMaior: municipios.filter(
      (m) => m.producaoT - m.armazenagem.estatica >= t,
    ).length,
  };
});

const brasil = {
  producaoT: arred(listaUfs.reduce((s, u) => s + u.producaoT, 0)),
  armazenagem: resumoArmazens(armazens),
  municipiosProdutores: [...pam.values()].filter((c) =>
    Object.values(c).some((v) => (v.t ?? 0) > 0),
  ).length,
};

const meta = {
  geradoEm: new Date().toISOString(),
  conab: { url: CONAB_URL, atualizadoEm: conabAtualizadoEm },
  ibge: { tabela: 1612, pesquisa: "Produção Agrícola Municipal (PAM)", ano, anoAnterior },
  totais: {
    municipios: municipios.length,
    municipioCultura: municipios.reduce(
      (s, m) => s + Object.values(m.culturas).filter((c) => c.pagina).length,
      0,
    ),
    ufs: listaUfs.length,
    ufCultura: listaUfs.reduce(
      (s, u) => s + Object.values(u.culturas).filter((c) => c.pagina).length,
      0,
    ),
    empresas: empresas.length,
  },
};

await mkdir(SAIDA, { recursive: true });
await mkdir(RELATORIO, { recursive: true });
const gravar = (nome, dado) =>
  writeFile(path.join(SAIDA, nome), JSON.stringify(dado) + "\n", "utf-8");
await gravar("meta.json", meta);
await gravar("brasil.json", brasil);
await gravar("ufs.json", listaUfs);
await gravar("municipios.json", municipios);
await gravar("empresas.json", empresas);
await gravar("portes.json", portes);
await writeFile(
  path.join(RELATORIO, "relatorio-gate.json"),
  JSON.stringify(
    {
      geradoEm: meta.geradoEm,
      recusados: Object.fromEntries(
        Object.entries(relatorio).map(([k, v]) => [k, v.length]),
      ),
      detalhe: relatorio,
    },
    null,
    1,
  ) + "\n",
  "utf-8",
);

console.log("\nPáginas que passaram no gate:");
for (const [k, v] of Object.entries(meta.totais)) console.log(`  ${k}: ${v}`);
console.log("Recusados:");
for (const [k, v] of Object.entries(relatorio)) console.log(`  ${k}: ${v.length}`);
