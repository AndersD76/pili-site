import { Link } from "@/i18n/routing";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { generatePageMetadata } from "@/lib/seo";
import { ShieldCheck, FileCheck, Award, Clock, CheckCircle2 } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "certificacoes" });
  return generatePageMetadata({
    locale,
    title: t("title"),
    description: t("metaDesc"),
    path: "/certificacoes",
  });
}

/**
 * Ícone e rótulo fixo de cada certificação. Subtítulo e itens vêm de
 * `certificacoes.*`: o bloco inteiro estava escrito em português dentro do
 * componente e não tinha como aparecer traduzido.
 */
const CERTIFICATIONS = [
  { icon: ShieldCheck, key: "iso", label: "ISO 9001:2015" },
  { icon: Award, key: "nr10", label: "NR-10" },
  { icon: FileCheck, key: "nr12", label: "NR-12" },
  { icon: Clock, key: "garantia", label: null },
] as const;

const PONTOS_POR_CERT = 5;

export default async function CertificacoesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations();

  return (
    <main className="pt-[var(--header-height)]">
      {/* Hero */}
      <section className="bg-pili-black py-20 px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h1 className="font-display text-[length:var(--text-display-2)] font-black uppercase text-pili-white">
            {t("certificacoes.title")}
          </h1>
          <p className="mt-4 max-w-2xl text-pili-cement">
            {t("certificacoes.intro")}
          </p>
        </div>
      </section>

      {/* Cards */}
      <section className="py-16 px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-2">
            {CERTIFICATIONS.map((cert) => (
              <div
                key={cert.key}
                className="border border-pili-mist p-8 transition-all hover:border-pili-black"
              >
                <div className="flex items-center gap-4">
                  <cert.icon className="h-10 w-10 text-pili-safety" />
                  <div>
                    <h2 className="font-display text-xl font-bold uppercase text-pili-black">
                      {cert.label ?? t(`certificacoes.${cert.key}.title`)}
                    </h2>
                    <span className="font-mono text-xs uppercase tracking-wider text-pili-cement">
                      {t(`certificacoes.${cert.key}.subtitle`)}
                    </span>
                  </div>
                </div>

                <ul className="mt-6 space-y-3">
                  {Array.from({ length: PONTOS_POR_CERT }, (_, i) => (
                    <li key={i} className="flex gap-3 text-sm text-pili-concrete">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-pili-success" />
                      {t(`certificacoes.${cert.key}.i${i + 1}`)}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-pili-paper py-20 px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-display text-[length:var(--text-h2)] font-black uppercase text-pili-black">
            {t("certificacoes.docsTitle")}
          </h2>
          <p className="mt-4 text-pili-concrete">
            {t("certificacoes.docsText")}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/catalogo"
              className="bg-pili-safety px-8 py-4 text-sm font-semibold uppercase tracking-wider text-pili-white transition-colors hover:bg-pili-safety-deep"
            >
              {t("common.download_catalog")}
            </Link>
            <Link
              href="/contato"
              className="border border-pili-black px-8 py-4 text-sm font-semibold uppercase tracking-wider text-pili-black transition-colors hover:bg-pili-black hover:text-pili-white"
            >
              {t("certificacoes.requestDocs")}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
