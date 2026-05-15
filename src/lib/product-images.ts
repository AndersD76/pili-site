/**
 * Product image mapping.
 *
 * When real photos are available, add entries to PRODUCT_IMAGES keyed
 * by the product slug (e.g. "tombador-30m-fixo": "/images/tombadores/tombador-30m-fixo.jpg").
 *
 * For products without a dedicated photo the helper falls back to a
 * category-specific SVG placeholder stored in public/images/tombadores/.
 */

/** Map of slug -> real image path (relative to public/) */
const PRODUCT_IMAGES: Record<string, string> = {
  // Uncomment / add entries as real photos become available:
  // "tombador-30m-fixo": "/images/tombadores/tombador-30m-fixo.jpg",
  // "tombador-10m-fixo": "/images/tombadores/tombador-10m-fixo.jpg",
};

/** Category -> SVG placeholder */
const CATEGORY_PLACEHOLDERS: Record<string, string> = {
  TOMBADOR_FIXO: "/images/tombadores/placeholder-fixo.svg",
  TOMBADOR_MOVEL: "/images/tombadores/placeholder-movel.svg",
  COLETOR_AMOSTRAS: "/images/tombadores/placeholder-coletor.svg",
  UNIDADE_TRANSBORDO: "/images/tombadores/placeholder-transbordo.svg",
  ESPECIAL: "/images/tombadores/placeholder-especial.svg",
};

const DEFAULT_PLACEHOLDER = "/images/tombadores/placeholder.svg";

/**
 * Returns the best available image path for a product.
 * Priority: real photo > category placeholder > generic placeholder.
 */
export function getProductImage(slug: string, category: string): string {
  return (
    PRODUCT_IMAGES[slug] ??
    CATEGORY_PLACEHOLDERS[category] ??
    DEFAULT_PLACEHOLDER
  );
}
