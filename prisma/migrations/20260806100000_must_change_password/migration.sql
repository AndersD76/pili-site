-- Marca contas cuja senha ainda é a provisória gerada na importação.
--
-- O sync de clientes do CRM cria a conta com uma senha que nós geramos. Sem
-- esta trava ela nunca é trocada: o usuário entra com a provisória para
-- sempre, e quem tiver acesso ao CSV de importação entra junto.
--
-- Contas existentes ficam em `false`: elas foram criadas com senha escolhida
-- pelo próprio dono.
ALTER TABLE "User"
  ADD COLUMN "mustChangePassword" BOOLEAN NOT NULL DEFAULT false;
