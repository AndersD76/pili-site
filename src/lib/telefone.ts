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
