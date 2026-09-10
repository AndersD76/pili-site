"use client";

import { useState } from "react";
import { Loader2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  /** Texto do endereço montado pelo formulário — vazio desabilita o botão. */
  endereco: string;
  onEncontrado: (coords: { lat: number; lng: number }) => void;
}) {
  const [buscando, setBuscando] = useState(false);
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [erro, setErro] = useState(false);

  async function buscar() {
    setBuscando(true);
    setMensagem(null);
    setErro(false);
    try {
      const resposta = await fetch(
        `/api/admin/geocodificar?q=${encodeURIComponent(endereco)}`,
      );
      const dados = await resposta.json();

      if (!resposta.ok) {
        setErro(true);
        setMensagem(dados.error ?? "Não foi possível buscar o endereço.");
        return;
      }

      onEncontrado({ lat: dados.lat, lng: dados.lng });
      setMensagem(`Ponto encontrado: ${dados.endereco}`);
    } catch {
      setErro(true);
      setMensagem("Falha de conexão ao buscar o endereço.");
    } finally {
      setBuscando(false);
    }
  }

  const vazio = endereco.trim().length < 5;

  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant="outline"
        onClick={buscar}
        disabled={buscando || vazio}
      >
        {buscando ? (
          <Loader2 className="mr-2 size-4 animate-spin" />
        ) : (
          <MapPin className="mr-2 size-4" />
        )}
        Achar no mapa pelo endereço
      </Button>

      {vazio ? (
        <p className="text-xs text-pili-concrete">
          Preencha o endereço acima para o mapa localizar o ponto sozinho.
        </p>
      ) : null}

      {mensagem ? (
        <p
          className={`text-xs ${erro ? "text-pili-danger" : "text-pili-success"}`}
        >
          {mensagem}
        </p>
      ) : null}
    </div>
  );
}
