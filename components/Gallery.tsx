"use client";

import Image from "next/image";
import { useRef, type KeyboardEvent, type PointerEvent } from "react";
import { useReducedMotion } from "framer-motion";
import Reveal from "@/components/Reveal";
import { GALLERY } from "@/lib/data";

export default function Gallery() {
  const railRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({
    down: false,
    startX: 0,
    startScroll: 0,
    moved: false,
    suppressClick: false,
  });
  const reduceMotion = useReducedMotion();

  const scrollRail = (direction: number) => {
    const rail = railRef.current;
    if (!rail) return;
    rail.scrollBy({
      left: direction * Math.round(rail.clientWidth * 0.72),
      behavior: reduceMotion ? "auto" : "smooth",
    });
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch") return;
    if (event.pointerType === "mouse" && event.button !== 0) return;

    const rail = railRef.current;
    if (!rail) return;
    const drag = dragRef.current;
    drag.down = true;
    drag.moved = false;
    drag.startX = event.clientX;
    drag.startScroll = rail.scrollLeft;
    rail.classList.add("is-dragging");
    try {
      rail.setPointerCapture(event.pointerId);
    } catch {
      // Pointer capture can fail if the pointer is already gone.
    }
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const rail = railRef.current;
    const drag = dragRef.current;
    if (!rail || !drag.down) return;

    const delta = event.clientX - drag.startX;
    if (Math.abs(delta) > 5) drag.moved = true;
    if (drag.moved) rail.scrollLeft = drag.startScroll - delta;
  };

  const endDrag = () => {
    const rail = railRef.current;
    const drag = dragRef.current;
    if (!rail || !drag.down) return;
    drag.down = false;
    drag.suppressClick = drag.moved;
    rail.classList.remove("is-dragging");
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const rail = railRef.current;
    if (!rail) return;
    const step = Math.round(rail.clientWidth * 0.7);
    rail.scrollBy({
      left: event.key === "ArrowRight" ? step : -step,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  };

  return (
    <section
      className="section--light relative overflow-hidden py-[clamp(4.5rem,9vw,8rem)] max-[560px]:py-[clamp(3.5rem,12vw,4.5rem)]"
      id="gallery"
    >
      <Reveal className="container-page mb-[clamp(2.5rem,5vw,4rem)]">
        <div className="grid grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)] items-end gap-[clamp(1.5rem,4vw,4.5rem)] max-[900px]:grid-cols-1 max-[900px]:gap-5">
          <h2 className="h2">
            A look around
            <br />
            the <em>shop.</em>
          </h2>
          <div className="flex flex-col items-start gap-[1.35rem]">
            <p className="lede max-[900px]:max-w-[60ch]">
              Warm light, worn leather, good tools and better conversation.
            </p>
            <a
              className="arrow-link"
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener"
            >
              Follow @sableandiron{" "}
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </Reveal>

      <Reveal>
        <div className="relative">
          <div
            ref={railRef}
            id="gallery-rail"
            className="gallery__rail"
            role="region"
            tabIndex={0}
            aria-label="Shop gallery, scroll horizontally"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onPointerLeave={endDrag}
            onKeyDown={onKeyDown}
            onClickCapture={(event) => {
              if (!dragRef.current.suppressClick) return;
              dragRef.current.suppressClick = false;
              event.preventDefault();
              event.stopPropagation();
            }}
          >
            {GALLERY.map((item) => (
              <figure
                key={item.src + item.caption}
                className={`gallery__item gallery__item--${item.shape}`}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 560px) 320px, (max-width: 900px) 45vw, 30vw"
                  className="object-cover"
                />
                <figcaption>
                  <span>{item.number}</span> {item.caption}
                </figcaption>
              </figure>
            ))}
          </div>

          <div className="container-page mt-[1.4rem] flex items-center justify-between gap-4">
            <p className="text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-muted-dark max-[560px]:hidden">
              Drag or scroll to explore
            </p>
            <div className="ml-auto flex gap-2">
              <button
                className="circle-btn"
                type="button"
                aria-label="Previous gallery image"
                aria-controls="gallery-rail"
                onClick={() => scrollRail(-1)}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M15 5l-7 7 7 7" />
                </svg>
              </button>
              <button
                className="circle-btn"
                type="button"
                aria-label="Next gallery image"
                aria-controls="gallery-rail"
                onClick={() => scrollRail(1)}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
