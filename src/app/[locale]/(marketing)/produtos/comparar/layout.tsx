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
    title: "Comparar tombadores",
    description: "Compare lado a lado capacidade, comprimento e especificações técnicas dos tombadores hidráulicos PILI Industrial.",
    path: "/produtos/comparar",
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
