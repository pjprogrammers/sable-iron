"use client";

import { useState } from "react";
import Reveal from "@/components/Reveal";
import { FAQS } from "@/lib/data";

export default function Faq() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section
      className="relative py-[clamp(4.5rem,9vw,8rem)] max-[560px]:py-[clamp(3.5rem,12vw,4.5rem)]"
      id="faq"
    >
      <div className="container-page grid grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] items-start gap-[clamp(2rem,6vw,6rem)] max-[900px]:grid-cols-1 max-[900px]:gap-10">
        <Reveal className="max-[900px]:static min-[901px]:sticky min-[901px]:top-[calc(var(--header-h)+2rem)]">
          <h2 className="h2">
            Before you
            <br />
            <em>sit down.</em>
          </h2>
          <p className="lede mt-[1.35rem]">
            The questions we hear most. Anything else, call the shop or ask the
            concierge in the corner.
          </p>
          <a className="arrow-link mt-8" href="tel:+13055550142">
            (305) 555-0142 <span aria-hidden="true">→</span>
          </a>
        </Reveal>

        <Reveal className="border-t border-cream/14" delay={0.08}>
          <div>
            {FAQS.map((faq, index) => {
              const open = openIndex === index;
              return (
                <div
                  key={faq.question}
                  className={`faq__item ${open ? "is-open" : ""}`}
                >
                  <h3>
                    <button
                      className="faq__trigger"
                      type="button"
                      aria-expanded={open}
                      aria-controls={`faq-${index + 1}`}
                      id={`faq-trigger-${index + 1}`}
                      onClick={() =>
                        setOpenIndex((current) =>
                          current === index ? -1 : index,
                        )
                      }
                    >
                      <span>{faq.question}</span>
                      <span className="faq__icon" aria-hidden="true" />
                    </button>
                  </h3>
                  <div
                    className="faq__panel"
                    id={`faq-${index + 1}`}
                    role="region"
                    aria-labelledby={`faq-trigger-${index + 1}`}
                    aria-hidden={!open}
                  >
                    <div className="faq__panel-inner">
                      <p className="max-w-[58ch] pb-6 pr-10 text-[0.9rem] leading-[1.8] text-muted max-[560px]:pr-2">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
