import { generatePageMetadata } from "@/lib/seo";
import { MapaLocalizacao } from "@/components/marketing/mapa-localizacao";
import {
  getSiteSettings,
  redesSociais,
  type SiteSettingsData,
} from "@/lib/site-settings";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { LeadForm } from "@/components/marketing/lead-form";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contato" });
  return generatePageMetadata({
    locale,
    title: t("metaTitle"),
    description: t("metaDesc"),
    path: "/contato",
  });
}

/** Canais de contato montados a partir das configurações do painel. */
function contactChannels(
  s: SiteSettingsData,
  rotulo: (chave: string) => string,
) {
  return [
    {
      icon: Phone,
      label: rotulo("phone"),
      value: s.telefone,
      href: `tel:${s.telefone.replace(/\s/g, "")}`,
    },
    {
      icon: MessageCircle,
      label: rotulo("whatsapp"),
      value: s.whatsapp,
      href: `https://wa.me/${s.whatsapp.replace(/[^0-9]/g, "")}`,
    },
    {
      icon: Mail,
      label: rotulo("commercialEmail"),
      value: s.emailComercial,
      href: `mailto:${s.emailComercial}`,
    },
    {
      icon: Mail,
      label: rotulo("generalEmail"),
      value: s.email,
      href: `mailto:${s.email}`,
    },
  ];
}

export default async function ContatoPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations();
  const settings = await getSiteSettings();

  return (
    <main className="pt-[var(--header-height)]">
      {/* Hero */}
      <section className="bg-pili-black py-20 px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h1 className="font-display text-[length:var(--text-display-2)] font-black uppercase text-pili-white">
            {t("nav.contact")}
          </h1>
          <p className="mt-4 max-w-2xl text-pili-cement">
            {t("contato.intro")}
          </p>
        </div>
      </section>

      <section className="py-16 px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-16 lg:grid-cols-2">
          {/* Contact info */}
          <div>
            <h2 className="font-display text-[length:var(--text-h2)] font-black uppercase text-pili-black">
              {t("contato.talkToUs")}
            </h2>

            {/* Address */}
            <div className="mt-8 flex gap-4">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-pili-safety" />
              <div>
                <span className="font-display text-sm font-bold uppercase text-pili-black">
                  {t("contato.address")}
                </span>
                <p className="mt-1 text-sm leading-relaxed text-pili-concrete">
                  {settings.razaoSocial}
                  <br />
                  {settings.endereco} - Brasil
                  <br />
                  CNPJ: {settings.cnpj}
                </p>
              </div>
            </div>

            {/* Channels */}
            <div className="mt-8 space-y-6">
              {contactChannels(settings, (chave) => t(`contato.${chave}`)).map((channel) => (
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
                {t("contato.socialNetworks")}
              </span>
              <div className="mt-3 flex gap-4">
                {redesSociais(settings).map(({ name, url }) => (
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

            <MapaLocalizacao
              className="mt-10"
              lat={settings.mapaLat}
              lng={settings.mapaLng}
              zoom={settings.mapaZoom}
              endereco={settings.endereco}
            />
          </div>

          {/* Form */}
          <div>
            <h2 className="font-display text-[length:var(--text-h2)] font-black uppercase text-pili-black">
              {t("contato.sendMessage")}
            </h2>
            <p className="mt-4 text-sm text-pili-concrete">
              {t("contato.formIntro")}
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
