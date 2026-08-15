import Link from "next/link";
import { Plus } from "lucide-react";
import { requireRole } from "@/lib/auth-guard";
import { getMarcosHistoriaAdmin } from "@/lib/conteudo-editavel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Trajetória" };

export default async function HistoriaPage() {
  await requireRole("ADMIN");

  const marcos = await getMarcosHistoriaAdmin();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-pili-black">
            Trajetória
          </h1>
          <p className="mt-1 text-sm text-pili-concrete">
            A linha do tempo exibida na página da empresa. Sem nenhum marco
            cadastrado, o site usa a trajetória padrão.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/historia/novo">
            <Plus className="mr-2 size-4" />
            Novo marco
          </Link>
        </Button>
      </div>

      {marcos.length === 0 ? (
        <div className="rounded-lg border border-dashed border-pili-mist p-12 text-center">
          <p className="text-sm text-pili-concrete">
            Nenhum marco cadastrado. A página da empresa está exibindo a linha do
            tempo padrão. Ao criar o primeiro marco, ela passa a mostrar apenas
            os marcos daqui.
          </p>
        </div>
      ) : (
        <ol className="space-y-3">
          {marcos.map((marco) => {
            const pt = marco.translations.find((t) => t.locale === "pt_BR");
            const temEs = marco.translations.some((t) => t.locale === "es");

            return (
              <li key={marco.id}>
                <Link
                  href={`/admin/historia/${marco.id}`}
                  className="flex gap-4 rounded-lg border border-pili-mist bg-pili-white p-4 transition-colors hover:border-pili-cement"
                >
                  <span className="flex h-12 w-16 shrink-0 items-center justify-center border-2 border-pili-black font-mono text-xs font-bold">
                    {marco.ano ?? "Hoje"}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-pili-black">
                        {pt?.titulo ?? "(sem título)"}
                      </span>
                      {marco.ativo ? (
                        <Badge>Visível</Badge>
                      ) : (
                        <Badge variant="secondary">Oculto</Badge>
                      )}
                      {!temEs && (
                        <Badge variant="secondary">Sem espanhol</Badge>
                      )}
                    </div>
                    <p className="mt-1 line-clamp-2 text-sm text-pili-concrete">
                      {pt?.texto}
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
