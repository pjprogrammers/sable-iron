"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { EASE } from "@/lib/motion";

const CODE = "WELCOME10";

const copyText = async (text: string) => {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const field = document.createElement("textarea");
  field.value = text;
  field.setAttribute("readonly", "");
  field.style.position = "fixed";
  field.style.opacity = "0";
  document.body.appendChild(field);
  field.select();
  const copied = document.execCommand("copy");
  field.remove();
  if (!copied) throw new Error("Copy command failed.");
};

export default function Offer() {
  const reduceMotion = useReducedMotion();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [copyLabel, setCopyLabel] = useState("Copy code");
  const [copyStatus, setCopyStatus] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const resetTimer = useRef<number | null>(null);

  useEffect(() => {
    if (!submitted) return;
    const frame = window.requestAnimationFrame(() => {
      successRef.current?.focus({ preventScroll: true });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [submitted]);

  useEffect(
    () => () => {
      if (resetTimer.current) window.clearTimeout(resetTimer.current);
    },
    [],
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = email.trim();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);

    if (!valid) {
      setError(true);
      setMessage("Please enter a valid email address.");
      inputRef.current?.focus();
      return;
    }

    setError(false);
    setMessage("");
    setSubmitted(true);
  };

  const handleCopy = async () => {
    try {
      await copyText(CODE);
      setCopyStatus("Code copied to clipboard.");
      setCopyLabel("Copied");
    } catch {
      setCopyStatus(`Copy didn't work. The code is ${CODE}.`);
      setCopyLabel("Try again");
    }

    if (resetTimer.current) window.clearTimeout(resetTimer.current);
    resetTimer.current = window.setTimeout(() => {
      setCopyLabel("Copy code");
      setCopyStatus("");
    }, 2600);
  };

  return (
    <section className="offer" id="offer">
      <span className="offer__watermark" aria-hidden="true">
        10%
      </span>
      <div className="container-page relative z-[1]">
        <motion.div
          initial={{ opacity: 0, y: reduceMotion ? 0 : 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: reduceMotion ? 0.3 : 0.85, ease: EASE }}
        >
          <h2 className="h2">
            Ten percent off
            <br />
            your first <em>chair.</em>
          </h2>
          <p className="mt-6 max-w-[48ch] text-[0.95rem] font-light leading-[1.8] text-[#5e5547]">
            Join the list and we&apos;ll send the code, plus the occasional note
            about new barbers, shop nights and last-minute chairs. Two emails a
            month, tops.
          </p>

          {!submitted ? (
            <form
              className="mt-[clamp(1.1rem,2vw,1.5rem)] max-w-[640px]"
              onSubmit={handleSubmit}
              noValidate
            >
              <label className="offer__label" htmlFor="offer-email">
                Email address
              </label>
              <div className="offer__field">
                <input
                  ref={inputRef}
                  type="email"
                  id="offer-email"
                  name="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  inputMode="email"
                  autoCapitalize="none"
                  spellCheck={false}
                  required
                  aria-describedby="offer-msg"
                  aria-invalid={error ? "true" : undefined}
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setMessage("");
                    setError(false);
                  }}
                />
                <button className="btn btn--dark" type="submit">
                  Get the code{" "}
                  <span className="btn__arrow" aria-hidden="true">
                    →
                  </span>
                </button>
              </div>
              <p
                className={`form-msg ${!error && message ? "is-success" : ""}`}
                id="offer-msg"
                role="status"
                aria-live="polite"
              >
                {message}
              </p>
            </form>
          ) : (
            <motion.div
              ref={successRef}
              className="offer__success"
              tabIndex={-1}
              initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduceMotion ? 0.25 : 0.45, ease: EASE }}
            >
              <p className="text-[0.75rem] font-bold uppercase tracking-[0.2em] text-[#6b6152]">
                Your code
              </p>
              <div className="mt-[0.4rem] flex flex-wrap items-center gap-4">
                <p className="offer__code">{CODE}</p>
                <button
                  className="btn btn--dark btn--sm min-w-[8.5rem]"
                  type="button"
                  aria-label={
                    copyLabel === "Copied"
                      ? `Discount code ${CODE} copied`
                      : `Copy discount code ${CODE}`
                  }
                  onClick={handleCopy}
                >
                  {copyLabel}
                </button>
              </div>
              <p className="mt-3 max-w-[40ch] text-[0.8rem] leading-[1.7] text-[#5e5547]">
                Show this at the desk on your first visit. We&apos;ll take 10%
                off the service of your choice.
              </p>
              <p
                className="mt-[0.6rem] min-h-[1.4em] text-[0.82rem] text-[#44613a]"
                role="status"
                aria-live="polite"
              >
                {copyStatus}
              </p>
            </motion.div>
          )}

          <p className="mt-6 max-w-[58ch] text-[0.75rem] font-medium leading-[1.7] tracking-[0.01em] text-[#5e5547]">
            Demo form — nothing is sent or stored. In the real shop: two emails a
            month, unsubscribe anytime.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
