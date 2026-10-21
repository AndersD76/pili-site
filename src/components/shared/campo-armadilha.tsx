"use client";

import { useId, type BaseSyntheticEvent } from "react";
import { CAMPO_ARMADILHA } from "@/lib/armadilha";

/**
 * Campo honeypot: invisível para pessoas, visível para robôs.
 *
 * Fica fora da tela em vez de `display: none` ou `hidden`: parte dos robôs
 * ignora campos marcados como ocultos e só preenche os que parecem reais.
 * `aria-hidden` tira o campo dos leitores de tela, para que quem navega por
 * eles não o preencha por engano, e `tabIndex={-1}` o tira do Tab.
 *
 * É um campo não controlado, lido no envio por `lerArmadilha`. Com `ref` o
 * lint do React Compiler acusa leitura durante a renderização, porque não
 * consegue provar que o `handleSubmit(onSubmit)` só lê o valor depois.
 */
export function CampoArmadilha() {
  // Uma página pode ter mais de um formulário; o `name` se repete sem problema,
  // o `id` não pode.
  const id = useId();
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -left-[9999px] top-auto h-px w-px overflow-hidden"
    >
      <label htmlFor={id}>Deixe este campo em branco</label>
      <input
        id={id}
        name={CAMPO_ARMADILHA}
        type="text"
        tabIndex={-1}
        autoComplete="off"
        defaultValue=""
      />
    </div>
  );
}

/**
 * Valor do honeypot no momento do envio, lido do próprio formulário.
 *
 * Recebe o evento que o `handleSubmit` do react-hook-form repassa como segundo
 * argumento. Sem evento ou sem formulário, devolve vazio: o servidor trata
 * vazio como envio de pessoa, que é o lado seguro do erro.
 */
export function lerArmadilha(evento?: BaseSyntheticEvent): string {
  const form = evento?.target;
  if (!(form instanceof HTMLFormElement)) return "";
  const valor = new FormData(form).get(CAMPO_ARMADILHA);
  return typeof valor === "string" ? valor : "";
}
