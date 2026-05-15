import { Suspense } from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { generatePageMetadata } from "@/lib/seo";
import { BLOG_POSTS, getPostsByCategory } from "@/lib/data/blog";
import { AnimateOnScroll } from "@/components/shared/animate-on-scroll";
import { BlogCategoryFilter } from "@/components/marketing/blog-category-filter";
import { ArrowRight, Clock } from "lucide-react";

export function generateMetadata() {
  return generatePageMetadata({
    title: "Blog",
    description:
      "Notícias, artigos técnicos e novidades da PILI Industrial. Feiras, lançamentos e conteúdo sobre tombadores hidráulicos e logística industrial.",
    path: "/blog",
  });
}

const CATEGORY_LABELS: Record<string, string> = {
  noticia: "Notícia",
  artigo: "Artigo",
  evento: "Evento",
  lancamento: "Lançamento",
};

function formatDate(iso: string): string {
  const date = new Date(iso + "T12:00:00");
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string }>;
}) {
  const { categoria } = await searchParams;
  const activeCategory = categoria ?? "todos";
  const filteredPosts = getPostsByCategory(activeCategory);

  const featuredPost = BLOG_POSTS.find((p) => p.featured);
  const showFeatured = activeCategory === "todos" && featuredPost;

  const gridPosts = showFeatured
    ? filteredPosts.filter((p) => p.slug !== featuredPost.slug)
    : filteredPosts;

  return (
    <main className="pt-[var(--header-height)]">
      {/* Hero */}
      <section className="relative bg-pili-black py-24 px-6 lg:px-8">
        <div className="absolute left-0 top-0 h-full w-1.5 bg-pili-safety" />
        <div className="relative mx-auto max-w-6xl">
          <span className="font-mono text-xs uppercase tracking-widest text-pili-safety">
            Conteúdo e novidades
          </span>
          <h1 className="mt-3 font-display text-[length:var(--text-display-2)] font-black uppercase text-pili-white">
            Blog
          </h1>
          <div className="mt-4 flex items-center gap-4">
            <div className="h-px w-12 bg-pili-safety" />
            <p className="max-w-2xl text-pili-cement">
              Notícias, artigos técnicos, cobertura de feiras e lançamentos da
              PILI Industrial. Tudo sobre tombadores hidráulicos, logística de
              grãos e o ecossistema digital PILI.
            </p>
          </div>
        </div>
      </section>

      {/* Featured post */}
      {showFeatured && (
        <section className="bg-pili-paper py-16 px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <AnimateOnScroll>
              <Link
                href={`/blog/${featuredPost.slug}`}
                className="group grid gap-8 lg:grid-cols-2"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-pili-mist">
                  <Image
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <div className="flex items-center gap-3">
                    <span className="bg-pili-safety px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-pili-white">
                      {CATEGORY_LABELS[featuredPost.category]}
                    </span>
                    <span className="font-mono text-xs text-pili-cement">
                      Destaque
                    </span>
                  </div>
                  <h2 className="mt-4 font-display text-2xl font-bold uppercase text-pili-black lg:text-3xl">
                    {featuredPost.title}
                  </h2>
                  <p className="mt-4 leading-relaxed text-pili-iron">
                    {featuredPost.excerpt}
                  </p>
                  <div className="mt-4 flex items-center gap-4 font-mono text-xs text-pili-cement">
                    <span>{formatDate(featuredPost.date)}</span>
                    <span>&middot;</span>
                    <span>{featuredPost.author}</span>
                    <span>&middot;</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {featuredPost.readTime} min
                    </span>
                  </div>
                  <span className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-pili-black transition-colors group-hover:text-pili-safety-deep">
                    Ler mais
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            </AnimateOnScroll>
          </div>
        </section>
      )}

      {/* Category filters + Grid */}
      <section className="py-16 px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12">
            <Suspense fallback={null}>
              <BlogCategoryFilter />
            </Suspense>
          </div>

          {gridPosts.length === 0 ? (
            <p className="text-center text-pili-concrete">
              Nenhum artigo encontrado nesta categoria.
            </p>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {gridPosts.map((post, i) => (
                <AnimateOnScroll key={post.slug} delay={i * 0.06}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group flex flex-col border border-pili-mist bg-pili-white transition-all hover:border-pili-black"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-pili-mist">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      <span className="absolute left-3 top-3 bg-pili-safety px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-pili-white">
                        {CATEGORY_LABELS[post.category]}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <div className="flex items-center gap-3 font-mono text-[11px] text-pili-cement">
                        <span>{formatDate(post.date)}</span>
                        <span>&middot;</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {post.readTime} min
                        </span>
                      </div>
                      <h3 className="mt-3 font-display text-lg font-bold uppercase text-pili-black">
                        {post.title}
                      </h3>
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-pili-iron line-clamp-3">
                        {post.excerpt}
                      </p>
                      <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-pili-concrete transition-colors group-hover:text-pili-safety-deep">
                        Ler mais
                        <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </Link>
                </AnimateOnScroll>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-pili-black py-20 px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-display text-[length:var(--text-h2)] font-black uppercase text-pili-white">
            Precisa de uma solução de descarga?
          </h2>
          <p className="mt-4 text-pili-cement">
            Fale com a equipe técnica da PILI Industrial e receba uma
            recomendação personalizada para sua operação.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/orcamento"
              className="inline-flex items-center gap-2 bg-pili-safety px-8 py-4 text-sm font-semibold uppercase tracking-wider text-pili-white transition-colors hover:bg-pili-safety-deep"
            >
              Solicitar orçamento
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/produtos"
              className="inline-flex items-center gap-2 border border-pili-white px-8 py-4 text-sm font-semibold uppercase tracking-wider text-pili-white transition-colors hover:bg-pili-white hover:text-pili-black"
            >
              Ver produtos
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
