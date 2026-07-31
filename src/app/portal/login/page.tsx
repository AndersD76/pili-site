"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
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
        redirect: false,
      });

      if (result?.error) {
        setError("Email ou senha inválidos");
        setLoading(false);
        return;
      }

      // O layout do portal encaminha administração para /admin — decidir a rota
      // por role aqui duplicaria essa regra em dois lugares.
      router.push("/portal");
      router.refresh();
    } catch {
      setError("Erro ao fazer login. Tente novamente.");
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm rounded-lg border border-pili-mist bg-white p-8 shadow-lg">
      <div className="flex flex-col items-center text-center">
        <img
          src="/images/logo-pili.png"
          alt="PILI Industrial"
          className="mb-4 h-16 w-auto"
        />
        <h1 className="font-display text-xl font-bold text-pili-black">
          Acesso restrito
        </h1>
        <p className="mb-6 text-sm text-pili-concrete">
          Administração e Portal do Cliente
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
            className="w-full rounded border border-pili-mist bg-white px-4 py-3 text-sm text-pili-black placeholder:text-pili-concrete focus:border-pili-safety focus:outline-none focus:ring-1 focus:ring-pili-safety"
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
            className="w-full rounded border border-pili-mist bg-white px-4 py-3 text-sm text-pili-black placeholder:text-pili-concrete focus:border-pili-safety focus:outline-none focus:ring-1 focus:ring-pili-safety"
          />
        </div>

        {error && (
          <p className="text-center text-sm text-pili-safety">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-pili-safety px-4 py-3 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-pili-safety-deep disabled:opacity-60"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>

      <div className="mt-6 flex flex-col items-center gap-3">
        <Link
          href="/"
          className="text-xs text-pili-concrete transition-colors hover:text-pili-black"
        >
          Voltar ao site
        </Link>
      </div>
    </div>
  );
}
