import BookButton from "@/components/BookButton";
import { LOCATIONS, NAV_LINKS, SITE } from "@/lib/data";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container-page grid grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] gap-[clamp(2.5rem,7vw,7rem)] max-[1024px]:grid-cols-1 max-[1024px]:gap-12">
        <div>
          <a className="brand brand--footer" href="#top" aria-label="Sable and Iron, back to top">
            <span className="brand__name">
              Sable <span className="brand__amp">&amp;</span> Iron
            </span>
            <span className="brand__sub">Barber Atelier · Miami</span>
          </a>
          <p className="mt-[1.35rem] max-w-[36ch] text-[0.85rem] font-light leading-[1.75] text-muted">
            A sharp cut is a quiet kind of confidence. We&apos;ve been in the
            business of both since 2014.
          </p>
          <a className="footer__email" href={`mailto:${SITE.email}`}>
            {SITE.email}
          </a>
          <div className="footer__socials mt-7 flex gap-[0.55rem]">
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener"
              aria-label="Sable and Iron on Instagram"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.2" cy="6.8" r="1" />
              </svg>
            </a>
            <a
              href={LOCATIONS[0].mapUrl}
              target="_blank"
              rel="noopener"
              aria-label="Sable and Iron on Google Maps"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11z" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
            </a>
            <a
              href="https://www.yelp.com/"
              target="_blank"
              rel="noopener"
              aria-label="Sable and Iron on Yelp"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M11 3v8.5L6.2 8.2 4 11.8l4.8 3.3L4 18.4l2.2 3.6L11 18.7V21h4V3h-4z" />
              </svg>
            </a>
          </div>
        </div>

        <div className="footer__cols grid max-w-[820px] grid-cols-3 gap-[clamp(1.5rem,3vw,3rem)] max-[720px]:grid-cols-2 max-[720px]:gap-8 max-[560px]:grid-cols-1">
          <div>
            <h3>Visit</h3>
            <address>
              {LOCATIONS.map((location) => (
                <a
                  key={location.id}
                  href={location.mapUrl}
                  target="_blank"
                  rel="noopener"
                >
                  <b>{location.name}</b>
                  <br />
                  {location.addressLine1}
                  <br />
                  {location.addressLine2}
                </a>
              ))}
            </address>
          </div>
          <div>
            <h3>Explore</h3>
            <ul>
              {NAV_LINKS.map((link) => (
                <li key={link.href} className="my-[0.55rem]">
                  <a className="footer__link" href={link.href}>
                    {link.label}
                  </a>
                </li>
              ))}
              <li className="my-[0.55rem]">
                <BookButton className="footer__link">Book a chair</BookButton>
              </li>
            </ul>
          </div>
          <div className="max-[720px]:col-span-2 max-[560px]:col-span-1">
            <h3>Hours</h3>
            <dl className="flex flex-col gap-4">
              <div>
                <dt className="text-[0.8rem] text-cream-dim">Edgewater</dt>
                <dd className="mt-[0.2rem] text-[0.82rem] leading-[1.65] text-muted">
                  Mon–Fri 9–8
                  <br />
                  Sat 9–6 · Sun 10–4
                </dd>
              </div>
              <div>
                <dt className="text-[0.8rem] text-cream-dim">Coral Gables</dt>
                <dd className="mt-[0.2rem] text-[0.82rem] leading-[1.65] text-muted">
                  Tue–Fri 10–7
                  <br />
                  Sat 9–5 · Sun–Mon closed
                </dd>
              </div>
            </dl>
            <p className="footer__contact">
              <a href="tel:+13055550142">(305) 555-0142</a>
              <br />
              <a href="tel:+13055550177">(305) 555-0177</a>
            </p>
          </div>
        </div>
      </div>

      <div className="container-page footer__wordmark" aria-hidden="true">
        Sable &amp; Iron
      </div>

      <div className="container-page mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-cream/14 py-6 text-[0.8rem] tracking-[0.02em] text-muted max-[560px]:flex-col max-[560px]:items-start max-[720px]:pb-[calc(1.5rem+env(safe-area-inset-bottom))] min-[721px]:pr-44">
        <p>
          © {year} Sable &amp; Iron Barber Co.
          <span className="footer__demo">
            Fictional demo shop · placeholder photography.
          </span>
        </p>
        <div className="flex items-center gap-6 max-[560px]:gap-4">
          <a
            className="inline-flex min-h-11 items-center text-cream-dim transition-colors hover:text-cream"
            href="#top"
          >
            Back to top <span aria-hidden="true">↑</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
