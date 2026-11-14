import Image from "next/image";
import CountUp from "@/components/CountUp";
import Reveal from "@/components/Reveal";

export default function About() {
  const stats = [
    { value: 12, unit: "yrs", label: "Behind the chair" },
    { value: 2, unit: "", label: "Miami shops" },
    { value: 9, unit: "", label: "Barbers & shave specialists" },
    { value: 48, unit: "k", label: "Cuts and counting" },
  ];

  return (
    <section
      className="relative py-[clamp(4.5rem,9vw,8rem)] pb-0 max-[560px]:py-[clamp(3.5rem,12vw,4.5rem)] max-[560px]:pb-0"
      id="about"
    >
      <Reveal className="container-page mb-0">
        <div className="grid grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)] items-end gap-[clamp(1.5rem,4vw,4.5rem)] max-[900px]:grid-cols-1 max-[900px]:gap-5">
          <h2 className="h2">
            Old-world craft.
            <br />
            New-world <em>ease.</em>
          </h2>
          <p className="lede max-[900px]:max-w-[60ch]">
            No conveyor belts, no rushed buzzers. Just a hot towel, a sharp blade
            and a barber who listens.
          </p>
        </div>
      </Reveal>

      <div className="container-page mt-[clamp(3rem,6vw,5rem)] grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] items-center gap-[clamp(2rem,6vw,6rem)] max-[900px]:grid-cols-1 max-[900px]:gap-[2.75rem]">
        <Reveal>
          <figure className="relative max-[900px]:max-w-[520px]">
            <div className="relative aspect-[4/5] overflow-hidden outline outline-1 outline-offset-[12px] outline-cream/16">
              <Image
                src="/assets/interior-1.jpg"
                alt="Barber chairs and mirrors inside the Sable and Iron shop"
                fill
                sizes="(max-width: 900px) 100vw, 45vw"
                className="object-cover saturate-[0.88] contrast-[1.02]"
              />
            </div>
            <figcaption className="mt-[1.4rem] text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-muted">
              The Edgewater shop, late afternoon.
            </figcaption>
          </figure>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="text-cream-dim">
            <p className="dropcap max-w-[62ch] text-pretty text-[clamp(0.95rem,1.05vw,1.03rem)] font-light leading-[1.85]">
              We opened our doors with a simple idea: slow down. A haircut is a
              small, reliable way to feel like yourself again — so it deserves
              more than fifteen minutes and a numbered ticket.
            </p>
            <p className="mt-5 max-w-[62ch] text-pretty text-[clamp(0.95rem,1.05vw,1.03rem)] font-light leading-[1.85]">
              Every barber here trained the long way: scissors first, clippers
              second, conversation always. We keep the music low, the towels hot
              and the appointments unhurried. You&apos;ll get a proper
              consultation, a drink in your hand and a cut that still looks right
              three weeks later.
            </p>
            <blockquote className="about-quote">
              “The best cut is the one you don&apos;t have to think about the next
              morning.”
            </blockquote>
            <p className="about-sig">
              <span aria-hidden="true" />
              Marco Reyes, founder
            </p>
          </div>
        </Reveal>
      </div>

      <div
        className="container-page stats mt-[clamp(3.5rem,7vw,6rem)]"
        role="list"
      >
        {stats.map((stat, index) => (
          <Reveal
            key={stat.label}
            className="stat"
            delay={index * 0.08}
            role="listitem"
          >
            <p className="stat__figure">
              <CountUp value={stat.value} />
              {stat.unit ? (
                <span className="stat__unit">{stat.unit}</span>
              ) : null}
            </p>
            <p className="stat__label">{stat.label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
