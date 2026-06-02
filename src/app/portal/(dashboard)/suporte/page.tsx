import type { Metadata } from "next";
import { COMPANY } from "@/lib/constants";
import { Phone, MessageCircle, Mail, AlertTriangle } from "lucide-react";

export const metadata: Metadata = {
  title: "Suporte tecnico",
};

const FAQ_ITEMS = [
  {
    question: "Como solicitar uma manutencao?",
    answer: "Acesse Ordens de Servico > Nova solicitacao",
  },
  {
    question: "Onde encontro o manual do meu equipamento?",
    answer: "Na secao Documentos ou na pagina do equipamento",
  },
  {
    question: "Qual o prazo de garantia?",
    answer:
      "A garantia padrao e de 5 anos para a estrutura e 2 anos para componentes hidraulicos",
  },
  {
    question: "Como pedir pecas de reposicao?",
    answer: "Acesse a PILI Store ou solicite pelo suporte tecnico",
  },
];

function whatsappLink(phone: string) {
  return `https://wa.me/${phone.replace(/\D/g, "")}`;
}

export default function SuportePage() {
  return (
    <div className="mx-auto max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold tracking-tight text-pili-graphite">
          Suporte tecnico
        </h1>
        <p className="mt-1 text-base text-pili-concrete">
          Entre em contato com a equipe tecnica PILI
        </p>
      </div>

      {/* Contact cards */}
      <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Telefone */}
        <div className="rounded-lg border border-pili-mist bg-pili-white p-6">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-pili-paper">
            <Phone className="h-6 w-6 text-pili-concrete" />
          </div>
          <h3 className="font-display text-lg font-bold text-pili-graphite">
            Telefone
          </h3>
          <p className="mt-1 font-medium text-pili-graphite">
            {COMPANY.phone}
          </p>
          <p className="mt-1 text-sm text-pili-cement">Seg a Sex, 8h as 18h</p>
        </div>

        {/* WhatsApp */}
        <a
          href={whatsappLink(COMPANY.whatsapp)}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg border border-pili-mist bg-pili-white p-6 transition-colors hover:border-pili-safety"
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-pili-paper">
            <MessageCircle className="h-6 w-6 text-pili-concrete" />
          </div>
          <h3 className="font-display text-lg font-bold text-pili-graphite">
            WhatsApp
          </h3>
          <p className="mt-1 font-medium text-pili-graphite">
            {COMPANY.whatsapp}
          </p>
          <p className="mt-1 text-sm text-pili-cement">Atendimento rapido</p>
        </a>

        {/* E-mail */}
        <a
          href="mailto:suporte@pili.ind.br"
          className="rounded-lg border border-pili-mist bg-pili-white p-6 transition-colors hover:border-pili-safety"
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-pili-paper">
            <Mail className="h-6 w-6 text-pili-concrete" />
          </div>
          <h3 className="font-display text-lg font-bold text-pili-graphite">
            E-mail
          </h3>
          <p className="mt-1 font-medium text-pili-graphite">
            suporte@pili.ind.br
          </p>
          <p className="mt-1 text-sm text-pili-cement">
            Resposta em ate 24h
          </p>
        </a>
      </div>

      {/* FAQ */}
      <section className="mb-10">
        <h2 className="mb-4 font-display text-lg font-bold text-pili-graphite">
          Perguntas frequentes
        </h2>
        <div className="space-y-2">
          {FAQ_ITEMS.map((item) => (
            <details
              key={item.question}
              className="group rounded-lg border border-pili-mist bg-pili-white"
            >
              <summary className="cursor-pointer px-6 py-4 font-medium text-pili-graphite transition-colors hover:bg-pili-paper">
                {item.question}
              </summary>
              <div className="px-6 pb-4 text-sm text-pili-concrete">
                {item.answer}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* Emergency contact */}
      <section className="rounded-lg border-l-4 border-l-pili-safety bg-red-50 p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-100">
            <AlertTriangle className="h-5 w-5 text-pili-safety" />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold text-pili-graphite">
              Equipamento parado? Ligue para nosso plantao 24h
            </h3>
            <p className="mt-2 font-display text-2xl font-bold text-pili-graphite">
              +55 54 3321-9000
            </p>
            <p className="mt-1 text-sm text-pili-concrete">
              Atendimento emergencial para clientes com contrato de manutencao
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
