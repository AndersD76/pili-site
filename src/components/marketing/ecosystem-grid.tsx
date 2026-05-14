import { ECOSYSTEM } from "@/lib/constants";
import { ExternalLink, Store, Cpu, BarChart3, Radio } from "lucide-react";

const BRANDS = [
  {
    name: "PILI Store",
    desc: "Loja online de pecas de reposicao e acessorios para tombadores e equipamentos PILI.",
    href: ECOSYSTEM.store,
    icon: Store,
  },
  {
    name: "PILI Tech",
    desc: "SaaS de gestao de patio industrial com IoT, MQTT e monitoramento em tempo real.",
    href: ECOSYSTEM.tech,
    icon: Cpu,
  },
  {
    name: "PILI Raste",
    desc: "Plataforma de rastreabilidade, compliance EUDR e inteligencia de preco de commodities.",
    href: ECOSYSTEM.raste,
    icon: BarChart3,
  },
  {
    name: "PILI Harbor",
    desc: "IoT mesh de yard management com ESP32, Kalman filter e posicionamento de precisao.",
    href: ECOSYSTEM.harbor,
    icon: Radio,
  },
] as const;

export function EcosystemGrid() {
  return (
    <section className="bg-pili-black py-24 px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-display text-[length:var(--text-h1)] font-black uppercase text-pili-white">
          Ecossistema PILI
        </h2>
        <p className="mt-4 max-w-2xl text-pili-cement">
          Alem de fabricar equipamentos, a PILI desenvolve tecnologia propria
          para logistica, rastreabilidade e gestao industrial.
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {BRANDS.map((brand) => (
            <a
              key={brand.name}
              href={brand.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col border border-pili-iron p-6 transition-all hover:border-pili-safety"
            >
              <brand.icon className="h-8 w-8 text-pili-safety" />
              <h3 className="mt-4 font-display text-lg font-bold uppercase text-pili-white">
                {brand.name}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-pili-cement">
                {brand.desc}
              </p>
              <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-pili-safety transition-colors group-hover:text-pili-safety-bright">
                Acessar
                <ExternalLink className="h-3.5 w-3.5" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
