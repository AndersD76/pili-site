import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { logError } from "./prisma-errors";

/**
 * Tradução assistida do conteúdo do CMS, de português para espanhol.
 *
 * O site lê `pt_BR` e `es` do banco e cai para o português quando a versão em
 * espanhol não existe. Isso funciona, mas deixa o site em espanhol
 * permanentemente desatualizado: cada produto ou artigo novo nasce só em
 * português. Este módulo produz o primeiro rascunho em espanhol para o editor
 * revisar — a tradução entra nos campos do formulário, não direto no banco.
 *
 * A chave nunca sai do servidor: quem chama isto é uma Server Action.
 */

/** `null` quando a chave não está configurada — o botão fica desabilitado. */
function cliente(): Anthropic | null {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  return apiKey ? new Anthropic({ apiKey }) : null;
}

export function traducaoDisponivel(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

/**
 * Glossário do domínio.
 *
 * Tradução genérica erra o vocabulário do setor: "tombador" vira "volquete" ou
 * "basculador" em vez de "volcador", e "safra" vira "cosecha" onde o mercado
 * usa outro termo. Fixar isso aqui é mais barato do que corrigir campo a campo
 * depois.
 */
const GLOSSARIO = `
tombador → volcador (nunca "volquete", "basculador" ou "descargador")
tombador hidráulico → volcador hidráulico
coletor de amostras → colector de muestras
unidade de transbordo → unidad de trasbordo
plataforma de descarga → plataforma de descarga
safra → cosecha
entressafra → entrecosecha
caminhão → camión
carreta graneleira → semirremolque granelero
rodotrem / bitrem → tren de carretera / bitrén
pátio → patio
esteira → cinta transportadora
moega → tolva
cooperativa → cooperativa
tempo de espera → tiempo de espera
vazão → caudal
ciclo → ciclo
`.trim();

const SISTEMA = `Você traduz conteúdo de marketing industrial de português do Brasil para espanhol da América Latina.

A empresa é a PILI Industrial, fabricante de volcadores hidráulicos para descarga de granos, com clientes em 18 países.

Regras:
- Espanhol neutro da América Latina, não da Espanha. Use "usted", nunca "vosotros".
- Respeite o glossário abaixo sem exceção.
- Preserve números, unidades, normas técnicas (NR-12, ISO 9001, SA 2.5, AISI 316L), nomes de empresas, cidades e siglas exatamente como estão.
- Preserve a formatação: quebras de linha duplas separam parágrafos e devem ser mantidas.
- Nomes próprios brasileiros (Erechim, Paranaguá, Cargill) não se traduzem.
- Mantenha o registro: texto comercial direto, sem floreio. Não aumente nem resuma o conteúdo.
- Traduza apenas o que receber. Se um campo vier vazio, devolva vazio.

Glossário obrigatório:
${GLOSSARIO}`;

/** Campos traduzíveis. Cada entidade (produto, obra, artigo) usa um subconjunto. */
export type CamposTraduziveis = Partial<
  Record<
    | "name"
    | "tagline"
    | "title"
    | "summary"
    | "excerpt"
    | "description"
    | "content"
    | "metaTitle"
    | "metaDesc",
    string
  >
>;

/**
 * Traduz os campos preenchidos e devolve os mesmos campos em espanhol.
 *
 * Nunca lança: uma falha de tradução não pode impedir o editor de salvar o
 * conteúdo em português.
 */
export async function traduzirParaEspanhol(
  campos: CamposTraduziveis,
): Promise<{ ok: true; campos: CamposTraduziveis } | { ok: false; erro: string }> {
  const anthropic = cliente();
  if (!anthropic) {
    return { ok: false, erro: "Tradução automática não configurada." };
  }

  // Campos vazios não vão para o modelo: economiza tokens e evita que ele
  // invente conteúdo para preencher um campo em branco.
  const preenchidos = Object.fromEntries(
    Object.entries(campos).filter(([, v]) => v && v.trim().length > 0),
  ) as CamposTraduziveis;

  if (Object.keys(preenchidos).length === 0) {
    return { ok: false, erro: "Nada para traduzir — preencha o português primeiro." };
  }

  // O schema de saída espelha exatamente os campos enviados, então o modelo não
  // pode devolver campo a mais nem a menos. Escrito como JSON Schema em vez do
  // helper de zod do SDK: o helper exige zod v4 e o projeto está no v3.
  const chaves = Object.keys(preenchidos);
  const schema = {
    type: "object",
    properties: Object.fromEntries(chaves.map((k) => [k, { type: "string" }])),
    required: chaves,
    additionalProperties: false,
  };

  try {
    const resposta = await anthropic.messages.create({
      model: "claude-opus-5",
      max_tokens: 16000,
      system: SISTEMA,
      // Tradução com glossário não exige raciocínio profundo; `medium` entrega
      // a qualidade necessária sem o custo do padrão.
      output_config: {
        effort: "medium",
        format: { type: "json_schema", schema },
      },
      messages: [
        {
          role: "user",
          content: `Traduza cada campo para espanhol:

${JSON.stringify(preenchidos, null, 2)}`,
        },
      ],
    });

    if (resposta.stop_reason === "refusal") {
      return { ok: false, erro: "O modelo recusou traduzir este conteúdo." };
    }

    if (resposta.stop_reason === "max_tokens") {
      return { ok: false, erro: "Texto longo demais para traduzir de uma vez." };
    }

    const bloco = resposta.content.find((b) => b.type === "text");
    if (!bloco || bloco.type !== "text") {
      return { ok: false, erro: "Resposta da tradução veio vazia." };
    }

    return { ok: true, campos: JSON.parse(bloco.text) as CamposTraduziveis };
  } catch (err) {
    logError("TRADUCAO", err);
    return { ok: false, erro: "Falha ao traduzir. Tente novamente." };
  }
}
