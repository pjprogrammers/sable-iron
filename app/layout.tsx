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
  openGraph: {
    type: "website",
    url: "/",
    siteName: SITE.name,
    title: "Sable & Iron — Luxury Barbershop in Miami",
    description:
      "Precision cuts, straight-razor shaves and proper chair time in Edgewater and Coral Gables.",
    images: [
      {
        url: "/assets/og-image.jpg",
        type: "image/jpeg",
        width: 1200,
        height: 630,
        alt: "Sable & Iron homepage with the headline “Look sharp. Feel unhurried.” above booking buttons and a barber at work.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sable & Iron — Luxury Barbershop in Miami",
    description:
      "Precision cuts, straight-razor shaves and proper chair time in Edgewater and Coral Gables.",
    images: [
      {
        url: "/assets/og-image.jpg",
        type: "image/jpeg",
        width: 1200,
        height: 630,
        alt: "Sable & Iron homepage with the headline “Look sharp. Feel unhurried.” above booking buttons and a barber at work.",
      },
    ],
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
