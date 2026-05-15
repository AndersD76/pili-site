import { generatePageMetadata } from "@/lib/seo";
import { COMPANY } from "@/lib/constants";
import { Leaf, Droplets, Recycle, Zap } from "lucide-react";

export function generateMetadata() {
  return generatePageMetadata({
    title: "Política Ambiental",
    description:
      "Compromisso ambiental da PILI Industrial. Gestão de resíduos, eficiência energética e práticas sustentáveis na fabricação de equipamentos industriais.",
    path: "/politica-ambiental",
  });
}

const COMMITMENTS = [
  {
    icon: Recycle,
    title: "Gestão de resíduos",
    desc: "Programa de gestão de resíduos industriais com segregação na origem, destinação certificada e reciclagem de aço e materiais metálicos. Laudos de destinação conforme legislação ambiental vigente.",
  },
  {
    icon: Droplets,
    title: "Recursos hídricos",
    desc: "Controle do consumo de água no processo fabril, tratamento de efluentes industriais e reuso de água em processos não críticos. Monitoramento periódico da qualidade dos efluentes descartados.",
  },
  {
    icon: Zap,
    title: "Eficiência energética",
    desc: "Otimização do consumo energético na produção, utilização de equipamentos de alta eficiência e iluminação LED no parque fabril. Estudo contínuo de fontes de energia renovável.",
  },
  {
    icon: Leaf,
    title: "Projetos sustentáveis",
    desc: "Desenvolvimento de equipamentos com maior vida útil, menor consumo energético operacional e componentes recicláveis. Projetos que reduzem o tempo de descarga e, consequentemente, as emissões de veículos em espera.",
  },
] as const;

export default function PoliticaAmbientalPage() {
  return (
    <main className="pt-[var(--header-height)]">
      {/* Hero */}
      <section className="bg-pili-black py-16 px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h1 className="font-display text-[length:var(--text-h1)] font-black uppercase text-pili-white">
            Política Ambiental
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
            e se compromete a conduzir suas atividades de fabricação,
            comercialização e prestação de serviços de forma ambientalmente
            responsável. Buscamos continuamente a redução do impacto ambiental de
            nossas operações e produtos, respeitando a legislação vigente e
            promovendo boas práticas entre colaboradores, fornecedores e
            parceiros.
          </p>
          <p className="mt-4 leading-relaxed text-pili-concrete">
            Entendemos que nossos equipamentos contribuem diretamente para a
            eficiência logística do agronegócio, reduzindo tempos de espera de
            caminhões e, por consequência, as emissões de gases de efeito estufa
            associadas à logística de grãos e insumos.
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
            Princípios orientadores
          </h2>
          <ul className="mt-8 space-y-4">
            {[
              "Cumprir integralmente a legislação ambiental brasileira e as normas aplicáveis ao setor metalúrgico e industrial.",
              "Promover a conscientização ambiental entre colaboradores, fornecedores e parceiros comerciais.",
              "Buscar continuamente a redução na geração de resíduos, emissões e consumo de recursos naturais.",
              "Priorizar materiais recicláveis e fornecedores comprometidos com práticas ambientais responsáveis.",
              "Investir em pesquisa e desenvolvimento de produtos com menor impacto ambiental ao longo de seu ciclo de vida.",
              "Manter transparência nas informações ambientais e nos resultados das ações de sustentabilidade.",
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
            Dúvidas sobre nossa política ambiental? Entre em contato pelo e-mail{" "}
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
