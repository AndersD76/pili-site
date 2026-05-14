"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";
import { ExternalLink, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MobileSidebar } from "./sidebar";

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
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-pili-mist bg-pili-white px-4 lg:px-6">
      <MobileSidebar />

      <div className="flex-1" />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="gap-2 px-2">
            <Avatar size="sm">
              {user.image && (
                <AvatarImage src={user.image} alt={user.name ?? "Avatar"} />
              )}
              <AvatarFallback className="bg-pili-steel text-pili-white text-xs">
                {getInitials(user.name, user.email)}
              </AvatarFallback>
            </Avatar>
            <span className="hidden text-sm font-medium sm:inline-block">
              {user.name ?? user.email}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col gap-1">
              {user.name && (
                <p className="text-sm font-medium">{user.name}</p>
              )}
              {user.email && (
                <p className="text-xs text-pili-cement">{user.email}</p>
              )}
              <p className="text-xs text-pili-cement uppercase">{user.role}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/" target="_blank" className="cursor-pointer">
              <ExternalLink className="mr-2 size-4" />
              Ir para o site
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer text-pili-danger"
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
          >
            <LogOut className="mr-2 size-4" />
            Sair
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
