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
import { useTranslations } from "next-intl";
import {
  ACCEPT_CV_ATTRIBUTE,
  MAX_CV_SIZE,
  MAX_CV_SIZE_LABEL,
} from "@/lib/media";

const AREAS = [
  "engenharia",
  "producao",
  "comercial",
  "administrativo",
  "logistica",
  "ti",
  "qualidade",
  "outra",
] as const;

export default function TrabalheConoscoPage() {
  const t = useTranslations();
  const [cv, setCv] = useState<File | null>(null);
  const [erroCv, setErroCv] = useState<string | null>(null);
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
    setErroCv(null);

    if (cv) {
      if (cv.size > MAX_CV_SIZE) {
        setErroCv(t("trabalhe.cvTooBig", { max: MAX_CV_SIZE_LABEL }));
        return;
      }
      // Checagem local só para dar retorno imediato; quem decide é o servidor,
      // que confere os magic bytes.
      const extensao = cv.name.toLowerCase().split(".").pop() ?? "";
      if (!["pdf", "doc", "docx"].includes(extensao)) {
        setErroCv(t("trabalhe.cvBadFormat"));
        return;
      }
    }

    setStatus("loading");
    try {
      // `multipart/form-data` por causa do arquivo — o corpo não pode ser JSON.
      const body = new FormData();
      body.set("name", values.name);
      body.set("email", values.email);
      body.set("phone", values.phone);
      body.set("area", values.area);
      body.set("message", values.message ?? "");
      body.set("consent", String(values.consent));
      if (cv) body.set("cv", cv);

      const res = await fetch("/api/candidaturas", { method: "POST", body });
      if (!res.ok) throw new Error("Failed");
      setStatus("success");
      setCv(null);
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
            {t("trabalhe.hero")}
          </h1>
          <p className="mt-4 max-w-2xl text-pili-cement">
            {t("trabalhe.heroIntro")}
          </p>
        </div>
      </section>

      <section className="py-16 px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-16 lg:grid-cols-2">
          {/* Company info */}
          <div>
            <Users className="h-10 w-10 text-pili-safety" />
            <h2 className="mt-6 font-display text-[length:var(--text-h2)] font-black uppercase text-pili-black">
              {t("trabalhe.title")}
            </h2>
            <p className="mt-4 leading-relaxed text-pili-concrete">
              {t("trabalhe.about1", {
                years: new Date().getFullYear() - COMPANY.founded,
                countries: STATS.countries,
              })}
            </p>
            <p className="mt-4 leading-relaxed text-pili-concrete">
              {t("trabalhe.about2")}
            </p>

            <div className="mt-8 space-y-4">
              <h3 className="font-display text-lg font-bold uppercase text-pili-black">
                {t("trabalhe.whyTitle")}
              </h3>
              <ul className="space-y-3">
                {(["r1", "r2", "r3", "r5", "r4"] as const).map((chave) => (
                  <li
                    key={chave}
                    className="flex gap-3 text-sm text-pili-concrete"
                  >
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 bg-pili-safety" />
                    {t(`trabalhe.${chave}`)}
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
                  {t("trabalhe.sent")}
                </h2>
                <p className="mt-3 text-sm text-pili-concrete">
                  {t("trabalhe.sentText")}
                </p>
              </div>
            ) : (
              <div className="border border-pili-mist p-8">
                <h2 className="font-display text-xl font-bold uppercase text-pili-black">
                  {t("trabalhe.applyTitle")}
                </h2>
                <p className="mt-2 text-sm text-pili-concrete">
                  {t("trabalhe.applyText")}
                </p>

                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="mt-6 flex flex-col gap-4"
                >
                  <div>
                    <Label htmlFor="app-name">{t("trabalhe.fullName")} *</Label>
                    <Input id="app-name" {...register("name")} />
                    {errors.name && (
                      <p className="mt-1 text-xs text-pili-danger">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="app-email">{t("forms.email")} *</Label>
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
                      <Label htmlFor="app-phone">{t("forms.phone")} *</Label>
                      <Input id="app-phone" type="tel" {...register("phone")} />
                      {errors.phone && (
                        <p className="mt-1 text-xs text-pili-danger">
                          {errors.phone.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="app-area">{t("trabalhe.area")} *</Label>
                    <select
                      id="app-area"
                      {...register("area")}
                      className="flex h-10 w-full border border-pili-mist bg-pili-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pili-safety"
                    >
                      <option value="">{t("forms.select")}</option>
                      {AREAS.map((area) => (
                        <option key={area} value={area}>
                          {t(`trabalhe.areas.${area}`)}
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
                      {t("trabalhe.experience")}
                    </Label>
                    <textarea
                      id="app-message"
                      rows={4}
                      {...register("message")}
                      className="flex w-full border border-pili-mist bg-pili-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pili-safety"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="app-cv">{t("trabalhe.cv")}</Label>
                    <input
                      id="app-cv"
                      type="file"
                      accept={ACCEPT_CV_ATTRIBUTE}
                      onChange={(e) => {
                        setCv(e.target.files?.[0] ?? null);
                        setErroCv(null);
                      }}
                      className="block w-full text-sm text-pili-concrete file:mr-3 file:border file:border-pili-mist file:bg-pili-paper file:px-4 file:py-2 file:text-sm file:font-medium file:text-pili-graphite hover:file:bg-pili-mist"
                    />
                    <p className="text-xs text-pili-cement">
                      {t("trabalhe.cvHelp", { max: MAX_CV_SIZE_LABEL })}
                    </p>
                    {erroCv && <p className="text-xs text-pili-danger">{erroCv}</p>}
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
                      {t("trabalhe.consentPrefix")}{" "}
                      <Link
                        href="/politica-privacidade"
                        className="underline underline-offset-2 hover:text-pili-black"
                      >
                        {t("footer.privacy")}
                      </Link>{" "}
                      {t("trabalhe.consentSuffix")}
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
                    {status === "loading" ? t("forms.sending") : t("trabalhe.submit")}
                  </button>

                  {status === "error" && (
                    <p className="text-sm text-pili-danger">
                      {t("trabalhe.sendError", { email: COMPANY.email })}
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
