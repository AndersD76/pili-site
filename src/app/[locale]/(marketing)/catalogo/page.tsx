"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { COMPANY } from "@/lib/constants";
import { Link } from "@/i18n/routing";
import {
  catalogFormSchema,
  type CatalogFormInput,
} from "@/lib/validators/lead";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, FileText } from "lucide-react";

export default function CatalogoPage() {
  const [status, setStatus] = useState<
    "idle" | "loading" | "unlocked" | "error"
  >("idle");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CatalogFormInput>({
    resolver: zodResolver(catalogFormSchema),
    defaultValues: { name: "", email: "", company: "", country: "BR" },
  });

  async function onSubmit(values: CatalogFormInput) {
    setStatus("loading");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          source: "CATALOGO",
          pageUrl: window.location.href,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("unlocked");
    } catch {
      setStatus("error");
    }
  }

  return (
    <main className="pt-[var(--header-height)]">
      {/* Hero */}
      <section className="bg-pili-black py-20 px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h1 className="font-display text-[length:var(--text-display-2)] font-black uppercase text-pili-white">
            Catálogo PILI
          </h1>
          <p className="mt-4 max-w-2xl text-pili-cement">
            Baixe o catálogo completo com especificações técnicas, dimensionais e
            fotos de todos os equipamentos PILI Industrial.
          </p>
        </div>
      </section>

      <section className="py-16 px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          {status === "unlocked" ? (
            /* Download unlocked */
            <div className="border border-pili-success/30 bg-pili-success/5 p-10 text-center">
              <Download className="mx-auto h-12 w-12 text-pili-success" />
              <h2 className="mt-6 font-display text-xl font-bold uppercase text-pili-black">
                Catálogo liberado
              </h2>
              <p className="mt-3 text-sm text-pili-concrete">
                Recebemos seus dados. Nossa equipe comercial enviará o catálogo
                completo para o e-mail informado em até um dia útil.
              </p>
              <Link
                href="/produtos"
                className="mt-6 inline-flex items-center gap-2 bg-pili-safety px-8 py-4 text-sm font-semibold uppercase tracking-wider text-pili-white transition-colors hover:bg-pili-safety-deep"
              >
                Ver a linha de produtos
              </Link>
            </div>
          ) : (
            /* Lead gate form */
            <div className="border border-pili-mist p-8 lg:p-10">
              <div className="flex items-center gap-4">
                <FileText className="h-10 w-10 text-pili-safety" />
                <div>
                  <h2 className="font-display text-xl font-bold uppercase text-pili-black">
                    Download do catálogo
                  </h2>
                  <p className="mt-1 text-sm text-pili-concrete">
                    Preencha os dados abaixo para liberar o download.
                  </p>
                </div>
              </div>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="mt-8 flex flex-col gap-4"
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="cat-name">Nome *</Label>
                    <Input id="cat-name" {...register("name")} />
                    {errors.name && (
                      <p className="mt-1 text-xs text-pili-danger">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="cat-email">E-mail *</Label>
                    <Input id="cat-email" type="email" {...register("email")} />
                    {errors.email && (
                      <p className="mt-1 text-xs text-pili-danger">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="cat-company">Empresa *</Label>
                    <Input id="cat-company" {...register("company")} />
                    {errors.company && (
                      <p className="mt-1 text-xs text-pili-danger">
                        {errors.company.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="cat-country">País *</Label>
                    <select
                      id="cat-country"
                      {...register("country")}
                      className="flex h-10 w-full border border-pili-mist bg-pili-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pili-safety"
                    >
                      <option value="BR">Brasil</option>
                      <option value="PY">Paraguai</option>
                      <option value="AR">Argentina</option>
                      <option value="UY">Uruguai</option>
                      <option value="CL">Chile</option>
                      <option value="CO">Colômbia</option>
                      <option value="PE">Peru</option>
                      <option value="US">Estados Unidos</option>
                      <option value="ZZ">Outro</option>
                    </select>
                    {errors.country && (
                      <p className="mt-1 text-xs text-pili-danger">
                        {errors.country.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="cat-consent"
                    {...register("consent")}
                    className="mt-1 h-4 w-4 accent-pili-safety"
                  />
                  <Label
                    htmlFor="cat-consent"
                    className="text-sm font-normal text-pili-concrete"
                  >
                    Aceito a{" "}
                    <Link
                      href="/politica-privacidade"
                      className="underline underline-offset-2 hover:text-pili-black"
                    >
                      política de privacidade
                    </Link>{" "}
                    e o contato da equipe comercial.
                  </Label>
                </div>
                {errors.consent && (
                  <p className="text-xs text-pili-danger">
                    {errors.consent.message}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="self-start bg-pili-safety px-8 py-3 text-sm font-semibold uppercase tracking-wider text-pili-white transition-colors hover:bg-pili-safety-deep disabled:opacity-50"
                >
                  {status === "loading" ? "Enviando..." : "Liberar download"}
                </button>

                {status === "error" && (
                  <p className="text-sm text-pili-danger">
                    Erro ao enviar. Tente novamente ou entre em contato pelo
                    e-mail {COMPANY.email}.
                  </p>
                )}
              </form>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
