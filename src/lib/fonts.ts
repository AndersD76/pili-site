import { Montserrat, JetBrains_Mono } from "next/font/google";

/**
 * Fontes compartilhadas pelos root layouts.
 *
 * O projeto tem três raízes (`[locale]`, `admin`, `portal`) para que cada uma
 * declare o próprio `<html lang>`; as fontes precisam ser instanciadas uma vez
 * e reutilizadas, senão o Next gera arquivos duplicados.
 */

export const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const fontVariables = `${montserrat.variable} ${jetbrainsMono.variable}`;
