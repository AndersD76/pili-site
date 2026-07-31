import type { Metadata } from "next";
import { fontVariables } from "@/lib/fonts";
import "../globals.css";

export const metadata: Metadata = {
  title: {
    default: "Admin",
    template: "%s | PILI Admin",
  },
  robots: { index: false, follow: false },
};

/** Root layout do painel. O painel é monolíngue: sempre pt-BR. */
export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning className={fontVariables}>
      <body className="min-h-screen bg-pili-white text-pili-black font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
