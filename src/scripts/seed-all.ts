import {
  PrismaClient,
  type ProductCategory,
  Locale,
  PostCategory,
} from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

const BCRYPT_ROUNDS = 12;

/**
 * Lê uma variável obrigatória. Credenciais nunca são embutidas no código: este
 * seed faz `upsert`, então uma senha fixa aqui sobrescreveria a senha real do
 * admin se rodasse contra produção.
 */
function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Variável de ambiente ${name} é obrigatória para rodar o seed de usuários.`,
    );
  }
  return value;
}

// ============================================================================
// 1. USERS
// ============================================================================

async function seedUsers() {
  console.log("\n--- Seeding users ---");

  const adminEmail = requireEnv("SEED_ADMIN_EMAIL").toLowerCase().trim();
  const clientEmail = requireEnv("SEED_CLIENT_EMAIL").toLowerCase().trim();

  const adminHash = bcrypt.hashSync(
    requireEnv("SEED_ADMIN_PASSWORD"),
    BCRYPT_ROUNDS,
  );
  const clientHash = bcrypt.hashSync(
    requireEnv("SEED_CLIENT_PASSWORD"),
    BCRYPT_ROUNDS,
  );

  const admin = await db.user.upsert({
    where: { email: adminEmail },
    update: { passwordHash: adminHash, role: "ADMIN" },
    create: {
      email: adminEmail,
      name: process.env.SEED_ADMIN_NAME ?? "Administrador PILI",
      passwordHash: adminHash,
      role: "ADMIN",
      company: "PILI Industrial",
    },
  });
  console.log(`  [OK] Admin: ${admin.email}`);

  const client = await db.user.upsert({
    where: { email: clientEmail },
    update: { passwordHash: clientHash, role: "CLIENTE" },
    create: {
      email: clientEmail,
      name: process.env.SEED_CLIENT_NAME ?? "Roberto Mendes",
      passwordHash: clientHash,
      role: "CLIENTE",
      company: "Cooperativa Central Agricola",
      phone: "+55 54 99876-5432",
    },
  });
  console.log(`  [OK] Client: ${client.email}`);

  return { admin, client };
}

// ============================================================================
// 2. PRODUCTS
// ============================================================================

interface ProductSeed {
  slug: string;
  category: ProductCategory;
  featured: boolean;
  name: string;
  tagline: string;
  description: string;
  specs: { key: string; value: string }[];
  features: { title: string; description: string; icon?: string }[];
}

const PRODUCTS_DATA: ProductSeed[] = [
  // ─── TOMBADORES FIXOS ──────────────────────────────────────────────────
  {
    slug: "tombador-10m-fixo",
    category: "TOMBADOR_FIXO",
    featured: false,
    name: "Tombador 10 Metros Fixo",
    tagline: "Performance comprovada para operacoes de entrada",
    description:
      "Plataforma de descarga fixa de 10 metros com capacidade para 45 toneladas. Ideal para pequenas cooperativas e propriedades rurais que necessitam de ciclo rapido com caminhoes truck convencionais.",
    specs: [
      { key: "Capacidade", value: "45 t" },
      { key: "Comprimento", value: "10.000 mm" },
      { key: "Largura", value: "3.000 mm" },
      { key: "Angulo maximo", value: "45°" },
      { key: "Ciclo", value: "~60 s" },
      { key: "Motor", value: "75 CV" },
      { key: "Estrutura", value: "Aco ASTM A572 Gr.50" },
      { key: "Peso", value: "~12.000 kg" },
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
  },
  {
    slug: "tombador-11m-fixo",
    category: "TOMBADOR_FIXO",
    featured: false,
    name: "Tombador 11 Metros Fixo",
    tagline: "O padrao regional para cooperativas de graos",
    description:
      "Plataforma de descarga fixa de 11 metros com capacidade para 50 toneladas. Dimensao padrao para cooperativas regionais que recebem trucks e bi-trucks, com equilibrio entre custo e capacidade.",
    specs: [
      { key: "Capacidade", value: "50 t" },
      { key: "Comprimento", value: "11.000 mm" },
      { key: "Largura", value: "3.000 mm" },
      { key: "Angulo maximo", value: "45°" },
      { key: "Ciclo", value: "~60 s" },
      { key: "Motor", value: "75 CV" },
      { key: "Estrutura", value: "Aco ASTM A572 Gr.50" },
      { key: "Peso", value: "~14.000 kg" },
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
  },
  {
    slug: "tombador-12m-fixo",
    category: "TOMBADOR_FIXO",
    featured: false,
    name: "Tombador 12 Metros Fixo",
    tagline: "Capacidade ampliada para bi-trucks e composicoes padrao",
    description:
      "Plataforma de descarga fixa de 12 metros com capacidade para 55 toneladas. Projetado para operar com bi-trucks e composicoes caminhao-reboque padrao, atendendo cooperativas e industrias de medio porte.",
    specs: [
      { key: "Capacidade", value: "55 t" },
      { key: "Comprimento", value: "12.000 mm" },
      { key: "Largura", value: "3.200 mm" },
      { key: "Angulo maximo", value: "45°" },
      { key: "Ciclo", value: "~65 s" },
      { key: "Motor", value: "100 CV" },
      { key: "Estrutura", value: "Aco ASTM A572 Gr.50" },
      { key: "Peso", value: "~18.000 kg" },
    ],
    features: [
      {
        title: "Motor de alta potencia",
        description:
          "Motor de 100 CV garante ciclo estavel mesmo com cargas maximas de 55 toneladas.",
        icon: "Zap",
      },
      {
        title: "Estrutura reforcada",
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
  },
  {
    slug: "tombador-18m-fixo",
    category: "TOMBADOR_FIXO",
    featured: false,
    name: "Tombador 18 Metros Fixo",
    tagline: "Projetado para rodotrens e operacoes de alto fluxo",
    description:
      "Plataforma de descarga fixa de 18 metros com capacidade para 70 toneladas. Dimensionado para rodotrens, ideal para grandes cooperativas e terminais com alta demanda de recebimento.",
    specs: [
      { key: "Capacidade", value: "70 t" },
      { key: "Comprimento", value: "18.000 mm" },
      { key: "Largura", value: "3.400 mm" },
      { key: "Angulo maximo", value: "42°" },
      { key: "Ciclo", value: "~70 s" },
      { key: "Motor", value: "150 CV" },
      { key: "Estrutura", value: "Aco ASTM A572 Gr.50" },
      { key: "Peso", value: "~28.000 kg" },
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
  },
  {
    slug: "tombador-21m-fixo",
    category: "TOMBADOR_FIXO",
    featured: false,
    name: "Tombador 21 Metros Fixo",
    tagline: "Grande porte para terminais portuarios e cooperativas de escala",
    description:
      "Plataforma de descarga fixa de 21 metros com capacidade para 80 toneladas. Projetado para grandes rodotrens em operacoes portuarias e cooperativas de grande escala que demandam alta capacidade.",
    specs: [
      { key: "Capacidade", value: "80 t" },
      { key: "Comprimento", value: "21.000 mm" },
      { key: "Largura", value: "3.400 mm" },
      { key: "Angulo maximo", value: "42°" },
      { key: "Ciclo", value: "~75 s" },
      { key: "Motor", value: "200 CV" },
      { key: "Estrutura", value: "Aco ASTM A572 Gr.50" },
      { key: "Peso", value: "~35.000 kg" },
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
  },
  {
    slug: "tombador-26m-fixo",
    category: "TOMBADOR_FIXO",
    featured: false,
    name: "Tombador 26 Metros Fixo",
    tagline: "Operacao pesada para terminais graneleiros de grande porte",
    description:
      "Plataforma de descarga fixa de 26 metros com capacidade para 90 toneladas. Projetado para operacoes portuarias pesadas com configuracoes de multiplos eixos e composicoes especiais.",
    specs: [
      { key: "Capacidade", value: "90 t" },
      { key: "Comprimento", value: "26.000 mm" },
      { key: "Largura", value: "3.400 mm" },
      { key: "Angulo maximo", value: "42°" },
      { key: "Ciclo", value: "~80 s" },
      { key: "Motor", value: "250 CV" },
      { key: "Estrutura", value: "Aco ASTM A572 Gr.50" },
      { key: "Peso", value: "~40.000 kg" },
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
        title: "Seguranca reforcada",
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
  },
  {
    slug: "tombador-30m-fixo",
    category: "TOMBADOR_FIXO",
    featured: true,
    name: "Tombador 30 Metros Fixo",
    tagline: "O maior tombador hidraulico do mercado brasileiro",
    description:
      "Plataforma de descarga fixa de 30 metros com capacidade para 100 toneladas. O tombador de maior porte da America Latina, projetado para os maiores terminais portuarios e operacoes com os maiores rodotrens do mercado.",
    specs: [
      { key: "Capacidade", value: "100 t" },
      { key: "Comprimento", value: "30.000 mm" },
      { key: "Largura", value: "3.400 mm" },
      { key: "Angulo maximo", value: "45°" },
      { key: "Ciclo", value: "~90 s" },
      { key: "Motor", value: "300 CV" },
      { key: "Estrutura", value: "Aco ASTM A572 Gr.50" },
      { key: "Peso", value: "~48.000 kg" },
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
  },
  {
    slug: "tombador-cabine-externa",
    category: "TOMBADOR_FIXO",
    featured: false,
    name: "Tombador com Cabine Externa",
    tagline: "Operacao segura com cabine fechada em conformidade NR-12",
    description:
      "Tombador fixo de 12 metros equipado com cabine externa de operacao fechada. Proporciona seguranca maxima ao operador com visao panoramica e conforto termico, em total conformidade com NR-12.",
    specs: [
      { key: "Capacidade", value: "55 t" },
      { key: "Comprimento", value: "12.000 mm" },
      { key: "Largura", value: "3.200 mm" },
      { key: "Angulo maximo", value: "45°" },
      { key: "Ciclo", value: "~65 s" },
      { key: "Motor", value: "100 CV" },
      { key: "Cabine", value: "Fechada, climatizada" },
      { key: "Normas", value: "NR-12 / NR-10" },
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
  },

  // ─── TOMBADORES MOVEIS ─────────────────────────────────────────────────
  {
    slug: "tombador-10m-movel",
    category: "TOMBADOR_MOVEL",
    featured: false,
    name: "Tombador 10 Metros Movel",
    tagline: "Mobilidade e rapidez para operacoes sazonais",
    description:
      "Tombador movel de 10 metros com capacidade para 40 toneladas. Pode ser transportado e reinstalado entre diferentes unidades, ideal para operacoes sazonais e locais temporarios de recebimento.",
    specs: [
      { key: "Capacidade", value: "40 t" },
      { key: "Comprimento", value: "10.000 mm" },
      { key: "Largura", value: "3.000 mm" },
      { key: "Angulo maximo", value: "42°" },
      { key: "Ciclo", value: "~65 s" },
      { key: "Motor", value: "75 CV" },
      { key: "Tipo", value: "Movel / Portatil" },
      { key: "Instalacao", value: "Rapida, sem fundacao especial" },
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
  },
  {
    slug: "tombador-11m-movel",
    category: "TOMBADOR_MOVEL",
    featured: false,
    name: "Tombador 11 Metros Movel",
    tagline: "Padrao movel para frotas de locacao e safra",
    description:
      "Tombador movel de 11 metros com capacidade para 45 toneladas. Dimensao padrao para operacoes sazonais, frotas de locacao e pontos temporarios de recebimento de graos.",
    specs: [
      { key: "Capacidade", value: "45 t" },
      { key: "Comprimento", value: "11.000 mm" },
      { key: "Largura", value: "3.000 mm" },
      { key: "Angulo maximo", value: "42°" },
      { key: "Ciclo", value: "~65 s" },
      { key: "Motor", value: "75 CV" },
      { key: "Tipo", value: "Movel / Portatil" },
      { key: "Instalacao", value: "Rapida, sem fundacao especial" },
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
          "Dimensoes compativeis com transporte rodoviario sem necessidade de escolta especial.",
        icon: "Ruler",
      },
    ],
  },
  {
    slug: "tombador-12m-movel",
    category: "TOMBADOR_MOVEL",
    featured: false,
    name: "Tombador 12 Metros Movel",
    tagline: "Capacidade para bi-trucks com total portabilidade",
    description:
      "Tombador movel de 12 metros com capacidade para 50 toneladas. Combina a capacidade de receber bi-trucks com a flexibilidade de relocacao entre unidades operacionais.",
    specs: [
      { key: "Capacidade", value: "50 t" },
      { key: "Comprimento", value: "12.000 mm" },
      { key: "Largura", value: "3.200 mm" },
      { key: "Angulo maximo", value: "42°" },
      { key: "Ciclo", value: "~70 s" },
      { key: "Motor", value: "100 CV" },
      { key: "Tipo", value: "Movel / Portatil" },
      { key: "Peso", value: "~16.000 kg" },
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
  },
  {
    slug: "tombador-18m-movel",
    category: "TOMBADOR_MOVEL",
    featured: false,
    name: "Tombador 18 Metros Movel",
    tagline: "Grande porte movel para rodotrens itinerantes",
    description:
      "Tombador movel de 18 metros com capacidade para 65 toneladas. Unidade de grande porte com mobilidade, projetada para operacoes com rodotrens em locais temporarios de recebimento.",
    specs: [
      { key: "Capacidade", value: "65 t" },
      { key: "Comprimento", value: "18.000 mm" },
      { key: "Largura", value: "3.400 mm" },
      { key: "Angulo maximo", value: "42°" },
      { key: "Ciclo", value: "~75 s" },
      { key: "Motor", value: "150 CV" },
      { key: "Tipo", value: "Movel / Portatil" },
      { key: "Peso", value: "~25.000 kg" },
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
  },
  {
    slug: "tombador-21m-movel",
    category: "TOMBADOR_MOVEL",
    featured: true,
    name: "Tombador 21 Metros Movel",
    tagline: "O maior tombador movel do mercado nacional",
    description:
      "Tombador movel de 21 metros com capacidade para 75 toneladas. A maior unidade movel disponivel no mercado, combinando capacidade de grande porte com a flexibilidade de operacao temporaria em diferentes locais.",
    specs: [
      { key: "Capacidade", value: "75 t" },
      { key: "Comprimento", value: "21.000 mm" },
      { key: "Largura", value: "3.400 mm" },
      { key: "Angulo maximo", value: "42°" },
      { key: "Ciclo", value: "~80 s" },
      { key: "Motor", value: "200 CV" },
      { key: "Tipo", value: "Movel / Portatil" },
      { key: "Peso", value: "~32.000 kg" },
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
  },

  // ─── COLETOR DE AMOSTRAS ───────────────────────────────────────────────
  {
    slug: "coletor-amostras",
    category: "COLETOR_AMOSTRAS",
    featured: true,
    name: "Coletor de Amostra de Graos PILI",
    tagline: "Amostragem pneumatica precisa conforme padroes MAPA e CONAB",
    description:
      "Sistema pneumatico de coleta de amostras de graos com profundidade de ate 2,5 metros. Garante amostragem representativa e rastreavel em conformidade com os padroes do MAPA e CONAB para classificacao de graos.",
    specs: [
      { key: "Tipo", value: "Pneumatico" },
      { key: "Profundidade", value: "Ate 2,5 m" },
      { key: "Amostra", value: "1 a 3 kg" },
      { key: "Acionamento", value: "Automatico / Manual" },
      { key: "Normas", value: "MAPA / CONAB" },
      { key: "Rastreabilidade", value: "RFID / QR Code" },
      { key: "Integracao", value: "Tombadores PILI" },
      { key: "Material", value: "Aco inox nos pontos de contato" },
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
  },

  // ─── UNIDADE DE TRANSBORDO ─────────────────────────────────────────────
  {
    slug: "unidade-transbordo",
    category: "UNIDADE_TRANSBORDO",
    featured: true,
    name: "Unidade de Transbordo PILI",
    tagline: "Logistica intermodal agil para transbordo de graos entre veiculos",
    description:
      "Unidade de transbordo com capacidade de 40 toneladas por ciclo para transferencia de graos entre veiculos. Solucao essencial para logistica intermodal, permitindo transbordo rapido em pontos estrategicos da cadeia.",
    specs: [
      { key: "Capacidade", value: "40 t por ciclo" },
      { key: "Motor", value: "100 CV" },
      { key: "Tipo", value: "Transbordo intermodal" },
      { key: "Acionamento", value: "Hidraulico" },
      { key: "Estrutura", value: "Aco ASTM A572 Gr.50" },
      { key: "Mobilidade", value: "Transportavel" },
      { key: "Aplicacao", value: "Graos a granel" },
      { key: "Normas", value: "NR-12 / NR-10" },
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
  },

  // ─── PRODUTOS ESPECIAIS ────────────────────────────────────────────────
  {
    slug: "rachador-lenha-50t",
    category: "ESPECIAL",
    featured: false,
    name: "Rachador de Lenha 50 Toneladas",
    tagline: "Forca hidraulica de 50 toneladas para processamento de biomassa",
    description:
      "Rachador de lenha industrial com forca de 50 toneladas e ciclo de aproximadamente 15 segundos. Projetado para processamento de biomassa e lenha para geracao de energia em caldeiras industriais.",
    specs: [
      { key: "Forca", value: "50 t" },
      { key: "Ciclo", value: "~15 s" },
      { key: "Acionamento", value: "Hidraulico" },
      { key: "Abertura maxima", value: "1.200 mm" },
      { key: "Lamina", value: "Aco temperado" },
      { key: "Alimentacao", value: "Eletrica trifasica" },
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
  },
  {
    slug: "prensa-hidraulica",
    category: "ESPECIAL",
    featured: false,
    name: "Prensa Hidraulica 60-200 Toneladas",
    tagline: "Prensa industrial configuravel de 60 a 200 toneladas de forca",
    description:
      "Prensa hidraulica multiproposito com forca configuravel de 60 a 200 toneladas. Solucao versatil para conformacao, estampagem e processos industriais diversos com alta precisao e repetibilidade.",
    specs: [
      { key: "Forca", value: "60 a 200 t (configuravel)" },
      { key: "Acionamento", value: "Hidraulico" },
      { key: "Curso", value: "Configuravel" },
      { key: "Mesa", value: "Sob medida" },
      { key: "Comando", value: "PLC com IHM" },
      { key: "Normas", value: "NR-12 / NR-10" },
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
  },
  {
    slug: "central-hidraulica",
    category: "ESPECIAL",
    featured: false,
    name: "Central Hidraulica PILI",
    tagline: "Unidades hidraulicas sob medida para qualquer aplicacao industrial",
    description:
      "Centrais hidraulicas projetadas e fabricadas sob medida para atender demandas especificas de pressao, vazao e controle. Solucao completa desde o dimensionamento ate a instalacao e comissionamento.",
    specs: [
      { key: "Tipo", value: "Sob medida" },
      { key: "Pressao", value: "Ate 350 bar" },
      { key: "Vazao", value: "Conforme projeto" },
      { key: "Reservatorio", value: "Conforme projeto" },
      { key: "Filtragem", value: "Ate 3 microns" },
      { key: "Resfriamento", value: "Ar ou agua" },
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
  },
];

async function seedProducts() {
  console.log("\n--- Seeding products ---");

  for (let i = 0; i < PRODUCTS_DATA.length; i++) {
    const p = PRODUCTS_DATA[i];

    const product = await db.product.upsert({
      where: { slug: p.slug },
      update: {
        category: p.category,
        featured: p.featured,
        active: true,
        order: i,
      },
      create: {
        slug: p.slug,
        category: p.category,
        featured: p.featured,
        active: true,
        order: i,
      },
    });

    // Delete existing related records then recreate
    await db.productTranslation.deleteMany({
      where: { productId: product.id },
    });
    await db.spec.deleteMany({ where: { productId: product.id } });
    await db.feature.deleteMany({ where: { productId: product.id } });

    // Translation
    await db.productTranslation.create({
      data: {
        productId: product.id,
        locale: Locale.pt_BR,
        name: p.name,
        tagline: p.tagline,
        description: p.description,
      },
    });

    // Specs
    await db.spec.createMany({
      data: p.specs.map((s, idx) => ({
        productId: product.id,
        key: s.key,
        value: s.value,
        order: idx,
      })),
    });

    // Features
    await db.feature.createMany({
      data: p.features.map((f, idx) => ({
        productId: product.id,
        locale: Locale.pt_BR,
        title: f.title,
        description: f.description,
        icon: f.icon ?? null,
        order: idx,
      })),
    });

    console.log(`  [OK] Product: ${p.slug} (${p.specs.length} specs, ${p.features.length} features)`);
  }
}

// ============================================================================
// 3. BLOG POSTS
// ============================================================================

interface BlogTraducao {
  title: string;
  excerpt: string;
  content: string;
  metaTitle: string;
  metaDesc: string;
}

interface BlogSeed {
  slug: string;
  author: string;
  category: PostCategory;
  readTime: number;
  cover: string | null;
  publishedAt: string;
  tags: string[];
  traducoes: Record<"pt_BR" | "es", BlogTraducao>;
}

/**
 * Posts do blog.
 *
 * O conteudo anterior era material de demonstracao: capas do Unsplash, numeros
 * sem lastro ("2.000 pecas", "reducao de 40% em Paranagua"), falas atribuidas a
 * um diretor que nunca as disse e tres materias anunciando Store, Raster e
 * Harbor — plataformas ja retiradas do site em `constants.ts`. Como o seed usa
 * `upsert`, cada execucao republicava tudo isso.
 *
 * O que esta aqui agora usa foto propria da fabrica e so afirma o que o proprio
 * site sustenta em `constants.ts` e nas mensagens de `empresa`.
 */
const BLOG_DATA: BlogSeed[] = [
  {
    slug: "pili-1979-2026-quarenta-e-sete-anos",
    author: "PILI Industrial",
    category: PostCategory.artigo,
    readTime: 4,
    cover: "/images/blog/historia-logo-tombador.webp",
    publishedAt: "2026-08-10",
    tags: ["historia", "Erechim", "fabricacao nacional", "PILI"],
    traducoes: {
      pt_BR: {
        title: "De 1979 a 2026: o que cabe em 47 anos fabricando em Erechim",
        excerpt:
          "A PILI começou como metalurgia industrial no interior do Rio Grande do Sul e só fabricou seu primeiro tombador onze anos depois. A linha do tempo entre uma coisa e outra.",
        metaTitle: "47 anos da PILI: de 1979 a 2026, fabricando em Erechim",
        metaDesc:
          "Fundada em 1979 em Erechim/RS, a PILI Industrial soma mais de 850 equipamentos em 18 países. Conheça a trajetória da fábrica de tombadores hidráulicos.",
        content: `O logo aparece pintado na lateral das vigas, sempre no mesmo amarelo. É uma das últimas etapas antes de o equipamento sair de Erechim — e a primeira coisa que alguém vê quando ele chega ao pátio do cliente, do outro lado do país ou do continente.

A PILI foi fundada em 1979, em Erechim, no norte do Rio Grande do Sul. Não nasceu fabricando tombadores. O começo foi metalurgia industrial e equipamentos sob medida para o setor agroindustrial da região: o tipo de oficina que resolve o problema que o cliente traz, em vez de vender o produto que já está pronto.

O primeiro tombador hidráulico da casa só saiu em 1990. Onze anos depois da fundação. Esse equipamento marcou a virada do trabalho sob medida genérico para a especialização em plataformas de descarga de grãos, que é o que a empresa faz até hoje.

Em 2010 veio a marca de 300 equipamentos instalados no Brasil. Em 2017, a base operacional em Paranaguá, no Paraná, junto ao maior complexo portuário de exportação de grãos da América Latina. Estar perto de onde o produto embarca encurta o tempo de resposta quando alguma coisa para.

Hoje são mais de 850 equipamentos em operação, em 18 países, em plataformas que vão de 9 a 30 metros e de 35 a 100 toneladas.

Quarenta e sete anos é tempo suficiente para que um equipamento vendido no começo ainda esteja trabalhando. Talvez esse seja o indicador mais honesto de uma fábrica de bens de capital: não quantos vendeu no ano passado, e sim quantos dos que vendeu há vinte anos continuam de pé.`,
      },
      es: {
        title: "De 1979 a 2026: lo que cabe en 47 años fabricando en Erechim",
        excerpt:
          "PILI empezó como metalurgia industrial en el interior de Rio Grande do Sul y recién fabricó su primer volcador once años después. La línea de tiempo entre una cosa y otra.",
        metaTitle: "47 años de PILI: de 1979 a 2026, fabricando en Erechim",
        metaDesc:
          "Fundada en 1979 en Erechim/RS, PILI Industrial suma más de 850 equipos en 18 países. Conozca la trayectoria de la fábrica de volcadores hidráulicos.",
        content: `El logo aparece pintado en el lateral de las vigas, siempre en el mismo amarillo. Es una de las últimas etapas antes de que el equipo salga de Erechim, y lo primero que alguien ve cuando llega al patio del cliente, del otro lado del país o del continente.

PILI fue fundada en 1979, en Erechim, al norte de Rio Grande do Sul. No nació fabricando volcadores. El comienzo fue metalurgia industrial y equipos a medida para el sector agroindustrial de la región: el tipo de taller que resuelve el problema que trae el cliente, en lugar de vender el producto que ya está hecho.

El primer volcador hidráulico de la casa recién salió en 1990. Once años después de la fundación. Ese equipo marcó el giro del trabajo a medida genérico hacia la especialización en plataformas de descarga de granos, que es lo que la empresa hace hasta hoy.

En 2010 llegó la marca de 300 equipos instalados en Brasil. En 2017, la base operativa en Paranaguá, en Paraná, junto al mayor complejo portuario de exportación de granos de América Latina. Estar cerca de donde embarca el producto acorta el tiempo de respuesta cuando algo se detiene.

Hoy son más de 850 equipos en operación, en 18 países, en plataformas que van de 9 a 30 metros y de 35 a 100 toneladas.

Cuarenta y siete años es tiempo suficiente para que un equipo vendido al comienzo siga trabajando. Quizás ese sea el indicador más honesto de una fábrica de bienes de capital: no cuántos vendió el año pasado, sino cuántos de los que vendió hace veinte años siguen en pie.`,
      },
    },
  },

  {
    slug: "como-nasce-o-projeto-de-um-tombador",
    author: "PILI Industrial",
    category: PostCategory.artigo,
    readTime: 5,
    cover: "/images/blog/engenharia-projeto-cad.webp",
    publishedAt: "2026-08-11",
    tags: ["engenharia", "projeto", "CAD", "fabricacao"],
    traducoes: {
      pt_BR: {
        title: "Como nasce o projeto de um tombador",
        excerpt:
          "Antes de existir em aço, um tombador de 21 metros existe como linha na tela. O caminho que vai do requisito do cliente até a lista de materiais que chega ao chão de fábrica.",
        metaTitle: "Como nasce o projeto de um tombador hidráulico",
        metaDesc:
          "Do requisito do cliente ao comissionamento: como a engenharia da PILI transforma a operação de descarga em projeto, lista de materiais e equipamento fabricado.",
        content: `Antes de existir em aço, um tombador existe como linha na tela.

O ponto de partida nunca é o equipamento: é a operação. Que veículo vai subir na plataforma, se carreta, bitrem ou rodotrem. Quantas descargas por dia. Quanto espaço existe no pátio e o que já está construído em volta. Que produto vai ser descarregado, porque grão, fertilizante e cimento se comportam de formas diferentes. Se o equipamento é fixo ou móvel.

Dessas respostas sai o porte. E aqui mora um mal-entendido comum: um tombador de 9 metros e um de 30 metros não são o mesmo produto em escalas diferentes. Muda a estrutura, muda a fundação, muda o dimensionamento da central hidráulica, muda o painel elétrico. A faixa de 35 a 100 toneladas não é um catálogo de tamanhos, é uma família de projetos distintos.

O desenho detalha isso camada por camada. Na tela de projeto, uma plataforma de 21 metros aparece separada por cores: a estrutura em verde, a tubulação hidráulica em ciano, a elétrica em vermelho, os perfis metálicos em magenta. Cada linha é uma peça que alguém vai cortar, dobrar, soldar, jatear e pintar.

E o desenho não termina em si mesmo. Dele sai a lista de materiais que alimenta a ordem de produção: cilindro telescópico, conjunto de central hidráulica, mesa, chumbadores, painel, kit de comando. É esse vínculo entre projeto e ordem de produção que evita a falha clássica da fabricação sob medida, que é a peça desenhada e nunca comprada.

A fabricação acontece em Erechim, com corte laser, solda robotizada e jateamento, num parque dimensionado para montar equipamentos de até 30 metros. Depois vêm o transporte, a montagem em campo e o comissionamento.

O projeto só fecha quando a plataforma sobe carregada e desce vazia dentro dos parâmetros das NR-10 e NR-12, com a garantia estrutural de cinco anos valendo. Até lá, ele continua sendo o que era no começo: um desenho que precisa dar certo no aço.`,
      },
      es: {
        title: "Cómo nace el proyecto de un volcador",
        excerpt:
          "Antes de existir en acero, un volcador de 21 metros existe como línea en la pantalla. El camino que va del requisito del cliente a la lista de materiales que llega a planta.",
        metaTitle: "Cómo nace el proyecto de un volcador hidráulico",
        metaDesc:
          "Del requisito del cliente a la puesta en marcha: cómo la ingeniería de PILI transforma la operación de descarga en proyecto, lista de materiales y equipo fabricado.",
        content: `Antes de existir en acero, un volcador existe como línea en la pantalla.

El punto de partida nunca es el equipo: es la operación. Qué vehículo va a subir a la plataforma, si semirremolque, bitrén o rodotrén. Cuántas descargas por día. Cuánto espacio hay en el patio y qué ya está construido alrededor. Qué producto se va a descargar, porque grano, fertilizante y cemento se comportan de formas distintas. Si el equipo es fijo o móvil.

De esas respuestas sale el porte. Y ahí vive un malentendido común: un volcador de 9 metros y uno de 30 metros no son el mismo producto en escalas distintas. Cambia la estructura, cambia la fundación, cambia el dimensionamiento de la central hidráulica, cambia el tablero eléctrico. El rango de 35 a 100 toneladas no es un catálogo de tamaños, es una familia de proyectos distintos.

El plano detalla eso capa por capa. En la pantalla de proyecto, una plataforma de 21 metros aparece separada por colores: la estructura en verde, la tubería hidráulica en cian, la eléctrica en rojo, los perfiles metálicos en magenta. Cada línea es una pieza que alguien va a cortar, doblar, soldar, arenar y pintar.

Y el plano no termina en sí mismo. De él sale la lista de materiales que alimenta la orden de producción: cilindro telescópico, conjunto de central hidráulica, mesa, anclajes, tablero, kit de mando. Es ese vínculo entre proyecto y orden de producción lo que evita la falla clásica de la fabricación a medida, que es la pieza dibujada y nunca comprada.

La fabricación ocurre en Erechim, con corte láser, soldadura robotizada y arenado, en un parque dimensionado para montar equipos de hasta 30 metros. Después vienen el transporte, el montaje en campo y la puesta en marcha.

El proyecto recién cierra cuando la plataforma sube cargada y baja vacía dentro de los parámetros de las normas NR-10 y NR-12, con la garantía estructural de cinco años vigente. Hasta ahí, sigue siendo lo que era al comienzo: un plano que necesita funcionar en el acero.`,
      },
    },
  },

  {
    slug: "economizador-de-energia-em-tombadores-hidraulicos",
    author: "PILI Industrial",
    category: PostCategory.artigo,
    readTime: 5,
    cover: "/images/blog/economizador-energia-painel.webp",
    publishedAt: "2026-08-12",
    tags: [
      "economizador de energia",
      "central hidraulica",
      "eficiencia energetica",
      "tombador",
    ],
    traducoes: {
      pt_BR: {
        title: "Economizador de energia: o opcional que aparece na conta de luz",
        excerpt:
          "Num tombador hidráulico, o motor da central é a maior carga elétrica isolada da operação. Entender quanto ele consome sem estar descarregando é o que decide se o economizador se paga.",
        metaTitle: "Economizador de energia em tombadores hidráulicos",
        metaDesc:
          "Como avaliar o economizador de energia de um tombador hidráulico: o que pesa no consumo da central, quando o item opcional se paga e o que levantar antes de especificar.",
        content: `Quem compara duas propostas de tombador costuma olhar comprimento, capacidade e prazo de entrega. O consumo de energia raramente entra na conversa. E ele é o único item da lista que continua cobrando todo mês, muito depois de a compra ter sido paga.

Um tombador hidráulico se move por pressão de óleo. O motor elétrico aciona a bomba, a bomba pressuriza o circuito e o óleo empurra os cilindros que erguem a plataforma com o caminhão em cima. Em equipamentos de porte intermediário esse motor tem 30 cv; nos maiores, mais. É, com folga, a maior carga elétrica isolada de uma operação de descarga.

O ponto que costuma passar despercebido é que o ciclo não é contínuo. Entre posicionar o veículo, travar as rodas, erguer, esperar o produto escoar, baixar e liberar a saída, existe uma parcela relevante de tempo em que o sistema está ligado e pressurizado sem realizar trabalho útil. Essa energia não vira descarga: vira calor no óleo, que depois ainda precisa ser dissipado.

Reduzir esse desperdício é a função do economizador de energia. Na PILI ele é item opcional de projeto, não equipamento de série: nas listas de produção cada plataforma é orçada explicitamente com ou sem o conjunto. A escolha entra na especificação junto com o comprimento da mesa e o tipo de acionamento.

Isso significa que todo mundo deveria pedir? Não. O retorno depende de quanto o equipamento fica energizado sem estar descarregando, e esse número muda muito de operação para operação. Uma cooperativa que concentra a descarga em poucas semanas de safra tem um perfil; um terminal que roda o dia inteiro em ritmo constante tem outro. Some a isso a tarifa contratada e a diferença entre consumo e demanda, e duas plantas com o mesmo equipamento podem chegar a conclusões opostas.

Por isso a pergunta certa não é se o economizador vale a pena em tese, e sim quantas horas por dia a sua central fica ligada sem erguer plataforma. Levantar esse dado antes de fechar a especificação custa uma conversa. Descobrir depois custa a diferença, todo mês, pelo resto da vida útil do equipamento.`,
      },
      es: {
        title:
          "Economizador de energía: el opcional que aparece en la factura de luz",
        excerpt:
          "En un volcador hidráulico, el motor de la central es la mayor carga eléctrica aislada de la operación. Entender cuánto consume sin estar descargando decide si el economizador se paga.",
        metaTitle: "Economizador de energía en volcadores hidráulicos",
        metaDesc:
          "Cómo evaluar el economizador de energía de un volcador hidráulico: qué pesa en el consumo de la central, cuándo se paga el opcional y qué relevar antes de especificar.",
        content: `Quien compara dos propuestas de volcador suele mirar largo, capacidad y plazo de entrega. El consumo de energía rara vez entra en la conversación. Y es el único ítem de la lista que sigue cobrando todos los meses, mucho después de que la compra fue pagada.

Un volcador hidráulico se mueve por presión de aceite. El motor eléctrico acciona la bomba, la bomba presuriza el circuito y el aceite empuja los cilindros que levantan la plataforma con el camión encima. En equipos de porte intermedio ese motor tiene 30 cv; en los mayores, más. Es, con holgura, la mayor carga eléctrica aislada de una operación de descarga.

El punto que suele pasar desapercibido es que el ciclo no es continuo. Entre posicionar el vehículo, trabar las ruedas, levantar, esperar que el producto escurra, bajar y liberar la salida, existe una parte relevante del tiempo en que el sistema está encendido y presurizado sin realizar trabajo útil. Esa energía no se convierte en descarga: se convierte en calor en el aceite, que después todavía hay que disipar.

Reducir ese desperdicio es la función del economizador de energía. En PILI es un ítem opcional de proyecto, no equipamiento de serie: en las listas de producción cada plataforma se cotiza explícitamente con o sin el conjunto. La elección entra en la especificación junto con el largo de la mesa y el tipo de accionamiento.

¿Significa que todos deberían pedirlo? No. El retorno depende de cuánto tiempo el equipo queda energizado sin estar descargando, y ese número cambia mucho de operación a operación. Una cooperativa que concentra la descarga en pocas semanas de cosecha tiene un perfil; una terminal que trabaja todo el día a ritmo constante tiene otro. Sume a eso la tarifa contratada y la diferencia entre consumo y demanda, y dos plantas con el mismo equipo pueden llegar a conclusiones opuestas.

Por eso la pregunta correcta no es si el economizador vale la pena en teoría, sino cuántas horas por día su central queda encendida sin levantar plataforma. Relevar ese dato antes de cerrar la especificación cuesta una conversación. Descubrirlo después cuesta la diferencia, todos los meses, por el resto de la vida útil del equipo.`,
      },
    },
  },

  {
    slug: "as-pessoas-por-tras-do-amarelo",
    author: "PILI Industrial",
    category: PostCategory.artigo,
    readTime: 4,
    cover: "/images/blog/pessoas-proxima-geracao.webp",
    publishedAt: "2026-08-13",
    tags: ["pessoas", "cultura", "Erechim", "equipe"],
    traducoes: {
      pt_BR: {
        title: "As pessoas por trás do amarelo",
        excerpt:
          "Um tombador é projetado para durar décadas. Quem sustenta essa promessa não é o aço: é a engenharia, a solda, o painel e o técnico que atende quando o equipamento para em plena safra.",
        metaTitle: "As pessoas por trás do amarelo",
        metaDesc:
          "Engenharia, fabricação e pós-venda: quem sustenta a promessa de um tombador hidráulico projetado para durar décadas na fábrica da PILI em Erechim/RS.",
        content: `Um tombador hidráulico é um equipamento simples de explicar e difícil de fazer. Ergue um caminhão carregado, inclina, deixa o produto escoar e devolve o veículo ao chão. Repete isso milhares de vezes, por décadas, ao ar livre, com poeira, chuva e carga variável.

O que sustenta essa promessa não está no aço. Está nas pessoas que decidem a espessura da chapa, que dimensionam o cilindro, que fecham o painel elétrico conforme a NR-10 e que atendem o telefone quando o equipamento para em plena safra.

Na engenharia, isso significa gente que entende de estrutura metálica, hidráulica e automação ao mesmo tempo, porque nesse produto as três coisas conversam entre si e falham juntas. No chão de fábrica, significa corte, solda e jateamento com controle dimensional em cada etapa, que é o que a certificação ISO 9001 cobra na prática. No pós-venda, significa técnico em campo e peça disponível.

Há uma foto que resume isso melhor do que qualquer texto institucional: uma criança de capacete sentada na borda de uma plataforma recém-pintada, dentro do galpão, com a ponte rolante ao fundo. A escala é completamente desproporcional, e é exatamente esse o ponto. Aquele equipamento provavelmente ainda vai estar trabalhando quando ela for adulta.

Fabricar bem de capital é um exercício de prazo longo. As decisões tomadas hoje na mesa de projeto vão ser cobradas daqui a vinte anos, num pátio que ninguém aqui vai visitar. Fazer isso direito depende menos de discurso e mais de quem está na fábrica todo dia.`,
      },
      es: {
        title: "Las personas detrás del amarillo",
        excerpt:
          "Un volcador se proyecta para durar décadas. Quien sostiene esa promesa no es el acero: es la ingeniería, la soldadura, el tablero y el técnico que atiende cuando el equipo se detiene en plena cosecha.",
        metaTitle: "Las personas detrás del amarillo",
        metaDesc:
          "Ingeniería, fabricación y posventa: quiénes sostienen la promesa de un volcador hidráulico proyectado para durar décadas en la fábrica de PILI en Erechim/RS.",
        content: `Un volcador hidráulico es un equipo simple de explicar y difícil de hacer. Levanta un camión cargado, inclina, deja escurrir el producto y devuelve el vehículo al suelo. Repite eso miles de veces, por décadas, a la intemperie, con polvo, lluvia y carga variable.

Lo que sostiene esa promesa no está en el acero. Está en las personas que deciden el espesor de la chapa, que dimensionan el cilindro, que cierran el tablero eléctrico conforme a la norma NR-10 y que atienden el teléfono cuando el equipo se detiene en plena cosecha.

En ingeniería, eso significa gente que entiende de estructura metálica, hidráulica y automatización al mismo tiempo, porque en este producto las tres cosas se comunican entre sí y fallan juntas. En planta, significa corte, soldadura y arenado con control dimensional en cada etapa, que es lo que la certificación ISO 9001 exige en la práctica. En posventa, significa técnico en campo y repuesto disponible.

Hay una foto que resume esto mejor que cualquier texto institucional: un niño con casco sentado en el borde de una plataforma recién pintada, dentro del galpón, con el puente grúa al fondo. La escala es completamente desproporcionada, y ese es exactamente el punto. Ese equipo probablemente siga trabajando cuando él sea adulto.

Fabricar bienes de capital es un ejercicio de plazo largo. Las decisiones tomadas hoy en la mesa de proyecto se van a cobrar dentro de veinte años, en un patio que nadie de acá va a visitar. Hacerlo bien depende menos de discurso y más de quién está en la fábrica todos los días.`,
      },
    },
  },
];

async function seedBlogPosts() {
  console.log("\n--- Seeding blog posts ---");

  for (const b of BLOG_DATA) {
    const dados = {
      author: b.author,
      category: b.category,
      readTime: b.readTime,
      cover: b.cover,
      published: true,
      publishedAt: new Date(b.publishedAt),
      tags: b.tags,
    };

    const post = await db.post.upsert({
      where: { slug: b.slug },
      update: dados,
      create: { slug: b.slug, ...dados },
    });

    // Delete existing translations and recreate
    await db.postTranslation.deleteMany({ where: { postId: post.id } });

    for (const [locale, t] of Object.entries(b.traducoes)) {
      await db.postTranslation.create({
        data: {
          postId: post.id,
          locale: locale === "es" ? Locale.es : Locale.pt_BR,
          title: t.title,
          excerpt: t.excerpt,
          content: t.content,
          metaTitle: t.metaTitle,
          metaDesc: t.metaDesc,
        },
      });
    }

    console.log(`  [OK] Post: ${b.slug}`);
  }
}

// ============================================================================
// 4. CASES / OBRAS
// ============================================================================

interface CaseSeed {
  slug: string;
  client: string;
  location: string;
  year: number;
  featured: boolean;
  title: string;
  summary: string;
  content: string;
  metrics: { label: string; value: string }[];
}

const CASES_DATA: CaseSeed[] = [
  {
    slug: "cargill-paranagua",
    client: "Cargill",
    location: "Paranagua/PR",
    year: 2023,
    featured: true,
    title: "Descarga de alta performance no Porto de Paranagua",
    summary:
      "Instalacao de 2 tombadores de 30 metros fixos no terminal portuario da Cargill em Paranagua, atingindo capacidade de 120 caminhoes/dia com ciclo medio de 45 segundos e 99,2% de uptime operacional.",
    content: `O terminal da Cargill em Paranagua e um dos mais movimentados do sul do Brasil, responsavel pela exportacao de soja, milho e farelo para mercados internacionais. Com o aumento do volume embarcado e a necessidade de reduzir filas de caminhoes na regiao portuaria, a empresa buscou uma solucao de descarga que combinasse velocidade, confiabilidade e integracao com o sistema de gestao portuaria existente.

A PILI Industrial forneceu 2 tombadores de 30 metros fixos, configurados com sistema hidraulico redundante e tratamento anticorrosivo especial para ambiente maritimo. Cada unidade foi projetada para operar em regime 24/7, com sensores de posicao e automacao completa via PLC Siemens integrado ao sistema SCADA do terminal.

O comissionamento foi realizado em duas etapas para nao interromper a operacao do terminal durante a safra. A equipe PILI permaneceu em campo por 45 dias, incluindo treinamento de operadores e equipe de manutencao. O resultado foi uma capacidade de descarga de 8.400 toneladas por dia, com ciclo medio de 45 segundos e uptime de 99,2%.

Apos 12 meses de operacao, a Cargill registrou reducao de 60% no tempo de permanencia de caminhoes no terminal e eliminacao de gargalos de descarga nos picos de safra.`,
    metrics: [
      { label: "caminhoes/dia", value: "120" },
      { label: "ton/dia", value: "8.400" },
      { label: "ciclo medio", value: "45s" },
      { label: "uptime", value: "99,2%" },
    ],
  },
  {
    slug: "jbs-lins",
    client: "JBS",
    location: "Lins/SP",
    year: 2022,
    featured: false,
    title: "Recebimento de insumos na fabrica de racao JBS",
    summary:
      "Fornecimento de 1 tombador de 18 metros fixo para a fabrica de racao da JBS em Lins, otimizando o recebimento de milho e farelo com capacidade de 80 caminhoes/dia e ciclo de 65 segundos.",
    content: `A unidade da JBS em Lins/SP opera uma das maiores fabricas de racao animal do interior paulista, com demanda constante de milho, farelo de soja e outros insumos graneaveis. O equipamento anterior apresentava ciclos longos e paradas frequentes, gerando filas de caminhoes e atrasos na producao.

A PILI forneceu um tombador de 18 metros fixo, dimensionado para a frota predominante de bi-trucks que abastece a unidade. O projeto incluiu adaptacoes na moega existente e integracao com a balanca rodoviaria e o sistema ERP da fabrica, permitindo rastreabilidade automatica de cada descarga.

A instalacao foi executada em 20 dias durante uma parada programada de manutencao, sem impacto no calendario de producao. O tombador opera com ciclo medio de 65 segundos e atende ate 80 caminhoes por dia, processando 3.200 toneladas diarias de insumos.

A JBS reportou ganho de 35% na produtividade do recebimento e eliminacao de horas extras na equipe de logistica interna, alem de reducao significativa em custos de demurrage.`,
    metrics: [
      { label: "caminhoes/dia", value: "80" },
      { label: "ton/dia", value: "3.200" },
      { label: "ciclo medio", value: "65s" },
      { label: "uptime", value: "98%" },
    ],
  },
  {
    slug: "agraria-guarapuava",
    client: "Agraria",
    location: "Guarapuava/PR",
    year: 2024,
    featured: true,
    title: "Complexo de descarga e amostragem na Cooperativa Agraria",
    summary:
      "Projeto completo com 3 tombadores de 12 metros fixos e 2 coletores de amostras automaticos para a Cooperativa Agraria em Guarapuava, processando 200 caminhoes/dia durante os picos de safra com amostragem 100% rastreavel.",
    content: `A Cooperativa Agraria de Guarapuava e uma das maiores cooperativas agroindustriais do Parana, recebendo producao de centenas de cooperados em uma regiao de alta produtividade de graos. Nos picos de safra de soja e milho, filas de caminhoes chegavam a ultrapassar 3 horas de espera, gerando insatisfacao dos produtores e perdas logisticas.

A PILI projetou um complexo de descarga com 3 tombadores de 12 metros fixos operando em paralelo, combinados com 2 coletores de amostras automaticos com rastreabilidade via QR Code. A configuracao permite que cada caminhao tenha sua carga amostrada e descarregada em um unico fluxo, sem necessidade de manobras adicionais.

O sistema de amostragem coleta amostras em multiplos pontos da carga e as vincula automaticamente a placa do veiculo, nota fiscal e cooperado. Os dados sao transmitidos em tempo real para o sistema de classificacao e pagamento da cooperativa, eliminando processos manuais e disputas de qualidade.

O resultado foi um aumento de 60% na capacidade de recebimento, com 200 caminhoes processados por dia nos picos de safra. O tempo medio de permanencia dos caminhoes caiu de 3 horas para menos de 50 minutos, incluindo pesagem, amostragem e descarga.`,
    metrics: [
      { label: "caminhoes/dia", value: "200" },
      { label: "ton/dia", value: "6.000" },
      { label: "ciclo medio", value: "60s" },
      { label: "coletores operando", value: "12" },
    ],
  },
  {
    slug: "cofco-santos",
    client: "Cofco International",
    location: "Santos/SP",
    year: 2023,
    featured: false,
    title: "Terminal de exportacao COFCO no Porto de Santos",
    summary:
      "Instalacao de 2 tombadores de 26 metros fixos no terminal de exportacao da Cofco International em Santos, operando em regime 24/7 com capacidade de 10.500 toneladas/dia e integracao total com o sistema portuario.",
    content: `A Cofco International opera um dos maiores terminais de exportacao de graos do Porto de Santos, movimentando milhoes de toneladas por safra com destino a Asia e Europa. A empresa precisava ampliar a capacidade de descarga para acompanhar o crescimento dos volumes contratados e reduzir o tempo de permanencia dos navios no porto.

A PILI forneceu 2 tombadores de 26 metros fixos, projetados para operacao ininterrupta em ambiente portuario com alto indice de salinidade e umidade. Cada equipamento recebeu tratamento anticorrosivo especial com jateamento SA 2.5 e pintura epoxi de alta espessura, alem de sistema hidraulico com duplo circuito e troca a quente de filtros.

A integracao com o sistema de gestao portuaria da Cofco foi um dos diferenciais do projeto. Cada descarga e registrada automaticamente com dados de peso, horario, placa e produto, alimentando o sistema de programacao de embarque em tempo real. Os tombadores operam 24/7 com paradas programadas de apenas 4 horas semanais para manutencao preventiva.

O resultado foi uma capacidade combinada de 150 caminhoes/dia e 10.500 toneladas descarregadas diariamente, contribuindo para a reducao do tempo de espera de navios e melhoria nos indicadores de performance logistica do terminal.`,
    metrics: [
      { label: "caminhoes/dia", value: "150" },
      { label: "ton/dia", value: "10.500" },
      { label: "ciclo medio", value: "50s" },
      { label: "operacao", value: "24/7" },
    ],
  },
  {
    slug: "brf-chapeco",
    client: "BRF",
    location: "Chapeco/SC",
    year: 2021,
    featured: false,
    title: "Linha de descarga e transbordo na BRF Chapeco",
    summary:
      "Fornecimento de 1 tombador de 21 metros fixo e 1 unidade de transbordo para a planta industrial da BRF em Chapeco, processando 100 caminhoes/dia de milho e farelo para a producao de racao animal.",
    content: `A planta da BRF em Chapeco e uma das maiores unidades de processamento de aves do Brasil, com demanda diaria de milhares de toneladas de milho e farelo de soja para alimentacao dos planteis. O sistema de recebimento anterior era fragmentado, com equipamentos de diferentes fabricantes e epocas, gerando gargalos e custos elevados de manutencao.

A PILI projetou uma solucao integrada com tombador de 21 metros fixo para descarga direta na moega principal e uma unidade de transbordo para redistribuicao interna entre silos. A unidade de transbordo permite transferir carga entre veiculos sem necessidade de descarregar em moega intermediaria, otimizando o fluxo logistico da planta.

O tombador foi configurado com sistema de pesagem dinamica integrado, eliminando a necessidade de segunda pesagem na balanca rodoviaria. A automacao inclui sequenciamento automatico de caminhoes com semaforo e paineis de orientacao ao motorista, reduzindo a necessidade de operadores no patio.

A BRF registrou aumento de 25% na eficiencia do recebimento, com 100 caminhoes processados diariamente e 5.000 toneladas descarregadas. O ciclo medio de 70 segundos inclui posicionamento, descarga e liberacao do veiculo.`,
    metrics: [
      { label: "caminhoes/dia", value: "100" },
      { label: "ton/dia", value: "5.000" },
      { label: "ciclo medio", value: "70s" },
    ],
  },
  {
    slug: "lar-medianeira",
    client: "Cooperativa Lar",
    location: "Medianeira/PR",
    year: 2024,
    featured: false,
    title: "Ampliacao do recebimento na Cooperativa Lar",
    summary:
      "Projeto de ampliacao com 2 tombadores de 18 metros fixos e 3 coletores de amostras para a Cooperativa Lar em Medianeira, com capacidade de armazenamento de 15 mil toneladas e processamento de 180 caminhoes/dia.",
    content: `A Cooperativa Lar de Medianeira, no oeste do Parana, enfrentava limitacoes de capacidade de recebimento durante os picos de safra de soja e milho. Com a expansao do numero de cooperados e o aumento da produtividade por hectare na regiao, o sistema existente nao atendia mais a demanda, gerando filas e perda de produtores para concorrentes.

A PILI forneceu 2 tombadores de 18 metros fixos e 3 coletores de amostras automaticos como parte de um projeto de ampliacao que incluiu novos silos com capacidade total de 15 mil toneladas. Os tombadores foram posicionados em linhas paralelas com moega compartilhada, otimizando o investimento em obras civis.

Os coletores de amostras operam de forma integrada com o sistema de classificacao da cooperativa, permitindo que a qualidade de cada lote seja determinada antes mesmo da descarga. Quando a classificacao indica padroes fora da especificacao, o sistema redireciona o caminhao automaticamente para a linha de secagem.

O resultado foi um aumento de 70% na capacidade de recebimento, com 180 caminhoes processados por dia e ciclo medio de 55 segundos. A cooperativa eliminou filas superiores a 1 hora nos picos de safra e ampliou sua area de captacao de cooperados na regiao.`,
    metrics: [
      { label: "caminhoes/dia", value: "180" },
      { label: "ton/dia", value: "7.200" },
      { label: "ciclo medio", value: "55s" },
      { label: "armazenagem", value: "15 mil ton" },
    ],
  },
  {
    slug: "yara-rio-grande",
    client: "Yara Fertilizantes",
    location: "Rio Grande/RS",
    year: 2022,
    featured: false,
    title: "Descarga anticorrosiva para fertilizantes na Yara",
    summary:
      "Fornecimento de 1 tombador de 21 metros fixo com especificacao anticorrosiva especial para operacao com fertilizantes na planta da Yara em Rio Grande, com garantia estendida de 5 anos.",
    content: `A Yara Fertilizantes opera uma grande planta de mistura e distribuicao de fertilizantes em Rio Grande/RS, proxima ao porto. O ambiente de operacao combina dois fatores criticos: a alta corrosividade dos fertilizantes granulados e em po, e a atmosfera salina da regiao litoranea. O tombador anterior, de outro fabricante, precisou ser substituido com apenas 3 anos de uso devido a corrosao estrutural.

A PILI desenvolveu uma configuracao especial do tombador de 21 metros com revestimento em aco inox AISI 316L nas areas de contato com o produto, jateamento SA 2.5 com perfil de ancoragem de 75 micrometros na estrutura principal, e sistema de pintura de 4 camadas (primer epoxi zinco, epoxi intermediario, poliuretano acrilico e selador). O sistema hidraulico recebeu vedacoes especiais e fluido biodegradavel resistente a contaminacao.

O projeto incluiu sistema de lavagem automatica integrado que opera ao final de cada turno, removendo residuos de fertilizante das superficies de contato. Sensores de espessura de chapa foram instalados em pontos criticos para monitoramento preventivo de desgaste ao longo da vida util do equipamento.

A Yara contratou garantia estendida de 5 anos contra corrosao estrutural — a primeira do tipo na historia da PILI. Apos 2 anos de operacao, as inspecoes semestrais nao registraram nenhuma perda de espessura significativa. O tombador processa 90 caminhoes/dia com ciclo de 75 segundos, totalizando 4.500 toneladas diarias.`,
    metrics: [
      { label: "caminhoes/dia", value: "90" },
      { label: "ton/dia", value: "4.500" },
      { label: "ciclo medio", value: "75s" },
      { label: "garantia", value: "5 anos" },
    ],
  },
  {
    slug: "votorantim-itapeva",
    client: "Votorantim Cimentos",
    location: "Itapeva/SP",
    year: 2023,
    featured: false,
    title: "Tombador heavy-duty para clinquer na Votorantim Cimentos",
    summary:
      "Fornecimento de 1 tombador de 12 metros fixo em configuracao heavy-duty para descarga de clinquer e cimento na fabrica da Votorantim Cimentos em Itapeva, processando 60 caminhoes/dia com materiais de alta densidade e abrasividade.",
    content: `A fabrica da Votorantim Cimentos em Itapeva/SP e uma unidade de moagem e ensacamento que recebe clinquer de outras plantas para producao de cimento. O clinquer e um material de alta densidade e abrasividade que exige equipamentos reforcados e com manutencao especifica. Os tombadores convencionais utilizados anteriormente apresentavam desgaste acelerado nas chapas de piso e nos apoios laterais.

A PILI forneceu um tombador de 12 metros em configuracao heavy-duty, com chapas de piso em aco Hardox 450 de 12mm de espessura, apoios laterais reforcados e sistema hidraulico sobredimensionado para operar com cargas de alta densidade. O projeto incluiu cortinas de borracha especiais para conter a poeira de clinquer durante a descarga.

A instalacao foi realizada em uma parada programada de 15 dias, com fundacoes reforcadas em concreto armado para suportar as cargas dinamicas elevadas. O sistema de despoeiramento integrado captura particulas durante todo o ciclo de descarga, atendendo as normas ambientais da CETESB.

Apos 18 meses de operacao, o tombador processa 60 caminhoes/dia com ciclo medio de 70 segundos, totalizando 2.400 toneladas diarias de clinquer e cimento. O desgaste das chapas de piso esta dentro do previsto, com vida util estimada de 8 anos antes da primeira substituicao.`,
    metrics: [
      { label: "caminhoes/dia", value: "60" },
      { label: "ton/dia", value: "2.400" },
      { label: "ciclo medio", value: "70s" },
    ],
  },
];

async function seedCases() {
  console.log("\n--- Seeding cases ---");

  for (const c of CASES_DATA) {
    const caseRecord = await db.case.upsert({
      where: { slug: c.slug },
      update: {
        client: c.client,
        location: c.location,
        year: c.year,
        featured: c.featured,
        active: true,
      },
      create: {
        slug: c.slug,
        client: c.client,
        location: c.location,
        year: c.year,
        featured: c.featured,
        active: true,
      },
    });

    // Delete existing related records and recreate
    await db.caseTranslation.deleteMany({ where: { caseId: caseRecord.id } });
    await db.caseMetric.deleteMany({ where: { caseId: caseRecord.id } });

    // Translation
    await db.caseTranslation.create({
      data: {
        caseId: caseRecord.id,
        locale: Locale.pt_BR,
        title: c.title,
        summary: c.summary,
        content: c.content,
      },
    });

    // Metrics
    if (c.metrics.length > 0) {
      await db.caseMetric.createMany({
        data: c.metrics.map((m) => ({
          caseId: caseRecord.id,
          label: m.label,
          value: m.value,
        })),
      });
    }

    console.log(`  [OK] Case: ${c.slug} (${c.metrics.length} metrics)`);
  }
}

// ============================================================================
// 5. CLIENT EQUIPMENT (demo client)
// ============================================================================

async function seedClientEquipment(clientUserId: string) {
  console.log("\n--- Seeding client equipment ---");

  const equipments = [
    {
      serialNumber: "PILI-TF30-2023-0047",
      productName: "Tombador 30m Fixo",
      installedAt: new Date("2023-06-20"),
      installedAddress: "Terminal Portuario Paranagua/PR",
      warrantyEndsAt: new Date("2026-06-20"),
    },
    {
      serialNumber: "PILI-TF12-2021-0123",
      productName: "Tombador 12m Fixo",
      installedAt: new Date("2021-11-10"),
      installedAddress: "Cooperativa Central Agricola - Erechim/RS",
      warrantyEndsAt: new Date("2024-11-10"),
    },
    {
      serialNumber: "PILI-CA01-2022-0089",
      productName: "Coletor de Amostras",
      installedAt: new Date("2022-04-05"),
      installedAddress: "Cooperativa Central Agricola - Erechim/RS",
      warrantyEndsAt: new Date("2025-04-05"),
    },
  ];

  for (const eq of equipments) {
    await db.clientEquipment.upsert({
      where: { serialNumber: eq.serialNumber },
      update: {
        userId: clientUserId,
        productName: eq.productName,
        installedAt: eq.installedAt,
        installedAddress: eq.installedAddress,
        warrantyEndsAt: eq.warrantyEndsAt,
      },
      create: {
        userId: clientUserId,
        serialNumber: eq.serialNumber,
        productName: eq.productName,
        installedAt: eq.installedAt,
        installedAddress: eq.installedAddress,
        warrantyEndsAt: eq.warrantyEndsAt,
      },
    });

    console.log(`  [OK] Equipment: ${eq.serialNumber} (${eq.productName})`);
  }
}

// ============================================================================
// MAIN
// ============================================================================

async function main() {
  console.log("=== PILI Industrial — Full Database Seed ===");
  console.log(`Started at ${new Date().toISOString()}\n`);

  if (process.env.NODE_ENV === "production" && !process.env.ALLOW_PROD_SEED) {
    throw new Error(
      "Recusando rodar o seed em produção. Defina ALLOW_PROD_SEED=1 se for intencional.",
    );
  }

  try {
    // 1. Users
    const { client } = await seedUsers();

    // 2. Products
    await seedProducts();

    // 3. Blog Posts
    await seedBlogPosts();

    // 4. Cases
    await seedCases();

    // 5. Client Equipment
    await seedClientEquipment(client.id);

    console.log("\n=== Seed completed successfully! ===");
    console.log(`  Products:  ${PRODUCTS_DATA.length}`);
    console.log(`  Posts:     ${BLOG_DATA.length}`);
    console.log(`  Cases:     ${CASES_DATA.length}`);
    console.log(`  Equipment: 3`);
    console.log(`  Users:     2`);
  } catch (error) {
    console.error("\n[ERROR] Seed failed:", error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
