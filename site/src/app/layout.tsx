import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = "https://femmeferments.com";
const SITE_NAME = "Femme Ferments — Beauty in the Broken Glass";
const SITE_DESCRIPTION =
  "A nonprofit wine organization in the Willamette Valley. 100% of profits empower women.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
  },
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: "Femme Ferments",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
};

// Structured data (JSON-LD) so search engines and AI crawlers can reliably
// identify the org, its mission, and its location without scraping prose.
// Combines Organization + LocalBusiness (the winery is a physical presence
// in the Willamette Valley) per schema.org guidance for small orgs with a
// single location.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": ["Organization", "LocalBusiness"],
  name: "Femme Ferments",
  alternateName: "Beauty in the Broken Glass",
  description: SITE_DESCRIPTION,
  slogan: "Beauty in the Broken Glass",
  url: SITE_URL,
  logo: `${SITE_URL}/FF_Logo.png`,
  image: `${SITE_URL}/opengraph-image`,
  address: {
    "@type": "PostalAddress",
    addressRegion: "OR",
    addressLocality: "Willamette Valley",
    addressCountry: "US",
  },
  areaServed: {
    "@type": "Place",
    name: "Willamette Valley, Oregon",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${inter.variable} antialiased`}
    >
      <body>
        {/* Static, server-authored JSON-LD (no user input) — required pattern
            for embedding structured data per Next.js/schema.org guidance. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
