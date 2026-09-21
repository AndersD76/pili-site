import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { PORTES, slugPorte } from "@/lib/mercado-graos/dados";
import { num } from "@/lib/mercado-graos/formato";
import { FONTE_CONAB } from "@/lib/mercado-graos/fontes";
import {
  Cabecalho,
  Fonte,
  JsonLd,
  Links,
  Secao,
  Tabela,
} from "@/components/mercado-graos/blocos";
import { Link } from "@/i18n/routing";
import { generateBreadcrumbJsonLd, generatePageMetadata } from "@/lib/seo";

export const revalidate = 86400;
export const dynamicParams = false;

export function generateStaticParams() {
  return [{ locale: "pt-BR" }];
}

export const metadata: Metadata = generatePageMetadata({
  title: "Unidade de recebimento de grãos por porte: de 10 mil a 500 mil sacas",
  description:
    "Quanto grão cabe, quantas cargas enchem e que recepção cada porte de unidade exige — de 10 mil a 500 mil sacas, com o número de armazéns de cada porte no país.",
  path: "/unidade-de-recebimento",
  idiomas: ["pt-BR"],
});

export default async function PortesPage({
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
            { name: "Unidade de recebimento", url: "/pt-BR/unidade-de-recebimento" },
          ]),
        ]}
      />
      <Cabecalho
        trilha={[{ name: "Início", href: "/" }, { name: "Unidade de recebimento" }]}
        eyebrow="Dimensionamento de unidade"
        titulo="Unidade de recebimento por porte"
        lead={
          <p>
            Escolha o porte da unidade em sacas de 60 kg para ver a capacidade em toneladas, as
            cargas que a enchem, a recepção necessária na colheita e o tombador indicado.
          </p>
        }
      />
      <Secao titulo="Portes de unidade">
        <Tabela
          cabecalho={["Porte", "Capacidade (t)", "Armazéns desse porte no país", "Municípios com déficit maior"]}
          numericas={[1, 2, 3]}
          linhas={PORTES.map((p) => [
            <Link
              key={p.sacas}
              href={`/unidade-de-recebimento/${slugPorte(p.sacas)}`}
              className="font-semibold text-pili-black underline-offset-2 hover:text-pili-safety hover:underline"
            >
              {num(p.sacas / 1000)} mil sacas
            </Link>,
            num(p.t),
            num(p.armazensParecidos),
            num(p.municipiosComDeficitMaior),
          ])}
        />
        <Fonte itens={[FONTE_CONAB]} />
      </Secao>
      <Secao titulo="Mais ferramentas" fundo="papel">
        <Links
          itens={[
            { href: "/armazenagem", rotulo: "Armazenagem de grãos no Brasil" },
            { href: "/tombador-para", rotulo: "Tombador por tipo de veículo" },
            { href: "/calculadora", rotulo: "Calculadora de capacidade" },
          ]}
        />
      </Secao>
    </>
  );
}
