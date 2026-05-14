import { Link } from "@/i18n/routing";
import { generatePageMetadata } from "@/lib/seo";
import { ShieldCheck, FileCheck, Award, Clock, CheckCircle2 } from "lucide-react";

export function generateMetadata() {
  return generatePageMetadata({
    title: "Certificacoes e Garantia",
    description:
      "PILI Industrial: ISO 9001, conformidade NR-10 e NR-12, garantia estrutural de 5 anos. Qualidade e seguranca em todos os equipamentos.",
    path: "/certificacoes",
  });
}

const CERTIFICATIONS = [
  {
    icon: ShieldCheck,
    title: "ISO 9001:2015",
    subtitle: "Sistema de Gestao da Qualidade",
    points: [
      "Processos padronizados de projeto, fabricacao e montagem",
      "Auditorias internas periodicas e melhoria continua",
      "Rastreabilidade completa de materiais e componentes",
      "Controle dimensional rigoroso em todas as etapas",
      "Qualificacao e certificacao de soldadores",
    ],
  },
  {
    icon: Award,
    title: "NR-10",
    subtitle: "Seguranca em Instalacoes Eletricas",
    points: [
      "Projetos eletricos conforme norma regulamentadora NR-10",
      "Paineis de comando com protecao contra sobrecarga",
      "Aterramento e equipotencializacao de toda a estrutura",
      "Sinalizacao de seguranca e procedimentos de bloqueio",
      "Documentacao tecnica completa para fiscalizacao",
    ],
  },
  {
    icon: FileCheck,
    title: "NR-12",
    subtitle: "Seguranca em Maquinas e Equipamentos",
    points: [
      "Protecoes mecanicas fixas e moveis em pontos de risco",
      "Sistemas de parada de emergencia acessiveis",
      "Intertravamentos e dispositivos de seguranca categoria 3",
      "Manual de operacao e manutencao completo",
      "Laudo tecnico de conformidade NR-12 incluso",
    ],
  },
  {
    icon: Clock,
    title: "Garantia de 5 anos",
    subtitle: "Garantia Estrutural",
    points: [
      "5 anos de garantia sobre a estrutura metalica principal",
      "Cobertura contra defeitos de fabricacao e materiais",
      "Suporte tecnico remoto e presencial durante o periodo",
      "Disponibilidade de pecas de reposicao originais",
      "Possibilidade de extensao da garantia mediante contrato",
    ],
  },
] as const;

export default function CertificacoesPage() {
  return (
    <main className="pt-[var(--header-height)]">
      {/* Hero */}
      <section className="bg-pili-black py-20 px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h1 className="font-display text-[length:var(--text-display-2)] font-black uppercase text-pili-white">
            Certificacoes e Garantia
          </h1>
          <p className="mt-4 max-w-2xl text-pili-cement">
            Todos os equipamentos PILI sao projetados e fabricados em
            conformidade com as normas brasileiras e internacionais de qualidade
            e seguranca. Garantia estrutural de 5 anos em toda a linha.
          </p>
        </div>
      </section>

      {/* Cards */}
      <section className="py-16 px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-2">
            {CERTIFICATIONS.map((cert) => (
              <div
                key={cert.title}
                className="border border-pili-mist p-8 transition-all hover:border-pili-black"
              >
                <div className="flex items-center gap-4">
                  <cert.icon className="h-10 w-10 text-pili-safety" />
                  <div>
                    <h2 className="font-display text-xl font-bold uppercase text-pili-black">
                      {cert.title}
                    </h2>
                    <span className="font-mono text-xs uppercase tracking-wider text-pili-cement">
                      {cert.subtitle}
                    </span>
                  </div>
                </div>

                <ul className="mt-6 space-y-3">
                  {cert.points.map((point, i) => (
                    <li key={i} className="flex gap-3 text-sm text-pili-concrete">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-pili-success" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-pili-paper py-20 px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-display text-[length:var(--text-h2)] font-black uppercase text-pili-black">
            Documentacao tecnica
          </h2>
          <p className="mt-4 text-pili-concrete">
            Precisa de laudos, certificados ou documentacao tecnica para
            licitacao? Nossa equipe pode fornecer todos os documentos
            necessarios.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/catalogo"
              className="bg-pili-safety px-8 py-4 text-sm font-semibold uppercase tracking-wider text-pili-black transition-colors hover:bg-pili-safety-deep"
            >
              Baixar catalogo
            </Link>
            <Link
              href="/contato"
              className="border border-pili-black px-8 py-4 text-sm font-semibold uppercase tracking-wider text-pili-black transition-colors hover:bg-pili-black hover:text-pili-white"
            >
              Solicitar documentacao
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
