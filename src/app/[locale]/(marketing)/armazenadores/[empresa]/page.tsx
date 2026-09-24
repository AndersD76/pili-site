import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/routing";
import {
  EMPRESAS,
  UFS,
  buscarEmpresa,
  municipioPorCodigo,
} from "@/lib/mercado-graos/dados";
import { nomeEmpresa, num, toneladas, toneladasCurto } from "@/lib/mercado-graos/formato";
import { ATUALIZADO_EM, FONTE_CONAB } from "@/lib/mercado-graos/fontes";
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

type Params = { locale: string; empresa: string };

export function generateStaticParams(): Params[] {
  return EMPRESAS.map((e) => ({ locale: "pt-BR", empresa: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const e = buscarEmpresa((await params).empresa);
  if (!e) return {};
  return generatePageMetadata({
    title: `${nomeEmpresa(e.nome)}: ${num(e.unidades)} armazéns em ${num(e.municipios.length)} municípios`,
    description: `Unidades armazenadoras de ${nomeEmpresa(e.nome)} cadastradas na Conab: ${num(e.unidades)} armazéns, ${toneladas(
      e.estatica,
    )} de capacidade estática em ${
      // A lista de siglas estourava a descrição nas redes nacionais.
      e.ufs.length > 4 ? `${e.ufs.length} estados` : e.ufs.join(", ")
    }. Veja cada município.`,
    path: `/armazenadores/${e.slug}`,
    idiomas: ["pt-BR"],
    marca: false,
  });
}

export default async function EmpresaPage({ params }: { params: Promise<Params> }) {
  const { locale, empresa } = await params;
  setRequestLocale(locale);
  const e = buscarEmpresa(empresa);
  if (!e || locale !== "pt-BR") notFound();
  const settings = await getSiteSettings();

  const path = `/armazenadores/${e.slug}`;
  const estados = UFS.filter((u) => e.ufs.includes(u.sigla));
  const porte = EMPRESAS.findIndex((x) => x.slug === e.slug) + 1;
  const ufPrincipal = [...e.municipios].sort((a, b) => b.estatica - a.estatica)[0]?.uf;
  const concorrentesLocais = EMPRESAS.filter(
    (x) => x.slug !== e.slug && ufPrincipal && x.ufs.includes(ufPrincipal),
  ).slice(0, 12);

  return (
    <>
      <JsonLd
        dados={[
          generateBreadcrumbJsonLd([
            { name: "Início", url: "/pt-BR" },
            { name: "Empresas armazenadoras", url: "/pt-BR/armazenadores" },
            { name: nomeEmpresa(e.nome), url: `/pt-BR${path}` },
          ]),
          generateDatasetJsonLd({
            nome: `Armazéns de ${nomeEmpresa(e.nome)}`,
            descricao: `Unidades armazenadoras de ${nomeEmpresa(e.nome)} no cadastro nacional da Conab, por município.`,
            path,
            atualizadoEm: ATUALIZADO_EM,
            fontes: [{ nome: "Conab — SICARM", url: FONTE_CONAB.url }],
            locais: estados.map((u) => `${u.nome}, Brasil`),
          }),
        ]}
      />

      <Cabecalho
        trilha={[
          { name: "Início", href: "/" },
          { name: "Empresas armazenadoras", href: "/armazenadores" },
          { name: nomeEmpresa(e.nome) },
        ]}
        eyebrow="Empresa armazenadora · cadastro Conab"
        titulo={nomeEmpresa(e.nome)}
        lead={
          <p>
            <strong className="text-pili-white">{num(e.unidades)} armazéns</strong> cadastrados na
            Conab em {num(e.municipios.length)} municípios de {e.ufs.join(", ")}, somando{" "}
            {toneladas(e.estatica)} de capacidade estática — a {porte}ª maior rede entre as{" "}
            {num(EMPRESAS.length)} empresas com três ou mais unidades em mais de um município.
          </p>
        }
      />

      <Kpis
        itens={[
          { valor: num(e.unidades), rotulo: "Armazéns cadastrados", destaque: true },
          { valor: num(e.municipios.length), rotulo: "Municípios" },
          { valor: toneladasCurto(e.estatica), rotulo: "Capacidade estática" },
          { valor: num(e.ufs.length), rotulo: e.ufs.length === 1 ? "Estado" : "Estados" },
        ]}
      />

      <Secao titulo="Armazéns por município">
        <Tabela
          cabecalho={["Município", "UF", "Armazéns", "Capacidade estática (t)"]}
          numericas={[2, 3]}
          linhas={e.municipios.map((m) => {
            const pagina = municipioPorCodigo(m.cod);
            return [
              pagina ? (
                <Link
                  key={m.cod}
                  href={`/armazenagem/${pagina.uf.toLowerCase()}/${pagina.slug}`}
                  className="text-pili-black underline-offset-2 hover:text-pili-safety hover:underline"
                >
                  {m.nome}
                </Link>
              ) : (
                m.nome
              ),
              m.uf,
              num(m.unidades),
              num(m.estatica),
            ];
          })}
        />
        <Fonte itens={[FONTE_CONAB]} />
      </Secao>

      <Secao titulo="Perfil da rede" fundo="papel">
        <Tabela
          cabecalho={["Indicador", "Armazéns"]}
          numericas={[1]}
          linhas={[
            ["A granel (silos e graneleiros)", num(e.granel)],
            ["Convencionais (sacaria)", num(e.convencional)],
            ["Registrados como cooperativa", num(e.cooperativas)],
            ["Registrados como empresa privada", num(e.privadas)],
          ]}
        />
        <Nota>
          Dados do cadastro público da Conab. A PILI Industrial não representa esta empresa;
          a página só organiza o que está registrado no SICARM.
        </Nota>
      </Secao>

      <Secao titulo="Estados onde a rede está">
        <Links
          itens={estados.map((u) => ({
            href: `/armazenagem/${u.slug}`,
            rotulo: `Armazenagem de grãos em ${u.nome}`,
          }))}
          colunas={2}
        />
      </Secao>

      {concorrentesLocais.length > 0 && (
        <Secao titulo={`Outras redes com armazéns em ${ufPrincipal}`} fundo="papel">
          <Links
            itens={concorrentesLocais.map((x) => ({
              href: `/armazenadores/${x.slug}`,
              rotulo: nomeEmpresa(x.nome),
              detalhe: `${num(x.unidades)} armazéns`,
            }))}
            colunas={2}
          />
        </Secao>
      )}

      <CtaUnidade
        titulo="Ampliação ou nova unidade na rede?"
        texto="A PILI fabrica tombadores de 10 a 30 metros e dimensiona a recepção de cada unidade para a safra da região."
        hrefCalculadora="/calculadora?produto=soja&veiculo=bitrem"
        whatsapp={settings.whatsapp}
        mensagem={`Olá! Trabalho com a rede ${nomeEmpresa(e.nome)} e quero conversar sobre recepção de grãos.`}
        path={path}
      />
    </>
  );
}
