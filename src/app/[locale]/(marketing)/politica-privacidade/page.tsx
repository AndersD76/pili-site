import { generatePageMetadata } from "@/lib/seo";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { getSiteSettings } from "@/lib/site-settings";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "privacidade" });
  return generatePageMetadata({
    locale,
    title: t("title"),
    description: t("metaDesc"),
    // O caminho canônico levava acento ("/política-privacidade") e apontava
    // para uma URL que não existe; a rota real é sem acento.
    path: "/politica-privacidade",
    noIndex: true,
  });
}

/**
 * Seções da política, na ordem. `items` é a quantidade de itens da lista da
 * seção (0 quando ela é só texto) e `outro` indica que existe um parágrafo de
 * fecho depois da lista.
 */
const SECOES = [
  { key: "controlador", items: 0, outro: false },
  { key: "dados", items: 9, outro: false },
  { key: "finalidades", items: 6, outro: false },
  { key: "baseLegal", items: 4, outro: false },
  { key: "compartilhamento", items: 3, outro: true },
  { key: "retencao", items: 0, outro: false },
  { key: "direitos", items: 8, outro: true },
  { key: "cookies", items: 0, outro: false },
  { key: "seguranca", items: 0, outro: false },
  { key: "alteracoes", items: 0, outro: false },
  { key: "contato", items: 0, outro: false },
] as const;

export default async function PoliticaPrivacidadePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("privacidade");
  const settings = await getSiteSettings();

  const identificacao = (
    <div className="mt-4 border border-pili-mist bg-pili-paper p-6">
      <p className="font-mono text-sm text-pili-black">
        {settings.razaoSocial}
        <br />
        CNPJ: {settings.cnpj}
        <br />
        {settings.endereco}
        <br />
        {t("emailLabel")}: {settings.email}
        <br />
        {t("phoneLabel")}: {settings.telefone}
      </p>
    </div>
  );

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
                {t(`${secao.key}.text`)}
              </p>

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

              {secao.outro && (
                <p className="mt-4 leading-relaxed text-pili-concrete">
                  {secao.key === "direitos" ? (
                    <>
                      {t("direitos.outro")}{" "}
                      <a
                        href={`mailto:${settings.email}`}
                        className="font-semibold text-pili-black underline transition-colors hover:text-pili-safety-deep"
                      >
                        {settings.email}
                      </a>
                      .
                    </>
                  ) : (
                    t(`${secao.key}.outro`)
                  )}
                </p>
              )}

              {(secao.key === "controlador" || secao.key === "contato") &&
                identificacao}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
