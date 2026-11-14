# Sable & Iron — Barber Atelier

An original, production-style single-page website for a fictional luxury barbershop in Miami. Built with Next.js (App Router), React, Tailwind CSS, Framer Motion and GSAP.

> **Original work.** This is a new design with original copy, branding and layout. It does not reproduce any existing website's text, photography, branding or code. All names, reviews, addresses, phone numbers and statistics are fictional. Replace them before going live.

## Stack

| Tool | Role |
| --- | --- |
| Next.js 16 / React 19 | App Router, server metadata, image optimization |
| Tailwind CSS 4 | Layout, spacing and typography utilities |
| Framer Motion | Entrances, reveals, dialogs, carousel motion, counters |
| GSAP + `@gsap/react` | Hero ScrollTrigger parallax and service-preview `quickTo` |
| TypeScript | Content types, booking model and component contracts |

## Run it

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

```bash
npm run build      # production build
npm run start      # serve the production build
npm run lint       # ESLint (Next.js core-web-vitals + TypeScript)
npm run typecheck  # tsc --noEmit
```

## Project map

| Path | Purpose |
| --- | --- |
| `app/layout.tsx` | Fonts, metadata, Open Graph/Twitter, viewport theme, JSON-LD, skip link, booking provider |
| `app/page.tsx` | Page composition and section order |
| `app/globals.css` | Design tokens, Tailwind 4 theme, base styles, component and responsive CSS |
| `components/` | One component per section plus booking, menu, concierge, bookbar and motion primitives |
| `lib/data.ts` | Canonical copy, services, barbers, reviews, FAQs, gallery, locations, schedules |
| `lib/booking.ts` | Miami time, slot generation, date formatting, live open/closed status |
| `lib/schema.ts` | `Organization` / `HairSalon` JSON-LD graph |
| `lib/motion.ts` | Shared easing and viewport constants |
| `lib/modal.ts` | Reference-counted scroll lock and background inert handling |
| `app/favicon.ico` | Multi-size 16/32/48 favicon |
| `app/icon.svg` | Scalable Bodoni monogram favicon |
| `app/apple-icon.png` | 180 px Apple touch icon |
| `public/assets/` | Photography, grain tile and the 1200×630 social preview |
| `legacy-static/` | The original pre-Next.js site, preserved for reference only |

## What's included

- **Editorial luxury design** — warm black / cream / brass palette, Bodoni Moda display type, Manrope body type, a real raster grain texture, scroll-triggered hero parallax and a static brass service ribbon.
- **Live shop hours** — Edgewater and Coral Gables show “Open now”, “Closed · opens 9am”, etc., calculated in `America/New_York` and refreshed every minute.
- **Booking flow** — service, location, barber, date and time. Times are generated in 30-minute increments from each shop's schedule, filtered by service duration and by Miami time, so closed days and past slots cannot be chosen. Changing shops advances to the next open day. Inline name/phone validation, stale-slot revalidation, closed-day/no-slot hints and a success screen with an `SI-####` reference.
- **Prefilled booking** — service rows, barber cards, location cards, the header, mobile menu, mobile bookbar and hero all open the dialog with the relevant prefill.
- **Services list** — GSAP `quickTo` image preview on a fine pointer at desktop widths; every row opens the booking dialog with that service selected.
- **Gallery** — horizontal drag/scroll rail with snap points, arrow buttons and keyboard arrow support.
- **Reviews carousel** — auto-rotation pauses on hover/focus, via the pause control, and stops for reduced motion. Includes dots, arrows, swipe, keyboard support and screen-reader slide announcements.
- **Barber cards** — grayscale-to-color hover, direct booking by barber.
- **FAQ accordion** — one item open at a time, animated with `grid-template-rows`.
- **Email offer** — validates the address, reveals the `WELCOME10` code, supports one-click copy and keeps a clear demo disclosure.
- **Concierge chat** — rule-based demo assistant with quick replies, typing indicator and mobile show-on-scroll behaviour above the bookbar.
- **Mobile experience** — full-screen animated menu, sticky booking bar after the hero (hidden near the footer), concierge repositioned above the bar, 44 px touch targets and 16 px inputs to prevent zoom.
- **Accessibility** — skip link, visible focus styles, labelled icon buttons, `aria-expanded`/`aria-controls`, `aria-current` scrollspy, custom focus traps, inert backgrounds, focus return after dialogs close, managed success focus, scroll lock and `prefers-reduced-motion` support.
- **SEO** — descriptive title/meta, canonical URL, Open Graph and Twitter cards with a real 1200×630 hero screenshot, descriptive image alt text, `HairSalon`/`Organization` JSON-LD.
- **App icons** — a multi-size `.ico`, a scalable black-and-cream Bodoni monogram, and an Apple touch icon, all generated from the same mark.

## Motion

- **Framer Motion** handles the hero entrance, section reveals, booking and menu panel transitions, review crossfades, gallery/menu state, concierge messages, stat counters and newsletter success.
- **GSAP** handles the hero image ScrollTrigger parallax and the desktop service image preview, driven by `gsap.quickTo` and cleaned up through `useGSAP`.
- Motion is intentionally restrained: `once` reveals, short distances, brand easing, no decorative looping in the periphery.
- `prefers-reduced-motion` removes parallax, long reveals, review auto-rotation, the pause control and non-essential transitions.

## Demo limitations — connect these before launch

1. **Booking is front-end only.** No appointment is reserved and no messages are sent; the confirmation reference is random. Connect `BookingDialog` to a booking provider (Boulevard, Booksy, Square Appointments, Calendly) or your own API.
2. **Newsletter is front-end only.** It always reveals `WELCOME10` and subscribes no one. Wire it to Mailchimp, ConvertKit, Buttondown or a serverless endpoint.
3. **Concierge is a keyword-matching demo**, not an AI model. It can give wrong answers; the widget says so.
4. **All content is fictional** — team, reviews, ratings, stats, addresses, phone numbers (`555` numbers) and prices must be replaced.
5. **Social and map links** point to generic destinations; update them to real profiles and listings.
6. **Placeholder photography** is from Unsplash (Unsplash License). Replace it with your own licensed photos, keep roughly the same aspect ratios, and update the `alt` text.

## Customize

- **Colors and fonts** — tokens live at the top of `app/globals.css`; the fonts are configured in `app/layout.tsx` with `next/font`.
- **Copy, prices, team, reviews, FAQs, gallery** — edit `lib/data.ts`.
- **Shop hours and schedules** — edit `hoursDisplay` and `schedule` on each location in `lib/data.ts`. Times are minutes since midnight; `null` means closed. Update `lib/schema.ts` to match.
- **Booking slots** — generated in `buildSlots()` in `lib/booking.ts` in 30-minute steps, filtered by the `SERVICE_DURATIONS` map and Miami's current time. Change the step interval or duration map there.
- **Newsletter code** — the `WELCOME10` value lives in `components/Offer.tsx`.
- **Images** — add replacements to `public/assets/` with the same filenames, or update the paths in `lib/data.ts` and the components.

## Browser support

Evergreen Chrome, Edge, Firefox and Safari. Uses `svh` units, `IntersectionObserver`, CSS grid and `inert`; the interactive extras require JavaScript. The original static version remains in `legacy-static/` for comparison.

Manually QA'd at 320, 390, 768, 1024, 1025 and 1440 px with no horizontal overflow. Axe reports zero WCAG A/AA/best-practice violations on desktop and mobile, including the booking dialog. Build, TypeScript and ESLint pass with zero errors.

## Photo credits

Photography via [Unsplash](https://unsplash.com/license), used as placeholder stock. Replace with your own imagery for production.
