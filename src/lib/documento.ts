/**
 * CPF e CNPJ: dígitos verificadores e máscara de digitação.
 *
 * O campo do formulário aceita os dois, porque muito produtor rural compra
 * como pessoa física. A conferência aqui é só matemática — confirma que o
 * número foi digitado certo, não que pertence a alguém. Para CNPJ a rota
 * consulta a BrasilAPI depois; para CPF não existe consulta gratuita (a da
 * Receita é paga e restrita pela LGPD), então a checagem para no dígito.
 */

export function apenasDigitos(valor: string): string {
  return valor.replace(/\D/g, "");
}

/** Sequências repetidas passam no cálculo do dígito mas não existem. */
function repetido(d: string): boolean {
  return /^(\d)\1+$/.test(d);
}

export function cpfValido(valor: string): boolean {
  const d = apenasDigitos(valor);
  if (d.length !== 11 || repetido(d)) return false;

  for (const tamanho of [9, 10]) {
    let soma = 0;
    for (let i = 0; i < tamanho; i++) soma += Number(d[i]) * (tamanho + 1 - i);
    const digito = ((soma * 10) % 11) % 10;
    if (digito !== Number(d[tamanho])) return false;
  }
  return true;
}

export function cnpjValido(valor: string): boolean {
  const d = apenasDigitos(valor);
  if (d.length !== 14 || repetido(d)) return false;

  const pesos = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  for (const tamanho of [12, 13]) {
    const p = pesos.slice(pesos.length - tamanho);
    let soma = 0;
    for (let i = 0; i < tamanho; i++) soma += Number(d[i]) * p[i]!;
    const resto = soma % 11;
    const digito = resto < 2 ? 0 : 11 - resto;
    if (digito !== Number(d[tamanho])) return false;
  }
  return true;
}

export type TipoDocumento = "cpf" | "cnpj";

/** `null` quando o número não fecha como CPF nem como CNPJ. */
export function tipoDocumento(valor: string): TipoDocumento | null {
  const d = apenasDigitos(valor);
  if (d.length === 11 && cpfValido(d)) return "cpf";
  if (d.length === 14 && cnpjValido(d)) return "cnpj";
  return null;
}

/**
 * Máscara enquanto a pessoa digita: `000.000.000-00` até 11 dígitos,
 * `00.000.000/0000-00` a partir do 12º — o formato acompanha o tamanho.
 */
export function mascaraDocumento(valor: string): string {
  const d = apenasDigitos(valor).slice(0, 14);

  if (d.length <= 11) {
    return d
      .replace(/^(\d{3})(\d)/, "$1.$2")
      .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d{1,2})$/, ".$1-$2");
  }
  return d
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
}
