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
    title: "Trabalhe conosco",
    description: "Vagas e banco de talentos da PILI Industrial em Erechim/RS. Engenharia, produção, comercial e tecnologia numa fábrica com mais de 45 anos.",
    path: "/trabalhe-conosco",
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
