"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { X, Send, ExternalLink } from "lucide-react";
import { GiorgiaMark } from "./giorgia-mark";

interface ChatMessage {
  text: string;
  from: "bot" | "user";
}

interface QuickAction {
  /** Chave em `giorgia.actions` — o rótulo é traduzido no render. */
  key: "produtos" | "orcamento" | "consultor" | "empresa" | "suporte";
  type: "route" | "external";
  target: string;
}

const QUICK_ACTIONS: QuickAction[] = [
  { key: "produtos", type: "route", target: "/produtos" },
  { key: "orcamento", type: "route", target: "/orcamento" },
  { key: "consultor", type: "external", target: "whatsapp" },
  { key: "empresa", type: "route", target: "/empresa" },
  { key: "suporte", type: "route", target: "/contato" },
];

/**
 * GiorgIA — assistente virtual da PILI Industrial.
 *
 * O número do WhatsApp chega por prop porque este é um Client Component: quem
 * lê `SiteSettings` é o layout, no servidor. Antes vinha fixo de `constants.ts`
 * e ignorava o número configurado no painel.
 */
export function Giorgia({ whatsapp }: { whatsapp: string }) {
  const router = useRouter();
  const t = useTranslations("giorgia");
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typingIndex, setTypingIndex] = useState(0);
  const [showActions, setShowActions] = useState(false);
  const [visibleActions, setVisibleActions] = useState(0);
  const replyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [input, setInput] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  const welcome = [t("welcome1"), t("welcome2")];
  const totalWelcome = welcome.length;

  const handleOpen = useCallback(() => {
    setMessages([]);
    setTypingIndex(0);
    setShowActions(false);
    setVisibleActions(0);
    setOpen(true);
  }, []);

  /* ---------- Sequência de boas-vindas ---------- */
  useEffect(() => {
    if (!open) return;

    const timers: ReturnType<typeof setTimeout>[] = [];

    welcome.forEach((text, i) => {
      const timer = setTimeout(
        () => {
          setMessages((prev) => [...prev, { text, from: "bot" }]);
          setTypingIndex(i + 1);

          if (i === welcome.length - 1) {
            timers.push(setTimeout(() => setShowActions(true), 400));
          }
        },
        (i + 1) * 900,
      );
      timers.push(timer);
    });

    return () => timers.forEach(clearTimeout);
    // `welcome` é recriado a cada render; a sequência depende só de `open`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  /* ---------- Entrada sequencial das ações rápidas ---------- */
  useEffect(() => {
    if (!showActions) return;
    if (visibleActions >= QUICK_ACTIONS.length) return;

    const timer = setTimeout(() => setVisibleActions((v) => v + 1), 100);
    return () => clearTimeout(timer);
  }, [showActions, visibleActions]);

  /* ---------- Limpa a resposta pendente ao desmontar ---------- */
  useEffect(() => {
    return () => {
      if (replyTimerRef.current) clearTimeout(replyTimerRef.current);
    };
  }, []);

  /* ---------- Auto-scroll ---------- */
  useEffect(() => {
    bodyRef.current?.scrollTo({
      top: bodyRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, showActions, visibleActions]);

  const handleAction = useCallback(
    (action: QuickAction) => {
      if (action.type === "route") {
        setOpen(false);
        router.push(action.target);
        return;
      }
      if (action.target === "whatsapp") {
        const url = `https://wa.me/${whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(
          t("whatsappMessage"),
        )}`;
        window.open(url, "_blank", "noopener,noreferrer");
      }
    },
    [router, whatsapp, t],
  );

  const handleSend = useCallback(() => {
    const text = input.trim();
    if (!text) return;

    setMessages((prev) => [...prev, { text, from: "user" }]);
    setInput("");

    replyTimerRef.current = setTimeout(() => {
      setMessages((prev) => [...prev, { text: t("autoReply"), from: "bot" }]);
    }, 1000);
  }, [input, t]);

  const isTyping = open && typingIndex < totalWelcome;

  return (
    <>
      {/* -------- Botão flutuante -------- */}
      {!open && (
        <button
          type="button"
          onClick={handleOpen}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className="fixed bottom-(--fab-bottom) right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-pili-safety text-pili-white shadow-lg transition-all hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pili-safety focus-visible:ring-offset-2"
          aria-label={t("open")}
        >
          <span className="absolute inset-0 animate-[robo-ping_2.5s_ease-in-out_infinite] rounded-full bg-pili-safety opacity-40" />

          <GiorgiaMark className="relative h-7 w-7" />

          <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-pili-graphite text-[10px] font-bold leading-none text-pili-white">
            1
          </span>

          {showTooltip && (
            <span className="absolute bottom-full right-0 mb-2 whitespace-nowrap rounded-lg bg-pili-graphite px-3 py-1.5 text-sm text-pili-white shadow-md">
              {t("tooltip")}
              <span className="absolute -bottom-1 right-5 h-2 w-2 rotate-45 bg-pili-graphite" />
            </span>
          )}
        </button>
      )}

      {/* -------- Painel de conversa -------- */}
      {open && (
        <div
          className="fixed bottom-(--fab-bottom) right-6 z-40 flex w-[calc(100vw-3rem)] max-w-[380px] animate-[robo-slide-up_0.3s_ease-out] flex-col overflow-hidden rounded-2xl bg-pili-white shadow-2xl sm:w-[380px]"
          style={{
            height: "min(500px, calc(100vh - var(--fab-bottom) - 2rem))",
          }}
          role="dialog"
          aria-label={t("dialogLabel")}
        >
          {/* Cabeçalho */}
          <div className="flex items-center gap-3 bg-pili-graphite px-4 py-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-pili-safety text-pili-white">
              <GiorgiaMark className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold leading-tight text-pili-white">
                GiorgIA
              </p>
              <p className="text-xs text-pili-cement">{t("role")}</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-full text-pili-cement transition-colors hover:bg-pili-steel hover:text-pili-white"
              aria-label={t("close")}
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Conversa */}
          <div
            ref={bodyRef}
            className="flex-1 space-y-3 overflow-y-auto bg-pili-paper p-4"
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    msg.from === "bot"
                      ? "rounded-bl-md bg-pili-white text-pili-black shadow-sm"
                      : "rounded-br-md bg-pili-safety text-pili-white"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="flex gap-1 rounded-2xl rounded-bl-md bg-pili-white px-4 py-3 shadow-sm">
                  <span className="h-2 w-2 animate-[robo-dot_1.4s_ease-in-out_infinite] rounded-full bg-pili-cement" />
                  <span className="h-2 w-2 animate-[robo-dot_1.4s_ease-in-out_0.2s_infinite] rounded-full bg-pili-cement" />
                  <span className="h-2 w-2 animate-[robo-dot_1.4s_ease-in-out_0.4s_infinite] rounded-full bg-pili-cement" />
                </div>
              </div>
            )}

            {showActions && (
              <div className="flex flex-wrap gap-2 pt-1">
                {QUICK_ACTIONS.map((action, i) => (
                  <button
                    key={action.key}
                    type="button"
                    onClick={() => handleAction(action)}
                    className={`inline-flex items-center gap-1.5 rounded-full border border-pili-mist bg-pili-white px-3 py-1.5 text-xs font-medium text-pili-graphite shadow-sm transition-all duration-300 hover:border-pili-safety hover:text-pili-safety ${
                      i < visibleActions
                        ? "translate-y-0 opacity-100"
                        : "pointer-events-none translate-y-2 opacity-0"
                    }`}
                  >
                    {t(`actions.${action.key}`)}
                    {action.type === "external" && (
                      <ExternalLink className="h-3 w-3" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Campo de envio */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2 border-t border-pili-mist bg-pili-white px-3 py-2.5"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t("placeholder")}
              className="flex-1 rounded-full border border-pili-mist bg-pili-paper px-4 py-2 text-sm text-pili-black placeholder:text-pili-cement focus:border-pili-safety focus:outline-none"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-pili-safety text-pili-white transition-opacity disabled:opacity-40"
              aria-label={t("send")}
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
