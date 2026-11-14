"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { EASE } from "@/lib/motion";

type Message = {
  id: number;
  who: "bot" | "user";
  text: string;
  typing?: boolean;
};

const QUICK_QUESTIONS = [
  "What does a cut cost?",
  "Where are you?",
  "What are your hours?",
  "Can I walk in?",
];

const getReply = (question: string) => {
  const q = question.toLowerCase();

  if (/(price|cost|much|pricing|rate)/.test(q)) {
    return "Haircuts start at $55, skin fades at $50, hot-towel shaves at $45 and beard sculpts at $30. The Full Service — cut, shave and a drink — is $120. Every service includes a consultation, hot towel and a drink.";
  }
  if (/(where|location|address|directions|find you)/.test(q)) {
    return "Two shops: Edgewater at 2100 Biscayne Blvd, and Coral Gables at 120 Giralda Ave. Directions and booking links are in the Locations section.";
  }
  if (/(hour|open|close|closing|today|tomorrow)/.test(q)) {
    return "Edgewater: Mon–Fri 9am–8pm, Sat 9am–6pm, Sun 10am–4pm. Coral Gables: Tue–Fri 10am–7pm, Sat 9am–5pm, closed Sun–Mon.";
  }
  if (/(park|parking|garage)/.test(q)) {
    return "There’s street parking around both shops and paid garages within a block. Edgewater is easiest on NE 21st Street.";
  }
  if (/(walk|squeeze|availability|appointment)/.test(q)) {
    return "Walk-ins are welcome whenever a chair is free. Weekends fill up fast, so booking is the safer bet — tap “Book a chair” and pick a time.";
  }
  if (/(book|reserve|reservation)/.test(q)) {
    return "Tap “Book a chair” anywhere on the page, choose a shop, service, barber and time. Takes about 30 seconds.";
  }
  if (/(shave|razor|beard)/.test(q)) {
    return "Our hot-towel shave is a proper ritual: steam towels, a straight razor and a cooling balm finish, $45. Beard sculpting is $30.";
  }
  if (/(gift|card|voucher)/.test(q)) {
    return "Gift cards are available at the desk or by phone in any amount. The Full Service is the popular one.";
  }
  return "I’m a simple demo concierge, so I don’t know that one. Call the shop at (305) 555-0142 and a human will help.";
};

export default function Concierge() {
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      who: "bot",
      text: "Hi — I'm the Sable & Iron concierge. Ask about prices, hours, locations or booking. For anything urgent, call the shop.",
    },
  ]);
  const [chipsVisible, setChipsVisible] = useState(true);
  const [input, setInput] = useState("");
  const panelRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | null>(null);
  const idRef = useRef(2);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const nextReady =
        window.innerWidth > 720 ||
        window.scrollY > window.innerHeight * 0.62 ||
        open;
      setReady((current) => (current === nextReady ? current : nextReady));
    };
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const frame = window.requestAnimationFrame(() => {
      messagesRef.current?.scrollTo({
        top: messagesRef.current.scrollHeight,
      });
      inputRef.current?.focus({ preventScroll: true });
    });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  useEffect(() => {
    const element = messagesRef.current;
    if (!element) return;
    element.scrollTop = element.scrollHeight;
  }, [messages]);

  useEffect(
    () => () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    },
    [],
  );

  const setConciergeOpen = (next: boolean) => {
    if (!next && panelRef.current?.contains(document.activeElement)) {
      toggleRef.current?.focus({ preventScroll: true });
    }
    setOpen(next);
    if (next) setReady(true);
  };

  const ask = (question: string) => {
    const trimmed = question.trim();
    if (!trimmed) return;

    const userId = idRef.current++;
    const typingId = idRef.current++;
    setMessages((current) => [
      ...current,
      { id: userId, who: "user", text: trimmed },
      { id: typingId, who: "bot", text: "···", typing: true },
    ]);
    setChipsVisible(false);
    setInput("");

    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      setMessages((current) => [
        ...current.filter((message) => message.id !== typingId),
        { id: idRef.current++, who: "bot", text: getReply(trimmed) },
      ]);
    }, 600);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    ask(input);
  };

  return (
    <div
      className={`concierge fixed bottom-[clamp(0.9rem,2vw,1.75rem)] right-[clamp(0.9rem,2vw,1.75rem)] z-[120] flex flex-col items-end gap-3 ${
        ready ? "is-ready" : ""
      }`}
    >
      <AnimatePresence>
        {open ? (
          <motion.section
            ref={panelRef}
            id="concierge-panel"
            role="dialog"
            aria-label="Shop concierge"
            className="concierge-panel"
            initial={
              reduceMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 14, scale: 0.98 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={
              reduceMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 10, scale: 0.985 }
            }
            transition={{ duration: reduceMotion ? 0.18 : 0.4, ease: EASE }}
          >
            <header className="flex items-start justify-between gap-4 border-b border-cream/14 bg-ink-2 px-[1.1rem] py-4">
              <div>
                <p className="flex items-center gap-[0.45rem] text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-status-open">
                  <span
                    className="status-dot h-[5px] w-[5px] shadow-none"
                    aria-hidden="true"
                  />
                  Shop concierge
                </p>
                <p className="mt-[0.3rem] font-display text-[1.35rem] leading-[1.1]">
                  Ask us anything.
                </p>
              </div>
              <button
                className="concierge-close relative h-11 w-11 flex-none rounded-full border border-cream/14 transition-colors hover:border-brass"
                type="button"
                aria-label="Close concierge"
                onClick={() => setConciergeOpen(false)}
              >
                <span aria-hidden="true" />
                <span aria-hidden="true" />
              </button>
            </header>

            <div
              ref={messagesRef}
              className="flex min-h-[150px] flex-1 flex-col gap-[0.6rem] overflow-y-auto p-4"
              aria-live="polite"
            >
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  className={`message ${
                    message.who === "user" ? "message--user" : ""
                  } ${message.typing ? "message--typing" : ""}`}
                  initial={{ opacity: 0, y: reduceMotion ? 0 : 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: reduceMotion ? 0.15 : 0.35,
                    ease: EASE,
                  }}
                >
                  <p>{message.text}</p>
                </motion.div>
              ))}
              {chipsVisible ? (
                <div className="mt-[0.2rem] flex flex-wrap gap-[0.4rem]">
                  {QUICK_QUESTIONS.map((question) => (
                    <button
                      key={question}
                      type="button"
                      className="min-h-9 rounded-full border border-cream/30 px-3 py-[0.4rem] text-[0.8rem] tracking-[0.02em] text-cream-dim transition-colors hover:border-brass hover:text-brass"
                      onClick={() => ask(question)}
                    >
                      {question === "What are your hours?" ? "Hours" : question === "Can I walk in?" ? "Walk-ins" : question}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            <form
              className="flex gap-2 border-t border-cream/14 p-[0.7rem]"
              onSubmit={handleSubmit}
            >
              <label className="sr-only" htmlFor="concierge-input">
                Your message
              </label>
              <input
                ref={inputRef}
                type="text"
                id="concierge-input"
                placeholder="Your message"
                autoComplete="off"
                className="min-w-0 flex-1 rounded-full border border-cream/14 bg-ink-3 px-[0.85rem] py-[0.6rem] font-body text-[0.85rem] text-cream outline-none transition-colors placeholder:text-muted focus:border-brass"
                value={input}
                onChange={(event) => setInput(event.target.value)}
              />
              <button
                className="grid h-11 w-11 flex-none place-items-center rounded-full bg-brass text-ink transition-colors hover:bg-brass-bright"
                type="submit"
                aria-label="Send message"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4 fill-none stroke-current stroke-[1.5] [stroke-linejoin:round]"
                  aria-hidden="true"
                >
                  <path d="M4 12l16-8-6 16-2.5-6.5L4 12z" />
                </svg>
              </button>
            </form>
            <p className="px-4 pb-[0.8rem] text-[0.75rem] leading-[1.5] tracking-[0.02em] text-muted">
              Automated assistant · answers can be wrong · demo only
            </p>
          </motion.section>
        ) : null}
      </AnimatePresence>

      <button
        ref={toggleRef}
        className="concierge__toggle flex h-[54px] items-center gap-[0.55rem] rounded-full bg-brass pl-[0.45rem] pr-[1.15rem] text-[#14100b] shadow-[0_14px_40px_rgba(0,0,0,0.35)] transition-all hover:-translate-y-0.5 hover:bg-brass-bright hover:shadow-[0_18px_46px_rgba(0,0,0,0.42)] max-[560px]:w-[54px] max-[560px]:justify-center max-[560px]:p-[0.35rem]"
        type="button"
        id="concierge-toggle"
        aria-label="Ask the shop concierge"
        aria-expanded={open}
        aria-controls="concierge-panel"
        onClick={() => setConciergeOpen(!open)}
      >
        <span
          className="grid h-[42px] w-[42px] place-items-center rounded-full bg-ink/10 max-[560px]:bg-transparent"
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-[19px] w-[19px] fill-none stroke-current stroke-[1.5] [stroke-linecap:round] [stroke-linejoin:round]"
          >
            <path d="M21 12a8 8 0 0 1-8 8H4l2.2-3.3A8 8 0 1 1 21 12z" />
            <path d="M8.5 11h.01M12 11h.01M15.5 11h.01" />
          </svg>
        </span>
        <span className="text-[0.78rem] font-bold uppercase tracking-[0.13em] max-[560px]:hidden">
          Ask us
        </span>
      </button>
    </div>
  );
}
