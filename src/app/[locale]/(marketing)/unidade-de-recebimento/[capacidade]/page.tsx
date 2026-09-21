import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/routing";
import type { TipoVeiculo } from "@/lib/calculadora";
import {
  PORTES,
  buscarPorte,
  slugPorte,
  type Cultura,
} from "@/lib/mercado-graos/dados";
import { NOME_CULTURA, TITULO_CULTURA, num } from "@/lib/mercado-graos/formato";
import { ATUALIZADO_EM, FONTE_CONAB, FONTE_IBGE } from "@/lib/mercado-graos/fontes";
import {
  DENSIDADE_CULTURA,
  JANELAS,
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
  Fonte,
  JsonLd,
  Kpis,
  Links,
  Nota,
  Secao,
  Tabela,
} from "@/components/mercado-graos/blocos";
import {
  generateBreadcrumbJsonLd,
  generateDatasetJsonLd,
  generatePageMetadata,
} from "@/lib/seo";
import { getSiteSettings } from "@/lib/site-settings";

export const revalidate = 86400;
export const dynamicParams = false;

type Params = { locale: string; capacidade: string };

const CULTURAS_PORTE: Cultura[] = ["soja", "milho", "trigo"];
const VEICULOS_PORTE: TipoVeiculo[] = ["carreta", "bitrem", "rodotrem"];

export function generateStaticParams(): Params[] {
  return PORTES.map((p) => ({ locale: "pt-BR", capacidade: slugPorte(p.sacas) }));
}

function rotulo(sacas: number) {
  return `${num(sacas / 1000)} mil sacas`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const p = buscarPorte((await params).capacidade);
  if (!p) return {};
  return generatePageMetadata({
    title: `Unidade de recebimento para ${rotulo(p.sacas)}: capacidade, cargas e tombador`,
    description: `Um armazém de ${rotulo(p.sacas)} guarda ${num(p.t)} t de grãos. Veja quantas carretas e bitrens enchem a unidade, a recepção necessária na colheita e o tombador indicado.`,
    path: `/unidade-de-recebimento/${slugPorte(p.sacas)}`,
    idiomas: ["pt-BR"],
  });
}

export default async function PortePage({ params }: { params: Promise<Params> }) {
  const { locale, capacidade } = await params;
  setRequestLocale(locale);
  const p = buscarPorte(capacidade);
  if (!p || locale !== "pt-BR") notFound();

  const [settings, tombadores] = await Promise.all([
    getSiteSettings(),
    tombadoresPublicados(),
  ]);

  const path = `/unidade-de-recebimento/${slugPorte(p.sacas)}`;
  const modeloBitrem = tombadorParaVeiculo(tombadores, "bitrem");
  const modeloRodotrem = tombadorParaVeiculo(tombadores, "rodotrem");

  return (
    <>
      <JsonLd
        dados={[
          generateBreadcrumbJsonLd([
            { name: "Início", url: "/pt-BR" },
            { name: "Unidade de recebimento", url: "/pt-BR/unidade-de-recebimento" },
            { name: rotulo(p.sacas), url: `/pt-BR${path}` },
          ]),
          generateDatasetJsonLd({
            nome: `Armazéns de ${rotulo(p.sacas)} no Brasil`,
            descricao: `Quantidade de armazéns cadastrados com capacidade próxima de ${num(p.t)} t e dimensionamento da recepção para esse porte.`,
            path,
            atualizadoEm: ATUALIZADO_EM,
            fontes: [{ nome: "Conab — SICARM", url: FONTE_CONAB.url }],
          }),
        ]}
      />

      <Cabecalho
        trilha={[
          { name: "Início", href: "/" },
          { name: "Unidade de recebimento", href: "/unidade-de-recebimento" },
          { name: rotulo(p.sacas) },
        ]}
        eyebrow="Dimensionamento de unidade"
        titulo={`Unidade de recebimento para ${rotulo(p.sacas)}`}
        lead={
          <p>
            {rotulo(p.sacas)} de 60 kg são{" "}
            <strong className="text-pili-white">{num(p.t)} toneladas</strong> de grão. O cadastro
            da Conab tem <strong className="text-pili-white">{num(p.armazensParecidos)} armazéns</strong>{" "}
            desse porte no país (entre {num(p.t * 0.75)} e {num(p.t * 1.25)} t), e{" "}
            {num(p.municipiosComDeficitMaior)} municípios têm déficit de armazenagem maior do que
            uma unidade inteira como esta.
          </p>
        }
      />

      <Kpis
        itens={[
          { valor: `${num(p.t)} t`, rotulo: "Capacidade da unidade", destaque: true },
          { valor: num(p.armazensParecidos), rotulo: "Armazéns desse porte no país" },
          { valor: num(p.granel), rotulo: "Deles, a granel" },
          { valor: num(p.municipiosComDeficitMaior), rotulo: "Municípios com déficit maior" },
        ]}
      />

      <Secao titulo="Quanto grão e quantas cargas cabem">
        <Tabela
          cabecalho={[
            "Cultura",
            "Volume (m³)",
            ...VEICULOS_PORTE.map((v) => `Cargas de ${NOME_VEICULO[v]}`),
          ]}
          numericas={[1, 2, 3, 4]}
          linhas={CULTURAS_PORTE.map((c) => [
            TITULO_CULTURA[c],
            num(p.t / DENSIDADE_CULTURA[c]),
            ...VEICULOS_PORTE.map((v) => num(Math.ceil(p.t / toneladasPorViagem(c, v)))),
          ])}
        />
        <Nota>
          Densidade de referência a granel: soja {num(DENSIDADE_CULTURA.soja * 1000)}, milho{" "}
          {num(DENSIDADE_CULTURA.milho * 1000)} e trigo {num(DENSIDADE_CULTURA.trigo * 1000)} kg/m³.
          Volume do veículo pelo graneleiro típico de cada categoria.
        </Nota>
      </Secao>

      <Secao titulo="Recepção para encher a unidade na colheita" fundo="papel">
        <Tabela
          cabecalho={["Janela", "Toneladas por dia", ...CULTURAS_PORTE.map((c) => `Bitrens/dia — ${NOME_CULTURA[c]}`)]}
          numericas={[1, 2, 3, 4]}
          linhas={JANELAS.map((dias) => [
            `${dias} dias`,
            num(p.t / dias),
            ...CULTURAS_PORTE.map((c) => num(Math.ceil(p.t / dias / toneladasPorViagem(c, "bitrem")))),
          ])}
        />
        {modeloBitrem ? (
          <p className="mt-6 max-w-3xl text-pili-steel">
            Para bitrem, o menor modelo do catálogo que comporta o veículo é o{" "}
            <Link
              href={`/produtos/${modeloBitrem.slug}`}
              className="font-semibold text-pili-black underline underline-offset-2 hover:text-pili-safety"
            >
              {modeloBitrem.nome}
            </Link>
            , que descarrega cerca de {num(veiculosPorHora(modeloBitrem))} veículos por hora
            {" "}({num(veiculosPorHora(modeloBitrem) * JORNADA_H)} por jornada de {JORNADA_H} h).
            {modeloRodotrem && modeloRodotrem.slug !== modeloBitrem.slug ? (
              <>
                {" "}Para rodotrem, o{" "}
                <Link
                  href={`/produtos/${modeloRodotrem.slug}`}
                  className="font-semibold text-pili-black underline underline-offset-2 hover:text-pili-safety"
                >
                  {modeloRodotrem.nome}
                </Link>
                .
              </>
            ) : null}
          </p>
        ) : null}
        <Nota>
          Cenário, não medição: janela de colheita, jornada de {JORNADA_H} h e ciclo de
          descarga com 3 minutos de manobra entre veículos.
        </Nota>
      </Secao>

      <Secao titulo="Outros portes">
        <Links
          itens={PORTES.filter((x) => x.sacas !== p.sacas).map((x) => ({
            href: `/unidade-de-recebimento/${slugPorte(x.sacas)}`,
            rotulo: `Unidade para ${rotulo(x.sacas)}`,
            detalhe: `${num(x.t)} t`,
          }))}
        />
        <Fonte itens={[FONTE_CONAB, FONTE_IBGE]} />
      </Secao>

      <CtaUnidade
        titulo={`Projeto de ${rotulo(p.sacas)}?`}
        texto="A engenharia da PILI dimensiona o tombador e a moega para o porte e o veículo da sua unidade."
        hrefCalculadora="/calculadora?produto=soja&veiculo=bitrem"
        whatsapp={settings.whatsapp}
        mensagem={`Olá! Estou planejando uma unidade de ${rotulo(p.sacas)} e quero dimensionar a recepção.`}
        path={path}
      />
    </>
  );
}
