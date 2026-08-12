-- A data de instalação passa a ser opcional.
--
-- O CRM registra o equipamento vendido, mas nem sempre quando foi instalado.
-- Com a coluna obrigatória, a importação era forçada a gravar a data de hoje —
-- e o cliente veria na ficha dele que o tombador comprado em 2014 foi
-- instalado nesta semana. Nulo diz "não sabemos", que é a verdade.
ALTER TABLE "ClientEquipment" ALTER COLUMN "installedAt" DROP NOT NULL;
