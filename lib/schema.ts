import { LOCATIONS, SITE } from "@/lib/data";

const organizationId = "https://sableandiron.com/#organization";

export const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": organizationId,
      name: SITE.name,
      url: "https://sableandiron.com",
      email: SITE.email,
      description:
        "A modern barber atelier in Miami offering precision haircuts, hot-towel shaves and beard sculpting.",
      foundingDate: "2014",
      sameAs: ["https://www.instagram.com/sableandiron/"],
      department: LOCATIONS.map((location) => ({
        "@id": `https://sableandiron.com/#${location.id}`,
      })),
    },
    {
      "@type": "HairSalon",
      "@id": "https://sableandiron.com/#edgewater",
      name: "Sable & Iron — Edgewater",
      parentOrganization: { "@id": organizationId },
      telephone: "+1-305-555-0142",
      priceRange: "$$",
      image: "https://sableandiron.com/assets/interior-1.jpg",
      address: {
        "@type": "PostalAddress",
        streetAddress: "2100 Biscayne Blvd",
        addressLocality: "Miami",
        addressRegion: "FL",
        postalCode: "33137",
        addressCountry: "US",
      },
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: "09:00",
          closes: "20:00",
        },
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: "Saturday",
          opens: "09:00",
          closes: "18:00",
        },
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: "Sunday",
          opens: "10:00",
          closes: "16:00",
        },
      ],
    },
    {
      "@type": "HairSalon",
      "@id": "https://sableandiron.com/#coral-gables",
      name: "Sable & Iron — Coral Gables",
      parentOrganization: { "@id": organizationId },
      telephone: "+1-305-555-0177",
      priceRange: "$$",
      image: "https://sableandiron.com/assets/interior-2.jpg",
      address: {
        "@type": "PostalAddress",
        streetAddress: "120 Giralda Ave",
        addressLocality: "Coral Gables",
        addressRegion: "FL",
        postalCode: "33134",
        addressCountry: "US",
      },
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: "10:00",
          closes: "19:00",
        },
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: "Saturday",
          opens: "09:00",
          closes: "17:00",
        },
      ],
    },
  ],
};
