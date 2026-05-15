import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: {
    default: "PILI Industrial — Tombadores Hidráulicos",
    template: "%s | PILI Industrial",
  },
  description:
    "Fabricante de tombadores hidráulicos e plataformas de descarga de grãos desde 1979. De 9 a 30 metros, 35 a 100 toneladas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      suppressHydrationWarning
      className={`${montserrat.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen bg-pili-white text-pili-black font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
