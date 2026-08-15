"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import {
  catalogFormSchema,
  type CatalogFormInput,
} from "@/lib/validators/lead";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, FileText } from "lucide-react";

export default function CatalogoPage() {
  const t = useTranslations();
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
            {t("catalogo.title")}
          </h1>
          <p className="mt-4 max-w-2xl text-pili-cement">
            {t("catalogo.intro")}
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
                {t("catalogo.released")}
              </h2>
              <p className="mt-3 text-sm text-pili-concrete">
                {t("catalogo.releasedText")}
              </p>
              <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- download de arquivo, nao navegacao SPA */}
                <a
                  href="/api/catalogo/pdf"
                  className="inline-flex items-center gap-2 bg-pili-safety px-8 py-4 text-sm font-semibold uppercase tracking-wider text-pili-white transition-colors hover:bg-pili-safety-deep"
                >
                  <Download className="h-4 w-4" />
                  Baixar catalogo em PDF
                </a>
                <Link
                  href="/produtos"
                  className="inline-flex items-center gap-2 border border-pili-mist px-8 py-4 text-sm font-semibold uppercase tracking-wider text-pili-black transition-colors hover:border-pili-black"
                >
                  {t("catalogo.seeProducts")}
                </Link>
              </div>
            </div>
          ) : (
            /* Lead gate form */
            <div className="border border-pili-mist p-8 lg:p-10">
              <div className="flex items-center gap-4">
                <FileText className="h-10 w-10 text-pili-safety" />
                <div>
                  <h2 className="font-display text-xl font-bold uppercase text-pili-black">
                    {t("catalogo.download")}
                  </h2>
                  <p className="mt-1 text-sm text-pili-concrete">
                    {t("catalogo.formIntro")}
                  </p>
                </div>
              </div>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="mt-8 flex flex-col gap-4"
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="cat-name">{t("forms.name")} *</Label>
                    <Input id="cat-name" {...register("name")} />
                    {errors.name && (
                      <p className="mt-1 text-xs text-pili-danger">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="cat-email">{t("forms.email")} *</Label>
                    <Input id="cat-email" type="email" {...register("email")} />
                    {errors.email && (
                      <p className="mt-1 text-xs text-pili-danger">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="cat-company">{t("forms.company")} *</Label>
                    <Input id="cat-company" {...register("company")} />
                    {errors.company && (
                      <p className="mt-1 text-xs text-pili-danger">
                        {errors.company.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="cat-country">{t("catalogo.country")} *</Label>
                    <select
                      id="cat-country"
                      {...register("country")}
                      className="flex h-10 w-full border border-pili-mist bg-pili-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pili-safety"
                    >
                      <option value="BR">{t("catalogo.countries.BR")}</option>
                      <option value="PY">{t("catalogo.countries.PY")}</option>
                      <option value="AR">{t("catalogo.countries.AR")}</option>
                      <option value="UY">{t("catalogo.countries.UY")}</option>
                      <option value="BO">{t("catalogo.countries.BO")}</option>
                      <option value="CO">{t("catalogo.countries.CO")}</option>
                      <option value="PE">{t("catalogo.countries.PE")}</option>
                      <option value="US">{t("catalogo.countries.US")}</option>
                      <option value="ZZ">{t("catalogo.countries.OUTRO")}</option>
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
                    {t("catalogo.consentPrefix")}{" "}
                    <Link
                      href="/politica-privacidade"
                      className="underline underline-offset-2 hover:text-pili-black"
                    >
                      {t("catalogo.consentMiddle")}
                    </Link>{" "}
                    {t("catalogo.consentSuffix")}
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
                  {status === "loading" ? t("forms.sending") : t("catalogo.unlock")}
                </button>

                {status === "error" && (
                  <p className="text-sm text-pili-danger">
                    {t("catalogo.sendError")}
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
