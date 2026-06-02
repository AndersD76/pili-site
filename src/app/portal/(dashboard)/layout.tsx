import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { PortalSidebar } from "@/components/portal/sidebar";
import { PortalTopBar } from "@/components/portal/top-bar";

export default async function PortalDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/portal/login");

  const role = session.user.role as string;

  if (role === "ADMIN" || role === "COMERCIAL" || role === "TECNICO") {
    redirect("/admin");
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
    </div>
  );
}
