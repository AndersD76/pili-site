import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/routing";
import {
  CULTURAS,
  EMPRESAS,
  UFS,
  buscarUf,
  cobertura,
  municipiosDaUf,
  saldo,
} from "@/lib/mercado-graos/dados";
import {
  NOME_CULTURA,
  TITULO_CULTURA,
  nomeEmpresa,
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
  FONTE_CONAB,
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

type Params = { locale: string; uf: string };

export function generateStaticParams(): Params[] {
  return UFS.map((u) => ({ locale: "pt-BR", uf: u.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const u = buscarUf((await params).uf);
  if (!u) return {};
  const s = saldo(u.producaoT, u.armazenagem.estatica);
  return generatePageMetadata({
    title: `Armazenagem de grãos em ${u.nome}: ${
      s < 0 ? `déficit de ${toneladasCurto(-s)}` : `capacidade de ${toneladasCurto(u.armazenagem.estatica)}`
    }`,
    description: `${u.nome} colheu ${toneladas(u.producaoT)} de grãos na safra ${ANO} e tem ${num(
      u.armazenagem.unidades,
    )} armazéns cadastrados. Veja o saldo de armazenagem por município, as culturas e as empresas.`,
    path: `/armazenagem/${u.slug}`,
    idiomas: ["pt-BR"],
  });
}

export default async function UfPage({ params }: { params: Promise<Params> }) {
  const { locale, uf } = await params;
  setRequestLocale(locale);
  const u = buscarUf(uf);
  if (!u || locale !== "pt-BR") notFound();
  const settings = await getSiteSettings();

  const path = `/armazenagem/${u.slug}`;
  const a = u.armazenagem;
  const s = saldo(u.producaoT, a.estatica);
  const municipios = municipiosDaUf(u.sigla);

  const deficits = [...municipios]
    .map((m) => ({ m, s: saldo(m.producaoT, m.armazenagem.estatica) }))
    .filter((x) => x.s < 0)
    .sort((x, y) => x.s - y.s);
  const semArmazem = municipios.filter((m) => m.armazenagem.unidades === 0);

  const porMicro = new Map<string, typeof municipios>();
  for (const m of [...municipios].sort((x, y) => x.nome.localeCompare(y.nome, "pt-BR"))) {
    const lista = porMicro.get(m.micro.nome) ?? [];
    lista.push(m);
    porMicro.set(m.micro.nome, lista);
  }

  const empresasNoEstado = EMPRESAS.map((e) => {
    const locais = e.municipios.filter((x) => x.uf === u.sigla);
    return {
      e,
      unidades: locais.reduce((sm, x) => sm + x.unidades, 0),
      estatica: locais.reduce((sm, x) => sm + x.estatica, 0),
    };
  })
    .filter((x) => x.unidades > 0)
    .sort((x, y) => y.estatica - x.estatica)
    .slice(0, 15);

  const culturas = CULTURAS.filter((c) => u.culturas[c]?.t).sort(
    (x, y) => (u.culturas[y]?.t ?? 0) - (u.culturas[x]?.t ?? 0),
  );

  return (
    <>
      <JsonLd
        dados={[
          generateBreadcrumbJsonLd([
            { name: "Início", url: "/pt-BR" },
            { name: "Armazenagem de grãos", url: "/pt-BR/armazenagem" },
            { name: u.nome, url: `/pt-BR${path}` },
          ]),
          generateDatasetJsonLd({
            nome: `Produção e armazenagem de grãos em ${u.nome}`,
            descricao: `Produção de grãos na safra ${ANO} e capacidade estática dos armazéns cadastrados em ${u.nome}, por município.`,
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
          { name: "Armazenagem de grãos", href: "/armazenagem" },
          { name: u.nome },
        ]}
        eyebrow={`Armazenagem de grãos · região ${u.regiao}`}
        titulo={`Armazenagem de grãos em ${u.nome}`}
        lead={
          <p>
            {u.nome} colheu <strong className="text-pili-white">{toneladas(u.producaoT)}</strong>{" "}
            de grãos na safra {ANO} e tem {num(a.unidades)} armazéns cadastrados, com{" "}
            {toneladas(a.estatica)} de capacidade estática —{" "}
            {s < 0 ? (
              <>
                espaço para <strong className="text-pili-white">{pct(cobertura(u.producaoT, a.estatica))}</strong> da
                safra, com <strong className="text-pili-safety">déficit de {toneladas(-s)}</strong>.
              </>
            ) : (
              <>{toneladas(s)} acima da safra do estado.</>
            )}
          </p>
        }
      />

      <Kpis
        itens={[
          { valor: toneladasCurto(u.producaoT), rotulo: `Produção de grãos ${ANO}` },
          { valor: toneladasCurto(a.estatica), rotulo: "Capacidade estática" },
          {
            valor: s < 0 ? `-${toneladasCurto(-s)}` : `+${toneladasCurto(s)}`,
            rotulo: s < 0 ? "Déficit de armazenagem" : "Sobra de armazenagem",
            destaque: s < 0,
          },
          { valor: num(a.unidades), rotulo: "Armazéns cadastrados" },
        ]}
      />

      <Secao titulo={`Produção por cultura — safra ${ANO}`}>
        <Tabela
          cabecalho={["Cultura", "Produção (t)", "Área colhida (ha)", `Variação sobre ${ANO_ANTERIOR}`]}
          numericas={[1, 2, 3]}
          linhas={culturas.map((c) => {
            const d = u.culturas[c]!;
            return [
              d.pagina ? (
                <Link
                  key={c}
                  href={`/producao/${c}/${u.slug}`}
                  className="font-semibold text-pili-black underline-offset-2 hover:text-pili-safety hover:underline"
                >
                  {TITULO_CULTURA[c]}
                </Link>
              ) : (
                TITULO_CULTURA[c]
              ),
              num(d.t),
              num(d.ha),
              variacao(d.t, d.tAnterior) ?? "—",
            ];
          })}
        />
        <Fonte itens={[FONTE_IBGE]} />
      </Secao>

      {deficits.length > 0 && (
        <Secao titulo={`Maiores déficits de armazenagem em ${u.nome}`} fundo="papel">
          <Tabela
            cabecalho={["Município", "Produção (t)", "Capacidade (t)", "Déficit (t)", "Armazéns"]}
            numericas={[1, 2, 3, 4]}
            linhas={deficits.slice(0, 20).map(({ m, s: sm }) => [
              <Link
                key={m.cod}
                href={`/armazenagem/${u.slug}/${m.slug}`}
                className="text-pili-black underline-offset-2 hover:text-pili-safety hover:underline"
              >
                {m.nome}
              </Link>,
              num(m.producaoT),
              num(m.armazenagem.estatica),
              num(-sm),
              num(m.armazenagem.unidades),
            ])}
          />
          <Fonte itens={[FONTE_IBGE, FONTE_CONAB]} />
        </Secao>
      )}

      {semArmazem.length > 0 && (
        <Secao titulo="Municípios que colhem e não têm armazém cadastrado">
          <p className="mb-4 max-w-3xl text-pili-steel">
            Estes {num(semArmazem.length)} municípios de {u.nome} colheram mais de 10 mil t na
            safra {ANO} e não têm nenhuma unidade no cadastro da Conab.
          </p>
          <Links
            itens={semArmazem.map((m) => ({
              href: `/armazenagem/${u.slug}/${m.slug}`,
              rotulo: m.nome,
              detalhe: toneladasCurto(m.producaoT),
            }))}
          />
        </Secao>
      )}

      {empresasNoEstado.length > 0 && (
        <Secao titulo={`Maiores armazenadores em ${u.nome}`} fundo="papel">
          <Tabela
            cabecalho={["Empresa", "Armazéns no estado", "Capacidade no estado (t)"]}
            numericas={[1, 2]}
            linhas={empresasNoEstado.map((x) => [
              <Link
                key={x.e.slug}
                href={`/armazenadores/${x.e.slug}`}
                className="text-pili-black underline-offset-2 hover:text-pili-safety hover:underline"
              >
                {nomeEmpresa(x.e.nome)}
              </Link>,
              num(x.unidades),
              num(x.estatica),
            ])}
          />
          <Fonte itens={[FONTE_CONAB]} />
        </Secao>
      )}

      <Secao titulo={`Todos os municípios produtores de ${u.nome}`}>
        <div className="space-y-8">
          {[...porMicro.entries()].map(([micro, lista]) => (
            <div key={micro}>
              <h3 className="mb-2 font-mono text-xs uppercase tracking-widest text-pili-concrete">
                Microrregião {micro}
              </h3>
              <Links
                itens={lista.map((m) => ({
                  href: `/armazenagem/${u.slug}/${m.slug}`,
                  rotulo: m.nome,
                  detalhe: toneladasCurto(m.producaoT),
                }))}
                colunas={4}
              />
            </div>
          ))}
        </div>
      </Secao>

      <Secao titulo="Outros estados" fundo="papel">
        <Links
          itens={UFS.filter((x) => x.sigla !== u.sigla).map((x) => ({
            href: `/armazenagem/${x.slug}`,
            rotulo: x.nome,
            detalhe: toneladasCurto(x.producaoT),
          }))}
          colunas={4}
        />
      </Secao>

      <CtaUnidade
        titulo={`Nova unidade de recebimento em ${u.nome}?`}
        texto="A PILI fabrica tombadores de 10 a 30 metros e dimensiona a recepção para a safra da sua região."
        hrefCalculadora={`/calculadora?produto=${culturas[0] === "milho" ? "milho" : "soja"}&veiculo=bitrem`}
        whatsapp={settings.whatsapp}
        mensagem={`Olá! Quero planejar uma unidade de recebimento de grãos em ${u.nome}.`}
        path={path}
      />
    </>
  );
}
