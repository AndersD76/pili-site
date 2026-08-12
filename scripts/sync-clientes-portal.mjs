/**
 * Cria contas de portal para os clientes com equipamento PILI, a partir do
 * CRM do Portal Pili.
 *
 * Uso:
 *   node --env-file=.env scripts/sync-clientes-portal.mjs           (simulação)
 *   node --env-file=.env scripts/sync-clientes-portal.mjs --gravar  (grava)
 *
 * Env vars:
 *   DATABASE_URL        — banco do pili-site (Prisma)
 *   PORTAL_PILI_DB_URL  — banco do Portal Pili
 *
 * Saída ao gravar: `scripts/credenciais-clientes.csv` com as senhas
 * provisórias. O arquivo está no .gitignore e deve ser apagado depois de
 * repassar as senhas.
 *
 * Idempotente: pula quem já existe (mesmo e-mail ou CNPJ).
 *
 * Três decisões que valem registro:
 *
 * 1. **Quem entra.** Não só `produto_principal`: entram também os clientes com
 *    oportunidade GANHA e os de `crm_equipamentos`. São 255 no total contra os
 *    238 da versão anterior.
 *
 * 2. **Só quem tem e-mail.** A versão anterior inventava
 *    `cliente.<cnpj>@pili.ind.br` para quem não tinha. Esse endereço não
 *    existe: o cliente nunca recebe a senha, nunca faz "esqueci minha senha" e
 *    a conta nasce inutilizável. Agora eles são listados à parte, para o CRM
 *    ser completado.
 *
 * 3. **Senha aleatória, não o CNPJ.** O CNPJ é público — qualquer um consulta
 *    na Receita e entra na conta. A senha é sorteada e a conta nasce com
 *    `mustChangePassword`, então o portal exige a troca no primeiro acesso.
 */
import { PrismaClient } from "@prisma/client";
import pg from "pg";
import { hash } from "bcryptjs";
import { randomInt } from "node:crypto";
import { writeFile } from "node:fs/promises";
import path from "node:path";

const db = new PrismaClient();
const SCRIPT_DIR = path.resolve(import.meta.dirname);
const GRAVAR = process.argv.includes("--gravar");

/** Sem caracteres ambíguos: estas senhas são ditadas por telefone. */
const ALFABETO = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789abcdefghijkmnpqrstuvwxyz";

function senhaProvisoria(tamanho = 12) {
  let saida = "";
  for (let i = 0; i < tamanho; i++) {
    saida += ALFABETO[randomInt(ALFABETO.length)];
  }
  return saida;
}

/** Escapa para CSV com separador `;`. */
function csv(valor) {
  const texto = String(valor ?? "");
  return /[;"\n]/.test(texto) ? `"${texto.replace(/"/g, '""')}"` : texto;
}

async function main() {
  const portalUrl = process.env.PORTAL_PILI_DB_URL;
  if (!portalUrl) {
    console.error("Falta PORTAL_PILI_DB_URL no .env");
    process.exit(1);
  }

  const portal = new pg.Pool({
    connectionString: portalUrl,
    ssl: { rejectUnauthorized: false },
  });

  // União das fontes que comprovam equipamento PILI. `produto_principal` veio
  // do cruzamento do CSV de vendas 2011-2026 com a base por CNPJ.
  const { rows: clientes } = await portal.query(`
    SELECT
      c.id, c.razao_social, c.nome_fantasia, c.cpf_cnpj,
      c.email, c.telefone, c.municipio, c.estado, c.produto_principal
    FROM crm_clientes c
    WHERE c.id IN (
            SELECT cliente_id FROM crm_propostas     WHERE opd_numero IS NOT NULL
      UNION SELECT cliente_id FROM crm_oportunidades WHERE status = 'GANHA'
      UNION SELECT id         FROM crm_clientes
                              WHERE produto_principal IS NOT NULL
                                AND produto_principal <> ''
      UNION SELECT cliente_id FROM crm_equipamentos
    )
    ORDER BY c.razao_social
  `);

  const { rows: equipamentos } = await portal.query(`
    SELECT id, cliente_id, tipo, plataforma_m, unidade, ano_instalacao
    FROM crm_equipamentos
    ORDER BY cliente_id, ordem, id
  `);

  const eqsPorCliente = new Map();
  for (const eq of equipamentos) {
    const lista = eqsPorCliente.get(eq.cliente_id) ?? [];
    lista.push(eq);
    eqsPorCliente.set(eq.cliente_id, lista);
  }

  console.log(
    `${clientes.length} clientes com equipamento PILI no CRM` +
      (GRAVAR ? "" : "  (SIMULAÇÃO — nada será gravado)"),
  );
  console.log();

  const linhasCsv = ["empresa;cnpj;email;senha_provisoria;equipamentos"];
  const semEmail = [];
  let criados = 0;
  let jaExistiam = 0;
  let equipamentosCriados = 0;

  for (const cli of clientes) {
    const cnpj = (cli.cpf_cnpj ?? "").replace(/\D/g, "");
    const nome = cli.nome_fantasia || cli.razao_social || "Sem nome";
    const email = (cli.email ?? "").toLowerCase().trim();

    if (!email.includes("@")) {
      semEmail.push({ nome, cnpj, produto: cli.produto_principal ?? "" });
      continue;
    }

    const existe = await db.user.findFirst({
      where: {
        OR: [{ email }, ...(cnpj ? [{ cpfCnpj: cnpj }] : [])],
      },
      select: { email: true },
    });

    if (existe) {
      jaExistiam++;
      continue;
    }

    // A lista de equipamentos: os do CRM quando existem; senão, o que o
    // `produto_principal` descreve.
    const doCrm = eqsPorCliente.get(cli.id) ?? [];
    const aCriar =
      doCrm.length > 0
        ? doCrm.map((eq) => ({
            serialNumber: `PILI-EQ-${eq.id}`,
            productName: eq.tipo || "Equipamento PILI",
            installedAt: eq.ano_instalacao
              ? new Date(Number(eq.ano_instalacao), 0, 1)
              : null,
            installedAddress:
              eq.unidade ||
              [cli.municipio, cli.estado].filter(Boolean).join("/") ||
              null,
          }))
        : (cli.produto_principal ?? "")
            .split(",")
            .map((p) => p.trim())
            .filter(Boolean)
            .map((produto, i) => ({
              serialNumber: `PILI-${cli.id}-${i + 1}`,
              productName: produto,
              // Sem data conhecida: `null` é honesto, `new Date()` diria que o
              // equipamento foi instalado hoje.
              installedAt: null,
              installedAddress:
                [cli.municipio, cli.estado].filter(Boolean).join("/") || null,
            }));

    const senha = senhaProvisoria();

    if (GRAVAR) {
      await db.$transaction(async (tx) => {
        const user = await tx.user.create({
          data: {
            email,
            name: nome,
            passwordHash: await hash(senha, 12),
            role: "CLIENTE",
            company: cli.razao_social || nome,
            cpfCnpj: cnpj || null,
            phone: cli.telefone || null,
            mustChangePassword: true,
          },
        });

        for (const eq of aCriar) {
          await tx.clientEquipment.create({
            data: { userId: user.id, ...eq },
          });
        }
      });
    }

    criados++;
    equipamentosCriados += aCriar.length;
    linhasCsv.push(
      [nome, cnpj, email, senha, aCriar.map((e) => e.productName).join(" + ")]
        .map(csv)
        .join(";"),
    );
  }

  console.log("Resumo");
  console.log(`  ${GRAVAR ? "criados" : "criaria"}: ${criados} clientes, ${equipamentosCriados} equipamentos`);
  console.log(`  já existiam no site: ${jaExistiam}`);
  console.log(`  sem e-mail no CRM (não entram): ${semEmail.length}`);

  if (semEmail.length > 0) {
    const arquivo = path.join(SCRIPT_DIR, "clientes-sem-email.csv");
    await writeFile(
      arquivo,
      ["empresa;cnpj;produto", ...semEmail.map((c) => [c.nome, c.cnpj, c.produto].map(csv).join(";"))].join("\n"),
      "utf-8",
    );
    console.log(`  lista deles em: ${arquivo}`);
  }

  if (GRAVAR) {
    const arquivo = path.join(SCRIPT_DIR, "credenciais-clientes.csv");
    await writeFile(arquivo, linhasCsv.join("\n"), "utf-8");
    console.log();
    console.log(`  senhas provisórias em: ${arquivo}`);
    console.log("  apague o arquivo depois de repassar — são credenciais em texto puro.");
  } else {
    console.log();
    console.log("  simulação. rode com --gravar para efetivar.");
  }

  await portal.end();
  await db.$disconnect();
}

main().catch(async (err) => {
  console.error("Erro:", err);
  await db.$disconnect();
  process.exit(1);
});
