"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Calculator, Lock, Ruler, Weight, Timer, Info } from "lucide-react";
import { Link } from "@/i18n/routing";
import {
  calculatorGateSchema,
  type CalculatorGateInput,
} from "@/lib/validators/lead";
import {
  recomendar,
  VEICULOS,
  DENSIDADE,
  MANOBRA_S,
  type Tombador,
  type TipoVeiculo,
  type TipoProduto,
  type Recomendacao,
} from "@/lib/calculadora";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const VEICULOS_ORDEM: TipoVeiculo[] = [
  "caminhao",
  "carreta",
  "bitrem",
  "rodotrem",
];

const PRODUTOS_ORDEM: TipoProduto[] = [
  "soja",
  "milho",
  "trigo",
  "fertilizante",
  "cimento",
];

const CAMPO =
  "flex h-10 w-full border border-pili-mist bg-pili-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pili-safety";

function arredondar(n: number, casas = 0) {
  const f = 10 ** casas;
  return Math.round(n * f) / f;
}

/**
 * Calculadora de dimensionamento.
 *
 * Os modelos vêm do catálogo cadastrado no painel, não de uma lista escrita no
 * código. A conta é mostrada passo a passo: o visitante precisa poder conferir
 * de onde saiu o número, e discordar das premissas se a operação dele for
 * diferente.
 */
export function CalculadoraForm({ tombadores }: { tombadores: Tombador[] }) {
  const t = useTranslations();

  const [veiculo, setVeiculo] = useState<TipoVeiculo>("carreta");
  const [produto, setProduto] = useState<TipoProduto>("soja");
  const [veiculosPorDia, setVeiculosPorDia] = useState("");
  const [horasPorDia, setHorasPorDia] = useState("10");
  const [erro, setErro] = useState<string | null>(null);
  const [resultado, setResultado] = useState<Recomendacao | null>(null);
  const [liberado, setLiberado] = useState(false);
  const [gateStatus, setGateStatus] = useState<"idle" | "loading" | "error">(
    "idle",
  );

  const {
    register: registerGate,
    handleSubmit: handleGateSubmit,
    formState: { errors: gateErrors },
  } = useForm<CalculatorGateInput>({
    resolver: zodResolver(calculatorGateSchema),
    defaultValues: { email: "" },
  });

  function calcular(e: React.FormEvent) {
    e.preventDefault();

    const qtd = parseInt(veiculosPorDia, 10);
    if (!qtd || qtd <= 0) {
      setErro(t("calculadora.trucksError"));
      return;
    }
    const horas = parseInt(horasPorDia, 10) || 10;

    setErro(null);
    setResultado(
      recomendar(tombadores, {
        veiculo,
        produto,
        veiculosPorDia: qtd,
        horasPorDia: horas,
      }),
    );
    setLiberado(false);
  }

  async function liberar(values: CalculatorGateInput) {
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
          productInterest: resultado?.tombador.nome,
          grainType: produto,
          pageUrl: window.location.href,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      setLiberado(true);
    } catch {
      setGateStatus("error");
    }
  }

  const dadosVeiculo = VEICULOS[veiculo];

  return (
    <div className="grid gap-12 lg:grid-cols-2">
      {/* ---------------- Formulário ---------------- */}
      <div className="border border-pili-mist p-8">
        <div className="flex items-center gap-3">
          <Calculator className="h-8 w-8 text-pili-safety" />
          <h2 className="font-display text-xl font-bold uppercase text-pili-black">
            {t("calculadora.operationData")}
          </h2>
        </div>

        <form onSubmit={calcular} className="mt-8 flex flex-col gap-6">
          <div>
            <Label htmlFor="veiculo">{t("calculadora.vehicleType")} *</Label>
            <select
              id="veiculo"
              value={veiculo}
              onChange={(e) => setVeiculo(e.target.value as TipoVeiculo)}
              className={CAMPO}
            >
              {VEICULOS_ORDEM.map((v) => (
                <option key={v} value={v}>
                  {t(`calculadora.vehicles.${v}`)}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-pili-cement">
              {t("calculadora.vehicleHelp", {
                comprimento: dadosVeiculo.comprimentoM,
                pbtc: dadosVeiculo.pbtcT,
              })}
            </p>
          </div>

          <div>
            <Label htmlFor="qtd">{t("calculadora.trucksPerDay")} *</Label>
            <Input
              id="qtd"
              type="number"
              min="1"
              max="1000"
              placeholder={t("calculadora.trucksPlaceholder")}
              value={veiculosPorDia}
              onChange={(e) => setVeiculosPorDia(e.target.value)}
            />
            {erro && <p className="mt-1 text-xs text-pili-danger">{erro}</p>}
          </div>

          <div>
            <Label htmlFor="produto">{t("calculadora.productType")} *</Label>
            <select
              id="produto"
              value={produto}
              onChange={(e) => setProduto(e.target.value as TipoProduto)}
              className={CAMPO}
            >
              {PRODUTOS_ORDEM.map((p) => (
                <option key={p} value={p}>
                  {t(`calculadora.grains.${p}`)}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-pili-cement">
              {t("calculadora.densityHelp", { d: DENSIDADE[produto] })}
            </p>
          </div>

          <div>
            <Label htmlFor="horas">{t("calculadora.hoursPerDay")}</Label>
            <Input
              id="horas"
              type="number"
              min="1"
              max="24"
              value={horasPorDia}
              onChange={(e) => setHorasPorDia(e.target.value)}
            />
            <p className="mt-1 text-xs text-pili-cement">
              {t("calculadora.hoursHelp")}
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

      {/* ---------------- Resultado ---------------- */}
      <div>
        {resultado ? (
          <div className="space-y-4 border border-pili-mist p-8">
            <h2 className="font-display text-xl font-bold uppercase text-pili-black">
              {t("calculadora.recommended")}
            </h2>

            <div className="bg-pili-paper p-6">
              <span className="font-display text-2xl font-black uppercase text-pili-black">
                {resultado.tombador.nome}
              </span>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <Dado
                  icone={<Weight className="h-3.5 w-3.5" />}
                  rotulo={t("calculadora.capacity")}
                  valor={t("calculadora.tons", {
                    n: resultado.tombador.capacidadeT,
                  })}
                />
                <Dado
                  icone={<Ruler className="h-3.5 w-3.5" />}
                  rotulo={t("calculadora.length")}
                  valor={t("calculadora.meters", {
                    n: resultado.tombador.comprimentoM,
                  })}
                />
                <Dado
                  icone={<Timer className="h-3.5 w-3.5" />}
                  rotulo={t("calculadora.cycle")}
                  valor={t("calculadora.seconds", {
                    n: resultado.tombador.cicloS,
                  })}
                />
                <Dado
                  rotulo={t("calculadora.estimatedFlow")}
                  valor={t("calculadora.perDay", {
                    tons: arredondar(resultado.toneladasPorDia),
                  })}
                />
              </div>

              <Link
                href={`/produtos/${resultado.tombador.slug}`}
                className="mt-5 inline-block text-sm font-semibold uppercase tracking-wider text-pili-safety underline underline-offset-4 hover:text-pili-safety-deep"
              >
                {t("calculadora.seeModel")}
              </Link>
            </div>

            {/* Por que este modelo */}
            <div className="border border-pili-mist p-6">
              <h3 className="flex items-center gap-2 font-display text-sm font-bold uppercase text-pili-black">
                <Info className="h-4 w-4 text-pili-safety" />
                {t("calculadora.whyTitle")}
              </h3>

              {resultado.acimaDoCatalogo ? (
                <p className="mt-3 text-sm leading-relaxed text-pili-concrete">
                  {t("calculadora.whyAboveCatalog", {
                    veiculo: t(`calculadora.vehicles.${veiculo}`),
                    comprimento: resultado.veiculo.comprimentoM,
                    pbtc: resultado.veiculo.pbtcT,
                  })}
                </p>
              ) : (
                <ul className="mt-3 space-y-2 text-sm leading-relaxed text-pili-concrete">
                  <li>
                    {t("calculadora.whyLength", {
                      veiculo: t(`calculadora.vehicles.${veiculo}`),
                      veiculoM: resultado.veiculo.comprimentoM,
                      plataformaM: resultado.tombador.comprimentoM,
                    })}
                  </li>
                  <li>
                    {t("calculadora.whyWeight", {
                      pbtc: resultado.veiculo.pbtcT,
                      capacidade: resultado.tombador.capacidadeT,
                    })}
                  </li>
                  <li>{t("calculadora.whySmallest")}</li>
                </ul>
              )}
            </div>

            {/* Como chegamos nesse número */}
            <details className="border border-pili-mist p-6">
              <summary className="cursor-pointer font-display text-sm font-bold uppercase text-pili-black">
                {t("calculadora.howTitle")}
              </summary>

              <ol className="mt-4 space-y-3 text-sm leading-relaxed text-pili-concrete">
                <li>
                  <strong className="text-pili-black">1.</strong>{" "}
                  {t("calculadora.step1", {
                    volume: resultado.veiculo.volumeM3,
                    densidade: DENSIDADE[produto],
                    toneladas: arredondar(resultado.toneladasPorVeiculo, 1),
                  })}
                </li>
                <li>
                  <strong className="text-pili-black">2.</strong>{" "}
                  {t("calculadora.step2", {
                    toneladas: arredondar(resultado.toneladasPorVeiculo, 1),
                    veiculos: parseInt(veiculosPorDia, 10),
                    total: arredondar(resultado.toneladasPorDia),
                  })}
                </li>
                <li>
                  <strong className="text-pili-black">3.</strong>{" "}
                  {t("calculadora.step3", {
                    ciclo: resultado.tombador.cicloS,
                    manobra: MANOBRA_S,
                    porHora: arredondar(resultado.veiculosPorHora, 1),
                  })}
                </li>
                <li>
                  <strong className="text-pili-black">4.</strong>{" "}
                  {t("calculadora.step4", {
                    horas: arredondar(resultado.horasNecessarias, 1),
                    jornada: parseInt(horasPorDia, 10) || 10,
                  })}
                </li>
              </ol>

              <p
                className={`mt-4 text-sm font-semibold ${
                  resultado.cabeNaJornada
                    ? "text-pili-success"
                    : "text-pili-warning"
                }`}
              >
                {resultado.cabeNaJornada
                  ? t("calculadora.fitsShift")
                  : t("calculadora.doesNotFitShift")}
              </p>
            </details>

            {/* Contato */}
            {liberado ? (
              <div className="border border-pili-success/30 bg-pili-success/5 p-6">
                <h3 className="font-display text-sm font-bold uppercase text-pili-black">
                  {t("calculadora.contactSentTitle")}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-pili-concrete">
                  {t("calculadora.contactSentText")}
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
                    {t("calculadora.contactTitle")}
                  </h3>
                </div>
                <p className="mt-2 text-sm text-pili-concrete">
                  {t("calculadora.contactText")}
                </p>

                <form
                  onSubmit={handleGateSubmit(liberar)}
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
                        : t("calculadora.sendContact")}
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
  );
}

function Dado({
  icone,
  rotulo,
  valor,
}: {
  icone?: React.ReactNode;
  rotulo: string;
  valor: string;
}) {
  return (
    <div>
      <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-pili-cement">
        {icone}
        {rotulo}
      </span>
      <p className="mt-0.5 font-mono text-sm font-bold text-pili-black">
        {valor}
      </p>
    </div>
  );
}
