"use client";

import { useState } from "react";
import { COMPANY } from "@/lib/constants";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users } from "lucide-react";

interface ApplicationForm {
  name: string;
  email: string;
  phone: string;
  area: string;
  message: string;
}

const AREAS = [
  "Engenharia",
  "Producao",
  "Comercial",
  "Administrativo",
  "Logistica",
  "TI / Tecnologia",
  "Qualidade",
  "Outro",
] as const;

export default function TrabalheConoscoPage() {
  const [formData, setFormData] = useState<ApplicationForm>({
    name: "",
    email: "",
    phone: "",
    area: "",
    message: "",
  });
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errors, setErrors] = useState<Partial<ApplicationForm>>({});

  function validate(): boolean {
    const newErrors: Partial<ApplicationForm> = {};
    if (formData.name.length < 2) newErrors.name = "Informe seu nome";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "E-mail invalido";
    if (formData.phone.length < 8) newErrors.phone = "Telefone invalido";
    if (!formData.area) newErrors.area = "Selecione uma area";
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
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company: "Candidato",
          consent: true,
          source: "TRABALHE_CONOSCO",
          message: `Area: ${formData.area}\n\n${formData.message}`,
          pageUrl: window.location.href,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("success");
      setFormData({ name: "", email: "", phone: "", area: "", message: "" });
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
            Trabalhe conosco
          </h1>
          <p className="mt-4 max-w-2xl text-pili-cement">
            A PILI Industrial esta sempre em busca de profissionais talentosos
            que compartilhem nossos valores de qualidade, seguranca e inovacao.
          </p>
        </div>
      </section>

      <section className="py-16 px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-16 lg:grid-cols-2">
          {/* Company info */}
          <div>
            <Users className="h-10 w-10 text-pili-safety" />
            <h2 className="mt-6 font-display text-[length:var(--text-h2)] font-black uppercase text-pili-black">
              Faca parte do time
            </h2>
            <p className="mt-4 leading-relaxed text-pili-concrete">
              Com mais de {new Date().getFullYear() - COMPANY.founded} anos de
              historia, a PILI e referencia na fabricacao de equipamentos
              industriais para o agronegocio. Atuamos em {18} paises e
              investimos continuamente em tecnologia e inovacao.
            </p>
            <p className="mt-4 leading-relaxed text-pili-concrete">
              Oferecemos um ambiente de trabalho que valoriza o desenvolvimento
              profissional, a colaboracao entre equipes e o compromisso com a
              excelencia. Nosso time reune engenheiros, tecnicos, gestores e
              especialistas que juntos transformam a logistica industrial.
            </p>

            <div className="mt-8 space-y-4">
              <h3 className="font-display text-lg font-bold uppercase text-pili-black">
                Por que trabalhar na PILI?
              </h3>
              <ul className="space-y-3">
                {[
                  "Empresa solida com mais de 4 decadas de mercado",
                  "Projetos de alcance internacional",
                  "Investimento em inovacao e tecnologia propria",
                  "Ambiente colaborativo e orientado a resultados",
                  "Oportunidades de crescimento profissional",
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex gap-3 text-sm text-pili-concrete"
                  >
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 bg-pili-safety" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Application form */}
          <div>
            {status === "success" ? (
              <div className="border border-pili-success/30 bg-pili-success/5 p-10 text-center">
                <h2 className="font-display text-xl font-bold uppercase text-pili-success">
                  Candidatura enviada
                </h2>
                <p className="mt-3 text-sm text-pili-concrete">
                  Obrigado pelo interesse em fazer parte da equipe PILI.
                  Analisaremos seu perfil e entraremos em contato caso haja uma
                  vaga compativel.
                </p>
              </div>
            ) : (
              <div className="border border-pili-mist p-8">
                <h2 className="font-display text-xl font-bold uppercase text-pili-black">
                  Envie sua candidatura
                </h2>
                <p className="mt-2 text-sm text-pili-concrete">
                  Preencha o formulario abaixo. Nao temos vagas abertas no
                  momento? Sem problema, manteremos seu perfil em nosso banco de
                  talentos.
                </p>

                <form
                  onSubmit={handleSubmit}
                  className="mt-6 flex flex-col gap-4"
                >
                  <div>
                    <Label htmlFor="app-name">Nome completo *</Label>
                    <Input
                      id="app-name"
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

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="app-email">E-mail *</Label>
                      <Input
                        id="app-email"
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
                      <Label htmlFor="app-phone">Telefone *</Label>
                      <Input
                        id="app-phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                      />
                      {errors.phone && (
                        <p className="mt-1 text-xs text-pili-danger">
                          {errors.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="app-area">Area de interesse *</Label>
                    <select
                      id="app-area"
                      value={formData.area}
                      onChange={(e) =>
                        setFormData({ ...formData, area: e.target.value })
                      }
                      className="flex h-10 w-full border border-pili-mist bg-pili-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pili-safety"
                    >
                      <option value="">Selecione...</option>
                      {AREAS.map((area) => (
                        <option key={area} value={area}>
                          {area}
                        </option>
                      ))}
                    </select>
                    {errors.area && (
                      <p className="mt-1 text-xs text-pili-danger">
                        {errors.area}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="app-message">
                      Mensagem / experiencia relevante
                    </Label>
                    <textarea
                      id="app-message"
                      rows={4}
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      className="flex w-full border border-pili-mist bg-pili-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pili-safety"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="self-start bg-pili-safety px-8 py-3 text-sm font-semibold uppercase tracking-wider text-pili-black transition-colors hover:bg-pili-safety-deep disabled:opacity-50"
                  >
                    {status === "loading" ? "Enviando..." : "Enviar candidatura"}
                  </button>

                  {status === "error" && (
                    <p className="text-sm text-pili-danger">
                      Erro ao enviar. Tente novamente ou envie para{" "}
                      {COMPANY.email}.
                    </p>
                  )}
                </form>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
