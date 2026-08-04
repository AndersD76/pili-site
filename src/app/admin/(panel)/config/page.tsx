import { requireRole } from "@/lib/auth-guard";
import { getSiteSettings } from "@/lib/site-settings";
import { SiteSettingsForm } from "@/components/admin/site-settings-form";

export const metadata = { title: "Configurações" };

export default async function ConfigPage() {
  await requireRole("ADMIN");

  const settings = await getSiteSettings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-pili-black">
          Configurações
        </h1>
        <p className="mt-1 text-sm text-pili-concrete">
          Dados usados no rodapé, na página de contato e nos dados estruturados
          do site. As alterações aparecem no site imediatamente após salvar.
        </p>
      </div>

      <SiteSettingsForm
        initial={{
          razaoSocial: settings.razaoSocial,
          cnpj: settings.cnpj,
          endereco: settings.endereco,
          telefone: settings.telefone,
          whatsapp: settings.whatsapp,
          email: settings.email,
          emailComercial: settings.emailComercial,
          fundacao: settings.fundacao,
          instagram: settings.instagram ?? "",
          linkedin: settings.linkedin ?? "",
          facebook: settings.facebook ?? "",
          youtube: settings.youtube ?? "",
          piliTechUrl: settings.piliTechUrl ?? "",
          mapaLat: settings.mapaLat === null ? "" : String(settings.mapaLat),
          mapaLng: settings.mapaLng === null ? "" : String(settings.mapaLng),
          mapaZoom: settings.mapaZoom,
        }}
      />
    </div>
  );
}
