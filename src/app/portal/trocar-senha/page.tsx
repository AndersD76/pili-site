import { requirePortalAuth } from "@/lib/auth-guard";
import { TrocaSenhaForm } from "@/components/portal/troca-senha-form";

export default async function TrocarSenhaPage() {
  const session = await requirePortalAuth();

  return (
    <div className="min-h-screen bg-pili-paper">
      <div className="mx-auto max-w-lg px-4 py-16 sm:px-6">
        <TrocaSenhaForm obrigatoria={session.user.mustChangePassword} />
      </div>
    </div>
  );
}
