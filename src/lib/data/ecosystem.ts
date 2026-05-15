import { ECOSYSTEM } from "@/lib/constants";

export interface EcosystemFeature {
  title: string;
  description: string;
  icon: string;
}

export interface EcosystemStat {
  value: string;
  label: string;
}

export interface HowItWorksStep {
  step: string;
  title: string;
  description: string;
}

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface EcosystemProject {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  color: string;
  features: EcosystemFeature[];
  stats: EcosystemStat[];
  url: string;
  howItWorks: HowItWorksStep[];
  integrations: string[];
  testimonial: Testimonial;
  faq: FAQ[];
}

export const ECOSYSTEM_PROJECTS: EcosystemProject[] = [
  {
    slug: "store",
    name: "PILI Store",
    tagline: "E-commerce de peças e acessórios para tombadores",
    description:
      "Loja online de peças de reposição e acessórios originais para tombadores e equipamentos PILI. Catálogo completo com mais de 2.000 itens, entrega expressa para todo o Brasil e América Latina, garantia de fábrica e suporte técnico especializado. Peças originais garantem durabilidade, compatibilidade e performance máxima dos equipamentos em operação.",
    color: "pili-safety",
    features: [
      {
        title: "Peças originais",
        description:
          "Todas as peças são fabricadas com as mesmas especificações dos equipamentos originais, garantindo compatibilidade total e vida útil máxima.",
        icon: "ShieldCheck",
      },
      {
        title: "Entrega expressa",
        description:
          "Estoque centralizado com logística própria. Envio em até 48 horas para todo o Brasil, com rastreamento completo até a entrega.",
        icon: "Truck",
      },
      {
        title: "Garantia de fábrica",
        description:
          "12 meses de garantia em todas as peças de reposição. Assistência técnica direta do fabricante para suporte na instalação.",
        icon: "BadgeCheck",
      },
      {
        title: "Suporte técnico",
        description:
          "Equipe de engenharia disponível para orientar a seleção correta de peças e procedimentos de substituição.",
        icon: "Headphones",
      },
    ],
    stats: [
      { value: "2.000+", label: "peças no catálogo" },
      { value: "48h", label: "prazo de entrega" },
      { value: "12 meses", label: "garantia de fábrica" },
    ],
    url: ECOSYSTEM.store,
    howItWorks: [
      {
        step: "01",
        title: "Cadastro",
        description:
          "Crie sua conta na PILI Store com CNPJ ou CPF. O processo é rápido e a aprovação é imediata para clientes PILI.",
      },
      {
        step: "02",
        title: "Seleção de peças",
        description:
          "Navegue pelo catálogo completo ou busque pelo código da peça. Filtros por equipamento, categoria e aplicação facilitam a busca.",
      },
      {
        step: "03",
        title: "Pedido e pagamento",
        description:
          "Adicione ao carrinho, escolha a forma de pagamento (boleto, cartão ou faturamento) e confirme o pedido.",
      },
      {
        step: "04",
        title: "Entrega expressa",
        description:
          "Receba suas peças em até 48 horas com rastreamento completo. Suporte técnico disponível para orientar a instalação.",
      },
    ],
    integrations: [
      "SAP",
      "TOTVS Protheus",
      "Bling",
      "Tiny ERP",
      "Correios",
      "Jadlog",
      "Mercado Livre",
    ],
    testimonial: {
      quote:
        "A PILI Store reduziu nosso tempo de parada de equipamento de 5 dias para menos de 48 horas. Peças originais, entrega rápida e suporte técnico excelente.",
      author: "Carlos Mendes",
      role: "Gerente de manutenção",
      company: "Cooperativa Agrícola Erechim",
    },
    faq: [
      {
        question: "As peças da PILI Store são originais?",
        answer:
          "Sim, todas as peças comercializadas na PILI Store são fabricadas com as mesmas especificações dos equipamentos originais PILI, garantindo compatibilidade total, durabilidade e performance máxima.",
      },
      {
        question: "Qual o prazo de entrega?",
        answer:
          "O prazo padrão é de até 48 horas para peças em estoque, com envio para todo o Brasil. Para a América Latina, o prazo varia conforme a região e o modal de transporte.",
      },
      {
        question: "Como funciona a garantia?",
        answer:
          "Todas as peças de reposição possuem 12 meses de garantia de fábrica. Em caso de defeito, a substituição é feita diretamente pelo fabricante.",
      },
      {
        question: "Posso comprar como pessoa física?",
        answer:
          "Sim, a PILI Store aceita compras tanto de pessoas jurídicas (CNPJ) quanto de pessoas físicas (CPF), com as mesmas condições de garantia e suporte.",
      },
    ],
  },
  {
    slug: "tech",
    name: "PILI Tech",
    tagline: "Plataforma IoT de gestão de pátio industrial",
    description:
      "Plataforma SaaS de monitoramento e gestão de pátio industrial com sensores IoT, protocolo MQTT e dashboards em tempo real. Controle de filas de caminhões, tempos de descarga, performance de equipamentos e indicadores operacionais. Dados transmitidos por 4G e processados em nuvem, com alertas inteligentes e relatórios automáticos para gestores e equipes de campo.",
    color: "pili-info",
    features: [
      {
        title: "Dashboard em tempo real",
        description:
          "Visualização ao vivo de filas, tempos de ciclo, status de equipamentos e indicadores de produtividade em painéis customizáveis.",
        icon: "LayoutDashboard",
      },
      {
        title: "Sensores IoT",
        description:
          "Hardware próprio com ESP32, conectividade 4G e protocolo MQTT para coleta de dados diretamente dos equipamentos em operação.",
        icon: "Radio",
      },
      {
        title: "Alertas inteligentes",
        description:
          "Notificações automáticas por SMS, email e push quando indicadores ultrapassam limites configurados ou anomalias são detectadas.",
        icon: "Bell",
      },
      {
        title: "Relatórios automáticos",
        description:
          "Geração automática de relatórios diários, semanais e mensais com métricas de performance, disponibilidade e eficiência operacional.",
        icon: "FileBarChart",
      },
    ],
    stats: [
      { value: "-40%", label: "tempo de espera" },
      { value: "99,5%", label: "uptime da plataforma" },
      { value: "24/7", label: "monitoramento" },
    ],
    url: ECOSYSTEM.tech,
    howItWorks: [
      {
        step: "01",
        title: "Instalação dos sensores",
        description:
          "Sensores IoT com ESP32 e conectividade 4G são instalados nos equipamentos do pátio. A instalação é rápida e não exige parada operacional.",
      },
      {
        step: "02",
        title: "Configuração da plataforma",
        description:
          "Configuração dos dashboards, alertas e relatórios conforme as necessidades operacionais da planta. Personalização completa de KPIs.",
      },
      {
        step: "03",
        title: "Monitoramento em tempo real",
        description:
          "Dados de filas, tempos de ciclo e status de equipamentos são transmitidos em tempo real via MQTT e exibidos nos painéis operacionais.",
      },
      {
        step: "04",
        title: "Análise e otimização",
        description:
          "Relatórios automáticos e alertas inteligentes permitem identificar gargalos e otimizar a operação continuamente.",
      },
    ],
    integrations: [
      "SAP",
      "TOTVS Protheus",
      "MQTT",
      "API REST",
      "Balanças rodoviárias",
      "Sistemas SCADA",
      "Power BI",
    ],
    testimonial: {
      quote:
        "Com o PILI Tech, reduzimos o tempo médio de espera dos caminhões em 40% e eliminamos o controle manual de filas. Os dados em tempo real mudaram a forma como operamos.",
      author: "Roberto Silveira",
      role: "Diretor de operações",
      company: "Terminal Portuário Sul",
    },
    faq: [
      {
        question: "Preciso de infraestrutura de internet no pátio?",
        answer:
          "Não. Os sensores PILI Tech utilizam conectividade 4G própria, dispensando infraestrutura de rede local. Os dados são transmitidos diretamente para a nuvem.",
      },
      {
        question: "A plataforma funciona com equipamentos de outros fabricantes?",
        answer:
          "Sim, os sensores IoT podem ser instalados em qualquer equipamento industrial. A plataforma é compatível com tombadores, balanças e equipamentos de diferentes fabricantes.",
      },
      {
        question: "Qual o tempo de implantação?",
        answer:
          "A implantação típica leva de 5 a 10 dias úteis, incluindo instalação de sensores, configuração da plataforma e treinamento da equipe operacional.",
      },
      {
        question: "Os dados ficam armazenados por quanto tempo?",
        answer:
          "Todos os dados históricos são armazenados na nuvem por no mínimo 5 anos, com acesso ilimitado a relatórios e análises de períodos anteriores.",
      },
    ],
  },
  {
    slug: "raste",
    name: "PILI Raster",
    tagline: "Rastreabilidade de grãos e conformidade EUDR",
    description:
      "Plataforma de rastreabilidade completa para a cadeia de grãos, com rastreamento da origem ao destino, conformidade automatizada com o Regulamento Europeu de Desmatamento (EUDR) e certificação digital. Integra-se a ERPs, sistemas de classificação e plataformas de exportação para garantir que cada lote embarcado atenda aos requisitos de rastreabilidade exigidos pelos mercados internacionais.",
    color: "pili-success",
    features: [
      {
        title: "Rastreio origem-destino",
        description:
          "Rastreamento completo de cada lote de grãos desde a fazenda de origem até o destino final, com registro imutável de toda a cadeia de custódia.",
        icon: "Route",
      },
      {
        title: "Conformidade EUDR",
        description:
          "Verificação automatizada dos requisitos do Regulamento Europeu de Desmatamento, incluindo geolocalização de parcelas e análise de cobertura florestal.",
        icon: "Scale",
      },
      {
        title: "Certificação digital",
        description:
          "Emissão automática de certificados digitais de rastreabilidade vinculados a cada lote, com validação criptográfica e auditoria independente.",
        icon: "FileCheck",
      },
      {
        title: "Integração ERP",
        description:
          "Conectores nativos para SAP, TOTVS, Protheus e outros ERPs utilizados por cooperativas, tradings e exportadores de grãos.",
        icon: "Plug",
      },
    ],
    stats: [
      { value: "100%", label: "rastreável" },
      { value: "EUDR", label: "compliant" },
      { value: "15", label: "países atendidos" },
    ],
    url: ECOSYSTEM.raste,
    howItWorks: [
      {
        step: "01",
        title: "Cadastro de origens",
        description:
          "Registro das fazendas de origem com geolocalização das parcelas produtivas. Verificação automática de conformidade ambiental.",
      },
      {
        step: "02",
        title: "Rastreamento de lotes",
        description:
          "Cada lote de grãos recebe um identificador único que acompanha toda a cadeia: colheita, transporte, armazenagem e exportação.",
      },
      {
        step: "03",
        title: "Verificação EUDR",
        description:
          "O sistema verifica automaticamente cada lote contra os requisitos do regulamento europeu, gerando relatórios de conformidade.",
      },
      {
        step: "04",
        title: "Certificação e exportação",
        description:
          "Emissão automática de certificados digitais com validação criptográfica, prontos para apresentação aos compradores internacionais.",
      },
    ],
    integrations: [
      "SAP",
      "TOTVS Protheus",
      "Sistemas de classificação de grãos",
      "Plataformas de exportação",
      "EUDR Registry (EU)",
      "API REST",
      "Blockchain",
    ],
    testimonial: {
      quote:
        "O PILI Raster nos permitiu atender aos requisitos EUDR de forma automatizada, sem precisar contratar consultoria externa. Hoje exportamos com total conformidade e rastreabilidade.",
      author: "Ana Paula Ferreira",
      role: "Diretora de exportação",
      company: "Trading Grãos do Sul",
    },
    faq: [
      {
        question: "O PILI Raster atende ao regulamento EUDR?",
        answer:
          "Sim, a plataforma foi desenvolvida especificamente para atender aos requisitos do Regulamento Europeu de Desmatamento (EUDR), incluindo geolocalização de parcelas, verificação de cobertura florestal e emissão de certificados de conformidade.",
      },
      {
        question: "Como funciona a integração com ERPs?",
        answer:
          "O PILI Raster possui conectores nativos para SAP, TOTVS Protheus e outros ERPs. A integração é feita via API REST, permitindo troca automática de dados de lotes, notas fiscais e certificados.",
      },
      {
        question: "Posso rastrear grãos de diferentes origens em um mesmo lote?",
        answer:
          "Sim, o sistema suporta rastreabilidade segregada e por massa de balanço, permitindo rastrear a composição de lotes mistos com total transparência para o comprador final.",
      },
      {
        question: "Os certificados digitais têm validade jurídica?",
        answer:
          "Os certificados emitidos pelo PILI Raster utilizam validação criptográfica e são reconhecidos pelos principais mercados internacionais. Cada certificado contém um hash único verificável.",
      },
    ],
  },
  {
    slug: "harbor",
    name: "PILI Harbor",
    tagline: "Sistema de gestão de pátio (Yard Management)",
    description:
      "Sistema completo de yard management para controle de entrada, pesagem, descarga e saída de veículos em terminais portuários, cooperativas e plantas industriais. Gestão de filas com agendamento, integração com balanças rodoviárias, painéis operacionais em tempo real e rastreamento de veículos dentro do pátio. Reduz filas, aumenta produtividade e fornece dados para decisões operacionais.",
    color: "purple-600",
    features: [
      {
        title: "Gestão de filas",
        description:
          "Agendamento de caminhões, controle de chegada, priorização por produto e visualização em tempo real da fila de espera com previsão de atendimento.",
        icon: "ListOrdered",
      },
      {
        title: "Pesagem automática",
        description:
          "Integração direta com balanças rodoviárias para registro automático de peso bruto, tara e peso líquido, eliminando digitação manual.",
        icon: "Scale",
      },
      {
        title: "Integração balança",
        description:
          "Compatível com as principais marcas de balanças rodoviárias do mercado. Captura automática de dados com validação e registro em tempo real.",
        icon: "Link",
      },
      {
        title: "Painel operacional",
        description:
          "Dashboard de operação com status de cada veículo no pátio, tempo de permanência, alertas de atraso e indicadores de produtividade por equipamento.",
        icon: "Monitor",
      },
    ],
    stats: [
      { value: "-60%", label: "tempo de fila" },
      { value: "+35%", label: "produtividade" },
      { value: "500+", label: "veículos/dia" },
    ],
    url: ECOSYSTEM.harbor,
    howItWorks: [
      {
        step: "01",
        title: "Configuração do pátio",
        description:
          "Mapeamento das áreas do pátio, balanças, moegas e pontos de controle. Configuração de regras de agendamento e priorização.",
      },
      {
        step: "02",
        title: "Integração com balanças",
        description:
          "Conexão direta com balanças rodoviárias para captura automática de pesagem. Compatível com as principais marcas do mercado.",
      },
      {
        step: "03",
        title: "Operação em tempo real",
        description:
          "Controle de entrada, pesagem, descarga e saída de veículos com painéis operacionais e alertas automáticos para a equipe.",
      },
      {
        step: "04",
        title: "Resultados mensuráveis",
        description:
          "Relatórios de produtividade, tempo médio de permanência e indicadores operacionais para tomada de decisão baseada em dados.",
      },
    ],
    integrations: [
      "SAP",
      "TOTVS Protheus",
      "Balanças Toledo",
      "Balanças Líder",
      "Sistemas SCADA",
      "API REST",
      "PILI Tech",
    ],
    testimonial: {
      quote:
        "O PILI Harbor reduziu nosso tempo de fila em 60% e aumentou a produtividade do pátio em 35%. O agendamento digital eliminou conflitos e o painel operacional nos dá visibilidade total.",
      author: "Marcos Oliveira",
      role: "Coordenador de logística",
      company: "Cooperativa Agroindustrial Oeste",
    },
    faq: [
      {
        question: "O PILI Harbor funciona com qualquer balança?",
        answer:
          "Sim, o sistema é compatível com as principais marcas de balanças rodoviárias do mercado brasileiro, incluindo Toledo, Líder e outras. A integração é feita via protocolo serial ou TCP/IP.",
      },
      {
        question: "Como funciona o agendamento de caminhões?",
        answer:
          "O agendamento é feito via portal web ou aplicativo. Transportadoras e motoristas podem agendar horários disponíveis, com confirmação automática e notificações por SMS.",
      },
      {
        question: "Quantos veículos o sistema suporta por dia?",
        answer:
          "O PILI Harbor é dimensionado para operações de alto volume, suportando mais de 500 veículos por dia por terminal, sem degradação de performance.",
      },
      {
        question: "O sistema funciona offline?",
        answer:
          "O sistema possui modo offline para operações críticas como pesagem e controle de acesso. Os dados são sincronizados automaticamente quando a conexão é restabelecida.",
      },
    ],
  },
];

export function getEcosystemProject(slug: string) {
  return ECOSYSTEM_PROJECTS.find((p) => p.slug === slug);
}
