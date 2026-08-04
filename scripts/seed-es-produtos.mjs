/**
 * Semeia as traduções em espanhol dos produtos e dos seus diferenciais.
 *
 * O schema já previa `ProductTranslation`/`Feature` por locale, mas só existia
 * a linha `pt_BR` — o site em espanhol caía no fallback e mostrava tudo em
 * português. Este script grava a versão `es` de cada produto; a partir daí o
 * conteúdo é editável no painel como qualquer outro.
 *
 * Idempotente: usa upsert pela chave (productId, locale) e, nos diferenciais,
 * pela ordem dentro do produto.
 *
 *   node scripts/seed-es-produtos.mjs
 */
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

/** Traduções por slug de produto. */
const PRODUTOS = {
  "tombador-10m-fixo": {
    name: "Volcador 10 metros fijo",
    tagline: "Rendimiento comprobado para operaciones de entrada",
    description:
      "Plataforma de descarga fija de 10 metros con capacidad para 45 toneladas. Ideal para cooperativas pequeñas y establecimientos rurales que necesitan un ciclo rápido con camiones convencionales.",
  },
  "tombador-11m-fixo": {
    name: "Volcador 11 metros fijo",
    tagline: "El estándar regional para cooperativas de granos",
    description:
      "Plataforma de descarga fija de 11 metros con capacidad para 50 toneladas. Dimensión estándar para cooperativas regionales que reciben camiones y bitrenes, con equilibrio entre costo y capacidad.",
  },
  "tombador-12m-fixo": {
    name: "Volcador 12 metros fijo",
    tagline: "Capacidad ampliada para bitrenes y composiciones estándar",
    description:
      "Plataforma de descarga fija de 12 metros con capacidad para 55 toneladas. Diseñado para operar con bitrenes y composiciones camión-acoplado estándar, atendiendo cooperativas e industrias de mediano porte.",
  },
  "tombador-18m-fixo": {
    name: "Volcador 18 metros fijo",
    tagline: "Diseñado para trenes de carretera y operaciones de alto flujo",
    description:
      "Plataforma de descarga fija de 18 metros con capacidad para 70 toneladas. Dimensionado para trenes de carretera, ideal para grandes cooperativas y terminales con alta demanda de recepción.",
  },
  "tombador-21m-fixo": {
    name: "Volcador 21 metros fijo",
    tagline: "Gran porte para terminales portuarias y cooperativas de escala",
    description:
      "Plataforma de descarga fija de 21 metros con capacidad para 80 toneladas. Diseñado para grandes trenes de carretera en operaciones portuarias y cooperativas de gran escala que demandan alta capacidad.",
  },
  "tombador-26m-fixo": {
    name: "Volcador 26 metros fijo",
    tagline: "Operación pesada para terminales graneleras de gran porte",
    description:
      "Plataforma de descarga fija de 26 metros con capacidad para 90 toneladas. Diseñado para operaciones portuarias pesadas con configuraciones de múltiples ejes y composiciones especiales.",
  },
  "tombador-30m-fixo": {
    name: "Volcador 30 metros fijo",
    tagline: "El mayor volcador hidráulico del mercado brasileño",
    description:
      "Plataforma de descarga fija de 30 metros con capacidad para 100 toneladas. El volcador de mayor porte de América Latina, diseñado para las mayores terminales portuarias y operaciones con los mayores trenes de carretera del mercado.",
  },
  "tombador-cabine-externa": {
    name: "Volcador con cabina externa",
    tagline: "Operación segura con cabina cerrada conforme a NR-12",
    description:
      "Volcador fijo de 12 metros equipado con cabina externa de operación cerrada. Ofrece máxima seguridad al operador, con visión panorámica y confort térmico, en total conformidad con la NR-12.",
  },
  "tombador-10m-movel": {
    name: "Volcador 10 metros móvil",
    tagline: "Movilidad y rapidez para operaciones estacionales",
    description:
      "Volcador móvil de 10 metros con capacidad para 40 toneladas. Puede transportarse y reinstalarse entre distintas unidades, ideal para operaciones estacionales y puntos temporales de recepción.",
  },
  "tombador-11m-movel": {
    name: "Volcador 11 metros móvil",
    tagline: "Estándar móvil para flotas de alquiler y cosecha",
    description:
      "Volcador móvil de 11 metros con capacidad para 45 toneladas. Dimensión estándar para operaciones estacionales, flotas de alquiler y puntos temporales de recepción de granos.",
  },
  "tombador-12m-movel": {
    name: "Volcador 12 metros móvil",
    tagline: "Capacidad para bitrenes con total portabilidad",
    description:
      "Volcador móvil de 12 metros con capacidad para 50 toneladas. Combina la capacidad de recibir bitrenes con la flexibilidad de reubicación entre unidades operativas.",
  },
  "tombador-18m-movel": {
    name: "Volcador 18 metros móvil",
    tagline: "Gran porte móvil para trenes de carretera itinerantes",
    description:
      "Volcador móvil de 18 metros con capacidad para 65 toneladas. Unidad de gran porte con movilidad, diseñada para operar con trenes de carretera en puntos temporales de recepción.",
  },
  "tombador-21m-movel": {
    name: "Volcador 21 metros móvil",
    tagline: "El mayor volcador móvil del mercado nacional",
    description:
      "Volcador móvil de 21 metros con capacidad para 75 toneladas. La mayor unidad móvil disponible en el mercado, que combina capacidad de gran porte con la flexibilidad de operar de forma temporal en distintos lugares.",
  },
  "coletor-amostras": {
    name: "Colector de muestras de granos PILI",
    tagline: "Muestreo neumático preciso conforme a los estándares MAPA y CONAB",
    description:
      "Sistema neumático de toma de muestras de granos con profundidad de hasta 2,5 metros. Garantiza un muestreo representativo y trazable, conforme a los estándares del MAPA y de la CONAB para la clasificación de granos.",
  },
  "unidade-transbordo": {
    name: "Unidad de trasbordo PILI",
    tagline: "Logística intermodal ágil para el trasbordo de granos entre vehículos",
    description:
      "Unidad de trasbordo con capacidad de 40 toneladas por ciclo para la transferencia de granos entre vehículos. Solución esencial para la logística intermodal, que permite un trasbordo rápido en puntos estratégicos de la cadena.",
  },
  "rachador-lenha-50t": {
    name: "Astilladora de leña 50 toneladas",
    tagline: "Fuerza hidráulica de 50 toneladas para procesar biomasa",
    description:
      "Astilladora de leña industrial con fuerza de 50 toneladas y ciclo de aproximadamente 15 segundos. Diseñada para el procesamiento de biomasa y leña destinada a la generación de energía en calderas industriales.",
  },
  "prensa-hidraulica": {
    name: "Prensa hidráulica 60-200 toneladas",
    tagline: "Prensa industrial configurable de 60 a 200 toneladas de fuerza",
    description:
      "Prensa hidráulica multipropósito con fuerza configurable de 60 a 200 toneladas. Solución versátil para conformado, estampado y diversos procesos industriales con alta precisión y repetibilidad.",
  },
  "central-hidraulica": {
    name: "Central hidráulica PILI",
    tagline: "Unidades hidráulicas a medida para cualquier aplicación industrial",
    description:
      "Centrales hidráulicas diseñadas y fabricadas a medida para atender demandas específicas de presión, caudal y control. Solución completa, desde el dimensionamiento hasta la instalación y la puesta en marcha.",
  },
};

/** Diferenciais, indexados pelo título em português. */
const FEATURES = {
  "Ciclo rapido": {
    title: "Ciclo rápido",
    description:
      "Descarga completa en aproximadamente 60 segundos, garantizando alta productividad incluso en operaciones compactas.",
  },
  "Instalacao simplificada": {
    title: "Instalación simplificada",
    description:
      "Fundación reducida y montaje rápido, lo que permite iniciar la operación en pocas semanas.",
  },
  "Seguranca NR-12": {
    title: "Seguridad NR-12",
    description:
      "Diseño conforme a NR-12 y NR-10, con sensores de presencia y alarmas de operación.",
  },
  "Versatilidade de frota": {
    title: "Versatilidad de flota",
    description:
      "Admite camiones y bitrenes convencionales, cubriendo la mayoría de las flotas regionales.",
  },
  "Custo-beneficio otimizado": {
    title: "Costo-beneficio optimizado",
    description:
      "La mejor relación inversión/capacidad para cooperativas de mediano porte.",
  },
  "Automacao integrada": {
    title: "Automatización integrada",
    description:
      "PLC con HMI táctil para el control preciso del ciclo de descarga.",
  },
  "Motor de alta potencia": {
    title: "Motor de alta potencia",
    description:
      "El motor de 100 CV garantiza un ciclo estable incluso con cargas máximas de 55 toneladas.",
  },
  "Estrutura reforcada": {
    title: "Estructura reforzada",
    description:
      "Acero ASTM A572 Gr.50 con tratamiento anticorrosivo por arenado y pintura epoxi.",
  },
  "Operacao continua": {
    title: "Operación continua",
    description:
      "Diseñado para operación 24/7 con intervalos mínimos de mantenimiento preventivo.",
  },
  "Manutencao facilitada": {
    title: "Mantenimiento facilitado",
    description:
      "Acceso simplificado a todos los componentes hidráulicos y eléctricos para una intervención rápida.",
  },
  "Capacidade para rodotrens": {
    title: "Capacidad para trenes de carretera",
    description:
      "Los 18 metros de longitud admiten trenes de carretera y composiciones largas sin restricciones.",
  },
  "Motor de 150 CV": {
    title: "Motor de 150 CV",
    description:
      "Potencia robusta para ciclos rápidos incluso con 70 toneladas de carga.",
  },
  "Sistema hidraulico redundante": {
    title: "Sistema hidráulico redundante",
    description:
      "Doble circuito hidráulico con válvulas de seguridad para una operación ininterrumpida.",
  },
  "Automacao avancada": {
    title: "Automatización avanzada",
    description:
      "PLC Siemens con HMI táctil, control de rampa y sensores de posición integrados.",
  },
  "Alta capacidade": {
    title: "Alta capacidad",
    description:
      "80 toneladas de capacidad nominal para los mayores trenes de carretera en operación.",
  },
  "Ciclo otimizado": {
    title: "Ciclo optimizado",
    description:
      "Descarga completa en aproximadamente 75 segundos con motor de 200 CV.",
  },
  "Resistencia a corrosao": {
    title: "Resistencia a la corrosión",
    description:
      "Arenado SA 2.5 con pintura epoxi de alto espesor para ambientes portuarios agresivos.",
  },
  "Instalacao modular": {
    title: "Instalación modular",
    description:
      "Transporte en módulos premontados para una instalación rápida en hasta 45 días.",
  },
  "Versatilidade de eixos": {
    title: "Versatilidad de ejes",
    description:
      "Admite configuraciones de múltiples ejes, incluidos semirremolques especiales de 26 metros.",
  },
  "Potencia industrial": {
    title: "Potencia industrial",
    description:
      "Motor de 250 CV para el movimiento seguro de cargas de hasta 90 toneladas.",
  },
  "Seguranca reforcada": {
    title: "Seguridad reforzada",
    description:
      "Sistemas redundantes de seguridad conforme a NR-12 y NR-10 para operación crítica.",
  },
  "Durabilidade comprovada": {
    title: "Durabilidad comprobada",
    description:
      "Estructura en acero de alta resistencia con vida útil proyectada para más de 20 años.",
  },
  "Capacidade maxima": {
    title: "Capacidad máxima",
    description:
      "100 toneladas de capacidad nominal: el volcador de mayor porte del mercado latinoamericano.",
  },
  "Motor de 300 CV": {
    title: "Motor de 300 CV",
    description:
      "Potencia excepcional para ciclos de descarga completa en aproximadamente 90 segundos.",
  },
  "Aco de alta resistencia": {
    title: "Acero de alta resistencia",
    description:
      "Estructura en acero ASTM A572 Gr.50 con tratamiento anticorrosivo por arenado y pintura epoxi.",
  },
  "Automacao de ponta": {
    title: "Automatización de punta",
    description:
      "PLC Siemens con HMI táctil, control de rampa, sensores de posición y alarmas de seguridad.",
  },
  "Manutencao simplificada": {
    title: "Mantenimiento simplificado",
    description:
      "Acceso facilitado a todos los componentes hidráulicos y eléctricos. Soporte técnico 24 h.",
  },
  "Cabine de seguranca": {
    title: "Cabina de seguridad",
    description:
      "Cabina externa cerrada y climatizada con visión panorámica de toda el área de descarga.",
  },
  "Conformidade total NR-12": {
    title: "Conformidad total NR-12",
    description:
      "Diseño íntegramente conforme a NR-12 y NR-10, con PLC de seguridad dedicados.",
  },
  "Conforto do operador": {
    title: "Confort del operador",
    description:
      "Cabina con aire acondicionado, asiento ergonómico y panel de control integrado.",
  },
  "Operacao protegida": {
    title: "Operación protegida",
    description:
      "Operador aislado del polvo, el ruido y la intemperie, lo que aumenta la productividad y la seguridad.",
  },
  "Mobilidade total": {
    title: "Movilidad total",
    description:
      "Estructura diseñada para el transporte carretero y la reinstalación rápida entre unidades.",
  },
  "Instalacao rapida": {
    title: "Instalación rápida",
    description:
      "No requiere fundación especial: operativo en pocos días tras llegar al lugar.",
  },
  "Resistencia de tombador fixo": {
    title: "Resistencia de volcador fijo",
    description:
      "La misma calidad estructural de los modelos fijos, con acero ASTM A572 Gr.50.",
  },
  "Ideal para locacao": {
    title: "Ideal para alquiler",
    description:
      "Estructura móvil dimensionada para flotas de alquiler en períodos de cosecha.",
  },
  "Versatilidade operacional": {
    title: "Versatilidad operativa",
    description:
      "Admite camiones y bitrenes convencionales con un ciclo de aproximadamente 65 segundos.",
  },
  "Transporte facilitado": {
    title: "Transporte facilitado",
    description:
      "Dimensiones compatibles con el transporte carretero sin necesidad de escolta especial.",
  },
  "Motor de 100 CV": {
    title: "Motor de 100 CV",
    description:
      "Potencia suficiente para la descarga rápida de bitrenes de hasta 50 toneladas.",
  },
  "Relocacao entre safras": {
    title: "Reubicación entre cosechas",
    description:
      "Puede desmontarse y remontarse en otra localidad según la demanda estacional.",
  },
  "Automacao padrao PILI": {
    title: "Automatización estándar PILI",
    description:
      "El mismo sistema de automatización y seguridad de los volcadores fijos de la línea.",
  },
  "Rodotrens em campo": {
    title: "Trenes de carretera en campo",
    description:
      "Capacidad para recibir trenes de carretera directamente en puntos temporales de cosecha.",
  },
  "Estrutura transportavel": {
    title: "Estructura transportable",
    description:
      "Diseñado en módulos para el transporte carretero y el montaje rápido en campo.",
  },
  "Seguranca integral": {
    title: "Seguridad integral",
    description:
      "Todos los dispositivos de seguridad NR-12, incluso en configuración móvil.",
  },
  "Maior movel do mercado": {
    title: "El mayor móvil del mercado",
    description:
      "75 toneladas de capacidad en configuración móvil: único en el mercado brasileño.",
  },
  "Motor de 200 CV": {
    title: "Motor de 200 CV",
    description:
      "Potencia excepcional para mover los mayores trenes de carretera con un ciclo de 80 segundos.",
  },
  "Modularidade avancada": {
    title: "Modularidad avanzada",
    description:
      "Sistema modular que permite el transporte en semirremolques convencionales y el montaje en campo.",
  },
  "Automacao completa": {
    title: "Automatización completa",
    description:
      "PLC con HMI táctil, sensores de posición y sistema de seguridad integrado.",
  },
  "Amostragem representativa": {
    title: "Muestreo representativo",
    description:
      "Toma en múltiples puntos y profundidades de la carga, lo que garantiza una muestra fiel al lote completo.",
  },
  "Conformidade MAPA/CONAB": {
    title: "Conformidad MAPA/CONAB",
    description:
      "Diseñado para cumplir íntegramente las normas de clasificación y muestreo de granos.",
  },
  "Rastreabilidade total": {
    title: "Trazabilidad total",
    description:
      "Cada muestra queda vinculada a la patente, la factura y el lote mediante RFID o código QR.",
  },
  "Integracao com tombadores": {
    title: "Integración con volcadores",
    description:
      "Se conecta directamente a los volcadores PILI para un flujo automatizado de muestreo durante la descarga.",
  },
  "Transbordo rapido": {
    title: "Trasbordo rápido",
    description:
      "Transferencia de 40 toneladas por ciclo entre vehículos de distintos portes.",
  },
  "Logistica intermodal": {
    title: "Logística intermodal",
    description:
      "Permite el trasbordo entre camiones, vagones y otros vehículos en puntos estratégicos.",
  },
  Portabilidade: {
    title: "Portabilidad",
    description:
      "Unidad transportable que puede posicionarse en distintos puntos de la cadena logística.",
  },
  "Robustez industrial": {
    title: "Robustez industrial",
    description:
      "Estructura en acero de alta resistencia para operación continua en ambientes severos.",
  },
  "Forca de 50 toneladas": {
    title: "Fuerza de 50 toneladas",
    description:
      "Capacidad para procesar troncos de gran diámetro con facilidad y seguridad.",
  },
  "Aplicacao em biomassa": {
    title: "Aplicación en biomasa",
    description:
      "Ideal para preparar leña destinada a calderas industriales y generación de energía.",
  },
  "Forca configuravel": {
    title: "Fuerza configurable",
    description:
      "De 60 a 200 toneladas según la necesidad de la aplicación industrial.",
  },
  Multiproposito: {
    title: "Multipropósito",
    description:
      "Conformado, estampado, plegado y demás procesos industriales con alta precisión.",
  },
  "Seguranca integrada": {
    title: "Seguridad integrada",
    description:
      "Mandos bimanuales, cortinas de luz y PLC de seguridad conforme a NR-12.",
  },
  "Projeto sob medida": {
    title: "Proyecto a medida",
    description:
      "Cada central se dimensiona específicamente para la aplicación del cliente.",
  },
  "Componentes de primeira linha": {
    title: "Componentes de primera línea",
    description:
      "Bombas, válvulas y filtros de fabricantes reconocidos, con garantía de desempeño.",
  },
  "Comissionamento incluso": {
    title: "Puesta en marcha incluida",
    description:
      "Servicio completo de instalación, arranque y capacitación operativa en el lugar.",
  },
};

async function main() {
  const produtos = await db.product.findMany({
    select: {
      id: true,
      slug: true,
      features: {
        where: { locale: "pt_BR" },
        select: { title: true, description: true, icon: true, order: true },
      },
    },
  });

  let traduzidos = 0;
  let semTraducao = [];
  let features = 0;
  const faltandoFeature = new Set();

  for (const p of produtos) {
    const es = PRODUTOS[p.slug];
    if (!es) {
      semTraducao.push(p.slug);
      continue;
    }

    await db.productTranslation.upsert({
      where: { productId_locale: { productId: p.id, locale: "es" } },
      update: es,
      create: { productId: p.id, locale: "es", ...es },
    });
    traduzidos++;

    for (const f of p.features) {
      const traducao = FEATURES[f.title];
      if (!traducao) {
        faltandoFeature.add(f.title);
        continue;
      }

      // `Feature` não tem chave única composta; a identidade prática é
      // (produto, locale, ordem).
      const existente = await db.feature.findFirst({
        where: { productId: p.id, locale: "es", order: f.order },
        select: { id: true },
      });

      const dados = {
        title: traducao.title,
        description: traducao.description,
        icon: f.icon,
        order: f.order,
      };

      if (existente) {
        await db.feature.update({ where: { id: existente.id }, data: dados });
      } else {
        await db.feature.create({
          data: { productId: p.id, locale: "es", ...dados },
        });
      }
      features++;
    }
  }

  console.log(`produtos traduzidos: ${traduzidos}/${produtos.length}`);
  console.log(`diferenciais traduzidos: ${features}`);
  if (semTraducao.length) console.log("sem tradução:", semTraducao.join(", "));
  if (faltandoFeature.size)
    console.log("diferenciais sem tradução:", [...faltandoFeature].join(" | "));
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
