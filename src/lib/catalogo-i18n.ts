import type { ProductCategory } from "@prisma/client";

/**
 * Textos e dicionarios do catalogo em PDF.
 *
 * O banco guarda as specs num unico idioma e sem acentos — foi assim que o
 * seed original gravou. Traduzir e acentuar na hora de gerar o PDF evita
 * migrar dados so por causa do catalogo e mantem as duas versoes (pt-BR e es)
 * saindo da mesma fonte.
 */
export type LocaleCatalogo = "pt-BR" | "es";

/** Rotulos fixos do catalogo. Tipado para o PDF nao indexar chave inexistente. */
export interface TextosCatalogo {
  marca: string;
  desde: string;
  capaTitulo: string;
  capaSubtitulo: string;
  capaChamada: string;
  indiceTitulo: string;
  indiceLegenda: string;
  pagina: string;
  specsTitulo: string;
  detalhesEyebrow: string;
  porDentro: string;
  aplicacoes: string;
  cta: string;
  declaracao: string;
  semFoto: string;
  fichaTitulo: string;
  duvidas: string;
  statEquipamentos: string;
  statPaises: string;
  statAnos: string;
  contracapaTitulo: string;
  contracapaTexto: string;
  statCapacidade: string;
  statComprimento: string;
  statCiclo: string;
  geradoEm: string;
}

export const TEXTOS: Record<LocaleCatalogo, TextosCatalogo> = {
  "pt-BR": {
    marca: "PILI INDUSTRIAL",
    desde: "DESDE 1979",
    capaTitulo: "Catálogo de produtos",
    capaSubtitulo:
      "Tombadores hidráulicos e equipamentos para movimentação de granéis",
    capaChamada: "De 10 a 30 metros. De 40 a 100 toneladas.",
    indiceTitulo: "Índice",
    indiceLegenda: "Linha completa de equipamentos",
    pagina: "Pág.",
    specsTitulo: "Especificações técnicas",
    detalhesEyebrow: "Detalhes do equipamento",
    porDentro: "por dentro",
    aplicacoes: "Aplicações",
    cta: "Solicitar orçamento",
    declaracao:
      "Cada componente é dimensionado por engenharia própria e fabricado em Erechim/RS — da estrutura ao painel de comando.",
    semFoto: "Foto sob solicitação",
    fichaTitulo: "Ficha completa",
    duvidas: "Perguntas frequentes",
    statEquipamentos: "Equipamentos entregues",
    statPaises: "Países atendidos",
    statAnos: "Anos de fábrica",
    contracapaTitulo: "Fale com a engenharia PILI",
    contracapaTexto:
      "Projeto, fabricação, montagem e assistência técnica próprios. Atendemos Brasil, Paraguai, Argentina e Uruguai.",
    statCapacidade: "Capacidade",
    statComprimento: "Comprimento",
    statCiclo: "Ciclo de descarga",
    geradoEm: "Catálogo gerado em",
  },
  es: {
    marca: "PILI INDUSTRIAL",
    desde: "DESDE 1979",
    capaTitulo: "Catálogo de productos",
    capaSubtitulo:
      "Volcadores hidráulicos y equipos para el movimiento de graneles",
    capaChamada: "De 10 a 30 metros. De 40 a 100 toneladas.",
    indiceTitulo: "Índice",
    indiceLegenda: "Línea completa de equipos",
    pagina: "Pág.",
    specsTitulo: "Especificaciones técnicas",
    detalhesEyebrow: "Detalles del equipo",
    porDentro: "por dentro",
    aplicacoes: "Aplicaciones",
    cta: "Solicitar cotización",
    declaracao:
      "Cada componente es dimensionado por ingeniería propia y fabricado en Erechim/RS — de la estructura al panel de mando.",
    semFoto: "Foto a pedido",
    fichaTitulo: "Ficha completa",
    duvidas: "Preguntas frecuentes",
    statEquipamentos: "Equipos entregados",
    statPaises: "Países atendidos",
    statAnos: "Años de fábrica",
    contracapaTitulo: "Hable con la ingeniería PILI",
    contracapaTexto:
      "Proyecto, fabricación, montaje y asistencia técnica propios. Atendemos Brasil, Paraguay, Argentina y Uruguay.",
    statCapacidade: "Capacidad",
    statComprimento: "Longitud",
    statCiclo: "Ciclo de descarga",
    geradoEm: "Catálogo generado en",
  },
};

export const CATEGORIAS: Record<
  ProductCategory,
  Record<LocaleCatalogo, string>
> = {
  TOMBADOR_FIXO: { "pt-BR": "Tombadores fixos", es: "Volcadores fijos" },
  TOMBADOR_MOVEL: { "pt-BR": "Tombadores móveis", es: "Volcadores móviles" },
  COLETOR_AMOSTRAS: {
    "pt-BR": "Coletores de amostras",
    es: "Caladores de muestras",
  },
  UNIDADE_TRANSBORDO: {
    "pt-BR": "Unidades de transbordo",
    es: "Unidades de trasbordo",
  },
  ESPECIAL: { "pt-BR": "Equipamentos especiais", es: "Equipos especiales" },
};

/** Chaves de spec como estao gravadas no banco (sem acento) -> texto exibido. */
const CHAVES: Record<string, [string, string]> = {
  Capacidade: ["Capacidade", "Capacidad"],
  Comprimento: ["Comprimento", "Longitud"],
  Largura: ["Largura", "Ancho"],
  "Angulo maximo": ["Ângulo máximo", "Ángulo máximo"],
  Ciclo: ["Ciclo", "Ciclo"],
  Motor: ["Motor", "Motor"],
  Estrutura: ["Estrutura", "Estructura"],
  Peso: ["Peso", "Peso"],
  Tipo: ["Tipo", "Tipo"],
  Acionamento: ["Acionamento", "Accionamiento"],
  Normas: ["Normas", "Normas"],
  Instalacao: ["Instalação", "Instalación"],
  Forca: ["Força", "Fuerza"],
  "Abertura maxima": ["Abertura máxima", "Apertura máxima"],
  Material: ["Material", "Material"],
  Amostra: ["Amostra", "Muestra"],
  Reservatorio: ["Reservatório", "Tanque"],
  Profundidade: ["Profundidade", "Profundidad"],
  Resfriamento: ["Resfriamento", "Refrigeración"],
  Curso: ["Curso", "Carrera"],
  Vazao: ["Vazão", "Caudal"],
  Mobilidade: ["Mobilidade", "Movilidad"],
  Alimentacao: ["Alimentação", "Alimentación"],
  Rastreabilidade: ["Rastreabilidade", "Trazabilidad"],
  Comando: ["Comando", "Mando"],
  Cabine: ["Cabine", "Cabina"],
  Mesa: ["Mesa", "Mesa"],
  Integracao: ["Integração", "Integración"],
  Pressao: ["Pressão", "Presión"],
  Lamina: ["Lâmina", "Cuchilla"],
  Filtragem: ["Filtragem", "Filtrado"],
  Aplicacao: ["Aplicação", "Aplicación"],
};

/** Valores textuais de spec. Numeros e unidades passam direto. */
const VALORES: Record<string, [string, string]> = {
  "Aco ASTM A572 Gr.50": ["Aço ASTM A572 Gr.50", "Acero ASTM A572 Gr.50"],
  "Aco inox nos pontos de contato": [
    "Aço inox nos pontos de contato",
    "Acero inoxidable en los puntos de contacto",
  ],
  "Aco temperado": ["Aço temperado", "Acero templado"],
  "Ar ou agua": ["Ar ou água", "Aire o agua"],
  "Ate 2,5 m": ["Até 2,5 m", "Hasta 2,5 m"],
  "Ate 3 microns": ["Até 3 mícrons", "Hasta 3 micrones"],
  "Ate 350 bar": ["Até 350 bar", "Hasta 350 bar"],
  "Automatico / Manual": ["Automático / Manual", "Automático / Manual"],
  Configuravel: ["Configurável", "Configurable"],
  "Conforme projeto": ["Conforme projeto", "Según proyecto"],
  "Eletrica trifasica": ["Elétrica trifásica", "Eléctrica trifásica"],
  "Fechada, climatizada": ["Fechada, climatizada", "Cerrada, climatizada"],
  "Graos a granel": ["Grãos a granel", "Granos a granel"],
  Hidraulico: ["Hidráulico", "Hidráulico"],
  "Movel / Portatil": ["Móvel / Portátil", "Móvil / Portátil"],
  "PLC com IHM": ["PLC com IHM", "PLC con HMI"],
  Pneumatico: ["Pneumático", "Neumático"],
  "Rapida, sem fundacao especial": [
    "Rápida, sem fundação especial",
    "Rápida, sin fundación especial",
  ],
  "Sob medida": ["Sob medida", "A medida"],
  "Tombadores PILI": ["Tombadores PILI", "Volcadores PILI"],
  "Transbordo intermodal": ["Transbordo intermodal", "Trasbordo intermodal"],
  Transportavel: ["Transportável", "Transportable"],
  "60 a 200 t (configuravel)": [
    "60 a 200 t (configurável)",
    "60 a 200 t (configurable)",
  ],
};

const APLICACOES: Record<string, [string, string]> = {
  porto: ["Portos", "Puertos"],
  cooperativa: ["Cooperativas", "Cooperativas"],
  industria: ["Indústria alimentícia", "Industria alimentaria"],
  fertilizante: ["Fertilizantes", "Fertilizantes"],
  cimento: ["Cimento", "Cemento"],
};

const indice = (locale: LocaleCatalogo) => (locale === "es" ? 1 : 0);

export function traduzirChave(key: string, locale: LocaleCatalogo): string {
  return CHAVES[key]?.[indice(locale)] ?? key;
}

export function traduzirValor(value: string, locale: LocaleCatalogo): string {
  return VALORES[value]?.[indice(locale)] ?? value;
}

export function traduzirAplicacao(
  slug: string,
  locale: LocaleCatalogo,
): string {
  return APLICACOES[slug]?.[indice(locale)] ?? slug;
}
