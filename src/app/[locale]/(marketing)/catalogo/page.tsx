"use client";

import { useState } from "react";
import { COMPANY } from "@/lib/constants";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, FileText } from "lucide-react";

interface CatalogFormData {
  name: string;
  email: string;
  company: string;
  country: string;
}

export default function CatalogoPage() {
  const [formData, setFormData] = useState<CatalogFormData>({
    name: "",
    email: "",
    company: "",
    country: "BR",
  });
  const [status, setStatus] = useState<
    "idle" | "loading" | "unlocked" | "error"
  >("idle");
  const [errors, setErrors] = useState<Partial<CatalogFormData>>({});

  function validate(): boolean {
    const newErrors: Partial<CatalogFormData> = {};
    if (formData.name.length < 2) newErrors.name = "Informe seu nome";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "E-mail invalido";
    if (formData.company.length < 2) newErrors.company = "Informe a empresa";
    if (formData.country.length !== 2) newErrors.country = "Pais invalido";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          phone: "N/A",
          consent: true,
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
            Catalogo PILI
          </h1>
          <p className="mt-4 max-w-2xl text-pili-cement">
            Baixe o catalogo completo com especificacoes tecnicas, dimensionais e
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
                Catalogo liberado
              </h2>
              <p className="mt-3 text-sm text-pili-concrete">
                Clique no botao abaixo para fazer o download. O catalogo tambem
                foi enviado para o seu e-mail.
              </p>
              <a
                href="/documents/catalogo-pili-industrial.pdf"
                download
                className="mt-6 inline-flex items-center gap-2 bg-pili-safety px-8 py-4 text-sm font-semibold uppercase tracking-wider text-pili-white transition-colors hover:bg-pili-safety-deep"
              >
                <Download className="h-4 w-4" />
                Baixar catalogo PDF
              </a>
            </div>
          ) : (
            /* Lead gate form */
            <div className="border border-pili-mist p-8 lg:p-10">
              <div className="flex items-center gap-4">
                <FileText className="h-10 w-10 text-pili-safety" />
                <div>
                  <h2 className="font-display text-xl font-bold uppercase text-pili-black">
                    Download do catalogo
                  </h2>
                  <p className="mt-1 text-sm text-pili-concrete">
                    Preencha os dados abaixo para liberar o download.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="cat-name">Nome *</Label>
                    <Input
                      id="cat-name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                    {errors.name && (
                      <p className="mt-1 text-xs text-pili-danger">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="cat-email">E-mail *</Label>
                    <Input
                      id="cat-email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs text-pili-danger">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="cat-company">Empresa *</Label>
                    <Input
                      id="cat-company"
                      value={formData.company}
                      onChange={(e) =>
                        setFormData({ ...formData, company: e.target.value })
                      }
                    />
                    {errors.company && (
                      <p className="mt-1 text-xs text-pili-danger">
                        {errors.company}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="cat-country">Pais *</Label>
                    <select
                      id="cat-country"
                      value={formData.country}
                      onChange={(e) =>
                        setFormData({ ...formData, country: e.target.value })
                      }
                      className="flex h-10 w-full border border-pili-mist bg-pili-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pili-safety"
                    >
                      <option value="BR">Brasil</option>
                      <option value="PY">Paraguai</option>
                      <option value="AR">Argentina</option>
                      <option value="UY">Uruguai</option>
                      <option value="CL">Chile</option>
                      <option value="CO">Colombia</option>
                      <option value="PE">Peru</option>
                      <option value="US">Estados Unidos</option>
                      <option value="XX">Outro</option>
                    </select>
                    {errors.country && (
                      <p className="mt-1 text-xs text-pili-danger">
                        {errors.country}
                      </p>
                    )}
                  </div>
                </div>

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
