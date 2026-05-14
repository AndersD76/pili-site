import { auth } from "./auth";
import { redirect } from "next/navigation";
import { Role } from "@prisma/client";

export async function requireRole(...roles: Role[]) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  const userRole = session.user.role;
  if (!roles.includes(userRole)) redirect("/admin/login");
  return session;
}
