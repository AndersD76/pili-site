import { Link } from "@/i18n/routing";
import { generatePageMetadata } from "@/lib/seo";
import { Newspaper } from "lucide-react";

export function generateMetadata() {
  return generatePageMetadata({
    title: "Blog",
    description:
      "Noticias, artigos tecnicos e novidades da PILI Industrial. Feiras, lancamentos e conteudo sobre tombadores hidraulicos e logistica industrial.",
    path: "/blog",
  });
}

export default function BlogPage() {
  return (
    <main className="pt-[var(--header-height)]">
      {/* Hero */}
      <section className="bg-pili-black py-20 px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h1 className="font-display text-[length:var(--text-display-2)] font-black uppercase text-pili-white">
            Blog
          </h1>
          <p className="mt-4 max-w-2xl text-pili-cement">
            Noticias, artigos tecnicos, feiras e novidades da PILI Industrial.
          </p>
        </div>
      </section>

      {/* Coming soon */}
      <section className="py-24 px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Newspaper className="mx-auto h-16 w-16 text-pili-mist" />
          <h2 className="mt-8 font-display text-[length:var(--text-h2)] font-black uppercase text-pili-black">
            Em breve
          </h2>
          <p className="mt-4 leading-relaxed text-pili-concrete">
            Estamos preparando conteudo de qualidade sobre tombadores
            hidraulicos, logistica industrial, inovacao e feiras do setor.
            Em breve voce encontrara aqui artigos tecnicos, estudos de caso e
            novidades da PILI Industrial.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/produtos"
              className="bg-pili-safety px-8 py-4 text-sm font-semibold uppercase tracking-wider text-pili-black transition-colors hover:bg-pili-safety-deep"
            >
              Ver produtos
            </Link>
            <Link
              href="/contato"
              className="border border-pili-black px-8 py-4 text-sm font-semibold uppercase tracking-wider text-pili-black transition-colors hover:bg-pili-black hover:text-pili-white"
            >
              Fale conosco
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
