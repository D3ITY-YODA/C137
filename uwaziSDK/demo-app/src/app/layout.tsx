import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Uwazi — NGO Transparency Demo",
  description: "Demo app for blockchain donation tracking",
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