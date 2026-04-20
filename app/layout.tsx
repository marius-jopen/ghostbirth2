import type { Metadata } from "next";
import localFont from "next/font/local";

import "./globals.css";

const gravity = localFont({
  src: "./fonts/ABCGravity-ExtraCondensed.otf",
  variable: "--font-gravity",
  display: "swap",
});

const mono = localFont({
  src: "./fonts/GT-Pressura-Mono-Regular.otf",
  variable: "--font-mono",
  display: "swap",
});


export const metadata: Metadata = {
  title: "GHOSTBIRTH 2 — A Film by Marius Jopen",
  description:
    "A horror movie set in Bangkok. Written and directed by Marius Jopen. Currently in development.",
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    title: "GHOSTBIRTH 2 — A Film by Marius Jopen",
    description:
      "A horror movie set in Bangkok. Written and directed by Marius Jopen. Currently in development.",
    images: [
      {
        url: "/ghostbirth2.jpg",
        width: 1200,
        height: 630,
        alt: "GHOSTBIRTH 2 — A Film by Marius Jopen",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GHOSTBIRTH 2 — A Film by Marius Jopen",
    description:
      "A horror movie set in Bangkok. Written and directed by Marius Jopen. Currently in development.",
    images: ["/ghostbirth2.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${gravity.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
