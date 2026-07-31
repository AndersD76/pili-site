"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useState, useTransition } from "react";

import { createUser } from "@/app/admin/(panel)/usuarios/actions";
import {
  passwordSchema,
  cpfCnpjSchema,
  phoneSchema,
  PASSWORD_HELP,
  MIN_PASSWORD_LENGTH,
  ROLES,
} from "@/lib/validators/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/* ---------- schema ---------- */

const userSchema = z
  .object({
    name: z.string().trim().min(1, "Nome obrigatório"),
    email: z.string().trim().email("E-mail inválido"),
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Confirme a senha"),
    role: z.enum(ROLES),
    company: z.string().trim().optional(),
    phone: phoneSchema,
    cpfCnpj: cpfCnpjSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

type UserFormValues = z.infer<typeof userSchema>;

/* ---------- role options ---------- */

const ROLE_OPTIONS = [
  { value: "CLIENTE", label: "Cliente" },
  { value: "TECNICO", label: "Técnico" },
  { value: "COMERCIAL", label: "Comercial" },
  { value: "ADMIN", label: "Admin" },
] as const;

/* ---------- page ---------- */

export default function NovoUsuarioPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "CLIENTE",
      company: "",
      phone: "",
      cpfCnpj: "",
    },
  });

  function onSubmit(values: UserFormValues) {
    setServerError(null);

    startTransition(async () => {
      const result = await createUser({
        name: values.name,
        email: values.email,
        password: values.password,
        role: values.role,
        company: values.company,
        phone: values.phone,
        cpfCnpj: values.cpfCnpj,
      });

      if (result.success) {
        router.push("/admin/usuarios");
      } else {
        setServerError(result.error ?? "Erro desconhecido");
      }
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/usuarios">
            <ArrowLeft className="size-4" />
            <span className="sr-only">Voltar</span>
          </Link>
        </Button>
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-pili-black">
            Novo usuário
          </h1>
          <p className="text-sm text-pili-concrete">
            Preencha os dados do novo usuário
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-2xl space-y-8 rounded-lg border border-pili-mist bg-pili-white p-6"
      >
        {serverError && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {serverError}
          </div>
        )}

        {/* Nome + Email */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="Nome completo"
            />
            {errors.name && (
              <p className="text-xs text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              placeholder="usuario@empresa.com.br"
            />
            {errors.email && (
              <p className="text-xs text-red-600">{errors.email.message}</p>
            )}
          </div>
        </div>

        {/* Senha + Confirmar senha */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              {...register("password")}
              placeholder={`Mínimo de ${MIN_PASSWORD_LENGTH} caracteres`}
              aria-describedby="password-help"
            />
            {errors.password ? (
              <p className="text-xs text-red-600">{errors.password.message}</p>
            ) : (
              <p id="password-help" className="text-xs text-pili-concrete">
                {PASSWORD_HELP}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar senha</Label>
            <Input
              id="confirmPassword"
              type="password"
              {...register("confirmPassword")}
              placeholder="Repita a senha"
            />
            {errors.confirmPassword && (
              <p className="text-xs text-red-600">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </div>

        {/* Empresa + Telefone */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="company">Empresa</Label>
            <Input
              id="company"
              {...register("company")}
              placeholder="Nome da empresa (opcional)"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              {...register("phone")}
              placeholder="+55 54 99999-0000"
            />
            {errors.phone && (
              <p className="text-xs text-red-600">{errors.phone.message}</p>
            )}
          </div>
        </div>

        {/* CPF/CNPJ + Role */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="cpfCnpj">CPF/CNPJ</Label>
            <Input
              id="cpfCnpj"
              {...register("cpfCnpj")}
              placeholder="000.000.000-00"
            />
            {errors.cpfCnpj && (
              <p className="text-xs text-red-600">{errors.cpfCnpj.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Perfil</Label>
            <Select
              defaultValue="CLIENTE"
              onValueChange={(value) =>
                setValue("role", value as UserFormValues["role"])
              }
            >
              <SelectTrigger id="role">
                <SelectValue placeholder="Selecione o perfil" />
              </SelectTrigger>
              <SelectContent>
                {ROLE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.role && (
              <p className="text-xs text-red-600">{errors.role.message}</p>
            )}
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center gap-3 pt-2">
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
            Criar usuário
          </Button>
          <Button variant="outline" type="button" asChild>
            <Link href="/admin/usuarios">Cancelar</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
