import { generatePageMetadata } from "@/lib/seo";
import { COMPANY, SOCIAL } from "@/lib/constants";
import { LeadForm } from "@/components/marketing/lead-form";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";

export function generateMetadata() {
  return generatePageMetadata({
    title: "Contato",
    description:
      "Entre em contato com a PILI Industrial. Atendimento comercial, suporte técnico e orçamentos para tombadores hidráulicos e equipamentos de descarga.",
    path: "/contato",
  });
}

const CONTACT_CHANNELS = [
  {
    icon: Phone,
    label: "Telefone",
    value: COMPANY.phone,
    href: `tel:${COMPANY.phone.replace(/\s/g, "")}`,
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: COMPANY.whatsapp,
    href: `https://wa.me/${COMPANY.whatsapp.replace(/[^0-9]/g, "")}`,
  },
  {
    icon: Mail,
    label: "E-mail comercial",
    value: COMPANY.emailComercial,
    href: `mailto:${COMPANY.emailComercial}`,
  },
  {
    icon: Mail,
    label: "Atendimento geral",
    value: COMPANY.email,
    href: `mailto:${COMPANY.email}`,
  },
] as const;

export default function ContatoPage() {
  return (
    <main className="pt-[var(--header-height)]">
      {/* Hero */}
      <section className="bg-pili-black py-20 px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h1 className="font-display text-[length:var(--text-display-2)] font-black uppercase text-pili-white">
            Contato
          </h1>
          <p className="mt-4 max-w-2xl text-pili-cement">
            Fale com a equipe PILI Industrial. Atendimento comercial,
            dimensionamento técnico e suporte pós-venda.
          </p>
        </div>
      </section>

      <section className="py-16 px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-16 lg:grid-cols-2">
          {/* Contact info */}
          <div>
            <h2 className="font-display text-[length:var(--text-h2)] font-black uppercase text-pili-black">
              Fale conosco
            </h2>

            {/* Address */}
            <div className="mt-8 flex gap-4">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-pili-safety" />
              <div>
                <span className="font-display text-sm font-bold uppercase text-pili-black">
                  Endereço
                </span>
                <p className="mt-1 text-sm leading-relaxed text-pili-concrete">
                  {COMPANY.name}
                  <br />
                  {COMPANY.address} - Brasil
                  <br />
                  CNPJ: {COMPANY.cnpj}
                </p>
              </div>
            </div>

            {/* Channels */}
            <div className="mt-8 space-y-6">
              {CONTACT_CHANNELS.map((channel) => (
                <a
                  key={channel.label}
                  href={channel.href}
                  className="flex gap-4 transition-colors hover:text-pili-safety-deep"
                >
                  <channel.icon className="mt-0.5 h-5 w-5 shrink-0 text-pili-safety" />
                  <div>
                    <span className="font-display text-sm font-bold uppercase text-pili-black">
                      {channel.label}
                    </span>
                    <p className="mt-1 font-mono text-sm text-pili-concrete">
                      {channel.value}
                    </p>
                  </div>
                </a>
              ))}
            </div>

            {/* Social */}
            <div className="mt-10">
              <span className="font-display text-sm font-bold uppercase text-pili-black">
                Redes sociais
              </span>
              <div className="mt-3 flex gap-4">
                {Object.entries(SOCIAL).map(([name, url]) => (
                  <a
                    key={name}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold uppercase tracking-wider text-pili-concrete transition-colors hover:text-pili-safety-deep"
                  >
                    {name}
                  </a>
                ))}
              </div>
            </div>

            {/* Map placeholder */}
            <div className="mt-10 flex aspect-[16/10] items-center justify-center border border-pili-mist bg-pili-paper">
              <span className="font-mono text-sm text-pili-cement">
                Mapa -- {COMPANY.address}
              </span>
            </div>
          </div>

          {/* Form */}
          <div>
            <h2 className="font-display text-[length:var(--text-h2)] font-black uppercase text-pili-black">
              Envie uma mensagem
            </h2>
            <p className="mt-4 text-sm text-pili-concrete">
              Preencha o formulário abaixo e nossa equipe retornará em até 24
              horas úteis.
            </p>
            <div className="mt-8">
              <LeadForm source="CONTATO" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
