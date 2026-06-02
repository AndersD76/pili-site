"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { MOCK_EQUIPMENT } from "@/lib/data/portal-mock";

/* ---------- schema ---------- */

const serviceRequestSchema = z.object({
  equipmentId: z.string().min(1, "Selecione um equipamento"),
  type: z.enum(["preventiva", "corretiva", "calibracao", "instalacao"], {
    required_error: "Selecione o tipo de servico",
  }),
  priority: z.enum(["normal", "urgente"], {
    required_error: "Selecione a prioridade",
  }),
  description: z
    .string()
    .min(10, "Descreva o problema com pelo menos 10 caracteres")
    .max(2000),
  preferredDate: z.string().optional(),
  contactPhone: z
    .string()
    .min(8, "Telefone deve ter pelo menos 8 digitos")
    .max(20),
});

type ServiceRequestInput = z.infer<typeof serviceRequestSchema>;

/* ---------- constants ---------- */

const TYPE_OPTIONS = [
  { value: "preventiva", label: "Manutencao preventiva" },
  { value: "corretiva", label: "Manutencao corretiva" },
  { value: "calibracao", label: "Calibracao" },
  { value: "instalacao", label: "Instalacao" },
] as const;

const PRIORITY_OPTIONS = [
  { value: "normal", label: "Normal" },
  { value: "urgente", label: "Urgente" },
] as const;

const inputClasses =
  "w-full border border-pili-mist rounded-lg px-4 py-3 text-sm text-pili-black bg-pili-white placeholder:text-pili-cement transition-colors focus:border-pili-safety focus:ring-1 focus:ring-pili-safety focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";

/* ---------- page ---------- */

export default function NovaOrdemPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [orderNumber, setOrderNumber] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ServiceRequestInput>({
    resolver: zodResolver(serviceRequestSchema),
    defaultValues: {
      priority: "normal",
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function onSubmit(_data: ServiceRequestInput) {
    setStatus("loading");
    // simulate API call
    setTimeout(() => {
      const num = `OS-2025-${String(Math.floor(Math.random() * 9000) + 1000)}`;
      setOrderNumber(num);
      setStatus("success");
    }, 800);
  }

  /* ---------- success state ---------- */

  if (status === "success") {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-8 text-center">
          <CheckCircle2 className="mx-auto mb-4 size-12 text-emerald-600" />
          <h2 className="mb-2 text-xl font-bold text-emerald-800">
            Solicitacao enviada com sucesso!
          </h2>
          <p className="mb-1 text-sm text-emerald-700">
            Numero: <span className="font-mono font-bold">{orderNumber}</span>
          </p>
          <p className="mb-6 text-sm text-emerald-700">
            Nossa equipe entrara em contato em ate 24 horas.
          </p>
          <Link
            href="/portal/servicos"
            className="inline-flex items-center gap-2 rounded-lg bg-pili-safety px-5 py-2.5 text-sm font-semibold text-pili-white transition-colors hover:bg-pili-safety-deep"
          >
            <ArrowLeft className="size-4" />
            Voltar para ordens de servico
          </Link>
        </div>
      </div>
    );
  }

  /* ---------- form ---------- */

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* back link */}
      <Link
        href="/portal/servicos"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-pili-concrete transition-colors hover:text-pili-black"
      >
        <ArrowLeft className="size-4" />
        Voltar
      </Link>

      {/* header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-pili-black">
          Nova solicitacao de servico
        </h1>
        <p className="mt-1 text-sm text-pili-concrete">
          Preencha o formulario para solicitar atendimento tecnico
        </p>
      </div>

      {/* form card */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-lg border border-pili-mist bg-pili-white p-6 space-y-5"
      >
        {/* equipment */}
        <div className="space-y-1.5">
          <label
            htmlFor="equipmentId"
            className="block text-sm font-medium text-pili-iron"
          >
            Equipamento *
          </label>
          <select
            id="equipmentId"
            {...register("equipmentId")}
            className={inputClasses}
            defaultValue=""
          >
            <option value="" disabled>
              Selecione o equipamento
            </option>
            {MOCK_EQUIPMENT.map((eq) => (
              <option key={eq.id} value={eq.id}>
                {eq.productName} — {eq.serialNumber}
              </option>
            ))}
          </select>
          {errors.equipmentId && (
            <p className="text-xs text-pili-danger">
              {errors.equipmentId.message}
            </p>
          )}
        </div>

        {/* type + priority row */}
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label
              htmlFor="type"
              className="block text-sm font-medium text-pili-iron"
            >
              Tipo de servico *
            </label>
            <select
              id="type"
              {...register("type")}
              className={inputClasses}
              defaultValue=""
            >
              <option value="" disabled>
                Selecione o tipo
              </option>
              {TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {errors.type && (
              <p className="text-xs text-pili-danger">{errors.type.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="priority"
              className="block text-sm font-medium text-pili-iron"
            >
              Prioridade *
            </label>
            <select
              id="priority"
              {...register("priority")}
              className={inputClasses}
            >
              {PRIORITY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {errors.priority && (
              <p className="text-xs text-pili-danger">
                {errors.priority.message}
              </p>
            )}
          </div>
        </div>

        {/* description */}
        <div className="space-y-1.5">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-pili-iron"
          >
            Descricao *
          </label>
          <textarea
            id="description"
            rows={4}
            placeholder="Descreva o problema ou necessidade"
            {...register("description")}
            className={inputClasses + " resize-y"}
          />
          {errors.description && (
            <p className="text-xs text-pili-danger">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* preferred date + phone */}
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label
              htmlFor="preferredDate"
              className="block text-sm font-medium text-pili-iron"
            >
              Data preferencial
            </label>
            <input
              id="preferredDate"
              type="date"
              {...register("preferredDate")}
              className={inputClasses}
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="contactPhone"
              className="block text-sm font-medium text-pili-iron"
            >
              Telefone de contato *
            </label>
            <input
              id="contactPhone"
              type="tel"
              placeholder="(00) 00000-0000"
              {...register("contactPhone")}
              className={inputClasses}
            />
            {errors.contactPhone && (
              <p className="text-xs text-pili-danger">
                {errors.contactPhone.message}
              </p>
            )}
          </div>
        </div>

        {/* submit */}
        <div className="flex items-center gap-4 pt-2">
          <button
            type="submit"
            disabled={status === "loading"}
            className="rounded-lg bg-pili-safety px-6 py-3 text-sm font-semibold text-pili-white transition-colors hover:bg-pili-safety-deep disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === "loading" ? "Enviando..." : "Enviar solicitacao"}
          </button>
          <Link
            href="/portal/servicos"
            className="text-sm font-medium text-pili-concrete transition-colors hover:text-pili-black"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
