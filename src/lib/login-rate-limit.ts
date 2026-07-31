import { consumeRateLimit, resetRateLimit } from "./rate-limit";
import { logError } from "./prisma-errors";

/**
 * Limitação de tentativas de login.
 *
 * A rota `/api/auth/[...nextauth]` não passa pelo limitador do endpoint
 * público, então o provider de credenciais aceitava tentativas ilimitadas
 * contra contas ADMIN. O limite é aplicado por e-mail — a chave que o atacante
 * precisa adivinhar junto com a senha — e por IP, para conter varredura.
 */

const MAX_ATTEMPTS = 5;
const WINDOW_SECONDS = 15 * 60;

const emailKey = (email: string) => `login:email:${email.toLowerCase().trim()}`;

/**
 * `true` quando a tentativa pode prosseguir.
 *
 * Falha **aberta** de propósito: se a consulta falhar, bloquear todo login
 * trancaria a operação inteira para fora do painel. Na prática, se o banco está
 * indisponível o login não funcionaria de qualquer forma — a verificação de
 * senha também depende dele.
 */
export async function checkLoginAttempt(
  email: string,
  ip: string | null,
): Promise<boolean> {
  try {
    const results = await Promise.all([
      consumeRateLimit({
        key: emailKey(email),
        limit: MAX_ATTEMPTS,
        windowSeconds: WINDOW_SECONDS,
      }),
      consumeRateLimit({
        key: `login:ip:${ip ?? "desconhecido"}`,
        limit: MAX_ATTEMPTS * 4,
        windowSeconds: WINDOW_SECONDS,
      }),
    ]);

    return results.every((r) => r.success);
  } catch (err) {
    logError("LOGIN_RATE_LIMIT", err);
    return true;
  }
}

/** Zera o contador do e-mail após um login bem-sucedido. */
export async function resetLoginAttempts(email: string): Promise<void> {
  await resetRateLimit(emailKey(email));
}
