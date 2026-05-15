"use client";

import { useState } from "react";
import { Landmark, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/routing";

const EQUIPMENT_OPTIONS = [
  { label: "Tombador 10m Fixo", value: 280000 },
  { label: "Tombador 12m Fixo", value: 350000 },
  { label: "Tombador 18m Fixo", value: 520000 },
  { label: "Tombador 21m Fixo", value: 680000 },
  { label: "Tombador 26m Fixo", value: 850000 },
  { label: "Tombador 30m Fixo", value: 1200000 },
  { label: "Tombador 10m Móvel", value: 320000 },
  { label: "Tombador 12m Móvel", value: 390000 },
  { label: "Tombador 18m Móvel", value: 580000 },
  { label: "Coletor de Amostras", value: 95000 },
  { label: "Unidade de Transbordo", value: 180000 },
] as const;

const TERM_OPTIONS = [24, 36, 48, 60, 84, 96, 120] as const;

function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function calculatePayment(principal: number, annualRate: number, months: number): number {
  const monthlyRate = annualRate / 12;
  if (monthlyRate === 0) return principal / months;
  return (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
}

export function FinancingSimulator() {
  const [equipment, setEquipment] = useState(0);
  const [percentage, setPercentage] = useState(80);
  const [term, setTerm] = useState(60);
  const [grace, setGrace] = useState(6);
  const [calculated, setCalculated] = useState(false);

  const equipmentValue = EQUIPMENT_OPTIONS[equipment]?.value ?? 0;
  const financedAmount = equipmentValue * (percentage / 100);
  const annualRate = 0.085;
  const monthlyPayment = calculatePayment(financedAmount, annualRate, term);
  const totalPaid = monthlyPayment * term;

  function handleSimulate(e: React.FormEvent) {
    e.preventDefault();
    setCalculated(true);
  }

  return (
    <div id="simulador-financiamento" className="scroll-mt-24">
      <div className="grid gap-0 lg:grid-cols-2">
        {/* Form side */}
        <div className="flex h-full flex-col justify-center bg-pili-black p-10 lg:p-14">
          <div className="flex items-center gap-3">
            <Landmark className="h-8 w-8 text-pili-safety" />
            <span className="font-mono text-xs uppercase tracking-widest text-pili-safety">
              Financiamento BRDE
            </span>
          </div>
          <h2 className="mt-6 font-display text-[length:var(--text-h2)] font-black uppercase leading-tight text-pili-white">
            Simule seu financiamento
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-pili-cement">
            Condições especiais em parceria com o BRDE e outras instituições. Taxas a partir de 8,5% a.a.
          </p>

          <form onSubmit={handleSimulate} className="mt-8 flex flex-col gap-5">
            <div>
              <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-pili-cement">
                Equipamento
              </label>
              <select
                value={equipment}
                onChange={(e) => { setEquipment(Number(e.target.value)); setCalculated(false); }}
                className="w-full border border-pili-iron bg-pili-graphite px-4 py-3 text-sm text-pili-white focus:border-pili-safety focus:outline-none"
              >
                {EQUIPMENT_OPTIONS.map((opt, i) => (
                  <option key={opt.label} value={i}>
                    {opt.label} — {formatCurrency(opt.value)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-pili-cement">
                Percentual financiado: {percentage}%
              </label>
              <input
                type="range"
                min={30}
                max={80}
                step={5}
                value={percentage}
                onChange={(e) => { setPercentage(Number(e.target.value)); setCalculated(false); }}
                className="w-full accent-pili-safety"
              />
              <div className="mt-1 flex justify-between font-mono text-[10px] text-pili-iron">
                <span>30%</span>
                <span>80%</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-pili-cement">
                  Prazo (meses)
                </label>
                <select
                  value={term}
                  onChange={(e) => { setTerm(Number(e.target.value)); setCalculated(false); }}
                  className="w-full border border-pili-iron bg-pili-graphite px-4 py-3 text-sm text-pili-white focus:border-pili-safety focus:outline-none"
                >
                  {TERM_OPTIONS.map((t) => (
                    <option key={t} value={t}>{t} meses</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-pili-cement">
                  Carência (meses)
                </label>
                <select
                  value={grace}
                  onChange={(e) => { setGrace(Number(e.target.value)); setCalculated(false); }}
                  className="w-full border border-pili-iron bg-pili-graphite px-4 py-3 text-sm text-pili-white focus:border-pili-safety focus:outline-none"
                >
                  {[0, 3, 6, 12, 18, 24].map((g) => (
                    <option key={g} value={g}>{g === 0 ? "Sem carência" : `${g} meses`}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="mt-2 inline-flex items-center justify-center gap-2 bg-pili-safety px-8 py-4 text-sm font-bold uppercase tracking-wider text-pili-white transition-all hover:bg-pili-safety-deep"
            >
              Simular
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>

        {/* Result side */}
        <div className="flex flex-col justify-center bg-pili-graphite p-10 lg:p-14">
          {calculated ? (
            <div>
              <span className="font-mono text-[11px] uppercase tracking-widest text-pili-safety">
                Resultado da simulação
              </span>
              <div className="mt-6 space-y-6">
                <div>
                  <span className="font-mono text-[11px] uppercase tracking-wider text-pili-cement">
                    Valor do equipamento
                  </span>
                  <p className="font-display text-2xl font-black text-pili-white">
                    {formatCurrency(equipmentValue)}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <span className="font-mono text-[11px] uppercase tracking-wider text-pili-cement">
                      Entrada ({100 - percentage}%)
                    </span>
                    <p className="font-display text-xl font-bold text-pili-white">
                      {formatCurrency(equipmentValue - financedAmount)}
                    </p>
                  </div>
                  <div>
                    <span className="font-mono text-[11px] uppercase tracking-wider text-pili-cement">
                      Valor financiado
                    </span>
                    <p className="font-display text-xl font-bold text-pili-white">
                      {formatCurrency(financedAmount)}
                    </p>
                  </div>
                </div>

                <div className="border-t border-pili-iron pt-6">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-pili-cement">
                    Parcela estimada ({term}x)
                  </span>
                  <p className="font-display text-4xl font-black text-pili-safety">
                    {formatCurrency(monthlyPayment)}
                    <span className="ml-2 font-mono text-sm font-normal text-pili-cement">/mês</span>
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4 border-t border-pili-iron pt-6">
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-pili-cement">Taxa</span>
                    <p className="font-mono text-sm font-bold text-pili-white">8,5% a.a.</p>
                  </div>
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-pili-cement">Carência</span>
                    <p className="font-mono text-sm font-bold text-pili-white">{grace} meses</p>
                  </div>
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-pili-cement">Total</span>
                    <p className="font-mono text-sm font-bold text-pili-white">{formatCurrency(totalPaid)}</p>
                  </div>
                </div>

                <Link
                  href="/orcamento"
                  className="mt-4 inline-flex items-center gap-2 border border-pili-white px-8 py-4 text-sm font-bold uppercase tracking-wider text-pili-white transition-all hover:bg-pili-white hover:text-pili-black"
                >
                  Solicitar proposta formal
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <p className="mt-4 font-mono text-[10px] leading-relaxed text-pili-iron">
                  * Simulação meramente ilustrativa. Valores finais sujeitos a análise de crédito, aprovação da instituição financeira e condições vigentes. Taxa de 8,5% a.a. referente à linha BRDE para bens de capital.
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <Landmark className="mx-auto h-16 w-16 text-pili-iron" />
              <p className="mt-6 font-display text-lg font-bold uppercase text-pili-cement">
                Configure ao lado e clique em Simular
              </p>
              <div className="mt-8 grid grid-cols-3 gap-6">
                <div className="text-center">
                  <span className="font-display text-3xl font-black text-pili-safety">10</span>
                  <span className="mt-1 block font-mono text-[10px] uppercase tracking-wider text-pili-cement">anos prazo</span>
                </div>
                <div className="text-center">
                  <span className="font-display text-3xl font-black text-pili-safety">80%</span>
                  <span className="mt-1 block font-mono text-[10px] uppercase tracking-wider text-pili-cement">financiável</span>
                </div>
                <div className="text-center">
                  <span className="font-display text-3xl font-black text-pili-safety">8,5%</span>
                  <span className="mt-1 block font-mono text-[10px] uppercase tracking-wider text-pili-cement">a.a. BRDE</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
