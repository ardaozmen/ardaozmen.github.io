import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";

export const metadata: Metadata = {
  title: "Arda Cem Özmen",
  description: "Engineering trust for the age of AI.",
  metadataBase: new URL("https://ardaozmen.github.io"),
  openGraph: {
    title: "Arda Cem Özmen",
    description: "Engineering trust for the age of AI.",
    url: "https://ardaozmen.github.io",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#050505",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={GeistSans.className}>
      <body>{children}</body>
    </html>
  );
}
