import { requireRole, STAFF_ROLES } from "@/lib/auth-guard";
import { Sidebar } from "@/components/admin/sidebar";
import { TopBar } from "@/components/admin/top-bar";
import { Toaster } from "sonner";

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireRole(...STAFF_ROLES);
  const user = session.user;

  return (
    <div className="min-h-screen bg-pili-paper">
      <Sidebar />
      <div className="lg:pl-60">
        <TopBar
          user={{
            name: user.name,
            email: user.email,
            image: user.image,
            role: user.role,
          }}
        />
        <main className="p-4 lg:p-6">{children}</main>
      </div>
      <Toaster position="top-right" richColors closeButton />
    </div>
  );
}
