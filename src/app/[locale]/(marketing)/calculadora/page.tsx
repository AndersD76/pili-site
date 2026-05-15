"use client";

import { useState } from "react";
import { Link } from "@/i18n/routing";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator, Lock } from "lucide-react";

type GrainType = "soja" | "milho" | "trigo" | "fertilizante" | "cimento";

interface CalcResult {
  model: string;
  capacity: string;
  length: string;
  throughput: string;
  estimatedROI: string;
  description: string;
}

const GRAIN_LABELS: Record<GrainType, string> = {
  soja: "Soja",
  milho: "Milho",
  trigo: "Trigo",
  fertilizante: "Fertilizante",
  cimento: "Cimento",
};

const GRAIN_DENSITY: Record<GrainType, number> = {
  soja: 0.75,
  milho: 0.72,
  trigo: 0.78,
  fertilizante: 1.1,
  cimento: 1.5,
};

function calculateRecommendation(
  trucksPerDay: number,
  grainType: GrainType
): CalcResult {
  const density = GRAIN_DENSITY[grainType];
  const avgLoadTons = 30 * density;
  const dailyTonnage = trucksPerDay * avgLoadTons;

  if (dailyTonnage <= 500) {
    return {
      model: "PILI T-9000",
      capacity: "35t",
      length: "9 metros",
      throughput: `${Math.round(dailyTonnage)} t/dia`,
      estimatedROI: "18 a 24 meses",
      description:
        "Tombador compacto ideal para cooperativas e unidades de menor volume. Alta confiabilidade e manutenção simplificada.",
    };
  }

  if (dailyTonnage <= 1200) {
    return {
      model: "PILI T-15000",
      capacity: "60t",
      length: "15 metros",
      throughput: `${Math.round(dailyTonnage)} t/dia`,
      estimatedROI: "14 a 18 meses",
      description:
        "Tombador de porte médio para operações de fluxo moderado. Compatível com carretas graneleiras padrão e bitrens.",
    };
  }

  if (dailyTonnage <= 2500) {
    return {
      model: "PILI T-22000",
      capacity: "80t",
      length: "22 metros",
      throughput: `${Math.round(dailyTonnage)} t/dia`,
      estimatedROI: "10 a 14 meses",
      description:
        "Tombador de grande porte para terminais portuários e cooperativas de alto volume. Aceita rodotrens e treminhões.",
    };
  }

  return {
    model: "PILI T-30000",
    capacity: "100t",
    length: "30 metros",
    throughput: `${Math.round(dailyTonnage)} t/dia`,
    estimatedROI: "8 a 12 meses",
    description:
      "Tombador de capacidade máxima para portos de grande escala. Projetado para operação contínua 24/7 com os maiores rodotrens do mercado.",
  };
}

export default function CalculadoraPage() {
  const [trucksPerDay, setTrucksPerDay] = useState<string>("");
  const [grainType, setGrainType] = useState<GrainType>("soja");
  const [waitDistance, setWaitDistance] = useState<string>("");
  const [result, setResult] = useState<CalcResult | null>(null);
  const [email, setEmail] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [gateStatus, setGateStatus] = useState<"idle" | "loading" | "error">(
    "idle"
  );

  function handleCalculate(e: React.FormEvent) {
    e.preventDefault();
    const trucks = parseInt(trucksPerDay, 10);
    if (!trucks || trucks <= 0) return;

    const recommendation = calculateRecommendation(trucks, grainType);
    setResult(recommendation);
    setUnlocked(false);
  }

  async function handleUnlock(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;

    setGateStatus("loading");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Calculadora",
          email,
          phone: "N/A",
          company: "N/A",
          consent: true,
          source: "CALCULADORA",
          productInterest: result?.model,
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
            Calculadora de capacidade
          </h1>
          <p className="mt-4 max-w-2xl text-pili-cement">
            Informe os dados da sua operação e descubra qual tombador PILI é o
            mais adequado para o seu projeto. Cálculo baseado em volume diário,
            tipo de produto e distância de espera.
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
                  Dados da operação
                </h2>
              </div>

              <form
                onSubmit={handleCalculate}
                className="mt-8 flex flex-col gap-6"
              >
                <div>
                  <Label htmlFor="trucks">Caminhões por dia *</Label>
                  <Input
                    id="trucks"
                    type="number"
                    min="1"
                    max="1000"
                    placeholder="Ex: 80"
                    value={trucksPerDay}
                    onChange={(e) => setTrucksPerDay(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="grain">Tipo de produto *</Label>
                  <select
                    id="grain"
                    value={grainType}
                    onChange={(e) => setGrainType(e.target.value as GrainType)}
                    className="flex h-10 w-full border border-pili-mist bg-pili-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pili-safety"
                  >
                    {Object.entries(GRAIN_LABELS).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="distance">
                    Distância média de espera (km)
                  </Label>
                  <Input
                    id="distance"
                    type="number"
                    min="0"
                    step="0.1"
                    placeholder="Ex: 5"
                    value={waitDistance}
                    onChange={(e) => setWaitDistance(e.target.value)}
                  />
                  <p className="mt-1 text-xs text-pili-cement">
                    Distância entre o ponto de espera e o tombador.
                  </p>
                </div>

                <button
                  type="submit"
                  className="self-start bg-pili-safety px-8 py-3 text-sm font-semibold uppercase tracking-wider text-pili-white transition-colors hover:bg-pili-safety-deep"
                >
                  Calcular
                </button>
              </form>
            </div>

            {/* Result */}
            <div>
              {result ? (
                <div className="border border-pili-mist p-8">
                  <h2 className="font-display text-xl font-bold uppercase text-pili-black">
                    Modelo recomendado
                  </h2>

                  <div className="mt-6 space-y-4">
                    <div className="bg-pili-paper p-6">
                      <span className="font-display text-2xl font-black uppercase text-pili-black">
                        {result.model}
                      </span>
                      <div className="mt-3 grid grid-cols-2 gap-4">
                        <div>
                          <span className="font-mono text-[10px] uppercase tracking-wider text-pili-cement">
                            Capacidade
                          </span>
                          <p className="font-mono text-sm font-bold text-pili-black">
                            {result.capacity}
                          </p>
                        </div>
                        <div>
                          <span className="font-mono text-[10px] uppercase tracking-wider text-pili-cement">
                            Comprimento
                          </span>
                          <p className="font-mono text-sm font-bold text-pili-black">
                            {result.length}
                          </p>
                        </div>
                        <div>
                          <span className="font-mono text-[10px] uppercase tracking-wider text-pili-cement">
                            Vazão estimada
                          </span>
                          <p className="font-mono text-sm font-bold text-pili-black">
                            {result.throughput}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Gated ROI section */}
                    {unlocked ? (
                      <div className="border border-pili-success/30 bg-pili-success/5 p-6">
                        <h3 className="font-display text-sm font-bold uppercase text-pili-black">
                          Estimativa de ROI
                        </h3>
                        <p className="mt-2 font-display text-2xl font-black text-pili-success">
                          {result.estimatedROI}
                        </p>
                        <p className="mt-3 text-sm leading-relaxed text-pili-concrete">
                          {result.description}
                        </p>
                        <Link
                          href="/orcamento"
                          className="mt-4 inline-block bg-pili-safety px-6 py-3 text-sm font-semibold uppercase tracking-wider text-pili-white transition-colors hover:bg-pili-safety-deep"
                        >
                          Solicitar orçamento
                        </Link>
                      </div>
                    ) : (
                      <div className="border border-pili-mist bg-pili-paper p-6">
                        <div className="flex items-center gap-2">
                          <Lock className="h-4 w-4 text-pili-concrete" />
                          <h3 className="font-display text-sm font-bold uppercase text-pili-black">
                            ROI e detalhes completos
                          </h3>
                        </div>
                        <p className="mt-2 text-sm text-pili-concrete">
                          Informe seu e-mail para ver a estimativa de retorno e
                          descrição detalhada do equipamento.
                        </p>
                        <form
                          onSubmit={handleUnlock}
                          className="mt-4 flex gap-2"
                        >
                          <Input
                            type="email"
                            placeholder="seu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="flex-1"
                          />
                          <button
                            type="submit"
                            disabled={gateStatus === "loading"}
                            className="shrink-0 bg-pili-safety px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-pili-white transition-colors hover:bg-pili-safety-deep disabled:opacity-50"
                          >
                            {gateStatus === "loading"
                              ? "..."
                              : "Ver resultado"}
                          </button>
                        </form>
                        {gateStatus === "error" && (
                          <p className="mt-2 text-xs text-pili-danger">
                            Erro ao enviar. Tente novamente.
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
                      Preencha os dados da operação e clique em &quot;Calcular&quot;
                      para ver o modelo recomendado.
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
            * Os valores apresentados são estimativas baseadas em parâmetros
            médios de operação. O dimensionamento definitivo deve ser realizado
            pela equipe de engenharia da PILI considerando as condições
            específicas do projeto, tipo de solo, infraestrutura existente e
            normas locais. Entre em contato para um estudo técnico completo.
          </p>
        </div>
      </section>
    </main>
  );
}
