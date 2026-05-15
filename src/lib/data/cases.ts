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
    title: "Descarga de alta performance no Porto de Paranagua",
    client: "Cargill",
    location: "Paranagua/PR",
    year: 2023,
    application: "porto",
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
    products: ["tombador-30m-fixo"],
    featured: true,
  },
  {
    slug: "jbs-lins",
    title: "Recebimento de insumos na fabrica de racao JBS",
    client: "JBS",
    location: "Lins/SP",
    year: 2022,
    application: "industria",
    summary:
      "Fornecimento de 1 tombador de 18 metros fixo para a fabrica de racao da JBS em Lins, otimizando o recebimento de milho e farelo com capacidade de 80 caminhoes/dia e ciclo de 65 segundos.",
    content: `A unidade da JBS em Lins/SP opera uma das maiores fabricas de racao animal do interior paulista, com demanda constante de milho, farelo de soja e outros insumos granelaveis. O equipamento anterior apresentava ciclos longos e paradas frequentes, gerando filas de caminhoes e atrasos na producao.

A PILI forneceu um tombador de 18 metros fixo, dimensionado para a frota predominante de bi-trucks que abastece a unidade. O projeto incluiu adaptacoes na moega existente e integracao com a balanca rodoviaria e o sistema ERP da fabrica, permitindo rastreabilidade automatica de cada descarga.

A instalacao foi executada em 20 dias durante uma parada programada de manutencao, sem impacto no calendario de producao. O tombador opera com ciclo medio de 65 segundos e atende ate 80 caminhoes por dia, processando 3.200 toneladas diarias de insumos.

A JBS reportou ganho de 35% na produtividade do recebimento e eliminacao de horas extras na equipe de logistica interna, alem de reducao significativa em custos de demurrage.`,
    metrics: [
      { label: "caminhoes/dia", value: "80" },
      { label: "ton/dia", value: "3.200" },
      { label: "ciclo medio", value: "65s" },
      { label: "uptime", value: "98%" },
    ],
    products: ["tombador-18m-fixo"],
    featured: false,
  },
  {
    slug: "agraria-guarapuava",
    title: "Complexo de descarga e amostragem na Cooperativa Agraria",
    client: "Agraria",
    location: "Guarapuava/PR",
    year: 2024,
    application: "cooperativa",
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
    products: ["tombador-12m-fixo", "coletor-amostras"],
    featured: true,
  },
  {
    slug: "cofco-santos",
    title: "Terminal de exportacao COFCO no Porto de Santos",
    client: "Cofco International",
    location: "Santos/SP",
    year: 2023,
    application: "porto",
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
    products: ["tombador-26m-fixo"],
    featured: false,
  },
  {
    slug: "brf-chapeco",
    title: "Linha de descarga e transbordo na BRF Chapeco",
    client: "BRF",
    location: "Chapeco/SC",
    year: 2021,
    application: "industria",
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
    products: ["tombador-21m-fixo"],
    featured: false,
  },
  {
    slug: "lar-medianeira",
    title: "Ampliacao do recebimento na Cooperativa Lar",
    client: "Cooperativa Lar",
    location: "Medianeira/PR",
    year: 2024,
    application: "cooperativa",
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
    products: ["tombador-21m-fixo"],
    featured: false,
  },
  {
    slug: "votorantim-itapeva",
    title: "Tombador heavy-duty para clinquer na Votorantim Cimentos",
    client: "Votorantim Cimentos",
    location: "Itapeva/SP",
    year: 2023,
    application: "cimento",
    summary:
      "Fornecimento de 1 tombador de 12 metros fixo em configuracao heavy-duty para descarga de clinquer e cimento na fabrica da Votorantim Cimentos em Itapeva, processando 60 caminhoes/dia com materiais de alta densidade e abrasividade.",
    content: `A fabrica da Votorantim Cimentos em Itapeva/SP e uma unidade de moagem e ensacamento que recebe clinquer de outras plantas para producao de cimento. O clinquer e um material de alta densidade e abrasividade que exige equipamentos reforçados e com manutencao especifica. Os tombadores convencionais utilizados anteriormente apresentavam desgaste acelerado nas chapas de piso e nos apoios laterais.

A PILI forneceu um tombador de 12 metros em configuracao heavy-duty, com chapas de piso em aco Hardox 450 de 12mm de espessura, apoios laterais reforçados e sistema hidraulico sobredimensionado para operar com cargas de alta densidade. O projeto incluiu cortinas de borracha especiais para conter a poeira de clinquer durante a descarga.

A instalacao foi realizada em uma parada programada de 15 dias, com fundacoes reforçadas em concreto armado para suportar as cargas dinamicas elevadas. O sistema de despoeiramento integrado captura particulas durante todo o ciclo de descarga, atendendo as normas ambientais da CETESB.

Apos 18 meses de operacao, o tombador processa 60 caminhoes/dia com ciclo medio de 70 segundos, totalizando 2.400 toneladas diarias de clinquer e cimento. O desgaste das chapas de piso esta dentro do previsto, com vida util estimada de 8 anos antes da primeira substituicao.`,
    metrics: [
      { label: "caminhoes/dia", value: "60" },
      { label: "ton/dia", value: "2.400" },
      { label: "ciclo medio", value: "70s" },
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
