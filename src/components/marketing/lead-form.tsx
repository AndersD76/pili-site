"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, type BaseSyntheticEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  leadSchema,
  leadSchemaPtBR,
  type LeadInput,
  type LeadSourceLiteral,
} from "@/lib/validators/lead";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { APPLICATIONS } from "@/lib/constants";
import { registrarEvento } from "@/lib/eventos";
import { CAMPO_ARMADILHA } from "@/lib/armadilha";
import { mascaraTelefoneBR } from "@/lib/telefone";
import { apenasDigitos, cnpjValido, mascaraDocumento } from "@/lib/documento";
import {
  CampoArmadilha,
  lerArmadilha,
} from "@/components/shared/campo-armadilha";

interface LeadFormProps {
  productInterest?: string;
  /**
   * Origem gravada no lead. Tipada pelos valores que o servidor aceita: como
   * `string`, as páginas de contato, orçamento, soluções e obras mandavam
   * "CONTATO", "ORCAMENTO", "SOLUCAO_..." e "CASE_STUDY" desde o lançamento,
   * a API recusava e o visitante via "Ocorreu um erro". A página de origem
   * fica em `pageUrl`.
   */
  source?: LeadSourceLiteral;
  compact?: boolean;
  /** Formulário sobre fundo escuro (seções `bg-pili-black`). */
  dark?: boolean;
  className?: string;
}

/**
 * Opções de "Produto de interesse". Era texto livre e chegou a gravar "Robux".
 *
 * O `valor` fica em português nos dois idiomas: é o que o comercial lê no
 * painel. Só o rótulo é traduzido.
 */
const PRODUTOS_INTERESSE = [
  { valor: "Tombador fixo", chave: "fixo" },
  { valor: "Tombador móvel", chave: "movel" },
  { valor: "Coletor de amostras", chave: "coletor" },
  { valor: "Unidade de transbordo", chave: "transbordo" },
  { valor: "Projeto especial", chave: "especial" },
] as const;

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
  const emPortugues = useLocale() === "pt-BR";
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  /** Razão social achada pelo CNPJ, mostrada embaixo do campo. */
  const [empresaEncontrada, setEmpresaEncontrada] = useState<string | null>(
    null,
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
    setValue,
    getValues,
    setError,
    clearErrors,
  } = useForm<LeadInput>({
    // No site em português o telefone precisa estar no formato brasileiro; em
    // espanhol o número é de outro país e segue livre.
    resolver: zodResolver(emPortugues ? leadSchemaPtBR : leadSchema),
    defaultValues: {
      country: "BR",
      consent: undefined,
      productInterest: productInterest ?? undefined,
    },
  });
  // Select ou campo opcional deixado em branco chega como "". O `z.enum` da
  // aplicação recusa "" e, sem mensagem embaixo do select, o botão parecia não
  // fazer nada para quem não escolhia uma aplicação.
  const vazioComoAusente = { setValueAs: (v: string) => v || undefined };
  const telefone = register("phone");
  const documento = register("cnpj", vazioComoAusente);

  /**
   * Com um CNPJ válido, busca a razão social e preenche a empresa. Só troca o
   * campo se ele estiver vazio ou com o que o próprio preenchimento colocou
   * antes — nunca o que a pessoa digitou.
   */
  async function buscarEmpresa(valor: string) {
    const anterior = empresaEncontrada;
    setEmpresaEncontrada(null);
    const digitos = apenasDigitos(valor);
    if (digitos.length !== 14 || !cnpjValido(digitos)) return;

    try {
      const res = await fetch(`/api/cnpj/${digitos}`);
      const dados = (await res.json()) as {
        status: string;
        razaoSocial?: string;
        encerrada?: boolean;
      };
      if (dados.status === "inexistente") {
        setError("cnpj", { message: t("cnpjNaoEncontrado") });
        return;
      }
      if (dados.status !== "ok" || !dados.razaoSocial) return;
      if (dados.encerrada) {
        setError("cnpj", { message: t("cnpjEncerrado") });
        return;
      }
      clearErrors("cnpj");
      setEmpresaEncontrada(dados.razaoSocial);
      const atual = getValues("company")?.trim();
      if (!atual || atual === anterior) {
        setValue("company", dados.razaoSocial, { shouldValidate: true });
      }
    } catch {
      // Sem resposta o formulário segue sem preencher: o servidor confere de novo.
    }
  }

  async function onSubmit(data: LeadInput, evento?: BaseSyntheticEvent) {
    setStatus("loading");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          source,
          pageUrl: window.location.href,
          [CAMPO_ARMADILHA]: lerArmadilha(evento),
        }),
      });
      // Recusa de validação (telefone, empresa, CNPJ baixado): a mensagem vai
      // para o campo, em vez do "erro ao enviar" genérico que não diz o que
      // corrigir.
      if (res.status === 400) {
        const corpo = (await res.json().catch(() => null)) as {
          issues?: { path?: (string | number)[]; message?: string }[];
        } | null;
        const porCampo = (corpo?.issues ?? []).filter(
          (i) => typeof i.path?.[0] === "string" && i.message,
        );
        if (porCampo.length > 0) {
          for (const i of porCampo) {
            setError(i.path![0] as keyof LeadInput, { message: i.message });
          }
          setStatus("idle");
          return;
        }
      }
      if (!res.ok) throw new Error("Failed");
      registrarEvento("generate_lead", { formulario: source });
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
      className={cn("relative flex flex-col gap-4", className)}
    >
      <CampoArmadilha />
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
            {...telefone}
            // A máscara brasileira só no site em português: na versão em
            // espanhol o número é do Paraguai, da Argentina ou do Uruguai.
            onChange={(e) => {
              if (emPortugues) {
                e.target.value = mascaraTelefoneBR(e.target.value);
              }
              void telefone.onChange(e);
            }}
            placeholder={emPortugues ? "(54) 99999-9999" : undefined}
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

        {/* CPF e CNPJ só existem no Brasil: no site em espanhol o campo some. */}
        {emPortugues && !compact && (
          <div className="space-y-1.5">
            <Label htmlFor="cnpj" className={rotulo}>
              {t("documento")}
            </Label>
            <input
              id="cnpj"
              inputMode="numeric"
              {...documento}
              onChange={(e) => {
                e.target.value = mascaraDocumento(e.target.value);
                void documento.onChange(e);
              }}
              onBlur={(e) => {
                void documento.onBlur(e);
                void buscarEmpresa(e.target.value);
              }}
              className={campo}
            />
            {errors.cnpj ? (
              <p className="text-xs text-pili-danger">{errors.cnpj.message}</p>
            ) : empresaEncontrada ? (
              <p className="text-xs text-pili-success">
                {t("empresaEncontrada", { nome: empresaEncontrada })}
              </p>
            ) : (
              <p
                className={cn(
                  "text-xs",
                  dark ? "text-pili-cement" : "text-pili-concrete",
                )}
              >
                {t("documentoAjuda")}
              </p>
            )}
          </div>
        )}

        {!compact && (
          <>
            <div className="space-y-1.5">
              <Label htmlFor="application" className={rotulo}>
                {t("application")}
              </Label>
              <select
                id="application"
                {...register("application", vazioComoAusente)}
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
              <select
                id="productInterest"
                {...register("productInterest", vazioComoAusente)}
                className={campo}
              >
                <option value="">{t("select")}</option>
                {/* A página de produto já manda o equipamento: ele entra como
                    opção, para não se perder na troca de texto por lista. */}
                {productInterest &&
                  !PRODUTOS_INTERESSE.some(
                    (p) => p.valor === productInterest,
                  ) && (
                    <option value={productInterest}>{productInterest}</option>
                  )}
                {PRODUTOS_INTERESSE.map((p) => (
                  <option key={p.chave} value={p.valor}>
                    {t(`produtos.${p.chave}`)}
                  </option>
                ))}
              </select>
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
