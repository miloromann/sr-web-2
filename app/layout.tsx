import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./opening.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Studio Romann",
  description: "Studio Romann — New York City creative studio.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
