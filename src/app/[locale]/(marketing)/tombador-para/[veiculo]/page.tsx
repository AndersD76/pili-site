import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/routing";
import { DENSIDADE, MANOBRA_S, VEICULOS, type TipoVeiculo } from "@/lib/calculadora";
import { CULTURAS } from "@/lib/mercado-graos/dados";
import { TITULO_CULTURA, medida, num } from "@/lib/mercado-graos/formato";
import {
  JORNADA_H,
  NOME_VEICULO,
  tombadorParaVeiculo,
  tombadoresPublicados,
  toneladasPorViagem,
  veiculosPorHora,
} from "@/lib/mercado-graos/logistica";
import {
  Cabecalho,
  CtaUnidade,
  JsonLd,
  Kpis,
  Links,
  Nota,
  Secao,
  Tabela,
} from "@/components/mercado-graos/blocos";
import { generateBreadcrumbJsonLd, generatePageMetadata } from "@/lib/seo";
import { getSiteSettings } from "@/lib/site-settings";

export const revalidate = 86400;
export const dynamicParams = false;

const VEICULOS_PAGINA: TipoVeiculo[] = ["caminhao", "carreta", "bitrem", "rodotrem"];
type Params = { locale: string; veiculo: string };

export function generateStaticParams(): Params[] {
  return VEICULOS_PAGINA.map((veiculo) => ({ locale: "pt-BR", veiculo }));
}

function valido(v: string): v is TipoVeiculo {
  return VEICULOS_PAGINA.includes(v as TipoVeiculo);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { veiculo } = await params;
  if (!valido(veiculo)) return {};
  const v = VEICULOS[veiculo];
  return generatePageMetadata({
    title: `Tombador para ${NOME_VEICULO[veiculo]}: comprimento mínimo de ${medida(v.comprimentoM)} m e modelos compatíveis`,
    description: `Qual tombador descarrega ${NOME_VEICULO[veiculo]}: comprimento e peso do veículo pelo CONTRAN, toneladas por viagem de cada grão e os modelos PILI que comportam a composição.`,
    path: `/tombador-para/${veiculo}`,
    idiomas: ["pt-BR"],
    marca: false,
  });
}

export default async function VeiculoPage({ params }: { params: Promise<Params> }) {
  const { locale, veiculo } = await params;
  setRequestLocale(locale);
  if (!valido(veiculo) || locale !== "pt-BR") notFound();

  const [settings, tombadores] = await Promise.all([
    getSiteSettings(),
    tombadoresPublicados(),
  ]);

  const v = VEICULOS[veiculo];
  const path = `/tombador-para/${veiculo}`;
  const recomendado = tombadorParaVeiculo(tombadores, veiculo);
  const compativeis = tombadores
    .filter((t) => t.comprimentoM >= v.comprimentoM && t.capacidadeT >= v.pbtcT)
    .sort((a, b) => a.comprimentoM - b.comprimentoM);

  return (
    <>
      <JsonLd
        dados={[
          generateBreadcrumbJsonLd([
            { name: "Início", url: "/pt-BR" },
            { name: "Tombador por veículo", url: "/pt-BR/tombador-para" },
            { name: NOME_VEICULO[veiculo], url: `/pt-BR${path}` },
          ]),
        ]}
      />

      <Cabecalho
        trilha={[
          { name: "Início", href: "/" },
          { name: "Tombador por veículo", href: "/tombador-para" },
          { name: NOME_VEICULO[veiculo] },
        ]}
        eyebrow="Tombador por tipo de veículo"
        titulo={`Tombador para ${NOME_VEICULO[veiculo]}`}
        lead={
          <p>
            A composição de {NOME_VEICULO[veiculo]} tem até{" "}
            <strong className="text-pili-white">{medida(v.comprimentoM)} m</strong> e{" "}
            <strong className="text-pili-white">{num(v.pbtcT)} t de PBTC</strong> pelos limites do
            CONTRAN. O tombador precisa ter plataforma pelo menos desse comprimento e capacidade
            acima desse peso.{" "}
            {recomendado ? (
              <>O menor modelo PILI que atende é o {recomendado.nome}.</>
            ) : (
              <>Nenhum modelo do catálogo atende sozinho — é caso de projeto especial.</>
            )}
          </p>
        }
      />

      <Kpis
        itens={[
          { valor: `${medida(v.comprimentoM)} m`, rotulo: "Comprimento máximo", destaque: true },
          { valor: `${num(v.pbtcT)} t`, rotulo: "PBTC" },
          { valor: `${num(v.volumeM3)} m³`, rotulo: "Graneleiro típico" },
          { valor: num(compativeis.length), rotulo: "Modelos PILI compatíveis" },
        ]}
      />

      <Secao titulo="Toneladas por viagem">
        <Tabela
          cabecalho={["Carga", "Densidade (kg/m³)", "Toneladas por viagem"]}
          numericas={[1, 2]}
          linhas={[
            ...CULTURAS.map((c) => [
              TITULO_CULTURA[c],
              num(
                (toneladasPorViagem(c, veiculo) / v.volumeM3) * 1000,
              ),
              num(toneladasPorViagem(c, veiculo)),
            ]),
            ["Fertilizante", num(DENSIDADE.fertilizante * 1000), num(v.volumeM3 * DENSIDADE.fertilizante)],
            ["Cimento", num(DENSIDADE.cimento * 1000), num(v.volumeM3 * DENSIDADE.cimento)],
          ]}
        />
        <Nota>
          Volume pelo graneleiro típico da categoria e densidade aparente de referência. Cargas
          densas, como cimento, esbarram no limite de peso antes de encher o volume — confira
          sempre o PBTC do seu veículo.
        </Nota>
      </Secao>

      {compativeis.length > 0 && (
        <Secao titulo="Modelos PILI que comportam o veículo" fundo="papel">
          <Tabela
            cabecalho={["Modelo", "Plataforma (m)", "Capacidade (t)", "Ciclo (s)", `Veículos por jornada de ${JORNADA_H} h`]}
            numericas={[1, 2, 3, 4]}
            linhas={compativeis.map((t) => [
              <Link
                key={t.slug}
                href={`/produtos/${t.slug}`}
                className="font-semibold text-pili-black underline-offset-2 hover:text-pili-safety hover:underline"
              >
                {t.nome}
              </Link>,
              medida(t.comprimentoM),
              num(t.capacidadeT),
              num(t.cicloS),
              num(veiculosPorHora(t) * JORNADA_H),
            ])}
          />
          <Nota>
            Veículos por jornada considerando o ciclo de tombamento da ficha técnica mais{" "}
            {num(MANOBRA_S / 60)} minutos de manobra entre um veículo e o seguinte.
          </Nota>
        </Secao>
      )}

      <Secao titulo="Outros veículos">
        <Links
          itens={[
            ...VEICULOS_PAGINA.filter((x) => x !== veiculo).map((x) => ({
              href: `/tombador-para/${x}`,
              rotulo: `Tombador para ${NOME_VEICULO[x]}`,
              detalhe: `${medida(VEICULOS[x].comprimentoM)} m`,
            })),
            { href: "/unidade-de-recebimento", rotulo: "Unidade de recebimento por porte" },
          ]}
        />
      </Secao>

      <CtaUnidade
        titulo={`Sua unidade recebe ${NOME_VEICULO[veiculo]}?`}
        texto="Informe volume diário e produto na calculadora e receba a recomendação de modelo."
        hrefCalculadora={`/calculadora?produto=soja&veiculo=${veiculo}`}
        whatsapp={settings.whatsapp}
        mensagem={`Olá! Preciso de um tombador para descarregar ${NOME_VEICULO[veiculo]}.`}
        path={path}
      />
    </>
  );
}
