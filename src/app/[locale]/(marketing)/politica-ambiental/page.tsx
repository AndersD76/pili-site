import { generatePageMetadata } from "@/lib/seo";
import { COMPANY } from "@/lib/constants";
import { Leaf, Droplets, Recycle, Zap } from "lucide-react";

export function generateMetadata() {
  return generatePageMetadata({
    title: "Politica Ambiental",
    description:
      "Compromisso ambiental da PILI Industrial. Gestao de residuos, eficiencia energetica e praticas sustentaveis na fabricacao de equipamentos industriais.",
    path: "/politica-ambiental",
  });
}

const COMMITMENTS = [
  {
    icon: Recycle,
    title: "Gestao de residuos",
    desc: "Programa de gestao de residuos industriais com segregacao na origem, destinacao certificada e reciclagem de aco e materiais metalicos. Laudos de destinacao conforme legislacao ambiental vigente.",
  },
  {
    icon: Droplets,
    title: "Recursos hidricos",
    desc: "Controle do consumo de agua no processo fabril, tratamento de efluentes industriais e reuso de agua em processos nao criticos. Monitoramento periodico da qualidade dos efluentes descartados.",
  },
  {
    icon: Zap,
    title: "Eficiencia energetica",
    desc: "Otimizacao do consumo energetico na producao, utilizacao de equipamentos de alta eficiencia e iluminacao LED no parque fabril. Estudo continuo de fontes de energia renovavel.",
  },
  {
    icon: Leaf,
    title: "Projetos sustentaveis",
    desc: "Desenvolvimento de equipamentos com maior vida util, menor consumo energetico operacional e componentes reciclaveis. Projetos que reduzem o tempo de descarga e, consequentemente, as emissoes de veiculos em espera.",
  },
] as const;

export default function PoliticaAmbientalPage() {
  return (
    <main className="pt-[var(--header-height)]">
      {/* Hero */}
      <section className="bg-pili-black py-16 px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h1 className="font-display text-[length:var(--text-h1)] font-black uppercase text-pili-white">
            Politica Ambiental
          </h1>
          <p className="mt-3 font-mono text-xs uppercase tracking-wider text-pili-cement">
            Compromisso com a responsabilidade ambiental
          </p>
        </div>
      </section>

      {/* Statement */}
      <section className="py-16 px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-display text-[length:var(--text-h2)] font-black uppercase text-pili-black">
            Nosso compromisso
          </h2>
          <p className="mt-6 leading-relaxed text-pili-concrete">
            A {COMPANY.name} reconhece sua responsabilidade com o meio ambiente
            e se compromete a conduzir suas atividades de fabricacao,
            comercializacao e prestacao de servicos de forma ambientalmente
            responsavel. Buscamos continuamente a reducao do impacto ambiental de
            nossas operacoes e produtos, respeitando a legislacao vigente e
            promovendo boas praticas entre colaboradores, fornecedores e
            parceiros.
          </p>
          <p className="mt-4 leading-relaxed text-pili-concrete">
            Entendemos que nossos equipamentos contribuem diretamente para a
            eficiencia logistica do agronegocio, reduzindo tempos de espera de
            caminhoes e, por consequencia, as emissoes de gases de efeito estufa
            associadas a logistica de graos e insumos.
          </p>
        </div>
      </section>

      {/* Commitments */}
      <section className="bg-pili-paper py-16 px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-display text-[length:var(--text-h2)] font-black uppercase text-pili-black">
            Diretrizes ambientais
          </h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-2">
            {COMMITMENTS.map((item) => (
              <div key={item.title} className="flex flex-col">
                <item.icon className="h-8 w-8 text-pili-safety" />
                <h3 className="mt-4 font-display text-lg font-bold uppercase text-pili-black">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-pili-concrete">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="py-16 px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-display text-[length:var(--text-h2)] font-black uppercase text-pili-black">
            Principios orientadores
          </h2>
          <ul className="mt-8 space-y-4">
            {[
              "Cumprir integralmente a legislacao ambiental brasileira e as normas aplicaveis ao setor metalurgico e industrial.",
              "Promover a conscientizacao ambiental entre colaboradores, fornecedores e parceiros comerciais.",
              "Buscar continuamente a reducao na geracao de residuos, emissoes e consumo de recursos naturais.",
              "Priorizar materiais reciclaveis e fornecedores comprometidos com praticas ambientais responsaveis.",
              "Investir em pesquisa e desenvolvimento de produtos com menor impacto ambiental ao longo de seu ciclo de vida.",
              "Manter transparencia nas informacoes ambientais e nos resultados das acoes de sustentabilidade.",
            ].map((principle, i) => (
              <li
                key={i}
                className="flex gap-4 text-sm leading-relaxed text-pili-concrete"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-pili-safety" />
                {principle}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Contact */}
      <section className="bg-pili-paper py-12 px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm text-pili-concrete">
            Duvidas sobre nossa politica ambiental? Entre em contato pelo e-mail{" "}
            <a
              href={`mailto:${COMPANY.email}`}
              className="font-semibold text-pili-black underline transition-colors hover:text-pili-safety-deep"
            >
              {COMPANY.email}
            </a>{" "}
            ou pelo telefone {COMPANY.phone}.
          </p>
        </div>
      </section>
    </main>
  );
}
