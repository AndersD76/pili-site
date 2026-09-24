import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/routing";
import {
  CULTURAS,
  UFS,
  municipiosComCultura,
  producaoBrasil,
  type Cultura,
} from "@/lib/mercado-graos/dados";
import {
  NOME_CULTURA,
  TITULO_CULTURA,
  num,
  pct,
  toneladas,
  toneladasCurto,
  variacao,
} from "@/lib/mercado-graos/formato";
import {
  ANO,
  ANO_ANTERIOR,
  ATUALIZADO_EM,
  FONTES_DATASET,
  FONTE_IBGE,
} from "@/lib/mercado-graos/fontes";
import {
  Cabecalho,
  CtaUnidade,
  Fonte,
  JsonLd,
  Kpis,
  Links,
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

type Params = { locale: string; cultura: string };

export function generateStaticParams(): Params[] {
  return CULTURAS.map((cultura) => ({ locale: "pt-BR", cultura }));
}

function valida(c: string): c is Cultura {
  return CULTURAS.includes(c as Cultura);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { cultura } = await params;
  if (!valida(cultura)) return {};
  return generatePageMetadata({
    title: `Produção de ${NOME_CULTURA[cultura]} no Brasil em ${ANO}: ${toneladasCurto(producaoBrasil(cultura))} por estado e município`,
    description: `Quanto cada estado e município produziu de ${NOME_CULTURA[cultura]} na safra ${ANO}, com área colhida, variação sobre ${ANO_ANTERIOR} e ranking dos maiores produtores.`,
    path: `/producao/${cultura}`,
    idiomas: ["pt-BR"],
    marca: false,
  });
}

export default async function CulturaPage({ params }: { params: Promise<Params> }) {
  const { locale, cultura } = await params;
  setRequestLocale(locale);
  if (!valida(cultura) || locale !== "pt-BR") notFound();
  const settings = await getSiteSettings();

  const path = `/producao/${cultura}`;
  const total = producaoBrasil(cultura);
  const totalAnterior = UFS.reduce((s, u) => s + (u.culturas[cultura]?.tAnterior ?? 0), 0);
  const area = UFS.reduce((s, u) => s + (u.culturas[cultura]?.ha ?? 0), 0);
  const estados = UFS.filter((u) => u.culturas[cultura]?.t).sort(
    (a, b) => (b.culturas[cultura]?.t ?? 0) - (a.culturas[cultura]?.t ?? 0),
  );
  const municipios = municipiosComCultura(cultura);

  return (
    <>
      <JsonLd
        dados={[
          generateBreadcrumbJsonLd([
            { name: "Início", url: "/pt-BR" },
            { name: `Produção de ${NOME_CULTURA[cultura]}`, url: `/pt-BR${path}` },
          ]),
          generateDatasetJsonLd({
            nome: `Produção de ${NOME_CULTURA[cultura]} no Brasil — safra ${ANO}`,
            descricao: `Produção de ${NOME_CULTURA[cultura]} por estado e município na safra ${ANO}.`,
            path,
            atualizadoEm: ATUALIZADO_EM,
            fontes: FONTES_DATASET,
            locais: ["Brasil"],
          }),
        ]}
      />

      <Cabecalho
        trilha={[{ name: "Início", href: "/" }, { name: `Produção de ${NOME_CULTURA[cultura]}` }]}
        eyebrow={`${TITULO_CULTURA[cultura]} · safra ${ANO}`}
        titulo={`Produção de ${NOME_CULTURA[cultura]} no Brasil`}
        lead={
          <p>
            O Brasil colheu <strong className="text-pili-white">{toneladas(total)}</strong> de{" "}
            {NOME_CULTURA[cultura]} na safra {ANO}, em {num(area)} hectares
            {variacao(total, totalAnterior) ? <> — {variacao(total, totalAnterior)} sobre {ANO_ANTERIOR}</> : null}.{" "}
            {num(municipios.length)} municípios colheram mais de 10 mil t.
          </p>
        }
      />

      <Kpis
        itens={[
          { valor: toneladasCurto(total), rotulo: `${TITULO_CULTURA[cultura]} ${ANO}`, destaque: true },
          { valor: `${num(area)} ha`, rotulo: "Área colhida" },
          { valor: variacao(total, totalAnterior) ?? "—", rotulo: `Sobre ${ANO_ANTERIOR}` },
          { valor: num(municipios.length), rotulo: "Municípios acima de 10 mil t" },
        ]}
      />

      <Secao titulo="Produção por estado">
        <Tabela
          cabecalho={["Estado", "Produção (t)", "Área colhida (ha)", "Participação", `Variação sobre ${ANO_ANTERIOR}`]}
          numericas={[1, 2, 3, 4]}
          linhas={estados.map((u) => {
            const d = u.culturas[cultura]!;
            return [
              d.pagina ? (
                <Link
                  key={u.sigla}
                  href={`/producao/${cultura}/${u.slug}`}
                  className="font-semibold text-pili-black underline-offset-2 hover:text-pili-safety hover:underline"
                >
                  {u.nome}
                </Link>
              ) : (
                u.nome
              ),
              num(d.t),
              num(d.ha),
              pct(d.t / total, 1),
              variacao(d.t, d.tAnterior) ?? "—",
            ];
          })}
        />
        <Fonte itens={[FONTE_IBGE]} />
      </Secao>

      <Secao titulo={`Os 40 maiores municípios produtores de ${NOME_CULTURA[cultura]}`} fundo="papel">
        <Links
          itens={municipios.slice(0, 40).map((m) => ({
            href: `/producao/${cultura}/${m.uf.toLowerCase()}/${m.slug}`,
            rotulo: `${m.nome} (${m.uf})`,
            detalhe: toneladasCurto(m.culturas[cultura]!.t),
          }))}
        />
      </Secao>

      <Secao titulo="Outras culturas">
        <Links
          itens={[
            ...CULTURAS.filter((c) => c !== cultura).map((c) => ({
              href: `/producao/${c}`,
              rotulo: `Produção de ${NOME_CULTURA[c]}`,
              detalhe: toneladasCurto(producaoBrasil(c)),
            })),
            { href: "/armazenagem", rotulo: "Armazenagem de grãos no Brasil" },
          ]}
        />
      </Secao>

      <CtaUnidade
        titulo={`Recepção de ${NOME_CULTURA[cultura]} sem fila`}
        texto="Tombadores PILI de 10 a 30 metros, dimensionados para a safra que a sua unidade recebe."
        hrefCalculadora={`/calculadora?produto=${cultura === "arroz" || cultura === "feijao" ? "soja" : cultura}&veiculo=bitrem`}
        whatsapp={settings.whatsapp}
        mensagem={`Olá! Quero dimensionar a recepção de ${NOME_CULTURA[cultura]} da minha unidade.`}
        path={path}
      />
    </>
  );
}
