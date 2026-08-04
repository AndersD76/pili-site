import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const isDev = process.env.NODE_ENV === "development";

/**
 * `unsafe-inline`/`unsafe-eval` em script-src são exigidos pelo runtime do
 * Next.js (hidratação e, em dev, o Fast Refresh). Trocar por nonce exige um
 * middleware por requisição — anotado como próximo passo.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://connect.facebook.net https://va.vercel-scripts.com${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://utfs.io https://uploadthing.com https://pili.ind.br https://images.unsplash.com https://www.google-analytics.com https://www.facebook.com",
  "font-src 'self' data:",
  `connect-src 'self' https://*.upstash.io https://vitals.vercel-insights.com https://www.google-analytics.com https://connect.facebook.net${isDev ? " ws: http://localhost:*" : ""}`,
  "frame-ancestors 'none'",
  // Mapa da pagina de contato (OpenStreetMap, sem chave de API).
  "frame-src https://www.openstreetmap.org",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const nextConfig: NextConfig = {
  // Existe um `package-lock.json` órfão acima do projeto (no diretório do
  // usuário) que o Next elegia como raiz do workspace, afetando o tracing de
  // arquivos no build. Fixar a raiz elimina o aviso e o risco.
  turbopack: { root: import.meta.dirname },
  outputFileTracingRoot: import.meta.dirname,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
      },
      {
        protocol: "https",
        hostname: "uploadthing.com",
      },
      {
        protocol: "https",
        hostname: "pili.ind.br",
      },
      {
        // Imagens de capa dos artigos em `lib/data/blog.ts` ainda são
        // placeholders do Unsplash. Substituir por fotos próprias e remover.
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async redirects() {
    return [
      // VK2 legacy redirects (add mappings as discovered)
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          { key: "Content-Security-Policy", value: csp },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
