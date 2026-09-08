import type { Prisma } from "@prisma/client";

/**
 * Regra única de publicação de produto.
 *
 * Produto sem dado não sai em lugar nenhum — nem na listagem do site, nem na
 * página própria, nem no catálogo em PDF. "Sem dado" é a ausência das duas
 * coisas que fazem uma ficha existir: foto de verdade e ficha técnica.
 *
 * Não é preciso mexer aqui para republicar um produto: basta cadastrar as
 * specs e subir uma foto no painel que ele volta sozinho.
 */

/**
 * Arquivos que não contam como foto do produto.
 *
 * `produtos/*.jpg` é o mesmo placeholder cinza de 79 KB repetido em quase todo
 * o catálogo antigo, e `Gemini_Generated_*` são imagens geradas por IA — não
 * representam o equipamento que a PILI entrega.
 */
export function fotoUsavel(filename: string): boolean {
  return (
    !filename.startsWith("produtos/") &&
    !filename.toLowerCase().startsWith("gemini_generated")
  );
}

/** O mesmo filtro de `fotoUsavel`, escrito para o Prisma. */
const TEM_FOTO_REAL: Prisma.MediaWhereInput = {
  type: "image",
  NOT: [
    { filename: { startsWith: "produtos/" } },
    { filename: { startsWith: "Gemini_Generated", mode: "insensitive" } },
  ],
};

/** Condição para o produto aparecer no site e no catálogo. */
export const PRODUTO_PUBLICAVEL: Prisma.ProductWhereInput = {
  active: true,
  specs: { some: {} },
  media: { some: TEM_FOTO_REAL },
};
