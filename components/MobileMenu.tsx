"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, type RefObject } from "react";
import { createPortal } from "react-dom";
import { useBooking } from "@/components/BookingProvider";
import { NAV_LINKS } from "@/lib/data";
import { lockPage, unlockPage } from "@/lib/modal";

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
  restoreFocusRef: RefObject<boolean>;
};

const focusableSelector = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

export default function MobileMenu({
  open,
  onClose,
  restoreFocusRef,
}: MobileMenuProps) {
  const reduceMotion = useReducedMotion();
  const { openBooking } = useBooking();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const previous = document.activeElement as HTMLElement | null;
    restoreFocusRef.current = true;
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
      if (restoreFocusRef.current && previous?.isConnected) {
        previous.focus({ preventScroll: true });
      }
    };
  }, [open, onClose, restoreFocusRef]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          ref={panelRef}
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="fixed inset-0 z-[200] flex h-full w-full flex-col overflow-y-auto bg-ink text-cream"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: reduceMotion ? 0.15 : 0.28,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <div className="flex items-center justify-between border-b border-cream/14 px-gutter py-[1.15rem]">
            <span className="brand">
              <span className="brand__name">
                Sable <span className="brand__amp">&amp;</span> Iron
              </span>
              <span className="brand__sub">Barber Atelier</span>
            </span>
            <button
              ref={closeRef}
              type="button"
              className="menu-close relative h-[46px] w-[46px] rounded-full border border-cream/30 transition-colors hover:border-brass hover:bg-brass/8"
              aria-label="Close menu"
              onClick={onClose}
            >
              <span aria-hidden="true" />
              <span aria-hidden="true" />
            </button>
          </div>

          <nav
            className="flex flex-col px-gutter py-[clamp(1rem,4vh,2.5rem)]"
            aria-label="Mobile primary"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={onClose}
                className="flex items-baseline gap-4 border-b border-cream/14 py-[clamp(0.75rem,2.2vh,1.3rem)] font-display text-[clamp(2rem,8vw,3.4rem)] leading-[1.02] tracking-[-0.02em] transition-colors hover:text-brass"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="mt-auto flex flex-col items-start gap-[0.9rem] border-t border-cream/14 px-gutter pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-6">
            <button
              type="button"
              className="btn btn--solid w-full"
              onClick={() => {
                restoreFocusRef.current = false;
                onClose();
                openBooking();
              }}
            >
              Book a chair
            </button>
            <a
              href="tel:+13055550142"
              className="font-display text-[1.25rem] text-brass"
            >
              (305) 555-0142
            </a>
            <p className="text-[0.75rem] uppercase leading-[1.9] tracking-[0.12em] text-muted">
              Edgewater · Coral Gables
              <br />
              Edgewater open 7 days
            </p>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
