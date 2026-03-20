export const siteConfig = {
  name: "Omni Cartix",
  description: "Everything Digital. Everything Delivered. Your UK marketplace for physical products, digital downloads, and SaaS solutions.",
  tagline: "Everything Digital. Everything Delivered.",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://omnicartix.co.uk",
  ogImage: "/og-image.png",
  company: {
    name: "Omni Cartix Ltd",
    registrationNumber: "12345678",
    vatNumber: "GB123456789",
    address: {
      line1: "123 Innovation Street",
      city: "London",
      postcode: "EC1A 1BB",
      country: "United Kingdom",
    },
    email: "hello@omnicartix.co.uk",
    phone: "+44 20 1234 5678",
    icoNumber: "ZA123456",
  },
  social: {
    twitter: "https://twitter.com/omnicartix",
    linkedin: "https://linkedin.com/company/omnicartix",
    instagram: "https://instagram.com/omnicartix",
    facebook: "https://facebook.com/omnicartix",
  },
  sic: {
    physical: "47910",
    digital: "58290",
    saas: "62012",
  },
  vatRate: 0.2,
  currency: "GBP",
  locale: "en-GB",
};

export type SiteConfig = typeof siteConfig;
