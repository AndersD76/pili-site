import { auth } from "./auth";
import { redirect } from "next/navigation";

type RoleString = "ADMIN" | "COMERCIAL" | "TECNICO" | "CLIENTE";

export async function requireRole(...roles: RoleString[]) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  const userRole: string = session.user.role;
  if (!roles.includes(userRole as RoleString)) redirect("/admin/login");
  return session;
}

export async function requirePortalAuth() {
  const session = await auth();
  if (!session?.user) redirect("/portal/login");
  const userRole: string = session.user.role;
  const allowed: RoleString[] = ["CLIENTE", "ADMIN", "COMERCIAL", "TECNICO"];
  if (!allowed.includes(userRole as RoleString)) redirect("/portal/login");
  return session;
}
