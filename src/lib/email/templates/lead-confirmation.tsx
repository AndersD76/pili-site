import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Text,
} from "@react-email/components";

interface LeadConfirmationProps {
  name: string;
  locale?: string;
}

const messages = {
  "pt-BR": {
    preview: "Recebemos seu contato — PILI Industrial",
    heading: "Recebemos seu contato",
    greeting: (name: string) => `Olá, ${name}.`,
    body: "Sua solicitação foi recebida com sucesso. Nossa equipe comercial entrará em contato em até 24 horas úteis.",
    regards: "Atenciosamente,",
    team: "Equipe Comercial PILI Industrial",
  },
  en: {
    preview: "We received your inquiry — PILI Industrial",
    heading: "We received your inquiry",
    greeting: (name: string) => `Hello, ${name}.`,
    body: "Your request has been received successfully. Our sales team will contact you within 24 business hours.",
    regards: "Best regards,",
    team: "PILI Industrial Sales Team",
  },
  es: {
    preview: "Recibimos su consulta — PILI Industrial",
    heading: "Recibimos su consulta",
    greeting: (name: string) => `Hola, ${name}.`,
    body: "Su solicitud fue recibida con éxito. Nuestro equipo comercial se pondrá en contacto en hasta 24 horas hábiles.",
    regards: "Atentamente,",
    team: "Equipo Comercial PILI Industrial",
  },
} as const;

export function LeadConfirmationEmail({
  name,
  locale = "pt-BR",
}: LeadConfirmationProps) {
  const t = messages[locale as keyof typeof messages] ?? messages["pt-BR"];

  return (
    <Html>
      <Head />
      <Preview>{t.preview}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Heading style={heading}>{t.heading}</Heading>
          <Text style={text}>{t.greeting(name)}</Text>
          <Text style={text}>{t.body}</Text>
          <Hr style={hr} />
          <Text style={footer}>
            {t.regards}
            <br />
            {t.team}
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

const text = {
  fontSize: "16px",
  lineHeight: "24px",
  color: "#3D3D3D",
  margin: "0 0 16px",
};

const hr = {
  borderColor: "#D4D4D4",
  margin: "24px 0",
};

const footer = {
  fontSize: "14px",
  lineHeight: "20px",
  color: "#6B6B6B",
  margin: "0",
};
