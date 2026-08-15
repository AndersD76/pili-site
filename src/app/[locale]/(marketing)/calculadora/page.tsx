import { setRequestLocale, getTranslations } from "next-intl/server";
import { getTombadoresCalculadora } from "@/lib/calculadora-dados";
import { CalculadoraForm } from "@/components/marketing/calculadora-form";

/**
 * Os modelos vêm do catálogo cadastrado no painel, então a página precisa ser
 * servidor. Antes era um componente cliente inteiro com quatro modelos escritos
 * no código, nenhum deles existente no catálogo.
 */
export const revalidate = 300;

export default async function CalculadoraPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations();
  const tombadores = await getTombadoresCalculadora();

  return (
    <main className="pt-[var(--header-height)]">
      {/* Hero */}
      <section className="bg-pili-black py-20 px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h1 className="font-display text-[length:var(--text-display-2)] font-black uppercase text-pili-white">
            {t("calculadora.title")}
          </h1>
          <p className="mt-4 max-w-2xl text-pili-cement">
            {t("calculadora.intro")}
          </p>
          <p className="mt-4 max-w-2xl font-mono text-sm leading-relaxed text-pili-cement">
            {t("calculadora.explainer")}
          </p>
        </div>
      </section>

      <section className="py-16 px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {tombadores.length > 0 ? (
            <CalculadoraForm tombadores={tombadores} />
          ) : (
            // Catálogo indisponível: melhor dizer do que mostrar um formulário
            // que não tem como responder.
            <div className="border border-dashed border-pili-mist p-12 text-center">
              <p className="text-sm text-pili-concrete">
                {t("calculadora.noCatalog")}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Disclaimer */}
      <section className="bg-pili-paper py-10 px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <p className="font-mono text-xs leading-relaxed text-pili-cement">
            {t("calculadora.disclaimer")}
          </p>
        </div>
      </section>
    </main>
  );
}
