"use client";

import { useState } from "react";
import { Loader2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface EnderecoBusca {
  logradouro?: string;
  cidade?: string;
  uf?: string;
  cep?: string;
}

/**
 * Acha latitude e longitude a partir do endereço já digitado no formulário.
 *
 * Antes era preciso sair do painel, abrir o OpenStreetMap, achar o ponto,
 * clicar com o botão direito e copiar dois números. Um dígito trocado e o
 * marcador ia parar no oceano.
 */
export function BuscarCoordenadas({
  endereco,
  onEncontrado,
}: {
  endereco: EnderecoBusca;
  onEncontrado: (coords: { lat: number; lng: number }) => void;
}) {
  const [buscando, setBuscando] = useState(false);
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [tom, setTom] = useState<"ok" | "aviso" | "erro">("ok");

  const preenchido = Boolean(
    endereco.logradouro?.trim() || endereco.cidade?.trim() || endereco.cep?.trim(),
  );

  async function buscar() {
    setBuscando(true);
    setMensagem(null);

    const params = new URLSearchParams();
    for (const [chave, valor] of Object.entries(endereco)) {
      if (valor?.trim()) params.set(chave, valor.trim());
    }

    try {
      const resposta = await fetch(`/api/admin/geocodificar?${params}`);
      const dados = await resposta.json();

      if (!resposta.ok) {
        setTom("erro");
        setMensagem(dados.error ?? "Não foi possível buscar o endereço.");
        return;
      }

      onEncontrado({ lat: dados.lat, lng: dados.lng });

      if (dados.precisao === "aproximada") {
        setTom("aviso");
        setMensagem(
          `Não achei a rua. Marquei o centro de ${dados.endereco.split(",")[0]} — arraste a coordenada se precisar de precisão.`,
        );
        return;
      }

      setTom("ok");
      setMensagem(
        dados.corrigido
          ? `Pelo CEP, a rua é "${dados.corrigido}". Ponto marcado em ${dados.endereco}.`
          : `Ponto encontrado: ${dados.endereco}`,
      );
    } catch {
      setTom("erro");
      setMensagem("Falha de conexão ao buscar o endereço.");
    } finally {
      setBuscando(false);
    }
  }

  const cor =
    tom === "erro"
      ? "text-pili-danger"
      : tom === "aviso"
        ? "text-pili-warning"
        : "text-pili-success";

  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant="outline"
        onClick={buscar}
        disabled={buscando || !preenchido}
      >
        {buscando ? (
          <Loader2 className="mr-2 size-4 animate-spin" />
        ) : (
          <MapPin className="mr-2 size-4" />
        )}
        Achar no mapa pelo endereço
      </Button>

      {!preenchido ? (
        <p className="text-xs text-pili-concrete">
          Preencha o endereço ou o CEP acima para o mapa localizar o ponto.
        </p>
      ) : (
        <p className="text-xs text-pili-concrete">
          Com o CEP preenchido a busca fica mais certeira: ele corrige o nome da
          rua pelos Correios antes de procurar no mapa.
        </p>
      )}

      {mensagem ? <p className={`text-xs ${cor}`}>{mensagem}</p> : null}
    </div>
  );
}
