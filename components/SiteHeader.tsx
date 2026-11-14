"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import BookButton from "@/components/BookButton";
import MobileMenu from "@/components/MobileMenu";
import { NAV_LINKS } from "@/lib/data";

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [current, setCurrent] = useState<string>("");
  const [menuOpen, setMenuOpen] = useState(false);
  const restoreFocusRef = useRef(true);

  useEffect(() => {
    let frame = 0;
    let lastScroll = -1;

    const update = () => {
      frame = 0;
      const y = window.scrollY;
      if (y === lastScroll) return;
      lastScroll = y;

      setScrolled(y > 24);

      const marker = y + window.innerHeight * 0.3;
      let active = "";
      for (const link of NAV_LINKS) {
        const section = document.querySelector(link.href);
        if (section instanceof HTMLElement && section.offsetTop <= marker) {
          active = link.href;
        }
      }
      setCurrent(active);
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    const onResize = () => {
      lastScroll = -1;
      onScroll();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const query = window.matchMedia("(min-width: 1025px)");
    const onChange = () => {
      if (query.matches) setMenuOpen(false);
    };
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, [menuOpen]);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <>
      <header
        className={`site-header ${scrolled ? "is-scrolled" : ""}`}
        id="site-header"
      >
        <div className="container-page relative flex min-h-[var(--header-h)] items-center justify-between gap-6">
          <a className="brand" href="#top" aria-label="Sable and Iron, home">
            <span className="brand__name">
              Sable <span className="brand__amp">&amp;</span> Iron
            </span>
            <span className="brand__sub">Barber Atelier</span>
          </a>

          <nav
            className="ml-auto flex items-center gap-[clamp(1.1rem,2.1vw,2.2rem)] max-[1024px]:hidden"
            aria-label="Primary"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`nav-link ${current === link.href ? "is-current" : ""}`}
                aria-current={
                  current === link.href ? ("location" as const) : undefined
                }
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-5 max-[560px]:gap-[0.6rem]">
            <a className="header__phone max-[1200px]:hidden" href="tel:+13055550142">
              (305) 555-0142
            </a>
            <BookButton className="btn btn--solid btn--sm header__book max-[720px]:hidden">
              Book a chair
            </BookButton>
            <button
              className="inline-flex min-h-11 items-center gap-[0.6rem] rounded-full border border-cream/30 px-[0.9rem] py-[0.55rem] text-[0.75rem] font-semibold uppercase tracking-[0.14em] transition-colors hover:border-brass hover:bg-brass/6 min-[1025px]:hidden"
              type="button"
              id="menu-toggle"
              aria-label="Open menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen(true)}
            >
              <span className="max-[400px]:hidden">Menu</span>
              <span className="menu-toggle__bars" aria-hidden="true">
                <i />
                <i />
              </span>
            </button>
          </div>
        </div>
      </header>

      <MobileMenu
        open={menuOpen}
        onClose={closeMenu}
        restoreFocusRef={restoreFocusRef}
      />
    </>
  );
}
