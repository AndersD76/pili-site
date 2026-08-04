import { MapPin } from "lucide-react";
import { getTranslations } from "next-intl/server";

/**
 * Mapa da localização, via OpenStreetMap.
 *
 * Escolhido por ser gratuito, não exigir chave de API e não adicionar
 * dependência de JavaScript — é um `<iframe>` puro. O Google Maps exigiria
 * conta, chave e faturamento habilitado para uso além do embed básico.
 *
 * As coordenadas vêm de `SiteSettings` e são editáveis no painel; sem elas o
 * bloco simplesmente não é renderizado, em vez de mostrar um mapa errado.
 */
interface MapaLocalizacaoProps {
  lat: number | null;
  lng: number | null;
  zoom: number;
  /** Usado no título do iframe e no link de "abrir no mapa". */
  endereco: string;
  className?: string;
}

/** Caixa delimitadora ao redor do ponto — o embed do OSM pede bbox, não centro. */
function bbox(lat: number, lng: number, zoom: number): string {
  // Quanto maior o zoom, menor a área. 15 ≈ bairro; 12 ≈ cidade.
  const raio = 0.35 / Math.pow(2, zoom - 12);
  return [lng - raio, lat - raio / 2, lng + raio, lat + raio / 2].join(",");
}

export async function MapaLocalizacao({
  lat,
  lng,
  zoom,
  endereco,
  className = "",
}: MapaLocalizacaoProps) {
  if (lat === null || lng === null) return null;

  const t = await getTranslations("contato");

  const embed =
    `https://www.openstreetmap.org/export/embed.html` +
    `?bbox=${bbox(lat, lng, zoom)}&layer=mapnik&marker=${lat},${lng}`;

  const externo = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=${zoom}/${lat}/${lng}`;

  return (
    <div className={className}>
      <div className="overflow-hidden border border-pili-mist">
        <iframe
          src={embed}
          title={t("mapTitle", { address: endereco })}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="aspect-16/10 w-full border-0"
        />
      </div>

      <a
        href={externo}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-flex items-center gap-2 text-sm text-pili-concrete transition-colors hover:text-pili-black"
      >
        <MapPin className="h-4 w-4" />
        {t("mapLink", { address: endereco })}
      </a>
    </div>
  );
}
