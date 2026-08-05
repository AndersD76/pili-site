/**
 * Sincroniza clientes com produtos PILI do Portal Pili para o site.
 *
 * Cria User (role=CLIENTE) + ClientEquipment para cada cliente que tem
 * `produto_principal` preenchido no CRM.
 *
 * Uso:
 *   node --env-file=.env scripts/sync-clientes-portal.mjs
 *
 * Env vars necessárias:
 *   DATABASE_URL          — banco do pili-site (Prisma)
 *   PORTAL_PILI_DB_URL    — banco do Portal Pili (NeonDB)
 *
 * Saída: gera `scripts/credenciais-clientes.csv` com login/senha temporários.
 *
 * Idempotente: pula clientes que já existem (mesmo CNPJ ou email).
 */
import { PrismaClient } from "@prisma/client";
import pg from "pg";
import { hash } from "bcryptjs";
import { writeFile } from "node:fs/promises";
import path from "node:path";

const db = new PrismaClient();
const SCRIPT_DIR = path.resolve(import.meta.dirname);

async function main() {
  const portalUrl = process.env.PORTAL_PILI_DB_URL;
  if (!portalUrl) {
    console.error("❌  Falta PORTAL_PILI_DB_URL no .env");
    process.exit(1);
  }

  const portal = new pg.Pool({ connectionString: portalUrl, ssl: { rejectUnauthorized: false } });

  // 1. Buscar clientes com produto_principal do Portal Pili
  const { rows: clientes } = await portal.query(`
    SELECT
      c.id,
      c.razao_social,
      c.nome_fantasia,
      c.cpf_cnpj,
      c.email,
      c.telefone,
      c.municipio,
      c.estado,
      c.produto_principal
    FROM crm_clientes c
    WHERE c.produto_principal IS NOT NULL
      AND c.produto_principal != ''
    ORDER BY c.razao_social
  `);

  console.log(`📋  ${clientes.length} clientes com produtos PILI encontrados`);

  // 2. Buscar equipamentos do Portal Pili
  const { rows: equipamentos } = await portal.query(`
    SELECT
      e.id,
      e.cliente_id,
      e.tipo,
      e.plataforma_m,
      e.unidade,
      e.ano_instalacao,
      e.ano_ultima_revisao
    FROM crm_equipamentos e
    ORDER BY e.cliente_id, e.ordem, e.id
  `);

  const eqsPorCliente = new Map();
  for (const eq of equipamentos) {
    const arr = eqsPorCliente.get(eq.cliente_id) || [];
    arr.push(eq);
    eqsPorCliente.set(eq.cliente_id, arr);
  }

  const csvRows = ["empresa;cnpj;email;senha_temporaria"];
  let criados = 0;
  let pulados = 0;
  let eqsCriados = 0;

  for (const cli of clientes) {
    const cnpjLimpo = (cli.cpf_cnpj || "").replace(/\D/g, "");
    const nomeEmpresa = cli.nome_fantasia || cli.razao_social || "Sem nome";

    // Gerar email: usar o do cadastro, ou gerar um baseado no CNPJ
    let email = (cli.email || "").toLowerCase().trim();
    if (!email || !email.includes("@")) {
      if (cnpjLimpo.length >= 8) {
        email = `cliente.${cnpjLimpo}@pili.ind.br`;
      } else {
        console.log(`  ⏩  ${nomeEmpresa} — sem email e sem CNPJ, pulando`);
        pulados++;
        continue;
      }
    }

    // Verificar se já existe no pili-site
    const existe = await db.user.findFirst({
      where: {
        OR: [
          { email },
          ...(cnpjLimpo ? [{ cpfCnpj: cnpjLimpo }] : []),
        ],
      },
    });

    if (existe) {
      console.log(`  ⏩  ${nomeEmpresa} — já existe (${existe.email})`);
      pulados++;
      continue;
    }

    // Senha temporária: primeiros 8 dígitos do CNPJ, ou "pili2026"
    const senhaTemp = cnpjLimpo.length >= 8 ? cnpjLimpo.slice(0, 8) : "pili2026";
    const senhaHash = await hash(senhaTemp, 12);

    // Criar usuário
    const user = await db.user.create({
      data: {
        email,
        name: nomeEmpresa,
        passwordHash: senhaHash,
        role: "CLIENTE",
        company: cli.razao_social || nomeEmpresa,
        cpfCnpj: cnpjLimpo || null,
        phone: cli.telefone || null,
      },
    });

    criados++;
    csvRows.push(`${nomeEmpresa};${cnpjLimpo};${email};${senhaTemp}`);

    // Criar equipamentos
    const eqs = eqsPorCliente.get(cli.id) || [];

    // Se não tem equipamentos na tabela, gerar a partir do produto_principal
    if (eqs.length === 0 && cli.produto_principal) {
      const prods = cli.produto_principal.split(",").map((p) => p.trim()).filter(Boolean);
      for (let i = 0; i < prods.length; i++) {
        const tipo = prods[i];
        const m = tipo.match(/(\d+)\s*m/i);
        await db.clientEquipment.create({
          data: {
            userId: user.id,
            serialNumber: `PILI-${cli.id}-${i + 1}`,
            productName: tipo,
            installedAt: new Date(),
            installedAddress: [cli.municipio, cli.estado].filter(Boolean).join("/") || null,
          },
        });
        eqsCriados++;
      }
    } else {
      for (const eq of eqs) {
        const ano = eq.ano_instalacao ? new Date(eq.ano_instalacao, 0, 1) : new Date();
        await db.clientEquipment.create({
          data: {
            userId: user.id,
            serialNumber: `PILI-EQ-${eq.id}`,
            productName: eq.tipo || "Equipamento PILI",
            installedAt: ano,
            installedAddress: eq.unidade || [cli.municipio, cli.estado].filter(Boolean).join("/") || null,
          },
        });
        eqsCriados++;
      }
    }

    console.log(`  ✅  ${nomeEmpresa} — ${eqs.length || cli.produto_principal.split(",").length} equipamento(s)`);
  }

  // Salvar CSV
  const csvPath = path.join(SCRIPT_DIR, "credenciais-clientes.csv");
  await writeFile(csvPath, csvRows.join("\n"), "utf-8");

  console.log("\n📊  Resumo:");
  console.log(`    Criados: ${criados} clientes, ${eqsCriados} equipamentos`);
  console.log(`    Pulados: ${pulados}`);
  console.log(`    CSV: ${csvPath}`);

  await portal.end();
  await db.$disconnect();
}

main().catch((err) => {
  console.error("❌  Erro:", err);
  process.exit(1);
});
