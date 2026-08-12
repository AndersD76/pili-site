"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound, Loader2 } from "lucide-react";
import {
  trocarSenha,
  trocaSenhaSchema,
  type TrocaSenhaInput,
} from "@/app/portal/trocar-senha/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PASSWORD_HELP } from "@/lib/validators/user";

export function TrocaSenhaForm({ obrigatoria }: { obrigatoria: boolean }) {
  const router = useRouter();
  const [erro, setErro] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TrocaSenhaInput>({
    resolver: zodResolver(trocaSenhaSchema),
    defaultValues: { atual: "", nova: "", confirmacao: "" },
  });

  function onSubmit(values: TrocaSenhaInput) {
    setErro(null);
    startTransition(async () => {
      const r = await trocarSenha(values);
      if (r.success) {
        // `refresh` revalida a sessão: o token recarrega sem o bloqueio e o
        // portal libera na mesma navegação.
        router.refresh();
        router.push("/portal");
      } else {
        setErro(r.error ?? "Erro ao trocar a senha.");
      }
    });
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5 rounded-lg border border-pili-mist bg-pili-white p-6"
    >
      <div className="flex items-start gap-3">
        <KeyRound className="mt-0.5 h-5 w-5 shrink-0 text-pili-safety" />
        <div>
          <h1 className="font-display text-xl font-bold text-pili-graphite">
            {obrigatoria ? "Defina sua senha" : "Trocar senha"}
          </h1>
          <p className="mt-1 text-sm leading-relaxed text-pili-concrete">
            {obrigatoria
              ? "Sua conta foi criada pela equipe PILI com uma senha provisória. Escolha uma senha própria para continuar."
              : "Escolha uma nova senha de acesso ao portal."}
          </p>
        </div>
      </div>

      {erro && (
        <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {erro}
        </p>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="atual">
          {obrigatoria ? "Senha provisória" : "Senha atual"}
        </Label>
        <Input id="atual" type="password" autoComplete="current-password" {...register("atual")} />
        {errors.atual && (
          <p className="text-xs text-red-600">{errors.atual.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="nova">Nova senha</Label>
        <Input id="nova" type="password" autoComplete="new-password" {...register("nova")} />
        <p className="text-xs text-pili-cement">{PASSWORD_HELP}</p>
        {errors.nova && (
          <p className="text-xs text-red-600">{errors.nova.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="confirmacao">Repita a nova senha</Label>
        <Input
          id="confirmacao"
          type="password"
          autoComplete="new-password"
          {...register("confirmacao")}
        />
        {errors.confirmacao && (
          <p className="text-xs text-red-600">{errors.confirmacao.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
        Salvar senha
      </Button>
    </form>
  );
}
