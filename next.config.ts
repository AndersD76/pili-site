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
  // Tiles do mapa de unidades no rodape. O Leaflet busca cada tile como <img>:
  // sem estes hosts aqui o mapa sobe cinza, sem erro visivel alem do console.
  "img-src 'self' data: blob: https://utfs.io https://uploadthing.com https://pili.ind.br https://tile.openstreetmap.org https://*.tile.openstreetmap.org https://www.google-analytics.com https://www.facebook.com",
  "font-src 'self' data:",
  `connect-src 'self' https://*.upstash.io https://vitals.vercel-insights.com https://www.google-analytics.com https://connect.facebook.net${isDev ? " ws: http://localhost:*" : ""}`,
  "frame-ancestors 'none'",
  // Mapa da pagina de contato (OpenStreetMap, sem chave de API).
  "frame-src https://www.openstreetmap.org",
  "base-uri 'self'",
  "form-action 'self'",
  "worker-src 'self' blob:",
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
    ],
  },
  async redirects() {
    return [
      /**
       * A raiz responde antes do middleware de idioma.
       *
       * O middleware do next-intl mandava um 307 de corpo vazio para /pt-BR, e
       * quem colava "pili.ind.br" no WhatsApp nao via card nenhum: o robo de
       * pre-visualizacao lia a resposta vazia do redirecionamento, sem as tags
       * Open Graph, e desistia. Um 308 permanente e seguido com mais confianca
       * pelos robos e ainda encurta a cadeia apex -> www -> idioma.
       */
      { source: "/", destination: "/pt-BR", permanent: true },
      /**
       * Slugs de produto renomeados pelo painel em 21/09/2026. Os endereços
       * antigos estavam no sitemap, no catálogo em PDF e em mensagens de
       * WhatsApp; sem isto respondiam 404 e perdiam o que já tinham indexado.
       */
      ...[10, 11, 12, 18, 21, 26, 30].map((m) => ({
        source: `/:locale(pt-BR|es)/produtos/tombador-${m}m-fixo`,
        destination: `/:locale/produtos/tombador-caminhao-${m}m-fixo`,
        permanent: true,
      })),
      // O sucessor direto (tombador-26m-graos) ainda não tem dados para ser
      // publicado; até lá o endereço antigo leva ao 26 m que está no ar.
      {
        source: "/:locale(pt-BR|es)/produtos/tombador-26m",
        destination: "/:locale/produtos/tombador-caminhao-26m-fixo",
        permanent: false,
      },
      /**
       * Enderecos do site anterior (Laravel), formato /produto/<Nome>/<id>.
       *
       * O Google ainda devolve esses enderecos nas buscas -- foram anos de
       * indexacao. Depois da migracao respondiam 404: o visitante batia numa
       * pagina de erro e a autoridade acumulada nao passava para o endereco
       * novo.
       *
       * O nome vinha com "+" no lugar do espaco, e "+" e modificador
       * reservado do path-to-regexp: escrito cru, o Next recusa a rota com
       * "Unexpected MODIFIER". Codificar para "%2B" resolve sem escapar
       * caractere a caractere.
       */
      ...Object.entries({
        "Tombador+10+Metros+Fixo": "tombador-caminhao-10m-fixo",
        "Tombador+11+Metros+Fixo": "tombador-caminhao-11m-fixo",
        "Tombador+12+Metros+Fixo": "tombador-caminhao-12m-fixo",
        "Tombador+18+Metros+Fixo": "tombador-caminhao-18m-fixo",
        "Tombador+21+Metros+Fixo": "tombador-caminhao-21m-fixo",
        "Tombador+26+Metros+Fixo": "tombador-caminhao-26m-fixo",
        "Tombador+30+Metros+Fixo": "tombador-caminhao-30m-fixo",
        "Tombador+10+Metros+Movel": "tombador-10m-movel",
        "Tombador+11+Metros+Movel": "tombador-11m-movel",
        "Tombador+12+Metros+Movel": "tombador-12m-movel",
        "Tombador+18+Metros+Movel": "tombador-18m-movel",
        "Tombador+21+Metros+Movel": "tombador-21m-movel",
        "Tombador+26m+Cilindro+Externo": "tombador-26m-graos",
        "Tombador+com+Cabine+Externa": "tombador-cabine-externa",
        "Tombador+com+sistema+de+pesagem": "tombador-com-sistema-de-pesagem",
        "Tombador+de+Batatas": "tombador-de-batatas",
        "Coletor+de+Amostra+de+Graos+PILI": "coletor-amostras",
        "Coletor+de+Amostra+de+Graos+Movel": "coletor-de-amostra-de-graos-movel",
        "Unidade+de+Transbordo+PILI": "unidade-transbordo",
        "Central+Hidraulica+PILI": "central-hidraulica",
      }).flatMap(([nome, slug]) => {
        // `encodeURIComponent` transforma o "+" em "%2B", que o
        // path-to-regexp trata como literal em vez de modificador.
        const caminho = `/produto/${encodeURIComponent(nome)}`;
        const destino = `/pt-BR/produtos/${slug}`;
        return [
          // Com o id no fim, que e o formato indexado pelo Google.
          { source: `${caminho}/:id`, destination: destino, permanent: true },
          // Sem o id: aparecia nos links internos do site antigo.
          { source: caminho, destination: destino, permanent: true },
        ];
      }),
      /**
       * Qualquer outro /produto/... do site antigo vai para a listagem, em vez
       * de 404. Precisa vir DEPOIS dos mapeamentos acima: o Next usa a
       * primeira regra que casar.
       */
      {
        source: "/produto/:resto*",
        destination: "/pt-BR/produtos",
        permanent: true,
      },
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
