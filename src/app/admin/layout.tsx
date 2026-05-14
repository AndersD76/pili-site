import type { Metadata } from "next";
import { requireRole } from "@/lib/auth-guard";
import { Sidebar } from "@/components/admin/sidebar";
import { TopBar } from "@/components/admin/top-bar";

export const metadata: Metadata = {
  title: {
    default: "Admin",
    template: "%s | PILI Admin",
  },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireRole("ADMIN", "COMERCIAL", "TECNICO");
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
    </div>
  );
}
