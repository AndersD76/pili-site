"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "@/i18n/routing";
import {
  calculatorGateSchema,
  type CalculatorGateInput,
} from "@/lib/validators/lead";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator, Lock } from "lucide-react";
import { useTranslations } from "next-intl";

type GrainType = (typeof GRAIN_TYPES)[number];

interface CalcResult {
  model: string;
  capacity: string;
  lengthMeters: number;
  tonnage: number;
  /** Chave em `calculadora.roi` e `calculadora.recommendations`. */
  porte: "compacto" | "medio" | "grande" | "maximo";
}

const GRAIN_TYPES = [
  "soja",
  "milho",
  "trigo",
  "fertilizante",
  "cimento",
] as const;

const GRAIN_DENSITY: Record<GrainType, number> = {
  soja: 0.75,
  milho: 0.72,
  trigo: 0.78,
  fertilizante: 1.1,
  cimento: 1.5,
};

/**
 * O resultado devolve chaves, não frases: as descrições e as faixas de ROI
 * estavam escritas em português dentro da função e apareciam em português
 * mesmo com o site em espanhol.
 */
function calculateRecommendation(
  trucksPerDay: number,
  grainType: GrainType,
): CalcResult {
  const density = GRAIN_DENSITY[grainType];
  const dailyTonnage = trucksPerDay * 30 * density;

  if (dailyTonnage <= 500) {
    return {
      model: "PILI T-9000",
      capacity: "35t",
      lengthMeters: 9,
      tonnage: dailyTonnage,
      porte: "compacto",
    };
  }
  if (dailyTonnage <= 1200) {
    return {
      model: "PILI T-15000",
      capacity: "60t",
      lengthMeters: 15,
      tonnage: dailyTonnage,
      porte: "medio",
    };
  }
  if (dailyTonnage <= 2500) {
    return {
      model: "PILI T-22000",
      capacity: "80t",
      lengthMeters: 22,
      tonnage: dailyTonnage,
      porte: "grande",
    };
  }
  return {
    model: "PILI T-30000",
    capacity: "100t",
    lengthMeters: 30,
    tonnage: dailyTonnage,
    porte: "maximo",
  };
}

export default function CalculadoraPage() {
  const t = useTranslations();
  const [trucksPerDay, setTrucksPerDay] = useState<string>("");
  const [grainType, setGrainType] = useState<GrainType>("soja");
  const [waitDistance, setWaitDistance] = useState<string>("");
  const [result, setResult] = useState<CalcResult | null>(null);
  const [trucksError, setTrucksError] = useState<string | null>(null);
  const [unlocked, setUnlocked] = useState(false);
  const [gateStatus, setGateStatus] = useState<"idle" | "loading" | "error">(
    "idle"
  );

  const {
    register: registerGate,
    handleSubmit: handleGateSubmit,
    formState: { errors: gateErrors },
  } = useForm<CalculatorGateInput>({
    resolver: zodResolver(calculatorGateSchema),
    defaultValues: { email: "" },
  });

  function handleCalculate(e: React.FormEvent) {
    e.preventDefault();
    const trucks = parseInt(trucksPerDay, 10);
    if (!trucks || trucks <= 0) {
      setTrucksError(t("calculadora.trucksError"));
      return;
    }

    setTrucksError(null);
    const recommendation = calculateRecommendation(trucks, grainType);
    setResult(recommendation);
    setUnlocked(false);
  }

  async function onUnlock(values: CalculatorGateInput) {
    setGateStatus("loading");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Lead da calculadora",
          email: values.email,
          company: t("calculadora.notInformed"),
          consent: values.consent,
          source: "CALCULADORA",
          productInterest: result?.model,
          grainType,
          pageUrl: window.location.href,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      setUnlocked(true);
    } catch {
      setGateStatus("error");
    }
  }

  return (
    <main className="pt-[var(--header-height)]">
      {/* Hero */}
      <section className="bg-pili-black py-20 px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h1 className="font-display text-[length:var(--text-display-2)] font-black uppercase text-pili-white">
            {t("calculadora.title")}
          </h1>
          <p className="mt-4 max-w-2xl text-pili-cement">
            {t("calculadora.intro")}
          </p>
        </div>
      </section>

      <section className="py-16 px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Calculator form */}
            <div className="border border-pili-mist p-8">
              <div className="flex items-center gap-3">
                <Calculator className="h-8 w-8 text-pili-safety" />
                <h2 className="font-display text-xl font-bold uppercase text-pili-black">
                  {t("calculadora.operationData")}
                </h2>
              </div>

              <form
                onSubmit={handleCalculate}
                className="mt-8 flex flex-col gap-6"
              >
                <div>
                  <Label htmlFor="trucks">{t("calculadora.trucksPerDay")} *</Label>
                  <Input
                    id="trucks"
                    type="number"
                    min="1"
                    max="1000"
                    placeholder={t("calculadora.trucksPlaceholder")}
                    value={trucksPerDay}
                    onChange={(e) => setTrucksPerDay(e.target.value)}
                  />
                  {trucksError && (
                    <p className="mt-1 text-xs text-pili-danger">
                      {trucksError}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="grain">{t("calculadora.productType")} *</Label>
                  <select
                    id="grain"
                    value={grainType}
                    onChange={(e) => setGrainType(e.target.value as GrainType)}
                    className="flex h-10 w-full border border-pili-mist bg-pili-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pili-safety"
                  >
                    {GRAIN_TYPES.map((key) => (
                      <option key={key} value={key}>
                        {t(`calculadora.grains.${key}`)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="distance">
                    {t("calculadora.waitDistance")}
                  </Label>
                  <Input
                    id="distance"
                    type="number"
                    min="0"
                    step="0.1"
                    placeholder={t("calculadora.distancePlaceholder")}
                    value={waitDistance}
                    onChange={(e) => setWaitDistance(e.target.value)}
                  />
                  <p className="mt-1 text-xs text-pili-cement">
                    {t("calculadora.waitDistanceHelp")}
                  </p>
                </div>

                <button
                  type="submit"
                  className="self-start bg-pili-safety px-8 py-3 text-sm font-semibold uppercase tracking-wider text-pili-white transition-colors hover:bg-pili-safety-deep"
                >
                  {t("calculadora.calculate")}
                </button>
              </form>
            </div>

            {/* Result */}
            <div>
              {result ? (
                <div className="border border-pili-mist p-8">
                  <h2 className="font-display text-xl font-bold uppercase text-pili-black">
                    {t("calculadora.recommended")}
                  </h2>

                  <div className="mt-6 space-y-4">
                    <div className="bg-pili-paper p-6">
                      <span className="font-display text-2xl font-black uppercase text-pili-black">
                        {result.model}
                      </span>
                      <div className="mt-3 grid grid-cols-2 gap-4">
                        <div>
                          <span className="font-mono text-[10px] uppercase tracking-wider text-pili-cement">
                            {t("calculadora.capacity")}
                          </span>
                          <p className="font-mono text-sm font-bold text-pili-black">
                            {result.capacity}
                          </p>
                        </div>
                        <div>
                          <span className="font-mono text-[10px] uppercase tracking-wider text-pili-cement">
                            {t("calculadora.length")}
                          </span>
                          <p className="font-mono text-sm font-bold text-pili-black">
                            {t("calculadora.meters", { n: result.lengthMeters })}
                          </p>
                        </div>
                        <div>
                          <span className="font-mono text-[10px] uppercase tracking-wider text-pili-cement">
                            {t("calculadora.estimatedFlow")}
                          </span>
                          <p className="font-mono text-sm font-bold text-pili-black">
                            {t("calculadora.perDay", {
                              tons: Math.round(result.tonnage),
                            })}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Gated ROI section */}
                    {unlocked ? (
                      <div className="border border-pili-success/30 bg-pili-success/5 p-6">
                        <h3 className="font-display text-sm font-bold uppercase text-pili-black">
                          {t("calculadora.roiEstimate")}
                        </h3>
                        <p className="mt-2 font-display text-2xl font-black text-pili-success">
                          {t(`calculadora.roi.${result.porte}`)}
                        </p>
                        <p className="mt-3 text-sm leading-relaxed text-pili-concrete">
                          {t(`calculadora.recommendations.${result.porte}`)}
                        </p>
                        <Link
                          href="/orcamento"
                          className="mt-4 inline-block bg-pili-safety px-6 py-3 text-sm font-semibold uppercase tracking-wider text-pili-white transition-colors hover:bg-pili-safety-deep"
                        >
                          {t("common.requestQuote")}
                        </Link>
                      </div>
                    ) : (
                      <div className="border border-pili-mist bg-pili-paper p-6">
                        <div className="flex items-center gap-2">
                          <Lock className="h-4 w-4 text-pili-concrete" />
                          <h3 className="font-display text-sm font-bold uppercase text-pili-black">
                            {t("calculadora.locked")}
                          </h3>
                        </div>
                        <p className="mt-2 text-sm text-pili-concrete">
                          {t("calculadora.lockedText")}
                        </p>
                        <form
                          onSubmit={handleGateSubmit(onUnlock)}
                          className="mt-4 flex flex-col gap-3"
                        >
                          <div className="flex gap-2">
                            <div className="flex-1">
                              <Label htmlFor="calc-email" className="sr-only">
                                {t("forms.email")}
                              </Label>
                              <Input
                                id="calc-email"
                                type="email"
                                placeholder={t("calculadora.emailPlaceholder")}
                                {...registerGate("email")}
                              />
                            </div>
                            <button
                              type="submit"
                              disabled={gateStatus === "loading"}
                              className="h-10 shrink-0 bg-pili-safety px-6 text-xs font-semibold uppercase tracking-wider text-pili-white transition-colors hover:bg-pili-safety-deep disabled:opacity-50"
                            >
                              {gateStatus === "loading"
                                ? "..."
                                : t("calculadora.seeResult")}
                            </button>
                          </div>
                          {gateErrors.email && (
                            <p className="text-xs text-pili-danger">
                              {gateErrors.email.message}
                            </p>
                          )}

                          <div className="flex items-start gap-2">
                            <input
                              type="checkbox"
                              id="calc-consent"
                              {...registerGate("consent")}
                              className="mt-0.5 h-4 w-4 accent-pili-safety"
                            />
                            <Label
                              htmlFor="calc-consent"
                              className="text-xs font-normal text-pili-concrete"
                            >
                              {t("calculadora.consentPrefix")}{" "}
                              <Link
                                href="/politica-privacidade"
                                className="underline underline-offset-2 hover:text-pili-black"
                              >
                                {t("footer.privacy")}
                              </Link>{" "}
                              {t("calculadora.consentSuffix")}
                            </Label>
                          </div>
                          {gateErrors.consent && (
                            <p className="text-xs text-pili-danger">
                              {gateErrors.consent.message}
                            </p>
                          )}
                        </form>
                        {gateStatus === "error" && (
                          <p className="mt-2 text-xs text-pili-danger">
                            {t("calculadora.sendError")}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex h-full items-center justify-center border border-dashed border-pili-mist p-8">
                  <div className="text-center">
                    <Calculator className="mx-auto h-12 w-12 text-pili-mist" />
                    <p className="mt-4 text-sm text-pili-cement">
                      {t("calculadora.emptyState")}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="bg-pili-paper py-10 px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <p className="font-mono text-xs leading-relaxed text-pili-cement">
            {t("calculadora.disclaimer")}
          </p>
        </div>
      </section>
    </main>
  );
}
