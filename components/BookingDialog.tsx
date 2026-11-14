"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type MouseEvent,
} from "react";
import {
  BARBER_NAMES,
  LOCATIONS,
  SERVICES,
  type Location,
} from "@/lib/data";
import {
  buildSlots,
  dateFromValue,
  formatDateLong,
  formatTimeOption,
  getHoursFor,
  isoDate,
  miamiNow,
  nextOpenDate,
  parseTimeValue,
  type SlotResult,
} from "@/lib/booking";
import { lockPage, unlockPage } from "@/lib/modal";

export type BookingPrefill = {
  location?: string;
  service?: string;
  barber?: string;
};

type BookingDialogProps = {
  prefill: BookingPrefill;
  onClose: () => void;
};

const tomorrowInMiami = () => {
  const now = miamiNow();
  const base = dateFromValue(now.date) ?? new Date();
  base.setDate(base.getDate() + 1);
  return isoDate(base);
};

const validLocation = (value?: string): Location =>
  LOCATIONS.find((location) => location.name === value) ?? LOCATIONS[0];

const validService = (value?: string) =>
  SERVICES.find((service) => service.name === value)?.name ??
  SERVICES[0].name;

const validBarber = (value?: string) =>
  value && BARBER_NAMES.includes(value) ? value : BARBER_NAMES[0];

const focusableSelector = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

export default function BookingDialog({
  prefill,
  onClose,
}: BookingDialogProps) {
  const reduceMotion = useReducedMotion();

  const initialLocation = validLocation(prefill.location).name;
  const initialService = validService(prefill.service);
  const initialBarber = validBarber(prefill.barber);

  const [location, setLocation] = useState(initialLocation);
  const [service, setService] = useState(initialService);
  const [barber, setBarber] = useState(initialBarber);
  const [date, setDate] = useState(() =>
    nextOpenDate(initialLocation, tomorrowInMiami()),
  );
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [formError, setFormError] = useState("");
  const [slots, setSlots] = useState<SlotResult>(() =>
    buildSlots(initialLocation, date, initialService),
  );
  const [submitted, setSubmitted] = useState(false);
  const [summary, setSummary] = useState<{
    service: string;
    barber: string;
    detail: string;
  } | null>(null);
  const [reference, setReference] = useState("SI-0000");

  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);
  const timeRef = useRef<HTMLSelectElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const errorRef = useRef<HTMLParagraphElement>(null);

  const today = miamiNow().date;

  /* Focus trap, scroll lock and focus return. */
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    lockPage();

    const frame = window.requestAnimationFrame(() => {
      closeRef.current?.focus({ preventScroll: true });
    });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) return;

      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(focusableSelector),
      ).filter((element) => element.offsetParent !== null);

      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener("keydown", onKeyDown);
      unlockPage();
      if (previous && previous.isConnected) {
        previous.focus({ preventScroll: true });
      }
    };
  }, [onClose]);

  useEffect(() => {
    if (!submitted) return;
    if (mainRef.current) mainRef.current.scrollTop = 0;
    const frame = window.requestAnimationFrame(() => {
      successRef.current?.focus({ preventScroll: true });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [submitted]);

  const updateSlots = (
    nextLocation: string,
    nextDate: string,
    nextService: string,
    previousTime = time,
  ) => {
    const next = buildSlots(nextLocation, nextDate, nextService);
    setSlots(next);
    setTime(
      next.starts.some(
        (minutes) => formatTimeOption(minutes) === previousTime,
      )
        ? previousTime
        : "",
    );
  };

  const handleLocationChange = (value: string) => {
    setLocation(value);
    const nextDate = nextOpenDate(value, date);
    setDate(nextDate);
    setFormError("");
    updateSlots(value, nextDate, service, "");
  };

  const handleServiceChange = (value: string) => {
    setService(value);
    setFormError("");
    updateSlots(location, date, value);
  };

  const handleDateChange = (value: string) => {
    setDate(value);
    setFormError("");
    updateSlots(location, value, service);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");

    const nameValue = name.trim();
    const digits = phone.replace(/\D/g, "");
    let nextNameError = "";
    let nextPhoneError = "";

    if (!nameValue) nextNameError = "Please add your name.";
    else if (nameValue.length < 2)
      nextNameError = "Please use at least 2 characters.";

    if (!digits) nextPhoneError = "Please add a phone number.";
    else if (digits.length < 10 || digits.length > 15)
      nextPhoneError = "Use a phone number with 10 to 15 digits.";

    setNameError(nextNameError);
    setPhoneError(nextPhoneError);

    const now = miamiNow();
    const dateObj = dateFromValue(date);
    const fresh = buildSlots(location, date, service, now);

    if (!dateObj) {
      setSlots(fresh);
      dateRef.current?.focus();
      return;
    }

    const hours = getHoursFor(location, dateObj);
    if (!hours) {
      setSlots(fresh);
      dateRef.current?.focus();
      return;
    }

    if (!time) {
      setSlots(fresh);
      timeRef.current?.focus();
      return;
    }

    if (nextNameError || nextPhoneError) {
      (nextNameError ? nameRef : phoneRef).current?.focus();
      return;
    }

    const duration =
      SERVICES.find((item) => item.name === service)?.duration ?? 30;
    const minutes = parseTimeValue(time);
    const stale =
      minutes === null ||
      minutes < hours[0] ||
      minutes + duration > hours[1] ||
      (date === now.date && minutes < now.minutes + 30);

    if (stale) {
      setSlots(fresh);
      setFormError(
        `That time no longer fits. Choose one of the available times for ${location}.`,
      );
      window.requestAnimationFrame(() => errorRef.current?.focus());
      return;
    }

    const barberText =
      barber === "No preference" ? "the next available barber" : barber;

    setSummary({
      service,
      barber: barberText,
      detail: `at our ${location} shop, ${formatDateLong(dateObj)} at ${time}. We'll text ${phone.trim()} if anything changes.`,
    });
    setReference(`SI-${Math.floor(1000 + Math.random() * 9000)}`);
    setSubmitted(true);
  };

  const handleBackdropMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) onClose();
  };

  return (
    <motion.div
      className="fixed inset-0 z-[300] flex items-center justify-center p-4 max-[900px]:p-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      onMouseDown={handleBackdropMouseDown}
    >
      <div
        className="absolute inset-0 bg-[rgba(6,5,4,0.74)] backdrop-blur-[7px]"
        aria-hidden="true"
      />
      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-title"
        className="booking-panel relative z-10"
        initial={
          reduceMotion
            ? { opacity: 0 }
            : { opacity: 0, y: 24, scale: 0.985 }
        }
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={
          reduceMotion
            ? { opacity: 0 }
            : { opacity: 0, y: 14, scale: 0.99 }
        }
        transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          ref={closeRef}
          type="button"
          className="booking-close absolute right-4 top-4 z-[5] h-11 w-11 rounded-full border border-cream/30 bg-ink/60 backdrop-blur-[8px] transition-colors hover:border-brass hover:bg-brass/10"
          onClick={onClose}
          aria-label="Close booking"
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>

        <div className="booking-shell">
          <aside className="booking-aside">
            <h2 id="booking-title">
              Take a <em>seat.</em>
            </h2>
            <p className="mt-[1.1rem] text-[0.8rem] font-light leading-[1.75] text-muted max-[900px]:hidden">
              Tell us what you&apos;re after and we&apos;ll hold the chair. First
              visit? Add a note at the desk and we&apos;ll build in extra time
              for the consultation.
            </p>
            <ul className="mt-6 max-[900px]:hidden">
              {[
                "Consultation included",
                "Hot towel & drink on us",
                "Free changes up to 24h",
              ].map((perk) => (
                <li
                  key={perk}
                  className="relative my-2 pl-[1.1rem] text-[0.78rem] text-cream-dim before:absolute before:left-0 before:top-[0.55em] before:h-1 before:w-1 before:rounded-full before:bg-brass"
                >
                  {perk}
                </li>
              ))}
            </ul>
            <p className="mt-auto pt-8 text-[0.7rem] font-semibold uppercase leading-[1.9] tracking-[0.14em] text-muted max-[900px]:hidden">
              Prefer to call?
              <br />
              <a
                href="tel:+13055550142"
                className="font-display text-[1.15rem] normal-case tracking-normal text-brass"
              >
                (305) 555-0142
              </a>
            </p>
            <div className="relative mt-6 aspect-[4/3] w-full overflow-hidden max-[900px]:hidden">
              <Image
                src="/assets/cut-3.jpg"
                alt=""
                fill
                sizes="320px"
                className="object-cover opacity-90 grayscale-[0.35]"
              />
            </div>
          </aside>

          <div ref={mainRef} className="booking-main">
            {submitted && summary ? (
              <div
                ref={successRef}
                tabIndex={-1}
                className="booking-success flex min-h-full flex-col items-start justify-center outline-none focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-brass max-[900px]:min-h-0 max-[900px]:py-8"
              >
                <motion.div
                  initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="mb-6 grid h-[58px] w-[58px] place-items-center rounded-full border border-brass"
                  aria-hidden="true"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-6 w-6 fill-none stroke-brass stroke-[1.6] [stroke-linecap:round] [stroke-linejoin:round]"
                  >
                    <path d="M4 12.5l5 5L20 6.5" />
                  </svg>
                </motion.div>
                <h3 className="mt-3 font-display text-[clamp(2.2rem,4vw,3rem)] font-normal leading-none tracking-[-0.02em]">
                  See you soon.
                </h3>
                <p className="mt-5 max-w-[42ch] text-[0.86rem] leading-[1.75] text-cream-dim">
                  <b>{summary.service}</b> with {summary.barber} {summary.detail}
                </p>
                <p className="mt-5 text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-muted">
                  Reference <b className="tracking-[0.1em] text-brass">{reference}</b>
                </p>
                <button
                  type="button"
                  className="btn btn--ghost mt-6"
                  onClick={onClose}
                >
                  Done
                </button>
                <p className="mt-[0.9rem] text-[0.75rem] leading-[1.6] tracking-[0.02em] text-muted">
                  Demo confirmation — nothing was booked and no message was
                  sent.
                </p>
              </div>
            ) : (
              <form className="flex flex-col" onSubmit={handleSubmit} noValidate>
                <div className="booking-row">
                  <div className="field">
                    <label htmlFor="booking-location">Location</label>
                    <select
                      id="booking-location"
                      name="location"
                      value={location}
                      onChange={(event) =>
                        handleLocationChange(event.target.value)
                      }
                      required
                    >
                      {LOCATIONS.map((item) => (
                        <option key={item.id} value={item.name}>
                          {item.name} — {item.addressLine1}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="field">
                    <label htmlFor="booking-service">Service</label>
                    <select
                      id="booking-service"
                      name="service"
                      value={service}
                      onChange={(event) =>
                        handleServiceChange(event.target.value)
                      }
                      required
                    >
                      {SERVICES.map((item) => (
                        <option key={item.name} value={item.name}>
                          {item.name} — ${item.price}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="field">
                  <label htmlFor="booking-barber">Barber</label>
                  <select
                    id="booking-barber"
                    name="barber"
                    value={barber}
                    onChange={(event) => setBarber(event.target.value)}
                  >
                    {BARBER_NAMES.map((item) => (
                      <option key={item} value={item}>
                        {item === "No preference"
                          ? "No preference — match me"
                          : item}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="booking-row">
                  <div className="field">
                    <label htmlFor="booking-date">Date</label>
                    <input
                      ref={dateRef}
                      type="date"
                      id="booking-date"
                      name="date"
                      min={today}
                      value={date}
                      onChange={(event) => handleDateChange(event.target.value)}
                      required
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="booking-time">Time</label>
                    <select
                      ref={timeRef}
                      id="booking-time"
                      name="time"
                      value={time}
                      onChange={(event) => setTime(event.target.value)}
                      required
                      aria-describedby="booking-time-hint"
                    >
                      <option value="" disabled>
                        {slots.placeholder}
                      </option>
                      {slots.starts.map((minutes) => {
                        const value = formatTimeOption(minutes);
                        return (
                          <option key={value} value={value}>
                            {value}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>

                <p
                  className={`booking-hint ${slots.warning ? "is-warning" : ""}`}
                  id="booking-time-hint"
                  aria-live="polite"
                >
                  {slots.hint}
                </p>

                {formError ? (
                  <p
                    ref={errorRef}
                    className="booking-error"
                    role="alert"
                    tabIndex={-1}
                  >
                    {formError}
                  </p>
                ) : null}

                <div className="booking-row">
                  <div className="field">
                    <label htmlFor="booking-name">Name</label>
                    <input
                      ref={nameRef}
                      type="text"
                      id="booking-name"
                      name="name"
                      autoComplete="name"
                      placeholder="Your name"
                      maxLength={80}
                      value={name}
                      onChange={(event) => {
                        setName(event.target.value);
                        setNameError("");
                        setFormError("");
                      }}
                      aria-invalid={nameError ? "true" : undefined}
                      aria-describedby={
                        nameError ? "booking-name-error" : undefined
                      }
                      required
                    />
                    {nameError ? (
                      <p className="field__error" id="booking-name-error">
                        {nameError}
                      </p>
                    ) : null}
                  </div>
                  <div className="field">
                    <label htmlFor="booking-phone">Phone</label>
                    <input
                      ref={phoneRef}
                      type="tel"
                      id="booking-phone"
                      name="phone"
                      autoComplete="tel"
                      inputMode="tel"
                      placeholder="(305) 555-0000"
                      maxLength={24}
                      value={phone}
                      onChange={(event) => {
                        setPhone(event.target.value);
                        setPhoneError("");
                        setFormError("");
                      }}
                      aria-invalid={phoneError ? "true" : undefined}
                      aria-describedby={
                        phoneError ? "booking-phone-error" : undefined
                      }
                      required
                    />
                    {phoneError ? (
                      <p className="field__error" id="booking-phone-error">
                        {phoneError}
                      </p>
                    ) : null}
                  </div>
                </div>

                <button
                  className="btn btn--solid btn--full mt-2"
                  type="submit"
                >
                  Request appointment{" "}
                  <span className="btn__arrow" aria-hidden="true">
                    →
                  </span>
                </button>
                <p className="mt-[0.9rem] text-[0.75rem] leading-[1.6] tracking-[0.02em] text-muted">
                  Demo booking flow — no appointment is actually reserved and no
                  messages are sent.
                </p>

                <div className="mt-7 border-t border-cream/14 pt-5 max-[900px]:hidden">
                  <span
                    className="stars text-[0.72rem] tracking-[0.18em]"
                    aria-hidden="true"
                  >
                    ★★★★★
                  </span>
                  <p className="mt-[0.65rem] max-w-[44ch] font-display text-base italic leading-[1.5] text-cream-dim">
                    “Sharpest fade I’ve had in Miami, and the shop itself is
                    worth arriving early for.”
                  </p>
                  <cite className="mt-[0.55rem] block font-body text-[0.75rem] font-semibold not-italic uppercase tracking-[0.14em] text-muted">
                    Chris A. · Edgewater
                  </cite>
                </div>
              </form>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
