"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import Reveal from "@/components/Reveal";
import { REVIEWS } from "@/lib/data";
import { EASE } from "@/lib/motion";

export default function Reviews() {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [userPaused, setUserPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [status, setStatus] = useState("");
  const [coarsePointer, setCoarsePointer] = useState(false);
  const indexRef = useRef(0);

  useEffect(() => {
    const query = window.matchMedia("(pointer: coarse)");
    const update = () => setCoarsePointer(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  const showReview = useCallback((next: number, announce = false) => {
    const normalized = ((next % REVIEWS.length) + REVIEWS.length) % REVIEWS.length;
    setDirection(normalized > indexRef.current ? 1 : -1);
    indexRef.current = normalized;
    setIndex(normalized);
    if (announce) {
      setStatus(`Review ${normalized + 1} of ${REVIEWS.length}: ${REVIEWS[normalized].name}`);
    }
  }, []);

  const autoRotationAllowed =
    !reduceMotion && !userPaused && !hovered && !focused;

  useEffect(() => {
    if (!autoRotationAllowed) return;
    const timer = window.setInterval(() => {
      if (document.hidden) return;
      showReview(indexRef.current + 1, false);
    }, 6500);
    return () => window.clearInterval(timer);
  }, [autoRotationAllowed, index, showReview]);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    showReview(indexRef.current + (event.key === "ArrowRight" ? 1 : -1), true);
  };

  const pause = () => {
    setUserPaused((current) => {
      const next = !current;
      setStatus(
        next ? "Review rotation paused." : "Review rotation resumed.",
      );
      return next;
    });
  };

  return (
    <section
      className="relative border-y border-cream/14 bg-ink-2 py-[clamp(4.5rem,9vw,8rem)] max-[560px]:py-[clamp(3.5rem,12vw,4.5rem)]"
      id="reviews"
    >
      <Reveal className="container-page mb-[clamp(2.5rem,5vw,4rem)]">
        <div className="grid grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)] items-end gap-[clamp(1.5rem,4vw,4.5rem)] max-[900px]:grid-cols-1 max-[900px]:gap-5">
          <h2 className="h2">
            What the chair
            <br />
            <em>says.</em>
          </h2>
          <p className="lede max-[900px]:max-w-[60ch]">
            A few notes from the people who sit in it. Average rating: 4.9
            across 600+ visits.
          </p>
        </div>
      </Reveal>

      <Reveal className="container-page">
        <div
          className="border-t border-cream/14 pt-[clamp(1.75rem,3.5vw,2.75rem)]"
          role="region"
          aria-roledescription="carousel"
          aria-label="Client reviews"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onFocusCapture={() => setFocused(true)}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node)) {
              setFocused(false);
            }
          }}
          onKeyDown={onKeyDown}
        >
          <motion.div
            className="reviews__viewport"
            id="reviews-viewport"
            drag={coarsePointer ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.12}
            dragMomentum={false}
            onDragEnd={(_, info) => {
              if (Math.abs(info.offset.x) > 45 || Math.abs(info.velocity.x) > 500) {
                showReview(
                  indexRef.current + (info.offset.x < 0 ? 1 : -1),
                  true,
                );
              }
            }}
          >
            {REVIEWS.map((review, reviewIndex) => {
              const active = reviewIndex === index;
              return (
                <motion.blockquote
                  key={review.name}
                  className={`review ${active ? "is-active" : ""}`}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`Review ${reviewIndex + 1} of ${REVIEWS.length}`}
                  aria-hidden={!active}
                  inert={!active}
                  animate={{
                    opacity: active ? 1 : 0,
                    x: active
                      ? 0
                      : reduceMotion
                        ? 0
                        : direction * -14,
                    y: active || reduceMotion ? 0 : 14,
                    visibility: active ? "visible" : "hidden",
                  }}
                  transition={{
                    duration: reduceMotion ? 0.2 : 0.6,
                    ease: EASE,
                  }}
                >
                  <p
                    className="stars mb-[clamp(1.1rem,2vw,1.5rem)]"
                    aria-label="5 out of 5 stars"
                  >
                    ★★★★★
                  </p>
                  <p className="review__quote">“{review.quote}”</p>
                  <footer className="mt-[clamp(1.5rem,3vw,2.25rem)] flex items-center gap-[0.85rem]">
                    <span className="review__avatar" aria-hidden="true">
                      {review.initials}
                    </span>
                    <span>
                      <b className="block text-[0.8rem] font-semibold uppercase tracking-[0.1em] text-cream">
                        {review.name}
                      </b>
                      <small className="mt-[0.2rem] block text-[0.8rem] tracking-[0.03em] text-muted">
                        {review.detail}
                      </small>
                    </span>
                  </footer>
                </motion.blockquote>
              );
            })}
          </motion.div>

          <div className="mt-[clamp(1.75rem,3.5vw,2.5rem)] flex flex-wrap items-center justify-between gap-x-4 gap-y-3 border-t border-cream/14 pt-5">
            <div
              className="reviews__dots"
              role="group"
              aria-label="Choose review"
            >
              {REVIEWS.map((review, reviewIndex) => (
                <button
                  key={review.name}
                  className={`reviews__dot ${reviewIndex === index ? "is-active" : ""}`}
                  type="button"
                  aria-label={`Review ${reviewIndex + 1}`}
                  aria-pressed={reviewIndex === index}
                  aria-controls="reviews-viewport"
                  onClick={() => showReview(reviewIndex, true)}
                />
              ))}
            </div>
            <div className="ml-auto flex flex-none gap-2">
              <button
                className={`circle-btn review-pause ${userPaused ? "is-paused" : ""}`}
                type="button"
                aria-label={
                  userPaused
                    ? "Resume review rotation"
                    : "Pause review rotation"
                }
                onClick={pause}
              >
                <svg className="icon-pause" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M9 5v14M15 5v14" />
                </svg>
                <svg className="icon-play" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.5 5.5l10 6.5-10 6.5z" />
                </svg>
              </button>
              <button
                className="circle-btn"
                type="button"
                aria-label="Previous review"
                aria-controls="reviews-viewport"
                onClick={() => showReview(indexRef.current - 1, true)}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M15 5l-7 7 7 7" />
                </svg>
              </button>
              <button
                className="circle-btn"
                type="button"
                aria-label="Next review"
                aria-controls="reviews-viewport"
                onClick={() => showReview(indexRef.current + 1, true)}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
          <p className="sr-only" role="status" aria-live="polite">
            {status}
          </p>
        </div>
      </Reveal>
    </section>
  );
}
