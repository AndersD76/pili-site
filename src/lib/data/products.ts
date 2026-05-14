export interface ProductData {
  slug: string;
  category: string;
  name: string;
  tagline: string;
  description: string;
  capacity: string;
  length: string;
  specs: { label: string; value: string }[];
  features: { title: string; description: string; icon?: string }[];
  applications: string[];
  featured: boolean;
}

export const PRODUCTS: ProductData[] = [
  {
    slug: "tombador-30m",
    category: "TOMBADOR_FIXO",
    name: "Tombador 30m",
    tagline: "O maior tombador hidraulico do mercado brasileiro",
    description:
      "Plataforma de descarga de 30 metros com capacidade para 100 toneladas. Projetado para operacoes portuarias e grandes terminais de graos, com ciclo de descarga inferior a 2,5 minutos.",
    capacity: "100 t",
    length: "30.000 mm",
    specs: [
      { label: "Capacidade", value: "100 t" },
      { label: "Comprimento", value: "30.000 mm" },
      { label: "Largura", value: "3.400 mm" },
      { label: "Angulo maximo", value: "45°" },
      { label: "Ciclo", value: "2-2,5 min" },
      { label: "Motor", value: "75 CV" },
      { label: "Estrutura", value: "Aco ASTM A572 Gr.50" },
      { label: "Peso", value: "~45.000 kg" },
    ],
    features: [
      {
        title: "Capacidade maxima",
        description:
          "100 toneladas de capacidade nominal — o tombador de maior porte do mercado latino-americano.",
        icon: "Weight",
      },
      {
        title: "Ciclo rapido",
        description:
          "Descarga completa em 2 a 2,5 minutos, permitindo fluxo de ate 700 caminhoes por dia.",
        icon: "Timer",
      },
      {
        title: "Aco de alta resistencia",
        description:
          "Estrutura em aco ASTM A572 Gr.50 com tratamento anticorrosivo por jateamento e pintura epoxi.",
        icon: "Shield",
      },
      {
        title: "Sistema hidraulico redundante",
        description:
          "Duplo circuito hidraulico com valvulas de seguranca para operacao continua sem interrupcoes.",
        icon: "Droplets",
      },
      {
        title: "Automacao integrada",
        description:
          "PLC Siemens com IHM touchscreen, controle de rampa, sensores de posicao e alarmes de seguranca.",
        icon: "Cpu",
      },
      {
        title: "Manutencao simplificada",
        description:
          "Acesso facilitado a todos os componentes hidraulicos e eletricos. Manual completo e suporte tecnico 24h.",
        icon: "Wrench",
      },
    ],
    applications: ["porto", "cooperativa", "industria"],
    featured: true,
  },
  {
    slug: "tombador-26m",
    category: "TOMBADOR_FIXO",
    name: "Tombador 26m",
    tagline: "Alta capacidade para terminais graneleiros",
    description:
      "Plataforma de descarga de 26 metros com capacidade para 80 toneladas. Ideal para cooperativas e terminais de medio/grande porte.",
    capacity: "80 t",
    length: "26.000 mm",
    specs: [
      { label: "Capacidade", value: "80 t" },
      { label: "Comprimento", value: "26.000 mm" },
      { label: "Largura", value: "3.400 mm" },
      { label: "Angulo maximo", value: "42°" },
      { label: "Ciclo", value: "2-2,5 min" },
      { label: "Motor", value: "60 CV" },
      { label: "Estrutura", value: "Aco ASTM A572 Gr.50" },
      { label: "Peso", value: "~35.000 kg" },
    ],
    features: [
      {
        title: "Versatilidade",
        description: "Aceita carretas de ate 26 metros, cobrindo a maioria das combinacoes rodoviarias brasileiras.",
        icon: "Truck",
      },
      {
        title: "Operacao continua",
        description: "Projetado para operacao 24/7 com minimos intervalos de manutencao preventiva.",
        icon: "Clock",
      },
      {
        title: "Baixo consumo",
        description: "Motor de 60 CV com sistema de economia de energia em standby automatico.",
        icon: "Zap",
      },
      {
        title: "Seguranca NR-12",
        description: "Totalmente conforme com NR-12 e NR-10, incluindo CLPs de seguranca dedicados.",
        icon: "ShieldCheck",
      },
      {
        title: "Resistencia a corrosao",
        description: "Jateamento SA 2.5 com pintura epoxi de alta espessura para operacao em ambiente corrosivo.",
        icon: "Paintbrush",
      },
      {
        title: "Instalacao modular",
        description: "Transporte em modulos pre-montados — instalacao em ate 30 dias.",
        icon: "Package",
      },
    ],
    applications: ["cooperativa", "industria", "fertilizante"],
    featured: true,
  },
  {
    slug: "tombador-21m",
    category: "TOMBADOR_FIXO",
    name: "Tombador 21m",
    tagline: "O equilibrio ideal entre capacidade e investimento",
    description:
      "Plataforma de descarga de 21 metros com capacidade para 70 toneladas. Escolha popular para cooperativas e industrias.",
    capacity: "70 t",
    length: "21.000 mm",
    specs: [
      { label: "Capacidade", value: "70 t" },
      { label: "Comprimento", value: "21.000 mm" },
      { label: "Largura", value: "3.200 mm" },
      { label: "Angulo maximo", value: "42°" },
      { label: "Ciclo", value: "2 min" },
      { label: "Motor", value: "50 CV" },
    ],
    features: [
      {
        title: "Compacto e eficiente",
        description: "Menor pegada de instalacao com mesma velocidade de ciclo dos modelos maiores.",
        icon: "Minimize",
      },
      {
        title: "Investimento otimizado",
        description: "Melhor relacao custo/beneficio para operacoes de ate 400 caminhoes/dia.",
        icon: "TrendingUp",
      },
      {
        title: "Facil manutencao",
        description: "Componentes padronizados e acesso simplificado ao sistema hidraulico.",
        icon: "Wrench",
      },
      {
        title: "Automacao completa",
        description: "Mesmo nivel de automacao dos modelos maiores com PLC e IHM touch.",
        icon: "Cpu",
      },
    ],
    applications: ["cooperativa", "industria", "fertilizante", "cimento"],
    featured: false,
  },
  {
    slug: "tombador-18m",
    category: "TOMBADOR_FIXO",
    name: "Tombador 18m",
    tagline: "Versatil para trucks e bi-trucks",
    description:
      "Plataforma de descarga de 18 metros com capacidade para 60 toneladas. Ideal para operacoes com frota diversificada.",
    capacity: "60 t",
    length: "18.000 mm",
    specs: [
      { label: "Capacidade", value: "60 t" },
      { label: "Comprimento", value: "18.000 mm" },
      { label: "Largura", value: "3.200 mm" },
      { label: "Angulo maximo", value: "40°" },
      { label: "Ciclo", value: "1,5-2 min" },
      { label: "Motor", value: "40 CV" },
    ],
    features: [],
    applications: ["cooperativa", "industria", "cimento"],
    featured: false,
  },
  {
    slug: "tombador-12m",
    category: "TOMBADOR_FIXO",
    name: "Tombador 12m",
    tagline: "Compacto para operacoes de medio porte",
    description:
      "Plataforma de descarga de 12 metros com capacidade para 45 toneladas.",
    capacity: "45 t",
    length: "12.000 mm",
    specs: [
      { label: "Capacidade", value: "45 t" },
      { label: "Comprimento", value: "12.000 mm" },
      { label: "Largura", value: "3.000 mm" },
      { label: "Angulo maximo", value: "40°" },
      { label: "Ciclo", value: "1,5 min" },
      { label: "Motor", value: "30 CV" },
    ],
    features: [],
    applications: ["cooperativa", "cimento"],
    featured: false,
  },
  {
    slug: "tombador-10m",
    category: "TOMBADOR_FIXO",
    name: "Tombador 10m",
    tagline: "Entrada na linha PILI com performance comprovada",
    description:
      "Plataforma de descarga de 10 metros com capacidade para 40 toneladas. Modelo de entrada com qualidade PILI.",
    capacity: "40 t",
    length: "10.000 mm",
    specs: [
      { label: "Capacidade", value: "40 t" },
      { label: "Comprimento", value: "10.000 mm" },
      { label: "Largura", value: "3.000 mm" },
      { label: "Angulo maximo", value: "38°" },
      { label: "Ciclo", value: "1,5 min" },
      { label: "Motor", value: "25 CV" },
    ],
    features: [],
    applications: ["cooperativa", "industria"],
    featured: false,
  },
  {
    slug: "tombador-9m",
    category: "TOMBADOR_FIXO",
    name: "Tombador 9m",
    tagline: "O mais compacto da linha",
    description:
      "Plataforma de descarga de 9 metros com capacidade para 35 toneladas. Compacto e robusto.",
    capacity: "35 t",
    length: "9.000 mm",
    specs: [
      { label: "Capacidade", value: "35 t" },
      { label: "Comprimento", value: "9.000 mm" },
      { label: "Largura", value: "2.800 mm" },
      { label: "Angulo maximo", value: "38°" },
      { label: "Ciclo", value: "1-1,5 min" },
      { label: "Motor", value: "20 CV" },
    ],
    features: [],
    applications: ["cooperativa", "cimento"],
    featured: false,
  },
  {
    slug: "coletor-amostras",
    category: "COLETOR_AMOSTRAS",
    name: "Coletor de Amostras",
    tagline: "Amostragem automatizada para classificacao de graos",
    description:
      "Sistema automatizado de coleta de amostras de graos integrado ao tombador. Garante amostragem representativa e rastreavel.",
    capacity: "-",
    length: "-",
    specs: [
      { label: "Tipo", value: "Automatico" },
      { label: "Integracao", value: "Tombadores PILI" },
      { label: "Amostras/hora", value: "120+" },
      { label: "Rastreabilidade", value: "RFID/QR Code" },
    ],
    features: [
      {
        title: "Amostragem representativa",
        description: "Coleta em multiplos pontos da carga garantindo amostra fidedigna ao lote.",
        icon: "Target",
      },
      {
        title: "Rastreabilidade total",
        description: "Cada amostra vinculada a placa, nota fiscal e lote via RFID ou QR Code.",
        icon: "QrCode",
      },
    ],
    applications: ["porto", "cooperativa"],
    featured: true,
  },
];

export function getProduct(slug: string) {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getFeaturedProducts() {
  return PRODUCTS.filter((p) => p.featured);
}

export function getProductsByCategory(category: string) {
  return PRODUCTS.filter((p) => p.category === category);
}
