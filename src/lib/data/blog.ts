export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: "noticia" | "artigo" | "evento" | "lancamento";
  date: string;
  author: string;
  readTime: number;
  featured: boolean;
  image: string;
  tags: string[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "pili-industrial-agrishow-2025",
    title: "PILI Industrial marca presença na Agrishow 2025",
    excerpt:
      "A PILI Industrial participou da Agrishow 2025 em Ribeirão Preto, apresentando sua linha completa de tombadores hidráulicos e as plataformas do ecossistema digital PILI.",
    content: `A PILI Industrial marcou presença na Agrishow 2025, a maior feira de tecnologia agrícola da América Latina, realizada entre 28 de abril e 2 de maio em Ribeirão Preto/SP. O estande da empresa reuniu a linha completa de tombadores hidráulicos, coletores de amostras e as plataformas digitais do ecossistema PILI, atraindo produtores, cooperativas e operadores portuários de todo o Brasil.

Durante os cinco dias de evento, a equipe comercial realizou mais de 300 atendimentos técnicos e fechou contratos para 12 novos equipamentos, incluindo dois tombadores de 30 metros destinados a terminais portuários no Arco Norte. O destaque do estande foi a demonstração ao vivo do PILI Tech, o sistema de gestão de pátio com IoT que monitora filas, tempos de espera e eficiência operacional em tempo real.

"A Agrishow é o momento em que consolidamos relacionamentos com clientes estratégicos e apresentamos as inovações do ano. Em 2025, o foco foi mostrar como nossos equipamentos se integram ao ecossistema digital para entregar não apenas descarga rápida, mas inteligência operacional completa", afirmou o diretor comercial da PILI Industrial.

A participação na feira reforça o posicionamento da PILI como referência em soluções de descarga de grãos, com mais de 45 anos de experiência e presença em 18 países. A próxima parada da empresa será a Expodireto Cotrijal 2026, em Não-Me-Toque/RS.`,
    category: "evento",
    date: "2025-05-05",
    author: "Marketing PILI",
    readTime: 5,
    featured: true,
    image:
      "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1200&h=630&fit=crop",
    tags: ["agrishow", "feira", "tombador hidráulico", "agronegócio"],
  },
  {
    slug: "novo-tombador-30-metros-recorde-capacidade",
    title: "Novo tombador de 30 metros bate recorde de capacidade",
    excerpt:
      "A PILI Industrial lança o tombador hidráulico de 30 metros com capacidade para 100 toneladas, o maior já fabricado pela empresa em seus 45 anos de história.",
    content: `A PILI Industrial anunciou o lançamento do seu novo tombador hidráulico de 30 metros com capacidade para 100 toneladas, estabelecendo um novo recorde na linha de produtos da empresa. O equipamento foi projetado para atender a demanda crescente de terminais portuários e grandes cooperativas que operam com carretas rodotrens e bitrens de alta capacidade.

O novo modelo incorpora um sistema hidráulico de dupla ação com quatro cilindros sincronizados, reduzindo o ciclo de descarga para menos de 40 segundos. A estrutura utiliza aço de alta resistência ASTM A572 Grau 50 com tratamento superficial por jateamento e pintura epóxi de alto desempenho, garantindo vida útil superior a 25 anos em ambiente portuário agressivo.

Entre as inovações técnicas, destaca-se o sistema de pesagem dinâmica integrado à plataforma, que permite verificar o peso da carga durante o processo de descarga sem necessidade de balança rodoviária separada. O equipamento também conta com sensores de posição e inclinação conectados ao PILI Tech, possibilitando monitoramento remoto de performance e manutenção preditiva.

As primeiras duas unidades já foram encomendadas por um terminal portuário no Maranhão e devem entrar em operação no segundo semestre de 2025. O investimento em pesquisa e desenvolvimento para este modelo levou 18 meses e envolveu simulações estruturais em elementos finitos e testes em escala real na planta de Erechim/RS.`,
    category: "lancamento",
    date: "2025-03-18",
    author: "Eng. Carlos Monteiro",
    readTime: 6,
    featured: true,
    image:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&h=630&fit=crop",
    tags: ["tombador", "lançamento", "100 toneladas", "porto"],
  },
  {
    slug: "pili-raste-conformidade-eudr-exportadores",
    title:
      "PILI Raste garante conformidade EUDR para exportadores brasileiros",
    excerpt:
      "A plataforma de rastreabilidade de grãos PILI Raste permite que exportadores brasileiros atendam às exigências do Regulamento Europeu contra Desmatamento.",
    content: `O Regulamento da União Europeia contra o Desmatamento (EUDR), que entra em vigor em dezembro de 2025, exige que exportadores de commodities como soja, café e cacau comprovem que seus produtos não estão associados a áreas desmatadas após dezembro de 2020. A plataforma PILI Raste foi desenvolvida especificamente para atender essa demanda, oferecendo rastreabilidade completa da cadeia produtiva de grãos desde a lavoura até o porto de embarque.

O sistema integra dados de geolocalização das propriedades rurais com imagens de satélite e registros do Cadastro Ambiental Rural (CAR), gerando relatórios de due diligence automatizados que atendem aos requisitos do EUDR. Cada lote de grãos recebe um certificado digital com QR Code que permite rastrear a origem, o transporte e o processamento do produto em toda a cadeia.

"O Brasil é o maior exportador de soja do mundo e precisa demonstrar que sua produção é sustentável. O PILI Raste elimina a complexidade da rastreabilidade e transforma conformidade regulatória em vantagem competitiva", explica a equipe de desenvolvimento da plataforma. Já são mais de 150 propriedades cadastradas em Mato Grosso, Goiás e Paraná, com expectativa de alcançar 500 até o final de 2025.

A plataforma opera em integração nativa com o PILI Tech e o PILI Harbor, permitindo que a rastreabilidade acompanhe o grão desde a colheita, passando pela recepção na cooperativa ou terminal, até o embarque no navio. Essa integração completa posiciona o ecossistema PILI como solução única para conformidade EUDR no agronegócio brasileiro.`,
    category: "noticia",
    date: "2025-02-10",
    author: "Equipe PILI",
    readTime: 7,
    featured: true,
    image:
      "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1200&h=630&fit=crop",
    tags: ["EUDR", "rastreabilidade", "exportação", "sustentabilidade"],
  },
  {
    slug: "como-dimensionar-tombador-ideal",
    title: "Como dimensionar o tombador ideal para sua operação",
    excerpt:
      "Guia técnico completo para escolher o tombador hidráulico correto considerando tipo de veículo, capacidade, ciclo operacional e condições do terreno.",
    content: `Dimensionar corretamente um tombador hidráulico é fundamental para garantir eficiência operacional, segurança e retorno sobre o investimento. A escolha errada pode resultar em gargalos de descarga, desgaste prematuro do equipamento e custos operacionais elevados. Neste artigo, apresentamos os principais critérios técnicos que devem ser considerados.

O primeiro fator é o tipo de veículo predominante na operação. Tombadores de 9 a 12 metros atendem caminhões truck e bi-truck, enquanto modelos de 18 metros são indicados para carretas de três eixos. Para operações portuárias com rodotrens e bitrens, os tombadores de 24 a 30 metros são a escolha adequada. A capacidade nominal do equipamento deve ser dimensionada com margem de 20% acima do peso bruto total combinado (PBTC) máximo dos veículos atendidos.

O ciclo operacional desejado determina a potência do sistema hidráulico e a velocidade de basculamento. Em operações de alta demanda como portos e grandes cooperativas, ciclos abaixo de 60 segundos exigem sistemas hidráulicos de alta vazão com acumuladores de pressão. Já em indústrias com fluxo moderado, ciclos de 90 a 120 segundos podem ser suficientes e representam economia significativa no investimento inicial.

Condições do terreno e infraestrutura existente também influenciam a decisão. Tombadores fixos necessitam de fundação em concreto armado dimensionada para as cargas dinâmicas do basculamento. Modelos móveis sobre rodas oferecem flexibilidade de posicionamento, mas têm capacidade limitada a 60 toneladas. A equipe técnica da PILI Industrial oferece consultoria gratuita para dimensionamento, incluindo visita técnica e análise de fluxo operacional.`,
    category: "artigo",
    date: "2025-01-22",
    author: "Eng. Carlos Monteiro",
    readTime: 8,
    featured: false,
    image:
      "https://images.unsplash.com/photo-1590682680695-43b964a3ae17?w=1200&h=630&fit=crop",
    tags: [
      "tombador",
      "dimensionamento",
      "guia técnico",
      "engenharia",
    ],
  },
  {
    slug: "pili-tech-reduz-tempo-espera-paranagua",
    title: "PILI Tech reduz tempo de espera em 40% no Porto de Paranaguá",
    excerpt:
      "O sistema de gestão de pátio PILI Tech reduziu o tempo médio de espera de caminhões de 4,5 para 2,7 horas no terminal portuário de Paranaguá.",
    content: `O Porto de Paranaguá, um dos maiores complexos portuários do Brasil para exportação de grãos, registrou uma redução de 40% no tempo médio de espera de caminhões após a implantação do sistema PILI Tech em seu principal terminal de descarga. O tempo médio caiu de 4 horas e 30 minutos para 2 horas e 42 minutos, impactando diretamente a eficiência logística e os custos de transporte.

O PILI Tech utiliza sensores IoT instalados nos tombadores, balanças e pontos de controle do pátio para monitorar em tempo real o fluxo de veículos, tempos de ciclo e status de cada equipamento. Algoritmos de otimização distribuem automaticamente os caminhões entre as linhas de descarga disponíveis, evitando gargalos e ociosidade simultânea de equipamentos.

O painel de controle permite que gestores do terminal visualizem indicadores como taxa de ocupação, tempo médio de ciclo, previsão de filas e alertas de manutenção preventiva. Relatórios automatizados são gerados diariamente e enviados por e-mail para a diretoria de operações, facilitando a tomada de decisão baseada em dados.

"Antes do PILI Tech, a gestão do pátio era feita visualmente, com rádio e prancheta. Hoje temos visibilidade completa da operação em tempo real e conseguimos antecipar problemas antes que eles gerem filas. A redução de 40% no tempo de espera representou economia de mais de R$ 2 milhões por safra em custos de demurrage e estadias de caminhões", relatou o gerente de operações do terminal.`,
    category: "noticia",
    date: "2024-11-15",
    author: "Equipe PILI",
    readTime: 6,
    featured: false,
    image:
      "https://images.unsplash.com/photo-1494412574643-ff11b0a5eb19?w=1200&h=630&fit=crop",
    tags: ["PILI Tech", "IoT", "porto", "logística", "Paranaguá"],
  },
  {
    slug: "pili-store-2000-pecas-catalogo",
    title: "PILI Store ultrapassa 2.000 peças no catálogo online",
    excerpt:
      "A loja virtual PILI Store atinge a marca de 2.000 peças de reposição no catálogo, com entrega para todo o Brasil e rastreamento integrado.",
    content: `A PILI Store, plataforma de e-commerce para peças de reposição de equipamentos PILI Industrial, ultrapassou a marca de 2.000 itens disponíveis no catálogo online. A loja oferece desde componentes hidráulicos como cilindros, válvulas e mangueiras até peças estruturais, sensores e kits de manutenção preventiva para toda a linha de tombadores e coletores de amostras.

O crescimento do catálogo reflete a estratégia da PILI de digitalizar o atendimento pós-venda e reduzir o tempo de resposta para clientes que necessitam de peças de reposição com urgência. A plataforma conta com busca inteligente por modelo do equipamento, número de série e código da peça, além de recomendações automáticas de componentes relacionados e kits de manutenção programada.

"Nossos clientes operam equipamentos críticos que não podem ficar parados. A PILI Store garante que qualquer peça de reposição esteja a poucos cliques de distância, com prazo de entrega de 24 a 72 horas para as principais capitais do Brasil", destaca a equipe de pós-venda da empresa.

A loja já registrou mais de 5.000 pedidos desde o lançamento e mantém índice de satisfação de 4,8 de 5 estrelas. Os próximos passos incluem integração com o PILI Tech para pedidos automáticos de peças baseados em alertas de manutenção preditiva, e expansão do catálogo para equipamentos de terceiros compatíveis com a linha PILI.`,
    category: "noticia",
    date: "2024-09-20",
    author: "Marketing PILI",
    readTime: 4,
    featured: false,
    image:
      "https://images.unsplash.com/photo-1553413077-190dd305871c?w=1200&h=630&fit=crop",
    tags: ["PILI Store", "e-commerce", "peças de reposição", "pós-venda"],
  },
  {
    slug: "tendencias-logistica-graos-2025",
    title: "Tendências em logística de grãos para 2025",
    excerpt:
      "Análise das principais tendências que estão transformando a logística de grãos no Brasil: automação, rastreabilidade, descarbonização e infraestrutura multimodal.",
    content: `O Brasil consolidou-se como o maior exportador mundial de soja e um dos principais fornecedores globais de milho, café e algodão. Com safras que superam 300 milhões de toneladas anuais, a logística de grãos enfrenta desafios crescentes de escala, eficiência e sustentabilidade. Identificamos quatro tendências que devem moldar o setor em 2025 e nos próximos anos.

A primeira é a automação completa dos processos de recebimento e descarga. Tombadores hidráulicos com sensores IoT, balanças dinâmicas integradas e sistemas de amostragem automática eliminam processos manuais e reduzem o ciclo de descarga de minutos para segundos. Cooperativas e terminais que adotaram automação reportam ganhos de produtividade entre 30% e 50%, além de redução significativa de erros humanos na classificação de grãos.

A segunda tendência é a rastreabilidade de ponta a ponta, impulsionada por regulamentações como o EUDR europeu e exigências crescentes de compradores internacionais. Plataformas digitais que rastreiam o grão desde a propriedade rural até o porto de embarque deixaram de ser diferencial para se tornarem requisito obrigatório de acesso a mercados premium.

A terceira e quarta tendências convergem: descarbonização da cadeia logística e expansão da infraestrutura multimodal. O investimento em ferrovias como a Ferrogrão e a expansão de terminais hidroviários no Arco Norte prometem reduzir a dependência do transporte rodoviário, enquanto equipamentos elétricos e híbridos começam a substituir sistemas puramente diesel em terminais de descarga. A PILI Industrial já desenvolve versões com acionamento elétrico para toda a sua linha de tombadores, alinhada a essa tendência global.`,
    category: "artigo",
    date: "2024-08-05",
    author: "Eng. Carlos Monteiro",
    readTime: 7,
    featured: false,
    image:
      "https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?w=1200&h=630&fit=crop",
    tags: [
      "logística",
      "tendências",
      "agronegócio",
      "automação",
      "sustentabilidade",
    ],
  },
  {
    slug: "pili-harbor-gestao-patio-inteligente-iot",
    title: "PILI Harbor: gestão de pátio inteligente com IoT",
    excerpt:
      "Conheça o PILI Harbor, a plataforma de gestão de pátio que integra IoT, visão computacional e inteligência artificial para otimizar operações de terminais graneleiros.",
    content: `A PILI Industrial lançou o PILI Harbor, sua mais nova plataforma digital voltada para a gestão inteligente de pátios em terminais graneleiros, cooperativas e indústrias. O sistema combina sensores IoT, câmeras com visão computacional e algoritmos de inteligência artificial para oferecer controle total sobre o fluxo de veículos, alocação de recursos e eficiência operacional.

O PILI Harbor mapeia digitalmente todo o pátio de operações, identificando automaticamente veículos por placa e RFID, direcionando caminhões para filas de descarga otimizadas e monitorando o status de cada equipamento em tempo real. O módulo de previsão de demanda utiliza dados históricos e informações de safra para antecipar picos de movimento e sugerir escalas de operação adequadas.

A integração com o PILI Tech e o PILI Raste cria um ecossistema completo: o Harbor gerencia o pátio, o Tech monitora os equipamentos de descarga e o Raste garante a rastreabilidade do grão. Juntas, as três plataformas eliminam processos manuais, reduzem tempos de espera e geram dados que transformam a operação logística de reativa para preditiva.

O sistema já opera em fase piloto em três terminais no Paraná e Mato Grosso do Sul, com resultados iniciais que indicam redução de 35% no tempo de permanência de veículos no pátio e aumento de 25% na utilização dos equipamentos de descarga. O lançamento comercial está previsto para o primeiro trimestre de 2025, com planos de assinatura mensal que incluem hardware IoT, software e suporte técnico 24/7.`,
    category: "lancamento",
    date: "2024-07-12",
    author: "Equipe PILI",
    readTime: 5,
    featured: false,
    image:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&h=630&fit=crop&q=80",
    tags: [
      "PILI Harbor",
      "IoT",
      "gestão de pátio",
      "inteligência artificial",
    ],
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}

export function getFeaturedPosts(): BlogPost[] {
  return BLOG_POSTS.filter((post) => post.featured);
}

export function getPostsByCategory(category: string): BlogPost[] {
  if (category === "todos") return BLOG_POSTS;
  return BLOG_POSTS.filter((post) => post.category === category);
}
