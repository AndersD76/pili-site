import { Archivo, IBM_Plex_Mono } from "next/font/google";

/**
 * Fontes compartilhadas pelos root layouts.
 *
 * O projeto tem três raízes (`[locale]`, `admin`, `portal`) para que cada uma
 * declare o próprio `<html lang>`; as fontes precisam ser instanciadas uma vez
 * e reutilizadas, senão o Next gera arquivos duplicados.
 */

export const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  // 900 cobre o "Archivo Black" do manual; 800/600/400 sao os pesos da
  // hierarquia de titulos, subtitulos e corpo.
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const plexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const fontVariables = `${archivo.variable} ${plexMono.variable}`;
