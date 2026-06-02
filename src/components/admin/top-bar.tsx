"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";
import { ExternalLink, LogOut } from "lucide-react";

interface TopBarProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role: string;
  };
}

function getInitials(name?: string | null, email?: string | null): string {
  if (name) {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }
  if (email) return email[0]?.toUpperCase() ?? "U";
  return "U";
}

export function TopBar({ user }: TopBarProps) {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-end gap-4 border-b border-pili-mist bg-pili-white px-4 lg:px-6">
      <div className="relative group">
        <button className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-pili-paper">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-pili-steel text-xs font-bold text-pili-white">
            {getInitials(user.name, user.email)}
          </span>
          <span className="hidden font-medium text-pili-black sm:block">
            {user.name ?? user.email}
          </span>
        </button>

        <div className="invisible absolute right-0 top-full z-50 w-64 rounded-lg border border-pili-mist bg-white py-2 opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100">
          <div className="border-b border-pili-mist px-4 pb-3 pt-2">
            {user.name && (
              <p className="text-sm font-semibold text-pili-black">{user.name}</p>
            )}
            {user.email && (
              <p className="text-xs text-pili-cement">{user.email}</p>
            )}
            <span className="mt-1 inline-block rounded bg-pili-paper px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-pili-concrete">
              {user.role}
            </span>
          </div>

          <div className="py-1">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-3 px-4 py-2 text-sm text-pili-concrete transition-colors hover:bg-pili-paper hover:text-pili-black"
            >
              <ExternalLink className="h-4 w-4" />
              Ir para o site
            </Link>
          </div>

          <div className="border-t border-pili-mist py-1">
            <button
              onClick={() => signOut({ callbackUrl: "/portal/login" })}
              className="flex w-full items-center gap-3 px-4 py-2 text-sm text-pili-safety transition-colors hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
