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
    slug: "cargill-paranagua",
    title: "Descarga de alta performance no Porto de Paranaguá",
    client: "Cargill",
    location: "Paranaguá/PR",
    year: 2023,
    application: "porto",
    summary:
      "Instalação de 2 tombadores de 30 metros fixos no terminal portuário da Cargill em Paranaguá, atingindo capacidade de 120 caminhões/dia com ciclo médio de 45 segundos e 99,2% de uptime operacional.",
    content: `O terminal da Cargill em Paranaguá é um dos mais movimentados do sul do Brasil, responsável pela exportação de soja, milho e farelo para mercados internacionais. Com o aumento do volume embarcado e a necessidade de reduzir filas de caminhões na região portuária, a empresa buscou uma solução de descarga que combinasse velocidade, confiabilidade e integração com o sistema de gestão portuária existente.

A PILI Industrial forneceu 2 tombadores de 30 metros fixos, configurados com sistema hidráulico redundante e tratamento anticorrosivo especial para ambiente marítimo. Cada unidade foi projetada para operar em regime 24/7, com sensores de posição e automação completa via PLC Siemens integrado ao sistema SCADA do terminal.

O comissionamento foi realizado em duas etapas para não interromper a operação do terminal durante a safra. A equipe PILI permaneceu em campo por 45 dias, incluindo treinamento de operadores e equipe de manutenção. O resultado foi uma capacidade de descarga de 8.400 toneladas por dia, com ciclo médio de 45 segundos e uptime de 99,2%.

Após 12 meses de operação, a Cargill registrou redução de 60% no tempo de permanência de caminhões no terminal e eliminação de gargalos de descarga nos picos de safra.`,
    metrics: [
      { label: "caminhões/dia", value: "120" },
      { label: "ton/dia", value: "8.400" },
      { label: "ciclo médio", value: "45s" },
      { label: "uptime", value: "99,2%" },
    ],
    products: ["tombador-30m-fixo"],
    featured: true,
  },
  {
    slug: "jbs-lins",
    title: "Recebimento de insumos na fábrica de ração JBS",
    client: "JBS",
    location: "Lins/SP",
    year: 2022,
    application: "industria",
    summary:
      "Fornecimento de 1 tombador de 18 metros fixo para a fábrica de ração da JBS em Lins, otimizando o recebimento de milho e farelo com capacidade de 80 caminhões/dia e ciclo de 65 segundos.",
    content: `A unidade da JBS em Lins/SP opera uma das maiores fábricas de ração animal do interior paulista, com demanda constante de milho, farelo de soja e outros insumos graneláveis. O equipamento anterior apresentava ciclos longos e paradas frequentes, gerando filas de caminhões e atrasos na produção.

A PILI forneceu um tombador de 18 metros fixo, dimensionado para a frota predominante de bi-trucks que abastece a unidade. O projeto incluiu adaptações na moega existente e integração com a balança rodoviária e o sistema ERP da fábrica, permitindo rastreabilidade automática de cada descarga.

A instalação foi executada em 20 dias durante uma parada programada de manutenção, sem impacto no calendário de produção. O tombador opera com ciclo médio de 65 segundos e atende até 80 caminhões por dia, processando 3.200 toneladas diárias de insumos.

A JBS reportou ganho de 35% na produtividade do recebimento e eliminação de horas extras na equipe de logística interna, além de redução significativa em custos de demurrage.`,
    metrics: [
      { label: "caminhões/dia", value: "80" },
      { label: "ton/dia", value: "3.200" },
      { label: "ciclo médio", value: "65s" },
      { label: "uptime", value: "98%" },
    ],
    products: ["tombador-18m-fixo"],
    featured: false,
  },
  {
    slug: "agraria-guarapuava",
    title: "Complexo de descarga e amostragem na Cooperativa Agrária",
    client: "Agrária",
    location: "Guarapuava/PR",
    year: 2024,
    application: "cooperativa",
    summary:
      "Projeto completo com 3 tombadores de 12 metros fixos e 2 coletores de amostras automáticos para a Cooperativa Agrária em Guarapuava, processando 200 caminhões/dia durante os picos de safra com amostragem 100% rastreável.",
    content: `A Cooperativa Agrária de Guarapuava é uma das maiores cooperativas agroindustriais do Paraná, recebendo produção de centenas de cooperados em uma região de alta produtividade de grãos. Nos picos de safra de soja e milho, filas de caminhões chegavam a ultrapassar 3 horas de espera, gerando insatisfação dos produtores e perdas logísticas.

A PILI projetou um complexo de descarga com 3 tombadores de 12 metros fixos operando em paralelo, combinados com 2 coletores de amostras automáticos com rastreabilidade via QR Code. A configuração permite que cada caminhão tenha sua carga amostrada e descarregada em um único fluxo, sem necessidade de manobras adicionais.

O sistema de amostragem coleta amostras em múltiplos pontos da carga e as vincula automaticamente a placa do veículo, nota fiscal e cooperado. Os dados são transmitidos em tempo real para o sistema de classificação e pagamento da cooperativa, eliminando processos manuais e disputas de qualidade.

O resultado foi um aumento de 60% na capacidade de recebimento, com 200 caminhões processados por dia nos picos de safra. O tempo médio de permanência dos caminhões caiu de 3 horas para menos de 50 minutos, incluindo pesagem, amostragem e descarga.`,
    metrics: [
      { label: "caminhões/dia", value: "200" },
      { label: "ton/dia", value: "6.000" },
      { label: "ciclo médio", value: "60s" },
      { label: "coletores operando", value: "12" },
    ],
    products: ["tombador-12m-fixo", "coletor-amostras"],
    featured: true,
  },
  {
    slug: "cofco-santos",
    title: "Terminal de exportação COFCO no Porto de Santos",
    client: "Cofco International",
    location: "Santos/SP",
    year: 2023,
    application: "porto",
    summary:
      "Instalação de 2 tombadores de 26 metros fixos no terminal de exportação da Cofco International em Santos, operando em regime 24/7 com capacidade de 10.500 toneladas/dia e integração total com o sistema portuário.",
    content: `A Cofco International opera um dos maiores terminais de exportação de grãos do Porto de Santos, movimentando milhões de toneladas por safra com destino a Ásia e Europa. A empresa precisava ampliar a capacidade de descarga para acompanhar o crescimento dos volumes contratados e reduzir o tempo de permanência dos navios no porto.

A PILI forneceu 2 tombadores de 26 metros fixos, projetados para operação ininterrupta em ambiente portuário com alto índice de salinidade e umidade. Cada equipamento recebeu tratamento anticorrosivo especial com jateamento SA 2.5 e pintura epóxi de alta espessura, além de sistema hidráulico com duplo circuito e troca a quente de filtros.

A integração com o sistema de gestão portuária da Cofco foi um dos diferenciais do projeto. Cada descarga é registrada automaticamente com dados de peso, horário, placa e produto, alimentando o sistema de programação de embarque em tempo real. Os tombadores operam 24/7 com paradas programadas de apenas 4 horas semanais para manutenção preventiva.

O resultado foi uma capacidade combinada de 150 caminhões/dia e 10.500 toneladas descarregadas diariamente, contribuindo para a redução do tempo de espera de navios e melhoria nos indicadores de performance logística do terminal.`,
    metrics: [
      { label: "caminhões/dia", value: "150" },
      { label: "ton/dia", value: "10.500" },
      { label: "ciclo médio", value: "50s" },
      { label: "operação", value: "24/7" },
    ],
    products: ["tombador-26m-fixo"],
    featured: false,
  },
  {
    slug: "brf-chapeco",
    title: "Linha de descarga e transbordo na BRF Chapecó",
    client: "BRF",
    location: "Chapecó/SC",
    year: 2021,
    application: "industria",
    summary:
      "Fornecimento de 1 tombador de 21 metros fixo e 1 unidade de transbordo para a planta industrial da BRF em Chapecó, processando 100 caminhões/dia de milho e farelo para a produção de ração animal.",
    content: `A planta da BRF em Chapecó é uma das maiores unidades de processamento de aves do Brasil, com demanda diária de milhares de toneladas de milho e farelo de soja para alimentação dos plantéis. O sistema de recebimento anterior era fragmentado, com equipamentos de diferentes fabricantes e épocas, gerando gargalos e custos elevados de manutenção.

A PILI projetou uma solução integrada com tombador de 21 metros fixo para descarga direta na moega principal e uma unidade de transbordo para redistribuição interna entre silos. A unidade de transbordo permite transferir carga entre veículos sem necessidade de descarregar em moega intermediária, otimizando o fluxo logístico da planta.

O tombador foi configurado com sistema de pesagem dinâmica integrado, eliminando a necessidade de segunda pesagem na balança rodoviária. A automação inclui sequenciamento automático de caminhões com semáforo e painéis de orientação ao motorista, reduzindo a necessidade de operadores no pátio.

A BRF registrou aumento de 25% na eficiência do recebimento, com 100 caminhões processados diariamente e 5.000 toneladas descarregadas. O ciclo médio de 70 segundos inclui posicionamento, descarga e liberação do veículo.`,
    metrics: [
      { label: "caminhões/dia", value: "100" },
      { label: "ton/dia", value: "5.000" },
      { label: "ciclo médio", value: "70s" },
    ],
    products: ["tombador-21m-fixo"],
    featured: false,
  },
  {
    slug: "lar-medianeira",
    title: "Ampliação do recebimento na Cooperativa Lar",
    client: "Cooperativa Lar",
    location: "Medianeira/PR",
    year: 2024,
    application: "cooperativa",
    summary:
      "Projeto de ampliação com 2 tombadores de 18 metros fixos e 3 coletores de amostras para a Cooperativa Lar em Medianeira, com capacidade de armazenamento de 15 mil toneladas e processamento de 180 caminhões/dia.",
    content: `A Cooperativa Lar de Medianeira, no oeste do Paraná, enfrentava limitações de capacidade de recebimento durante os picos de safra de soja e milho. Com a expansão do número de cooperados e o aumento da produtividade por hectare na região, o sistema existente não atendia mais a demanda, gerando filas e perda de produtores para concorrentes.

A PILI forneceu 2 tombadores de 18 metros fixos e 3 coletores de amostras automáticos como parte de um projeto de ampliação que incluiu novos silos com capacidade total de 15 mil toneladas. Os tombadores foram posicionados em linhas paralelas com moega compartilhada, otimizando o investimento em obras civis.

Os coletores de amostras operam de forma integrada com o sistema de classificação da cooperativa, permitindo que a qualidade de cada lote seja determinada antes mesmo da descarga. Quando a classificação indica padrões fora da específicação, o sistema redireciona o caminhão automaticamente para a linha de secagem.

O resultado foi um aumento de 70% na capacidade de recebimento, com 180 caminhões processados por dia e ciclo médio de 55 segundos. A cooperativa eliminou filas superiores a 1 hora nos picos de safra e ampliou sua área de captação de cooperados na região.`,
    metrics: [
      { label: "caminhões/dia", value: "180" },
      { label: "ton/dia", value: "7.200" },
      { label: "ciclo médio", value: "55s" },
      { label: "armazenagem", value: "15 mil ton" },
    ],
    products: ["tombador-18m-fixo", "coletor-amostras"],
    featured: false,
  },
  {
    slug: "yara-rio-grande",
    title: "Descarga anticorrosiva para fertilizantes na Yara",
    client: "Yara Fertilizantes",
    location: "Rio Grande/RS",
    year: 2022,
    application: "fertilizante",
    summary:
      "Fornecimento de 1 tombador de 21 metros fixo com específicação anticorrosiva especial para operação com fertilizantes na planta da Yara em Rio Grande, com garantia estendida de 5 anos.",
    content: `A Yara Fertilizantes opera uma grande planta de mistura e distribuição de fertilizantes em Rio Grande/RS, próxima ao porto. O ambiente de operação combina dois fatores críticos: a alta corrosividade dos fertilizantes granulados e em pó, e a atmosfera salina da região litorânea. O tombador anterior, de outro fabricante, precisou ser substituído com apenas 3 anos de uso devido a corrosão estrutural.

A PILI desenvolveu uma configuração especial do tombador de 21 metros com revestimento em aço inox AISI 316L nas áreas de contato com o produto, jateamento SA 2.5 com perfil de ancoragem de 75 micrômetros na estrutura principal, e sistema de pintura de 4 camadas (primer epóxi zinco, epóxi intermediário, poliuretano acrílico e selador). O sistema hidráulico recebeu vedações especiais e fluido biodegradável resistente a contaminação.

O projeto incluiu sistema de lavagem automática integrado que opera ao final de cada turno, removendo resíduos de fertilizante das superfícies de contato. Sensores de espessura de chapa foram instalados em pontos críticos para monitoramento preventivo de desgaste ao longo da vida útil do equipamento.

A Yara contratou garantia estendida de 5 anos contra corrosão estrutural — a primeira do tipo na história da PILI. Após 2 anos de operação, as inspeções semestrais não registraram nenhuma perda de espessura significativa. O tombador processa 90 caminhões/dia com ciclo de 75 segundos, totalizando 4.500 toneladas diárias.`,
    metrics: [
      { label: "caminhões/dia", value: "90" },
      { label: "ton/dia", value: "4.500" },
      { label: "ciclo médio", value: "75s" },
      { label: "garantia", value: "5 anos" },
    ],
    products: ["tombador-21m-fixo"],
    featured: false,
  },
  {
    slug: "votorantim-itapeva",
    title: "Tombador heavy-duty para clínquer na Votorantim Cimentos",
    client: "Votorantim Cimentos",
    location: "Itapeva/SP",
    year: 2023,
    application: "cimento",
    summary:
      "Fornecimento de 1 tombador de 12 metros fixo em configuração heavy-duty para descarga de clínquer e cimento na fábrica da Votorantim Cimentos em Itapeva, processando 60 caminhões/dia com materiais de alta densidade e abrasividade.",
    content: `A fábrica da Votorantim Cimentos em Itapeva/SP é uma unidade de moagem e ensacamento que recebe clínquer de outras plantas para produção de cimento. O clínquer é um material de alta densidade e abrasividade que exige equipamentos reforçados e com manutenção específica. Os tombadores convencionais utilizados anteriormente apresentavam desgaste acelerado nas chapas de piso e nos apoios laterais.

A PILI forneceu um tombador de 12 metros em configuração heavy-duty, com chapas de piso em aço Hardox 450 de 12mm de espessura, apoios laterais reforçados e sistema hidráulico sobredimensionado para operar com cargas de alta densidade. O projeto incluiu cortinas de borracha especiais para conter a poeira de clínquer durante a descarga.

A instalação foi realizada em uma parada programada de 15 dias, com fundações reforçadas em concreto armado para suportar as cargas dinâmicas elevadas. O sistema de despoeiramento integrado captura partículas durante todo o ciclo de descarga, atendendo as normas ambientais da CETESB.

Após 18 meses de operação, o tombador processa 60 caminhões/dia com ciclo médio de 70 segundos, totalizando 2.400 toneladas diárias de clínquer e cimento. O desgaste das chapas de piso está dentro do previsto, com vida útil estimada de 8 anos antes da primeira substituição.`,
    metrics: [
      { label: "caminhões/dia", value: "60" },
      { label: "ton/dia", value: "2.400" },
      { label: "ciclo médio", value: "70s" },
    ],
    products: ["tombador-12m-fixo"],
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
