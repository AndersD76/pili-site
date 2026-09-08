/* eslint-disable jsx-a11y/alt-text -- @react-pdf/renderer Image nao tem prop alt */
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  Font,
  Svg,
  Path,
  Circle,
  Line,
  Polyline,
} from "@react-pdf/renderer";
import { join } from "node:path";
import type { ProductCategory } from "@prisma/client";
import {
  CATEGORIAS,
  TEXTOS,
  traduzirAplicacao,
  traduzirChave,
  traduzirValor,
  type LocaleCatalogo,
  type TextosCatalogo,
} from "./catalogo-i18n";

const RED = "#E31E24";
const BLACK = "#0A0A0A";
const GRAPHITE = "#1A1A1A";
const STEEL = "#2A2A2A";
const CONCRETE = "#6B6B6B";
const CEMENT = "#9A9A9A";
const MIST = "#D4D4D4";
const PAPER = "#F5F5F5";
const WHITE = "#FFFFFF";

const MARGEM = 40;

/**
 * Fontes da marca embarcadas em public/fonts.
 *
 * O @react-pdf so entrega as Helvetica nativas sem registro, e o catalogo
 * precisa sair na mesma tipografia do site: Montserrat no texto e JetBrains
 * Mono nos numeros tecnicos.
 */
let fontesRegistradas = false;
function registrarFontes() {
  if (fontesRegistradas) return;
  const dir = join(process.cwd(), "public", "fonts");
  Font.register({
    family: "Montserrat",
    fonts: [
      { src: join(dir, "Montserrat-Regular.ttf"), fontWeight: 400 },
      { src: join(dir, "Montserrat-SemiBold.ttf"), fontWeight: 600 },
      { src: join(dir, "Montserrat-Bold.ttf"), fontWeight: 700 },
    ],
  });
  Font.register({
    family: "JetBrainsMono",
    fonts: [{ src: join(dir, "JetBrainsMono-Bold.ttf"), fontWeight: 700 }],
  });
  // Sem isto o react-pdf hifeniza no meio da palavra ("Especifica-coes").
  Font.registerHyphenationCallback((palavra) => [palavra]);
  fontesRegistradas = true;
}

const s = StyleSheet.create({
  page: { fontFamily: "Montserrat", fontSize: 9, color: BLACK },

  barra: {
    height: 30,
    backgroundColor: RED,
    paddingHorizontal: MARGEM,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  barraTexto: { fontSize: 8, fontWeight: 700, color: WHITE, letterSpacing: 2 },

  hero: { width: "100%", objectFit: "cover" },
  heroVazio: {
    width: "100%",
    backgroundColor: GRAPHITE,
    alignItems: "center",
    justifyContent: "center",
  },
  heroVazioTexto: { fontSize: 9, color: CEMENT, letterSpacing: 2 },

  faixa: {
    backgroundColor: GRAPHITE,
    paddingHorizontal: MARGEM,
    paddingVertical: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  faixaNome: {
    fontSize: 21,
    fontWeight: 700,
    color: WHITE,
    lineHeight: 1.15,
    maxWidth: 350,
  },
  faixaTagline: { fontSize: 9.5, color: CEMENT, marginTop: 6, maxWidth: 350 },
  faixaLogo: { width: 92, height: 28, objectFit: "contain" },

  stats: {
    flexDirection: "row",
    paddingHorizontal: MARGEM,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: MIST,
  },
  stat: { flex: 1, paddingRight: 12 },
  statDivisor: { borderLeftWidth: 1, borderLeftColor: MIST, paddingLeft: 16 },
  statValor: { fontFamily: "JetBrainsMono", fontSize: 16, fontWeight: 700 },
  statLabel: {
    fontSize: 7,
    fontWeight: 600,
    color: CONCRETE,
    letterSpacing: 1.6,
    marginTop: 5,
    textTransform: "uppercase",
  },

  bloco: { paddingHorizontal: MARGEM, paddingVertical: 18 },
  blocoPapel: { backgroundColor: PAPER },
  eyebrow: {
    fontSize: 7.5,
    fontWeight: 700,
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 12,
  },

  specColunas: { flexDirection: "row" },
  specColuna: { flex: 1 },
  specColunaDir: { marginLeft: 24 },
  specLinha: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: MIST,
  },
  specChave: { fontSize: 8.5, color: STEEL, paddingRight: 8 },
  specValor: { fontSize: 8.5, fontWeight: 700, textAlign: "right" },

  features: { flexDirection: "row", flexWrap: "wrap" },
  feature: { width: "50%", flexDirection: "row", marginBottom: 12 },
  featureIcone: { width: 24, paddingTop: 1 },
  featureTexto: { flex: 1, paddingRight: 16 },
  featureTitulo: { fontSize: 10, fontWeight: 700, marginBottom: 3 },
  featureDesc: { fontSize: 8, color: CONCRETE, lineHeight: 1.45 },

  lead: { fontSize: 9.5, color: STEEL, lineHeight: 1.55 },

  legendaFaixa: { backgroundColor: GRAPHITE, paddingHorizontal: 14, paddingVertical: 11 },
  legendaTopo: { flexDirection: "row", alignItems: "center", marginBottom: 3 },
  legendaNumero: {
    fontFamily: "JetBrainsMono",
    fontSize: 8,
    fontWeight: 700,
    color: RED,
    marginRight: 8,
  },
  legendaTitulo: { fontSize: 9.5, fontWeight: 700, color: WHITE },
  legendaDesc: { fontSize: 7.5, color: CEMENT, lineHeight: 1.4 },

  faq: { marginBottom: 10 },
  faqPergunta: { fontSize: 9, fontWeight: 700, marginBottom: 3 },
  faqResposta: { fontSize: 8, color: CONCRETE, lineHeight: 1.45 },

  declaracao: { flexDirection: "row", marginHorizontal: MARGEM, marginTop: 20 },
  declaracaoBarra: { width: 3, backgroundColor: RED, marginRight: 12 },
  declaracaoTexto: { fontSize: 9.5, fontWeight: 700, lineHeight: 1.45, flex: 1 },

  rodape: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: 1,
    borderTopColor: MIST,
    paddingHorizontal: MARGEM,
    paddingVertical: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: WHITE,
  },
  rodapeAplicacoes: {
    fontSize: 8.5,
    fontWeight: 700,
    marginBottom: 6,
    maxWidth: 290,
  },
  rodapeContato: { fontSize: 7.5, color: STEEL, lineHeight: 1.55 },
  botao: { backgroundColor: RED, paddingVertical: 11, paddingHorizontal: 20 },
  botaoTexto: { fontSize: 9, fontWeight: 700, color: WHITE, letterSpacing: 0.4 },

  capa: { backgroundColor: BLACK },
  capaCorpo: { paddingHorizontal: MARGEM, paddingTop: 74 },
  capaLogo: { width: 148, height: 46, objectFit: "contain", marginBottom: 52 },
  capaTitulo: { fontSize: 38, fontWeight: 700, color: WHITE, lineHeight: 1.1, maxWidth: 400 },
  capaRegua: { width: 64, height: 4, backgroundColor: RED, marginVertical: 22 },
  capaSubtitulo: { fontSize: 12, color: CEMENT, maxWidth: 340, lineHeight: 1.5 },
  capaChamada: {
    fontFamily: "JetBrainsMono",
    fontSize: 11,
    fontWeight: 700,
    color: WHITE,
    marginTop: 26,
  },
  capaImagem: {
    position: "absolute",
    bottom: 74,
    left: 0,
    right: 0,
    height: 236,
    objectFit: "cover",
  },
  capaRodape: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: MARGEM,
    paddingVertical: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: STEEL,
  },
  capaRodapeTexto: { fontSize: 8, color: CEMENT, letterSpacing: 1 },

  indiceTitulo: { fontSize: 26, fontWeight: 700, marginBottom: 4 },
  indiceLegenda: { fontSize: 9, color: CONCRETE },
  indiceGrupo: { marginTop: 14 },
  indiceGrupoTitulo: {
    fontSize: 8,
    fontWeight: 700,
    color: RED,
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  indiceLinha: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: MIST,
  },
  indiceNome: {
    fontSize: 9.5,
    fontWeight: 600,
    maxLines: 1,
    textOverflow: "ellipsis",
  },
  indiceResumo: {
    fontSize: 7,
    color: CONCRETE,
    marginTop: 1.5,
    maxLines: 1,
    textOverflow: "ellipsis",
  },
  indicePagina: { fontFamily: "JetBrainsMono", fontSize: 9, fontWeight: 700 },

  contracapa: { backgroundColor: BLACK },
  contracapaCorpo: { paddingHorizontal: MARGEM, paddingTop: 110 },
  contracapaTitulo: {
    fontSize: 28,
    fontWeight: 700,
    color: WHITE,
    maxWidth: 380,
    lineHeight: 1.15,
  },
  contracapaTexto: {
    fontSize: 10,
    color: CEMENT,
    lineHeight: 1.6,
    maxWidth: 350,
    marginTop: 18,
  },
  contatoLinha: { flexDirection: "row", marginTop: 34 },
  contatoColuna: { flex: 1 },
  contatoLabel: {
    fontSize: 7,
    fontWeight: 700,
    color: CONCRETE,
    letterSpacing: 1.6,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  contatoValor: { fontSize: 10, color: WHITE, lineHeight: 1.6 },
  contracapaSite: { fontSize: 18, fontWeight: 700, color: RED, marginTop: 42 },
  contracapaRazao: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: MARGEM,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: STEEL,
  },
  contracapaRazaoTexto: { fontSize: 7.5, color: CONCRETE, lineHeight: 1.5 },
});

/**
 * Icones de linha desenhados aqui.
 *
 * O campo Feature.icon guarda nomes do lucide, mas o react-pdf nao renderiza
 * componentes React arbitrarios dentro do PDF — so as primitivas de Svg.
 */
function Icone({ nome }: { nome: string | null }) {
  const traco = { stroke: BLACK, strokeWidth: 1.6, fill: "none" };

  function desenho() {
    switch (nome) {
      case "Truck":
        return (
          <>
            <Path d="M2 6 H14 V16 H2 Z" {...traco} />
            <Path d="M14 9 H18 L21 12 V16 H14 Z" {...traco} />
            <Circle cx="7" cy="19" r="2" {...traco} />
            <Circle cx="17" cy="19" r="2" {...traco} />
          </>
        );
      case "Zap":
        return <Path d="M13 2 L4 13 H10 L9 22 L19 10 H12 Z" {...traco} />;
      case "Shield":
        return (
          <>
            <Path
              d="M12 2 L20 5 V11 C20 16 16 20 12 22 C8 20 4 16 4 11 V5 Z"
              {...traco}
            />
            <Polyline points="9,12 11,14 15,9" {...traco} />
          </>
        );
      case "AlertTriangle":
        return (
          <>
            <Path d="M12 3 L22 20 H2 Z" {...traco} />
            <Line x1="12" y1="10" x2="12" y2="14" {...traco} />
            <Line x1="12" y1="17" x2="12" y2="17.6" {...traco} />
          </>
        );
      case "Weight":
        return (
          <>
            <Path d="M6 8 H18 L21 21 H3 Z" {...traco} />
            <Circle cx="12" cy="5" r="2.5" {...traco} />
          </>
        );
      case "Gauge":
        return (
          <>
            <Path d="M3 17 A9 9 0 0 1 21 17" {...traco} />
            <Line x1="12" y1="17" x2="16" y2="11" {...traco} />
          </>
        );
      case "Activity":
        return <Polyline points="2,12 7,12 10,4 15,20 18,12 22,12" {...traco} />;
      case "Wrench":
        return (
          <Path
            d="M17.5 2.5 L14 6 L16.5 8.5 L20 5 A6 6 0 0 1 12.5 12.5 L5 20 L3 18 L10.5 10.5 A6 6 0 0 1 17.5 2.5 Z"
            {...traco}
          />
        );
      case "Timer":
        return (
          <>
            <Circle cx="12" cy="14" r="8" {...traco} />
            <Line x1="12" y1="14" x2="12" y2="9" {...traco} />
            <Line x1="9" y1="2" x2="15" y2="2" {...traco} />
          </>
        );
      case "Factory":
        return (
          <>
            <Path d="M2 21 V11 L9 15 V11 L16 15 V6 H22 V21 Z" {...traco} />
            <Line x1="6" y1="18" x2="6" y2="18.6" {...traco} />
          </>
        );
      case "Ruler":
        return (
          <>
            <Path d="M3 15 L15 3 L21 9 L9 21 Z" {...traco} />
            <Line x1="7" y1="11" x2="10" y2="14" {...traco} />
            <Line x1="11" y1="7" x2="14" y2="10" {...traco} />
          </>
        );
      default:
        return (
          <>
            <Circle cx="12" cy="12" r="4" {...traco} />
            <Circle cx="12" cy="12" r="8.5" {...traco} />
            <Line x1="12" y1="1.5" x2="12" y2="5" {...traco} />
            <Line x1="12" y1="19" x2="12" y2="22.5" {...traco} />
            <Line x1="1.5" y1="12" x2="5" y2="12" {...traco} />
            <Line x1="19" y1="12" x2="22.5" y2="12" {...traco} />
          </>
        );
    }
  }

  return (
    <Svg width={17} height={17} viewBox="0 0 24 24">
      {desenho()}
    </Svg>
  );
}

export interface ProdutoPdf {
  slug: string;
  category: ProductCategory;
  name: string;
  tagline: string;
  description: string;
  specs: { key: string; value: string }[];
  features: { title: string; description: string; icon: string | null }[];
  aplicacoes: string[];
  faqs: { question: string; answer: string }[];
  imagens: string[];
}

export interface ContatoPdf {
  telefone: string;
  whatsapp: string;
  email: string;
  site: string;
  endereco: string;
  razaoSocial: string;
  cnpj: string;
}

export interface CatalogoPdfProps {
  produtos: ProdutoPdf[];
  locale: LocaleCatalogo;
  /** Numeros institucionais do site, usados na faixa da pagina de detalhe. */
  stats: { equipamentos: string; paises: string; anos: string };
  logoDataUri: string;
  logoWhiteDataUri: string;
  contato: ContatoPdf;
  geradoEm: string;
}

const ORDEM_CATEGORIAS: ProductCategory[] = [
  "TOMBADOR_FIXO",
  "TOMBADOR_MOVEL",
  "COLETOR_AMOSTRAS",
  "UNIDADE_TRANSBORDO",
  "ESPECIAL",
];

/** Agrupa por categoria preservando a ordem definida no admin. */
function ordenar(produtos: ProdutoPdf[]): ProdutoPdf[] {
  return [...produtos].sort(
    (a, b) =>
      ORDEM_CATEGORIAS.indexOf(a.category) -
      ORDEM_CATEGORIAS.indexOf(b.category),
  );
}

/** Os tres numeros de destaque do topo da ficha. */
function destaques(
  p: ProdutoPdf,
  t: TextosCatalogo,
  locale: LocaleCatalogo,
) {
  const achar = (chave: string) => p.specs.find((sp) => sp.key === chave);
  const escolhidos: { valor: string; label: string }[] = [];
  const capacidade = achar("Capacidade") ?? achar("Forca");
  const comprimento = achar("Comprimento") ?? achar("Profundidade");
  const ciclo = achar("Ciclo") ?? achar("Motor");

  if (capacidade) {
    escolhidos.push({
      valor: traduzirValor(capacidade.value, locale),
      label: capacidade.key === "Capacidade" ? t.statCapacidade : traduzirChave(capacidade.key, locale),
    });
  }
  if (comprimento) {
    escolhidos.push({
      valor: traduzirValor(comprimento.value, locale),
      label:
        comprimento.key === "Comprimento"
          ? t.statComprimento
          : traduzirChave(comprimento.key, locale),
    });
  }
  if (ciclo) {
    escolhidos.push({
      valor: traduzirValor(ciclo.value, locale),
      label: ciclo.key === "Ciclo" ? t.statCiclo : traduzirChave(ciclo.key, locale),
    });
  }
  return escolhidos;
}

function Rodape({
  p,
  t,
  contato,
  locale,
}: {
  p: ProdutoPdf;
  t: TextosCatalogo;
  contato: ContatoPdf;
  locale: LocaleCatalogo;
}) {
  const apps = p.aplicacoes
    .map((a) => traduzirAplicacao(a, locale))
    .join(" · ");

  return (
    <View style={s.rodape} fixed>
      <View>
        {apps ? <Text style={s.rodapeAplicacoes}>{apps}</Text> : null}
        <Text style={s.rodapeContato}>
          {contato.telefone}    WhatsApp {contato.whatsapp}
        </Text>
        <Text style={s.rodapeContato}>
          {contato.email}    {contato.site}
        </Text>
      </View>
      <View style={s.botao}>
        <Text style={s.botaoTexto}>{t.cta}</Text>
      </View>
    </View>
  );
}

function Cabecalho({ t }: { t: TextosCatalogo }) {
  return (
    <View style={s.barra}>
      <Text style={s.barraTexto}>{t.marca}</Text>
      <Text style={s.barraTexto}>{t.desde}</Text>
    </View>
  );
}

function PaginaFicha({
  p,
  t,
  locale,
  logoWhiteDataUri,
  contato,
}: {
  p: ProdutoPdf;
  t: TextosCatalogo;
  locale: LocaleCatalogo;
  logoWhiteDataUri: string;
  contato: ContatoPdf;
}) {
  const stats = destaques(p, t, locale);
  const temFicha = p.specs.length > 0;
  const metade = Math.ceil(p.specs.length / 2);
  const colunas = [p.specs.slice(0, metade), p.specs.slice(metade)];
  const features = p.features.slice(0, 4);
  /**
   * Sem ficha tecnica sobra pagina: a foto cresce para ocupar. Quando nem foto
   * existe, o bloco cinza fica menor — placeholder gigante so chama atencao
   * para o que falta.
   */
  const alturaHero = temFicha
    ? features.length >= 4
      ? 214
      : 252
    : p.imagens[0]
      ? 420
      : 262;

  return (
    <Page size="A4" style={s.page}>
      <Cabecalho t={t} />

      {p.imagens[0] ? (
        <Image src={p.imagens[0]} style={[s.hero, { height: alturaHero }]} />
      ) : (
        <View style={[s.heroVazio, { height: alturaHero }]}>
          <Text style={s.heroVazioTexto}>{t.semFoto.toUpperCase()}</Text>
        </View>
      )}

      <View style={s.faixa}>
        <View>
          <Text style={s.faixaNome}>{p.name}</Text>
          {p.tagline ? <Text style={s.faixaTagline}>{p.tagline}</Text> : null}
        </View>
        <Image src={logoWhiteDataUri} style={s.faixaLogo} />
      </View>

      {stats.length > 0 ? (
        <View style={s.stats}>
          {stats.map((d, i) => (
            <View key={i} style={[s.stat, i > 0 ? s.statDivisor : {}]}>
              <Text style={[s.statValor, i === 0 ? { color: RED } : {}]}>
                {d.valor}
              </Text>
              <Text style={s.statLabel}>{d.label}</Text>
            </View>
          ))}
        </View>
      ) : null}

      {temFicha ? (
        <View style={[s.bloco, s.blocoPapel]}>
          <Text style={s.eyebrow}>{t.specsTitulo}</Text>
          <View style={s.specColunas}>
            {colunas.map((coluna, ci) => (
              <View
                key={ci}
                style={[s.specColuna, ci === 1 ? s.specColunaDir : {}]}
              >
                {coluna.map((sp, i) => (
                  <View key={i} style={s.specLinha}>
                    <Text style={s.specChave}>
                      {traduzirChave(sp.key, locale)}
                    </Text>
                    <Text style={s.specValor}>
                      {traduzirValor(sp.value, locale)}
                    </Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        </View>
      ) : (
        <View style={[s.bloco, s.blocoPapel]}>
          <Text style={s.lead}>{p.description}</Text>
        </View>
      )}

      {features.length > 0 ? (
        <View style={s.bloco}>
          <View style={s.features}>
            {features.map((f, i) => (
              <View key={i} style={s.feature} wrap={false}>
                <View style={s.featureIcone}>
                  <Icone nome={f.icon} />
                </View>
                <View style={s.featureTexto}>
                  <Text style={s.featureTitulo}>{f.title}</Text>
                  <Text style={s.featureDesc}>{f.description}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      ) : null}

      <Rodape p={p} t={t} contato={contato} locale={locale} />
    </Page>
  );
}

function PaginaDetalhe({
  p,
  t,
  locale,
  logoDataUri,
  contato,
  stats,
}: {
  p: ProdutoPdf;
  t: TextosCatalogo;
  locale: LocaleCatalogo;
  logoDataUri: string;
  contato: ContatoPdf;
  stats: { equipamentos: string; paises: string; anos: string };
}) {
  const extras = p.imagens.slice(1, 4);

  /**
   * Legendas numeradas das fotos: primeiro o que sobrou dos diferenciais,
   * depois as specs estruturais. Nada aqui e inventado — tudo vem do banco.
   */
  const ordemEditorial = ["Estrutura", "Acionamento", "Tipo", "Motor", "Normas"];
  const legendas = [
    ...p.features.slice(4).map((f) => ({ titulo: f.title, desc: f.description })),
    ...ordemEditorial
      .map((chave) => p.specs.find((sp) => sp.key === chave))
      .filter((sp) => sp !== undefined)
      .map((sp) => ({
        titulo: traduzirChave(sp.key, locale),
        desc: traduzirValor(sp.value, locale),
      })),
    ...p.features.map((f) => ({ titulo: f.title, desc: f.description })),
  ];

  /**
   * Com uma foto so a pagina fica com meio palmo de branco. As duvidas
   * frequentes do proprio produto preenchem melhor que espaco vazio.
   */
  const temBlocoDeFicha =
    extras.length === 0 && (p.specs.length > 0 || p.features.length > 0);
  const faqs = extras.length === 1 && !temBlocoDeFicha ? p.faqs.slice(0, 3) : [];

  return (
    <Page size="A4" style={s.page}>
      <Cabecalho t={t} />

      <View style={[s.bloco, { paddingBottom: 10 }]}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ flex: 1, paddingRight: 20 }}>
            <Text style={[s.eyebrow, { color: RED, marginBottom: 8 }]}>
              {t.detalhesEyebrow}
            </Text>
            <Text style={{ fontSize: 19, fontWeight: 700, lineHeight: 1.2 }}>
              {p.name} — {t.porDentro}
            </Text>
          </View>
          <Image
            src={logoDataUri}
            style={{ width: 82, height: 26, objectFit: "contain" }}
          />
        </View>
        {p.description ? (
          <Text style={[s.lead, { marginTop: 14 }]}>{p.description}</Text>
        ) : null}
      </View>

      {extras.length > 0 ? (
        <View>
          <Image
            src={extras[0]}
            style={{
              width: "100%",
              height: extras.length > 1 ? (legendas.length ? 190 : 236) : 248,
              objectFit: "cover",
            }}
          />
          {legendas[0] ? (
            <View style={s.legendaFaixa}>
              <View style={s.legendaTopo}>
                <Text style={s.legendaNumero}>01</Text>
                <Text style={s.legendaTitulo}>{legendas[0].titulo}</Text>
              </View>
              <Text style={s.legendaDesc}>{legendas[0].desc}</Text>
            </View>
          ) : null}

          {extras.length > 1 ? (
            <View style={{ flexDirection: "row" }}>
              {extras.slice(1).map((img, i) => {
                const legenda = legendas[i + 1];
                return (
                  <View
                    key={i}
                    style={{
                      flex: 1,
                      marginRight: i === 0 && extras.length > 2 ? 2 : 0,
                    }}
                  >
                    <Image
                      src={img}
                      style={{
                        width: "100%",
                        height: legendas.length ? 146 : 182,
                        objectFit: "cover",
                      }}
                    />
                    {legenda ? (
                      <View style={[s.legendaFaixa, { minHeight: 66 }]}>
                        <View style={s.legendaTopo}>
                          <Text style={s.legendaNumero}>0{i + 2}</Text>
                          <Text style={s.legendaTitulo}>{legenda.titulo}</Text>
                        </View>
                        <Text style={s.legendaDesc}>{legenda.desc}</Text>
                      </View>
                    ) : null}
                  </View>
                );
              })}
            </View>
          ) : null}
        </View>
      ) : temBlocoDeFicha ? (
        <View style={[s.bloco, s.blocoPapel]}>
          <Text style={s.eyebrow}>{t.fichaTitulo}</Text>
          {/* Duas colunas: em lista unica a ficha nao cabe com os diferenciais. */}
          <View style={s.specColunas}>
            {[
              p.specs.slice(0, Math.ceil(p.specs.length / 2)),
              p.specs.slice(Math.ceil(p.specs.length / 2)),
            ].map((coluna, ci) => (
              <View
                key={ci}
                style={[s.specColuna, ci === 1 ? s.specColunaDir : {}]}
              >
                {coluna.map((sp, i) => (
                  <View key={i} style={s.specLinha}>
                    <Text style={s.specChave}>
                      {traduzirChave(sp.key, locale)}
                    </Text>
                    <Text style={s.specValor}>
                      {traduzirValor(sp.value, locale)}
                    </Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
          <View style={[s.features, { marginTop: 16 }]}>
            {p.features.slice(0, 4).map((f, i) => (
              <View key={`f-${i}`} style={s.feature} wrap={false}>
                <View style={s.featureIcone}>
                  <Icone nome={f.icon} />
                </View>
                <View style={s.featureTexto}>
                  <Text style={s.featureTitulo}>{f.title}</Text>
                  <Text style={s.featureDesc}>{f.description}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      ) : null}

      {faqs.length > 0 ? (
        <View style={[s.bloco, { paddingBottom: 4 }]}>
          <Text style={s.eyebrow}>{t.duvidas}</Text>
          {faqs.map((f, i) => (
            <View key={i} style={s.faq} wrap={false}>
              <Text style={s.faqPergunta}>{f.question}</Text>
              <Text style={s.faqResposta}>{f.answer}</Text>
            </View>
          ))}
        </View>
      ) : null}

      {extras.length < 2 && !temBlocoDeFicha ? (
        <View style={[s.stats, { borderTopWidth: 1, borderTopColor: MIST }]}>
          {[
            { valor: stats.equipamentos, label: t.statEquipamentos },
            { valor: stats.paises, label: t.statPaises },
            { valor: stats.anos, label: t.statAnos },
          ].map((d, i) => (
            <View key={i} style={[s.stat, i > 0 ? s.statDivisor : {}]}>
              <Text style={[s.statValor, { fontSize: 14 }]}>{d.valor}</Text>
              <Text style={s.statLabel}>{d.label}</Text>
            </View>
          ))}
        </View>
      ) : null}

      <View style={s.declaracao}>
        <View style={s.declaracaoBarra} />
        <Text style={s.declaracaoTexto}>{t.declaracao}</Text>
      </View>

      <Rodape p={p} t={t} contato={contato} locale={locale} />
    </Page>
  );
}

export function CatalogoPdf({
  produtos,
  locale,
  stats,
  logoDataUri,
  logoWhiteDataUri,
  contato,
  geradoEm,
}: CatalogoPdfProps) {
  registrarFontes();

  const t = TEXTOS[locale];
  const lista = ordenar(produtos);
  // Capa (1) + indice (2); a partir da 3, duas paginas por produto.
  const paginaDoProduto = (i: number) => 3 + i * 2;

  const grupos = ORDEM_CATEGORIAS.map((cat) => ({
    cat,
    label: CATEGORIAS[cat][locale],
    itens: lista
      .map((p, i) => ({ p, pagina: paginaDoProduto(i) }))
      .filter(({ p }) => p.category === cat),
  })).filter((g) => g.itens.length > 0);

  const imagemDaCapa = lista.find((p) => p.imagens.length > 0)?.imagens[0];

  return (
    <Document
      title={`${t.capaTitulo} — PILI Industrial`}
      author="PILI Industrial"
      subject={t.capaSubtitulo}
      language={locale === "es" ? "es-419" : locale}
    >
      <Page size="A4" style={[s.page, s.capa]}>
        <Cabecalho t={t} />
        <View style={s.capaCorpo}>
          <Image src={logoWhiteDataUri} style={s.capaLogo} />
          <Text style={s.capaTitulo}>{t.capaTitulo}</Text>
          <View style={s.capaRegua} />
          <Text style={s.capaSubtitulo}>{t.capaSubtitulo}</Text>
          <Text style={s.capaChamada}>{t.capaChamada}</Text>
        </View>
        {imagemDaCapa ? (
          <Image src={imagemDaCapa} style={s.capaImagem} />
        ) : null}
        <View style={s.capaRodape}>
          <Text style={s.capaRodapeTexto}>{contato.site}</Text>
          <Text style={s.capaRodapeTexto}>{geradoEm}</Text>
        </View>
      </Page>

      <Page size="A4" style={s.page}>
        <Cabecalho t={t} />
        <View style={[s.bloco, { paddingTop: 28 }]}>
          <Text style={s.indiceTitulo}>{t.indiceTitulo}</Text>
          <Text style={s.indiceLegenda}>{t.indiceLegenda}</Text>
          {grupos.map((g) => (
            <View key={g.cat} style={s.indiceGrupo}>
              <Text style={s.indiceGrupoTitulo}>{g.label}</Text>
              {g.itens.map(({ p, pagina }) => (
                <View key={p.slug} style={s.indiceLinha}>
                  <View style={{ flex: 1, paddingRight: 16 }}>
                    <Text style={s.indiceNome}>{p.name}</Text>
                    {p.tagline ? (
                      <Text style={s.indiceResumo}>{p.tagline}</Text>
                    ) : null}
                  </View>
                  <Text style={s.indicePagina}>{pagina}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      </Page>

      {lista.flatMap((p) => [
        <PaginaFicha
          key={`${p.slug}-ficha`}
          p={p}
          t={t}
          locale={locale}
          logoWhiteDataUri={logoWhiteDataUri}
          contato={contato}
        />,
        <PaginaDetalhe
          key={`${p.slug}-detalhe`}
          p={p}
          t={t}
          locale={locale}
          logoDataUri={logoDataUri}
          contato={contato}
          stats={stats}
        />,
      ])}

      <Page size="A4" style={[s.page, s.contracapa]}>
        <Cabecalho t={t} />
        <View style={s.contracapaCorpo}>
          <Image
            src={logoWhiteDataUri}
            style={{ width: 128, height: 40, objectFit: "contain", marginBottom: 46 }}
          />
          <Text style={s.contracapaTitulo}>{t.contracapaTitulo}</Text>
          <Text style={s.contracapaTexto}>{t.contracapaTexto}</Text>
          <View style={s.contatoLinha}>
            <View style={s.contatoColuna}>
              <Text style={s.contatoLabel}>Telefone</Text>
              <Text style={s.contatoValor}>{contato.telefone}</Text>
              <Text style={s.contatoValor}>WhatsApp {contato.whatsapp}</Text>
            </View>
            <View style={s.contatoColuna}>
              <Text style={s.contatoLabel}>E-mail</Text>
              <Text style={s.contatoValor}>{contato.email}</Text>
              <Text style={s.contatoValor}>{contato.endereco}</Text>
            </View>
          </View>
          <Text style={s.contracapaSite}>{contato.site}</Text>
        </View>
        <View style={s.contracapaRazao}>
          <Text style={s.contracapaRazaoTexto}>
            {contato.razaoSocial} — CNPJ {contato.cnpj}
          </Text>
          <Text style={s.contracapaRazaoTexto}>
            {t.geradoEm} {geradoEm}
          </Text>
        </View>
      </Page>
    </Document>
  );
}
