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
  title: "Ghostbirth 2 — A Film by Marius Jopen",
  description:
    "Ghostbirth 2 is a slow-burn body horror film set in Bangkok by Marius Jopen.",
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
