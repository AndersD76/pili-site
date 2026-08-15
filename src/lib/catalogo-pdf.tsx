import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";
/* eslint-disable jsx-a11y/alt-text -- @react-pdf/renderer Image has no alt prop */
import type { ProductCategory } from "@prisma/client";

const PILI_RED = "#E00010";
const PILI_BLACK = "#17181B";
const PILI_GRAY = "#6B7280";
const PILI_LIGHT = "#F5F5F5";

const s = StyleSheet.create({
  page: { padding: 40, fontFamily: "Helvetica", fontSize: 9, color: PILI_BLACK },
  coverPage: {
    padding: 0,
    backgroundColor: PILI_BLACK,
    justifyContent: "center",
    alignItems: "center",
  },
  coverLogo: { width: 160, marginBottom: 40 },
  coverTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 28,
    color: "white",
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 3,
  },
  coverSub: {
    fontSize: 12,
    color: PILI_GRAY,
    textAlign: "center",
    marginTop: 12,
  },
  coverBar: {
    width: 60,
    height: 3,
    backgroundColor: PILI_RED,
    marginTop: 30,
  },
  coverFooter: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 8,
    color: PILI_GRAY,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: PILI_LIGHT,
  },
  headerLogo: { width: 70 },
  headerText: { fontSize: 7, color: PILI_GRAY },
  catHeader: {
    fontFamily: "Helvetica-Bold",
    fontSize: 16,
    color: PILI_BLACK,
    textTransform: "uppercase",
    marginBottom: 4,
    letterSpacing: 1,
  },
  catBar: { width: 40, height: 2, backgroundColor: PILI_RED, marginBottom: 16 },
  productCard: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: PILI_LIGHT,
    borderRadius: 4,
  },
  productRow: { flexDirection: "row", gap: 16 },
  productImageCol: { width: 140 },
  productImage: { width: 140, height: 105, objectFit: "cover", borderRadius: 3 },
  productInfoCol: { flex: 1 },
  productName: { fontFamily: "Helvetica-Bold", fontSize: 13, marginBottom: 3 },
  productTagline: { fontSize: 9, color: PILI_GRAY, marginBottom: 8 },
  productDesc: { fontSize: 8, lineHeight: 1.4, color: "#374151", marginBottom: 10 },
  specGrid: { flexDirection: "row", flexWrap: "wrap", gap: 0 },
  specItem: {
    flexDirection: "row",
    width: "50%",
    paddingVertical: 3,
    paddingRight: 8,
  },
  specLabel: { fontFamily: "Helvetica-Bold", fontSize: 8, width: "45%", color: PILI_BLACK },
  specValue: { fontSize: 8, color: "#374151" },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 7,
    color: PILI_GRAY,
  },
  backPage: {
    padding: 0,
    backgroundColor: PILI_BLACK,
    justifyContent: "center",
    alignItems: "center",
  },
  backTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 18,
    color: "white",
    textAlign: "center",
    marginBottom: 20,
  },
  backBar: {
    width: 40,
    height: 2,
    backgroundColor: PILI_RED,
    marginBottom: 20,
  },
  backInfo: { fontSize: 10, color: PILI_GRAY, textAlign: "center", lineHeight: 1.6 },
  backSite: {
    fontFamily: "Helvetica-Bold",
    fontSize: 12,
    color: PILI_RED,
    marginTop: 24,
  },
});

const CATEGORY_LABELS: Record<string, string> = {
  TOMBADOR_FIXO: "Tombadores Fixos",
  TOMBADOR_MOVEL: "Tombadores Moveis",
  COLETOR_AMOSTRAS: "Coletores de Amostras",
  UNIDADE_TRANSBORDO: "Unidades de Transbordo",
  ESPECIAL: "Equipamentos Especiais",
};

const CATEGORY_ORDER: ProductCategory[] = [
  "TOMBADOR_FIXO",
  "TOMBADOR_MOVEL",
  "COLETOR_AMOSTRAS",
  "UNIDADE_TRANSBORDO",
  "ESPECIAL",
];

export interface ProdutoPdf {
  slug: string;
  category: ProductCategory;
  name: string;
  tagline: string;
  description: string;
  specs: { label: string; value: string }[];
  imageDataUri: string | null;
}

export interface CatalogoPdfProps {
  produtos: ProdutoPdf[];
  logoDataUri: string;
  logoWhiteDataUri: string;
  contato: {
    telefone: string;
    email: string;
    site: string;
    endereco: string;
  };
  geradoEm: string;
}

export function CatalogoPdf({
  produtos,
  logoDataUri,
  logoWhiteDataUri,
  contato,
  geradoEm,
}: CatalogoPdfProps) {
  const porCategoria = CATEGORY_ORDER
    .map((cat) => ({
      key: cat,
      label: CATEGORY_LABELS[cat] ?? cat,
      items: produtos.filter((p) => p.category === cat),
    }))
    .filter((g) => g.items.length > 0);

  return (
    <Document
      title="Catalogo de Produtos PILI Industrial"
      author="PILI Industrial"
      subject="Tombadores hidraulicos e equipamentos para movimentacao de graneis"
    >
      <Page size="A4" style={s.coverPage}>
        <Image src={logoWhiteDataUri} style={s.coverLogo} />
        <Text style={s.coverTitle}>Catalogo de{"\n"}Produtos</Text>
        <Text style={s.coverSub}>Tombadores hidraulicos e equipamentos industriais</Text>
        <View style={s.coverBar} />
        <Text style={s.coverFooter}>
          {contato.site} | {contato.telefone} | {geradoEm}
        </Text>
      </Page>

      {porCategoria.map((grupo) => (
        <Page key={grupo.key} size="A4" style={s.page} wrap>
          <View style={s.header} fixed>
            <Image src={logoDataUri} style={s.headerLogo} />
            <Text style={s.headerText}>Catalogo de Produtos</Text>
          </View>

          <Text style={s.catHeader}>{grupo.label}</Text>
          <View style={s.catBar} />

          {grupo.items.map((p) => (
            <View key={p.slug} style={s.productCard} wrap={false}>
              <View style={s.productRow}>
                {p.imageDataUri && (
                  <View style={s.productImageCol}>
                    <Image src={p.imageDataUri} style={s.productImage} />
                  </View>
                )}
                <View style={s.productInfoCol}>
                  <Text style={s.productName}>{p.name}</Text>
                  {p.tagline && <Text style={s.productTagline}>{p.tagline}</Text>}
                  {p.description && (
                    <Text style={s.productDesc}>
                      {p.description.length > 250
                        ? p.description.slice(0, 250).trimEnd() + "..."
                        : p.description}
                    </Text>
                  )}
                  {p.specs.length > 0 && (
                    <View style={s.specGrid}>
                      {p.specs.slice(0, 10).map((spec, i) => (
                        <View key={i} style={s.specItem}>
                          <Text style={s.specLabel}>{spec.label}</Text>
                          <Text style={s.specValue}>{spec.value}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              </View>
            </View>
          ))}

          <View style={s.footer} fixed>
            <Text>PILI Industrial</Text>
            <Text render={({ pageNumber }) => `${pageNumber}`} />
          </View>
        </Page>
      ))}

      <Page size="A4" style={s.backPage}>
        <Text style={s.backTitle}>Entre em contato</Text>
        <View style={s.backBar} />
        <Text style={s.backInfo}>
          {contato.endereco}{"\n"}
          {contato.telefone} | {contato.email}{"\n"}
        </Text>
        <Text style={s.backSite}>{contato.site}</Text>
      </Page>
    </Document>
  );
}
