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
  // ─── TOMBADORES FIXOS ────────────────────────────────────────────────

  {
    slug: "tombador-10m-fixo",
    category: "TOMBADOR_FIXO",
    name: "Tombador 10 Metros Fixo",
    tagline: "Performance comprovada para operações de entrada",
    description:
      "Plataforma de descarga fixa de 10 metros com capacidade para 45 toneladas. Ideal para pequenas cooperativas e propriedades rurais que necessitam de ciclo rápido com caminhões truck convencionais.",
    capacity: "45 t",
    length: "10.000 mm",
    specs: [
      { label: "Capacidade", value: "45 t" },
      { label: "Comprimento", value: "10.000 mm" },
      { label: "Largura", value: "3.000 mm" },
      { label: "Ângulo máximo", value: "45°" },
      { label: "Ciclo", value: "~60 s" },
      { label: "Motor", value: "75 CV" },
      { label: "Estrutura", value: "Aço ASTM A572 Gr.50" },
      { label: "Peso", value: "~12.000 kg" },
    ],
    features: [
      {
        title: "Ciclo rápido",
        description:
          "Descarga completa em aproximadamente 60 segundos, garantindo alta produtividade mesmo em operações compactas.",
        icon: "Timer",
      },
      {
        title: "Instalação simplificada",
        description:
          "Fundação reduzida e montagem rápida, permitindo início de operação em poucas semanas.",
        icon: "Wrench",
      },
      {
        title: "Segurança NR-12",
        description:
          "Projeto em conformidade com NR-12 e NR-10, incluindo sensores de presença e alarmes de operação.",
        icon: "Shield",
      },
    ],
    applications: ["cooperativa", "industria"],
    featured: false,
  },

  {
    slug: "tombador-11m-fixo",
    category: "TOMBADOR_FIXO",
    name: "Tombador 11 Metros Fixo",
    tagline: "O padrão regional para cooperativas de grãos",
    description:
      "Plataforma de descarga fixa de 11 metros com capacidade para 50 toneladas. Dimensão padrão para cooperativas regionais que recebem trucks e bi-trucks, com equilíbrio entre custo e capacidade.",
    capacity: "50 t",
    length: "11.000 mm",
    specs: [
      { label: "Capacidade", value: "50 t" },
      { label: "Comprimento", value: "11.000 mm" },
      { label: "Largura", value: "3.000 mm" },
      { label: "Ângulo máximo", value: "45°" },
      { label: "Ciclo", value: "~60 s" },
      { label: "Motor", value: "75 CV" },
      { label: "Estrutura", value: "Aço ASTM A572 Gr.50" },
      { label: "Peso", value: "~14.000 kg" },
    ],
    features: [
      {
        title: "Versatilidade de frota",
        description:
          "Aceita trucks e bi-trucks convencionais, cobrindo a maioria das frotas regionais.",
        icon: "Truck",
      },
      {
        title: "Custo-benefício otimizado",
        description:
          "Melhor relação investimento/capacidade para cooperativas de médio porte.",
        icon: "Gauge",
      },
      {
        title: "Automação integrada",
        description:
          "PLC com IHM touchscreen para controle preciso do ciclo de descarga.",
        icon: "Activity",
      },
    ],
    applications: ["cooperativa", "industria"],
    featured: false,
  },

  {
    slug: "tombador-12m-fixo",
    category: "TOMBADOR_FIXO",
    name: "Tombador 12 Metros Fixo",
    tagline: "Capacidade ampliada para bi-trucks e composições padrão",
    description:
      "Plataforma de descarga fixa de 12 metros com capacidade para 55 toneladas. Projetado para operar com bi-trucks e composições caminhão-reboque padrão, atendendo cooperativas e indústrias de médio porte.",
    capacity: "55 t",
    length: "12.000 mm",
    specs: [
      { label: "Capacidade", value: "55 t" },
      { label: "Comprimento", value: "12.000 mm" },
      { label: "Largura", value: "3.200 mm" },
      { label: "Ângulo máximo", value: "45°" },
      { label: "Ciclo", value: "~65 s" },
      { label: "Motor", value: "100 CV" },
      { label: "Estrutura", value: "Aço ASTM A572 Gr.50" },
      { label: "Peso", value: "~18.000 kg" },
    ],
    features: [
      {
        title: "Motor de alta potência",
        description:
          "Motor de 100 CV garante ciclo estável mesmo com cargas máximas de 55 toneladas.",
        icon: "Zap",
      },
      {
        title: "Estrutura reforçada",
        description:
          "Aço ASTM A572 Gr.50 com tratamento anticorrosivo por jateamento e pintura epoxi.",
        icon: "Shield",
      },
      {
        title: "Operação contínua",
        description:
          "Projetado para operação 24/7 com intervalos mínimos de manutenção preventiva.",
        icon: "Activity",
      },
      {
        title: "Manutenção facilitada",
        description:
          "Acesso simplificado a todos os componentes hidráulicos e elétricos para rápida intervenção.",
        icon: "Wrench",
      },
    ],
    applications: ["cooperativa", "industria", "cimento"],
    featured: false,
  },

  {
    slug: "tombador-18m-fixo",
    category: "TOMBADOR_FIXO",
    name: "Tombador 18 Metros Fixo",
    tagline: "Projetado para rodotrens e operações de alto fluxo",
    description:
      "Plataforma de descarga fixa de 18 metros com capacidade para 70 toneladas. Dimensionado para rodotrens, ideal para grandes cooperativas e terminais com alta demanda de recebimento.",
    capacity: "70 t",
    length: "18.000 mm",
    specs: [
      { label: "Capacidade", value: "70 t" },
      { label: "Comprimento", value: "18.000 mm" },
      { label: "Largura", value: "3.400 mm" },
      { label: "Ângulo máximo", value: "42°" },
      { label: "Ciclo", value: "~70 s" },
      { label: "Motor", value: "150 CV" },
      { label: "Estrutura", value: "Aço ASTM A572 Gr.50" },
      { label: "Peso", value: "~28.000 kg" },
    ],
    features: [
      {
        title: "Capacidade para rodotrens",
        description:
          "Comprimento de 18 metros comporta rodotrens e composições longas sem restrições.",
        icon: "Truck",
      },
      {
        title: "Motor de 150 CV",
        description:
          "Potência robusta para ciclos rápidos mesmo com 70 toneladas de carga.",
        icon: "Zap",
      },
      {
        title: "Sistema hidráulico redundante",
        description:
          "Duplo circuito hidráulico com válvulas de segurança para operação ininterrupta.",
        icon: "Shield",
      },
      {
        title: "Automação avançada",
        description:
          "PLC Siemens com IHM touchscreen, controle de rampa e sensores de posição integrados.",
        icon: "Activity",
      },
    ],
    applications: ["cooperativa", "industria", "fertilizante"],
    featured: false,
  },

  {
    slug: "tombador-21m-fixo",
    category: "TOMBADOR_FIXO",
    name: "Tombador 21 Metros Fixo",
    tagline: "Grande porte para terminais portuários e cooperativas de escala",
    description:
      "Plataforma de descarga fixa de 21 metros com capacidade para 80 toneladas. Projetado para grandes rodotrens em operações portuárias e cooperativas de grande escala que demandam alta capacidade.",
    capacity: "80 t",
    length: "21.000 mm",
    specs: [
      { label: "Capacidade", value: "80 t" },
      { label: "Comprimento", value: "21.000 mm" },
      { label: "Largura", value: "3.400 mm" },
      { label: "Ângulo máximo", value: "42°" },
      { label: "Ciclo", value: "~75 s" },
      { label: "Motor", value: "200 CV" },
      { label: "Estrutura", value: "Aço ASTM A572 Gr.50" },
      { label: "Peso", value: "~35.000 kg" },
    ],
    features: [
      {
        title: "Alta capacidade",
        description:
          "80 toneladas de capacidade nominal para os maiores rodotrens em operação no Brasil.",
        icon: "Weight",
      },
      {
        title: "Ciclo otimizado",
        description:
          "Descarga completa em aproximadamente 75 segundos com motor de 200 CV.",
        icon: "Timer",
      },
      {
        title: "Resistência à corrosão",
        description:
          "Jateamento SA 2.5 com pintura epoxi de alta espessura para ambientes portuários agressivos.",
        icon: "Shield",
      },
      {
        title: "Instalação modular",
        description:
          "Transporte em módulos pré-montados para instalação rápida em até 45 dias.",
        icon: "Factory",
      },
    ],
    applications: ["porto", "cooperativa", "industria"],
    featured: false,
  },

  {
    slug: "tombador-26m-fixo",
    category: "TOMBADOR_FIXO",
    name: "Tombador 26 Metros Fixo",
    tagline: "Operação pesada para terminais graneleiros de grande porte",
    description:
      "Plataforma de descarga fixa de 26 metros com capacidade para 90 toneladas. Projetado para operações portuárias pesadas com configurações de múltiplos eixos e composições especiais.",
    capacity: "90 t",
    length: "26.000 mm",
    specs: [
      { label: "Capacidade", value: "90 t" },
      { label: "Comprimento", value: "26.000 mm" },
      { label: "Largura", value: "3.400 mm" },
      { label: "Ângulo máximo", value: "42°" },
      { label: "Ciclo", value: "~80 s" },
      { label: "Motor", value: "250 CV" },
      { label: "Estrutura", value: "Aço ASTM A572 Gr.50" },
      { label: "Peso", value: "~40.000 kg" },
    ],
    features: [
      {
        title: "Versatilidade de eixos",
        description:
          "Aceita configurações de múltiplos eixos incluindo carretas especiais de 26 metros.",
        icon: "Truck",
      },
      {
        title: "Potência industrial",
        description:
          "Motor de 250 CV para movimentação segura de cargas de até 90 toneladas.",
        icon: "Zap",
      },
      {
        title: "Segurança reforçada",
        description:
          "Sistemas redundantes de segurança conforme NR-12 e NR-10 para operação crítica.",
        icon: "AlertTriangle",
      },
      {
        title: "Durabilidade comprovada",
        description:
          "Estrutura em aço de alta resistência com vida útil projetada para mais de 20 anos.",
        icon: "Shield",
      },
    ],
    applications: ["porto", "cooperativa", "industria", "fertilizante"],
    featured: false,
  },

  {
    slug: "tombador-30m-fixo",
    category: "TOMBADOR_FIXO",
    name: "Tombador 30 Metros Fixo",
    tagline: "O maior tombador hidráulico do mercado brasileiro",
    description:
      "Plataforma de descarga fixa de 30 metros com capacidade para 100 toneladas. O tombador de maior porte da America Latina, projetado para os maiores terminais portuários e operações com os maiores rodotrens do mercado.",
    capacity: "100 t",
    length: "30.000 mm",
    specs: [
      { label: "Capacidade", value: "100 t" },
      { label: "Comprimento", value: "30.000 mm" },
      { label: "Largura", value: "3.400 mm" },
      { label: "Ângulo máximo", value: "45°" },
      { label: "Ciclo", value: "~90 s" },
      { label: "Motor", value: "300 CV" },
      { label: "Estrutura", value: "Aço ASTM A572 Gr.50" },
      { label: "Peso", value: "~48.000 kg" },
    ],
    features: [
      {
        title: "Capacidade máxima",
        description:
          "100 toneladas de capacidade nominal — o tombador de maior porte do mercado latino-americano.",
        icon: "Weight",
      },
      {
        title: "Motor de 300 CV",
        description:
          "Potência excepcional para ciclos de descarga completa em aproximadamente 90 segundos.",
        icon: "Zap",
      },
      {
        title: "Aco de alta resistência",
        description:
          "Estrutura em aço ASTM A572 Gr.50 com tratamento anticorrosivo por jateamento e pintura epoxi.",
        icon: "Shield",
      },
      {
        title: "Sistema hidráulico redundante",
        description:
          "Duplo circuito hidráulico com válvulas de segurança para operação contínua sem interrupções.",
        icon: "Gauge",
      },
      {
        title: "Automação de ponta",
        description:
          "PLC Siemens com IHM touchscreen, controle de rampa, sensores de posição e alarmes de segurança.",
        icon: "Activity",
      },
      {
        title: "Manutenção simplificada",
        description:
          "Acesso facilitado a todos os componentes hidráulicos e elétricos. Suporte técnico 24h.",
        icon: "Wrench",
      },
    ],
    applications: ["porto", "cooperativa", "industria"],
    featured: true,
  },

  {
    slug: "tombador-cabine-externa",
    category: "TOMBADOR_FIXO",
    name: "Tombador com Cabine Externa",
    tagline: "Operação segura com cabine fechada em conformidade NR-12",
    description:
      "Tombador fixo de 12 metros equipado com cabine externa de operação fechada. Proporciona segurança máxima ao operador com visão panorâmica e conforto térmico, em total conformidade com NR-12.",
    capacity: "55 t",
    length: "12.000 mm",
    specs: [
      { label: "Capacidade", value: "55 t" },
      { label: "Comprimento", value: "12.000 mm" },
      { label: "Largura", value: "3.200 mm" },
      { label: "Ângulo máximo", value: "45°" },
      { label: "Ciclo", value: "~65 s" },
      { label: "Motor", value: "100 CV" },
      { label: "Cabine", value: "Fechada, climatizada" },
      { label: "Normas", value: "NR-12 / NR-10" },
    ],
    features: [
      {
        title: "Cabine de segurança",
        description:
          "Cabine externa fechada e climatizada com visão panorâmica de toda a área de descarga.",
        icon: "Shield",
      },
      {
        title: "Conformidade total NR-12",
        description:
          "Projeto integralmente conforme NR-12 e NR-10, com CLPs de segurança dedicados.",
        icon: "AlertTriangle",
      },
      {
        title: "Conforto do operador",
        description:
          "Cabine com ar condicionado, assento ergonômico e painel de controle integrado.",
        icon: "Gauge",
      },
      {
        title: "Operação protegida",
        description:
          "Operador isolado de poeira, ruído e intempéries, aumentando produtividade e segurança.",
        icon: "Factory",
      },
    ],
    applications: ["cooperativa", "industria", "porto"],
    featured: false,
  },

  // ─── TOMBADORES MOVEIS ───────────────────────────────────────────────

  {
    slug: "tombador-10m-móvel",
    category: "TOMBADOR_MOVEL",
    name: "Tombador 10 Metros Móvel",
    tagline: "Mobilidade e rapidez para operações sazonais",
    description:
      "Tombador móvel de 10 metros com capacidade para 40 toneladas. Pode ser transportado e reinstalado entre diferentes unidades, ideal para operações sazonais e locais temporários de recebimento.",
    capacity: "40 t",
    length: "10.000 mm",
    specs: [
      { label: "Capacidade", value: "40 t" },
      { label: "Comprimento", value: "10.000 mm" },
      { label: "Largura", value: "3.000 mm" },
      { label: "Ângulo máximo", value: "42°" },
      { label: "Ciclo", value: "~65 s" },
      { label: "Motor", value: "75 CV" },
      { label: "Tipo", value: "Móvel / Portátil" },
      { label: "Instalação", value: "Rápida, sem fundação especial" },
    ],
    features: [
      {
        title: "Mobilidade total",
        description:
          "Estrutura projetada para transporte rodoviário e reinstalação rápida entre unidades.",
        icon: "Truck",
      },
      {
        title: "Instalação rápida",
        description:
          "Dispensa fundação especial — operacional em poucos dias após chegada ao local.",
        icon: "Timer",
      },
      {
        title: "Resistencia de tombador fixo",
        description:
          "Mesma qualidade estrutural dos modelos fixos, com aço ASTM A572 Gr.50.",
        icon: "Shield",
      },
    ],
    applications: ["cooperativa", "industria"],
    featured: false,
  },

  {
    slug: "tombador-11m-móvel",
    category: "TOMBADOR_MOVEL",
    name: "Tombador 11 Metros Móvel",
    tagline: "Padrao móvel para frotas de locação e safra",
    description:
      "Tombador móvel de 11 metros com capacidade para 45 toneladas. Dimensão padrão para operações sazonais, frotas de locação e pontos temporários de recebimento de grãos.",
    capacity: "45 t",
    length: "11.000 mm",
    specs: [
      { label: "Capacidade", value: "45 t" },
      { label: "Comprimento", value: "11.000 mm" },
      { label: "Largura", value: "3.000 mm" },
      { label: "Ângulo máximo", value: "42°" },
      { label: "Ciclo", value: "~65 s" },
      { label: "Motor", value: "75 CV" },
      { label: "Tipo", value: "Móvel / Portátil" },
      { label: "Instalação", value: "Rápida, sem fundação especial" },
    ],
    features: [
      {
        title: "Ideal para locação",
        description:
          "Estrutura móvel dimensionada para frotas de aluguel em períodos de safra.",
        icon: "Truck",
      },
      {
        title: "Versatilidade operacional",
        description:
          "Aceita trucks e bi-trucks convencionais com ciclo de aproximadamente 65 segundos.",
        icon: "Gauge",
      },
      {
        title: "Transporte facilitado",
        description:
          "Dimensões compatíveis com transporte rodoviário sem necessidade de escolta especial.",
        icon: "Ruler",
      },
    ],
    applications: ["cooperativa", "industria"],
    featured: false,
  },

  {
    slug: "tombador-12m-móvel",
    category: "TOMBADOR_MOVEL",
    name: "Tombador 12 Metros Móvel",
    tagline: "Capacidade para bi-trucks com total portabilidade",
    description:
      "Tombador móvel de 12 metros com capacidade para 50 toneladas. Combina a capacidade de receber bi-trucks com a flexibilidade de relocação entre unidades operacionais.",
    capacity: "50 t",
    length: "12.000 mm",
    specs: [
      { label: "Capacidade", value: "50 t" },
      { label: "Comprimento", value: "12.000 mm" },
      { label: "Largura", value: "3.200 mm" },
      { label: "Ângulo máximo", value: "42°" },
      { label: "Ciclo", value: "~70 s" },
      { label: "Motor", value: "100 CV" },
      { label: "Tipo", value: "Móvel / Portátil" },
      { label: "Peso", value: "~16.000 kg" },
    ],
    features: [
      {
        title: "Motor de 100 CV",
        description:
          "Potência suficiente para descarga rápida de bi-trucks com até 50 toneladas.",
        icon: "Zap",
      },
      {
        title: "Relocação entre safras",
        description:
          "Pode ser desmontado e remontado em nova localidade conforme a demanda sazonal.",
        icon: "Truck",
      },
      {
        title: "Automação padrão PILI",
        description:
          "Mesmo sistema de automação e segurança dos tombadores fixos da linha.",
        icon: "Activity",
      },
    ],
    applications: ["cooperativa", "industria", "cimento"],
    featured: false,
  },

  {
    slug: "tombador-18m-móvel",
    category: "TOMBADOR_MOVEL",
    name: "Tombador 18 Metros Móvel",
    tagline: "Grande porte móvel para rodotrens itinerantes",
    description:
      "Tombador móvel de 18 metros com capacidade para 65 toneladas. Unidade de grande porte com mobilidade, projetada para operações com rodotrens em locais temporários de recebimento.",
    capacity: "65 t",
    length: "18.000 mm",
    specs: [
      { label: "Capacidade", value: "65 t" },
      { label: "Comprimento", value: "18.000 mm" },
      { label: "Largura", value: "3.400 mm" },
      { label: "Ângulo máximo", value: "42°" },
      { label: "Ciclo", value: "~75 s" },
      { label: "Motor", value: "150 CV" },
      { label: "Tipo", value: "Móvel / Portátil" },
      { label: "Peso", value: "~25.000 kg" },
    ],
    features: [
      {
        title: "Rodotrens em campo",
        description:
          "Capacidade para receber rodotrens diretamente em pontos temporários de colheita.",
        icon: "Truck",
      },
      {
        title: "Motor de 150 CV",
        description:
          "Potência robusta para ciclo estável com cargas de até 65 toneladas.",
        icon: "Zap",
      },
      {
        title: "Estrutura transportável",
        description:
          "Projetado em módulos para transporte rodoviário e montagem rápida em campo.",
        icon: "Cog",
      },
      {
        title: "Segurança integral",
        description:
          "Todos os dispositivos de segurança NR-12 mesmo em configuração móvel.",
        icon: "Shield",
      },
    ],
    applications: ["cooperativa", "industria", "fertilizante"],
    featured: false,
  },

  {
    slug: "tombador-21m-móvel",
    category: "TOMBADOR_MOVEL",
    name: "Tombador 21 Metros Móvel",
    tagline: "O maior tombador móvel do mercado nacional",
    description:
      "Tombador móvel de 21 metros com capacidade para 75 toneladas. A maior unidade móvel disponível no mercado, combinando capacidade de grande porte com a flexibilidade de operação temporaria em diferentes locais.",
    capacity: "75 t",
    length: "21.000 mm",
    specs: [
      { label: "Capacidade", value: "75 t" },
      { label: "Comprimento", value: "21.000 mm" },
      { label: "Largura", value: "3.400 mm" },
      { label: "Ângulo máximo", value: "42°" },
      { label: "Ciclo", value: "~80 s" },
      { label: "Motor", value: "200 CV" },
      { label: "Tipo", value: "Móvel / Portátil" },
      { label: "Peso", value: "~32.000 kg" },
    ],
    features: [
      {
        title: "Maior móvel do mercado",
        description:
          "75 toneladas de capacidade em configuração móvel — único no mercado brasileiro.",
        icon: "Weight",
      },
      {
        title: "Motor de 200 CV",
        description:
          "Potência excepcional para movimentar os maiores rodotrens com ciclo de 80 segundos.",
        icon: "Zap",
      },
      {
        title: "Modularidade avançada",
        description:
          "Sistema modular que permite transporte em carretas convencionais e montagem em campo.",
        icon: "Cog",
      },
      {
        title: "Automação completa",
        description:
          "PLC com IHM touchscreen, sensores de posição e sistema de segurança integrado.",
        icon: "Activity",
      },
    ],
    applications: ["porto", "cooperativa", "industria"],
    featured: true,
  },

  // ─── COLETOR DE AMOSTRAS ─────────────────────────────────────────────

  {
    slug: "coletor-amostras",
    category: "COLETOR_AMOSTRAS",
    name: "Coletor de Amostra de Grãos PILI",
    tagline: "Amostragem pneumática precisa conforme padrões MAPA e CONAB",
    description:
      "Sistema pneumático de coleta de amostras de grãos com profundidade de até 2,5 metros. Garante amostragem representativa e rastreável em conformidade com os padrões do MAPA e CONAB para classificação de grãos.",
    capacity: "-",
    length: "-",
    specs: [
      { label: "Tipo", value: "Pneumático" },
      { label: "Profundidade", value: "Até 2,5 m" },
      { label: "Amostra", value: "1 a 3 kg" },
      { label: "Acionamento", value: "Automático / Manual" },
      { label: "Normas", value: "MAPA / CONAB" },
      { label: "Rastreabilidade", value: "RFID / QR Code" },
      { label: "Integração", value: "Tombadores PILI" },
      { label: "Material", value: "Aço inox nos pontos de contato" },
    ],
    features: [
      {
        title: "Amostragem representativa",
        description:
          "Coleta em múltiplos pontos e profundidades da carga, garantindo amostra fidedigna ao lote completo.",
        icon: "Gauge",
      },
      {
        title: "Conformidade MAPA/CONAB",
        description:
          "Projetado para atender integralmente as normas de classificação e amostragem de grãos.",
        icon: "Shield",
      },
      {
        title: "Rastreabilidade total",
        description:
          "Cada amostra vinculada a placa, nota fiscal e lote via RFID ou QR Code.",
        icon: "Activity",
      },
      {
        title: "Integração com tombadores",
        description:
          "Conecta-se diretamente aos tombadores PILI para fluxo automatizado de amostragem durante descarga.",
        icon: "Cog",
      },
    ],
    applications: ["porto", "cooperativa"],
    featured: true,
  },

  // ─── UNIDADE DE TRANSBORDO ───────────────────────────────────────────

  {
    slug: "unidade-transbordo",
    category: "UNIDADE_TRANSBORDO",
    name: "Unidade de Transbordo PILI",
    tagline: "Logística intermodal ágil para transbordo de grãos entre veículos",
    description:
      "Unidade de transbordo com capacidade de 40 toneladas por ciclo para transferência de grãos entre veículos. Solução essencial para logística intermodal, permitindo transbordo rápido em pontos estratégicos da cadeia.",
    capacity: "40 t/ciclo",
    length: "-",
    specs: [
      { label: "Capacidade", value: "40 t por ciclo" },
      { label: "Motor", value: "100 CV" },
      { label: "Tipo", value: "Transbordo intermodal" },
      { label: "Acionamento", value: "Hidráulico" },
      { label: "Estrutura", value: "Aço ASTM A572 Gr.50" },
      { label: "Mobilidade", value: "Transportavel" },
      { label: "Aplicação", value: "Grãos a granel" },
      { label: "Normas", value: "NR-12 / NR-10" },
    ],
    features: [
      {
        title: "Transbordo rápido",
        description:
          "Transferencia de 40 toneladas por ciclo entre veículos de diferentes portes.",
        icon: "Timer",
      },
      {
        title: "Logística intermodal",
        description:
          "Permite transbordo entre caminhões, vagões e outros veículos em pontos estratégicos.",
        icon: "Truck",
      },
      {
        title: "Portabilidade",
        description:
          "Unidade transportável que pode ser posicionada em diferentes pontos da cadeia logística.",
        icon: "Cog",
      },
      {
        title: "Robustez industrial",
        description:
          "Estrutura em aço de alta resistência para operação contínua em ambientes severos.",
        icon: "Shield",
      },
    ],
    applications: ["porto", "cooperativa", "industria"],
    featured: true,
  },

  // ─── PRODUTOS ESPECIAIS ──────────────────────────────────────────────

  {
    slug: "rachador-lenha-50t",
    category: "ESPECIAL",
    name: "Rachador de Lenha 50 Toneladas",
    tagline: "Força hidráulica de 50 toneladas para processamento de biomassa",
    description:
      "Rachador de lenha industrial com força de 50 toneladas e ciclo de aproximadamente 15 segundos. Projetado para processamento de biomassa e lenha para geração de energia em caldeiras industriais.",
    capacity: "50 t de força",
    length: "-",
    specs: [
      { label: "Força", value: "50 t" },
      { label: "Ciclo", value: "~15 s" },
      { label: "Acionamento", value: "Hidráulico" },
      { label: "Abertura máxima", value: "1.200 mm" },
      { label: "Lâmina", value: "Aço temperado" },
      { label: "Alimentação", value: "Elétrica trifásica" },
    ],
    features: [
      {
        title: "Força de 50 toneladas",
        description:
          "Capacidade para processar toras de grande diâmetro com facilidade e segurança.",
        icon: "Zap",
      },
      {
        title: "Ciclo rápido",
        description:
          "Aproximadamente 15 segundos por ciclo, garantindo alta produtividade no processamento.",
        icon: "Timer",
      },
      {
        title: "Aplicação em biomassa",
        description:
          "Ideal para preparação de lenha destinada a caldeiras industriais e geração de energia.",
        icon: "Factory",
      },
    ],
    applications: ["industria"],
    featured: false,
  },

  {
    slug: "prensa-hidraulica",
    category: "ESPECIAL",
    name: "Prensa Hidráulica 60-200 Toneladas",
    tagline: "Prensa industrial configurável de 60 a 200 toneladas de força",
    description:
      "Prensa hidráulica multipropósito com força configurável de 60 a 200 toneladas. Solução versátil para conformação, estampagem e processos industriais diversos com alta precisão e repetibilidade.",
    capacity: "60-200 t",
    length: "-",
    specs: [
      { label: "Força", value: "60 a 200 t (configurável)" },
      { label: "Acionamento", value: "Hidráulico" },
      { label: "Curso", value: "Configuravel" },
      { label: "Mesa", value: "Sob medida" },
      { label: "Comando", value: "PLC com IHM" },
      { label: "Normas", value: "NR-12 / NR-10" },
    ],
    features: [
      {
        title: "Força configurável",
        description:
          "De 60 a 200 toneladas conforme a necessidade da aplicação industrial.",
        icon: "Gauge",
      },
      {
        title: "Multipropósito",
        description:
          "Conformação, estampagem, dobra e demais processos industriais com alta precisão.",
        icon: "Cog",
      },
      {
        title: "Segurança integrada",
        description:
          "Comandos bimanual, cortinas de luz e CLPs de segurança conforme NR-12.",
        icon: "Shield",
      },
    ],
    applications: ["industria"],
    featured: false,
  },

  {
    slug: "central-hidraulica",
    category: "ESPECIAL",
    name: "Central Hidráulica PILI",
    tagline: "Unidades hidráulicas sob medida para qualquer aplicação industrial",
    description:
      "Centrais hidráulicas projetadas e fabricadas sob medida para atender demandas específicas de pressão, vazão e controle. Solução completa desde o dimensionamento até a instalação e comissionamento.",
    capacity: "-",
    length: "-",
    specs: [
      { label: "Tipo", value: "Sob medida" },
      { label: "Pressão", value: "Até 350 bar" },
      { label: "Vazão", value: "Conforme projeto" },
      { label: "Reservatório", value: "Conforme projeto" },
      { label: "Filtragem", value: "Até 3 microns" },
      { label: "Resfriamento", value: "Ar ou água" },
    ],
    features: [
      {
        title: "Projeto sob medida",
        description:
          "Cada central é dimensionada especificamente para a aplicação do cliente.",
        icon: "Ruler",
      },
      {
        title: "Componentes de primeira linha",
        description:
          "Bombas, válvulas e filtros de fabricantes renomados com garantia de desempenho.",
        icon: "Cog",
      },
      {
        title: "Comissionamento incluso",
        description:
          "Serviço completo de instalação, startup e treinamento operacional no local.",
        icon: "Wrench",
      },
    ],
    applications: ["industria"],
    featured: false,
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
