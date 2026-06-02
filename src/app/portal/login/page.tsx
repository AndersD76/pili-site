"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function PortalLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        callbackUrl: "/portal",
        redirect: false,
      });

      if (result?.error) {
        setError("Email ou senha invalidos");
        setLoading(false);
        return;
      }

      router.push("/portal");
    } catch {
      setError("Email ou senha invalidos");
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm rounded-lg border border-pili-mist bg-white p-8 shadow-lg">
      <div className="flex flex-col items-center text-center">
        <Image
          src="/images/logo-pili.png"
          alt="PILI"
          width={160}
          height={53}
          className="mb-4 h-14 w-auto"
          priority
        />
        <h1 className="text-lg font-semibold text-pili-black">
          Portal do Cliente
        </h1>
        <p className="mb-6 text-sm text-pili-cement">
          Acesse com suas credenciais
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-pili-black"
          >
            E-mail
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            className="w-full rounded border border-pili-mist bg-white px-4 py-3 text-sm text-pili-black placeholder:text-pili-cement focus:border-pili-safety focus:outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-pili-black"
          >
            Senha
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Sua senha"
            className="w-full rounded border border-pili-mist bg-white px-4 py-3 text-sm text-pili-black placeholder:text-pili-cement focus:border-pili-safety focus:outline-none"
          />
        </div>

        {error && (
          <p className="text-center text-sm text-red-600">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-pili-safety px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-pili-safety/90 disabled:opacity-60"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>

      <div className="mt-6 flex flex-col items-center gap-3">
        <Link
          href="/"
          className="text-xs text-pili-cement transition-colors hover:text-pili-black"
        >
          Voltar ao site
        </Link>
        <p className="text-center text-xs text-pili-cement">
          Credenciais fornecidas pela equipe PILI Industrial
        </p>
      </div>
    </div>
  );
}
