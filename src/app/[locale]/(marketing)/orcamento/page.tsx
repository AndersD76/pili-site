import { generatePageMetadata } from "@/lib/seo";
import { LeadForm } from "@/components/marketing/lead-form";
import { COMPANY } from "@/lib/constants";

export function generateMetadata() {
  return generatePageMetadata({
    title: "Solicitar Orçamento",
    description:
      "Solicite um orçamento para tombadores hidráulicos, coletores de amostras e equipamentos de descarga PILI Industrial. Resposta em até 24h.",
    path: "/orcamento",
  });
}

export default function OrcamentoPage() {
  return (
    <main className="pt-[var(--header-height)]">
      {/* Hero */}
      <section className="bg-pili-black py-20 px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h1 className="font-display text-[length:var(--text-display-2)] font-black uppercase text-pili-white">
            Solicitar orçamento
          </h1>
          <p className="mt-4 max-w-2xl text-pili-cement">
            Preencha o formulário abaixo com os dados do seu projeto. Nossa
            equipe técnica irá dimensionar o equipamento ideal e retornar com uma
            proposta em até 24 horas úteis.
          </p>
        </div>
      </section>

      {/* Form section */}
      <section className="py-16 px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="border border-pili-mist p-8 lg:p-12">
            <h2 className="font-display text-[length:var(--text-h2)] font-black uppercase text-pili-black">
              Dados do projeto
            </h2>
            <p className="mt-3 text-sm text-pili-concrete">
              Campos marcados com * são obrigatórios. Quanto mais detalhes
              informar, mais precisa será a proposta.
            </p>
            <div className="mt-8">
              <LeadForm compact={false} source="ORCAMENTO" />
            </div>
          </div>
        </div>
      </section>

      {/* Additional info */}
      <section className="bg-pili-paper py-16 px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-display text-xl font-bold uppercase text-pili-black">
            Prefere outro canal?
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            <a
              href={`https://wa.me/${COMPANY.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent("Olá, gostaria de solicitar um orçamento.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-pili-mist bg-pili-white p-6 transition-all hover:border-pili-black"
            >
              <span className="font-display text-sm font-bold uppercase text-pili-black">
                WhatsApp
              </span>
              <p className="mt-2 font-mono text-xs text-pili-concrete">
                {COMPANY.whatsapp}
              </p>
            </a>
            <a
              href={`mailto:${COMPANY.emailComercial}?subject=${encodeURIComponent("Solicitação de orçamento")}`}
              className="border border-pili-mist bg-pili-white p-6 transition-all hover:border-pili-black"
            >
              <span className="font-display text-sm font-bold uppercase text-pili-black">
                E-mail comercial
              </span>
              <p className="mt-2 font-mono text-xs text-pili-concrete">
                {COMPANY.emailComercial}
              </p>
            </a>
            <a
              href={`tel:${COMPANY.phone.replace(/\s/g, "")}`}
              className="border border-pili-mist bg-pili-white p-6 transition-all hover:border-pili-black"
            >
              <span className="font-display text-sm font-bold uppercase text-pili-black">
                Telefone
              </span>
              <p className="mt-2 font-mono text-xs text-pili-concrete">
                {COMPANY.phone}
              </p>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
