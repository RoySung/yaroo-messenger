import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

// oxlint-disable-next-line react/only-export-components -- Next.js App Router requires metadata exports in layout modules.
export const metadata: Metadata = {
  title: "Yaroo! Messenger",
  description: "Anonymous real-time Messenger chat",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="zh-Hant">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
