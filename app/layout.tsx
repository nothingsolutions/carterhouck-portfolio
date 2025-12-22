import type { Metadata } from "next";
import { JetBrains_Mono, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const siteUrl = "https://carterhouck.com";

export const metadata: Metadata = {
  title: "Carter Houck | NYC Graphic Designer & Event Manager",
  description: "Carter Houck is a New York City-based graphic designer and event manager. Portfolio featuring work for Nothing Radio, Aspen Posters, Chateau Marmont, The Standard, and more.",
  keywords: [
    "Carter Houck",
    "graphic designer",
    "NYC designer",
    "New York graphic design",
    "event manager",
    "Nothing Radio",
    "Aspen Posters",
    "creative director",
    "web designer",
    "portfolio",
  ],
  authors: [{ name: "Carter Houck", url: siteUrl }],
  creator: "Carter Houck",
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Carter Houck Portfolio",
    title: "Carter Houck | NYC Graphic Designer & Event Manager",
    description: "New York City-based graphic designer and event manager. Work for Nothing Radio, Aspen Posters, Chateau Marmont, The Standard, and more.",
    images: [
      {
        url: "/photowall/carterhouck-01.png",
        width: 1200,
        height: 630,
        alt: "Carter Houck - Graphic Designer & Event Manager",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Carter Houck | NYC Graphic Designer & Event Manager",
    description: "New York City-based graphic designer and event manager.",
    creator: "@carterhouck",
    images: ["/photowall/carterhouck-01.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

// Structured data for SEO (JSON-LD)
const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Carter Houck",
    url: siteUrl,
    image: `${siteUrl}/photowall/carterhouck-01.png`,
    jobTitle: "Graphic Designer & Event Manager",
    worksFor: {
      "@type": "Organization",
      name: "Nothing Radio",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "New York",
      addressRegion: "NY",
      addressCountry: "US",
    },
    email: "carter@nothingradio.com",
    sameAs: [
      "https://instagram.com/carterhouck",
    ],
    knowsAbout: [
      "Graphic Design",
      "Event Management",
      "Web Design",
      "Creative Direction",
      "Video Editing",
      "Photography",
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Carter Houck Portfolio",
    url: siteUrl,
    description: "Portfolio of Carter Houck, a NYC-based graphic designer and event manager.",
    author: {
      "@type": "Person",
      name: "Carter Houck",
    },
  }
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased bg-[#121212] text-white`}
      >
        {children}
      </body>
    </html>
  );
}
