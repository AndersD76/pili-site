import { requirePortalAuth } from "@/lib/auth-guard";
import { PortalSidebar } from "@/components/portal/sidebar";
import { PortalTopBar } from "@/components/portal/top-bar";

export default async function PortalDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requirePortalAuth();
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
            role: user.role,
          }}
        />
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
