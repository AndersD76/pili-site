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

export interface EcosystemProject {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  color: string;
  features: EcosystemFeature[];
  stats: EcosystemStat[];
  url: string;
}

export const ECOSYSTEM_PROJECTS: EcosystemProject[] = [
  {
    slug: "store",
    name: "PILI Store",
    tagline: "E-commerce de pecas e acessorios para tombadores",
    description:
      "Loja online de pecas de reposicao e acessorios originais para tombadores e equipamentos PILI. Catalogo completo com mais de 2.000 itens, entrega expressa para todo o Brasil e America Latina, garantia de fabrica e suporte tecnico especializado. Pecas originais garantem durabilidade, compatibilidade e performance maxima dos equipamentos em operacao.",
    color: "pili-safety",
    features: [
      {
        title: "Pecas originais",
        description:
          "Todas as pecas sao fabricadas com as mesmas especificacoes dos equipamentos originais, garantindo compatibilidade total e vida util maxima.",
        icon: "ShieldCheck",
      },
      {
        title: "Entrega expressa",
        description:
          "Estoque centralizado com logistica propria. Envio em ate 48 horas para todo o Brasil, com rastreamento completo ate a entrega.",
        icon: "Truck",
      },
      {
        title: "Garantia de fabrica",
        description:
          "12 meses de garantia em todas as pecas de reposicao. Assistencia tecnica direta do fabricante para suporte na instalacao.",
        icon: "BadgeCheck",
      },
      {
        title: "Suporte tecnico",
        description:
          "Equipe de engenharia disponivel para orientar a selecao correta de pecas e procedimentos de substituicao.",
        icon: "Headphones",
      },
    ],
    stats: [
      { value: "2.000+", label: "pecas no catalogo" },
      { value: "48h", label: "prazo de entrega" },
      { value: "12 meses", label: "garantia de fabrica" },
    ],
    url: ECOSYSTEM.store,
  },
  {
    slug: "tech",
    name: "PILI Tech",
    tagline: "Plataforma IoT de gestao de patio industrial",
    description:
      "Plataforma SaaS de monitoramento e gestao de patio industrial com sensores IoT, protocolo MQTT e dashboards em tempo real. Controle de filas de caminhoes, tempos de descarga, performance de equipamentos e indicadores operacionais. Dados transmitidos por 4G e processados em nuvem, com alertas inteligentes e relatorios automaticos para gestores e equipes de campo.",
    color: "pili-info",
    features: [
      {
        title: "Dashboard em tempo real",
        description:
          "Visualizacao ao vivo de filas, tempos de ciclo, status de equipamentos e indicadores de produtividade em paineis customizaveis.",
        icon: "LayoutDashboard",
      },
      {
        title: "Sensores IoT",
        description:
          "Hardware proprio com ESP32, conectividade 4G e protocolo MQTT para coleta de dados diretamente dos equipamentos em operacao.",
        icon: "Radio",
      },
      {
        title: "Alertas inteligentes",
        description:
          "Notificacoes automaticas por SMS, email e push quando indicadores ultrapassam limites configurados ou anomalias sao detectadas.",
        icon: "Bell",
      },
      {
        title: "Relatorios automaticos",
        description:
          "Geracao automatica de relatorios diarios, semanais e mensais com metricas de performance, disponibilidade e eficiencia operacional.",
        icon: "FileBarChart",
      },
    ],
    stats: [
      { value: "-40%", label: "tempo de espera" },
      { value: "99,5%", label: "uptime da plataforma" },
      { value: "24/7", label: "monitoramento" },
    ],
    url: ECOSYSTEM.tech,
  },
  {
    slug: "raste",
    name: "PILI Raste",
    tagline: "Rastreabilidade de graos e conformidade EUDR",
    description:
      "Plataforma de rastreabilidade completa para a cadeia de graos, com rastreamento da origem ao destino, conformidade automatizada com o Regulamento Europeu de Desmatamento (EUDR) e certificacao digital. Integra-se a ERPs, sistemas de classificacao e plataformas de exportacao para garantir que cada lote embarcado atenda aos requisitos de rastreabilidade exigidos pelos mercados internacionais.",
    color: "pili-success",
    features: [
      {
        title: "Rastreio origem-destino",
        description:
          "Rastreamento completo de cada lote de graos desde a fazenda de origem ate o destino final, com registro imutavel de toda a cadeia de custodia.",
        icon: "Route",
      },
      {
        title: "Conformidade EUDR",
        description:
          "Verificacao automatizada dos requisitos do Regulamento Europeu de Desmatamento, incluindo geolocalizacao de parcelas e analise de cobertura florestal.",
        icon: "Scale",
      },
      {
        title: "Certificacao digital",
        description:
          "Emissao automatica de certificados digitais de rastreabilidade vinculados a cada lote, com validacao criptografica e auditoria independente.",
        icon: "FileCheck",
      },
      {
        title: "Integracao ERP",
        description:
          "Conectores nativos para SAP, TOTVS, Protheus e outros ERPs utilizados por cooperativas, tradings e exportadores de graos.",
        icon: "Plug",
      },
    ],
    stats: [
      { value: "100%", label: "rastreavel" },
      { value: "EUDR", label: "compliant" },
      { value: "15", label: "paises atendidos" },
    ],
    url: ECOSYSTEM.raste,
  },
  {
    slug: "harbor",
    name: "PILI Harbor",
    tagline: "Sistema de gestao de patio (Yard Management)",
    description:
      "Sistema completo de yard management para controle de entrada, pesagem, descarga e saida de veiculos em terminais portuarios, cooperativas e plantas industriais. Gestao de filas com agendamento, integracao com balancas rodoviarias, paineis operacionais em tempo real e rastreamento de veiculos dentro do patio. Reduz filas, aumenta produtividade e fornece dados para decisoes operacionais.",
    color: "purple-600",
    features: [
      {
        title: "Gestao de filas",
        description:
          "Agendamento de caminhoes, controle de chegada, priorizacao por produto e visualizacao em tempo real da fila de espera com previsao de atendimento.",
        icon: "ListOrdered",
      },
      {
        title: "Pesagem automatica",
        description:
          "Integracao direta com balancas rodoviarias para registro automatico de peso bruto, tara e peso liquido, eliminando digitacao manual.",
        icon: "Scale",
      },
      {
        title: "Integracao balanca",
        description:
          "Compativel com as principais marcas de balancas rodoviarias do mercado. Captura automatica de dados com validacao e registro em tempo real.",
        icon: "Link",
      },
      {
        title: "Painel operacional",
        description:
          "Dashboard de operacao com status de cada veiculo no patio, tempo de permanencia, alertas de atraso e indicadores de produtividade por equipamento.",
        icon: "Monitor",
      },
    ],
    stats: [
      { value: "-60%", label: "tempo de fila" },
      { value: "+35%", label: "produtividade" },
      { value: "500+", label: "veiculos/dia" },
    ],
    url: ECOSYSTEM.harbor,
  },
];

export function getEcosystemProject(slug: string) {
  return ECOSYSTEM_PROJECTS.find((p) => p.slug === slug);
}
