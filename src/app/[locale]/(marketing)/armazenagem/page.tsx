import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/routing";
import {
  BRASIL,
  CULTURAS,
  MUNICIPIOS,
  UFS,
  cobertura,
  producaoBrasil,
  saldo,
} from "@/lib/mercado-graos/dados";
import {
  TITULO_CULTURA,
  num,
  pct,
  toneladas,
  toneladasCurto,
} from "@/lib/mercado-graos/formato";
import {
  ANO,
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

export function generateStaticParams() {
  return [{ locale: "pt-BR" }];
}

export const metadata: Metadata = generatePageMetadata({
  title: `Armazenagem de grãos no Brasil: déficit por estado e município (${ANO})`,
  description: `O Brasil colheu ${toneladas(BRASIL.producaoT)} de grãos na safra ${ANO} e tem ${toneladas(
    BRASIL.armazenagem.estatica,
  )} de capacidade estática. Veja onde falta armazém, por estado e município.`,
  path: "/armazenagem",
  idiomas: ["pt-BR"],
});

export default async function ArmazenagemPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  if (locale !== "pt-BR") notFound();
  const settings = await getSiteSettings();

  const a = BRASIL.armazenagem;
  const s = saldo(BRASIL.producaoT, a.estatica);

  const deficits = MUNICIPIOS.map((m) => ({ m, s: saldo(m.producaoT, m.armazenagem.estatica) }))
    .filter((x) => x.s < 0)
    .sort((x, y) => x.s - y.s);
  const semArmazem = MUNICIPIOS.filter((m) => m.armazenagem.unidades === 0).slice(0, 30);

  return (
    <>
      <JsonLd
        dados={[
          generateBreadcrumbJsonLd([
            { name: "Início", url: "/pt-BR" },
            { name: "Armazenagem de grãos", url: "/pt-BR/armazenagem" },
          ]),
          generateDatasetJsonLd({
            nome: `Armazenagem de grãos no Brasil — safra ${ANO}`,
            descricao:
              "Produção de grãos e capacidade estática de armazenagem por estado e município, cruzando IBGE e Conab.",
            path: "/armazenagem",
            atualizadoEm: ATUALIZADO_EM,
            fontes: FONTES_DATASET,
            locais: ["Brasil"],
          }),
        ]}
      />

      <Cabecalho
        trilha={[{ name: "Início", href: "/" }, { name: "Armazenagem de grãos" }]}
        eyebrow="Mercado de grãos · Brasil"
        titulo="Armazenagem de grãos no Brasil"
        lead={
          <p>
            O país colheu <strong className="text-pili-white">{toneladas(BRASIL.producaoT)}</strong>{" "}
            de soja, milho, trigo, arroz e feijão na safra {ANO} e tem{" "}
            {num(a.unidades)} armazéns cadastrados, com {toneladas(a.estatica)} de capacidade
            estática — espaço para {pct(cobertura(BRASIL.producaoT, a.estatica))} da safra. Esta
            base mostra onde falta armazém, estado por estado e município por município.
          </p>
        }
      />

      <Kpis
        itens={[
          { valor: toneladasCurto(BRASIL.producaoT), rotulo: `Grãos colhidos em ${ANO}` },
          { valor: toneladasCurto(a.estatica), rotulo: "Capacidade estática" },
          {
            valor: s < 0 ? `-${toneladasCurto(-s)}` : `+${toneladasCurto(s)}`,
            rotulo: "Saldo nacional",
            destaque: s < 0,
          },
          { valor: num(MUNICIPIOS.length), rotulo: "Municípios analisados" },
        ]}
      />

      <Secao titulo="Armazenagem por estado">
        <Tabela
          cabecalho={["Estado", "Produção (t)", "Capacidade (t)", "Saldo (t)", "Cobertura"]}
          numericas={[1, 2, 3, 4]}
          linhas={UFS.map((u) => {
            const su = saldo(u.producaoT, u.armazenagem.estatica);
            return [
              <Link
                key={u.sigla}
                href={`/armazenagem/${u.slug}`}
                className="font-semibold text-pili-black underline-offset-2 hover:text-pili-safety hover:underline"
              >
                {u.nome}
              </Link>,
              num(u.producaoT),
              num(u.armazenagem.estatica),
              num(su),
              pct(cobertura(u.producaoT, u.armazenagem.estatica)),
            ];
          })}
        />
        <Fonte itens={[FONTE_IBGE, FONTE_CONAB]} />
      </Secao>

      <Secao titulo="Os 30 maiores déficits municipais" fundo="papel">
        <Tabela
          cabecalho={["Município", "Produção (t)", "Capacidade (t)", "Déficit (t)"]}
          numericas={[1, 2, 3]}
          linhas={deficits.slice(0, 30).map(({ m, s: sm }) => [
            <Link
              key={m.cod}
              href={`/armazenagem/${m.uf.toLowerCase()}/${m.slug}`}
              className="text-pili-black underline-offset-2 hover:text-pili-safety hover:underline"
            >
              {m.nome} ({m.uf})
            </Link>,
            num(m.producaoT),
            num(m.armazenagem.estatica),
            num(-sm),
          ])}
        />
        <Fonte itens={[FONTE_IBGE, FONTE_CONAB]} />
      </Secao>

      <Secao titulo="Grandes produtores sem armazém cadastrado">
        <Links
          itens={semArmazem.map((m) => ({
            href: `/armazenagem/${m.uf.toLowerCase()}/${m.slug}`,
            rotulo: `${m.nome} (${m.uf})`,
            detalhe: toneladasCurto(m.producaoT),
          }))}
        />
      </Secao>

      <Secao titulo="Produção por cultura" fundo="papel">
        <Links
          itens={CULTURAS.map((c) => ({
            href: `/producao/${c}`,
            rotulo: `Produção de ${TITULO_CULTURA[c].toLowerCase()} no Brasil`,
            detalhe: toneladasCurto(producaoBrasil(c)),
          }))}
        />
      </Secao>

      <Secao titulo="Mais ferramentas">
        <Links
          itens={[
            { href: "/armazenadores", rotulo: "Empresas armazenadoras" },
            { href: "/unidade-de-recebimento", rotulo: "Unidade de recebimento por capacidade" },
            { href: "/tombador-para", rotulo: "Tombador por tipo de veículo" },
            { href: "/calculadora", rotulo: "Calculadora de capacidade" },
          ]}
          colunas={2}
        />
      </Secao>

      <CtaUnidade
        titulo="Onde falta armazém, falta recepção"
        texto="A PILI fabrica tombadores de 10 a 30 metros para unidades de recebimento de grãos desde 1979."
        hrefCalculadora="/calculadora?produto=soja&veiculo=bitrem"
        whatsapp={settings.whatsapp}
        mensagem="Olá! Quero planejar uma nova unidade de recebimento de grãos."
        path="/armazenagem"
      />
    </>
  );
}
