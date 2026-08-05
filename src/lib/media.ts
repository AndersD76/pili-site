/**
 * Regras de upload de mídia.
 *
 * Os bytes ficam no Postgres (ver `Media` no schema). O volume do site é
 * pequeno e não justifica armazenamento externo — mas isso torna a validação
 * de tipo e tamanho obrigatória, não opcional: cada arquivo aceito ocupa espaço
 * no banco e trafega em toda leitura sem cache.
 */

/** Tipos aceitos. Lista fechada — nada de `image/*`. */
export const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
] as const;

export type AllowedMimeType = (typeof ALLOWED_MIME_TYPES)[number];

/** 4 MB. Acima disso a foto deve ser otimizada antes de subir. */
export const MAX_FILE_SIZE = 4 * 1024 * 1024;

export const MAX_FILE_SIZE_LABEL = "4 MB";

/** Extensões correspondentes, para o `accept` do input. */
export const ACCEPT_ATTRIBUTE = ".jpg,.jpeg,.png,.webp,.avif";

export function isAllowedMimeType(value: string): value is AllowedMimeType {
  return (ALLOWED_MIME_TYPES as readonly string[]).includes(value);
}

/**
 * Confere a assinatura binária do arquivo.
 *
 * O `type` do `File` vem do navegador e é trivialmente forjável. Ler os magic
 * bytes garante que um `.jpg` renomeado a partir de um executável não entre.
 */
export function detectImageType(bytes: Uint8Array): AllowedMimeType | null {
  if (bytes.length < 12) return null;

  // JPEG: FF D8 FF
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return "image/jpeg";
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  const png = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
  if (png.every((b, i) => bytes[i] === b)) return "image/png";

  // RIFF....WEBP
  const riff = [0x52, 0x49, 0x46, 0x46];
  const webp = [0x57, 0x45, 0x42, 0x50];
  if (
    riff.every((b, i) => bytes[i] === b) &&
    webp.every((b, i) => bytes[8 + i] === b)
  ) {
    return "image/webp";
  }

  // AVIF: ....ftypavif
  const ftyp = [0x66, 0x74, 0x79, 0x70];
  const avif = [0x61, 0x76, 0x69, 0x66];
  if (
    ftyp.every((b, i) => bytes[4 + i] === b) &&
    avif.every((b, i) => bytes[8 + i] === b)
  ) {
    return "image/avif";
  }

  return null;
}

/** Caminho público de um arquivo já gravado. */
export function mediaUrl(id: string): string {
  return `/api/media/${id}`;
}

/** Tamanho legível para a biblioteca. */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/* ------------------------------------------------------------ currículos */

/**
 * Tipos aceitos para currículo. PDF e os dois formatos do Word cobrem o que
 * chega na prática; imagem não entra, para o arquivo continuar legível por
 * quem for ler.
 */
export const ALLOWED_CV_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
] as const;

export type AllowedCvType = (typeof ALLOWED_CV_TYPES)[number];

/** 5 MB. Um currículo acima disso é quase sempre scan sem compressão. */
export const MAX_CV_SIZE = 5 * 1024 * 1024;
export const MAX_CV_SIZE_LABEL = "5 MB";
export const ACCEPT_CV_ATTRIBUTE = ".pdf,.doc,.docx";

/**
 * Confere a assinatura binária do currículo.
 *
 * Mesma razão do `detectImageType`: o `type` informado pelo navegador é
 * forjável, e aqui o arquivo será baixado depois por uma pessoa.
 */
export function detectCvType(bytes: Uint8Array): AllowedCvType | null {
  if (bytes.length < 8) return null;

  // PDF: %PDF-
  const pdf = [0x25, 0x50, 0x44, 0x46, 0x2d];
  if (pdf.every((b, i) => bytes[i] === b)) return "application/pdf";

  // DOCX é um zip: PK
  if (
    bytes[0] === 0x50 &&
    bytes[1] === 0x4b &&
    bytes[2] === 0x03 &&
    bytes[3] === 0x04
  ) {
    return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  }

  // .doc legado (OLE2): D0 CF 11 E0 A1 B1 1A E1
  const ole = [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1];
  if (ole.every((b, i) => bytes[i] === b)) return "application/msword";

  return null;
}
