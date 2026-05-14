"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import { Menu, X, ChevronDown, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { ECOSYSTEM } from "@/lib/constants";
import { LanguageSwitcher } from "./language-switcher";

const NAV_ITEMS = [
  { key: "products", href: "/produtos" },
  { key: "solutions", href: "/solucoes" },
  { key: "projects", href: "/obras" },
  { key: "company", href: "/empresa" },
  { key: "blog", href: "/blog" },
  { key: "contact", href: "/contato" },
] as const;

const ECOSYSTEM_ITEMS = [
  { label: "PILI Store", href: ECOSYSTEM.store, desc: "Peças e acessórios" },
  { label: "PILI Tech", href: ECOSYSTEM.tech, desc: "Gestão de pátio IoT" },
  { label: "PILI Raste", href: ECOSYSTEM.raste, desc: "Rastreabilidade + EUDR" },
  { label: "PILI Harbor", href: ECOSYSTEM.harbor, desc: "Yard management IoT" },
] as const;

export function Header() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [ecoOpen, setEcoOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const prevPathRef = useRef(pathname);
  useEffect(() => {
    if (prevPathRef.current !== pathname) {
      prevPathRef.current = pathname;
      setMobileOpen(false);
    }
  }, [pathname]);

  const isHome = pathname === "/";

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled || mobileOpen || !isHome
          ? "bg-pili-black/95 backdrop-blur-sm border-b border-pili-iron/50"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto flex h-[var(--header-height)] max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="font-display text-xl font-black uppercase tracking-tight text-pili-white">
            PILI
          </span>
          <span className="hidden font-sans text-xs font-medium uppercase tracking-widest text-pili-cement sm:block">
            Industrial
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={cn(
                "px-3 py-2 text-sm font-medium uppercase tracking-wider transition-colors",
                pathname.startsWith(item.href)
                  ? "text-pili-safety"
                  : "text-pili-mist hover:text-pili-white"
              )}
            >
              {t(item.key)}
            </Link>
          ))}

          {/* Ecosystem dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setEcoOpen(true)}
            onMouseLeave={() => setEcoOpen(false)}
          >
            <button
              className="flex items-center gap-1 px-3 py-2 text-sm font-medium uppercase tracking-wider text-pili-mist transition-colors hover:text-pili-white"
              aria-expanded={ecoOpen}
              aria-haspopup="true"
            >
              {t("ecosystem")}
              <ChevronDown
                className={cn(
                  "h-3.5 w-3.5 transition-transform",
                  ecoOpen && "rotate-180"
                )}
              />
            </button>

            {ecoOpen && (
              <div className="absolute right-0 top-full w-64 border border-pili-iron bg-pili-graphite p-2">
                {ECOSYSTEM_ITEMS.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 transition-colors hover:bg-pili-steel"
                  >
                    <div>
                      <div className="text-sm font-semibold text-pili-white">
                        {item.label}
                      </div>
                      <div className="text-xs text-pili-cement">
                        {item.desc}
                      </div>
                    </div>
                    <ExternalLink className="h-3.5 w-3.5 text-pili-cement" />
                  </a>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <LanguageSwitcher />

          <Link
            href="/orcamento"
            className="hidden items-center justify-center bg-pili-safety px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-pili-black transition-colors hover:bg-pili-safety-deep lg:inline-flex"
          >
            {t("quote")}
          </Link>

          {/* Mobile toggle */}
          <button
            className="p-2 text-pili-white lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav className="border-t border-pili-iron bg-pili-black px-6 py-6 lg:hidden">
          <div className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className={cn(
                  "py-3 text-sm font-medium uppercase tracking-wider",
                  pathname.startsWith(item.href)
                    ? "text-pili-safety"
                    : "text-pili-mist"
                )}
              >
                {t(item.key)}
              </Link>
            ))}

            <div className="border-t border-pili-iron pt-3 mt-2">
              <span className="text-xs font-medium uppercase tracking-widest text-pili-cement">
                Ecossistema
              </span>
              {ECOSYSTEM_ITEMS.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between py-3 text-sm text-pili-mist"
                >
                  {item.label}
                  <ExternalLink className="h-3.5 w-3.5 text-pili-cement" />
                </a>
              ))}
            </div>

            <Link
              href="/orcamento"
              className="mt-4 flex items-center justify-center bg-pili-safety py-3 text-sm font-semibold uppercase tracking-wider text-pili-black"
            >
              {t("quote")}
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
