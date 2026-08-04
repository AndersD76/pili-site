import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { getSiteSettings, redesSociais } from "@/lib/site-settings";
import { Globe, Link2, Video, Camera } from "lucide-react";
import Image from "next/image";

/**
 * Âncoras em vez de `?cat=`: a página de produtos nunca leu essa query string,
 * então os quatro links serviam a mesma listagem completa — quatro URLs com
 * conteúdo idêntico e nenhum filtro aplicado.
 */
const PRODUCT_LINKS = [
  { label: "Tombador fixo", href: "/produtos#tombador-fixo" },
  { label: "Tombador móvel", href: "/produtos#tombador-movel" },
  { label: "Coletor de amostras", href: "/produtos#coletor-amostras" },
  { label: "Unidade de transbordo", href: "/produtos#unidade-transbordo" },
  { label: "Comparar modelos", href: "/produtos/comparar" },
  { label: "Catálogo", href: "/catalogo" },
] as const;

/** Páginas institucionais que antes só existiam no sitemap. */
const COMPANY_LINKS = [
  { label: "A empresa", href: "/empresa" },
  { label: "Certificações", href: "/certificacoes" },
  { label: "Obras realizadas", href: "/obras" },
  { label: "Trabalhe conosco", href: "/trabalhe-conosco" },
  { label: "Política ambiental", href: "/politica-ambiental" },
] as const;

/** Ícone por rede. As URLs vêm das configurações, não daqui. */
const ICONE_POR_REDE: Record<string, typeof Camera> = {
  Instagram: Camera,
  LinkedIn: Link2,
  Facebook: Globe,
  YouTube: Video,
};

export async function Footer() {
  const t = await getTranslations("footer");
  const settings = await getSiteSettings();

  return (
    <footer className="bg-pili-black">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-5">
          {/* Col 1 — Brand */}
          <div>
            <Image
              src="/images/logo-pili-white.png"
              alt="PILI Industrial"
              width={200}
              height={66}
              className="h-14 w-auto"
            />
            <p className="mt-4 font-mono text-xs leading-relaxed text-pili-concrete">
              {settings.razaoSocial}
              <br />
              CNPJ {settings.cnpj}
              <br />
              {settings.endereco}
            </p>
          </div>

          {/* Col 2 — Products */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-pili-cement">
              {t("products")}
            </h3>
            <ul className="mt-4 flex flex-col gap-2.5">
              {PRODUCT_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-pili-mist transition-colors hover:text-pili-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Empresa */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-pili-cement">
              Empresa
            </h3>
            <ul className="mt-4 flex flex-col gap-2.5">
              {COMPANY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-pili-mist transition-colors hover:text-pili-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Ecosystem */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-pili-cement">
              {t("ecosystem")}
            </h3>
            <ul className="mt-4 flex flex-col gap-2.5">
              {[{ label: "PILI Tech", href: settings.piliTechUrl }]
                .filter((i): i is { label: string; href: string } => Boolean(i.href))
                .map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-pili-mist transition-colors hover:text-pili-white"
                  >
                    {item.label} {"↗"}
                  </a>
                </li>
              ))}
              <li>
                <Link
                  href="/ecossistema"
                  className="text-sm text-pili-safety transition-colors hover:text-pili-safety-bright"
                >
                  Ver ecossistema completo
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4 — Contact */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-pili-cement">
              {t("contact")}
            </h3>
            <ul className="mt-4 flex flex-col gap-2.5">
              <li>
                <a
                  href={`mailto:${settings.email}`}
                  className="text-sm text-pili-mist transition-colors hover:text-pili-white"
                >
                  {settings.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${settings.telefone.replace(/\s/g, "")}`}
                  className="font-mono text-sm text-pili-mist transition-colors hover:text-pili-white"
                >
                  {settings.telefone}
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${settings.whatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-sm text-pili-mist transition-colors hover:text-pili-white"
                >
                  {settings.whatsapp}
                </a>
              </li>
            </ul>

            <div className="mt-6 flex gap-3">
              {redesSociais(settings).map((rede) => {
                const Icone = ICONE_POR_REDE[rede.name];
                if (!Icone) return null;
                return (
                  <a
                    key={rede.name}
                    href={rede.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-pili-concrete transition-colors hover:text-pili-white"
                    aria-label={rede.name}
                  >
                    <Icone className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-pili-iron/50">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 sm:flex-row lg:px-8">
          <p className="font-mono text-xs text-pili-concrete">
            &copy; {new Date().getFullYear()} PILI Industrial &middot; {t("rights")}
          </p>
          <div className="flex gap-6">
            <Link
              href="/politica-privacidade"
              className="font-mono text-xs text-pili-concrete transition-colors hover:text-pili-mist"
            >
              {t("privacy")}
            </Link>
            <Link
              href="/termos"
              className="font-mono text-xs text-pili-concrete transition-colors hover:text-pili-mist"
            >
              {t("terms")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
