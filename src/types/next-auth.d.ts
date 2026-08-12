import { type Role } from "@prisma/client";
import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    /** Opcional para permanecer compatível com `AdapterUser`. */
    role?: Role;
    mustChangePassword?: boolean;
  }

  interface Session {
    user: {
      id: string;
      role: Role;
      /** Senha provisória pendente de troca; o portal bloqueia até resolver. */
      mustChangePassword: boolean;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: Role;
    mustChangePassword: boolean;
    /** Epoch em segundos da última revalidação do papel contra o banco. */
    roleCheckedAt?: number;
  }
}
