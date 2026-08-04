"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { leadSchema, type LeadInput } from "@/lib/validators/lead";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { APPLICATIONS } from "@/lib/constants";

interface LeadFormProps {
  productInterest?: string;
  source?: string;
  compact?: boolean;
  /** Formulário sobre fundo escuro (seções `bg-pili-black`). */
  dark?: boolean;
  className?: string;
}

/**
 * Formulário de captação de leads.
 *
 * Os campos vinham em duas variantes escritas à mão (`dark ? <input> : <Input>`)
 * e só as quatro primeiras respeitavam a variante escura: o select, o produto
 * de interesse e a mensagem ficavam brancos e os rótulos, cinza-escuro sobre
 * preto. Agora há um único conjunto de classes por variante, aplicado a todos
 * os controles.
 */
export function LeadForm({
  productInterest,
  source = "FORMULARIO",
  compact = false,
  dark = false,
  className,
}: LeadFormProps) {
  const t = useTranslations("forms");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );

  const controle = cn(
    "w-full border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-1 focus:ring-pili-safety",
    dark
      ? "border-pili-iron bg-pili-steel text-pili-white placeholder:text-pili-cement focus:border-pili-safety"
      : "border-pili-mist bg-pili-white text-pili-black placeholder:text-pili-concrete focus:border-pili-safety",
  );
  const campo = cn(controle, "h-10");
  const rotulo = dark ? "text-pili-mist" : "text-pili-graphite";

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
      <div
        className={cn(
          "border border-pili-success/30 bg-pili-success/5 p-8 text-center",
          className,
        )}
      >
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
      <div
        className={cn(
          "grid gap-4",
          compact ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3",
        )}
      >
        <div className="space-y-1.5">
          <Label htmlFor="name" className={rotulo}>
            {t("name")} *
          </Label>
          <input id="name" {...register("name")} className={campo} />
          {errors.name && (
            <p className="text-xs text-pili-danger">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email" className={rotulo}>
            {t("email")} *
          </Label>
          <input
            id="email"
            type="email"
            {...register("email")}
            className={campo}
          />
          {errors.email && (
            <p className="text-xs text-pili-danger">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="phone" className={rotulo}>
            {t("phone")} *
          </Label>
          <input
            id="phone"
            type="tel"
            {...register("phone")}
            className={campo}
          />
          {errors.phone && (
            <p className="text-xs text-pili-danger">{errors.phone.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="company" className={rotulo}>
            {t("company")} *
          </Label>
          <input id="company" {...register("company")} className={campo} />
          {errors.company && (
            <p className="text-xs text-pili-danger">{errors.company.message}</p>
          )}
        </div>

        {!compact && (
          <>
            <div className="space-y-1.5">
              <Label htmlFor="application" className={rotulo}>
                {t("application")}
              </Label>
              <select
                id="application"
                {...register("application")}
                className={campo}
              >
                <option value="">{t("select")}</option>
                {APPLICATIONS.map((app) => (
                  <option key={app} value={app}>
                    {t(`applications.${app}`)}
                  </option>
                ))}
                <option value="outro">{t("applications.outro")}</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="productInterest" className={rotulo}>
                {t("productInterest")}
              </Label>
              <input
                id="productInterest"
                {...register("productInterest")}
                defaultValue={productInterest}
                className={campo}
              />
            </div>
          </>
        )}
      </div>

      {!compact && (
        <div className="space-y-1.5">
          <Label htmlFor="message" className={rotulo}>
            {t("message")}
          </Label>
          <textarea
            id="message"
            rows={4}
            {...register("message")}
            className={controle}
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
        <Label
          htmlFor="consent"
          className={cn(
            "text-sm font-normal",
            dark ? "text-pili-mist" : "text-pili-concrete",
          )}
        >
          {t("consent")}
        </Label>
      </div>
      {errors.consent && (
        <p className="text-xs text-pili-danger">{errors.consent.message}</p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="self-start bg-pili-safety px-8 py-3 text-sm font-semibold uppercase tracking-wider text-pili-white transition-colors hover:bg-pili-safety-deep disabled:opacity-50"
      >
        {status === "loading" ? t("sending") : t("submit")}
      </button>

      {status === "error" && (
        <p className="text-sm text-pili-danger">{t("error")}</p>
      )}
    </form>
  );
}
