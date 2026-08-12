import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { getObras } from "@/lib/content";
import { AnimateOnScroll } from "@/components/shared/animate-on-scroll";

/**
 * Prova social a partir das obras reais.
 *
 * Antes era uma grade de caixas cinza com o nome de doze empresas escrito em
 * texto — sem logo, sem link, sem nada que sustentasse a afirmação. Um nome
 * solto num quadrado é a forma mais fraca de citar um cliente: quem lê não tem
 * como verificar, e visualmente parece placeholder.
 *
 * Cada cartão aqui sai do banco: cliente, cidade, ano e as métricas que a
 * equipe mediu na obra, com link para o caso completo. É o mesmo dado, mas
 * verificável — quem duvida clica.
 */
export async function ClientsBand() {
  const t = await getTranslations();
  const obras = await getObras();

  if (obras.length === 0) return null;

  // Oito preenchem duas fileiras de quatro sem deixar buraco na grade.
  const destaques = obras.slice(0, 8);

  return (
    <section className="border-y border-pili-mist bg-pili-white py-20 px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <AnimateOnScroll>
          <div className="flex items-center justify-center gap-4">
            <div className="h-px flex-1 bg-pili-mist" />
            <h2 className="text-center font-mono text-xs font-semibold uppercase tracking-[0.3em] text-pili-cement">
              {t("sections.clients")}
            </h2>
            <div className="h-px flex-1 bg-pili-mist" />
          </div>
          <p className="mt-4 text-center text-sm text-pili-concrete">
            {t("home.clientsSubtitle")}
          </p>
        </AnimateOnScroll>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {destaques.map((obra, i) => {
            // A primeira métrica é a vazão — o número que o comprador compara.
            const principal = obra.metrics[0];
            const apoio = obra.metrics[1];

            return (
              <AnimateOnScroll key={obra.slug} delay={i * 0.05}>
                <li className="h-full">
                  <Link
                    href={`/obras/${obra.slug}`}
                    className="group flex h-full flex-col border border-pili-mist bg-pili-paper p-5 transition-all hover:border-pili-black hover:bg-pili-white"
                  >
                    <span className="font-display text-base font-bold uppercase leading-tight text-pili-black">
                      {obra.client}
                    </span>
                    <span className="mt-1 font-mono text-[11px] uppercase tracking-wider text-pili-cement">
                      {obra.location} · {obra.year}
                    </span>

                    {principal && (
                      <div className="mt-4">
                        <span className="font-display text-2xl font-black leading-none text-pili-safety">
                          {principal.value}
                        </span>
                        <span className="mt-1 block font-mono text-[10px] uppercase tracking-wider text-pili-concrete">
                          {principal.label}
                        </span>
                      </div>
                    )}

                    {apoio && (
                      <span className="mt-2 font-mono text-[11px] text-pili-concrete">
                        {apoio.value} {apoio.label}
                      </span>
                    )}

                    <span className="mt-auto flex items-center gap-1 pt-4 text-[11px] font-semibold uppercase tracking-wider text-pili-black opacity-0 transition-opacity group-hover:opacity-100">
                      {t("solucoes.seeCase")}
                      <ArrowRight className="h-3 w-3" />
                    </span>
                  </Link>
                </li>
              </AnimateOnScroll>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
