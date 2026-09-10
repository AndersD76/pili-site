import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-guard";
import { consumeRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Converte endereço em coordenadas para o painel.
 *
 * Digitar latitude e longitude à mão obrigava a sair do admin, abrir o
 * OpenStreetMap, achar o ponto e copiar dois números — e um dígito errado joga
 * o marcador no oceano.
 *
 * A busca acontece em etapas porque endereço digitado erra fácil. O caso que
 * motivou isso: "Av. Coronel José Teófilo de Souza" não existe em Uberlândia;
 * o CEP informado é da "Avenida Coronel José Teófilo Carneiro". Quem sabe o
 * nome certo da rua é o CEP, então ele vem primeiro.
 */
const VIACEP = "https://viacep.com.br/ws";
const NOMINATIM = "https://nominatim.openstreetmap.org/search";

type Precisao = "exata" | "aproximada";

interface EnderecoViaCep {
  logradouro?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
  erro?: boolean | string;
}

/** Endereço oficial dos Correios a partir do CEP. */
async function consultarCep(cep: string): Promise<EnderecoViaCep | null> {
  const digitos = cep.replace(/\D/g, "");
  if (digitos.length !== 8) return null;
  try {
    const resposta = await fetch(`${VIACEP}/${digitos}/json/`, {
      signal: AbortSignal.timeout(8_000),
    });
    if (!resposta.ok) return null;
    const dados = (await resposta.json()) as EnderecoViaCep;
    return dados.erro ? null : dados;
  } catch {
    return null;
  }
}

/**
 * O Nominatim é o mesmo serviço por trás do mapa que o site já usa: gratuito e
 * sem chave. A política de uso pede identificação de quem chama, daí o
 * User-Agent.
 */
async function geocodificar(
  consulta: string,
): Promise<{ lat: number; lng: number; endereco: string } | null> {
  if (consulta.trim().length < 3) return null;

  const url = new URL(NOMINATIM);
  url.searchParams.set("q", consulta);
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("limit", "1");
  // O parque de equipamentos é brasileiro; sem isto "Erechim" acha homônimos.
  url.searchParams.set("countrycodes", "br");

  try {
    const resposta = await fetch(url, {
      headers: {
        "User-Agent": "PILI Industrial CMS (https://www.pili.ind.br)",
        "Accept-Language": "pt-BR",
      },
      signal: AbortSignal.timeout(10_000),
    });
    if (!resposta.ok) return null;

    const resultados = (await resposta.json()) as {
      lat: string;
      lon: string;
      display_name: string;
    }[];
    const achado = resultados[0];
    if (!achado) return null;

    return {
      lat: Number(achado.lat),
      lng: Number(achado.lon),
      endereco: achado.display_name,
    };
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  await requireAdmin();

  const params = new URL(request.url).searchParams;
  const logradouro = params.get("logradouro")?.trim() ?? "";
  const cidade = params.get("cidade")?.trim() ?? "";
  const uf = params.get("uf")?.trim() ?? "";
  const cep = params.get("cep")?.trim() ?? "";

  if (!logradouro && !cidade && !cep) {
    return NextResponse.json(
      { error: "Preencha o endereço, a cidade ou o CEP." },
      { status: 400 },
    );
  }

  const limite = await consumeRateLimit({
    key: "geocodificar",
    limit: 30,
    windowSeconds: 60,
  });
  if (!limite.success) {
    return NextResponse.json(
      { error: "Muitas buscas seguidas. Espere um instante e tente de novo." },
      { status: 429 },
    );
  }

  const juntar = (...partes: (string | undefined)[]) =>
    partes.filter((p) => p && p.length > 0).join(", ");

  /** Tentativas em ordem de precisão, da melhor para a mais grosseira. */
  const tentativas: { consulta: string; precisao: Precisao; corrigido?: string }[] =
    [];

  const viaCep = cep ? await consultarCep(cep) : null;
  if (viaCep?.logradouro) {
    tentativas.push({
      consulta: juntar(
        viaCep.logradouro,
        viaCep.bairro,
        viaCep.localidade,
        viaCep.uf,
      ),
      precisao: "exata",
      // Só avisa quando o CEP discorda do que foi digitado.
      corrigido:
        logradouro &&
        !logradouro
          .toLowerCase()
          .includes(viaCep.logradouro.toLowerCase().replace(/^(av|rua|r)\.?\s+/i, ""))
          ? viaCep.logradouro
          : undefined,
    });
  }

  if (logradouro) {
    tentativas.push({
      consulta: juntar(logradouro, cidade, uf),
      precisao: "exata",
    });
  }

  const municipio = juntar(cidade || viaCep?.localidade, uf || viaCep?.uf);
  if (municipio) {
    tentativas.push({ consulta: municipio, precisao: "aproximada" });
  }

  for (const tentativa of tentativas) {
    const achado = await geocodificar(tentativa.consulta);
    if (!achado) continue;
    return NextResponse.json({
      ...achado,
      precisao: tentativa.precisao,
      corrigido: tentativa.corrigido ?? null,
    });
  }

  return NextResponse.json(
    {
      error:
        "Nenhum ponto encontrado. Confira o nome da rua e o CEP — ou marque a coordenada à mão pelo openstreetmap.org.",
    },
    { status: 404 },
  );
}
