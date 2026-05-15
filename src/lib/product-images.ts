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

/** Category -> placeholder image (falls back to real PILI tombador photo) */
const CATEGORY_PLACEHOLDERS: Record<string, string> = {
  TOMBADOR_FIXO: "/images/tombador-pili.jpg",
  TOMBADOR_MOVEL: "/images/tombador-pili.jpg",
  COLETOR_AMOSTRAS: "/images/tombador-pili.jpg",
  UNIDADE_TRANSBORDO: "/images/tombador-pili.jpg",
  ESPECIAL: "/images/tombador-pili.jpg",
};

const DEFAULT_PLACEHOLDER = "/images/tombador-pili.jpg";

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
