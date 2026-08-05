/**
 * Semeia as perguntas frequentes dos produtos, em português e espanhol.
 *
 * O model `FAQ` existia no schema e nunca era lido nem escrito — o rich result
 * de FAQPage ficava fora do alcance. As perguntas abaixo são as que a equipe
 * comercial responde com mais frequência; a partir daqui são editáveis no
 * painel, na ficha de cada produto.
 *
 * Idempotente: apaga as perguntas do produto antes de regravar.
 *
 *   node scripts/seed-faqs.mjs
 */
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

/** Perguntas comuns a toda a linha de tombadores. */
const TOMBADOR = {
  pt_BR: [
    {
      question: "Qual é o prazo de entrega?",
      answer:
        "O prazo médio é de 90 a 120 dias entre a assinatura do contrato e a entrega em obra, variando com a configuração escolhida e a fila de produção. A montagem no local leva de 20 a 45 dias, conforme o porte do equipamento.",
    },
    {
      question: "O equipamento atende à NR-12?",
      answer:
        "Sim. Todos os tombadores PILI são projetados em conformidade com a NR-12 e a NR-10, e acompanham laudo técnico de conformidade, manual de operação e manutenção e a documentação exigida em fiscalização.",
    },
    {
      question: "Qual é a garantia?",
      answer:
        "Cinco anos de garantia estrutural, cobrindo defeitos de fabricação e materiais, com suporte técnico remoto e presencial durante todo o período. É possível estender a garantia mediante contrato.",
    },
    {
      question: "Que tipo de fundação é necessária?",
      answer:
        "Os modelos fixos exigem fundação em concreto armado dimensionada para as cargas dinâmicas do basculamento; enviamos o projeto de fundação junto com a proposta. Os modelos móveis dispensam fundação especial.",
    },
    {
      question: "Vocês fazem a manutenção depois da instalação?",
      answer:
        "Sim. O atendimento técnico é próprio, com peças de reposição originais pela PILI Store e monitoramento remoto opcional pelo PILI Tech, que antecipa a manutenção antes da parada.",
    },
  ],
  es: [
    {
      question: "¿Cuál es el plazo de entrega?",
      answer:
        "El plazo medio es de 90 a 120 días entre la firma del contrato y la entrega en obra, según la configuración elegida y la fila de producción. El montaje en el lugar lleva de 20 a 45 días, conforme al porte del equipo.",
    },
    {
      question: "¿El equipo cumple la norma NR-12?",
      answer:
        "Sí. Todos los volcadores PILI se diseñan conforme a la NR-12 y la NR-10, y se entregan con informe técnico de conformidad, manual de operación y mantenimiento y la documentación exigida en fiscalización.",
    },
    {
      question: "¿Cuál es la garantía?",
      answer:
        "Cinco años de garantía estructural, que cubre defectos de fabricación y materiales, con soporte técnico remoto y presencial durante todo el período. La garantía puede extenderse mediante contrato.",
    },
    {
      question: "¿Qué tipo de fundación se necesita?",
      answer:
        "Los modelos fijos requieren una fundación de hormigón armado dimensionada para las cargas dinámicas del basculamiento; enviamos el proyecto de fundación junto con la propuesta. Los modelos móviles no requieren fundación especial.",
    },
    {
      question: "¿Realizan el mantenimiento después de la instalación?",
      answer:
        "Sí. La atención técnica es propia, con repuestos originales por PILI Store y monitoreo remoto opcional por PILI Tech, que anticipa el mantenimiento antes de la parada.",
    },
  ],
};

/** Perguntas do coletor de amostras. */
const COLETOR = {
  pt_BR: [
    {
      question: "A amostragem atende às normas do MAPA e da CONAB?",
      answer:
        "Sim. O coletor foi projetado para atender integralmente as normas de classificação e amostragem de grãos, com coleta em múltiplos pontos e profundidades da carga.",
    },
    {
      question: "Como funciona a rastreabilidade da amostra?",
      answer:
        "Cada amostra é vinculada à placa do veículo, à nota fiscal e ao lote por RFID ou QR Code, e os dados vão em tempo real para o sistema de classificação e pagamento.",
    },
    {
      question: "Dá para integrar com o tombador?",
      answer:
        "Sim. O coletor se conecta diretamente aos tombadores PILI, e a amostragem acontece no mesmo fluxo da descarga — sem manobra adicional do caminhão.",
    },
  ],
  es: [
    {
      question: "¿El muestreo cumple las normas del MAPA y de la CONAB?",
      answer:
        "Sí. El colector fue diseñado para cumplir íntegramente las normas de clasificación y muestreo de granos, con toma en múltiples puntos y profundidades de la carga.",
    },
    {
      question: "¿Cómo funciona la trazabilidad de la muestra?",
      answer:
        "Cada muestra se vincula a la patente del vehículo, la factura y el lote mediante RFID o código QR, y los datos van en tiempo real al sistema de clasificación y pago.",
    },
    {
      question: "¿Se puede integrar con el volcador?",
      answer:
        "Sí. El colector se conecta directamente a los volcadores PILI y el muestreo ocurre en el mismo flujo de la descarga, sin maniobra adicional del camión.",
    },
  ],
};

/** Perguntas dos equipamentos fora da linha de grãos. */
const INDUSTRIAL = {
  pt_BR: [
    {
      question: "O equipamento é feito sob medida?",
      answer:
        "Sim. O dimensionamento parte da sua aplicação — pressão, vazão, força e controle — e o projeto é desenvolvido pela nossa engenharia antes da fabricação.",
    },
    {
      question: "A instalação está inclusa?",
      answer:
        "O escopo padrão inclui instalação, comissionamento e treinamento operacional no local. Os detalhes constam da proposta comercial.",
    },
    {
      question: "Qual é a garantia?",
      answer:
        "Cinco anos de garantia estrutural, com suporte técnico remoto e presencial e peças de reposição originais durante todo o período.",
    },
  ],
  es: [
    {
      question: "¿El equipo se fabrica a medida?",
      answer:
        "Sí. El dimensionamiento parte de su aplicación — presión, caudal, fuerza y control — y el proyecto lo desarrolla nuestra ingeniería antes de la fabricación.",
    },
    {
      question: "¿La instalación está incluida?",
      answer:
        "El alcance estándar incluye instalación, puesta en marcha y capacitación operativa en el lugar. Los detalles constan en la propuesta comercial.",
    },
    {
      question: "¿Cuál es la garantía?",
      answer:
        "Cinco años de garantía estructural, con soporte técnico remoto y presencial y repuestos originales durante todo el período.",
    },
  ],
};

/** Conjunto de perguntas por categoria de produto. */
const POR_CATEGORIA = {
  TOMBADOR_FIXO: TOMBADOR,
  TOMBADOR_MOVEL: TOMBADOR,
  COLETOR_AMOSTRAS: COLETOR,
  UNIDADE_TRANSBORDO: COLETOR,
  ESPECIAL: INDUSTRIAL,
};

async function main() {
  const produtos = await db.product.findMany({
    select: { id: true, slug: true, category: true },
  });

  let gravadas = 0;

  for (const p of produtos) {
    const conjunto = POR_CATEGORIA[p.category];
    if (!conjunto) continue;

    await db.fAQ.deleteMany({ where: { productId: p.id } });

    for (const [locale, perguntas] of Object.entries(conjunto)) {
      await db.fAQ.createMany({
        data: perguntas.map((f, i) => ({
          productId: p.id,
          locale,
          question: f.question,
          answer: f.answer,
          order: i,
        })),
      });
      gravadas += perguntas.length;
    }
  }

  console.log(`produtos: ${produtos.length}`);
  console.log(`perguntas gravadas (pt-BR + es): ${gravadas}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
