import { generatePageMetadata } from "@/lib/seo";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { COMPANY } from "@/lib/constants";
import { Leaf, Droplets, Recycle, Zap } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ambiental" });
  return generatePageMetadata({
    locale,
    title: t("title"),
    description: t("metaDesc"),
    path: "/politica-ambiental",
  });
}

/** Ícone por diretriz; título e texto vêm de `ambiental.items`. */
const COMMITMENTS = [
  { icon: Recycle, key: "residuos" },
  { icon: Droplets, key: "agua" },
  { icon: Zap, key: "energia" },
  { icon: Leaf, key: "projetos" },
] as const;

const PRINCIPLES = ["pr1", "pr2", "pr3", "pr4", "pr5", "pr6"] as const;

export default async function PoliticaAmbientalPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("ambiental");

  return (
    <main className="pt-[var(--header-height)]">
      {/* Hero */}
      <section className="bg-pili-black py-16 px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h1 className="font-display text-[length:var(--text-h1)] font-black uppercase text-pili-white">
            {t("title")}
          </h1>
          <p className="mt-3 font-mono text-xs uppercase tracking-wider text-pili-cement">
            {t("subtitle")}
          </p>
        </div>
      </section>

      {/* Statement */}
      <section className="py-16 px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-display text-[length:var(--text-h2)] font-black uppercase text-pili-black">
            {t("commitment")}
          </h2>
          <p className="mt-6 leading-relaxed text-pili-concrete">
            {t("p1", { name: COMPANY.name })}
          </p>
          <p className="mt-4 leading-relaxed text-pili-concrete">
            {t("p2")}
          </p>
        </div>
      </section>

      {/* Commitments */}
      <section className="bg-pili-paper py-16 px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-display text-[length:var(--text-h2)] font-black uppercase text-pili-black">
            {t("guidelines")}
          </h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-2">
            {COMMITMENTS.map((item) => (
              <div key={item.key} className="flex flex-col">
                <item.icon className="h-8 w-8 text-pili-safety" />
                <h3 className="mt-4 font-display text-lg font-bold uppercase text-pili-black">
                  {t(`items.${item.key}.title`)}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-pili-concrete">
                  {t(`items.${item.key}.text`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="py-16 px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-display text-[length:var(--text-h2)] font-black uppercase text-pili-black">
            {t("principles")}
          </h2>
          <ul className="mt-8 space-y-4">
            {PRINCIPLES.map((chave) => (
              <li
                key={chave}
                className="flex gap-4 text-sm leading-relaxed text-pili-concrete"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-pili-safety" />
                {t(chave)}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Contact */}
      <section className="bg-pili-paper py-12 px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm text-pili-concrete">
            {t("contactPrefix")}{" "}
            <a
              href={`mailto:${COMPANY.email}`}
              className="font-semibold text-pili-black underline transition-colors hover:text-pili-safety-deep"
            >
              {COMPANY.email}
            </a>{" "}
            {t("contactSuffix", { phone: COMPANY.phone })}
          </p>
        </div>
      </section>
    </main>
  );
}
