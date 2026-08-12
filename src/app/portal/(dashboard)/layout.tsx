import { requirePortalAuth, STAFF_ROLES } from "@/lib/auth-guard";
import { redirect } from "next/navigation";
import { PortalSidebar } from "@/components/portal/sidebar";
import { PortalTopBar } from "@/components/portal/top-bar";
import { Toaster } from "sonner";

export default async function PortalDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requirePortalAuth();

  // Equipe interna não usa o portal do cliente.
  if ((STAFF_ROLES as string[]).includes(session.user.role)) {
    redirect("/admin");
  }

  // Senha provisória da importação: nada do portal abre antes da troca. A
  // página de troca fica fora deste grupo justamente para não cair aqui.
  if (session.user.mustChangePassword) {
    redirect("/portal/trocar-senha");
  }

  return (
    <div className="min-h-screen bg-pili-paper">
      <PortalSidebar />
      <div className="lg:pl-64">
        <PortalTopBar
          user={{
            name: session.user.name,
            email: session.user.email,
            image: session.user.image,
            role: session.user.role,
          }}
        />
        <main className="p-4 lg:p-6">{children}</main>
      </div>
      <Toaster position="top-right" richColors closeButton />
    </div>
  );
}
