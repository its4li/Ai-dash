import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Dashboard",
  description: "Prompt multi‑modal models via a sleek dashboard.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
