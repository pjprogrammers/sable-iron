"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import BookButton from "@/components/BookButton";
import Reveal from "@/components/Reveal";
import { LOCATIONS } from "@/lib/data";
import {
  getLocationStatus,
  type LocationStatus,
} from "@/lib/booking";

export default function Locations() {
  const [statuses, setStatuses] = useState<(LocationStatus | null)[]>(
    () => LOCATIONS.map(() => null),
  );

  useEffect(() => {
    const update = () => {
      setStatuses(
        LOCATIONS.map((location) => getLocationStatus(location.schedule)),
      );
    };

    update();
    const interval = window.setInterval(update, 60_000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <section
      className="relative py-[clamp(4.5rem,9vw,8rem)] max-[560px]:py-[clamp(3.5rem,12vw,4.5rem)]"
      id="locations"
    >
      <Reveal className="container-page mb-[clamp(2.5rem,5vw,4rem)]">
        <div className="grid grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)] items-end gap-[clamp(1.5rem,4vw,4.5rem)] max-[900px]:grid-cols-1 max-[900px]:gap-5">
          <h2 className="h2">
            Two doors,
            <br />
            one <em>standard.</em>
          </h2>
          <p className="lede max-[900px]:max-w-[60ch]">
            Both shops run the same menu, the same towels and the same playlist.
            Pick the one closer to your day.
          </p>
        </div>
      </Reveal>

      <div className="container-page grid grid-cols-2 gap-[clamp(1.25rem,2.5vw,2rem)] max-[900px]:grid-cols-1">
        {LOCATIONS.map((location, index) => {
          const status = statuses[index];
          return (
            <Reveal key={location.id} delay={index * 0.08}>
              <article className="location h-full">
                <div className="location__media">
                  <Image
                    src={location.image}
                    alt={location.imageAlt}
                    fill
                    sizes="(max-width: 900px) 100vw, 50vw"
                    className="object-cover"
                  />
                  <span className="location__badge">{location.name}</span>
                </div>
                <div className="p-[clamp(1.35rem,2.6vw,2.1rem)]">
                  <div className="flex items-baseline justify-between gap-4 max-[560px]:flex-col max-[560px]:gap-[0.35rem]">
                    <h3 className="font-display text-[clamp(1.8rem,2.6vw,2.35rem)] font-normal leading-[1.1] tracking-[-0.02em]">
                      {location.name}
                    </h3>
                    <p
                      className={`location__status ${status?.open ? "is-open" : ""}`}
                    >
                      <span className="status-dot" aria-hidden="true" />
                      <span>{status?.label ?? "Open today"}</span>
                    </p>
                  </div>
                  <p className="mt-[0.7rem] text-[0.86rem] leading-[1.65] text-cream-dim">
                    {location.addressLine1}
                    <br />
                    {location.addressLine2}
                  </p>
                  <dl className="hours">
                    {location.hoursDisplay.map((row) => (
                      <div key={row.label}>
                        <dt>{row.label}</dt>
                        <dd>{row.value}</dd>
                      </div>
                    ))}
                  </dl>
                  <div className="mt-6 flex flex-wrap items-center gap-[0.6rem] border-t border-cream/14 pt-[1.2rem] max-[560px]:[&_.btn]:flex-1">
                    <a
                      className="btn btn--ghost btn--sm"
                      href={location.mapUrl}
                      target="_blank"
                      rel="noopener"
                    >
                      Directions <span aria-hidden="true">↗</span>
                    </a>
                    <BookButton
                      className="btn btn--solid btn--sm"
                      location={location.name}
                    >
                      Book {location.name}
                    </BookButton>
                    <a
                      className="location__phone max-[560px]:mt-[0.3rem] max-[560px]:w-full max-[560px]:text-left"
                      href={location.phoneHref}
                    >
                      {location.phone}
                    </a>
                  </div>
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>

      <Reveal className="container-page mt-7">
        <p className="max-w-[66ch] text-[0.82rem] leading-[1.8] text-muted">
          Walk-ins are welcome whenever there&apos;s a free chair. Weekends fill
          up fast — a booking is the safer bet. Street parking and nearby garages
          at both shops.
        </p>
      </Reveal>
    </section>
  );
}
