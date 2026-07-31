import { auth } from "./auth";
import { redirect } from "next/navigation";
import type { Session } from "next-auth";
import type { Role } from "@prisma/client";

/** Roles com acesso ao painel administrativo. */
export const STAFF_ROLES: Role[] = ["ADMIN", "COMERCIAL", "TECNICO"];

/** Todas as roles com acesso ao portal do cliente. */
export const PORTAL_ROLES: Role[] = [
  "CLIENTE",
  "ADMIN",
  "COMERCIAL",
  "TECNICO",
];

/**
 * Erro lançado por `requireRoleOrThrow`. Diferente de `redirect()`, pode ser
 * capturado pelo chamador — é o que queremos dentro de Server Actions, onde um
 * redirect para o login não é uma resposta útil.
 */
export class AuthorizationError extends Error {
  constructor(message = "Você não tem permissão para executar esta ação.") {
    super(message);
    this.name = "AuthorizationError";
  }
}

/**
 * Valida a sessão pelos campos que a autorização usa, não pela mera existência
 * do objeto.
 *
 * O Auth.js já teve falha em que um erro de configuração popula o objeto de
 * sessão com um erro em vez de `null` (GHSA-8fpg-xm3f-6cx3); nesse cenário um
 * teste como `if (!session?.user)` passa e o guard libera o acesso. Exigir
 * `id` e `role` válidos fecha essa porta.
 */
function isAuthenticated(session: Session | null): session is Session {
  const user = session?.user;
  return (
    !!user &&
    typeof user.id === "string" &&
    user.id.length > 0 &&
    typeof user.role === "string" &&
    (PORTAL_ROLES as string[]).includes(user.role)
  );
}

/* ---------- guards para páginas / layouts ---------- */

/**
 * Guard para Server Components. Redireciona para o login quando não há sessão,
 * e para a raiz do portal quando a sessão existe mas a role não é suficiente —
 * mandar um usuário já autenticado de volta ao login não resolveria nada.
 */
export async function requireRole(...roles: Role[]) {
  const session = await auth();
  if (!isAuthenticated(session)) redirect("/portal/login");
  if (!roles.includes(session.user.role)) redirect("/portal");
  return session;
}

export async function requirePortalAuth() {
  return requireRole(...PORTAL_ROLES);
}

/* ---------- guard para Server Actions ---------- */

/**
 * Guard para Server Actions. Server Actions são endpoints POST públicos: o
 * guard do layout protege apenas a renderização da página, não a action. Toda
 * action que lê ou escreve dados precisa chamar isto explicitamente.
 */
export async function requireRoleOrThrow(...roles: Role[]) {
  const session = await auth();

  if (!isAuthenticated(session)) {
    throw new AuthorizationError("Você precisa estar autenticado.");
  }

  if (!roles.includes(session.user.role)) {
    throw new AuthorizationError();
  }

  return session;
}

/**
 * Atalho para actions restritas a administradores.
 *
 * Actions com outros conjuntos de papéis chamam `requireRoleOrThrow`
 * diretamente, com a mesma lista da página correspondente — o guard da action
 * nunca pode ser mais permissivo que o da página que a expõe.
 */
export async function requireAdmin() {
  return requireRoleOrThrow("ADMIN");
}
