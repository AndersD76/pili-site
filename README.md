This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Páginas de mercado de grãos (SEO programático)

Cerca de 5.600 páginas estáticas em `/pt-BR/armazenagem`, `/pt-BR/producao`,
`/pt-BR/armazenadores`, `/pt-BR/unidade-de-recebimento` e `/pt-BR/tombador-para`,
geradas a partir de dado público da Conab (cadastro de armazéns) e do IBGE
(Produção Agrícola Municipal).

- **Atualizar os dados:** `pnpm seo:atualizar`. Baixa as fontes, aplica o gate de
  qualidade e grava o retrato em `src/data/seo/`. O site só lê esse retrato — o
  build nunca depende da Conab ou do IBGE estarem no ar. Commite o resultado.
- **Gate de qualidade:** limites em `src/data/seo/gate.json`. Quem não passa não
  vira página nem entra no sitemap; o motivo de cada recusa fica em
  `data/seo/relatorio-gate.json`.
- **Sitemaps:** `/sitemap.xml` é um índice; cada tipo de página tem o seu arquivo
  em `/sitemaps/<tipo>.xml`. Envie o índice no Search Console.
- **IndexNow (Bing/Yandex):** depois do deploy, `pnpm seo:indexnow` envia só as
  URLs novas ou alteradas.
- **Privacidade:** armazéns de pessoa física entram só em totais; nome, endereço
  e e-mail nunca saem do script.

## Memória em produção (Railway)

- **Heap do Node limitado a 512 MB** no script `start`. Sem o limite o V8 se
  dimensiona pelo container (24 GB no Railway, o que dá um teto de ~4 GB) e
  adia a coleta de lixo. Medido sob varredura de robô em todas as páginas, o
  heap vivo fica em ~120 MB e não passa de ~220 MB.
- **O grosso da memória que o Railway cobra não é do Node.** É o cache de
  página do Linux sobre os arquivos do ISR em `.next/server/app`: ~2,8 GB em
  ~77 mil arquivos, porque cada página de mercado de grãos grava ~470 KB entre
  HTML, RSC e segmentos. Cada leitura e cada regeneração desses arquivos entra
  na conta do container. Uma varredura completa leva o container de 0,5 GB a
  3,7 GB; as regenerações seguintes, a 6,7 GB. O Node fica em ~0,4 GB.
- **O que segura isso é o limite de memória do serviço** (Settings → Resource
  limits). Com 1 GB o kernel devolve o cache ao chegar no teto: o mesmo teste
  ficou em 1 GB, sem OOM e sem perder velocidade.
