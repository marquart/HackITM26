import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ARD Casino – Blackjack",
  description: "Premium Blackjack Casino Game",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
