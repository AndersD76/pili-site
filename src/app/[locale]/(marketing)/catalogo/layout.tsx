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
    title: "Catálogo de tombadores hidráulicos",
    description: "Catálogo completo PILI Industrial: especificações técnicas, dimensionais e fotos de tombadores de 9 a 30 metros, coletores e unidades de transbordo.",
    path: "/catalogo",
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
