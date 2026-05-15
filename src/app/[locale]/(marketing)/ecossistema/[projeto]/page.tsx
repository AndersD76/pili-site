import { notFound } from "next/navigation";
import { Link } from "@/i18n/routing";
import { generatePageMetadata } from "@/lib/seo";
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
      {/* Hero */}
      <section className="bg-pili-black py-24 px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <span
            className={`inline-block font-mono text-xs uppercase tracking-widest ${colors.text}`}
          >
            Ecossistema PILI
          </span>
          <h1 className="mt-4 font-display text-[length:var(--text-display-2)] font-black uppercase text-pili-white">
            {project.name}
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-pili-cement">
            {project.tagline}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 ${colors.bg} px-8 py-4 text-sm font-semibold uppercase tracking-wider text-pili-black transition-opacity hover:opacity-90`}
            >
              Conhecer o projeto
              <ExternalLink className="h-4 w-4" />
            </a>
            <Link
              href="/orcamento"
              className="inline-flex items-center gap-2 border border-pili-white/30 px-8 py-4 text-sm font-semibold uppercase tracking-wider text-pili-white transition-colors hover:border-pili-white hover:bg-pili-white/5"
            >
              Solicitar demonstracao
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats band */}
      <section className={`border-b border-pili-mist py-12 px-6 lg:px-8`}>
        <div className="mx-auto flex max-w-6xl flex-wrap justify-center gap-12 lg:gap-20">
          {project.stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <span
                className={`font-mono text-4xl font-black lg:text-5xl ${colors.text}`}
              >
                {stat.value}
              </span>
              <span className="mt-2 block font-mono text-[11px] uppercase tracking-wider text-pili-cement">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Features grid */}
      <section className="py-20 px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-[length:var(--text-h2)] font-black uppercase text-pili-black">
            Funcionalidades
          </h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-2">
            {project.features.map((feature) => {
              const Icon = ICON_MAP[feature.icon];
              return (
                <div
                  key={feature.title}
                  className="border border-pili-mist p-8 transition-all hover:border-pili-black"
                >
                  <div className="flex items-start gap-4">
                    {Icon && (
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center ${colors.bgLight}`}
                      >
                        <Icon className={`h-6 w-6 ${colors.text}`} />
                      </div>
                    )}
                    <div>
                      <h3 className="font-display text-lg font-bold uppercase text-pili-black">
                        {feature.title}
                      </h3>
                      <p className="mt-2 leading-relaxed text-pili-concrete">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Description section */}
      <section className="bg-pili-paper py-20 px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-display text-[length:var(--text-h2)] font-black uppercase text-pili-black">
            Sobre o {project.name}
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-pili-iron">
            {project.description}
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-pili-graphite py-20 px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-display text-[length:var(--text-h2)] font-black uppercase text-pili-white">
            Pronto para comecar?
          </h2>
          <p className="mt-4 text-pili-cement">
            Acesse a plataforma ou solicite uma demonstracao com nossa equipe
            tecnica.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 ${colors.bg} px-8 py-4 text-sm font-semibold uppercase tracking-wider text-pili-black transition-opacity hover:opacity-90`}
            >
              Acessar plataforma
              <ExternalLink className="h-4 w-4" />
            </a>
            <Link
              href="/orcamento"
              className="inline-flex items-center gap-2 border border-pili-white/30 px-8 py-4 text-sm font-semibold uppercase tracking-wider text-pili-white transition-colors hover:border-pili-white hover:bg-pili-white/5"
            >
              Solicitar demonstracao
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
