import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

/**
 * Negociação de idioma do site público.
 *
 * Arquivo nomeado `proxy.ts` (e não `middleware.ts`): a convenção `middleware`
 * está deprecada no Next.js 16 e o build emitia aviso a cada compilação.
 *
 * O matcher exclui `/admin`, `/portal` e `/api` de propósito — essas áreas são
 * monolíngues e a autorização delas é feita nos guards do servidor, não aqui.
 */
export default createMiddleware(routing);

export const config = {
  matcher: [
    "/",
    "/(pt-BR|en|es)/:path*",
    "/((?!api|_next|_vercel|admin|portal|.*\\..*).*)",
  ],
};
