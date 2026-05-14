"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Package,
  Building2,
  FileText,
  Image,
  UserCog,
  Settings,
  Menu,
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
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Leads", href: "/admin/leads", icon: Users },
  { label: "Produtos", href: "/admin/produtos", icon: Package },
  { label: "Obras", href: "/admin/obras", icon: Building2 },
  { label: "Blog", href: "/admin/blog", icon: FileText },
  { label: "Media", href: "/admin/media", icon: Image },
  { label: "Usuarios", href: "/admin/usuarios", icon: UserCog },
  { label: "Configuracoes", href: "/admin/config", icon: Settings },
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
          ? "bg-pili-steel text-pili-white"
          : "text-pili-cement hover:text-pili-white hover:bg-pili-steel/50"
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
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  }

  return (
    <nav className="flex flex-col gap-1 px-3">
      {navItems.map((item) => (
        <NavLink
          key={item.href}
          item={item}
          isActive={isActive(item.href)}
        />
      ))}
    </nav>
  );
}

export function Sidebar() {
  return (
    <aside className="hidden lg:flex lg:w-60 lg:flex-col lg:fixed lg:inset-y-0 bg-pili-graphite">
      <div className="flex h-16 items-center gap-2 px-6">
        <span className="font-display text-xl font-bold tracking-tight text-pili-safety">
          PILI
        </span>
        <span className="text-sm font-medium text-pili-cement">Admin</span>
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <SidebarNav />
      </div>
    </aside>
  );
}

export function MobileSidebar() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
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
      <SheetContent side="left" className="w-60 bg-pili-graphite p-0 border-none">
        <SheetHeader className="px-6 pt-4 pb-2">
          <SheetTitle className="flex items-center gap-2">
            <span className="font-display text-xl font-bold tracking-tight text-pili-safety">
              PILI
            </span>
            <span className="text-sm font-medium text-pili-cement">Admin</span>
          </SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-1 px-3 py-4">
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
