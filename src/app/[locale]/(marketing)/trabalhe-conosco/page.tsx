"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { COMPANY, STATS } from "@/lib/constants";
import { Link } from "@/i18n/routing";
import {
  jobApplicationFormSchema,
  type JobApplicationFormInput,
} from "@/lib/validators/lead";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users } from "lucide-react";

const AREAS = [
  "Engenharia",
  "Produção",
  "Comercial",
  "Administrativo",
  "Logística",
  "TI / Tecnologia",
  "Qualidade",
  "Outro",
] as const;

export default function TrabalheConoscoPage() {
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<JobApplicationFormInput>({
    resolver: zodResolver(jobApplicationFormSchema),
    defaultValues: { name: "", email: "", phone: "", area: "", message: "" },
  });

  async function onSubmit(values: JobApplicationFormInput) {
    setStatus("loading");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          phone: values.phone,
          company: "Candidato",
          consent: values.consent,
          source: "TRABALHE_CONOSCO",
          message: `Área: ${values.area}\n\n${values.message ?? ""}`.trim(),
          pageUrl: window.location.href,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("success");
      reset();
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
            A PILI Industrial está sempre em busca de profissionais talentosos
            que compartilhem nossos valores de qualidade, segurança e inovação.
          </p>
        </div>
      </section>

      <section className="py-16 px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-16 lg:grid-cols-2">
          {/* Company info */}
          <div>
            <Users className="h-10 w-10 text-pili-safety" />
            <h2 className="mt-6 font-display text-[length:var(--text-h2)] font-black uppercase text-pili-black">
              Faça parte do time
            </h2>
            <p className="mt-4 leading-relaxed text-pili-concrete">
              Com mais de {new Date().getFullYear() - COMPANY.founded} anos de
              história, a PILI é referência na fabricação de equipamentos
              industriais para o agronegócio. Atuamos em {STATS.countries} países e
              investimos continuamente em tecnologia e inovação.
            </p>
            <p className="mt-4 leading-relaxed text-pili-concrete">
              Oferecemos um ambiente de trabalho que valoriza o desenvolvimento
              profissional, a colaboração entre equipes e o compromisso com a
              excelência. Nosso time reúne engenheiros, técnicos, gestores e
              especialistas que juntos transformam a logística industrial.
            </p>

            <div className="mt-8 space-y-4">
              <h3 className="font-display text-lg font-bold uppercase text-pili-black">
                Por que trabalhar na PILI?
              </h3>
              <ul className="space-y-3">
                {[
                  "Empresa sólida com mais de 4 décadas de mercado",
                  "Projetos de alcance internacional",
                  "Investimento em inovação e tecnologia própria",
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
                  vaga compatível.
                </p>
              </div>
            ) : (
              <div className="border border-pili-mist p-8">
                <h2 className="font-display text-xl font-bold uppercase text-pili-black">
                  Envie sua candidatura
                </h2>
                <p className="mt-2 text-sm text-pili-concrete">
                  Preencha o formulário abaixo. Não temos vagas abertas no
                  momento? Sem problema, manteremos seu perfil em nosso banco de
                  talentos.
                </p>

                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="mt-6 flex flex-col gap-4"
                >
                  <div>
                    <Label htmlFor="app-name">Nome completo *</Label>
                    <Input id="app-name" {...register("name")} />
                    {errors.name && (
                      <p className="mt-1 text-xs text-pili-danger">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="app-email">E-mail *</Label>
                      <Input
                        id="app-email"
                        type="email"
                        {...register("email")}
                      />
                      {errors.email && (
                        <p className="mt-1 text-xs text-pili-danger">
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="app-phone">Telefone *</Label>
                      <Input id="app-phone" type="tel" {...register("phone")} />
                      {errors.phone && (
                        <p className="mt-1 text-xs text-pili-danger">
                          {errors.phone.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="app-area">Área de interesse *</Label>
                    <select
                      id="app-area"
                      {...register("area")}
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
                        {errors.area.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="app-message">
                      Mensagem / experiência relevante
                    </Label>
                    <textarea
                      id="app-message"
                      rows={4}
                      {...register("message")}
                      className="flex w-full border border-pili-mist bg-pili-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pili-safety"
                    />
                  </div>

                  <div className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      id="app-consent"
                      {...register("consent")}
                      className="mt-1 h-4 w-4 accent-pili-safety"
                    />
                    <Label
                      htmlFor="app-consent"
                      className="text-sm font-normal text-pili-concrete"
                    >
                      Aceito a{" "}
                      <Link
                        href="/politica-privacidade"
                        className="underline underline-offset-2 hover:text-pili-black"
                      >
                        política de privacidade
                      </Link>{" "}
                      e o armazenamento do meu currículo no banco de talentos.
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
