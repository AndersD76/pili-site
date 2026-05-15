"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Bot, X, Send, ExternalLink } from "lucide-react";
import { COMPANY, ECOSYSTEM } from "@/lib/constants";

interface ChatMessage {
  text: string;
  from: "bot" | "user";
}

const WELCOME_MESSAGES: string[] = [
  "Olá! Sou o PILI Robô, assistente virtual da PILI Industrial.",
  "Como posso ajudar você hoje?",
];

const AUTO_REPLY =
  "Obrigado pela sua mensagem! Para um atendimento mais rápido, entre em contato pelo WhatsApp ou solicite um orçamento.";

interface QuickAction {
  label: string;
  type: "route" | "external";
  target: string;
}

const QUICK_ACTIONS: QuickAction[] = [
  { label: "Conhecer produtos", type: "route", target: "/produtos" },
  { label: "Solicitar orçamento", type: "route", target: "/orcamento" },
  { label: "Falar com consultor", type: "external", target: "whatsapp" },
  { label: "Sobre a empresa", type: "route", target: "/empresa" },
  { label: "Peças de reposição", type: "external", target: "store" },
  { label: "Suporte técnico", type: "route", target: "/contato" },
];

function getWhatsAppUrl() {
  const phone = COMPANY.whatsapp.replace(/\D/g, "");
  return `https://wa.me/${phone}?text=${encodeURIComponent(
    "Olá, gostaria de informações sobre os tombadores PILI."
  )}`;
}

export function PiliRobo() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typingIndex, setTypingIndex] = useState(0);
  const [showActions, setShowActions] = useState(false);
  const [visibleActions, setVisibleActions] = useState(0);
  const [input, setInput] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  const handleOpen = useCallback(() => {
    setMessages([]);
    setTypingIndex(0);
    setShowActions(false);
    setVisibleActions(0);
    setOpen(true);
  }, []);

  /* ---------- Welcome typing sequence ---------- */
  useEffect(() => {
    if (!open) return;

    const timers: ReturnType<typeof setTimeout>[] = [];

    WELCOME_MESSAGES.forEach((text, i) => {
      const t = setTimeout(() => {
        setMessages((prev) => [...prev, { text, from: "bot" }]);
        setTypingIndex(i + 1);

        if (i === WELCOME_MESSAGES.length - 1) {
          const actionsTimer = setTimeout(() => setShowActions(true), 400);
          timers.push(actionsTimer);
        }
      }, (i + 1) * 900);
      timers.push(t);
    });

    return () => timers.forEach(clearTimeout);
  }, [open]);

  /* ---------- Sequential quick-action fade-in ---------- */
  useEffect(() => {
    if (!showActions) return;
    if (visibleActions >= QUICK_ACTIONS.length) return;

    const t = setTimeout(
      () => setVisibleActions((v) => v + 1),
      100
    );
    return () => clearTimeout(t);
  }, [showActions, visibleActions]);

  /* ---------- Auto-scroll ---------- */
  useEffect(() => {
    bodyRef.current?.scrollTo({
      top: bodyRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, showActions, visibleActions]);

  /* ---------- Handle quick-action click ---------- */
  const handleAction = useCallback(
    (action: QuickAction) => {
      if (action.type === "route") {
        setOpen(false);
        router.push(action.target);
      } else if (action.target === "whatsapp") {
        window.open(getWhatsAppUrl(), "_blank", "noopener,noreferrer");
      } else if (action.target === "store") {
        window.open(ECOSYSTEM.store, "_blank", "noopener,noreferrer");
      }
    },
    [router]
  );

  /* ---------- Handle user send ---------- */
  const handleSend = useCallback(() => {
    const text = input.trim();
    if (!text) return;

    setMessages((prev) => [...prev, { text, from: "user" }]);
    setInput("");

    setTimeout(() => {
      setMessages((prev) => [...prev, { text: AUTO_REPLY, from: "bot" }]);
    }, 1000);
  }, [input]);

  /* ---------- Typing indicator dots ---------- */
  const isTyping =
    open && typingIndex < WELCOME_MESSAGES.length;

  return (
    <>
      {/* -------- Floating button -------- */}
      {!open && (
        <button
          type="button"
          onClick={handleOpen}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className="fixed bottom-24 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-pili-safety text-pili-white shadow-lg transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pili-safety focus-visible:ring-offset-2"
          aria-label="Abrir assistente virtual PILI Robô"
        >
          {/* Pulse ring */}
          <span className="absolute inset-0 animate-[robo-ping_2.5s_ease-in-out_infinite] rounded-full bg-pili-safety opacity-40" />

          <Bot className="relative h-6 w-6" />

          {/* Notification badge */}
          <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-pili-graphite text-[10px] font-bold leading-none text-pili-white">
            1
          </span>

          {/* Tooltip */}
          {showTooltip && (
            <span className="absolute bottom-full right-0 mb-2 whitespace-nowrap rounded-lg bg-pili-graphite px-3 py-1.5 text-sm text-pili-white shadow-md">
              Precisa de ajuda?
              <span className="absolute -bottom-1 right-5 h-2 w-2 rotate-45 bg-pili-graphite" />
            </span>
          )}
        </button>
      )}

      {/* -------- Chat panel -------- */}
      {open && (
        <div
          className="fixed bottom-24 right-6 z-50 flex w-[calc(100vw-3rem)] max-w-[380px] animate-[robo-slide-up_0.3s_ease-out] flex-col overflow-hidden rounded-2xl bg-pili-white shadow-2xl sm:w-[380px]"
          style={{ height: "min(500px, calc(100vh - 8rem))" }}
          role="dialog"
          aria-label="PILI Robô - Assistente virtual"
        >
          {/* Header */}
          <div className="flex items-center gap-3 bg-pili-graphite px-4 py-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-pili-safety text-pili-white">
              <Bot className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold leading-tight text-pili-white">
                PILI Robô
              </p>
              <p className="text-xs text-pili-cement">Assistente virtual</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-full text-pili-cement transition-colors hover:bg-pili-steel hover:text-pili-white"
              aria-label="Fechar assistente"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Body */}
          <div
            ref={bodyRef}
            className="flex-1 space-y-3 overflow-y-auto bg-pili-paper p-4"
          >
            {/* Bot messages */}
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

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex gap-1 rounded-2xl rounded-bl-md bg-pili-white px-4 py-3 shadow-sm">
                  <span className="h-2 w-2 animate-[robo-dot_1.4s_ease-in-out_infinite] rounded-full bg-pili-cement" />
                  <span className="h-2 w-2 animate-[robo-dot_1.4s_ease-in-out_0.2s_infinite] rounded-full bg-pili-cement" />
                  <span className="h-2 w-2 animate-[robo-dot_1.4s_ease-in-out_0.4s_infinite] rounded-full bg-pili-cement" />
                </div>
              </div>
            )}

            {/* Quick actions */}
            {showActions && (
              <div className="flex flex-wrap gap-2 pt-1">
                {QUICK_ACTIONS.map((action, i) => (
                  <button
                    key={action.label}
                    type="button"
                    onClick={() => handleAction(action)}
                    className={`inline-flex items-center gap-1.5 rounded-full border border-pili-mist bg-pili-white px-3 py-1.5 text-xs font-medium text-pili-graphite shadow-sm transition-all hover:border-pili-safety hover:text-pili-safety ${
                      i < visibleActions
                        ? "translate-y-0 opacity-100"
                        : "pointer-events-none translate-y-2 opacity-0"
                    }`}
                    style={{
                      transitionDuration: "300ms",
                    }}
                  >
                    {action.label}
                    {action.type === "external" && (
                      <ExternalLink className="h-3 w-3" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Input */}
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
              placeholder="Digite sua mensagem..."
              className="flex-1 rounded-full border border-pili-mist bg-pili-paper px-4 py-2 text-sm text-pili-black placeholder:text-pili-cement focus:border-pili-safety focus:outline-none"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-pili-safety text-pili-white transition-opacity disabled:opacity-40"
              aria-label="Enviar mensagem"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
