import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return generatePageMetadata({
    locale,
    title: "Calculadora de capacidade de tombador",
    description: "Descubra qual tombador PILI atende sua operação. Cálculo por volume diário, tipo de grão e densidade — resultado imediato e estimativa de ROI.",
    path: "/calculadora",
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
