import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { VEICULOS, type TipoVeiculo } from "@/lib/calculadora";
import { medida, num } from "@/lib/mercado-graos/formato";
import { NOME_VEICULO } from "@/lib/mercado-graos/logistica";
import { Cabecalho, JsonLd, Links, Secao } from "@/components/mercado-graos/blocos";
import { generateBreadcrumbJsonLd, generatePageMetadata } from "@/lib/seo";

export const revalidate = 86400;
export const dynamicParams = false;

export function generateStaticParams() {
  return [{ locale: "pt-BR" }];
}

export const metadata: Metadata = generatePageMetadata({
  title: "Tombador por tipo de veículo: caminhão, carreta, bitrem e rodotrem",
  description:
    "Qual tombador descarrega cada composição rodoviária: comprimento e peso pelo CONTRAN, toneladas por viagem e os modelos PILI compatíveis.",
  path: "/tombador-para",
  idiomas: ["pt-BR"],
});

const VEICULOS_PAGINA: TipoVeiculo[] = ["caminhao", "carreta", "bitrem", "rodotrem"];

export default async function TombadorParaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  if (locale !== "pt-BR") notFound();

  return (
    <>
      <JsonLd
        dados={[
          generateBreadcrumbJsonLd([
            { name: "Início", url: "/pt-BR" },
            { name: "Tombador por veículo", url: "/pt-BR/tombador-para" },
          ]),
        ]}
      />
      <Cabecalho
        trilha={[{ name: "Início", href: "/" }, { name: "Tombador por veículo" }]}
        eyebrow="Tombador por tipo de veículo"
        titulo="Tombador para cada veículo"
        lead={
          <p>
            O comprimento da plataforma e a capacidade do tombador partem do maior veículo que a
            unidade recebe. Escolha a composição para ver os limites do CONTRAN e os modelos que
            a comportam.
          </p>
        }
      />
      <Secao titulo="Composições">
        <Links
          itens={VEICULOS_PAGINA.map((v) => ({
            href: `/tombador-para/${v}`,
            rotulo: `Tombador para ${NOME_VEICULO[v]}`,
            detalhe: `${medida(VEICULOS[v].comprimentoM)} m · ${num(VEICULOS[v].pbtcT)} t`,
          }))}
          colunas={2}
        />
      </Secao>
    </>
  );
}
