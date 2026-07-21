import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Rehab Connect - Cabinet de Kinésithérapie",
  description: "Cabinet de kinésithérapie professionnelle spécialisé dans la réadaptation fonctionnelle et la rééducation sportive à Lomé, Togo.",
  keywords: "kinésithérapie, réadaptation, rééducation sportive, physiothérapie, Lomé, Togo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
