import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "trabalhe" });
  return generatePageMetadata({
    locale,
    title: t("metaTitle"),
    description: t("metaDesc"),
    path: "/trabalhe-conosco",
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
