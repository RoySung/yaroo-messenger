import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

// oxlint-disable-next-line react/only-export-components -- Next.js App Router requires metadata exports in layout modules.
export const metadata: Metadata = {
  title: "Yaroo! Messenger",
  description: "Anonymous real-time Messenger chat",
  icons: { icon: "/favicon.svg" },
};

// oxlint-disable-next-line react/only-export-components -- Next.js App Router requires viewport exports in layout modules.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="zh-Hant">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
