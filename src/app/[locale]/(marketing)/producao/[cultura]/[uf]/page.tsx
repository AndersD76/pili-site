import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/routing";
import {
  CULTURAS,
  UFS,
  buscarUf,
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

type Params = { locale: string; cultura: string; uf: string };

export function generateStaticParams(): Params[] {
  const params: Params[] = [];
  for (const u of UFS) {
    for (const c of CULTURAS) {
      if (u.culturas[c]?.pagina) params.push({ locale: "pt-BR", cultura: c, uf: u.slug });
    }
  }
  return params;
}

function carregar(p: { cultura: string; uf: string }) {
  if (!CULTURAS.includes(p.cultura as Cultura)) return null;
  const cultura = p.cultura as Cultura;
  const u = buscarUf(p.uf);
  const d = u?.culturas[cultura];
  if (!u || !d?.pagina) return null;
  return { cultura, u, d };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const dados = carregar(await params);
  if (!dados) return {};
  const { cultura, u, d } = dados;
  return generatePageMetadata({
    title: `Produção de ${NOME_CULTURA[cultura]} em ${u.nome} em ${ANO}: ${toneladasCurto(d.t)} por município`,
    description: `${u.nome} colheu ${toneladas(d.t)} de ${NOME_CULTURA[cultura]} na safra ${ANO}. Veja a produção, área e rendimento de cada município e o ranking do estado.`,
    path: `/producao/${cultura}/${u.slug}`,
    idiomas: ["pt-BR"],
  });
}

export default async function CulturaUfPage({ params }: { params: Promise<Params> }) {
  const p = await params;
  setRequestLocale(p.locale);
  const dados = carregar(p);
  if (!dados || p.locale !== "pt-BR") notFound();
  const { cultura, u, d } = dados;
  const settings = await getSiteSettings();

  const path = `/producao/${cultura}/${u.slug}`;
  const municipios = municipiosComCultura(cultura, u.sigla);
  const brasil = producaoBrasil(cultura);
  const rankBr =
    [...UFS]
      .sort((a, b) => (b.culturas[cultura]?.t ?? 0) - (a.culturas[cultura]?.t ?? 0))
      .findIndex((x) => x.sigla === u.sigla) + 1;
  const outras = CULTURAS.filter((c) => c !== cultura && u.culturas[c]?.pagina);

  return (
    <>
      <JsonLd
        dados={[
          generateBreadcrumbJsonLd([
            { name: "Início", url: "/pt-BR" },
            { name: `Produção de ${NOME_CULTURA[cultura]}`, url: `/pt-BR/producao/${cultura}` },
            { name: u.nome, url: `/pt-BR${path}` },
          ]),
          generateDatasetJsonLd({
            nome: `Produção de ${NOME_CULTURA[cultura]} em ${u.nome} — safra ${ANO}`,
            descricao: `Produção, área colhida e rendimento de ${NOME_CULTURA[cultura]} por município de ${u.nome}.`,
            path,
            atualizadoEm: ATUALIZADO_EM,
            fontes: FONTES_DATASET,
            locais: [`${u.nome}, Brasil`],
          }),
        ]}
      />

      <Cabecalho
        trilha={[
          { name: "Início", href: "/" },
          { name: `Produção de ${NOME_CULTURA[cultura]}`, href: `/producao/${cultura}` },
          { name: u.nome },
        ]}
        eyebrow={`${TITULO_CULTURA[cultura]} · safra ${ANO}`}
        titulo={`Produção de ${NOME_CULTURA[cultura]} em ${u.nome}`}
        lead={
          <p>
            {u.nome} colheu <strong className="text-pili-white">{toneladas(d.t)}</strong> de{" "}
            {NOME_CULTURA[cultura]} na safra {ANO}, em {num(d.ha)} hectares
            {variacao(d.t, d.tAnterior) ? <> — {variacao(d.t, d.tAnterior)} sobre {ANO_ANTERIOR}</> : null}.
            É o <strong className="text-pili-white">{rankBr}º estado</strong> produtor, com{" "}
            {pct(d.t / brasil, 1)} da safra nacional.
          </p>
        }
      />

      <Kpis
        itens={[
          { valor: toneladasCurto(d.t), rotulo: `${TITULO_CULTURA[cultura]} ${ANO}`, destaque: true },
          { valor: `${num(d.ha)} ha`, rotulo: "Área colhida" },
          { valor: d.ha ? `${num((d.t / d.ha) * 1000)} kg/ha` : "—", rotulo: "Rendimento médio" },
          { valor: pct(d.t / brasil, 1), rotulo: "Da produção nacional" },
        ]}
      />

      <Secao titulo={`Municípios produtores de ${NOME_CULTURA[cultura]} em ${u.nome}`}>
        <Tabela
          cabecalho={["#", "Município", "Produção (t)", "Área (ha)", "Rendimento (kg/ha)", `Variação sobre ${ANO_ANTERIOR}`]}
          numericas={[0, 2, 3, 4, 5]}
          linhas={municipios.map((m, i) => {
            const dm = m.culturas[cultura]!;
            return [
              num(i + 1),
              <Link
                key={m.cod}
                href={`/producao/${cultura}/${u.slug}/${m.slug}`}
                className="text-pili-black underline-offset-2 hover:text-pili-safety hover:underline"
              >
                {m.nome}
              </Link>,
              num(dm.t),
              dm.ha !== null ? num(dm.ha) : "—",
              dm.kgHa !== null ? num(dm.kgHa) : "—",
              variacao(dm.t, dm.tAnterior) ?? "—",
            ];
          })}
        />
        <Fonte itens={[FONTE_IBGE]} />
      </Secao>

      <Secao titulo="Continue explorando" fundo="papel">
        <Links
          itens={[
            { href: `/armazenagem/${u.slug}`, rotulo: `Armazenagem de grãos em ${u.nome}` },
            ...outras.map((c) => ({
              href: `/producao/${c}/${u.slug}`,
              rotulo: `Produção de ${NOME_CULTURA[c]} em ${u.nome}`,
              detalhe: toneladasCurto(u.culturas[c]!.t),
            })),
            { href: `/producao/${cultura}`, rotulo: `Produção de ${NOME_CULTURA[cultura]} no Brasil` },
          ]}
        />
      </Secao>

      <CtaUnidade
        titulo={`Unidade de recebimento de ${NOME_CULTURA[cultura]} em ${u.nome}`}
        texto="Tombadores PILI de 10 a 30 metros, dimensionados para a safra que a sua unidade recebe."
        hrefCalculadora={`/calculadora?produto=${cultura === "arroz" || cultura === "feijao" ? "soja" : cultura}&veiculo=bitrem`}
        whatsapp={settings.whatsapp}
        mensagem={`Olá! Quero dimensionar a recepção de ${NOME_CULTURA[cultura]} para uma unidade em ${u.nome}.`}
        path={path}
      />
    </>
  );
}
