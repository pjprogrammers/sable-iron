export type DayKey = "sun" | "mon" | "tue" | "wed" | "thu" | "fri" | "sat";

export type Schedule = Record<DayKey, [number, number] | null>;

export type Location = {
  id: string;
  name: string;
  addressLine1: string;
  addressLine2: string;
  phone: string;
  phoneHref: string;
  mapUrl: string;
  image: string;
  imageAlt: string;
  hoursDisplay: { label: string; value: string }[];
  schedule: Schedule;
};

export const SITE = {
  name: "Sable & Iron",
  title: "Sable & Iron — Luxury Barbershop in Miami | Edgewater & Coral Gables",
  description:
    "A modern barber atelier in Miami. Precision haircuts, skin fades, hot-towel shaves and beard sculpting in Edgewater and Coral Gables. Book a chair at Sable & Iron.",
  email: "hello@sableandiron.com",
  phone: "(305) 555-0142",
  phoneHref: "tel:+13055550142",
} as const;

export const NAV_LINKS = [
  { href: "#services", label: "Services" },
  { href: "#barbers", label: "Barbers" },
  { href: "#locations", label: "Locations" },
  { href: "#reviews", label: "Reviews" },
  { href: "#faq", label: "Good to know" },
] as const;

export const LOCATIONS: Location[] = [
  {
    id: "edgewater",
    name: "Edgewater",
    addressLine1: "2100 Biscayne Blvd",
    addressLine2: "Miami, FL 33137",
    phone: "(305) 555-0142",
    phoneHref: "tel:+13055550142",
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=2100+Biscayne+Blvd+Miami+FL+33137",
    image: "/assets/interior-1.jpg",
    imageAlt: "The Edgewater shop with leather chairs and warm lighting",
    hoursDisplay: [
      { label: "Mon–Fri", value: "9am – 8pm" },
      { label: "Saturday", value: "9am – 6pm" },
      { label: "Sunday", value: "10am – 4pm" },
    ],
    schedule: {
      mon: [540, 1200],
      tue: [540, 1200],
      wed: [540, 1200],
      thu: [540, 1200],
      fri: [540, 1200],
      sat: [540, 1080],
      sun: [600, 960],
    },
  },
  {
    id: "coral-gables",
    name: "Coral Gables",
    addressLine1: "120 Giralda Ave",
    addressLine2: "Coral Gables, FL 33134",
    phone: "(305) 555-0177",
    phoneHref: "tel:+13055550177",
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=120+Giralda+Ave+Coral+Gables+FL+33134",
    image: "/assets/cut-4.jpg",
    imageAlt: "A vintage leather barber chair inside the Coral Gables shop",
    hoursDisplay: [
      { label: "Tue–Fri", value: "10am – 7pm" },
      { label: "Saturday", value: "9am – 5pm" },
      { label: "Sun–Mon", value: "Closed" },
    ],
    schedule: {
      mon: null,
      tue: [600, 1140],
      wed: [600, 1140],
      thu: [600, 1140],
      fri: [600, 1140],
      sat: [540, 1020],
      sun: null,
    },
  },
];

export type Service = {
  name: string;
  description: string;
  duration: number;
  price: number;
  image: string;
  featured?: boolean;
  tag?: string;
};

export const SERVICES: Service[] = [
  {
    name: "Signature Cut",
    description:
      "Consultation, precision cut, hot towel and a proper finish.",
    duration: 45,
    price: 55,
    image: "/assets/cut-3.jpg",
  },
  {
    name: "Skin Fade",
    description: "Bald fade, blended clean from skin to your length.",
    duration: 45,
    price: 50,
    image: "/assets/hero.jpg",
  },
  {
    name: "Hot-Towel Shave",
    description: "Steam towels, straight razor and a cooling balm finish.",
    duration: 40,
    price: 45,
    image: "/assets/shave.jpg",
  },
  {
    name: "Beard Sculpt",
    description:
      "Shape, line and condition — built around your jaw, not a template.",
    duration: 30,
    price: 30,
    image: "/assets/cut-4.jpg",
  },
  {
    name: "Line-Up",
    description: "Clean edges and a tidy neckline between full cuts.",
    duration: 15,
    price: 20,
    image: "/assets/cut-1.jpg",
  },
  {
    name: "The Full Service",
    description:
      "Cut, hot-towel shave, brow tidy and a drink. Ninety unhurried minutes.",
    duration: 90,
    price: 120,
    image: "/assets/interior-2.jpg",
    featured: true,
    tag: "The one to book",
  },
];

export const SERVICE_DURATIONS: Record<string, number> = Object.fromEntries(
  SERVICES.map((service) => [service.name, service.duration]),
);

export const BARBERS = [
  {
    name: "Marco Reyes",
    role: "Founder · Master Barber",
    tags: "Classic cuts · Scissor work · Beard shapes",
    image: "/assets/barber-marco.jpg",
    imageAlt: "Portrait of Marco Reyes, founder and master barber",
    number: "01",
  },
  {
    name: "Andre Coleman",
    role: "Senior Barber",
    tags: "Skin fades · Textured hair · Kids' cuts",
    image: "/assets/barber-andre.jpg",
    imageAlt: "Portrait of Andre Coleman, senior barber",
    number: "02",
  },
  {
    name: "Sofia Marchetti",
    role: "Barber · Shave Specialist",
    tags: "Straight razor · Beard sculpting · Long hair",
    image: "/assets/barber-sofia.jpg",
    imageAlt: "Portrait of Sofia Marchetti, barber and shave specialist",
    number: "03",
  },
];

export const BARBER_NAMES = [
  "No preference",
  ...BARBERS.map((barber) => barber.name),
];

export const REVIEWS = [
  {
    quote:
      "I'd been looking for a barber who actually listens for years. Found him. The hot towel alone is worth the trip across town.",
    name: "Daniel R.",
    detail: "Edgewater · Verified visit",
    initials: "DR",
  },
  {
    quote:
      "Took my son for his first real haircut. They made it an occasion — patient, precise and zero fuss. He's already asking when we go back.",
    name: "Priya M.",
    detail: "Coral Gables · Verified visit",
    initials: "PM",
  },
  {
    quote:
      "The shave is a proper ritual. Whiskey, steam, straight razor — I walked out looking like a different man. My only complaint is that I didn't book it sooner.",
    name: "Tomas E.",
    detail: "Brickell · Verified visit",
    initials: "TE",
  },
  {
    quote:
      "Booked a last-minute chair before a wedding. Sharpest fade I've had in Miami, and the shop itself is worth arriving early for.",
    name: "Chris A.",
    detail: "Wynwood · Verified visit",
    initials: "CA",
  },
];

export const FAQS = [
  {
    question: "Do I need an appointment?",
    answer:
      "Walk-ins are welcome whenever a chair is free, but weekends and evenings fill up quickly. Booking ahead is the safest way to get the barber and time you want.",
  },
  {
    question: "What's included in a service?",
    answer:
      "Every appointment includes a consultation, a hot-towel finish and a drink — espresso, water or something stronger. Styling advice and product recommendations come free with the chair.",
  },
  {
    question: "Do you cut all hair types and textures?",
    answer:
      "Yes. Our team cuts straight, wavy, curly and coily hair, and we'll match you with the barber who specializes in what you're after. If you're unsure, tell us at booking and we'll handle the pairing.",
  },
  {
    question: "How should I prep for my visit?",
    answer:
      "Come as you are. Clean or styled, it makes no difference — we'll start with a consultation. Photos of cuts you like are always helpful, and honesty about what you don't want is even better.",
  },
  {
    question: "What if I'm running late?",
    answer:
      "Give us a call. We hold chairs for ten minutes; after that we may need to shorten the service or move you to the next open slot so the day stays fair for everyone.",
  },
  {
    question: "Do you sell gift cards?",
    answer:
      "We do — at the desk or over the phone, in any amount. A Full Service gift card has become a suspiciously popular birthday present. We also stock pomades, oils and shave balms if you'd rather wrap something.",
  },
];

export const GALLERY = [
  {
    src: "/assets/cut-2.jpg",
    alt: "A barber cleaning up a client's beard line with a straight razor",
    caption: "The detail work",
    shape: "portrait",
    number: "01",
  },
  {
    src: "/assets/cut-4.jpg",
    alt: "A vintage leather barber chair under warm light",
    caption: "Chair No. 3",
    shape: "wide",
    number: "02",
  },
  {
    src: "/assets/cut-1.jpg",
    alt: "Scissors, clippers and combs laid out on a leather mat",
    caption: "The tools",
    shape: "square",
    number: "03",
  },
  {
    src: "/assets/shave.jpg",
    alt: "A straight-razor shave with a hot towel",
    caption: "Steam, blade, balm",
    shape: "portrait",
    number: "04",
  },
  {
    src: "/assets/cut-3.jpg",
    alt: "A barber shaping a young client's haircut",
    caption: "First cut, no fuss",
    shape: "square",
    number: "05",
  },
  {
    src: "/assets/interior-1.jpg",
    alt: "The Edgewater shop interior at golden hour",
    caption: "A sign of the trade",
    shape: "wide",
    number: "06",
  },
] as const;
