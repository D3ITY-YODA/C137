import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Uwazi SDK — NGO Transparency",
  description: "Blockchain donation tracking SDK documentation",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}