-- Marca quando os dados pessoais do lead foram anonimizados a pedido do titular
-- (LGPD, Art. 18, VI). Ver `anonymizeLead` em admin/(panel)/leads/actions.ts.
--
-- O soft delete (`deletedAt`) tira o lead da listagem mas preserva nome,
-- e-mail, telefone, empresa e mensagem — atender um pedido de eliminação por
-- ali não eliminava dado nenhum.

ALTER TABLE "Lead" ADD COLUMN "anonymizedAt" TIMESTAMP(3);
