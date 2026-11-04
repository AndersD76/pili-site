/**
 * Máscara de telefone brasileiro, aplicada enquanto a pessoa digita.
 *
 * `(54) 99999-9999` para celular e `(54) 3522-2828` para fixo — o formato
 * muda sozinho conforme o número de dígitos. Aceita colar com DDI (`+55 54
 * 9 9999-9999`): o 55 inicial sai quando sobra dígito para isso.
 *
 * Só vale no site em português. Na versão em espanhol o visitante é do
 * Paraguai, da Argentina ou do Uruguai, com outro formato de número, e uma
 * máscara brasileira cortaria o telefone dele.
 */
export function mascaraTelefoneBR(valor: string): string {
  let d = valor.replace(/\D/g, "");

  // Colado com DDI: 55 + DDD + número passa de 11 dígitos.
  if (d.length > 11 && d.startsWith("55")) d = d.slice(2);
  d = d.slice(0, 11);

  if (d.length === 0) return "";
  if (d.length <= 2) return `(${d}`;

  const ddd = d.slice(0, 2);
  const resto = d.slice(2);

  // Celular tem 9 dígitos depois do DDD (11 no total); fixo, 8 (10 no total).
  if (resto.length <= 4) return `(${ddd}) ${resto}`;
  if (d.length <= 10) return `(${ddd}) ${resto.slice(0, 4)}-${resto.slice(4)}`;
  return `(${ddd}) ${resto.slice(0, 5)}-${resto.slice(5)}`;
}

/**
 * DDDs em uso no Brasil (plano de numeração da Anatel).
 *
 * Não são todos os números de 11 a 99: 20, 23, 25, 26, 29, 30, 36, 39, 40, 50,
 * 52, 56 a 60, 70, 72, 76, 78, 80 e 90 não existem. O lead do Roblox de
 * 04/11/2026 veio com DDD 23 — passaria em qualquer checagem de tamanho.
 */
const DDDS = new Set([
  11, 12, 13, 14, 15, 16, 17, 18, 19,
  21, 22, 24, 27, 28,
  31, 32, 33, 34, 35, 37, 38,
  41, 42, 43, 44, 45, 46, 47, 48, 49,
  51, 53, 54, 55,
  61, 62, 63, 64, 65, 66, 67, 68, 69,
  71, 73, 74, 75, 77, 79,
  81, 82, 83, 84, 85, 86, 87, 88, 89,
  91, 92, 93, 94, 95, 96, 97, 98, 99,
]);

/**
 * O número existe no formato brasileiro?
 *
 * Celular: DDD + 9 dígitos começando por 9. Fixo: DDD + 8 dígitos começando
 * de 2 a 5. Não confirma que o número está ativo — isso só com SMS, que é
 * pago — mas barra o número inventado, que é o caso que aparecia no painel.
 */
export function telefoneBRValido(valor: string): boolean {
  let d = valor.replace(/\D/g, "");
  if (d.length > 11 && d.startsWith("55")) d = d.slice(2);
  if (d.length !== 10 && d.length !== 11) return false;

  if (!DDDS.has(Number(d.slice(0, 2)))) return false;

  const numero = d.slice(2);
  if (numero.length === 9) return numero[0] === "9";
  return /^[2-5]/.test(numero);
}

/**
 * O telefone é de outro país? Começa com `+` e um DDI que não é o 55.
 *
 * Os leads do site em espanhol chegam com país "BR" — o formulário não tem
 * seletor de país —, então o país não serve para decidir se o número deve
 * seguir o formato brasileiro. Um `+591` boliviano chegou assim.
 */
export function telefoneEstrangeiro(valor: string): boolean {
  const limpo = valor.trim();
  return limpo.startsWith("+") && !limpo.replace(/\D/g, "").startsWith("55");
}
