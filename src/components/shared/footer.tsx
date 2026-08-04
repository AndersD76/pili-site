import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { COMPANY, ECOSYSTEM, SOCIAL } from "@/lib/constants";
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

const SOCIAL_ICONS = [
  { href: SOCIAL.instagram, icon: Camera, label: "Instagram" },
  { href: SOCIAL.linkedin, icon: Link2, label: "LinkedIn" },
  { href: SOCIAL.facebook, icon: Globe, label: "Facebook" },
  { href: SOCIAL.youtube, icon: Video, label: "YouTube" },
] as const;

export function Footer() {
  const t = useTranslations("footer");

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
              {COMPANY.name}
              <br />
              CNPJ {COMPANY.cnpj}
              <br />
              {COMPANY.address}
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
              {[{ label: "PILI Tech", href: ECOSYSTEM.tech }].map((item) => (
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
                  href={`mailto:${COMPANY.email}`}
                  className="text-sm text-pili-mist transition-colors hover:text-pili-white"
                >
                  {COMPANY.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${COMPANY.phone.replace(/\s/g, "")}`}
                  className="font-mono text-sm text-pili-mist transition-colors hover:text-pili-white"
                >
                  {COMPANY.phone}
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${COMPANY.whatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-sm text-pili-mist transition-colors hover:text-pili-white"
                >
                  {COMPANY.whatsapp}
                </a>
              </li>
            </ul>

            <div className="mt-6 flex gap-3">
              {SOCIAL_ICONS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pili-concrete transition-colors hover:text-pili-white"
                  aria-label={s.label}
                >
                  <s.icon className="h-5 w-5" />
                </a>
              ))}
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
