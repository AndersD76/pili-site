import Link from "next/link";
import { MapPin, Plus } from "lucide-react";
import { requireRole } from "@/lib/auth-guard";
import { getFiliaisAdmin } from "@/lib/filiais";
import { getSiteSettings } from "@/lib/site-settings";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Unidades" };

const ROTULO_TIPO: Record<string, string> = {
  FILIAL: "Filial",
  ESCRITORIO: "Escritório comercial",
  ASSISTENCIA: "Assistência técnica",
};

export default async function FiliaisPage() {
  await requireRole("ADMIN");

  const [filiais, settings] = await Promise.all([
    getFiliaisAdmin(),
    getSiteSettings(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-pili-black">
            Unidades
          </h1>
          <p className="mt-1 text-sm text-pili-concrete">
            Filiais, escritórios e assistências exibidos no rodapé do site. A
            matriz não é editada aqui: ela vem de Configurações.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/filiais/nova">
            <Plus className="mr-2 size-4" />
            Nova unidade
          </Link>
        </Button>
      </div>

      {/* A matriz aparece para dar contexto, mas leva para a tela certa. */}
      <div className="rounded-lg border border-pili-mist bg-pili-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-pili-safety" />
              <span className="font-semibold text-pili-black">Matriz</span>
              <Badge variant="secondary">Configurações</Badge>
            </div>
            <p className="mt-1 text-sm text-pili-concrete">
              {settings.endereco}
            </p>
          </div>
          <Link
            href="/admin/config"
            className="text-sm text-pili-steel underline underline-offset-2 hover:text-pili-black"
          >
            Editar matriz
          </Link>
        </div>
      </div>

      {filiais.length === 0 ? (
        <div className="rounded-lg border border-dashed border-pili-mist p-12 text-center">
          <p className="text-sm text-pili-concrete">
            Nenhuma unidade cadastrada além da matriz. As unidades aparecem no
            rodapé assim que forem criadas.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-pili-mist">
          <table className="w-full text-sm">
            <thead className="bg-pili-fog text-left">
              <tr>
                <th className="px-4 py-3 font-semibold text-pili-black">
                  Unidade
                </th>
                <th className="px-4 py-3 font-semibold text-pili-black">
                  Cidade
                </th>
                <th className="px-4 py-3 font-semibold text-pili-black">
                  Mapa
                </th>
                <th className="px-4 py-3 font-semibold text-pili-black">
                  Situação
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filiais.map((f) => (
                <tr key={f.id} className="border-t border-pili-mist">
                  <td className="px-4 py-3">
                    <span className="font-medium text-pili-black">{f.nome}</span>
                    <span className="ml-2 text-xs text-pili-concrete">
                      {ROTULO_TIPO[f.tipo] ?? f.tipo}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-pili-concrete">
                    {f.cidade}/{f.uf}
                  </td>
                  <td className="px-4 py-3">
                    {f.lat !== null && f.lng !== null ? (
                      <span className="text-pili-concrete">Com marcador</span>
                    ) : (
                      <span className="text-pili-cement">Sem coordenada</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {f.ativa ? (
                      <Badge>Visível</Badge>
                    ) : (
                      <Badge variant="secondary">Oculta</Badge>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/filiais/${f.id}`}
                      className="text-pili-steel underline underline-offset-2 hover:text-pili-black"
                    >
                      Editar
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
