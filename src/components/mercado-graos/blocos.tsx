import type { ReactNode } from "react";
import { ArrowRight, Calculator, MessageCircle } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Breadcrumbs, type Crumb } from "@/components/shared/breadcrumbs";
import { jsonLdScript } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

/**
 * Blocos das páginas de mercado de grãos.
 *
 * Todos são componentes de servidor e sem JavaScript no navegador: são
 * milhares de páginas de aquisição, e o que mantém cada uma leve em 4G é
 * mandar só HTML e CSS.
 */

export function JsonLd({ dados }: { dados: unknown[] }) {
  return (
    <>
      {dados.map((d, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdScript(d) }}
        />
      ))}
    </>
  );
}

export function Cabecalho({
  trilha,
  eyebrow,
  titulo,
  lead,
}: {
  trilha: Crumb[];
  eyebrow: string;
  titulo: string;
  lead: ReactNode;
}) {
  return (
    <>
      <div className="border-b border-pili-mist bg-pili-paper px-6 py-3 lg:px-8">
        <Breadcrumbs className="mx-auto max-w-6xl" items={trilha} />
      </div>
      <section className="bg-pili-black px-6 pb-14 pt-12 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="font-mono text-xs uppercase tracking-widest text-pili-safety">
            {eyebrow}
          </p>
          <h1 className="mt-3 max-w-4xl font-display text-3xl font-black uppercase leading-tight text-pili-white sm:text-4xl lg:text-5xl">
            {titulo}
          </h1>
          <div className="mt-5 max-w-3xl text-base leading-relaxed text-pili-cement lg:text-lg">
            {lead}
          </div>
        </div>
      </section>
    </>
  );
}

export function Kpis({
  itens,
}: {
  itens: { valor: string; rotulo: string; destaque?: boolean }[];
}) {
  return (
    <section className="border-b border-pili-mist bg-pili-white px-6 lg:px-8">
      <dl className="mx-auto grid max-w-6xl grid-cols-2 lg:grid-cols-4">
        {itens.map((k, i) => (
          <div
            key={k.rotulo}
            className={`py-6 pr-4 ${i % 2 === 1 ? "pl-4 lg:pl-6" : ""} ${
              i > 0 ? "lg:border-l lg:border-pili-mist lg:pl-6" : ""
            }`}
          >
            <dd
              className={`font-mono text-xl font-bold sm:text-2xl ${
                k.destaque ? "text-pili-safety" : "text-pili-black"
              }`}
            >
              {k.valor}
            </dd>
            <dt className="mt-1 text-xs font-semibold uppercase tracking-wider text-pili-concrete">
              {k.rotulo}
            </dt>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function Secao({
  titulo,
  children,
  fundo = "branco",
  id,
}: {
  titulo: string;
  children: ReactNode;
  fundo?: "branco" | "papel";
  id?: string;
}) {
  return (
    <section
      id={id}
      className={`px-6 py-14 lg:px-8 ${fundo === "papel" ? "bg-pili-paper" : "bg-pili-white"}`}
    >
      <div className="mx-auto max-w-6xl">
        <h2 className="font-display text-2xl font-black uppercase text-pili-black lg:text-3xl">
          {titulo}
        </h2>
        <div className="mt-6">{children}</div>
      </div>
    </section>
  );
}

export function Tabela({
  cabecalho,
  linhas,
  numericas = [],
}: {
  cabecalho: string[];
  linhas: ReactNode[][];
  /** Índices das colunas numéricas, alinhadas à direita. */
  numericas?: number[];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[32rem] border-collapse text-sm">
        <thead>
          <tr className="border-b-2 border-pili-black text-left">
            {cabecalho.map((c, i) => (
              <th
                key={c}
                scope="col"
                className={`px-3 py-2 font-semibold text-pili-black ${
                  numericas.includes(i) ? "text-right" : ""
                }`}
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {linhas.map((linha, li) => (
            <tr key={li} className="border-b border-pili-mist">
              {linha.map((celula, ci) => (
                <td
                  key={ci}
                  className={`px-3 py-2.5 text-pili-steel ${
                    numericas.includes(ci) ? "text-right font-mono" : ""
                  }`}
                >
                  {celula}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Carimbo de fonte e data — a data vem do dado, nunca escrita à mão. */
export function Fonte({ itens }: { itens: { nome: string; url: string; data: string }[] }) {
  return (
    <p className="mt-4 text-xs leading-relaxed text-pili-concrete">
      Fonte:{" "}
      {itens.map((f, i) => (
        <span key={f.nome}>
          {i > 0 ? " · " : ""}
          <a
            href={f.url}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-pili-black"
          >
            {f.nome}
          </a>{" "}
          — {f.data}
        </span>
      ))}
    </p>
  );
}

export function Links({
  itens,
  colunas = 3,
}: {
  itens: { href: string; rotulo: string; detalhe?: string }[];
  colunas?: 2 | 3 | 4;
}) {
  const grade =
    colunas === 4
      ? "sm:grid-cols-2 lg:grid-cols-4"
      : colunas === 2
        ? "sm:grid-cols-2"
        : "sm:grid-cols-2 lg:grid-cols-3";
  return (
    <ul className={`grid gap-x-8 gap-y-1 ${grade}`}>
      {itens.map((l) => (
        <li key={l.href}>
          <Link
            href={l.href}
            className="group flex items-baseline justify-between gap-3 border-b border-pili-mist py-2.5 text-sm text-pili-black transition-colors hover:text-pili-safety"
          >
            <span>{l.rotulo}</span>
            {l.detalhe ? (
              <span className="shrink-0 font-mono text-xs text-pili-concrete group-hover:text-pili-safety">
                {l.detalhe}
              </span>
            ) : null}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function Nota({ children }: { children: ReactNode }) {
  return (
    <p className="mt-4 border-l-2 border-pili-mist pl-4 text-xs leading-relaxed text-pili-concrete">
      {children}
    </p>
  );
}

/**
 * Chamada para planejar a unidade.
 *
 * Leva o contexto da página adiante: a calculadora abre já com a cultura e o
 * veículo, e a mensagem de WhatsApp carrega o endereço de origem — sem isso o
 * contato chega sem saber de onde veio.
 */
export function CtaUnidade({
  titulo,
  texto,
  hrefCalculadora,
  whatsapp,
  mensagem,
  path,
}: {
  titulo: string;
  texto: string;
  hrefCalculadora: string;
  whatsapp: string;
  mensagem: string;
  path: string;
}) {
  const url = `${SITE_URL}/pt-BR${path}`;
  const wa = `https://wa.me/${whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(
    `${mensagem}\n\nVi em: ${url}`,
  )}`;
  return (
    <section className="bg-pili-safety px-6 py-14 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <h2 className="font-display text-2xl font-black uppercase text-pili-white lg:text-3xl">
            {titulo}
          </h2>
          <p className="mt-3 text-pili-white/85">{texto}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href={hrefCalculadora}
            className="inline-flex items-center justify-center gap-2 bg-pili-black px-6 py-4 text-sm font-semibold uppercase tracking-wider text-pili-white transition-colors hover:bg-pili-graphite"
          >
            <Calculator className="size-4" />
            Dimensionar tombador
          </Link>
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 border border-pili-white px-6 py-4 text-sm font-semibold uppercase tracking-wider text-pili-white transition-colors hover:bg-pili-white hover:text-pili-safety"
          >
            <MessageCircle className="size-4" />
            Falar com a engenharia
            <ArrowRight className="size-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
