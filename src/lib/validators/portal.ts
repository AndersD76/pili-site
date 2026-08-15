import { z } from "zod";
import { passwordSchema } from "./user";

export const trocaSenhaSchema = z
  .object({
    atual: z.string().min(1, "Informe a senha atual"),
    nova: passwordSchema,
    confirmacao: z.string(),
  })
  .refine((d) => d.nova === d.confirmacao, {
    message: "As senhas não conferem",
    path: ["confirmacao"],
  })
  .refine((d) => d.nova !== d.atual, {
    message: "A nova senha precisa ser diferente da atual",
    path: ["nova"],
  });

export type TrocaSenhaInput = z.infer<typeof trocaSenhaSchema>;

export const solicitacaoSchema = z.object({
  equipmentId: z.string().min(1),
  type: z.enum([
    "CORRETIVA",
    "PREVENTIVA",
    "INSTALACAO",
    "DUVIDA_TECNICA",
    "OUTRO",
  ]),
  urgency: z.enum(["BAIXA", "MEDIA", "ALTA", "PARADA"]),
  description: z
    .string()
    .trim()
    .min(20, "Descreva o problema com pelo menos 20 caracteres")
    .max(4000),
  contactName: z.string().trim().min(1, "Informe quem atende no local").max(200),
  contactPhone: z.string().trim().min(8, "Telefone inválido").max(30),
});

export type SolicitacaoInput = z.infer<typeof solicitacaoSchema>;
