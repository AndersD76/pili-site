import { Link } from "@/i18n/routing";
import { generatePageMetadata } from "@/lib/seo";
import { ECOSYSTEM } from "@/lib/constants";
import { ExternalLink, Factory, Store, Cpu, BarChart3, Radio } from "lucide-react";

export function generateMetadata() {
  return generatePageMetadata({
    title: "Ecossistema PILI",
    description:
      "Conheca o ecossistema PILI: Industrial, Store, Tech, Raste e Harbor. Tecnologia, pecas, rastreabilidade e gestao de patio industrial.",
    path: "/ecossistema",
  });
}

const BRANDS = [
  {
    name: "PILI Industrial",
    tagline: "Fabricante de equipamentos desde 1979",
    desc: "Fabricante brasileira de tombadores hidraulicos, coletores de amostras e unidades de transbordo. Mais de 850 equipamentos instalados em 18 paises, com projetos de 9 a 30 metros e capacidade de 35 a 100 toneladas.",
    href: "/",
    icon: Factory,
    external: false,
  },
  {
    name: "PILI Store",
    tagline: "Pecas e acessorios online",
    desc: "Loja online de pecas de reposicao e acessorios para tombadores e equipamentos PILI. Disponibilidade imediata, envio para todo o Brasil e America Latina com rastreamento completo.",
    href: ECOSYSTEM.store,
    icon: Store,
    external: true,
  },
  {
    name: "PILI Tech",
    tagline: "Gestao de patio industrial",
    desc: "SaaS de gestao de patio industrial com IoT, protocolo MQTT e monitoramento em tempo real. Controle de filas, agendamento de caminhoes e dashboards operacionais para terminais portuarios e cooperativas.",
    href: ECOSYSTEM.tech,
    icon: Cpu,
    external: true,
  },
  {
    name: "PILI Raste",
    tagline: "Rastreabilidade e compliance",
    desc: "Plataforma de rastreabilidade de graos, compliance EUDR e inteligencia de preco de commodities. Certificacao de origem, cadeia de custodia e relatorios para exportacao europeia.",
    href: ECOSYSTEM.raste,
    icon: BarChart3,
    external: true,
  },
  {
    name: "PILI Harbor",
    tagline: "IoT para yard management",
    desc: "Sistema IoT mesh de yard management com ESP32, filtro de Kalman e posicionamento de precisao. Localizacao de veiculos em tempo real, otimizacao de rotas internas e reducao de tempo de permanencia.",
    href: ECOSYSTEM.harbor,
    icon: Radio,
    external: true,
  },
] as const;

export default function EcossistemaPage() {
  return (
    <main className="pt-[var(--header-height)]">
      {/* Hero */}
      <section className="bg-pili-black py-20 px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h1 className="font-display text-[length:var(--text-display-2)] font-black uppercase text-pili-white">
            Ecossistema PILI
          </h1>
          <p className="mt-4 max-w-3xl text-pili-cement">
            Alem de fabricar equipamentos de alta performance, a PILI desenvolve
            tecnologia propria para logistica, rastreabilidade e gestao
            industrial. Cinco plataformas integradas que cobrem toda a cadeia de
            valor do agronegocio e da industria.
          </p>
        </div>
      </section>

      {/* Brand cards */}
      <section className="py-16 px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-2">
            {BRANDS.map((brand) => {
              const content = (
                <div className="group flex h-full flex-col border border-pili-mist p-8 transition-all hover:border-pili-black">
                  <div className="flex items-center gap-4">
                    <brand.icon className="h-10 w-10 text-pili-safety" />
                    <div>
                      <h2 className="font-display text-xl font-bold uppercase text-pili-black">
                        {brand.name}
                      </h2>
                      <span className="font-mono text-xs uppercase tracking-wider text-pili-cement">
                        {brand.tagline}
                      </span>
                    </div>
                  </div>
                  <p className="mt-6 flex-1 leading-relaxed text-pili-concrete">
                    {brand.desc}
                  </p>
                  <div className="mt-6 flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wider text-pili-black transition-colors group-hover:text-pili-safety-deep">
                    {brand.external ? "Acessar plataforma" : "Ver produtos"}
                    {brand.external && <ExternalLink className="h-4 w-4" />}
                  </div>
                </div>
              );

              if (brand.external) {
                return (
                  <a
                    key={brand.name}
                    href={brand.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {content}
                  </a>
                );
              }

              return (
                <Link key={brand.name} href="/produtos">
                  {content}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Integration CTA */}
      <section className="bg-pili-paper py-20 px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-display text-[length:var(--text-h2)] font-black uppercase text-pili-black">
            Plataformas integradas
          </h2>
          <p className="mt-4 text-pili-concrete">
            Todas as plataformas do ecossistema PILI compartilham dados e se
            integram nativamente. Da fabricacao do equipamento ao monitoramento
            em tempo real da operacao, passando pela rastreabilidade de graos e
            gestao de patio.
          </p>
          <Link
            href="/contato"
            className="mt-8 inline-flex items-center justify-center bg-pili-safety px-8 py-4 text-sm font-semibold uppercase tracking-wider text-pili-black transition-colors hover:bg-pili-safety-deep"
          >
            Fale com a equipe PILI
          </Link>
        </div>
      </section>
    </main>
  );
}
