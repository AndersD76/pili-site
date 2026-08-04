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
  }
];

export function getEcosystemProject(slug: string) {
  return ECOSYSTEM_PROJECTS.find((p) => p.slug === slug);
}
