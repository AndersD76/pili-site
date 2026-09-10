import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-guard";
import { consumeRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Converte endereço em coordenadas para o painel.
 *
 * Digitar latitude e longitude à mão obrigava a sair do admin, abrir o
 * OpenStreetMap, achar o ponto, clicar com o botão direito e copiar dois
 * números — e um dígito errado joga o marcador no oceano. Aqui o endereço já
 * cadastrado vira coordenada.
 *
 * O Nominatim é o mesmo serviço por trás do mapa que o site já usa: gratuito e
 * sem chave. A política de uso pede identificação de quem chama e no máximo uma
 * consulta por segundo, por isso o User-Agent abaixo e o limite de uso.
 */
const NOMINATIM = "https://nominatim.openstreetmap.org/search";

export async function GET(request: Request) {
  await requireAdmin();

  const endereco = new URL(request.url).searchParams.get("q")?.trim();
  if (!endereco || endereco.length < 5) {
    return NextResponse.json(
      { error: "Informe um endereço com pelo menos 5 caracteres." },
      { status: 400 },
    );
  }

  // Uma consulta por segundo é o teto que a política do Nominatim aceita.
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

  const url = new URL(NOMINATIM);
  url.searchParams.set("q", endereco);
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("limit", "1");
  url.searchParams.set("addressdetails", "0");
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

    if (!resposta.ok) {
      return NextResponse.json(
        { error: "O serviço de mapas não respondeu. Tente de novo." },
        { status: 502 },
      );
    }

    const resultados = (await resposta.json()) as {
      lat: string;
      lon: string;
      display_name: string;
    }[];

    const achado = resultados[0];
    if (!achado) {
      return NextResponse.json(
        { error: "Endereço não encontrado. Tente incluir cidade e estado." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      lat: Number(achado.lat),
      lng: Number(achado.lon),
      endereco: achado.display_name,
    });
  } catch (err) {
    console.error("[GEOCODIFICAR]", err);
    return NextResponse.json(
      { error: "Não foi possível consultar o serviço de mapas." },
      { status: 502 },
    );
  }
}
