import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Manrope } from "next/font/google";
import BookingProvider from "@/components/BookingProvider";
import { SITE } from "@/lib/data";
import { structuredData } from "@/lib/schema";
import "./globals.css";

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-bodoni",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sableandiron.com"),
  title: SITE.title,
  description: SITE.description,
  applicationName: SITE.name,
  authors: [{ name: SITE.name }],
  creator: SITE.name,
  publisher: SITE.name,
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [{ url: "/assets/favicon.svg", type: "image/svg+xml" }],
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: SITE.name,
    title: "Sable & Iron — Luxury Barbershop in Miami",
    description:
      "Precision cuts, straight-razor shaves and proper chair time in Edgewater and Coral Gables.",
    images: [
      {
        url: "/assets/hero.jpg",
        width: 2000,
        height: 1333,
        alt: "A barber shaping a client's haircut in a warmly lit shop",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sable & Iron — Luxury Barbershop in Miami",
    description:
      "Precision cuts, straight-razor shaves and proper chair time in Edgewater and Coral Gables.",
    images: ["/assets/hero.jpg"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0d0c0b",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${bodoni.variable} ${manrope.variable}`}>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <BookingProvider>{children}</BookingProvider>
      </body>
    </html>
  );
}
