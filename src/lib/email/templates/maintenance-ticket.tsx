import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface MaintenanceTicketProps {
  number: number;
  type: string;
  urgency: string;
  description: string;
  contactName: string;
  contactPhone: string;
  clientName: string;
  clientEmail: string;
  clientCompany: string | null;
  equipmentName: string;
  serialNumber: string;
  installedAddress: string | null;
  createdAt: Date;
}

const TIPOS: Record<string, string> = {
  CORRETIVA: "Corretiva — equipamento com defeito",
  PREVENTIVA: "Preventiva — manutenção programada",
  INSTALACAO: "Instalação ou posta em marcha",
  DUVIDA_TECNICA: "Dúvida técnica",
  OUTRO: "Outro",
};

const URGENCIAS: Record<string, string> = {
  PARADA: "EQUIPAMENTO PARADO",
  ALTA: "Alta",
  MEDIA: "Média",
  BAIXA: "Baixa",
};

/**
 * Ticket de manutenção enviado ao comercial.
 *
 * O número do chamado e o equipamento vão no assunto e no topo porque são o
 * que a equipe usa para localizar o cliente no ERP.
 */
export function MaintenanceTicketEmail({
  number,
  type,
  urgency,
  description,
  contactName,
  contactPhone,
  clientName,
  clientEmail,
  clientCompany,
  equipmentName,
  serialNumber,
  installedAddress,
  createdAt,
}: MaintenanceTicketProps) {
  const parado = urgency === "PARADA";

  return (
    <Html>
      <Head />
      <Preview>{`Chamado #${number} — ${equipmentName} (${serialNumber})`}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Heading style={heading}>Chamado de manutenção #{number}</Heading>

          {parado && (
            <Text style={alerta}>
              Equipamento parado — o cliente sinalizou operação interrompida.
            </Text>
          )}

          <Section style={section}>
            <Text style={label}>Equipamento</Text>
            <Text style={value}>{equipmentName}</Text>

            <Text style={label}>Número de série</Text>
            <Text style={mono}>{serialNumber}</Text>

            {installedAddress && (
              <>
                <Text style={label}>Local de instalação</Text>
                <Text style={value}>{installedAddress}</Text>
              </>
            )}
          </Section>

          <Hr style={hr} />

          <Section style={section}>
            <Text style={label}>Tipo</Text>
            <Text style={value}>{TIPOS[type] ?? type}</Text>

            <Text style={label}>Urgência</Text>
            <Text style={parado ? valueDestaque : value}>
              {URGENCIAS[urgency] ?? urgency}
            </Text>

            <Text style={label}>Descrição</Text>
            <Text style={value}>{description}</Text>
          </Section>

          <Hr style={hr} />

          <Section style={section}>
            <Text style={label}>Contato no local</Text>
            <Text style={value}>
              {contactName} — {contactPhone}
            </Text>

            <Text style={label}>Cliente</Text>
            <Text style={value}>
              {clientName}
              {clientCompany ? ` — ${clientCompany}` : ""}
            </Text>

            <Text style={label}>E-mail do cliente</Text>
            <Text style={value}>{clientEmail}</Text>
          </Section>

          <Hr style={hr} />

          <Text style={meta}>
            Aberto em{" "}
            {createdAt.toLocaleString("pt-BR", {
              timeZone: "America/Sao_Paulo",
            })}{" "}
            pelo portal do cliente. Responder este e-mail vai direto para o
            cliente.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const body = {
  backgroundColor: "#F5F5F5",
  fontFamily: "system-ui, -apple-system, sans-serif",
};

const container = {
  margin: "40px auto",
  padding: "32px",
  maxWidth: "560px",
  backgroundColor: "#FFFFFF",
};

const heading = {
  fontSize: "24px",
  fontWeight: "700" as const,
  color: "#0A0A0A",
  margin: "0 0 24px",
};

const alerta = {
  fontSize: "14px",
  fontWeight: "700" as const,
  color: "#B91C1C",
  backgroundColor: "#FEF2F2",
  padding: "12px 16px",
  margin: "0 0 20px",
};

const section = { margin: "0 0 16px" };

const label = {
  fontSize: "12px",
  fontWeight: "600" as const,
  color: "#6B6B6B",
  textTransform: "uppercase" as const,
  letterSpacing: "0.05em",
  margin: "12px 0 2px",
};

const value = {
  fontSize: "16px",
  color: "#0A0A0A",
  margin: "0 0 8px",
};

const valueDestaque = {
  ...value,
  fontWeight: "700" as const,
  color: "#B91C1C",
};

const mono = {
  ...value,
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
};

const hr = {
  borderColor: "#D4D4D4",
  margin: "24px 0",
};

const meta = {
  fontSize: "12px",
  color: "#9A9A9A",
  margin: "0",
};
