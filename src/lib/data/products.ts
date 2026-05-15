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
    tagline: "Performance comprovada para operacoes de entrada",
    description:
      "Plataforma de descarga fixa de 10 metros com capacidade para 45 toneladas. Ideal para pequenas cooperativas e propriedades rurais que necessitam de ciclo rapido com caminhoes truck convencionais.",
    capacity: "45 t",
    length: "10.000 mm",
    specs: [
      { label: "Capacidade", value: "45 t" },
      { label: "Comprimento", value: "10.000 mm" },
      { label: "Largura", value: "3.000 mm" },
      { label: "Angulo maximo", value: "45°" },
      { label: "Ciclo", value: "~60 s" },
      { label: "Motor", value: "75 CV" },
      { label: "Estrutura", value: "Aco ASTM A572 Gr.50" },
      { label: "Peso", value: "~12.000 kg" },
    ],
    features: [
      {
        title: "Ciclo rapido",
        description:
          "Descarga completa em aproximadamente 60 segundos, garantindo alta produtividade mesmo em operacoes compactas.",
        icon: "Timer",
      },
      {
        title: "Instalacao simplificada",
        description:
          "Fundacao reduzida e montagem rapida, permitindo inicio de operacao em poucas semanas.",
        icon: "Wrench",
      },
      {
        title: "Seguranca NR-12",
        description:
          "Projeto em conformidade com NR-12 e NR-10, incluindo sensores de presenca e alarmes de operacao.",
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
    tagline: "O padrao regional para cooperativas de graos",
    description:
      "Plataforma de descarga fixa de 11 metros com capacidade para 50 toneladas. Dimensao padrao para cooperativas regionais que recebem trucks e bi-trucks, com equilibrio entre custo e capacidade.",
    capacity: "50 t",
    length: "11.000 mm",
    specs: [
      { label: "Capacidade", value: "50 t" },
      { label: "Comprimento", value: "11.000 mm" },
      { label: "Largura", value: "3.000 mm" },
      { label: "Angulo maximo", value: "45°" },
      { label: "Ciclo", value: "~60 s" },
      { label: "Motor", value: "75 CV" },
      { label: "Estrutura", value: "Aco ASTM A572 Gr.50" },
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
        title: "Custo-beneficio otimizado",
        description:
          "Melhor relacao investimento/capacidade para cooperativas de medio porte.",
        icon: "Gauge",
      },
      {
        title: "Automacao integrada",
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
    tagline: "Capacidade ampliada para bi-trucks e composicoes padrao",
    description:
      "Plataforma de descarga fixa de 12 metros com capacidade para 55 toneladas. Projetado para operar com bi-trucks e composicoes caminhao-reboque padrao, atendendo cooperativas e industrias de medio porte.",
    capacity: "55 t",
    length: "12.000 mm",
    specs: [
      { label: "Capacidade", value: "55 t" },
      { label: "Comprimento", value: "12.000 mm" },
      { label: "Largura", value: "3.200 mm" },
      { label: "Angulo maximo", value: "45°" },
      { label: "Ciclo", value: "~65 s" },
      { label: "Motor", value: "100 CV" },
      { label: "Estrutura", value: "Aco ASTM A572 Gr.50" },
      { label: "Peso", value: "~18.000 kg" },
    ],
    features: [
      {
        title: "Motor de alta potencia",
        description:
          "Motor de 100 CV garante ciclo estavel mesmo com cargas maximas de 55 toneladas.",
        icon: "Zap",
      },
      {
        title: "Estrutura reforçada",
        description:
          "Aco ASTM A572 Gr.50 com tratamento anticorrosivo por jateamento e pintura epoxi.",
        icon: "Shield",
      },
      {
        title: "Operacao continua",
        description:
          "Projetado para operacao 24/7 com intervalos minimos de manutencao preventiva.",
        icon: "Activity",
      },
      {
        title: "Manutencao facilitada",
        description:
          "Acesso simplificado a todos os componentes hidraulicos e eletricos para rapida intervencao.",
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
    tagline: "Projetado para rodotrens e operacoes de alto fluxo",
    description:
      "Plataforma de descarga fixa de 18 metros com capacidade para 70 toneladas. Dimensionado para rodotrens, ideal para grandes cooperativas e terminais com alta demanda de recebimento.",
    capacity: "70 t",
    length: "18.000 mm",
    specs: [
      { label: "Capacidade", value: "70 t" },
      { label: "Comprimento", value: "18.000 mm" },
      { label: "Largura", value: "3.400 mm" },
      { label: "Angulo maximo", value: "42°" },
      { label: "Ciclo", value: "~70 s" },
      { label: "Motor", value: "150 CV" },
      { label: "Estrutura", value: "Aco ASTM A572 Gr.50" },
      { label: "Peso", value: "~28.000 kg" },
    ],
    features: [
      {
        title: "Capacidade para rodotrens",
        description:
          "Comprimento de 18 metros comporta rodotrens e composicoes longas sem restricoes.",
        icon: "Truck",
      },
      {
        title: "Motor de 150 CV",
        description:
          "Potencia robusta para ciclos rapidos mesmo com 70 toneladas de carga.",
        icon: "Zap",
      },
      {
        title: "Sistema hidraulico redundante",
        description:
          "Duplo circuito hidraulico com valvulas de seguranca para operacao ininterrupta.",
        icon: "Shield",
      },
      {
        title: "Automacao avancada",
        description:
          "PLC Siemens com IHM touchscreen, controle de rampa e sensores de posicao integrados.",
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
    tagline: "Grande porte para terminais portuarios e cooperativas de escala",
    description:
      "Plataforma de descarga fixa de 21 metros com capacidade para 80 toneladas. Projetado para grandes rodotrens em operacoes portuarias e cooperativas de grande escala que demandam alta capacidade.",
    capacity: "80 t",
    length: "21.000 mm",
    specs: [
      { label: "Capacidade", value: "80 t" },
      { label: "Comprimento", value: "21.000 mm" },
      { label: "Largura", value: "3.400 mm" },
      { label: "Angulo maximo", value: "42°" },
      { label: "Ciclo", value: "~75 s" },
      { label: "Motor", value: "200 CV" },
      { label: "Estrutura", value: "Aco ASTM A572 Gr.50" },
      { label: "Peso", value: "~35.000 kg" },
    ],
    features: [
      {
        title: "Alta capacidade",
        description:
          "80 toneladas de capacidade nominal para os maiores rodotrens em operacao no Brasil.",
        icon: "Weight",
      },
      {
        title: "Ciclo otimizado",
        description:
          "Descarga completa em aproximadamente 75 segundos com motor de 200 CV.",
        icon: "Timer",
      },
      {
        title: "Resistencia a corrosao",
        description:
          "Jateamento SA 2.5 com pintura epoxi de alta espessura para ambientes portuarios agressivos.",
        icon: "Shield",
      },
      {
        title: "Instalacao modular",
        description:
          "Transporte em modulos pre-montados para instalacao rapida em ate 45 dias.",
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
    tagline: "Operacao pesada para terminais graneleiros de grande porte",
    description:
      "Plataforma de descarga fixa de 26 metros com capacidade para 90 toneladas. Projetado para operacoes portuarias pesadas com configuracoes de multiplos eixos e composicoes especiais.",
    capacity: "90 t",
    length: "26.000 mm",
    specs: [
      { label: "Capacidade", value: "90 t" },
      { label: "Comprimento", value: "26.000 mm" },
      { label: "Largura", value: "3.400 mm" },
      { label: "Angulo maximo", value: "42°" },
      { label: "Ciclo", value: "~80 s" },
      { label: "Motor", value: "250 CV" },
      { label: "Estrutura", value: "Aco ASTM A572 Gr.50" },
      { label: "Peso", value: "~40.000 kg" },
    ],
    features: [
      {
        title: "Versatilidade de eixos",
        description:
          "Aceita configuracoes de multiplos eixos incluindo carretas especiais de 26 metros.",
        icon: "Truck",
      },
      {
        title: "Potencia industrial",
        description:
          "Motor de 250 CV para movimentacao segura de cargas de ate 90 toneladas.",
        icon: "Zap",
      },
      {
        title: "Seguranca reforçada",
        description:
          "Sistemas redundantes de seguranca conforme NR-12 e NR-10 para operacao critica.",
        icon: "AlertTriangle",
      },
      {
        title: "Durabilidade comprovada",
        description:
          "Estrutura em aco de alta resistencia com vida util projetada para mais de 20 anos.",
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
    tagline: "O maior tombador hidraulico do mercado brasileiro",
    description:
      "Plataforma de descarga fixa de 30 metros com capacidade para 100 toneladas. O tombador de maior porte da America Latina, projetado para os maiores terminais portuarios e operacoes com os maiores rodotrens do mercado.",
    capacity: "100 t",
    length: "30.000 mm",
    specs: [
      { label: "Capacidade", value: "100 t" },
      { label: "Comprimento", value: "30.000 mm" },
      { label: "Largura", value: "3.400 mm" },
      { label: "Angulo maximo", value: "45°" },
      { label: "Ciclo", value: "~90 s" },
      { label: "Motor", value: "300 CV" },
      { label: "Estrutura", value: "Aco ASTM A572 Gr.50" },
      { label: "Peso", value: "~48.000 kg" },
    ],
    features: [
      {
        title: "Capacidade maxima",
        description:
          "100 toneladas de capacidade nominal — o tombador de maior porte do mercado latino-americano.",
        icon: "Weight",
      },
      {
        title: "Motor de 300 CV",
        description:
          "Potencia excepcional para ciclos de descarga completa em aproximadamente 90 segundos.",
        icon: "Zap",
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
        icon: "Gauge",
      },
      {
        title: "Automacao de ponta",
        description:
          "PLC Siemens com IHM touchscreen, controle de rampa, sensores de posicao e alarmes de seguranca.",
        icon: "Activity",
      },
      {
        title: "Manutencao simplificada",
        description:
          "Acesso facilitado a todos os componentes hidraulicos e eletricos. Suporte tecnico 24h.",
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
    tagline: "Operacao segura com cabine fechada em conformidade NR-12",
    description:
      "Tombador fixo de 12 metros equipado com cabine externa de operacao fechada. Proporciona seguranca maxima ao operador com visao panoramica e conforto termico, em total conformidade com NR-12.",
    capacity: "55 t",
    length: "12.000 mm",
    specs: [
      { label: "Capacidade", value: "55 t" },
      { label: "Comprimento", value: "12.000 mm" },
      { label: "Largura", value: "3.200 mm" },
      { label: "Angulo maximo", value: "45°" },
      { label: "Ciclo", value: "~65 s" },
      { label: "Motor", value: "100 CV" },
      { label: "Cabine", value: "Fechada, climatizada" },
      { label: "Normas", value: "NR-12 / NR-10" },
    ],
    features: [
      {
        title: "Cabine de seguranca",
        description:
          "Cabine externa fechada e climatizada com visao panoramica de toda a area de descarga.",
        icon: "Shield",
      },
      {
        title: "Conformidade total NR-12",
        description:
          "Projeto integralmente conforme NR-12 e NR-10, com CLPs de seguranca dedicados.",
        icon: "AlertTriangle",
      },
      {
        title: "Conforto do operador",
        description:
          "Cabine com ar condicionado, assento ergonomico e painel de controle integrado.",
        icon: "Gauge",
      },
      {
        title: "Operacao protegida",
        description:
          "Operador isolado de poeira, ruido e intemperies, aumentando produtividade e seguranca.",
        icon: "Factory",
      },
    ],
    applications: ["cooperativa", "industria", "porto"],
    featured: false,
  },

  // ─── TOMBADORES MOVEIS ───────────────────────────────────────────────

  {
    slug: "tombador-10m-movel",
    category: "TOMBADOR_MOVEL",
    name: "Tombador 10 Metros Movel",
    tagline: "Mobilidade e rapidez para operacoes sazonais",
    description:
      "Tombador movel de 10 metros com capacidade para 40 toneladas. Pode ser transportado e reinstalado entre diferentes unidades, ideal para operacoes sazonais e locais temporarios de recebimento.",
    capacity: "40 t",
    length: "10.000 mm",
    specs: [
      { label: "Capacidade", value: "40 t" },
      { label: "Comprimento", value: "10.000 mm" },
      { label: "Largura", value: "3.000 mm" },
      { label: "Angulo maximo", value: "42°" },
      { label: "Ciclo", value: "~65 s" },
      { label: "Motor", value: "75 CV" },
      { label: "Tipo", value: "Movel / Portatil" },
      { label: "Instalacao", value: "Rapida, sem fundacao especial" },
    ],
    features: [
      {
        title: "Mobilidade total",
        description:
          "Estrutura projetada para transporte rodoviario e reinstalacao rapida entre unidades.",
        icon: "Truck",
      },
      {
        title: "Instalacao rapida",
        description:
          "Dispensa fundacao especial — operacional em poucos dias apos chegada ao local.",
        icon: "Timer",
      },
      {
        title: "Resistencia de tombador fixo",
        description:
          "Mesma qualidade estrutural dos modelos fixos, com aco ASTM A572 Gr.50.",
        icon: "Shield",
      },
    ],
    applications: ["cooperativa", "industria"],
    featured: false,
  },

  {
    slug: "tombador-11m-movel",
    category: "TOMBADOR_MOVEL",
    name: "Tombador 11 Metros Movel",
    tagline: "Padrao movel para frotas de locacao e safra",
    description:
      "Tombador movel de 11 metros com capacidade para 45 toneladas. Dimensao padrao para operacoes sazonais, frotas de locacao e pontos temporarios de recebimento de graos.",
    capacity: "45 t",
    length: "11.000 mm",
    specs: [
      { label: "Capacidade", value: "45 t" },
      { label: "Comprimento", value: "11.000 mm" },
      { label: "Largura", value: "3.000 mm" },
      { label: "Angulo maximo", value: "42°" },
      { label: "Ciclo", value: "~65 s" },
      { label: "Motor", value: "75 CV" },
      { label: "Tipo", value: "Movel / Portatil" },
      { label: "Instalacao", value: "Rapida, sem fundacao especial" },
    ],
    features: [
      {
        title: "Ideal para locacao",
        description:
          "Estrutura movel dimensionada para frotas de aluguel em periodos de safra.",
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
          "Dimensoes compatíveis com transporte rodoviario sem necessidade de escolta especial.",
        icon: "Ruler",
      },
    ],
    applications: ["cooperativa", "industria"],
    featured: false,
  },

  {
    slug: "tombador-12m-movel",
    category: "TOMBADOR_MOVEL",
    name: "Tombador 12 Metros Movel",
    tagline: "Capacidade para bi-trucks com total portabilidade",
    description:
      "Tombador movel de 12 metros com capacidade para 50 toneladas. Combina a capacidade de receber bi-trucks com a flexibilidade de relocacao entre unidades operacionais.",
    capacity: "50 t",
    length: "12.000 mm",
    specs: [
      { label: "Capacidade", value: "50 t" },
      { label: "Comprimento", value: "12.000 mm" },
      { label: "Largura", value: "3.200 mm" },
      { label: "Angulo maximo", value: "42°" },
      { label: "Ciclo", value: "~70 s" },
      { label: "Motor", value: "100 CV" },
      { label: "Tipo", value: "Movel / Portatil" },
      { label: "Peso", value: "~16.000 kg" },
    ],
    features: [
      {
        title: "Motor de 100 CV",
        description:
          "Potencia suficiente para descarga rapida de bi-trucks com ate 50 toneladas.",
        icon: "Zap",
      },
      {
        title: "Relocacao entre safras",
        description:
          "Pode ser desmontado e remontado em nova localidade conforme a demanda sazonal.",
        icon: "Truck",
      },
      {
        title: "Automacao padrao PILI",
        description:
          "Mesmo sistema de automacao e seguranca dos tombadores fixos da linha.",
        icon: "Activity",
      },
    ],
    applications: ["cooperativa", "industria", "cimento"],
    featured: false,
  },

  {
    slug: "tombador-18m-movel",
    category: "TOMBADOR_MOVEL",
    name: "Tombador 18 Metros Movel",
    tagline: "Grande porte movel para rodotrens itinerantes",
    description:
      "Tombador movel de 18 metros com capacidade para 65 toneladas. Unidade de grande porte com mobilidade, projetada para operacoes com rodotrens em locais temporarios de recebimento.",
    capacity: "65 t",
    length: "18.000 mm",
    specs: [
      { label: "Capacidade", value: "65 t" },
      { label: "Comprimento", value: "18.000 mm" },
      { label: "Largura", value: "3.400 mm" },
      { label: "Angulo maximo", value: "42°" },
      { label: "Ciclo", value: "~75 s" },
      { label: "Motor", value: "150 CV" },
      { label: "Tipo", value: "Movel / Portatil" },
      { label: "Peso", value: "~25.000 kg" },
    ],
    features: [
      {
        title: "Rodotrens em campo",
        description:
          "Capacidade para receber rodotrens diretamente em pontos temporarios de colheita.",
        icon: "Truck",
      },
      {
        title: "Motor de 150 CV",
        description:
          "Potencia robusta para ciclo estavel com cargas de ate 65 toneladas.",
        icon: "Zap",
      },
      {
        title: "Estrutura transportavel",
        description:
          "Projetado em modulos para transporte rodoviario e montagem rapida em campo.",
        icon: "Cog",
      },
      {
        title: "Seguranca integral",
        description:
          "Todos os dispositivos de seguranca NR-12 mesmo em configuracao movel.",
        icon: "Shield",
      },
    ],
    applications: ["cooperativa", "industria", "fertilizante"],
    featured: false,
  },

  {
    slug: "tombador-21m-movel",
    category: "TOMBADOR_MOVEL",
    name: "Tombador 21 Metros Movel",
    tagline: "O maior tombador movel do mercado nacional",
    description:
      "Tombador movel de 21 metros com capacidade para 75 toneladas. A maior unidade movel disponivel no mercado, combinando capacidade de grande porte com a flexibilidade de operacao temporaria em diferentes locais.",
    capacity: "75 t",
    length: "21.000 mm",
    specs: [
      { label: "Capacidade", value: "75 t" },
      { label: "Comprimento", value: "21.000 mm" },
      { label: "Largura", value: "3.400 mm" },
      { label: "Angulo maximo", value: "42°" },
      { label: "Ciclo", value: "~80 s" },
      { label: "Motor", value: "200 CV" },
      { label: "Tipo", value: "Movel / Portatil" },
      { label: "Peso", value: "~32.000 kg" },
    ],
    features: [
      {
        title: "Maior movel do mercado",
        description:
          "75 toneladas de capacidade em configuracao movel — unico no mercado brasileiro.",
        icon: "Weight",
      },
      {
        title: "Motor de 200 CV",
        description:
          "Potencia excepcional para movimentar os maiores rodotrens com ciclo de 80 segundos.",
        icon: "Zap",
      },
      {
        title: "Modularidade avancada",
        description:
          "Sistema modular que permite transporte em carretas convencionais e montagem em campo.",
        icon: "Cog",
      },
      {
        title: "Automacao completa",
        description:
          "PLC com IHM touchscreen, sensores de posicao e sistema de seguranca integrado.",
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
    name: "Coletor de Amostra de Graos PILI",
    tagline: "Amostragem pneumatica precisa conforme padroes MAPA e CONAB",
    description:
      "Sistema pneumatico de coleta de amostras de graos com profundidade de ate 2,5 metros. Garante amostragem representativa e rastreavel em conformidade com os padroes do MAPA e CONAB para classificacao de graos.",
    capacity: "-",
    length: "-",
    specs: [
      { label: "Tipo", value: "Pneumatico" },
      { label: "Profundidade", value: "Ate 2,5 m" },
      { label: "Amostra", value: "1 a 3 kg" },
      { label: "Acionamento", value: "Automatico / Manual" },
      { label: "Normas", value: "MAPA / CONAB" },
      { label: "Rastreabilidade", value: "RFID / QR Code" },
      { label: "Integracao", value: "Tombadores PILI" },
      { label: "Material", value: "Aco inox nos pontos de contato" },
    ],
    features: [
      {
        title: "Amostragem representativa",
        description:
          "Coleta em multiplos pontos e profundidades da carga, garantindo amostra fidedigna ao lote completo.",
        icon: "Gauge",
      },
      {
        title: "Conformidade MAPA/CONAB",
        description:
          "Projetado para atender integralmente as normas de classificacao e amostragem de graos.",
        icon: "Shield",
      },
      {
        title: "Rastreabilidade total",
        description:
          "Cada amostra vinculada a placa, nota fiscal e lote via RFID ou QR Code.",
        icon: "Activity",
      },
      {
        title: "Integracao com tombadores",
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
    tagline: "Logistica intermodal agil para transbordo de graos entre veiculos",
    description:
      "Unidade de transbordo com capacidade de 40 toneladas por ciclo para transferencia de graos entre veiculos. Solucao essencial para logistica intermodal, permitindo transbordo rapido em pontos estrategicos da cadeia.",
    capacity: "40 t/ciclo",
    length: "-",
    specs: [
      { label: "Capacidade", value: "40 t por ciclo" },
      { label: "Motor", value: "100 CV" },
      { label: "Tipo", value: "Transbordo intermodal" },
      { label: "Acionamento", value: "Hidraulico" },
      { label: "Estrutura", value: "Aco ASTM A572 Gr.50" },
      { label: "Mobilidade", value: "Transportavel" },
      { label: "Aplicacao", value: "Graos a granel" },
      { label: "Normas", value: "NR-12 / NR-10" },
    ],
    features: [
      {
        title: "Transbordo rapido",
        description:
          "Transferencia de 40 toneladas por ciclo entre veiculos de diferentes portes.",
        icon: "Timer",
      },
      {
        title: "Logistica intermodal",
        description:
          "Permite transbordo entre caminhoes, vagoes e outros veiculos em pontos estrategicos.",
        icon: "Truck",
      },
      {
        title: "Portabilidade",
        description:
          "Unidade transportavel que pode ser posicionada em diferentes pontos da cadeia logistica.",
        icon: "Cog",
      },
      {
        title: "Robustez industrial",
        description:
          "Estrutura em aco de alta resistencia para operacao continua em ambientes severos.",
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
    tagline: "Forca hidraulica de 50 toneladas para processamento de biomassa",
    description:
      "Rachador de lenha industrial com forca de 50 toneladas e ciclo de aproximadamente 15 segundos. Projetado para processamento de biomassa e lenha para geracao de energia em caldeiras industriais.",
    capacity: "50 t de forca",
    length: "-",
    specs: [
      { label: "Forca", value: "50 t" },
      { label: "Ciclo", value: "~15 s" },
      { label: "Acionamento", value: "Hidraulico" },
      { label: "Abertura maxima", value: "1.200 mm" },
      { label: "Lâmina", value: "Aco temperado" },
      { label: "Alimentacao", value: "Eletrica trifasica" },
    ],
    features: [
      {
        title: "Forca de 50 toneladas",
        description:
          "Capacidade para processar toras de grande diametro com facilidade e seguranca.",
        icon: "Zap",
      },
      {
        title: "Ciclo rapido",
        description:
          "Aproximadamente 15 segundos por ciclo, garantindo alta produtividade no processamento.",
        icon: "Timer",
      },
      {
        title: "Aplicacao em biomassa",
        description:
          "Ideal para preparacao de lenha destinada a caldeiras industriais e geracao de energia.",
        icon: "Factory",
      },
    ],
    applications: ["industria"],
    featured: false,
  },

  {
    slug: "prensa-hidraulica",
    category: "ESPECIAL",
    name: "Prensa Hidraulica 60-200 Toneladas",
    tagline: "Prensa industrial configuravel de 60 a 200 toneladas de forca",
    description:
      "Prensa hidraulica multiproposito com forca configuravel de 60 a 200 toneladas. Solucao versatil para conformacao, estampagem e processos industriais diversos com alta precisao e repetibilidade.",
    capacity: "60-200 t",
    length: "-",
    specs: [
      { label: "Forca", value: "60 a 200 t (configuravel)" },
      { label: "Acionamento", value: "Hidraulico" },
      { label: "Curso", value: "Configuravel" },
      { label: "Mesa", value: "Sob medida" },
      { label: "Comando", value: "PLC com IHM" },
      { label: "Normas", value: "NR-12 / NR-10" },
    ],
    features: [
      {
        title: "Forca configuravel",
        description:
          "De 60 a 200 toneladas conforme a necessidade da aplicacao industrial.",
        icon: "Gauge",
      },
      {
        title: "Multiproposito",
        description:
          "Conformacao, estampagem, dobra e demais processos industriais com alta precisao.",
        icon: "Cog",
      },
      {
        title: "Seguranca integrada",
        description:
          "Comandos bimanual, cortinas de luz e CLPs de seguranca conforme NR-12.",
        icon: "Shield",
      },
    ],
    applications: ["industria"],
    featured: false,
  },

  {
    slug: "central-hidraulica",
    category: "ESPECIAL",
    name: "Central Hidraulica PILI",
    tagline: "Unidades hidraulicas sob medida para qualquer aplicacao industrial",
    description:
      "Centrais hidraulicas projetadas e fabricadas sob medida para atender demandas especificas de pressao, vazao e controle. Solucao completa desde o dimensionamento ate a instalacao e comissionamento.",
    capacity: "-",
    length: "-",
    specs: [
      { label: "Tipo", value: "Sob medida" },
      { label: "Pressao", value: "Ate 350 bar" },
      { label: "Vazao", value: "Conforme projeto" },
      { label: "Reservatorio", value: "Conforme projeto" },
      { label: "Filtragem", value: "Ate 3 microns" },
      { label: "Resfriamento", value: "Ar ou agua" },
    ],
    features: [
      {
        title: "Projeto sob medida",
        description:
          "Cada central e dimensionada especificamente para a aplicacao do cliente.",
        icon: "Ruler",
      },
      {
        title: "Componentes de primeira linha",
        description:
          "Bombas, valvulas e filtros de fabricantes renomados com garantia de desempenho.",
        icon: "Cog",
      },
      {
        title: "Comissionamento incluso",
        description:
          "Servico completo de instalacao, startup e treinamento operacional no local.",
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
