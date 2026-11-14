"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Reveal from "@/components/Reveal";
import { useBooking } from "@/components/BookingProvider";
import { SERVICES } from "@/lib/data";
import { EASE } from "@/lib/motion";

gsap.registerPlugin(useGSAP);

export default function Services() {
  const { openBooking } = useBooking();
  const reduceMotion = useReducedMotion();
  const listRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const quickX = useRef<((value: number) => void) | null>(null);
  const quickY = useRef<((value: number) => void) | null>(null);
  const primed = useRef(false);
  const [previewImage, setPreviewImage] = useState("/assets/cut-1.jpg");
  const [previewVisible, setPreviewVisible] = useState(false);

  useGSAP(
    () => {
      const element = previewRef.current;
      if (!element) return;
      gsap.set(element, { xPercent: -50, yPercent: -50 });
      quickX.current = gsap.quickTo(element, "x", {
        duration: 0.45,
        ease: "power3.out",
      });
      quickY.current = gsap.quickTo(element, "y", {
        duration: 0.45,
        ease: "power3.out",
      });
    },
    { scope: listRef },
  );

  useEffect(() => {
    const hide = () => setPreviewVisible(false);
    window.addEventListener("scroll", hide, { passive: true });
    return () => window.removeEventListener("scroll", hide);
  }, []);

  const canPreview = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(pointer: fine)").matches &&
    window.innerWidth >= 1100;

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!canPreview()) return;
    const target = event.target;
    if (!(target instanceof Element)) return;

    const row = target.closest<HTMLButtonElement>("button[data-service]");
    if (!row) {
      setPreviewVisible(false);
      return;
    }

    const nextImage = row.dataset.image;
    if (nextImage && nextImage !== previewImage) setPreviewImage(nextImage);

    const width = 230;
    const x = Math.min(
      Math.max(event.clientX + 150, width / 2 + 16),
      window.innerWidth - width / 2 - 16,
    );
    const y = Math.min(
      Math.max(event.clientY, 170),
      window.innerHeight - 170,
    );

    if (!primed.current) {
      primed.current = true;
      if (previewRef.current) {
        gsap.set(previewRef.current, { x, y });
      }
    }
    quickX.current?.(x);
    quickY.current?.(y);
    setPreviewVisible(true);
  };

  return (
    <section
      className="relative border-t border-cream/14 bg-ink-2 py-[clamp(4.5rem,9vw,8rem)] max-[560px]:py-[clamp(3.5rem,12vw,4.5rem)]"
      id="services"
    >
      <Reveal className="container-page mb-[clamp(2.5rem,5vw,4rem)]">
        <div className="grid grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)] items-end gap-[clamp(1.5rem,4vw,4.5rem)] max-[900px]:grid-cols-1 max-[900px]:gap-5">
          <h2 className="h2">
            Take your time.
            <br />
            We&apos;ll take it <em>from here.</em>
          </h2>
          <p className="lede max-[900px]:max-w-[60ch]">
            Every appointment starts with a proper consultation and finishes
            with a hot towel. The espresso is on us.
          </p>
        </div>
      </Reveal>

      <div className="container-page">
        <div
          ref={listRef}
          onPointerMove={handlePointerMove}
          onPointerLeave={() => setPreviewVisible(false)}
        >
          <Reveal className="services__list">
            {SERVICES.map((service, index) => (
              <button
                key={service.name}
                className={`service ${service.featured ? "service--feature" : ""}`}
                type="button"
                data-service={service.name}
                data-image={service.image}
                onClick={() => openBooking({ service: service.name })}
              >
                <span className="service__no">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="service__body">
                  <span className="service__name">
                    {service.name}
                    {service.tag ? (
                      <span className="service__tag">{service.tag}</span>
                    ) : null}
                  </span>
                  <span className="service__desc">{service.description}</span>
                </span>
                <span className="service__time">{service.duration} min</span>
                <span className="service__price">${service.price}</span>
                <span className="service__arrow" aria-hidden="true">
                  →
                </span>
              </button>
            ))}
          </Reveal>
        </div>

        <Reveal delay={0.05}>
          <p className="mt-6 max-w-[66ch] text-[0.78rem] leading-[1.8] text-muted">
            Prices are starting points and vary with hair length and barber.
            We&apos;ll always quote before the first snip. Not sure what you
            need?{" "}
            <button
              className="text-link"
              type="button"
              onClick={() => openBooking()}
            >
              Let&apos;s talk it through.
            </button>
          </p>
        </Reveal>
      </div>

      <div ref={previewRef} className="service-preview" aria-hidden="true">
        <motion.div
          className="service-preview-card"
          animate={{
            opacity: previewVisible ? 1 : 0,
            scale: previewVisible ? 1 : 0.9,
            rotate: previewVisible ? -1.5 : -2,
          }}
          initial={false}
          transition={{
            duration: reduceMotion ? 0.1 : 0.35,
            ease: EASE,
          }}
        >
          <Image
            src={previewImage}
            alt=""
            fill
            sizes="230px"
            className="object-cover"
          />
        </motion.div>
      </div>
    </section>
  );
}
