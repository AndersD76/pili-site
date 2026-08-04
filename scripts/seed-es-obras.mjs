/**
 * Semeia as traduções em espanhol das obras.
 *
 * Complementa `seed-es-produtos.mjs`. Idempotente: upsert pela chave
 * (caseId, locale).
 *
 *   node scripts/seed-es-obras.mjs
 */
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const OBRAS = {
  "cargill-paranagua": {
    title: "Descarga de alto rendimiento en el Puerto de Paranaguá",
    summary:
      "Instalación de 2 volcadores de 30 metros fijos en la terminal portuaria de Cargill en Paranaguá, alcanzando una capacidad de 120 camiones/día con un ciclo medio de 45 segundos y 99,2 % de disponibilidad operativa.",
    content: `La terminal de Cargill en Paranaguá es una de las más activas del sur de Brasil, responsable de la exportación de soja, maíz y harina hacia mercados internacionales. Con el aumento del volumen embarcado y la necesidad de reducir las filas de camiones en la zona portuaria, la empresa buscó una solución de descarga que combinara velocidad, confiabilidad e integración con el sistema de gestión portuaria existente.

PILI Industrial suministró 2 volcadores de 30 metros fijos, configurados con sistema hidráulico redundante y tratamiento anticorrosivo especial para ambiente marino. Cada unidad fue diseñada para operar en régimen 24/7, con sensores de posición y automatización completa mediante PLC Siemens integrado al sistema SCADA de la terminal.

La puesta en marcha se realizó en dos etapas para no interrumpir la operación de la terminal durante la cosecha. El equipo de PILI permaneció en campo durante 45 días, incluida la capacitación de operadores y del personal de mantenimiento. El resultado fue una capacidad de descarga de 8.400 toneladas por día, con un ciclo medio de 45 segundos y una disponibilidad del 99,2 %.

Tras 12 meses de operación, Cargill registró una reducción del 60 % en el tiempo de permanencia de los camiones en la terminal y la eliminación de los cuellos de botella de descarga en los picos de cosecha.`,
  },
  "jbs-lins": {
    title: "Recepción de insumos en la fábrica de alimento balanceado de JBS",
    summary:
      "Suministro de 1 volcador de 18 metros fijo para la fábrica de alimento balanceado de JBS en Lins, optimizando la recepción de maíz y harina con una capacidad de 80 camiones/día y un ciclo de 65 segundos.",
    content: `La unidad de JBS en Lins/SP opera una de las mayores fábricas de alimento balanceado del interior del estado de São Paulo, con demanda constante de maíz, harina de soja y otros insumos a granel. El equipo anterior presentaba ciclos largos y paradas frecuentes, lo que generaba filas de camiones y retrasos en la producción.

PILI suministró un volcador de 18 metros fijo, dimensionado para la flota predominante de bitrenes que abastece la unidad. El proyecto incluyó adaptaciones en la tolva existente e integración con la báscula camionera y el sistema ERP de la fábrica, lo que permite la trazabilidad automática de cada descarga.

La instalación se ejecutó en 20 días durante una parada programada de mantenimiento, sin impacto en el calendario de producción. El volcador opera con un ciclo medio de 65 segundos y atiende hasta 80 camiones por día, procesando 3.200 toneladas diarias de insumos.

JBS reportó una mejora del 35 % en la productividad de la recepción y la eliminación de horas extra en el equipo de logística interna, además de una reducción significativa de los costos por demoras.`,
  },
  "agraria-guarapuava": {
    title: "Complejo de descarga y muestreo en la Cooperativa Agrária",
    summary:
      "Proyecto completo con 3 volcadores de 12 metros fijos y 2 colectores de muestras automáticos para la Cooperativa Agrária en Guarapuava, procesando 200 camiones/día en los picos de cosecha con muestreo 100 % trazable.",
    content: `La Cooperativa Agrária de Guarapuava es una de las mayores cooperativas agroindustriales de Paraná y recibe la producción de cientos de asociados en una región de alta productividad de granos. En los picos de cosecha de soja y maíz, las filas de camiones llegaban a superar las 3 horas de espera, lo que generaba insatisfacción entre los productores y pérdidas logísticas.

PILI diseñó un complejo de descarga con 3 volcadores de 12 metros fijos operando en paralelo, combinados con 2 colectores de muestras automáticos con trazabilidad mediante código QR. La configuración permite que la carga de cada camión sea muestreada y descargada en un único flujo, sin maniobras adicionales.

El sistema de muestreo toma muestras en múltiples puntos de la carga y las vincula automáticamente a la patente del vehículo, la factura y el asociado. Los datos se transmiten en tiempo real al sistema de clasificación y pago de la cooperativa, lo que elimina procesos manuales y disputas de calidad.

El resultado fue un aumento del 60 % en la capacidad de recepción, con 200 camiones procesados por día en los picos de cosecha. El tiempo medio de permanencia de los camiones bajó de 3 horas a menos de 50 minutos, incluidos pesaje, muestreo y descarga.`,
  },
  "cofco-santos": {
    title: "Terminal de exportación COFCO en el Puerto de Santos",
    summary:
      "Instalación de 2 volcadores de 26 metros fijos en la terminal de exportación de Cofco International en Santos, operando en régimen 24/7 con una capacidad de 10.500 toneladas/día e integración total con el sistema portuario.",
    content: `Cofco International opera una de las mayores terminales de exportación de granos del Puerto de Santos, movilizando millones de toneladas por cosecha con destino a Asia y Europa. La empresa necesitaba ampliar la capacidad de descarga para acompañar el crecimiento de los volúmenes contratados y reducir el tiempo de permanencia de los buques en el puerto.

PILI suministró 2 volcadores de 26 metros fijos, diseñados para operación ininterrumpida en ambiente portuario con alto índice de salinidad y humedad. Cada equipo recibió tratamiento anticorrosivo especial con arenado SA 2.5 y pintura epoxi de alto espesor, además de un sistema hidráulico con doble circuito y cambio de filtros en caliente.

La integración con el sistema de gestión portuaria de Cofco fue uno de los diferenciales del proyecto. Cada descarga se registra automáticamente con datos de peso, horario, patente y producto, alimentando el sistema de programación de embarque en tiempo real. Los volcadores operan 24/7 con paradas programadas de apenas 4 horas semanales para mantenimiento preventivo.

El resultado fue una capacidad combinada de 150 camiones/día y 10.500 toneladas descargadas diariamente, lo que contribuyó a reducir el tiempo de espera de los buques y a mejorar los indicadores de desempeño logístico de la terminal.`,
  },
  "brf-chapeco": {
    title: "Línea de descarga y trasbordo en BRF Chapecó",
    summary:
      "Suministro de 1 volcador de 21 metros fijo y 1 unidad de trasbordo para la planta industrial de BRF en Chapecó, procesando 100 camiones/día de maíz y harina para la producción de alimento balanceado.",
    content: `La planta de BRF en Chapecó es una de las mayores unidades de procesamiento avícola de Brasil, con una demanda diaria de miles de toneladas de maíz y harina de soja para la alimentación de los planteles. El sistema de recepción anterior estaba fragmentado, con equipos de distintos fabricantes y épocas, lo que generaba cuellos de botella y altos costos de mantenimiento.

PILI diseñó una solución integrada con un volcador de 21 metros fijo para la descarga directa en la tolva principal y una unidad de trasbordo para la redistribución interna entre silos. La unidad de trasbordo permite transferir carga entre vehículos sin necesidad de descargar en una tolva intermedia, optimizando el flujo logístico de la planta.

El volcador se configuró con un sistema de pesaje dinámico integrado, lo que elimina la necesidad de un segundo pesaje en la báscula camionera. La automatización incluye el secuenciamiento automático de camiones con semáforo y paneles de orientación al conductor, reduciendo la necesidad de operadores en el patio.

BRF registró un aumento del 25 % en la eficiencia de la recepción, con 100 camiones procesados diariamente y 5.000 toneladas descargadas. El ciclo medio de 70 segundos incluye posicionamiento, descarga y liberación del vehículo.`,
  },
  "lar-medianeira": {
    title: "Ampliación de la recepción en la Cooperativa Lar",
    summary:
      "Proyecto de ampliación con 2 volcadores de 18 metros fijos y 3 colectores de muestras para la Cooperativa Lar en Medianeira, con capacidad de almacenamiento de 15 mil toneladas y procesamiento de 180 camiones/día.",
    content: `La Cooperativa Lar de Medianeira, en el oeste de Paraná, enfrentaba limitaciones de capacidad de recepción durante los picos de cosecha de soja y maíz. Con la expansión del número de asociados y el aumento de la productividad por hectárea en la región, el sistema existente ya no atendía la demanda, lo que generaba filas y la pérdida de productores hacia la competencia.

PILI suministró 2 volcadores de 18 metros fijos y 3 colectores de muestras automáticos como parte de un proyecto de ampliación que incluyó nuevos silos con una capacidad total de 15 mil toneladas. Los volcadores se ubicaron en líneas paralelas con tolva compartida, optimizando la inversión en obra civil.

Los colectores de muestras operan de forma integrada con el sistema de clasificación de la cooperativa, lo que permite determinar la calidad de cada lote incluso antes de la descarga. Cuando la clasificación indica estándares fuera de especificación, el sistema redirige el camión automáticamente hacia la línea de secado.

El resultado fue un aumento del 70 % en la capacidad de recepción, con 180 camiones procesados por día y un ciclo medio de 55 segundos. La cooperativa eliminó las filas superiores a 1 hora en los picos de cosecha y amplió su área de captación de asociados en la región.`,
  },
  "yara-rio-grande": {
    title: "Descarga anticorrosiva para fertilizantes en Yara",
    summary:
      "Suministro de 1 volcador de 21 metros fijo con especificación anticorrosiva especial para operar con fertilizantes en la planta de Yara en Rio Grande, con garantía extendida de 5 años.",
    content: `Yara Fertilizantes opera una gran planta de mezcla y distribución de fertilizantes en Rio Grande/RS, próxima al puerto. El ambiente de operación combina dos factores críticos: la alta corrosividad de los fertilizantes granulados y en polvo, y la atmósfera salina de la región costera. El volcador anterior, de otro fabricante, tuvo que ser sustituido con apenas 3 años de uso debido a la corrosión estructural.

PILI desarrolló una configuración especial del volcador de 21 metros con revestimiento en acero inoxidable AISI 316L en las áreas de contacto con el producto, arenado SA 2.5 con perfil de anclaje de 75 micrómetros en la estructura principal y un sistema de pintura de 4 capas (imprimación epoxi zinc, epoxi intermedio, poliuretano acrílico y sellador). El sistema hidráulico recibió sellos especiales y fluido biodegradable resistente a la contaminación.

El proyecto incluyó un sistema de lavado automático integrado que opera al final de cada turno, retirando residuos de fertilizante de las superficies de contacto. Se instalaron sensores de espesor de chapa en puntos críticos para el monitoreo preventivo del desgaste a lo largo de la vida útil del equipo.

Yara contrató una garantía extendida de 5 años contra corrosión estructural, la primera de este tipo en la historia de PILI. Tras 2 años de operación, las inspecciones semestrales no registraron ninguna pérdida de espesor significativa. El volcador procesa 90 camiones/día con un ciclo de 75 segundos, totalizando 4.500 toneladas diarias.`,
  },
  "votorantim-itapeva": {
    title: "Volcador heavy-duty para clínker en Votorantim Cimentos",
    summary:
      "Suministro de 1 volcador de 12 metros fijo en configuración heavy-duty para la descarga de clínker y cemento en la fábrica de Votorantim Cimentos en Itapeva, procesando 60 camiones/día con materiales de alta densidad y abrasividad.",
    content: `La fábrica de Votorantim Cimentos en Itapeva/SP es una unidad de molienda y ensacado que recibe clínker de otras plantas para la producción de cemento. El clínker es un material de alta densidad y abrasividad que exige equipos reforzados y con mantenimiento específico. Los volcadores convencionales utilizados anteriormente presentaban un desgaste acelerado en las chapas de piso y en los apoyos laterales.

PILI suministró un volcador de 12 metros en configuración heavy-duty, con chapas de piso en acero Hardox 450 de 12 mm de espesor, apoyos laterales reforzados y un sistema hidráulico sobredimensionado para operar con cargas de alta densidad. El proyecto incluyó cortinas de goma especiales para contener el polvo de clínker durante la descarga.

La instalación se realizó en una parada programada de 15 días, con fundaciones reforzadas en hormigón armado para soportar las elevadas cargas dinámicas. El sistema de desempolvado integrado captura partículas durante todo el ciclo de descarga, cumpliendo las normas ambientales vigentes.

Tras 18 meses de operación, el volcador procesa 60 camiones/día con un ciclo medio de 70 segundos, totalizando 2.400 toneladas diarias de clínker y cemento. El desgaste de las chapas de piso está dentro de lo previsto, con una vida útil estimada de 8 años antes de la primera sustitución.`,
  },
};

async function main() {
  const obras = await db.case.findMany({ select: { id: true, slug: true } });

  let traduzidas = 0;
  const semTraducao = [];

  for (const o of obras) {
    const es = OBRAS[o.slug];
    if (!es) {
      semTraducao.push(o.slug);
      continue;
    }

    await db.caseTranslation.upsert({
      where: { caseId_locale: { caseId: o.id, locale: "es" } },
      update: es,
      create: { caseId: o.id, locale: "es", ...es },
    });
    traduzidas++;
  }

  console.log(`obras traduzidas: ${traduzidas}/${obras.length}`);
  if (semTraducao.length) console.log("sem tradução:", semTraducao.join(", "));
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
