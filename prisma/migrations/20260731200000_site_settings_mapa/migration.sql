-- Coordenadas do mapa da pagina de contato, editaveis pelo painel.
--
-- A pagina exibia apenas um retangulo cinza com o texto "Mapa -- Erechim/RS".
-- O mapa usa OpenStreetMap por iframe: gratuito, sem chave de API e sem
-- dependencia de JavaScript.

ALTER TABLE "SiteSettings" ADD COLUMN "mapaLat" DOUBLE PRECISION;
ALTER TABLE "SiteSettings" ADD COLUMN "mapaLng" DOUBLE PRECISION;
ALTER TABLE "SiteSettings" ADD COLUMN "mapaZoom" INTEGER NOT NULL DEFAULT 15;

-- Coordenadas do centro de Erechim/RS, onde fica a fabrica.
UPDATE "SiteSettings"
   SET "mapaLat" = -27.6339, "mapaLng" = -52.2739, "mapaZoom" = 14
 WHERE "id" = 'default';
