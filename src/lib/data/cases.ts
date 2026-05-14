export interface CaseData {
  slug: string;
  title: string;
  client: string;
  location: string;
  year: number;
  application: string;
  summary: string;
  content: string;
  metrics: { label: string; value: string }[];
  products: string[];
  featured: boolean;
}

export const CASES: CaseData[] = [
  {
    slug: "paranagua-terminal-portuario",
    title: "Primeiro tombador em silo publico do Porto de Paranagua",
    client: "Terminal Portuario de Paranagua",
    location: "Paranagua/PR",
    year: 2017,
    application: "porto",
    summary:
      "Instalacao do primeiro tombador de grande porte em silo publico do maior porto graneleiro do Brasil, com capacidade de descarga de 700 caminhoes por dia.",
    content: `O Porto de Paranagua e o maior terminal de exportacao de graos do Brasil, movimentando mais de 50 milhoes de toneladas por ano. Em 2017, a PILI Industrial foi selecionada para fornecer o primeiro tombador hidraulico de grande porte para operacao em silo publico.

O desafio era projetar um equipamento capaz de operar 24 horas por dia, 7 dias por semana, em ambiente maritimo altamente corrosivo, com fluxo de ate 700 caminhoes diarios.

A solucao envolveu um tombador de 30 metros com tratamento anticorrosivo especial, sistema hidraulico redundante e automacao completa com integracao ao sistema de gestao portuaria.`,
    metrics: [
      { label: "caminhoes/dia", value: "700" },
      { label: "investimento", value: "R$ 22 mi" },
      { label: "tempo operacao", value: "24/7" },
    ],
    products: ["tombador-30m"],
    featured: true,
  },
  {
    slug: "paraguai-pioneiro",
    title: "Primeiro tombador de grande porte do Paraguai",
    client: "Terminal Graneleiro",
    location: "Paraguai",
    year: 2017,
    application: "cooperativa",
    summary:
      "Exportacao e instalacao do primeiro tombador hidraulico de grande porte do Paraguai, marcando a entrada da PILI no mercado internacional.",
    content: `Em 2017, a PILI Industrial realizou uma operacao historica: a exportacao e instalacao do primeiro tombador hidraulico de grande porte no Paraguai.

O projeto demandou adaptacoes especificas para as condicoes locais, incluindo configuracao para energia eletrica local e suporte tecnico bilingue.

Esta instalacao abriu caminho para a expansao da PILI em mais de 18 paises na America Latina e Africa.`,
    metrics: [
      { label: "capacidade", value: "80 t" },
      { label: "paises PILI", value: "18+" },
    ],
    products: ["tombador-26m"],
    featured: true,
  },
  {
    slug: "cargill-terminal",
    title: "Modernizacao do terminal Cargill",
    client: "Cargill",
    location: "Tres Lagoas/MS",
    year: 2020,
    application: "industria",
    summary:
      "Substituicao de tombadores antigos por 3 unidades PILI de 21 metros no terminal da Cargill, aumentando a capacidade em 40%.",
    content: `A Cargill selecionou a PILI para modernizar seu terminal em Tres Lagoas/MS com tres novos tombadores de 21 metros.

O projeto foi executado em fases para manter a operacao durante a safra, com cada tombador instalado em janelas de 25 dias.

O resultado foi um aumento de 40% na capacidade de descarga do terminal.`,
    metrics: [
      { label: "unidades", value: "3" },
      { label: "aumento capacidade", value: "+40%" },
      { label: "prazo/unidade", value: "25 dias" },
    ],
    products: ["tombador-21m"],
    featured: false,
  },
  {
    slug: "jbs-fertilizantes",
    title: "Linha de descarga JBS Fertilizantes",
    client: "JBS Fertilizantes",
    location: "Catalao/GO",
    year: 2022,
    application: "fertilizante",
    summary:
      "Projeto completo de descarga de fertilizantes com tombadores especiais para operacao com materiais corrosivos.",
    content: `A JBS Fertilizantes exigia tombadores capazes de operar com granulados e po de fertilizante — materiais altamente corrosivos e abrasivos.

A PILI desenvolveu uma versao especial do tombador de 18 metros com revestimento interno em aco inox, sistema de lavagem automatica e vedacao reforçada.`,
    metrics: [
      { label: "modelos especiais", value: "2" },
      { label: "revestimento", value: "Inox 316L" },
    ],
    products: ["tombador-18m"],
    featured: false,
  },
  {
    slug: "cooperativa-agraria",
    title: "Upgrade Cooperativa Agraria",
    client: "Cooperativa Agraria",
    location: "Guarapuava/PR",
    year: 2023,
    application: "cooperativa",
    summary:
      "Instalacao de tombador de 26 metros na Cooperativa Agraria, substituindo equipamento de terceiros com ganho de 50% em velocidade de ciclo.",
    content: `A Cooperativa Agraria de Guarapuava operava com tombadores de um concorrente que apresentavam paradas frequentes e ciclos lentos.

A PILI forneceu um tombador de 26 metros que reduziu o ciclo de descarga de 4 minutos para menos de 2,5 minutos — um ganho de 50% em velocidade.`,
    metrics: [
      { label: "reducao ciclo", value: "-50%" },
      { label: "caminhoes/dia", value: "450" },
    ],
    products: ["tombador-26m"],
    featured: false,
  },
];

export function getCase(slug: string) {
  return CASES.find((c) => c.slug === slug);
}

export function getFeaturedCases() {
  return CASES.filter((c) => c.featured);
}

export function getCasesByApplication(app: string) {
  return CASES.filter((c) => c.application === app);
}
