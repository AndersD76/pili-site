import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { VEICULOS, type TipoVeiculo } from "@/lib/calculadora";
import {
  CULTURAS,
  MUNICIPIOS,
  buscarMunicipio,
  buscarUf,
  municipiosComCultura,
  saldo,
  type Cultura,
} from "@/lib/mercado-graos/dados";
import {
  NOME_CULTURA,
  TITULO_CULTURA,
  medida,
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
  DENSIDADE_CULTURA,
  JORNADA_H,
  NOME_VEICULO,
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

export const revalidate = 86400;
export const dynamicParams = false;

type Params = { locale: string; cultura: string; uf: string; municipio: string };

export function generateStaticParams(): Params[] {
  const params: Params[] = [];
  for (const m of MUNICIPIOS) {
    for (const cultura of CULTURAS) {
      if (!m.culturas[cultura]?.pagina) continue;
      params.push({
        locale: "pt-BR",
        cultura,
        uf: m.uf.toLowerCase(),
        municipio: m.slug,
      });
    }
  }
  return params;
}

function carregar(p: { cultura: string; uf: string; municipio: string }) {
  if (!CULTURAS.includes(p.cultura as Cultura)) return null;
  const cultura = p.cultura as Cultura;
  const m = buscarMunicipio(p.uf, p.municipio);
  const d = m?.culturas[cultura];
  const estado = buscarUf(p.uf);
  if (!m || !d?.pagina || !estado) return null;
  return { cultura, m, d, estado };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const dados = carregar(await params);
  if (!dados) return {};
  const { cultura, m, d } = dados;
  return generatePageMetadata({
    title: `Produção de ${NOME_CULTURA[cultura]} em ${m.nome} (${m.uf}) em ${ANO}: ${toneladasCurto(d.t)}`,
    description: `${m.nome} (${m.uf}) colheu ${toneladasCurto(d.t)} de ${NOME_CULTURA[cultura]} em ${ANO}${
      d.ha ? ` em ${num(d.ha)} ha` : ""
    }. Veja rendimento, ranking no estado, cargas por veículo e recepção na safra.`,
    path: `/producao/${cultura}/${m.uf.toLowerCase()}/${m.slug}`,
    idiomas: ["pt-BR"],
    marca: false,
  });
}

export default async function MunicipioCulturaPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const p = await params;
  setRequestLocale(p.locale);
  const dados = carregar(p);
  if (!dados || p.locale !== "pt-BR") notFound();
  const { cultura, m, d, estado } = dados;

  const [settings, tombadores] = await Promise.all([
    getSiteSettings(),
    tombadoresPublicados(),
  ]);

  const path = `/producao/${cultura}/${m.uf.toLowerCase()}/${m.slug}`;
  const doEstado = municipiosComCultura(cultura, m.uf);
  const rank = doEstado.findIndex((x) => x.cod === m.cod) + 1;
  const tEstado = estado.culturas[cultura]?.t ?? 0;
  const participacao = tEstado > 0 ? d.t / tEstado : 0;
  const var_ = variacao(d.t, d.tAnterior);

  const cenarios = cenariosDeRecepcao(d.t, cultura, "bitrem");
  const modelo = tombadorParaVeiculo(tombadores, "bitrem");
  const porHora = modelo ? veiculosPorHora(modelo) : null;

  const microVizinhos = doEstado
    .filter((x) => x.micro.id === m.micro.id && x.cod !== m.cod)
    .slice(0, 9);
  const topEstado = doEstado.filter((x) => x.cod !== m.cod).slice(0, 9);
  const outras = CULTURAS.filter((c) => c !== cultura && m.culturas[c]?.pagina);
  const s = saldo(m.producaoT, m.armazenagem.estatica);

  const veiculos: TipoVeiculo[] = ["caminhao", "carreta", "bitrem", "rodotrem"];

  return (
    <>
      <JsonLd
        dados={[
          generateBreadcrumbJsonLd([
            { name: "Início", url: "/pt-BR" },
            { name: `Produção de ${NOME_CULTURA[cultura]}`, url: `/pt-BR/producao/${cultura}` },
            { name: estado.nome, url: `/pt-BR/producao/${cultura}/${estado.slug}` },
            { name: m.nome, url: `/pt-BR${path}` },
          ]),
          generateDatasetJsonLd({
            nome: `Produção de ${NOME_CULTURA[cultura]} em ${m.nome} (${m.uf}) — safra ${ANO}`,
            descricao: `Quantidade produzida, área colhida e rendimento de ${NOME_CULTURA[cultura]} em ${m.nome} (${m.uf}), com a variação sobre ${ANO_ANTERIOR}.`,
            path,
            atualizadoEm: ATUALIZADO_EM,
            fontes: FONTES_DATASET,
            locais: [`${m.nome}, ${estado.nome}, Brasil`],
          }),
        ]}
      />

      <Cabecalho
        trilha={[
          { name: "Início", href: "/" },
          { name: `Produção de ${NOME_CULTURA[cultura]}`, href: `/producao/${cultura}` },
          { name: estado.nome, href: `/producao/${cultura}/${estado.slug}` },
          { name: m.nome },
        ]}
        eyebrow={`${TITULO_CULTURA[cultura]} · safra ${ANO}`}
        titulo={`Produção de ${NOME_CULTURA[cultura]} em ${m.nome} (${m.uf})`}
        lead={
          <p>
            {m.nome} colheu{" "}
            <strong className="text-pili-white">{toneladas(d.t)}</strong> de{" "}
            {NOME_CULTURA[cultura]} na safra {ANO}
            {d.ha ? <> em {num(d.ha)} hectares</> : null}
            {d.kgHa ? <>, com rendimento de {num(d.kgHa)} kg/ha</> : null}
            {var_ ? (
              <>
                {" "}— {var_} sobre {ANO_ANTERIOR}
              </>
            ) : null}
            . É o <strong className="text-pili-white">{rank}º produtor</strong> de{" "}
            {NOME_CULTURA[cultura]} de {estado.nome} e responde por {pct(participacao, 1)} da
            safra do estado.
          </p>
        }
      />

      <Kpis
        itens={[
          { valor: toneladasCurto(d.t), rotulo: `${TITULO_CULTURA[cultura]} ${ANO}`, destaque: true },
          { valor: d.ha ? `${num(d.ha)} ha` : "—", rotulo: "Área colhida" },
          { valor: d.kgHa ? `${num(d.kgHa)} kg/ha` : "—", rotulo: "Rendimento" },
          { valor: `${rank}º`, rotulo: `No ${m.uf} em ${NOME_CULTURA[cultura]}` },
        ]}
      />

      <Secao titulo={`Quantas cargas é a safra de ${NOME_CULTURA[cultura]}`}>
        <p className="max-w-3xl text-pili-steel">
          Com densidade de referência de {num(DENSIDADE_CULTURA[cultura] * 1000)} kg/m³, a
          safra de {NOME_CULTURA[cultura]} de {m.nome} ocupa estas viagens, conforme o
          veículo que chega à unidade:
        </p>
        <div className="mt-6">
          <Tabela
            cabecalho={["Veículo", "Comprimento", "Toneladas por viagem", "Viagens para a safra"]}
            numericas={[1, 2, 3]}
            linhas={veiculos.map((v) => [
              NOME_VEICULO[v],
              `${medida(VEICULOS[v].comprimentoM)} m`,
              num(toneladasPorViagem(cultura, v)),
              num(d.t / toneladasPorViagem(cultura, v)),
            ])}
          />
        </div>
        <Fonte itens={[FONTE_IBGE]} />
      </Secao>

      <Secao titulo="Recepção necessária na colheita" fundo="papel">
        <Tabela
          cabecalho={[
            "Janela de colheita",
            "Toneladas por dia",
            "Bitrens por dia",
            "Bitrens por hora",
            ...(modelo && porHora ? [modelo.nome] : []),
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
        <Nota>
          Cenário sobre a produção do IBGE, não medição: toda a safra de{" "}
          {NOME_CULTURA[cultura]} do município chegando em bitrem, com {JORNADA_H} h de
          recepção por dia
          {modelo && porHora
            ? ` e o ${modelo.nome} descarregando cerca de ${num(porHora)} veículos por hora, manobra incluída`
            : ""}
          .
        </Nota>
      </Secao>

      <Secao titulo={`Armazenagem em ${m.nome}`}>
        <p className="max-w-3xl text-pili-steel">
          O município tem {num(m.armazenagem.unidades)} armazéns cadastrados, com{" "}
          {toneladas(m.armazenagem.estatica)} de capacidade estática para{" "}
          {toneladas(m.producaoT)} de grãos colhidos —{" "}
          {s < 0 ? (
            <strong className="text-pili-safety">déficit de {toneladas(-s)}</strong>
          ) : (
            <>sobra de {toneladas(s)}</>
          )}
          .
        </p>
        <Fonte itens={[FONTE_CONAB, FONTE_IBGE]} />
        <div className="mt-6">
          <Links
            itens={[
              {
                href: `/armazenagem/${m.uf.toLowerCase()}/${m.slug}`,
                rotulo: `Armazenagem de grãos em ${m.nome}`,
                detalhe: `${num(m.armazenagem.unidades)} armazéns`,
              },
              ...outras.map((c) => ({
                href: `/producao/${c}/${m.uf.toLowerCase()}/${m.slug}`,
                rotulo: `Produção de ${NOME_CULTURA[c]} em ${m.nome}`,
                detalhe: toneladasCurto(m.culturas[c]!.t),
              })),
            ]}
            colunas={2}
          />
        </div>
      </Secao>

      {microVizinhos.length > 0 && (
        <Secao titulo={`${TITULO_CULTURA[cultura]} na microrregião ${m.micro.nome}`} fundo="papel">
          <Links
            itens={microVizinhos.map((x) => ({
              href: `/producao/${cultura}/${x.uf.toLowerCase()}/${x.slug}`,
              rotulo: `${x.nome} (${x.uf})`,
              detalhe: toneladasCurto(x.culturas[cultura]!.t),
            }))}
          />
        </Secao>
      )}

      <Secao titulo={`Maiores produtores de ${NOME_CULTURA[cultura]} de ${estado.nome}`}>
        <Links
          itens={[
            ...topEstado.map((x) => ({
              href: `/producao/${cultura}/${x.uf.toLowerCase()}/${x.slug}`,
              rotulo: `${x.nome} (${x.uf})`,
              detalhe: toneladasCurto(x.culturas[cultura]!.t),
            })),
            {
              href: `/producao/${cultura}/${estado.slug}`,
              rotulo: `Ver todos em ${estado.nome}`,
            },
          ]}
        />
      </Secao>

      <CtaUnidade
        titulo={`Recepção de ${NOME_CULTURA[cultura]} em ${m.nome}`}
        texto={`A PILI dimensiona o tombador e a moega para a safra de ${NOME_CULTURA[cultura]} da sua unidade.`}
        hrefCalculadora={`/calculadora?produto=${cultura === "arroz" || cultura === "feijao" ? "soja" : cultura}&veiculo=bitrem`}
        whatsapp={settings.whatsapp}
        mensagem={`Olá! Quero dimensionar a recepção de ${NOME_CULTURA[cultura]} para uma unidade em ${m.nome} (${m.uf}).`}
        path={path}
      />
    </>
  );
}
