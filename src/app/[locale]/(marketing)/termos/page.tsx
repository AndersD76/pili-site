import { generatePageMetadata } from "@/lib/seo";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { SITE_URL } from "@/lib/constants";
import { getSiteSettings } from "@/lib/site-settings";
import { Link } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "termos" });
  return generatePageMetadata({
    locale,
    title: t("title"),
    description: t("metaDesc"),
    path: "/termos",
    noIndex: true,
  });
}

/**
 * Seções, na ordem. `p2` marca as que têm um segundo parágrafo e `items` a
 * quantidade de itens da lista (0 quando não há).
 */
const SECOES = [
  { key: "aceitacao", p2: false, items: 0 },
  { key: "objeto", p2: false, items: 0 },
  { key: "propriedade", p2: true, items: 0 },
  { key: "usoPermitido", p2: false, items: 6 },
  { key: "especificacoes", p2: false, items: 0 },
  { key: "responsabilidade", p2: true, items: 0 },
  { key: "terceiros", p2: false, items: 0 },
  { key: "formularios", p2: false, items: 0 },
  { key: "alteracoes", p2: false, items: 0 },
  { key: "legislacao", p2: false, items: 0 },
  { key: "contato", p2: false, items: 0 },
] as const;

export default async function TermosPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("termos");
  const settings = await getSiteSettings();

  return (
    <main className="pt-[var(--header-height)]">
      {/* Hero */}
      <section className="bg-pili-black py-16 px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h1 className="font-display text-[length:var(--text-h1)] font-black uppercase text-pili-white">
            {t("title")}
          </h1>
          <p className="mt-3 font-mono text-xs uppercase tracking-wider text-pili-cement">
            {t("lastUpdate")}
          </p>
        </div>
      </section>

      <section className="py-16 px-6 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-10">
          {SECOES.map((secao, indice) => (
            <div key={secao.key}>
              <h2 className="font-display text-lg font-bold uppercase text-pili-black">
                {indice + 1}. {t(`${secao.key}.title`)}
              </h2>

              <p className="mt-3 leading-relaxed text-pili-concrete">
                {secao.key === "aceitacao" ? (
                  t("aceitacao.text", {
                    site: SITE_URL,
                    name: settings.razaoSocial,
                    cnpj: settings.cnpj,
                    address: settings.endereco,
                  })
                ) : secao.key === "propriedade" ? (
                  t("propriedade.text", { name: settings.razaoSocial })
                ) : secao.key === "formularios" ? (
                  <>
                    {t("formularios.text")}{" "}
                    <Link
                      href="/politica-privacidade"
                      className="font-semibold text-pili-black underline transition-colors hover:text-pili-safety-deep"
                    >
                      {t("formularios.link")}
                    </Link>
                    {t("formularios.after")}
                  </>
                ) : (
                  t(`${secao.key}.text`)
                )}
              </p>

              {secao.p2 && (
                <p className="mt-3 leading-relaxed text-pili-concrete">
                  {t(`${secao.key}.text2`)}
                </p>
              )}

              {secao.items > 0 && (
                <ul className="mt-4 space-y-2 text-sm text-pili-concrete">
                  {Array.from({ length: secao.items }, (_, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-pili-cement" />
                      {t(`${secao.key}.i${i + 1}`)}
                    </li>
                  ))}
                </ul>
              )}

              {secao.key === "contato" && (
                <div className="mt-4 border border-pili-mist bg-pili-paper p-6">
                  <p className="font-mono text-sm text-pili-black">
                    {settings.razaoSocial}
                    <br />
                    CNPJ: {settings.cnpj}
                    <br />
                    {t("emailLabel")}: {settings.email}
                    <br />
                    {t("phoneLabel")}: {settings.telefone}
                    <br />
                    {settings.endereco}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
