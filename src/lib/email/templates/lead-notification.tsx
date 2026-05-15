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

interface LeadNotificationProps {
  name: string;
  email: string;
  phone: string;
  company?: string;
  application?: string;
  productInterest?: string;
  message?: string;
  source: string;
  pageUrl?: string;
}

export function LeadNotificationEmail({
  name,
  email,
  phone,
  company,
  application,
  productInterest,
  message,
  source,
  pageUrl,
}: LeadNotificationProps) {
  return (
    <Html>
      <Head />
      <Preview>
        Novo lead: {name} — {company ?? "sem empresa"}
      </Preview>
      <Body style={body}>
        <Container style={container}>
          <Heading style={heading}>Novo Lead Recebido</Heading>

          <Section style={section}>
            <Text style={label}>Nome</Text>
            <Text style={value}>{name}</Text>

            <Text style={label}>Email</Text>
            <Text style={value}>{email}</Text>

            <Text style={label}>Telefone</Text>
            <Text style={value}>{phone}</Text>

            {company && (
              <>
                <Text style={label}>Empresa</Text>
                <Text style={value}>{company}</Text>
              </>
            )}

            {application && (
              <>
                <Text style={label}>Aplicação</Text>
                <Text style={value}>{application}</Text>
              </>
            )}

            {productInterest && (
              <>
                <Text style={label}>Produto de interesse</Text>
                <Text style={value}>{productInterest}</Text>
              </>
            )}

            {message && (
              <>
                <Text style={label}>Mensagem</Text>
                <Text style={value}>{message}</Text>
              </>
            )}
          </Section>

          <Hr style={hr} />

          <Text style={meta}>
            Fonte: {source} | Página: {pageUrl ?? "N/A"}
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

const hr = {
  borderColor: "#D4D4D4",
  margin: "24px 0",
};

const meta = {
  fontSize: "12px",
  color: "#9A9A9A",
  margin: "0",
};
