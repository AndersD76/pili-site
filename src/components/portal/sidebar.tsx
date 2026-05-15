"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  HardDrive,
  Wrench,
  FileText,
  Headphones,
  Menu,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const navItems = [
  { label: "Painel", href: "/portal", icon: LayoutDashboard },
  { label: "Equipamentos", href: "/portal/equipamentos", icon: HardDrive },
  { label: "Ordens de Serviço", href: "/portal/servicos", icon: Wrench },
  { label: "Documentos", href: "/portal/documentos", icon: FileText },
  { label: "Suporte", href: "/portal/suporte", icon: Headphones },
] as const;

function NavLink({
  item,
  isActive,
}: {
  item: (typeof navItems)[number];
  isActive: boolean;
}) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
        isActive
          ? "bg-pili-safety/10 text-pili-safety"
          : "text-pili-concrete hover:text-pili-black hover:bg-pili-mist/50"
      )}
    >
      <Icon className="size-5 shrink-0" />
      {item.label}
    </Link>
  );
}

function SidebarNav() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/portal") return pathname === "/portal";
    return pathname.startsWith(href);
  }

  return (
    <nav className="flex flex-col gap-1 px-3">
      {navItems.map((item) => (
        <NavLink key={item.href} item={item} isActive={isActive(item.href)} />
      ))}
      <div className="my-4 border-t border-pili-mist" />
      <Link
        href="/"
        className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-pili-cement transition-colors hover:text-pili-black"
      >
        <ExternalLink className="size-4 shrink-0" />
        Ir para o site
      </Link>
    </nav>
  );
}

export function PortalSidebar() {
  return (
    <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 border-r border-pili-mist bg-pili-white">
      <div className="flex h-20 items-center gap-3 px-6 border-b border-pili-mist">
        <Image
          src="/images/logo-pili.png"
          alt="PILI"
          width={120}
          height={40}
          className="h-10 w-auto"
        />
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <p className="mb-2 px-6 font-mono text-[10px] font-semibold uppercase tracking-widest text-pili-cement">
          Portal do Cliente
        </p>
        <SidebarNav />
      </div>
    </aside>
  );
}

export function PortalMobileSidebar() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/portal") return pathname === "/portal";
    return pathname.startsWith(href);
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="size-5" />
          <span className="sr-only">Abrir menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 bg-pili-white p-0 border-none">
        <SheetHeader className="px-6 pt-4 pb-2 border-b border-pili-mist">
          <SheetTitle className="flex items-center gap-2">
            <Image
              src="/images/logo-pili.png"
              alt="PILI"
              width={100}
              height={33}
              className="h-8 w-auto"
            />
          </SheetTitle>
        </SheetHeader>
        <p className="mt-4 mb-2 px-6 font-mono text-[10px] font-semibold uppercase tracking-widest text-pili-cement">
          Portal do Cliente
        </p>
        <nav className="flex flex-col gap-1 px-3 py-2">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              isActive={isActive(item.href)}
            />
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
