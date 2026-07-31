import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as (typeof routing.locales)[number])) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    // Sem declarar, o next-intl herda o fuso do servidor: America/Sao_Paulo na
    // máquina de desenvolvimento e UTC em produção. Datas mudariam de valor
    // entre ambientes sem ninguém perceber localmente.
    timeZone: "America/Sao_Paulo",
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
