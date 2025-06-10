import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Security Tools Suite | Ethical Hacking & Security Analysis Tools",
  description: "A comprehensive suite of security tools for ethical hackers, developers, and security professionals. Includes phishing detection, port scanning, SSL checking, and more.",
  keywords: "security tools, ethical hacking, cybersecurity, phishing detection, port scanner, SSL checker, WHOIS lookup, DNS lookup, security analysis",
  authors: [{ name: "Security Tools Suite Team" }],
  openGraph: {
    title: "Security Tools Suite | Ethical Hacking & Security Analysis Tools",
    description: "Professional security tools for ethical hackers and security researchers",
    images: ['/hack.jpg'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased ` }
      >
        {children}
      </body>
    </html>
  );
}
