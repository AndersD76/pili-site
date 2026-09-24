import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/routing";
import { BRASIL, EMPRESAS } from "@/lib/mercado-graos/dados";
import { nomeEmpresa, num, toneladas, toneladasCurto } from "@/lib/mercado-graos/formato";
import { ATUALIZADO_EM, FONTE_CONAB } from "@/lib/mercado-graos/fontes";
import {
  Cabecalho,
  Fonte,
  JsonLd,
  Kpis,
  Secao,
  Tabela,
} from "@/components/mercado-graos/blocos";
import {
  generateBreadcrumbJsonLd,
  generateDatasetJsonLd,
  generatePageMetadata,
} from "@/lib/seo";

export const revalidate = 86400;
export const dynamicParams = false;

export function generateStaticParams() {
  return [{ locale: "pt-BR" }];
}

/** Redes na tabela; as demais vão para a lista compacta, que pesa bem menos por item. */
const NA_TABELA = 100;

export const metadata: Metadata = generatePageMetadata({
  title: "Maiores empresas armazenadoras de grãos do Brasil",
  description: `As ${num(EMPRESAS.length)} maiores redes de armazéns de grãos cadastradas na Conab: unidades, capacidade estática e estados de cada uma.`,
  path: "/armazenadores",
  idiomas: ["pt-BR"],
  marca: false,
});

export default async function ArmazenadoresPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  if (locale !== "pt-BR") notFound();

  const somaRedes = EMPRESAS.reduce((s, e) => s + e.estatica, 0);
  const demais = EMPRESAS.slice(NA_TABELA)
    .map((e) => ({ slug: e.slug, nome: nomeEmpresa(e.nome) }))
    .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));

  return (
    <>
      <JsonLd
        dados={[
          generateBreadcrumbJsonLd([
            { name: "Início", url: "/pt-BR" },
            { name: "Empresas armazenadoras", url: "/pt-BR/armazenadores" },
          ]),
          generateDatasetJsonLd({
            nome: "Empresas armazenadoras de grãos do Brasil",
            descricao: "Redes de armazéns cadastradas na Conab com três ou mais unidades em mais de um município.",
            path: "/armazenadores",
            atualizadoEm: ATUALIZADO_EM,
            fontes: [{ nome: "Conab — SICARM", url: FONTE_CONAB.url }],
            locais: ["Brasil"],
          }),
        ]}
      />

      <Cabecalho
        trilha={[{ name: "Início", href: "/" }, { name: "Empresas armazenadoras" }]}
        eyebrow="Cadastro Conab · pessoas jurídicas"
        titulo="Empresas armazenadoras de grãos"
        lead={
          <p>
            As {num(EMPRESAS.length)} redes com três ou mais armazéns em mais de um município somam{" "}
            <strong className="text-pili-white">{toneladas(somaRedes)}</strong> de capacidade
            estática — {Math.round((somaRedes / BRASIL.armazenagem.estatica) * 100)}% de tudo o
            que está cadastrado no país.
          </p>
        }
      />

      <Kpis
        itens={[
          { valor: num(EMPRESAS.length), rotulo: "Redes analisadas" },
          { valor: toneladasCurto(somaRedes), rotulo: "Capacidade das redes", destaque: true },
          { valor: num(EMPRESAS.reduce((s, e) => s + e.unidades, 0)), rotulo: "Armazéns das redes" },
          { valor: toneladasCurto(BRASIL.armazenagem.estatica), rotulo: "Capacidade no país" },
        ]}
      />

      <Secao titulo={`As ${NA_TABELA} maiores redes por capacidade estática`}>
        <Tabela
          cabecalho={["#", "Empresa", "Armazéns", "Municípios", "Estados", "Capacidade (t)"]}
          numericas={[0, 2, 3, 5]}
          linhas={EMPRESAS.slice(0, NA_TABELA).map((e, i) => [
            num(i + 1),
            <Link
              key={e.slug}
              href={`/armazenadores/${e.slug}`}
              className="text-pili-black underline-offset-2 hover:text-pili-safety hover:underline"
            >
              {nomeEmpresa(e.nome)}
            </Link>,
            num(e.unidades),
            num(e.municipios.length),
            e.ufs.join(", "),
            num(e.estatica),
          ])}
        />
        <Fonte itens={[FONTE_CONAB]} />
      </Secao>

      {demais.length > 0 && (
        <Secao titulo={`Demais ${num(demais.length)} redes, de A a Z`} fundo="papel">
          <ul className="columns-1 gap-8 text-sm sm:columns-2 lg:columns-3">
            {demais.map((e) => (
              <li key={e.slug} className="break-inside-avoid py-1">
                <Link href={`/armazenadores/${e.slug}`} className="text-pili-black hover:text-pili-safety">
                  {e.nome}
                </Link>
              </li>
            ))}
          </ul>
        </Secao>
      )}
    </>
  );
}
