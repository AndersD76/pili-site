import { notFound } from "next/navigation";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import {
  BLOG_POSTS,
  getBlogPost,
} from "@/lib/data/blog";
import {
  generatePageMetadata,
  generateBreadcrumbJsonLd,
} from "@/lib/seo";
import { AnimateOnScroll } from "@/components/shared/animate-on-scroll";
import { ArrowLeft, ArrowRight, Clock, User, Calendar } from "lucide-react";

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};
  return generatePageMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
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

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const contentParagraphs = post.content.split("\n\n");

  const relatedPosts = BLOG_POSTS.filter(
    (p) => p.slug !== post.slug,
  ).slice(0, 3);

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Blog", url: "/pt-BR/blog" },
    { name: post.title, url: `/pt-BR/blog/${post.slug}` },
  ]);

  return (
    <main className="pt-[var(--header-height)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Breadcrumb */}
      <div className="bg-pili-paper px-6 py-3 lg:px-8">
        <div className="mx-auto max-w-6xl font-mono text-xs text-pili-cement">
          <Link href="/" className="hover:text-pili-black">
            Home
          </Link>{" "}
          /{" "}
          <Link href="/blog" className="hover:text-pili-black">
            Blog
          </Link>{" "}
          / <span className="text-pili-black">{post.title}</span>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-pili-black py-16 px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <span className="inline-block bg-pili-safety px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-pili-white">
            {CATEGORY_LABELS[post.category]}
          </span>
          <h1 className="mt-6 font-display text-[length:var(--text-h1)] font-black uppercase text-pili-white">
            {post.title}
          </h1>
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-xs text-pili-cement">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              {formatDate(post.date)}
            </span>
            <span className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" />
              {post.author}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {post.readTime} min de leitura
            </span>
          </div>
        </div>
      </section>

      {/* Featured image */}
      <section className="px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="relative -mt-8 aspect-[16/9] overflow-hidden">
            <Image
              src={post.image}
              alt={post.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 896px"
            />
          </div>
        </div>
      </section>

      {/* Article content */}
      <section className="py-16 px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="space-y-6">
            {contentParagraphs.map((paragraph, i) => (
              <p key={i} className="leading-relaxed text-pili-iron">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Tags */}
          <div className="mt-12 border-t border-pili-mist pt-8">
            <span className="font-mono text-[10px] uppercase tracking-wider text-pili-cement">
              Tags
            </span>
            <div className="mt-3 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="border border-pili-mist px-3 py-1 text-xs text-pili-concrete"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Share */}
          <div className="mt-8 border-t border-pili-mist pt-8">
            <span className="font-mono text-[10px] uppercase tracking-wider text-pili-cement">
              Compartilhar
            </span>
            <p className="mt-2 text-sm text-pili-concrete">
              Copie o link desta página e compartilhe com colegas e parceiros do
              setor.
            </p>
          </div>

          {/* Back link */}
          <div className="mt-12">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-pili-black transition-colors hover:text-pili-safety-deep"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar ao blog
            </Link>
          </div>
        </div>
      </section>

      {/* Related posts */}
      <section className="bg-pili-paper py-16 px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-[length:var(--text-h2)] font-black uppercase text-pili-black">
            Outros artigos
          </h2>
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {relatedPosts.map((related, i) => (
              <AnimateOnScroll key={related.slug} delay={i * 0.08}>
                <Link
                  href={`/blog/${related.slug}`}
                  className="group flex flex-col border border-pili-mist bg-pili-white transition-all hover:border-pili-black"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-pili-mist">
                    <Image
                      src={related.image}
                      alt={related.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <span className="absolute left-3 top-3 bg-pili-safety px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-pili-white">
                      {CATEGORY_LABELS[related.category]}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <span className="font-mono text-[11px] text-pili-cement">
                      {formatDate(related.date)}
                    </span>
                    <h3 className="mt-2 font-display text-lg font-bold uppercase text-pili-black">
                      {related.title}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-pili-iron line-clamp-2">
                      {related.excerpt}
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
        </div>
      </section>

      {/* CTA */}
      <section className="bg-pili-graphite py-16 px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-[length:var(--text-h2)] font-black uppercase text-pili-white">
            Precisa de um tombador hidráulico?
          </h2>
          <p className="mt-4 text-pili-cement">
            Solicite um orçamento personalizado e receba a recomendação técnica
            da equipe PILI Industrial.
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
