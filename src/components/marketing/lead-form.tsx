"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { leadSchema, type LeadInput } from "@/lib/validators/lead";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { APPLICATIONS } from "@/lib/constants";

/** Rótulos das aplicações; os valores vêm de `APPLICATIONS` em constants. */
const APPLICATION_LABELS: Record<(typeof APPLICATIONS)[number], string> = {
  porto: "Porto",
  cooperativa: "Cooperativa",
  industria: "Indústria alimentícia",
  fertilizante: "Fertilizante",
  cimento: "Cimento",
};

interface LeadFormProps {
  productInterest?: string;
  source?: string;
  compact?: boolean;
  dark?: boolean;
  className?: string;
}

export function LeadForm({
  productInterest,
  source = "FORMULARIO",
  compact = false,
  dark = false,
  className,
}: LeadFormProps) {
  const inputClass = dark
    ? "h-10 w-full border border-pili-iron bg-pili-graphite px-3 py-2 text-sm text-pili-white placeholder:text-pili-cement focus:border-pili-safety focus:outline-none focus:ring-1 focus:ring-pili-safety"
    : undefined;
  const labelClass = dark ? "text-pili-mist" : undefined;
  const t = useTranslations("forms");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LeadInput>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      country: "BR",
      consent: undefined,
      productInterest: productInterest ?? undefined,
    },
  });

  async function onSubmit(data: LeadInput) {
    setStatus("loading");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          source,
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

  if (status === "success") {
    return (
      <div className={cn("border border-pili-success/30 bg-pili-success/5 p-8 text-center", className)}>
        <p className="font-display text-xl font-bold uppercase text-pili-success">
          {t("success")}
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("flex flex-col gap-4", className)}
    >
      <div className={cn("grid gap-4", compact ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3")}>
        <div>
          <Label htmlFor="name" className={labelClass}>{t("name")} *</Label>
          {dark ? <input id="name" {...register("name")} className={inputClass} /> : <Input id="name" {...register("name")} />}
          {errors.name && <p className="mt-1 text-xs text-pili-danger">{errors.name.message}</p>}
        </div>

        <div>
          <Label htmlFor="email" className={labelClass}>{t("email")} *</Label>
          {dark ? <input id="email" type="email" {...register("email")} className={inputClass} /> : <Input id="email" type="email" {...register("email")} />}
          {errors.email && <p className="mt-1 text-xs text-pili-danger">{errors.email.message}</p>}
        </div>

        <div>
          <Label htmlFor="phone" className={labelClass}>{t("phone")} *</Label>
          {dark ? <input id="phone" type="tel" {...register("phone")} className={inputClass} /> : <Input id="phone" type="tel" {...register("phone")} />}
          {errors.phone && <p className="mt-1 text-xs text-pili-danger">{errors.phone.message}</p>}
        </div>

        <div>
          <Label htmlFor="company" className={labelClass}>{t("company")} *</Label>
          {dark ? <input id="company" {...register("company")} className={inputClass} /> : <Input id="company" {...register("company")} />}
          {errors.company && <p className="mt-1 text-xs text-pili-danger">{errors.company.message}</p>}
        </div>

        {!compact && (
          <>
            <div>
              <Label htmlFor="application">Aplicação</Label>
              <select
                id="application"
                {...register("application")}
                className="flex h-10 w-full border border-pili-mist bg-pili-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pili-safety"
              >
                <option value="">Selecione...</option>
                {APPLICATIONS.map((app) => (
                  <option key={app} value={app}>
                    {APPLICATION_LABELS[app]}
                  </option>
                ))}
                <option value="outro">Outro</option>
              </select>
            </div>

            <div>
              <Label htmlFor="productInterest">Produto de interesse</Label>
              <Input
                id="productInterest"
                {...register("productInterest")}
                defaultValue={productInterest}
              />
            </div>
          </>
        )}
      </div>

      {!compact && (
        <div>
          <Label htmlFor="message">{t("message")}</Label>
          <textarea
            id="message"
            rows={4}
            {...register("message")}
            className="flex w-full border border-pili-mist bg-pili-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pili-safety"
          />
        </div>
      )}

      <div className="flex items-start gap-2">
        <input
          type="checkbox"
          id="consent"
          {...register("consent")}
          className="mt-1 h-4 w-4 accent-pili-safety"
        />
        <Label htmlFor="consent" className={cn("text-sm font-normal", dark ? "text-pili-cement" : "text-pili-concrete")}>
          {t("consent")}
        </Label>
      </div>
      {errors.consent && <p className="text-xs text-pili-danger">{errors.consent.message}</p>}

      <button
        type="submit"
        disabled={status === "loading"}
        className="self-start bg-pili-safety px-8 py-3 text-sm font-semibold uppercase tracking-wider text-pili-white transition-colors hover:bg-pili-safety-deep disabled:opacity-50"
      >
        {status === "loading" ? "Enviando..." : t("submit")}
      </button>

      {status === "error" && (
        <p className="text-sm text-pili-danger">{t("error")}</p>
      )}
    </form>
  );
}
