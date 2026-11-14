import Image from "next/image";
import BookButton from "@/components/BookButton";
import Reveal from "@/components/Reveal";
import { BARBERS } from "@/lib/data";

export default function Barbers() {
  return (
    <section
      className="relative py-[clamp(4.5rem,9vw,8rem)] max-[560px]:py-[clamp(3.5rem,12vw,4.5rem)]"
      id="barbers"
    >
      <Reveal className="container-page mb-[clamp(2.5rem,5vw,4rem)]">
        <div className="grid grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)] items-end gap-[clamp(1.5rem,4vw,4.5rem)] max-[900px]:grid-cols-1 max-[900px]:gap-5">
          <h2 className="h2">
            Steady hands.
            <br />
            Sharp <em>eyes.</em>
          </h2>
          <p className="lede max-[900px]:max-w-[60ch]">
            Nine barbers, one standard. Book by name or let us match you with the
            right pair of hands.
          </p>
        </div>
      </Reveal>

      <div className="container-page barbers__grid">
        {BARBERS.map((barber, index) => (
          <Reveal key={barber.name} delay={index * 0.08}>
            <article className="barber">
              <div className="barber__media">
                <Image
                  src={barber.image}
                  alt={barber.imageAlt}
                  fill
                  sizes="(max-width: 560px) 128px, (max-width: 900px) 180px, 33vw"
                  className="object-cover"
                />
                <span className="barber__no" aria-hidden="true">
                  {barber.number}
                </span>
              </div>
              <div className="barber__body pt-[1.2rem] max-[900px]:pt-0">
                <h3>{barber.name}</h3>
                <p className="barber__role">{barber.role}</p>
                <p className="barber__tags">{barber.tags}</p>
                <BookButton
                  className="arrow-link mt-[1.15rem] max-[560px]:text-[0.75rem]"
                  barber={barber.name}
                >
                  Book with {barber.name.split(" ")[0]}{" "}
                  <span aria-hidden="true">→</span>
                </BookButton>
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal className="container-page mt-[clamp(2.5rem,5vw,4rem)] flex flex-wrap items-center justify-between gap-x-8 gap-y-4 border-t border-cream/14 pt-6">
        <p className="text-[0.82rem] text-muted">
          Also behind the chair: Danny, Luis, Chris, Mo, Elliot and June.
        </p>
        <BookButton className="text-link">
          Book with anyone — we&apos;ll match you.
        </BookButton>
      </Reveal>
    </section>
  );
}
