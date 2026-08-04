/**
 * Semeia as traduções em espanhol dos artigos do blog.
 *
 * Fecha o conjunto iniciado por `seed-es-produtos.mjs` e `seed-es-obras.mjs`.
 * Idempotente: upsert pela chave (postId, locale).
 *
 *   node scripts/seed-es-blog.mjs
 */
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const ARTIGOS = {
  "pili-industrial-agrishow-2025": {
    title: "PILI Industrial marca presencia en Agrishow 2025",
    excerpt:
      "PILI Industrial participó de Agrishow 2025 en Ribeirão Preto, presentando su línea completa de volcadores hidráulicos y las plataformas del ecosistema digital PILI.",
    content: `PILI Industrial marcó presencia en Agrishow 2025, la mayor feria de tecnología agrícola de América Latina, realizada entre el 28 de abril y el 2 de mayo en Ribeirão Preto/SP. El stand de la empresa reunió la línea completa de volcadores hidráulicos, colectores de muestras y las plataformas digitales del ecosistema PILI, atrayendo a productores, cooperativas y operadores portuarios de todo Brasil.

Durante los cinco días del evento, el equipo comercial realizó más de 300 atenciones técnicas y cerró contratos por 12 nuevos equipos, incluidos dos volcadores de 30 metros destinados a terminales portuarias del Arco Norte. El destaque del stand fue la demostración en vivo de PILI Tech, el sistema de gestión de patio con IoT que monitorea filas, tiempos de espera y eficiencia operativa en tiempo real.

“Agrishow es el momento en que consolidamos relaciones con clientes estratégicos y presentamos las innovaciones del año. En 2025, el foco fue mostrar cómo nuestros equipos se integran al ecosistema digital para entregar no solo una descarga rápida, sino inteligencia operativa completa”, afirmó el director comercial de PILI Industrial.

La participación en la feria refuerza el posicionamiento de PILI como referencia en soluciones de descarga de granos, con más de 45 años de experiencia y presencia en 18 países. La próxima parada de la empresa será Expodireto Cotrijal 2026, en Não-Me-Toque/RS.`,
  },
  "novo-tombador-30-metros-recorde-capacidade": {
    title: "Nuevo volcador de 30 metros bate récord de capacidad",
    excerpt:
      "PILI Industrial lanza el volcador hidráulico de 30 metros con capacidad para 100 toneladas, el mayor fabricado por la empresa en sus 45 años de historia.",
    content: `PILI Industrial anunció el lanzamiento de su nuevo volcador hidráulico de 30 metros con capacidad para 100 toneladas, estableciendo un nuevo récord en la línea de productos de la empresa. El equipo fue diseñado para atender la creciente demanda de terminales portuarias y grandes cooperativas que operan con trenes de carretera y bitrenes de alta capacidad.

El nuevo modelo incorpora un sistema hidráulico de doble acción con cuatro cilindros sincronizados, lo que reduce el ciclo de descarga a menos de 40 segundos. La estructura utiliza acero de alta resistencia ASTM A572 Grado 50 con tratamiento superficial por arenado y pintura epoxi de alto desempeño, lo que garantiza una vida útil superior a 25 años en ambiente portuario agresivo.

Entre las innovaciones técnicas se destaca el sistema de pesaje dinámico integrado a la plataforma, que permite verificar el peso de la carga durante el proceso de descarga sin necesidad de una báscula camionera separada. El equipo también cuenta con sensores de posición e inclinación conectados a PILI Tech, lo que posibilita el monitoreo remoto de desempeño y el mantenimiento predictivo.

Las primeras dos unidades ya fueron encargadas por una terminal portuaria en Maranhão y deben entrar en operación en el segundo semestre de 2025. La inversión en investigación y desarrollo de este modelo llevó 18 meses e involucró simulaciones estructurales por elementos finitos y ensayos a escala real en la planta de Erechim/RS.`,
  },
  "pili-raster-conformidade-eudr-exportadores": {
    title: "PILI Raster garantiza conformidad EUDR para exportadores brasileños",
    excerpt:
      "La plataforma de trazabilidad de granos PILI Raster permite que los exportadores brasileños cumplan las exigencias del Reglamento Europeo contra la Deforestación.",
    content: `El Reglamento de la Unión Europea contra la Deforestación (EUDR), que entra en vigor en diciembre de 2025, exige que los exportadores de commodities como soja, café y cacao comprueben que sus productos no están asociados a áreas deforestadas después de diciembre de 2020. La plataforma PILI Raster fue desarrollada específicamente para atender esa demanda, ofreciendo trazabilidad completa de la cadena productiva de granos desde el campo hasta el puerto de embarque.

El sistema integra datos de geolocalización de los establecimientos rurales con imágenes satelitales y registros del Catastro Ambiental Rural (CAR), y genera informes de debida diligencia automatizados que cumplen los requisitos del EUDR. Cada lote de granos recibe un certificado digital con código QR que permite rastrear el origen, el transporte y el procesamiento del producto en toda la cadena.

“Brasil es el mayor exportador de soja del mundo y necesita demostrar que su producción es sostenible. PILI Raster elimina la complejidad de la trazabilidad y convierte la conformidad regulatoria en ventaja competitiva”, explica el equipo de desarrollo de la plataforma. Ya son más de 150 establecimientos registrados en Mato Grosso, Goiás y Paraná, con la expectativa de alcanzar 500 hacia finales de 2025.

La plataforma opera en integración nativa con PILI Tech y PILI Harbor, lo que permite que la trazabilidad acompañe al grano desde la cosecha, pasando por la recepción en la cooperativa o terminal, hasta el embarque en el buque. Esa integración completa posiciona al ecosistema PILI como solución única para la conformidad EUDR en el agronegocio brasileño.`,
  },
  "como-dimensionar-tombador-ideal": {
    title: "Cómo dimensionar el volcador ideal para su operación",
    excerpt:
      "Guía técnica completa para elegir el volcador hidráulico correcto considerando tipo de vehículo, capacidad, ciclo operativo y condiciones del terreno.",
    content: `Dimensionar correctamente un volcador hidráulico es fundamental para garantizar eficiencia operativa, seguridad y retorno sobre la inversión. Una elección equivocada puede derivar en cuellos de botella de descarga, desgaste prematuro del equipo y altos costos operativos. En este artículo presentamos los principales criterios técnicos que deben considerarse.

El primer factor es el tipo de vehículo predominante en la operación. Los volcadores de 9 a 12 metros atienden camiones simples y bitrenes cortos, mientras que los modelos de 18 metros están indicados para semirremolques de tres ejes. Para operaciones portuarias con trenes de carretera y bitrenes, los volcadores de 24 a 30 metros son la elección adecuada. La capacidad nominal del equipo debe dimensionarse con un margen del 20 % por encima del peso bruto total combinado máximo de los vehículos atendidos.

El ciclo operativo deseado determina la potencia del sistema hidráulico y la velocidad de basculamiento. En operaciones de alta demanda, como puertos y grandes cooperativas, los ciclos por debajo de 60 segundos exigen sistemas hidráulicos de alto caudal con acumuladores de presión. En industrias con flujo moderado, en cambio, ciclos de 90 a 120 segundos pueden ser suficientes y representan un ahorro significativo en la inversión inicial.

Las condiciones del terreno y la infraestructura existente también influyen en la decisión. Los volcadores fijos requieren una fundación en hormigón armado dimensionada para las cargas dinámicas del basculamiento. Los modelos móviles sobre ruedas ofrecen flexibilidad de posicionamiento, pero tienen una capacidad limitada a 60 toneladas. El equipo técnico de PILI Industrial ofrece asesoría gratuita de dimensionamiento, con visita técnica y análisis del flujo operativo.`,
  },
  "pili-tech-reduz-tempo-espera-paranagua": {
    title: "PILI Tech reduce el tiempo de espera un 40 % en el Puerto de Paranaguá",
    excerpt:
      "El sistema de gestión de patio PILI Tech redujo el tiempo medio de espera de los camiones de 4,5 a 2,7 horas en la terminal portuaria de Paranaguá.",
    content: `El Puerto de Paranaguá, uno de los mayores complejos portuarios de Brasil para la exportación de granos, registró una reducción del 40 % en el tiempo medio de espera de los camiones tras la implantación del sistema PILI Tech en su principal terminal de descarga. El tiempo medio bajó de 4 horas y 30 minutos a 2 horas y 42 minutos, con impacto directo en la eficiencia logística y en los costos de transporte.

PILI Tech utiliza sensores IoT instalados en los volcadores, las básculas y los puntos de control del patio para monitorear en tiempo real el flujo de vehículos, los tiempos de ciclo y el estado de cada equipo. Algoritmos de optimización distribuyen automáticamente los camiones entre las líneas de descarga disponibles, evitando cuellos de botella y la ociosidad simultánea de equipos.

El panel de control permite que los gestores de la terminal visualicen indicadores como tasa de ocupación, tiempo medio de ciclo, previsión de filas y alertas de mantenimiento preventivo. Se generan informes automatizados diariamente y se envían por correo electrónico a la dirección de operaciones, lo que facilita la toma de decisiones basada en datos.

“Antes de PILI Tech, la gestión del patio se hacía visualmente, con radio y planilla en mano. Hoy tenemos visibilidad completa de la operación en tiempo real y logramos anticipar problemas antes de que generen filas. La reducción del 40 % en el tiempo de espera representó un ahorro de más de 2 millones de reales por cosecha en costos de demoras y estadías de camiones”, relató el gerente de operaciones de la terminal.`,
  },
  "pili-store-2000-pecas-catalogo": {
    title: "PILI Store supera las 2.000 piezas en el catálogo online",
    excerpt:
      "La tienda virtual PILI Store alcanza la marca de 2.000 repuestos en el catálogo, con entrega a todo Brasil y seguimiento integrado.",
    content: `PILI Store, la plataforma de comercio electrónico de repuestos para equipos PILI Industrial, superó la marca de 2.000 artículos disponibles en el catálogo online. La tienda ofrece desde componentes hidráulicos como cilindros, válvulas y mangueras hasta piezas estructurales, sensores y kits de mantenimiento preventivo para toda la línea de volcadores y colectores de muestras.

El crecimiento del catálogo refleja la estrategia de PILI de digitalizar la atención posventa y reducir el tiempo de respuesta para clientes que necesitan repuestos con urgencia. La plataforma cuenta con búsqueda inteligente por modelo de equipo, número de serie y código de pieza, además de recomendaciones automáticas de componentes relacionados y kits de mantenimiento programado.

“Nuestros clientes operan equipos críticos que no pueden quedar detenidos. PILI Store garantiza que cualquier repuesto esté a pocos clics de distancia, con un plazo de entrega de 24 a 72 horas para las principales capitales de Brasil”, destaca el equipo de posventa de la empresa.

La tienda ya registró más de 5.000 pedidos desde su lanzamiento y mantiene un índice de satisfacción de 4,8 sobre 5 estrellas. Los próximos pasos incluyen la integración con PILI Tech para pedidos automáticos de piezas basados en alertas de mantenimiento predictivo, y la expansión del catálogo hacia equipos de terceros compatibles con la línea PILI.`,
  },
  "tendencias-logistica-graos-2025": {
    title: "Tendencias en logística de granos para 2025",
    excerpt:
      "Análisis de las principales tendencias que están transformando la logística de granos en Brasil: automatización, trazabilidad, descarbonización e infraestructura multimodal.",
    content: `Brasil se consolidó como el mayor exportador mundial de soja y uno de los principales proveedores globales de maíz, café y algodón. Con cosechas que superan los 300 millones de toneladas anuales, la logística de granos enfrenta desafíos crecientes de escala, eficiencia y sostenibilidad. Identificamos cuatro tendencias que deben moldear el sector en 2025 y en los próximos años.

La primera es la automatización completa de los procesos de recepción y descarga. Los volcadores hidráulicos con sensores IoT, las básculas dinámicas integradas y los sistemas de muestreo automático eliminan procesos manuales y reducen el ciclo de descarga de minutos a segundos. Las cooperativas y terminales que adoptaron la automatización reportan mejoras de productividad de entre el 30 % y el 50 %, además de una reducción significativa de los errores humanos en la clasificación de granos.

La segunda tendencia es la trazabilidad de punta a punta, impulsada por regulaciones como el EUDR europeo y por exigencias crecientes de los compradores internacionales. Las plataformas digitales que rastrean el grano desde el establecimiento rural hasta el puerto de embarque dejaron de ser un diferencial para convertirse en un requisito obligatorio de acceso a mercados premium.

La tercera y la cuarta tendencia convergen: la descarbonización de la cadena logística y la expansión de la infraestructura multimodal. La inversión en ferrocarriles y la expansión de terminales fluviales en el Arco Norte prometen reducir la dependencia del transporte carretero, mientras equipos eléctricos e híbridos comienzan a sustituir sistemas exclusivamente diésel en las terminales de descarga. PILI Industrial ya desarrolla versiones con accionamiento eléctrico para toda su línea de volcadores, alineada con esa tendencia global.`,
  },
  "pili-harbor-gestao-patio-inteligente-iot": {
    title: "PILI Harbor: gestión de patio inteligente con IoT",
    excerpt:
      "Conozca PILI Harbor, la plataforma de gestión de patio que integra IoT, visión computacional e inteligencia artificial para optimizar operaciones de terminales graneleras.",
    content: `PILI Industrial lanzó PILI Harbor, su más reciente plataforma digital orientada a la gestión inteligente de patios en terminales graneleras, cooperativas e industrias. El sistema combina sensores IoT, cámaras con visión computacional y algoritmos de inteligencia artificial para ofrecer control total sobre el flujo de vehículos, la asignación de recursos y la eficiencia operativa.

PILI Harbor mapea digitalmente todo el patio de operaciones, identifica automáticamente los vehículos por patente y RFID, dirige los camiones hacia filas de descarga optimizadas y monitorea el estado de cada equipo en tiempo real. El módulo de previsión de demanda utiliza datos históricos e información de cosecha para anticipar los picos de movimiento y sugerir turnos de operación adecuados.

La integración con PILI Tech y PILI Raster crea un ecosistema completo: Harbor gestiona el patio, Tech monitorea los equipos de descarga y Raster garantiza la trazabilidad del grano. Juntas, las tres plataformas eliminan procesos manuales, reducen tiempos de espera y generan datos que transforman la operación logística de reactiva en predictiva.

El sistema ya opera en fase piloto en tres terminales de Paraná y Mato Grosso do Sul, con resultados iniciales que indican una reducción del 35 % en el tiempo de permanencia de los vehículos en el patio y un aumento del 25 % en la utilización de los equipos de descarga. El lanzamiento comercial está previsto para el primer trimestre de 2025, con planes de suscripción mensual que incluyen hardware IoT, software y soporte técnico 24/7.`,
  },
};

async function main() {
  const posts = await db.post.findMany({ select: { id: true, slug: true } });

  let traduzidos = 0;
  const semTraducao = [];

  for (const p of posts) {
    const es = ARTIGOS[p.slug];
    if (!es) {
      semTraducao.push(p.slug);
      continue;
    }

    await db.postTranslation.upsert({
      where: { postId_locale: { postId: p.id, locale: "es" } },
      update: es,
      create: { postId: p.id, locale: "es", ...es },
    });
    traduzidos++;
  }

  console.log(`artigos traduzidos: ${traduzidos}/${posts.length}`);
  if (semTraducao.length) console.log("sem tradução:", semTraducao.join(", "));
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
