import { requireRole } from "@/lib/auth-guard";
import { COMPANY, ECOSYSTEM, SOCIAL } from "@/lib/constants";
import { Settings, Globe, Share2, Building2, Palette } from "lucide-react";

export default async function ConfigPage() {
  await requireRole("ADMIN");

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-pili-black">
          Configurações
        </h1>
        <p className="mt-1 text-sm text-pili-cement">
          Configurações gerais do site e da empresa
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-pili-mist bg-white p-6">
          <div className="mb-4 flex items-center gap-3">
            <Building2 className="h-5 w-5 text-pili-safety" />
            <h2 className="font-display text-lg font-bold text-pili-black">
              Dados da empresa
            </h2>
          </div>
          <div className="space-y-3">
            <Row label="Razão social" value={COMPANY.name} />
            <Row label="CNPJ" value={COMPANY.cnpj} />
            <Row label="Endereço" value={COMPANY.address} />
            <Row label="Telefone" value={COMPANY.phone} />
            <Row label="WhatsApp" value={COMPANY.whatsapp} />
            <Row label="Email" value={COMPANY.email} />
            <Row label="Email comercial" value={COMPANY.emailComercial} />
            <Row label="Fundação" value={String(COMPANY.founded)} />
          </div>
        </div>

        <div className="rounded-lg border border-pili-mist bg-white p-6">
          <div className="mb-4 flex items-center gap-3">
            <Globe className="h-5 w-5 text-pili-safety" />
            <h2 className="font-display text-lg font-bold text-pili-black">
              Ecossistema
            </h2>
          </div>
          <div className="space-y-3">
            <Row label="PILI Store" value={ECOSYSTEM.store} link />
            <Row label="PILI Tech" value={ECOSYSTEM.tech} link />
            <Row label="PILI Raster" value={ECOSYSTEM.raste} link />
            <Row label="PILI Harbor" value={ECOSYSTEM.harbor} link />
          </div>
        </div>

        <div className="rounded-lg border border-pili-mist bg-white p-6">
          <div className="mb-4 flex items-center gap-3">
            <Share2 className="h-5 w-5 text-pili-safety" />
            <h2 className="font-display text-lg font-bold text-pili-black">
              Redes sociais
            </h2>
          </div>
          <div className="space-y-3">
            <Row label="Instagram" value={SOCIAL.instagram} link />
            <Row label="LinkedIn" value={SOCIAL.linkedin} link />
            <Row label="Facebook" value={SOCIAL.facebook} link />
            <Row label="YouTube" value={SOCIAL.youtube} link />
          </div>
        </div>

        <div className="rounded-lg border border-pili-mist bg-white p-6">
          <div className="mb-4 flex items-center gap-3">
            <Settings className="h-5 w-5 text-pili-safety" />
            <h2 className="font-display text-lg font-bold text-pili-black">
              SEO e analytics
            </h2>
          </div>
          <div className="space-y-3">
            <Row
              label="URL do site"
              value={process.env.NEXT_PUBLIC_SITE_URL ?? "Não configurado"}
            />
            <Row
              label="Google Analytics"
              value={process.env.NEXT_PUBLIC_GA_ID || "Não configurado"}
            />
            <Row
              label="Meta Pixel"
              value={process.env.NEXT_PUBLIC_META_PIXEL_ID || "Não configurado"}
            />
          </div>
        </div>

        <div className="rounded-lg border border-pili-mist bg-white p-6">
          <div className="mb-4 flex items-center gap-3">
            <Palette className="h-5 w-5 text-pili-safety" />
            <h2 className="font-display text-lg font-bold text-pili-black">
              Tema e aparência
            </h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-sm text-pili-cement">Cor primária</span>
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded bg-pili-safety" />
                <span className="font-mono text-xs text-pili-concrete">#E31E24</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-pili-cement">Fonte display</span>
              <span className="font-display text-sm font-bold">Montserrat</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-pili-cement">Fonte mono</span>
              <span className="font-mono text-sm">JetBrains Mono</span>
            </div>
          </div>
        </div>
      </div>

      <p className="mt-8 text-center text-xs text-pili-cement">
        Para editar estas configurações, altere os valores em constants.ts ou nas variáveis de ambiente.
      </p>
    </div>
  );
}

function Row({ label, value, link }: { label: string; value: string; link?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-pili-mist/50 pb-2 last:border-0 last:pb-0">
      <span className="shrink-0 text-sm text-pili-cement">{label}</span>
      {link ? (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="truncate text-right font-mono text-xs text-pili-safety hover:underline"
        >
          {value}
        </a>
      ) : (
        <span className="truncate text-right font-mono text-xs text-pili-black">
          {value}
        </span>
      )}
    </div>
  );
}
