import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";

export const metadata: Metadata = {
  title: "ardaozmen.github.io",
  metadataBase: new URL("https://ardaozmen.github.io"),
  openGraph: {
    title: "ardaozmen.github.io",
    url: "https://ardaozmen.github.io",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#050505",
  colorScheme: "dark",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://ardaozmen.github.io/#person",
      name: "Arda Cem Özmen",
      alternateName: ["Arda Özmen", "ardaozmen"],
      url: "https://ardaozmen.github.io",
      description: "Intelligence deserves better systems.",
      sameAs: [
        "https://github.com/ardaozmen",
        "https://www.linkedin.com/in/ardacemozmen",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://ardaozmen.github.io/#website",
      url: "https://ardaozmen.github.io",
      name: "Arda Cem Özmen",
      alternateName: ["ardaozmen", "ardaozmen.github.io"],
      publisher: { "@id": "https://ardaozmen.github.io/#person" },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={GeistSans.className}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
