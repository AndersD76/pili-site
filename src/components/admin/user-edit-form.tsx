"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, KeyRound } from "lucide-react";

import { updateUser, resetPassword } from "@/app/admin/(panel)/usuarios/actions";
import {
  passwordSchema,
  cpfCnpjSchema,
  phoneSchema,
  PASSWORD_HELP,
  ROLES,
} from "@/lib/validators/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Role } from "@prisma/client";

const ROLE_OPTIONS: { value: Role; label: string }[] = [
  { value: "CLIENTE", label: "Cliente" },
  { value: "TECNICO", label: "Técnico" },
  { value: "COMERCIAL", label: "Comercial" },
  { value: "ADMIN", label: "Admin" },
];

const profileSchema = z.object({
  name: z.string().trim().min(1, "Nome obrigatório"),
  email: z.string().trim().email("E-mail inválido"),
  role: z.enum(ROLES),
  company: z.string().trim().optional(),
  phone: phoneSchema,
  cpfCnpj: cpfCnpjSchema,
});

type ProfileValues = z.infer<typeof profileSchema>;

const passwordFormSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Confirme a senha"),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

type PasswordValues = z.infer<typeof passwordFormSchema>;

interface UserEditFormProps {
  user: {
    id: string;
    name: string;
    email: string;
    company: string;
    phone: string;
    cpfCnpj: string;
    role: Role;
  };
  /** O próprio admin logado não pode rebaixar a si mesmo e se trancar fora. */
  isSelf: boolean;
}

export function UserEditForm({ user, isSelf }: UserEditFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isResetting, startReset] = useTransition();
  const [role, setRole] = useState<Role>(user.role);

  const profile = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      role: user.role,
      company: user.company,
      phone: user.phone,
      cpfCnpj: user.cpfCnpj,
    },
  });

  const pwd = useForm<PasswordValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  function onSaveProfile(values: ProfileValues) {
    startTransition(async () => {
      try {
        const result = await updateUser(user.id, values);
        if (result.success) {
          toast.success("Dados atualizados.");
          router.refresh();
        } else {
          toast.error(result.error ?? "Erro ao salvar.");
        }
      } catch {
        toast.error("Não foi possível salvar os dados.");
      }
    });
  }

  function onResetPassword(values: PasswordValues) {
    startReset(async () => {
      try {
        const result = await resetPassword(user.id, values.password);
        if (result.success) {
          toast.success("Senha redefinida.");
          pwd.reset();
        } else {
          toast.error(result.error ?? "Erro ao redefinir a senha.");
        }
      } catch {
        toast.error("Não foi possível redefinir a senha.");
      }
    });
  }

  return (
    <div className="max-w-2xl space-y-6">
      {/* ---- Dados do usuário ---- */}
      <form
        onSubmit={profile.handleSubmit(onSaveProfile)}
        className="space-y-6 rounded-lg border border-pili-mist bg-pili-white p-6"
      >
        <h2 className="font-display text-lg font-semibold text-pili-black">
          Dados do usuário
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input id="name" {...profile.register("name")} />
            {profile.formState.errors.name && (
              <p className="text-xs text-red-600">
                {profile.formState.errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" type="email" {...profile.register("email")} />
            {profile.formState.errors.email && (
              <p className="text-xs text-red-600">
                {profile.formState.errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">Empresa</Label>
            <Input id="company" {...profile.register("company")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input id="phone" {...profile.register("phone")} />
            {profile.formState.errors.phone && (
              <p className="text-xs text-red-600">
                {profile.formState.errors.phone.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="cpfCnpj">CPF/CNPJ</Label>
            <Input id="cpfCnpj" {...profile.register("cpfCnpj")} />
            {profile.formState.errors.cpfCnpj && (
              <p className="text-xs text-red-600">
                {profile.formState.errors.cpfCnpj.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Perfil</Label>
            <Select
              value={role}
              disabled={isSelf}
              onValueChange={(value) => {
                setRole(value as Role);
                profile.setValue("role", value as Role);
              }}
            >
              <SelectTrigger id="role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ROLE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {isSelf && (
              <p className="text-xs text-pili-concrete">
                Você não pode alterar o próprio perfil.
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
            Salvar alterações
          </Button>
        </div>
      </form>

      {/* ---- Redefinir senha ---- */}
      <form
        onSubmit={pwd.handleSubmit(onResetPassword)}
        className="space-y-6 rounded-lg border border-pili-mist bg-pili-white p-6"
      >
        <div>
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-pili-black">
            <KeyRound className="size-4" />
            Redefinir senha
          </h2>
          <p className="mt-1 text-sm text-pili-concrete">
            A senha atual não é exigida. Informe a nova ao usuário por um canal
            seguro — ela não é exibida novamente.
          </p>
        </div>

        <Separator />

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="new-password">Nova senha</Label>
            <Input
              id="new-password"
              type="password"
              {...pwd.register("password")}
              aria-describedby="new-password-help"
            />
            {pwd.formState.errors.password ? (
              <p className="text-xs text-red-600">
                {pwd.formState.errors.password.message}
              </p>
            ) : (
              <p id="new-password-help" className="text-xs text-pili-concrete">
                {PASSWORD_HELP}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-new-password">Confirmar nova senha</Label>
            <Input
              id="confirm-new-password"
              type="password"
              {...pwd.register("confirmPassword")}
            />
            {pwd.formState.errors.confirmPassword && (
              <p className="text-xs text-red-600">
                {pwd.formState.errors.confirmPassword.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" variant="outline" disabled={isResetting}>
            {isResetting && <Loader2 className="mr-2 size-4 animate-spin" />}
            Redefinir senha
          </Button>
        </div>
      </form>
    </div>
  );
}
