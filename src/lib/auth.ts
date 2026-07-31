import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";
import Credentials from "next-auth/providers/credentials";
import { headers } from "next/headers";
import { db } from "./db";
import { COMPANY } from "./constants";
import { getClientIp } from "./rate-limit";
import { checkLoginAttempt, resetLoginAttempts } from "./login-rate-limit";
import { logError } from "./prisma-errors";
import type { Role } from "@prisma/client";

/**
 * Hash descartável comparado quando o e-mail não existe ou não tem senha, para
 * que o tempo de resposta não revele quais contas existem.
 */
const DUMMY_PASSWORD_HASH =
  "$2b$12$eAV3Z.tB75JpyEGXGx8KDuw4o0qE0z2nVZlzaHxcPn61bpwKOqCaO";

/** Sessão curta: o painel dá acesso a dados pessoais de leads. */
const SESSION_MAX_AGE = 60 * 60 * 8; // 8 horas

/** Intervalo de revalidação do papel do usuário contra o banco. */
const ROLE_REVALIDATE_SECONDS = 60 * 5; // 5 minutos

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt", maxAge: SESSION_MAX_AGE },
  providers: [
    Google,
    Resend({
      from: process.env.RESEND_FROM_EMAIL ?? COMPANY.emailRemetente,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (
          typeof credentials?.email !== "string" ||
          typeof credentials?.password !== "string"
        ) {
          return null;
        }

        // Emails são gravados normalizados; sem isto o login falha para quem
        // digita com maiúsculas.
        const email = credentials.email.toLowerCase().trim();

        // Freio de força bruta antes de qualquer consulta ao banco.
        let ip: string | null = null;
        try {
          ip = getClientIp({ headers: await headers() } as unknown as Request);
        } catch {
          ip = null;
        }

        const allowed = await checkLoginAttempt(email, ip);
        if (!allowed) {
          logError(
            "LOGIN_THROTTLED",
            new Error(`Tentativas excedidas para ${email}`),
          );
          return null;
        }

        const user = await db.user.findUnique({ where: { email } });

        const { compare } = await import("bcryptjs");
        const valid = await compare(
          credentials.password,
          user?.passwordHash ?? DUMMY_PASSWORD_HASH,
        );

        if (!user?.passwordHash || !valid) return null;

        await resetLoginAttempts(email);

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],
  pages: {
    signIn: "/portal/login",
    error: "/portal/login",
  },
  callbacks: {
    async jwt({ token, user, trigger }) {
      const now = Math.floor(Date.now() / 1000);

      if (user) {
        token.id = user.id as string;
        // Menor privilégio: sem role explícita, trata como cliente.
        token.role = user.role ?? "CLIENTE";
        token.roleCheckedAt = now;
        return token;
      }

      // O papel vive no token, que é auto-contido. Sem revalidar, rebaixar um
      // ADMIN no banco não teria efeito até o token expirar — e um funcionário
      // desligado manteria acesso à base de leads.
      const stale =
        typeof token.roleCheckedAt !== "number" ||
        now - token.roleCheckedAt > ROLE_REVALIDATE_SECONDS;

      if (token.id && (stale || trigger === "update")) {
        try {
          const current = await db.user.findUnique({
            where: { id: token.id },
            select: { role: true },
          });

          if (!current) {
            // Usuário removido: invalida o token zerando o identificador.
            token.id = "";
            token.role = "CLIENTE" as Role;
          } else {
            token.role = current.role;
          }
          token.roleCheckedAt = now;
        } catch (err) {
          // Indisponibilidade do banco não pode deslogar todo mundo; mantém o
          // papel atual e tenta de novo na próxima requisição.
          logError("JWT_ROLE_REVALIDATE", err);
        }
      }

      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
});
