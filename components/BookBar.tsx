"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import BookButton from "@/components/BookButton";
import { SITE } from "@/lib/data";
import { EASE } from "@/lib/motion";

export default function BookBar() {
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let frame = 0;
    let lastScroll = -1;

    const update = () => {
      frame = 0;
      const y = window.scrollY;
      if (y === lastScroll) return;
      lastScroll = y;

      const footer = document.querySelector(".footer");
      const footerVisible = footer
        ? footer.getBoundingClientRect().top < window.innerHeight - 12
        : false;

      setVisible(y > window.innerHeight * 0.62 && !footerVisible);
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

  return (
    <motion.aside
      className="bookbar"
      aria-label="Quick booking"
      aria-hidden={!visible}
      inert={!visible}
      initial={false}
      animate={{ y: visible ? "0%" : "110%" }}
      transition={{
        duration: reduceMotion ? 0 : 0.45,
        ease: EASE,
      }}
    >
      <a
        className="bookbar__call"
        href={SITE.phoneHref}
        aria-label="Call the shop"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M5 4h4l2 5-2.5 1.5a13 13 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
        </svg>
      </a>
      <BookButton className="btn btn--solid btn--full">
        Book a chair{" "}
        <span className="btn__arrow" aria-hidden="true">
          →
        </span>
      </BookButton>
    </motion.aside>
  );
}
