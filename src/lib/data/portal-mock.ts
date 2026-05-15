/**
 * Mock data for Portal do Cliente demo.
 * In production, this data comes from Prisma (ClientEquipment, ServiceOrder).
 */

export interface PortalEquipment {
  id: string;
  serialNumber: string;
  productName: string;
  productSlug: string;
  category: string;
  length: string;
  capacity: string;
  installedAt: string;
  installedAddress: string;
  warrantyEndsAt: string;
  status: "operando" | "manutencao" | "parado";
  specs: { label: string; value: string }[];
  documents: { name: string; type: string; size: string; url: string }[];
  lastMaintenance: string;
  nextMaintenance: string;
  operatingHours: number;
}

export interface PortalServiceOrder {
  id: string;
  number: string;
  equipmentId: string;
  equipmentName: string;
  type: "preventiva" | "corretiva" | "instalacao" | "calibracao";
  status: "aberta" | "agendada" | "em_andamento" | "concluida" | "cancelada";
  description: string;
  createdAt: string;
  scheduledAt: string | null;
  completedAt: string | null;
  technician: string | null;
  notes: string | null;
}

export interface PortalDocument {
  id: string;
  name: string;
  category: "manual" | "certificado" | "relatorio" | "desenho" | "garantia";
  type: string;
  size: string;
  url: string;
  equipmentId: string | null;
  equipmentName: string | null;
  updatedAt: string;
}

export interface PortalClient {
  id: string;
  name: string;
  email: string;
  company: string;
  cnpj: string;
  phone: string;
  address: string;
  since: string;
}

export const MOCK_CLIENT: PortalClient = {
  id: "cli_001",
  name: "Roberto Mendes",
  email: "roberto.mendes@cooperativacentral.com.br",
  company: "Cooperativa Central Agrícola",
  cnpj: "12.345.678/0001-90",
  phone: "+55 54 99876-5432",
  address: "Rod. RS-135, Km 42 — Erechim/RS",
  since: "2019-03-15",
};

export const MOCK_EQUIPMENT: PortalEquipment[] = [
  {
    id: "eq_001",
    serialNumber: "PILI-TF30-2023-0047",
    productName: "Tombador 30 Metros Fixo",
    productSlug: "tombador-30m-fixo",
    category: "TOMBADOR_FIXO",
    length: "30m",
    capacity: "100t",
    installedAt: "2023-06-20",
    installedAddress: "Unidade Paranaguá — Av. Portuária, 1200",
    warrantyEndsAt: "2028-06-20",
    status: "operando",
    specs: [
      { label: "Comprimento da plataforma", value: "30.000 mm" },
      { label: "Capacidade máxima", value: "100 toneladas" },
      { label: "Ângulo de tombamento", value: "42°" },
      { label: "Tempo de ciclo", value: "45 segundos" },
      { label: "Cilindros hidráulicos", value: "4x telescópicos" },
      { label: "Potência do sistema", value: "150 cv" },
      { label: "Pressão de trabalho", value: "250 bar" },
      { label: "Vazão da bomba", value: "120 l/min" },
      { label: "Alimentação elétrica", value: "380V / 60Hz trifásico" },
      { label: "Peso da estrutura", value: "48.500 kg" },
      { label: "Fundação", value: "Concreto armado 1.200 mm" },
      { label: "Acabamento", value: "Jateamento SA 2.5 + primer epóxi + esmalte PU" },
    ],
    documents: [
      { name: "Manual de Operação — Tombador 30m", type: "PDF", size: "12,4 MB", url: "#" },
      { name: "Manual de Manutenção Preventiva", type: "PDF", size: "8,7 MB", url: "#" },
      { name: "Desenho Técnico — Vista Geral", type: "DWG", size: "3,2 MB", url: "#" },
      { name: "Certificado de Garantia", type: "PDF", size: "420 KB", url: "#" },
      { name: "ART — Responsabilidade Técnica", type: "PDF", size: "1,1 MB", url: "#" },
      { name: "Laudo NR-12", type: "PDF", size: "2,8 MB", url: "#" },
    ],
    lastMaintenance: "2025-03-15",
    nextMaintenance: "2025-09-15",
    operatingHours: 12450,
  },
  {
    id: "eq_002",
    serialNumber: "PILI-TF12-2021-0123",
    productName: "Tombador 12 Metros Fixo",
    productSlug: "tombador-12m-fixo",
    category: "TOMBADOR_FIXO",
    length: "12m",
    capacity: "55t",
    installedAt: "2021-11-10",
    installedAddress: "Sede Erechim — Rod. RS-135, Km 42",
    warrantyEndsAt: "2026-11-10",
    status: "operando",
    specs: [
      { label: "Comprimento da plataforma", value: "12.000 mm" },
      { label: "Capacidade máxima", value: "55 toneladas" },
      { label: "Ângulo de tombamento", value: "40°" },
      { label: "Tempo de ciclo", value: "38 segundos" },
      { label: "Cilindros hidráulicos", value: "2x telescópicos" },
      { label: "Potência do sistema", value: "75 cv" },
      { label: "Pressão de trabalho", value: "210 bar" },
      { label: "Vazão da bomba", value: "80 l/min" },
      { label: "Alimentação elétrica", value: "380V / 60Hz trifásico" },
      { label: "Peso da estrutura", value: "18.200 kg" },
      { label: "Fundação", value: "Concreto armado 800 mm" },
      { label: "Acabamento", value: "Jateamento SA 2.5 + primer epóxi + esmalte PU" },
    ],
    documents: [
      { name: "Manual de Operação — Tombador 12m", type: "PDF", size: "9,8 MB", url: "#" },
      { name: "Manual de Manutenção Preventiva", type: "PDF", size: "6,3 MB", url: "#" },
      { name: "Desenho Técnico — Vista Geral", type: "DWG", size: "2,1 MB", url: "#" },
      { name: "Certificado de Garantia", type: "PDF", size: "380 KB", url: "#" },
      { name: "Laudo NR-12", type: "PDF", size: "2,4 MB", url: "#" },
    ],
    lastMaintenance: "2025-01-20",
    nextMaintenance: "2025-07-20",
    operatingHours: 22800,
  },
  {
    id: "eq_003",
    serialNumber: "PILI-CA01-2022-0089",
    productName: "Coletor de Amostras Pneumático",
    productSlug: "coletor-amostras-pneumatico",
    category: "COLETOR_AMOSTRAS",
    length: "—",
    capacity: "2,5m profundidade",
    installedAt: "2022-04-05",
    installedAddress: "Sede Erechim — Rod. RS-135, Km 42",
    warrantyEndsAt: "2027-04-05",
    status: "manutencao",
    specs: [
      { label: "Tipo", value: "Pneumático automático" },
      { label: "Profundidade de coleta", value: "2.500 mm" },
      { label: "Pontos de amostragem", value: "12 posições" },
      { label: "Sistema de vácuo", value: "5,5 cv" },
      { label: "Rastreabilidade", value: "RFID + QR Code" },
      { label: "Conformidade", value: "MAPA / CONAB" },
      { label: "Interface", value: "Touchscreen 10 pol." },
      { label: "Alimentação", value: "220V / 60Hz monofásico" },
      { label: "Peso", value: "1.850 kg" },
    ],
    documents: [
      { name: "Manual de Operação — Coletor", type: "PDF", size: "5,2 MB", url: "#" },
      { name: "Manual de Calibração", type: "PDF", size: "3,1 MB", url: "#" },
      { name: "Certificado de Garantia", type: "PDF", size: "350 KB", url: "#" },
    ],
    lastMaintenance: "2025-04-10",
    nextMaintenance: "2025-05-20",
    operatingHours: 8900,
  },
];

export const MOCK_SERVICE_ORDERS: PortalServiceOrder[] = [
  {
    id: "os_001",
    number: "OS-2025-0312",
    equipmentId: "eq_003",
    equipmentName: "Coletor de Amostras Pneumático",
    type: "corretiva",
    status: "em_andamento",
    description: "Substituição do sensor de vácuo e recalibração do sistema de amostragem. Sensor apresentou leitura inconsistente durante a safra.",
    createdAt: "2025-05-10",
    scheduledAt: "2025-05-14",
    completedAt: null,
    technician: "Eng. Marcos Ribeiro",
    notes: "Peça de reposição enviada via PILI Store. Previsão de conclusão: 16/05.",
  },
  {
    id: "os_002",
    number: "OS-2025-0298",
    equipmentId: "eq_001",
    equipmentName: "Tombador 30 Metros Fixo",
    type: "preventiva",
    status: "agendada",
    description: "Manutenção preventiva semestral: inspeção dos cilindros hidráulicos, troca de filtros, verificação de alinhamento e teste de pressão.",
    createdAt: "2025-05-01",
    scheduledAt: "2025-06-02",
    completedAt: null,
    technician: "Eng. Carlos Monteiro",
    notes: null,
  },
  {
    id: "os_003",
    number: "OS-2025-0245",
    equipmentId: "eq_002",
    equipmentName: "Tombador 12 Metros Fixo",
    type: "preventiva",
    status: "concluida",
    description: "Manutenção preventiva semestral completa: troca de óleo hidráulico, substituição de filtros, inspeção visual de soldas e pintura.",
    createdAt: "2025-01-10",
    scheduledAt: "2025-01-20",
    completedAt: "2025-01-20",
    technician: "Eng. Marcos Ribeiro",
    notes: "Tudo dentro dos parâmetros. Próxima manutenção em julho/2025.",
  },
  {
    id: "os_004",
    number: "OS-2024-0189",
    equipmentId: "eq_001",
    equipmentName: "Tombador 30 Metros Fixo",
    type: "corretiva",
    status: "concluida",
    description: "Vazamento no cilindro hidráulico #3. Substituição do kit de vedação e teste de estanqueidade.",
    createdAt: "2024-09-05",
    scheduledAt: "2024-09-08",
    completedAt: "2024-09-09",
    technician: "Eng. Carlos Monteiro",
    notes: "Vedação substituída com peças originais PILI. Cilindro operando normalmente.",
  },
  {
    id: "os_005",
    number: "OS-2024-0112",
    equipmentId: "eq_001",
    equipmentName: "Tombador 30 Metros Fixo",
    type: "calibracao",
    status: "concluida",
    description: "Calibração anual dos sensores de inclinação e pressão. Emissão de certificado de calibração.",
    createdAt: "2024-06-15",
    scheduledAt: "2024-06-20",
    completedAt: "2024-06-20",
    technician: "Eng. Marcos Ribeiro",
    notes: "Certificado de calibração emitido. Válido até junho/2025.",
  },
];

export const MOCK_DOCUMENTS: PortalDocument[] = [
  { id: "doc_001", name: "Catálogo Geral PILI 2025", category: "manual", type: "PDF", size: "28,5 MB", url: "#", equipmentId: null, equipmentName: null, updatedAt: "2025-01-15" },
  { id: "doc_002", name: "Manual de Operação — Tombador 30m", category: "manual", type: "PDF", size: "12,4 MB", url: "#", equipmentId: "eq_001", equipmentName: "Tombador 30 Metros Fixo", updatedAt: "2023-06-20" },
  { id: "doc_003", name: "Manual de Operação — Tombador 12m", category: "manual", type: "PDF", size: "9,8 MB", url: "#", equipmentId: "eq_002", equipmentName: "Tombador 12 Metros Fixo", updatedAt: "2021-11-10" },
  { id: "doc_004", name: "Manual de Operação — Coletor de Amostras", category: "manual", type: "PDF", size: "5,2 MB", url: "#", equipmentId: "eq_003", equipmentName: "Coletor de Amostras Pneumático", updatedAt: "2022-04-05" },
  { id: "doc_005", name: "Manual de Manutenção Preventiva — 30m", category: "manual", type: "PDF", size: "8,7 MB", url: "#", equipmentId: "eq_001", equipmentName: "Tombador 30 Metros Fixo", updatedAt: "2023-06-20" },
  { id: "doc_006", name: "Manual de Manutenção Preventiva — 12m", category: "manual", type: "PDF", size: "6,3 MB", url: "#", equipmentId: "eq_002", equipmentName: "Tombador 12 Metros Fixo", updatedAt: "2021-11-10" },
  { id: "doc_007", name: "Certificado de Garantia — TF30 (PILI-TF30-2023-0047)", category: "garantia", type: "PDF", size: "420 KB", url: "#", equipmentId: "eq_001", equipmentName: "Tombador 30 Metros Fixo", updatedAt: "2023-06-20" },
  { id: "doc_008", name: "Certificado de Garantia — TF12 (PILI-TF12-2021-0123)", category: "garantia", type: "PDF", size: "380 KB", url: "#", equipmentId: "eq_002", equipmentName: "Tombador 12 Metros Fixo", updatedAt: "2021-11-10" },
  { id: "doc_009", name: "Certificado de Garantia — CA01 (PILI-CA01-2022-0089)", category: "garantia", type: "PDF", size: "350 KB", url: "#", equipmentId: "eq_003", equipmentName: "Coletor de Amostras Pneumático", updatedAt: "2022-04-05" },
  { id: "doc_010", name: "Laudo NR-12 — Tombador 30m", category: "certificado", type: "PDF", size: "2,8 MB", url: "#", equipmentId: "eq_001", equipmentName: "Tombador 30 Metros Fixo", updatedAt: "2024-06-20" },
  { id: "doc_011", name: "Laudo NR-12 — Tombador 12m", category: "certificado", type: "PDF", size: "2,4 MB", url: "#", equipmentId: "eq_002", equipmentName: "Tombador 12 Metros Fixo", updatedAt: "2024-01-15" },
  { id: "doc_012", name: "ART — Tombador 30m Paranaguá", category: "certificado", type: "PDF", size: "1,1 MB", url: "#", equipmentId: "eq_001", equipmentName: "Tombador 30 Metros Fixo", updatedAt: "2023-06-20" },
  { id: "doc_013", name: "Desenho Técnico — Tombador 30m", category: "desenho", type: "DWG", size: "3,2 MB", url: "#", equipmentId: "eq_001", equipmentName: "Tombador 30 Metros Fixo", updatedAt: "2023-05-10" },
  { id: "doc_014", name: "Desenho Técnico — Tombador 12m", category: "desenho", type: "DWG", size: "2,1 MB", url: "#", equipmentId: "eq_002", equipmentName: "Tombador 12 Metros Fixo", updatedAt: "2021-10-05" },
  { id: "doc_015", name: "Relatório de Manutenção — Jan/2025", category: "relatorio", type: "PDF", size: "1,8 MB", url: "#", equipmentId: "eq_002", equipmentName: "Tombador 12 Metros Fixo", updatedAt: "2025-01-22" },
  { id: "doc_016", name: "Certificado de Calibração — Sensores TF30", category: "certificado", type: "PDF", size: "890 KB", url: "#", equipmentId: "eq_001", equipmentName: "Tombador 30 Metros Fixo", updatedAt: "2024-06-20" },
];

export function getEquipment(id: string) {
  return MOCK_EQUIPMENT.find((e) => e.id === id);
}

export function getServiceOrdersForEquipment(equipmentId: string) {
  return MOCK_SERVICE_ORDERS.filter((o) => o.equipmentId === equipmentId);
}

export function getDocumentsForEquipment(equipmentId: string) {
  return MOCK_DOCUMENTS.filter((d) => d.equipmentId === equipmentId);
}
