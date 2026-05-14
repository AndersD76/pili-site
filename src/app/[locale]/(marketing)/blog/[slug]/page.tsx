import { Link } from "@/i18n/routing";
import { generatePageMetadata } from "@/lib/seo";
import { ArrowLeft } from "lucide-react";

export function generateMetadata({
  params,
}: {
  params: { slug: string; locale: string };
}) {
  return generatePageMetadata({
    title: "Blog",
    description: "PILI Industrial - Blog",
    path: `/blog/${params.slug}`,
    noIndex: true,
  });
}

export default function BlogPostPage() {
  return (
    <main className="pt-[var(--header-height)]">
      <section className="py-24 px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-display text-[length:var(--text-h1)] font-black uppercase text-pili-black">
            Conteudo em breve
          </h1>
          <p className="mt-4 text-pili-concrete">
            Este artigo ainda nao esta disponivel. Estamos preparando conteudo
            de qualidade para o blog da PILI Industrial.
          </p>
          <Link
            href="/blog"
            className="mt-8 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-pili-black transition-colors hover:text-pili-safety-deep"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar ao blog
          </Link>
        </div>
      </section>
    </main>
  );
}
