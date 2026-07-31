import { PrismaClient, type ProductCategory, Locale } from "@prisma/client";
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

interface BlogSeed {
  slug: string;
  author: string;
  cover: string | null;
  publishedAt: string;
  tags: string[];
  title: string;
  excerpt: string;
  content: string;
}

const BLOG_DATA: BlogSeed[] = [
  {
    slug: "pili-industrial-agrishow-2025",
    author: "Marketing PILI",
    cover: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1200&h=630&fit=crop",
    publishedAt: "2025-05-05",
    tags: ["agrishow", "feira", "tombador hidraulico", "agronegocio"],
    title: "PILI Industrial marca presenca na Agrishow 2025",
    excerpt:
      "A PILI Industrial participou da Agrishow 2025 em Ribeirao Preto, apresentando sua linha completa de tombadores hidraulicos e as plataformas do ecossistema digital PILI.",
    content: `A PILI Industrial marcou presenca na Agrishow 2025, a maior feira de tecnologia agricola da America Latina, realizada entre 28 de abril e 2 de maio em Ribeirao Preto/SP. O estande da empresa reuniu a linha completa de tombadores hidraulicos, coletores de amostras e as plataformas digitais do ecossistema PILI, atraindo produtores, cooperativas e operadores portuarios de todo o Brasil.

Durante os cinco dias de evento, a equipe comercial realizou mais de 300 atendimentos tecnicos e fechou contratos para 12 novos equipamentos, incluindo dois tombadores de 30 metros destinados a terminais portuarios no Arco Norte. O destaque do estande foi a demonstracao ao vivo do PILI Tech, o sistema de gestao de patio com IoT que monitora filas, tempos de espera e eficiencia operacional em tempo real.

"A Agrishow e o momento em que consolidamos relacionamentos com clientes estrategicos e apresentamos as inovacoes do ano. Em 2025, o foco foi mostrar como nossos equipamentos se integram ao ecossistema digital para entregar nao apenas descarga rapida, mas inteligencia operacional completa", afirmou o diretor comercial da PILI Industrial.

A participacao na feira reforca o posicionamento da PILI como referencia em solucoes de descarga de graos, com mais de 45 anos de experiencia e presenca em 18 paises. A proxima parada da empresa sera a Expodireto Cotrijal 2026, em Nao-Me-Toque/RS.`,
  },
  {
    slug: "novo-tombador-30-metros-recorde-capacidade",
    author: "Eng. Carlos Monteiro",
    cover: "/images/tombador-pili.jpg",
    publishedAt: "2025-03-18",
    tags: ["tombador", "lancamento", "100 toneladas", "porto"],
    title: "Novo tombador de 30 metros bate recorde de capacidade",
    excerpt:
      "A PILI Industrial lanca o tombador hidraulico de 30 metros com capacidade para 100 toneladas, o maior ja fabricado pela empresa em seus 45 anos de historia.",
    content: `A PILI Industrial anunciou o lancamento do seu novo tombador hidraulico de 30 metros com capacidade para 100 toneladas, estabelecendo um novo recorde na linha de produtos da empresa. O equipamento foi projetado para atender a demanda crescente de terminais portuarios e grandes cooperativas que operam com carretas rodotrens e bitrens de alta capacidade.

O novo modelo incorpora um sistema hidraulico de dupla acao com quatro cilindros sincronizados, reduzindo o ciclo de descarga para menos de 40 segundos. A estrutura utiliza aco de alta resistencia ASTM A572 Grau 50 com tratamento superficial por jateamento e pintura epoxi de alto desempenho, garantindo vida util superior a 25 anos em ambiente portuario agressivo.

Entre as inovacoes tecnicas, destaca-se o sistema de pesagem dinamica integrado a plataforma, que permite verificar o peso da carga durante o processo de descarga sem necessidade de balanca rodoviaria separada. O equipamento tambem conta com sensores de posicao e inclinacao conectados ao PILI Tech, possibilitando monitoramento remoto de performance e manutencao preditiva.

As primeiras duas unidades ja foram encomendadas por um terminal portuario no Maranhao e devem entrar em operacao no segundo semestre de 2025. O investimento em pesquisa e desenvolvimento para este modelo levou 18 meses e envolveu simulacoes estruturais em elementos finitos e testes em escala real na planta de Erechim/RS.`,
  },
  {
    slug: "pili-raster-conformidade-eudr-exportadores",
    author: "Equipe PILI",
    cover: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1200&h=630&fit=crop",
    publishedAt: "2025-02-10",
    tags: ["EUDR", "rastreabilidade", "exportacao", "sustentabilidade"],
    title: "PILI Raster garante conformidade EUDR para exportadores brasileiros",
    excerpt:
      "A plataforma de rastreabilidade de graos PILI Raster permite que exportadores brasileiros atendam as exigencias do Regulamento Europeu contra Desmatamento.",
    content: `O Regulamento da Uniao Europeia contra o Desmatamento (EUDR), que entra em vigor em dezembro de 2025, exige que exportadores de commodities como soja, cafe e cacau comprovem que seus produtos nao estao associados a areas desmatadas apos dezembro de 2020. A plataforma PILI Raster foi desenvolvida especificamente para atender essa demanda, oferecendo rastreabilidade completa da cadeia produtiva de graos desde a lavoura ate o porto de embarque.

O sistema integra dados de geolocalizacao das propriedades rurais com imagens de satelite e registros do Cadastro Ambiental Rural (CAR), gerando relatorios de due diligence automatizados que atendem aos requisitos do EUDR. Cada lote de graos recebe um certificado digital com QR Code que permite rastrear a origem, o transporte e o processamento do produto em toda a cadeia.

"O Brasil e o maior exportador de soja do mundo e precisa demonstrar que sua producao e sustentavel. O PILI Raster elimina a complexidade da rastreabilidade e transforma conformidade regulatoria em vantagem competitiva", explica a equipe de desenvolvimento da plataforma. Ja sao mais de 150 propriedades cadastradas em Mato Grosso, Goias e Parana, com expectativa de alcancar 500 ate o final de 2025.

A plataforma opera em integracao nativa com o PILI Tech e o PILI Harbor, permitindo que a rastreabilidade acompanhe o grao desde a colheita, passando pela recepcao na cooperativa ou terminal, ate o embarque no navio. Essa integracao completa posiciona o ecossistema PILI como solucao unica para conformidade EUDR no agronegocio brasileiro.`,
  },
  {
    slug: "como-dimensionar-tombador-ideal",
    author: "Eng. Carlos Monteiro",
    cover: "/images/tombador-pili.jpg",
    publishedAt: "2025-01-22",
    tags: ["tombador", "dimensionamento", "guia tecnico", "engenharia"],
    title: "Como dimensionar o tombador ideal para sua operacao",
    excerpt:
      "Guia tecnico completo para escolher o tombador hidraulico correto considerando tipo de veiculo, capacidade, ciclo operacional e condicoes do terreno.",
    content: `Dimensionar corretamente um tombador hidraulico e fundamental para garantir eficiencia operacional, seguranca e retorno sobre o investimento. A escolha errada pode resultar em gargalos de descarga, desgaste prematuro do equipamento e custos operacionais elevados. Neste artigo, apresentamos os principais criterios tecnicos que devem ser considerados.

O primeiro fator e o tipo de veiculo predominante na operacao. Tombadores de 9 a 12 metros atendem caminhoes truck e bi-truck, enquanto modelos de 18 metros sao indicados para carretas de tres eixos. Para operacoes portuarias com rodotrens e bitrens, os tombadores de 24 a 30 metros sao a escolha adequada. A capacidade nominal do equipamento deve ser dimensionada com margem de 20% acima do peso bruto total combinado (PBTC) maximo dos veiculos atendidos.

O ciclo operacional desejado determina a potencia do sistema hidraulico e a velocidade de basculamento. Em operacoes de alta demanda como portos e grandes cooperativas, ciclos abaixo de 60 segundos exigem sistemas hidraulicos de alta vazao com acumuladores de pressao. Ja em industrias com fluxo moderado, ciclos de 90 a 120 segundos podem ser suficientes e representam economia significativa no investimento inicial.

Condicoes do terreno e infraestrutura existente tambem influenciam a decisao. Tombadores fixos necessitam de fundacao em concreto armado dimensionada para as cargas dinamicas do basculamento. Modelos moveis sobre rodas oferecem flexibilidade de posicionamento, mas tem capacidade limitada a 60 toneladas. A equipe tecnica da PILI Industrial oferece consultoria gratuita para dimensionamento, incluindo visita tecnica e analise de fluxo operacional.`,
  },
  {
    slug: "pili-tech-reduz-tempo-espera-paranagua",
    author: "Equipe PILI",
    cover: "https://images.unsplash.com/photo-1494412574643-ff11b0a5eb19?w=1200&h=630&fit=crop",
    publishedAt: "2024-11-15",
    tags: ["PILI Tech", "IoT", "porto", "logistica", "Paranagua"],
    title: "PILI Tech reduz tempo de espera em 40% no Porto de Paranagua",
    excerpt:
      "O sistema de gestao de patio PILI Tech reduziu o tempo medio de espera de caminhoes de 4,5 para 2,7 horas no terminal portuario de Paranagua.",
    content: `O Porto de Paranagua, um dos maiores complexos portuarios do Brasil para exportacao de graos, registrou uma reducao de 40% no tempo medio de espera de caminhoes apos a implantacao do sistema PILI Tech em seu principal terminal de descarga. O tempo medio caiu de 4 horas e 30 minutos para 2 horas e 42 minutos, impactando diretamente a eficiencia logistica e os custos de transporte.

O PILI Tech utiliza sensores IoT instalados nos tombadores, balancas e pontos de controle do patio para monitorar em tempo real o fluxo de veiculos, tempos de ciclo e status de cada equipamento. Algoritmos de otimizacao distribuem automaticamente os caminhoes entre as linhas de descarga disponiveis, evitando gargalos e ociosidade simultanea de equipamentos.

O painel de controle permite que gestores do terminal visualizem indicadores como taxa de ocupacao, tempo medio de ciclo, previsao de filas e alertas de manutencao preventiva. Relatorios automatizados sao gerados diariamente e enviados por e-mail para a diretoria de operacoes, facilitando a tomada de decisao baseada em dados.

"Antes do PILI Tech, a gestao do patio era feita visualmente, com radio e prancheta. Hoje temos visibilidade completa da operacao em tempo real e conseguimos antecipar problemas antes que eles gerem filas. A reducao de 40% no tempo de espera representou economia de mais de R$ 2 milhoes por safra em custos de demurrage e estadias de caminhoes", relatou o gerente de operacoes do terminal.`,
  },
  {
    slug: "pili-store-2000-pecas-catalogo",
    author: "Marketing PILI",
    cover: "https://images.unsplash.com/photo-1553413077-190dd305871c?w=1200&h=630&fit=crop",
    publishedAt: "2024-09-20",
    tags: ["PILI Store", "e-commerce", "pecas de reposicao", "pos-venda"],
    title: "PILI Store ultrapassa 2.000 pecas no catalogo online",
    excerpt:
      "A loja virtual PILI Store atinge a marca de 2.000 pecas de reposicao no catalogo, com entrega para todo o Brasil e rastreamento integrado.",
    content: `A PILI Store, plataforma de e-commerce para pecas de reposicao de equipamentos PILI Industrial, ultrapassou a marca de 2.000 itens disponiveis no catalogo online. A loja oferece desde componentes hidraulicos como cilindros, valvulas e mangueiras ate pecas estruturais, sensores e kits de manutencao preventiva para toda a linha de tombadores e coletores de amostras.

O crescimento do catalogo reflete a estrategia da PILI de digitalizar o atendimento pos-venda e reduzir o tempo de resposta para clientes que necessitam de pecas de reposicao com urgencia. A plataforma conta com busca inteligente por modelo do equipamento, numero de serie e codigo da peca, alem de recomendacoes automaticas de componentes relacionados e kits de manutencao programada.

"Nossos clientes operam equipamentos criticos que nao podem ficar parados. A PILI Store garante que qualquer peca de reposicao esteja a poucos cliques de distancia, com prazo de entrega de 24 a 72 horas para as principais capitais do Brasil", destaca a equipe de pos-venda da empresa.

A loja ja registrou mais de 5.000 pedidos desde o lancamento e mantem indice de satisfacao de 4,8 de 5 estrelas. Os proximos passos incluem integracao com o PILI Tech para pedidos automaticos de pecas baseados em alertas de manutencao preditiva, e expansao do catalogo para equipamentos de terceiros compativeis com a linha PILI.`,
  },
  {
    slug: "tendencias-logistica-graos-2025",
    author: "Eng. Carlos Monteiro",
    cover: "https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?w=1200&h=630&fit=crop",
    publishedAt: "2024-08-05",
    tags: ["logistica", "tendencias", "agronegocio", "automacao", "sustentabilidade"],
    title: "Tendencias em logistica de graos para 2025",
    excerpt:
      "Analise das principais tendencias que estao transformando a logistica de graos no Brasil: automacao, rastreabilidade, descarbonizacao e infraestrutura multimodal.",
    content: `O Brasil consolidou-se como o maior exportador mundial de soja e um dos principais fornecedores globais de milho, cafe e algodao. Com safras que superam 300 milhoes de toneladas anuais, a logistica de graos enfrenta desafios crescentes de escala, eficiencia e sustentabilidade. Identificamos quatro tendencias que devem moldar o setor em 2025 e nos proximos anos.

A primeira e a automacao completa dos processos de recebimento e descarga. Tombadores hidraulicos com sensores IoT, balancas dinamicas integradas e sistemas de amostragem automatica eliminam processos manuais e reduzem o ciclo de descarga de minutos para segundos. Cooperativas e terminais que adotaram automacao reportam ganhos de produtividade entre 30% e 50%, alem de reducao significativa de erros humanos na classificacao de graos.

A segunda tendencia e a rastreabilidade de ponta a ponta, impulsionada por regulamentacoes como o EUDR europeu e exigencias crescentes de compradores internacionais. Plataformas digitais que rastreiam o grao desde a propriedade rural ate o porto de embarque deixaram de ser diferencial para se tornarem requisito obrigatorio de acesso a mercados premium.

A terceira e quarta tendencias convergem: descarbonizacao da cadeia logistica e expansao da infraestrutura multimodal. O investimento em ferrovias como a Ferrograo e a expansao de terminais hidroviarios no Arco Norte prometem reduzir a dependencia do transporte rodoviario, enquanto equipamentos eletricos e hibridos comecam a substituir sistemas puramente diesel em terminais de descarga. A PILI Industrial ja desenvolve versoes com acionamento eletrico para toda a sua linha de tombadores, alinhada a essa tendencia global.`,
  },
  {
    slug: "pili-harbor-gestao-patio-inteligente-iot",
    author: "Equipe PILI",
    cover: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&h=630&fit=crop&q=80",
    publishedAt: "2024-07-12",
    tags: ["PILI Harbor", "IoT", "gestao de patio", "inteligencia artificial"],
    title: "PILI Harbor: gestao de patio inteligente com IoT",
    excerpt:
      "Conheca o PILI Harbor, a plataforma de gestao de patio que integra IoT, visao computacional e inteligencia artificial para otimizar operacoes de terminais graneleiros.",
    content: `A PILI Industrial lancou o PILI Harbor, sua mais nova plataforma digital voltada para a gestao inteligente de patios em terminais graneleiros, cooperativas e industrias. O sistema combina sensores IoT, cameras com visao computacional e algoritmos de inteligencia artificial para oferecer controle total sobre o fluxo de veiculos, alocacao de recursos e eficiencia operacional.

O PILI Harbor mapeia digitalmente todo o patio de operacoes, identificando automaticamente veiculos por placa e RFID, direcionando caminhoes para filas de descarga otimizadas e monitorando o status de cada equipamento em tempo real. O modulo de previsao de demanda utiliza dados historicos e informacoes de safra para antecipar picos de movimento e sugerir escalas de operacao adequadas.

A integracao com o PILI Tech e o PILI Raster cria um ecossistema completo: o Harbor gerencia o patio, o Tech monitora os equipamentos de descarga e o Raster garante a rastreabilidade do grao. Juntas, as tres plataformas eliminam processos manuais, reduzem tempos de espera e geram dados que transformam a operacao logistica de reativa para preditiva.

O sistema ja opera em fase piloto em tres terminais no Parana e Mato Grosso do Sul, com resultados iniciais que indicam reducao de 35% no tempo de permanencia de veiculos no patio e aumento de 25% na utilizacao dos equipamentos de descarga. O lancamento comercial esta previsto para o primeiro trimestre de 2025, com planos de assinatura mensal que incluem hardware IoT, software e suporte tecnico 24/7.`,
  },
];

async function seedBlogPosts() {
  console.log("\n--- Seeding blog posts ---");

  for (const b of BLOG_DATA) {
    const post = await db.post.upsert({
      where: { slug: b.slug },
      update: {
        author: b.author,
        cover: b.cover,
        published: true,
        publishedAt: new Date(b.publishedAt),
        tags: b.tags,
      },
      create: {
        slug: b.slug,
        author: b.author,
        cover: b.cover,
        published: true,
        publishedAt: new Date(b.publishedAt),
        tags: b.tags,
      },
    });

    // Delete existing translations and recreate
    await db.postTranslation.deleteMany({ where: { postId: post.id } });

    await db.postTranslation.create({
      data: {
        postId: post.id,
        locale: Locale.pt_BR,
        title: b.title,
        excerpt: b.excerpt,
        content: b.content,
      },
    });

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
