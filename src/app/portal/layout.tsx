import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Portal do Cliente",
    template: "%s | Portal do Cliente | PILI",
  },
  robots: { index: false, follow: false },
};

export default function PortalRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
