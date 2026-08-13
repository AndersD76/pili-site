import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { getSiteSettings, redesSociais } from "@/lib/site-settings";
import { getFiliais, pontosDoMapa } from "@/lib/filiais";
import { ICONE_POR_REDE } from "@/components/shared/brand-icons";
import { MapaUnidades } from "@/components/shared/mapa-unidades";
import Image from "next/image";

/**
 * Âncoras em vez de `?cat=`: a página de produtos nunca leu essa query string,
 * então os quatro links serviam a mesma listagem completa — quatro URLs com
 * conteúdo idêntico e nenhum filtro aplicado.
 */
const PRODUCT_LINKS = [
  { key: "tombadorFixo", href: "/produtos#tombador-fixo" },
  { key: "tombadorMovel", href: "/produtos#tombador-movel" },
  { key: "coletor", href: "/produtos#coletor-amostras" },
  { key: "transbordo", href: "/produtos#unidade-transbordo" },
  { key: "comparar", href: "/produtos/comparar" },
  { key: "catalogo", href: "/catalogo" },
] as const;

/** Páginas institucionais que antes só existiam no sitemap. */
const COMPANY_LINKS = [
  { key: "empresa", href: "/empresa" },
  { key: "certificacoes", href: "/certificacoes" },
  { key: "obras", href: "/obras" },
  { key: "trabalhe", href: "/trabalhe-conosco" },
  { key: "ambiental", href: "/politica-ambiental" },
] as const;

export async function Footer() {
  const t = await getTranslations("footer");
  const [settings, filiais] = await Promise.all([
    getSiteSettings(),
    getFiliais(),
  ]);

  const pontos = pontosDoMapa(
    {
      endereco: settings.endereco,
      lat: settings.mapaLat,
      lng: settings.mapaLng,
    },
    filiais,
    t("headquarters"),
  );

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
            {/* O endereço saiu daqui: ele agora vive no bloco de unidades,
                junto das filiais. Repetir na mesma tela só cria divergência. */}
            <p className="mt-4 font-mono text-xs leading-relaxed text-pili-concrete">
              {settings.razaoSocial}
              <br />
              CNPJ {settings.cnpj}
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
                    {t(`links.${link.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Empresa */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-pili-cement">
              {t("company")}
            </h3>
            <ul className="mt-4 flex flex-col gap-2.5">
              {COMPANY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-pili-mist transition-colors hover:text-pili-white"
                  >
                    {t(`links.${link.key}`)}
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
                  {t("fullEcosystem")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5 — Contact */}
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

        {/* Unidades + mapa */}
        <div className="mt-14 border-t border-pili-iron/50 pt-10">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-pili-cement">
            {t("units")}
          </h3>

          <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_1.1fr]">
            <ul className="grid gap-6 sm:grid-cols-2">
              <li>
                <span className="text-sm font-semibold text-pili-white">
                  {t("headquarters")}
                </span>
                <p className="mt-1 font-mono text-xs leading-relaxed text-pili-concrete">
                  {settings.endereco}
                </p>
                <a
                  href={`tel:${settings.telefone.replace(/\s/g, "")}`}
                  className="mt-1 inline-block font-mono text-xs text-pili-mist transition-colors hover:text-pili-white"
                >
                  {settings.telefone}
                </a>
              </li>

              {filiais.map((filial) => (
                <li key={filial.id}>
                  <span className="text-sm font-semibold text-pili-white">
                    {filial.nome}
                  </span>
                  <span className="ml-2 text-[11px] uppercase tracking-wider text-pili-cement">
                    {t(`unitTypes.${filial.tipo}`)}
                  </span>
                  <p className="mt-1 font-mono text-xs leading-relaxed text-pili-concrete">
                    {filial.endereco}
                    <br />
                    {filial.cidade}/{filial.uf}
                    {filial.cep ? ` — ${filial.cep}` : ""}
                  </p>
                  {filial.telefone && (
                    <a
                      href={`tel:${filial.telefone.replace(/\s/g, "")}`}
                      className="mt-1 inline-block font-mono text-xs text-pili-mist transition-colors hover:text-pili-white"
                    >
                      {filial.telefone}
                    </a>
                  )}
                </li>
              ))}
            </ul>

            <MapaUnidades pontos={pontos} titulo={t("mapLabel")} />
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
