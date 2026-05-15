import { notFound } from "next/navigation";
import { Link } from "@/i18n/routing";
import { generatePageMetadata } from "@/lib/seo";
import { AnimateOnScroll } from "@/components/shared/animate-on-scroll";
import {
  ECOSYSTEM_PROJECTS,
  getEcosystemProject,
} from "@/lib/data/ecosystem";
import {
  ShieldCheck,
  Truck,
  BadgeCheck,
  Headphones,
  LayoutDashboard,
  Radio,
  Bell,
  FileBarChart,
  Route,
  Scale,
  FileCheck,
  Plug,
  ListOrdered,
  Link as LinkIcon,
  Monitor,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  Quote,
  ChevronDown,
} from "lucide-react";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  ShieldCheck,
  Truck,
  BadgeCheck,
  Headphones,
  LayoutDashboard,
  Radio,
  Bell,
  FileBarChart,
  Route,
  Scale,
  FileCheck,
  Plug,
  ListOrdered,
  Link: LinkIcon,
  Monitor,
};

interface ColorConfig {
  bg: string;
  text: string;
  border: string;
  bgLight: string;
}

const DEFAULT_COLORS: ColorConfig = {
  bg: "bg-pili-safety",
  text: "text-pili-safety",
  border: "border-pili-safety",
  bgLight: "bg-pili-safety/10",
};

const COLOR_MAP: Record<string, ColorConfig> = {
  "pili-safety": {
    bg: "bg-pili-safety",
    text: "text-pili-safety",
    border: "border-pili-safety",
    bgLight: "bg-pili-safety/10",
  },
  "pili-info": {
    bg: "bg-pili-info",
    text: "text-pili-info",
    border: "border-pili-info",
    bgLight: "bg-pili-info/10",
  },
  "pili-success": {
    bg: "bg-pili-success",
    text: "text-pili-success",
    border: "border-pili-success",
    bgLight: "bg-pili-success/10",
  },
  "purple-600": {
    bg: "bg-purple-600",
    text: "text-purple-600",
    border: "border-purple-600",
    bgLight: "bg-purple-600/10",
  },
};

export function generateStaticParams() {
  return ECOSYSTEM_PROJECTS.map((p) => ({ projeto: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ projeto: string }>;
}) {
  const { projeto } = await params;
  const project = getEcosystemProject(projeto);
  if (!project) return {};
  return generatePageMetadata({
    title: project.name,
    description: `${project.tagline}. ${project.description.slice(0, 120)}...`,
    path: `/ecossistema/${project.slug}`,
  });
}

export default async function EcosystemProjectPage({
  params,
}: {
  params: Promise<{ projeto: string }>;
}) {
  const { projeto } = await params;
  const project = getEcosystemProject(projeto);
  if (!project) notFound();

  const colors = COLOR_MAP[project.color] ?? DEFAULT_COLORS;

  return (
    <main className="pt-[var(--header-height)]">
      {/* ─── Hero ─── */}
      <section className="relative bg-pili-black py-24 px-6 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-6xl lg:grid lg:grid-cols-2 lg:items-center lg:gap-16">
          <div>
            <AnimateOnScroll>
              <span
                className={`inline-block font-mono text-xs uppercase tracking-widest ${colors.text}`}
              >
                Ecossistema PILI
              </span>
              <h1 className="mt-4 font-display text-[length:var(--text-display-2)] font-black uppercase text-pili-white">
                {project.name}
              </h1>
              <p className="mt-4 max-w-xl text-lg leading-relaxed text-pili-cement">
                {project.tagline}
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 ${colors.bg} px-8 py-4 text-sm font-semibold uppercase tracking-wider text-pili-white transition-opacity hover:opacity-90`}
                >
                  Acessar plataforma
                  <ExternalLink className="h-4 w-4" />
                </a>
                <Link
                  href="/orcamento"
                  className="inline-flex items-center gap-2 border border-pili-white/30 px-8 py-4 text-sm font-semibold uppercase tracking-wider text-pili-white transition-colors hover:border-pili-white hover:bg-pili-white/5"
                >
                  Solicitar demonstração
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </AnimateOnScroll>
          </div>

          {/* Screenshot placeholder */}
          <AnimateOnScroll delay={0.2} direction="right">
            <div className="relative mt-12 lg:mt-0">
              <div
                className={`aspect-[16/10] w-full border ${colors.border} bg-pili-graphite`}
              >
                <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-8">
                  <div
                    className={`flex h-16 w-16 items-center justify-center ${colors.bgLight}`}
                  >
                    <Monitor className={`h-8 w-8 ${colors.text}`} />
                  </div>
                  <span className="font-mono text-xs uppercase tracking-wider text-pili-cement">
                    {project.name} — Interface da plataforma
                  </span>
                </div>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ─── Stats band ─── */}
      <section className="border-b border-pili-mist py-16 px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-wrap justify-center gap-16 lg:gap-24">
          {project.stats.map((stat, index) => (
            <AnimateOnScroll key={stat.label} delay={index * 0.1}>
              <div className="text-center">
                <span
                  className={`font-mono text-5xl font-black lg:text-6xl ${colors.text}`}
                >
                  {stat.value}
                </span>
                <span className="mt-3 block font-mono text-[11px] uppercase tracking-wider text-pili-cement">
                  {stat.label}
                </span>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </section>

      {/* ─── O que é ─── */}
      <section className="py-20 px-6 lg:px-8">
        <div className="mx-auto max-w-6xl lg:grid lg:grid-cols-2 lg:gap-16">
          <AnimateOnScroll>
            <h2 className="font-display text-[length:var(--text-h2)] font-black uppercase text-pili-black">
              O que é o {project.name}
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-pili-iron">
              {project.description}
            </p>
          </AnimateOnScroll>
          <AnimateOnScroll delay={0.15}>
            <div className="mt-8 lg:mt-0">
              <h3 className="font-display text-sm font-bold uppercase tracking-wider text-pili-concrete">
                Principais benefícios
              </h3>
              <ul className="mt-6 space-y-4">
                {project.features.map((feature) => (
                  <li key={feature.title} className="flex items-start gap-3">
                    <CheckCircle2
                      className={`mt-0.5 h-5 w-5 shrink-0 ${colors.text}`}
                    />
                    <div>
                      <span className="font-semibold text-pili-black">
                        {feature.title}
                      </span>
                      <span className="text-pili-concrete">
                        {" "}
                        — {feature.description.split(".")[0]}.
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ─── Features grid (3 cols) ─── */}
      <section className="bg-pili-paper py-20 px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <AnimateOnScroll>
            <h2 className="font-display text-[length:var(--text-h2)] font-black uppercase text-pili-black">
              Funcionalidades
            </h2>
            <p className="mt-4 max-w-2xl text-pili-concrete">
              Recursos desenvolvidos para maximizar a eficiência da sua operação.
            </p>
          </AnimateOnScroll>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {project.features.map((feature, index) => {
              const Icon = ICON_MAP[feature.icon];
              return (
                <AnimateOnScroll key={feature.title} delay={index * 0.1}>
                  <div className="group h-full border border-pili-mist bg-pili-white p-8 transition-all hover:border-pili-black">
                    {Icon && (
                      <div
                        className={`mb-6 flex h-14 w-14 items-center justify-center ${colors.bgLight}`}
                      >
                        <Icon className={`h-7 w-7 ${colors.text}`} />
                      </div>
                    )}
                    <h3 className="font-display text-lg font-bold uppercase text-pili-black">
                      {feature.title}
                    </h3>
                    <p className="mt-3 leading-relaxed text-pili-concrete">
                      {feature.description}
                    </p>
                  </div>
                </AnimateOnScroll>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Como funciona ─── */}
      <section className="py-20 px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <AnimateOnScroll>
            <h2 className="font-display text-[length:var(--text-h2)] font-black uppercase text-pili-black">
              Como funciona
            </h2>
            <p className="mt-4 max-w-2xl text-pili-concrete">
              Da configuração aos resultados em poucos passos.
            </p>
          </AnimateOnScroll>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {project.howItWorks.map((step, index) => (
              <AnimateOnScroll key={step.step} delay={index * 0.1}>
                <div className="relative">
                  <span
                    className={`font-mono text-5xl font-black ${colors.text} opacity-20`}
                  >
                    {step.step}
                  </span>
                  <h3 className="mt-2 font-display text-lg font-bold uppercase text-pili-black">
                    {step.title}
                  </h3>
                  <p className="mt-3 leading-relaxed text-pili-concrete">
                    {step.description}
                  </p>
                  {index < project.howItWorks.length - 1 && (
                    <div className="absolute right-0 top-8 hidden h-px w-8 bg-pili-mist lg:block" />
                  )}
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Integrações ─── */}
      <section className="bg-pili-paper py-20 px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <AnimateOnScroll>
            <div className="lg:grid lg:grid-cols-2 lg:items-center lg:gap-16">
              <div>
                <h2 className="font-display text-[length:var(--text-h2)] font-black uppercase text-pili-black">
                  Integrações e compatibilidade
                </h2>
                <p className="mt-4 text-pili-concrete">
                  O {project.name} se integra nativamente com os principais
                  sistemas e plataformas do mercado, garantindo troca de dados
                  segura e eficiente.
                </p>
              </div>
              <div className="mt-8 lg:mt-0">
                <div className="flex flex-wrap gap-3">
                  {project.integrations.map((integration) => (
                    <span
                      key={integration}
                      className={`inline-flex items-center border ${colors.border} px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wider text-pili-black`}
                    >
                      {integration}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ─── Depoimento ─── */}
      <section className="py-20 px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <AnimateOnScroll>
            <div className={`border-l-4 ${colors.border} bg-pili-paper p-8 lg:p-12`}>
              <Quote className={`h-8 w-8 ${colors.text} opacity-40`} />
              <blockquote className="mt-4 text-lg leading-relaxed text-pili-iron lg:text-xl">
                &ldquo;{project.testimonial.quote}&rdquo;
              </blockquote>
              <div className="mt-6 flex items-center gap-4">
                <div
                  className={`flex h-12 w-12 items-center justify-center ${colors.bgLight} font-display text-lg font-bold ${colors.text}`}
                >
                  {project.testimonial.author
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </div>
                <div>
                  <p className="font-semibold text-pili-black">
                    {project.testimonial.author}
                  </p>
                  <p className="font-mono text-xs uppercase tracking-wider text-pili-cement">
                    {project.testimonial.role} — {project.testimonial.company}
                  </p>
                </div>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="bg-pili-paper py-20 px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <AnimateOnScroll>
            <h2 className="font-display text-[length:var(--text-h2)] font-black uppercase text-pili-black">
              Perguntas frequentes
            </h2>
          </AnimateOnScroll>
          <div className="mt-12 space-y-0">
            {project.faq.map((item, index) => (
              <AnimateOnScroll key={index} delay={index * 0.08}>
                <details className="group border-b border-pili-mist">
                  <summary className="flex cursor-pointer items-center justify-between py-6 text-left">
                    <span className="pr-4 font-display text-base font-bold text-pili-black lg:text-lg">
                      {item.question}
                    </span>
                    <ChevronDown className="h-5 w-5 shrink-0 text-pili-cement transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="pb-6 leading-relaxed text-pili-concrete">
                    {item.answer}
                  </p>
                </details>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA final ─── */}
      <section className="bg-pili-black py-24 px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <AnimateOnScroll>
            <span
              className={`inline-block font-mono text-xs uppercase tracking-widest ${colors.text}`}
            >
              {project.name}
            </span>
            <h2 className="mt-4 font-display text-[length:var(--text-h2)] font-black uppercase text-pili-white">
              Pronto para começar?
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-pili-cement">
              Acesse a plataforma agora ou solicite uma demonstração personalizada
              com nossa equipe técnica.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 ${colors.bg} px-8 py-4 text-sm font-semibold uppercase tracking-wider text-pili-white transition-opacity hover:opacity-90`}
              >
                Acessar plataforma
                <ExternalLink className="h-4 w-4" />
              </a>
              <Link
                href="/orcamento"
                className="inline-flex items-center gap-2 border border-pili-white/30 px-8 py-4 text-sm font-semibold uppercase tracking-wider text-pili-white transition-colors hover:border-pili-white hover:bg-pili-white/5"
              >
                Solicitar demonstração
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </section>
    </main>
  );
}
