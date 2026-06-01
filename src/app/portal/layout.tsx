import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Role } from "@prisma/client";
import { PortalSidebar } from "@/components/portal/sidebar";
import { PortalTopBar } from "@/components/portal/top-bar";

const ALLOWED_ROLES: Role[] = ["CLIENTE", "ADMIN", "COMERCIAL", "TECNICO"];

export const metadata: Metadata = {
  title: {
    default: "Portal do Cliente",
    template: "%s | Portal do Cliente | PILI",
  },
  robots: { index: false, follow: false },
};

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) redirect("/portal/login");

  const userRole = (session.user as { role: Role }).role;
  if (!ALLOWED_ROLES.includes(userRole)) redirect("/portal/login");

  const user = session.user;

  return (
    <div className="min-h-screen bg-pili-paper">
      <PortalSidebar />
      <div className="lg:pl-64">
        <PortalTopBar
          user={{
            name: user.name,
            email: user.email,
            image: user.image,
            role: userRole,
          }}
        />
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
