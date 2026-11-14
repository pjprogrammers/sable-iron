"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import BookButton from "@/components/BookButton";
import { EASE } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useGSAP(
    () => {
      const media = mediaRef.current;
      const section = sectionRef.current;
      if (!media || !section) return;

      const mm = gsap.matchMedia();

      mm.add(
        "(min-width: 721px) and (prefers-reduced-motion: no-preference)",
        () => {
          gsap.to(media, {
            yPercent: 10,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          });
        },
      );

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  const rise = (delay: number) => ({
    initial: { opacity: 0, y: reduceMotion ? 0 : 32 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: reduceMotion ? 0.3 : 1.05,
      ease: EASE,
      delay: reduceMotion ? 0 : delay,
    },
  });

  return (
    <section
      ref={sectionRef}
      className="relative isolate flex min-h-svh flex-col justify-end overflow-hidden bg-ink pt-[calc(var(--header-h)+4rem)] max-[560px]:pt-[calc(var(--header-h)+2.5rem)]"
      id="top"
    >
      <div ref={mediaRef} className="hero__media" aria-hidden="true">
        <Image
          src="/assets/hero.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <div className="hero__scrim" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />

      <div className="container-page relative z-[2] w-full pb-[clamp(1.75rem,3.5vw,3rem)]">
        <motion.h1 className="hero-title" {...rise(0.12)}>
          Look sharp.
          <br />
          Feel <em>unhurried.</em>
        </motion.h1>
        <motion.p
          className="mt-[clamp(1.35rem,2.4vw,1.9rem)] max-w-[40rem] text-[clamp(0.95rem,1.35vw,1.12rem)] font-light leading-[1.7] text-[#d8cfbf] max-[560px]:text-[0.95rem]"
          {...rise(0.38)}
        >
          A modern barber atelier for classic cuts, straight-razor shaves and the
          kind of chair time you actually look forward to.
        </motion.p>
        <motion.div
          className="mt-[clamp(1.6rem,2.8vw,2.4rem)] flex flex-wrap gap-3 max-[560px]:flex-col max-[560px]:items-stretch"
          {...rise(0.52)}
        >
          <BookButton className="btn btn--solid btn--lg max-[560px]:w-full">
            Book a chair{" "}
            <span className="btn__arrow" aria-hidden="true">
              →
            </span>
          </BookButton>
          <a
            className="btn btn--ghost btn--lg max-[560px]:w-full"
            href="#services"
          >
            See the menu
          </a>
        </motion.div>
      </div>

      <motion.div
        className="container-page relative z-[2] grid grid-cols-[repeat(3,minmax(0,auto))_1fr] items-center gap-[clamp(1.25rem,4vw,3.5rem)] border-t border-cream/14 py-[1.35rem] max-[720px]:grid-cols-2 max-[720px]:gap-x-6 max-[720px]:gap-y-4 max-[720px]:py-[1.2rem]"
        initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: reduceMotion ? 0.3 : 0.9,
          ease: EASE,
          delay: reduceMotion ? 0 : 0.75,
        }}
      >
        <div className="flex flex-col gap-[0.3rem] text-[0.82rem] text-cream-dim max-[720px]:whitespace-normal">
          <span className="text-[0.75rem] font-semibold uppercase tracking-[0.2em] text-muted">
            Two shops
          </span>
          <span>Edgewater &amp; Coral Gables</span>
        </div>
        <div className="flex flex-col gap-[0.3rem] text-[0.82rem] text-cream-dim max-[720px]:whitespace-normal">
          <span className="text-[0.75rem] font-semibold uppercase tracking-[0.2em] text-muted">
            Hours
          </span>
          <span>Open 7 days · Edgewater</span>
        </div>
        <div className="flex flex-col gap-[0.3rem] text-[0.82rem] text-cream-dim max-[720px]:col-span-2 max-[720px]:whitespace-normal">
          <span className="text-[0.75rem] font-semibold uppercase tracking-[0.2em] text-muted">
            Rated
          </span>
          <span
            className="stars text-[0.75rem]"
            aria-label="4.9 out of 5 stars"
          >
            ★★★★★ <b>4.9</b> · 600+ visits
          </span>
        </div>
        <a
          className="inline-flex min-h-11 items-center justify-self-end gap-[0.7rem] text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-muted transition-colors hover:text-cream max-[720px]:hidden"
          href="#about"
        >
          Scroll{" "}
          <span
            className="scroll-nudge inline-grid h-[34px] w-[34px] place-items-center rounded-full border border-cream/30 text-cream-dim"
            aria-hidden="true"
          >
            ↓
          </span>
        </a>
      </motion.div>

      <p className="hero__side" aria-hidden="true">
        Sable &amp; Iron — Biscayne Blvd, Miami
      </p>
    </section>
  );
}
