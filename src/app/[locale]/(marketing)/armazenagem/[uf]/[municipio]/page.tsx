import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/routing";
import {
  CULTURAS,
  MUNICIPIOS,
  buscarMunicipio,
  buscarUf,
  cobertura,
  municipiosDaUf,
  posicao,
  saldo,
  vizinhos,
  type Cultura,
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
  JORNADA_H,
  cenariosDeRecepcao,
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

// Estático no build; revalidado uma vez por dia só para o cabeçalho e o rodapé
// acompanharem o painel. O dado muda quando o retrato da base muda (deploy).
export const revalidate = 86400;
export const dynamicParams = false;

type Params = { locale: string; uf: string; municipio: string };

export function generateStaticParams(): Params[] {
  return MUNICIPIOS.map((m) => ({
    locale: "pt-BR",
    uf: m.uf.toLowerCase(),
    municipio: m.slug,
  }));
}

function caminho(uf: string, slug: string) {
  return `/armazenagem/${uf.toLowerCase()}/${slug}`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { uf, municipio } = await params;
  const m = buscarMunicipio(uf, municipio);
  if (!m) return {};
  const s = saldo(m.producaoT, m.armazenagem.estatica);
  return generatePageMetadata({
    title: `Armazenagem de grãos em ${m.nome} (${m.uf}): ${
      s < 0 ? `déficit de ${toneladasCurto(-s)}` : `sobra de ${toneladasCurto(s)}`
    }`,
    description: `${m.nome} (${m.uf}) colheu ${toneladas(m.producaoT)} de grãos na safra ${ANO} e tem ${num(
      m.armazenagem.unidades,
    )} armazéns com ${toneladas(m.armazenagem.estatica)} de capacidade. Veja o saldo, as culturas e a recepção necessária.`,
    path: caminho(m.uf, m.slug),
    idiomas: ["pt-BR"],
  });
}

export default async function MunicipioPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { locale, uf, municipio } = await params;
  setRequestLocale(locale);
  const m = buscarMunicipio(uf, municipio);
  const estado = buscarUf(uf);
  if (!m || !estado || locale !== "pt-BR") notFound();

  const [settings, tombadores] = await Promise.all([
    getSiteSettings(),
    tombadoresPublicados(),
  ]);

  const path = caminho(m.uf, m.slug);
  const a = m.armazenagem;
  const s = saldo(m.producaoT, a.estatica);
  const cob = cobertura(m.producaoT, a.estatica);
  const doEstado = municipiosDaUf(m.uf);
  const rank = posicao(doEstado, m, (x) => x.producaoT);

  const culturas = CULTURAS.filter((c) => m.culturas[c]?.t).sort(
    (x, y) => (m.culturas[y]?.t ?? 0) - (m.culturas[x]?.t ?? 0),
  );
  const principal: Cultura = culturas[0] ?? "soja";
  const tPrincipal = m.culturas[principal]?.t ?? 0;

  // Só a cultura principal: soja e milho safrinha são colhidos em épocas
  // diferentes, e somar tudo numa janela dobraria a recepção necessária.
  const cenarios = cenariosDeRecepcao(tPrincipal, principal, "bitrem");
  const modelo = tombadorParaVeiculo(tombadores, "bitrem");
  const porHora = modelo ? veiculosPorHora(modelo) : null;

  const trilha = [
    { name: "Início", href: "/" },
    { name: "Armazenagem de grãos", href: "/armazenagem" },
    { name: estado.nome, href: `/armazenagem/${estado.slug}` },
    { name: m.nome },
  ];

  const vizinhosList = vizinhos(m);

  return (
    <>
      <JsonLd
        dados={[
          generateBreadcrumbJsonLd([
            { name: "Início", url: "/pt-BR" },
            { name: "Armazenagem de grãos", url: "/pt-BR/armazenagem" },
            { name: estado.nome, url: `/pt-BR/armazenagem/${estado.slug}` },
            { name: m.nome, url: `/pt-BR${path}` },
          ]),
          generateDatasetJsonLd({
            nome: `Produção e armazenagem de grãos em ${m.nome} (${m.uf})`,
            descricao: `Produção de soja, milho, trigo, arroz e feijão na safra ${ANO} e capacidade estática dos armazéns cadastrados em ${m.nome} (${m.uf}).`,
            path,
            atualizadoEm: ATUALIZADO_EM,
            fontes: FONTES_DATASET,
            locais: [`${m.nome}, ${estado.nome}, Brasil`],
          }),
        ]}
      />

      <Cabecalho
        trilha={trilha}
        eyebrow={`Armazenagem de grãos · ${m.micro.nome}`}
        titulo={`Armazenagem de grãos em ${m.nome} (${m.uf})`}
        lead={
          <p>
            {m.nome} colheu <strong className="text-pili-white">{toneladas(m.producaoT)}</strong>{" "}
            de grãos na safra {ANO} e tem{" "}
            <strong className="text-pili-white">{num(a.unidades)} armazéns</strong> cadastrados,
            com {toneladas(a.estatica)} de capacidade estática.{" "}
            {s < 0 ? (
              <>
                Os armazéns do município comportam{" "}
                <strong className="text-pili-white">{pct(cob)}</strong> da safra: faltam{" "}
                <strong className="text-pili-safety">{toneladas(-s)}</strong> de armazenagem.
              </>
            ) : (
              <>
                A capacidade instalada supera a safra local em {toneladas(s)} — o município
                recebe grão de fora.
              </>
            )}
          </p>
        }
      />

      <Kpis
        itens={[
          { valor: toneladasCurto(m.producaoT), rotulo: `Produção de grãos ${ANO}` },
          { valor: toneladasCurto(a.estatica), rotulo: "Capacidade estática" },
          {
            valor: s < 0 ? `-${toneladasCurto(-s)}` : `+${toneladasCurto(s)}`,
            rotulo: s < 0 ? "Déficit de armazenagem" : "Sobra de armazenagem",
            destaque: s < 0,
          },
          { valor: `${rank}º`, rotulo: `Em produção no ${m.uf}` },
        ]}
      />

      <Secao titulo={`Produção por cultura — safra ${ANO}`}>
        <Tabela
          cabecalho={["Cultura", "Produção (t)", "Área colhida (ha)", "Rendimento (kg/ha)", `Variação sobre ${ANO_ANTERIOR}`]}
          numericas={[1, 2, 3, 4]}
          linhas={culturas.map((c) => {
            const d = m.culturas[c]!;
            return [
              d.pagina ? (
                <Link
                  key={c}
                  href={`/producao/${c}/${m.uf.toLowerCase()}/${m.slug}`}
                  className="font-semibold text-pili-black underline-offset-2 hover:text-pili-safety hover:underline"
                >
                  {TITULO_CULTURA[c]}
                </Link>
              ) : (
                TITULO_CULTURA[c]
              ),
              num(d.t),
              d.ha !== null ? num(d.ha) : "—",
              d.kgHa !== null ? num(d.kgHa) : "—",
              variacao(d.t, d.tAnterior) ?? "—",
            ];
          })}
        />
        <Fonte itens={[FONTE_IBGE]} />
      </Secao>

      <Secao titulo="Armazéns cadastrados no município" fundo="papel">
        {a.unidades === 0 ? (
          <p className="max-w-3xl text-pili-steel">
            Nenhum armazém está cadastrado na Conab em {m.nome}. Toda a safra de{" "}
            {toneladas(m.producaoT)} sai do município para ser armazenada em outro lugar —
            ou fica em estrutura que não consta no cadastro nacional.
          </p>
        ) : (
          <>
            <Tabela
              cabecalho={["Indicador", "Quantidade"]}
              numericas={[1]}
              linhas={[
                ["Armazéns cadastrados", num(a.unidades)],
                ["A granel (silos e graneleiros)", num(a.granel)],
                ["Convencionais (sacaria)", num(a.convencional)],
                ["De cooperativas", num(a.cooperativas)],
                ["De empresas privadas", num(a.privadas)],
                ["Oficiais", num(a.oficiais)],
                ["De produtores pessoa física", num(a.fisicas)],
                ["Capacidade estática total", `${num(a.estatica)} t`],
              ]}
            />
            <Fonte itens={[FONTE_CONAB]} />
          </>
        )}
      </Secao>

      {m.empresas.length > 0 && (
        <Secao titulo={`Empresas armazenadoras em ${m.nome}`}>
          <Tabela
            cabecalho={["Empresa", "Armazéns", "Capacidade estática (t)"]}
            numericas={[1, 2]}
            linhas={m.empresas.map((e) => [
              e.slug ? (
                <Link
                  key={e.nome}
                  href={`/armazenadores/${e.slug}`}
                  className="text-pili-black underline-offset-2 hover:text-pili-safety hover:underline"
                >
                  {nomeEmpresa(e.nome)}
                </Link>
              ) : (
                nomeEmpresa(e.nome)
              ),
              num(e.unidades),
              num(e.estatica),
            ])}
          />
          <Nota>
            Listadas as {m.empresas.length} maiores pessoas jurídicas por capacidade.
            Armazéns de produtores pessoa física entram apenas nos totais — o cadastro
            identifica pessoas, e esta página não as expõe.
          </Nota>
          <Fonte itens={[FONTE_CONAB]} />
        </Secao>
      )}

      <Secao titulo="Recepção necessária para a safra" fundo="papel">
        <p className="max-w-3xl text-pili-steel">
          Para receber a safra de {NOME_CULTURA[principal]} de {m.nome} —{" "}
          {toneladas(tPrincipal)}, a principal cultura do município — chegando em bitrem, com{" "}
          {num(toneladasPorViagem(principal, "bitrem"))} t por viagem e recepção de {JORNADA_H}{" "}
          horas por dia:
        </p>
        <div className="mt-6">
          <Tabela
            cabecalho={[
              "Janela de colheita",
              "Toneladas por dia",
              "Bitrens por dia",
              "Bitrens por hora",
              ...(modelo && porHora ? [`${modelo.nome}`] : []),
            ]}
            numericas={[1, 2, 3, 4]}
            linhas={cenarios.map((c) => [
              `${c.dias} dias`,
              num(c.toneladasDia),
              num(c.caminhoesDia),
              num(Math.ceil(c.caminhoesHora)),
              ...(modelo && porHora
                ? [`${num(Math.max(1, Math.ceil(c.caminhoesHora / porHora)))} tombador(es)`]
                : []),
            ])}
          />
        </div>
        <Nota>
          Cenário calculado sobre a produção do IBGE, não medição. Premissas: janela de
          colheita de 30, 45 ou 60 dias; bitrem de 45 m³ carregado com densidade de
          referência da cultura; {JORNADA_H} h de recepção por dia
          {modelo && porHora
            ? `; ${modelo.nome} com ciclo de ${num(modelo.cicloS)} s mais 3 min de manobra, cerca de ${num(porHora)} veículos por hora`
            : ""}
          . As outras culturas são colhidas em outras épocas do ano e não entram na mesma
          janela.
        </Nota>
      </Secao>

      {vizinhosList.length > 0 && (
        <Secao titulo={`Outros municípios da microrregião ${m.micro.nome}`}>
          <Links
            itens={vizinhosList.map((v) => {
              const sv = saldo(v.producaoT, v.armazenagem.estatica);
              return {
                href: caminho(v.uf, v.slug),
                rotulo: `${v.nome} (${v.uf})`,
                detalhe: sv < 0 ? `déficit ${toneladasCurto(-sv)}` : `sobra ${toneladasCurto(sv)}`,
              };
            })}
          />
        </Secao>
      )}

      <Secao titulo="Continue explorando" fundo="papel">
        <Links
          itens={[
            {
              href: `/armazenagem/${estado.slug}`,
              rotulo: `Armazenagem de grãos em ${estado.nome}`,
              detalhe: `${num(estado.municipiosComPagina)} municípios`,
            },
            ...culturas
              .filter((c) => m.culturas[c]?.pagina)
              .map((c) => ({
                href: `/producao/${c}/${m.uf.toLowerCase()}/${m.slug}`,
                rotulo: `Produção de ${NOME_CULTURA[c]} em ${m.nome}`,
                detalhe: toneladasCurto(m.culturas[c]!.t),
              })),
            { href: "/tombador-para/bitrem", rotulo: "Tombador para bitrem" },
            { href: "/calculadora", rotulo: "Calculadora de capacidade" },
          ]}
        />
      </Secao>

      <CtaUnidade
        titulo={`Vai ampliar a recepção em ${m.nome}?`}
        texto={`A engenharia da PILI dimensiona o tombador e a moega para a safra de ${m.nome} a partir destes números.`}
        hrefCalculadora={`/calculadora?produto=${principal === "arroz" || principal === "feijao" ? "soja" : principal}&veiculo=bitrem`}
        whatsapp={settings.whatsapp}
        mensagem={`Olá! Quero planejar a recepção de grãos para uma unidade em ${m.nome} (${m.uf}).`}
        path={path}
      />
    </>
  );
}
