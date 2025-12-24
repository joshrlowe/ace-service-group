import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/toast-provider";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default:
      "Ace Service Group LLC | Construction & Home Services in Lansdale, PA",
    template: "%s | Ace Service Group LLC",
  },
  description:
    "At Ace Service Group, we turn problems into solutions. Professional plumbing, renovations, basement transformations, and outdoor lighting in Lansdale, PA.",
  keywords: [
    "construction",
    "plumbing",
    "renovations",
    "basement finishing",
    "outdoor lighting",
    "Lansdale PA",
    "Pennsylvania contractor",
  ],
  authors: [{ name: "Ace Service Group LLC" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Ace Service Group LLC",
    title: "Ace Service Group LLC | Construction & Home Services",
    description:
      "At Ace Service Group, we turn problems into solutions. From simple plumbing calls to full scale renovations.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${inter.className} antialiased`}>
        {children}
        <ToastProvider />
      </body>
    </html>
  );
}
