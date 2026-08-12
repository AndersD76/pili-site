"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ShieldCheck, Award, Clock, FileCheck, CheckCircle2 } from "lucide-react";
import { Link } from "@/i18n/routing";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

/**
 * Selo, ícone e quantidade de itens de cada certificação.
 *
 * A faixa era só decorativa: quatro selos sem nada por trás. Quem quisesse
 * saber o que "NR-12" significa na prática precisava adivinhar ou procurar a
 * página de certificações. Agora cada selo abre o conteúdo que já existe lá.
 */
const CERTS = [
  { icon: ShieldCheck, label: "ISO 9001", key: "iso", itens: 5 },
  { icon: FileCheck, label: "NR-12", key: "nr12", itens: 5 },
  { icon: Award, label: "NR-10", key: "nr10", itens: 5 },
  { icon: Clock, label: "5 anos", key: "garantia", itens: 5 },
] as const;

type Cert = (typeof CERTS)[number];

export function CertificationsBand() {
  const t = useTranslations();
  const [aberta, setAberta] = useState<Cert | null>(null);

  return (
    <section className="bg-pili-white py-16 px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {CERTS.map((cert) => (
            <button
              key={cert.key}
              type="button"
              onClick={() => setAberta(cert)}
              className="group flex flex-col items-center text-center transition-colors"
            >
              <cert.icon className="h-10 w-10 text-pili-iron transition-colors group-hover:text-pili-safety" />
              <span className="mt-3 font-display text-lg font-bold uppercase text-pili-black">
                {cert.label}
              </span>
              <span className="mt-1 text-sm text-pili-concrete">
                {cert.key === "garantia"
                  ? t("certificacoes.garantia.subtitle")
                  : t(`certBand.${cert.key}`)}
              </span>
              <span className="mt-2 text-xs font-semibold uppercase tracking-wider text-pili-safety opacity-0 transition-opacity group-hover:opacity-100">
                {t("certificacoes.verDetalhes")}
              </span>
            </button>
          ))}
        </div>
      </div>

      <Dialog open={aberta !== null} onOpenChange={(o) => !o && setAberta(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          {aberta && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <aberta.icon className="h-8 w-8 shrink-0 text-pili-safety" />
                  <div className="text-left">
                    <DialogTitle className="font-display text-xl font-bold uppercase">
                      {aberta.label}
                    </DialogTitle>
                    <DialogDescription className="font-mono text-xs uppercase tracking-wider">
                      {t(`certificacoes.${aberta.key}.subtitle`)}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              {/* A ISO 9001 abre com a política e os objetivos da qualidade —
                  é o documento que a norma exige que seja público. */}
              {aberta.key === "iso" && (
                <div className="border-l-2 border-pili-safety bg-pili-paper p-4">
                  <h3 className="font-display text-sm font-bold uppercase text-pili-black">
                    {t("certificacoes.iso.politicaTitulo")}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-pili-iron">
                    {t("certificacoes.iso.politica")}
                  </p>

                  <h3 className="mt-5 font-display text-sm font-bold uppercase text-pili-black">
                    {t("certificacoes.iso.objetivosTitulo")}
                  </h3>
                  <ul className="mt-2 space-y-1.5">
                    {(["o1", "o2", "o3", "o4"] as const).map((chave) => (
                      <li
                        key={chave}
                        className="flex gap-2 text-sm text-pili-iron"
                      >
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-pili-safety" />
                        {t(`certificacoes.iso.${chave}`)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <ul className="space-y-2.5">
                {Array.from({ length: aberta.itens }, (_, i) => (
                  <li
                    key={i}
                    className="flex gap-3 text-sm leading-relaxed text-pili-concrete"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-pili-success" />
                    {t(`certificacoes.${aberta.key}.i${i + 1}`)}
                  </li>
                ))}
              </ul>

              <Link
                href="/certificacoes"
                onClick={() => setAberta(null)}
                className="text-sm font-semibold uppercase tracking-wider text-pili-safety underline-offset-4 hover:underline"
              >
                {t("certificacoes.verPagina")}
              </Link>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
