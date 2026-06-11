import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SaarathiAI — Wisdom from the Bhagavad Gita",
  description:
    "Your spiritual charioteer. SaarathiAI maps your real-life struggles to the timeless wisdom of the Bhagavad Gita, delivering personalized guidance powered by AI.",
  keywords: [
    "Bhagavad Gita",
    "spiritual guidance",
    "Krishna",
    "AI wisdom",
    "SaarathiAI",
    "meditation",
    "life advice",
  ],
  authors: [{ name: "SaarathiAI" }],
  openGraph: {
    title: "SaarathiAI — Wisdom from the Bhagavad Gita",
    description:
      "Your spiritual charioteer. Map your life struggles to ancient Gita wisdom.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "SaarathiAI — Wisdom from the Bhagavad Gita",
    description:
      "Your spiritual charioteer. Map your life struggles to ancient Gita wisdom.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="theme-color" content="#08060A" />
        <meta name="color-scheme" content="dark" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}
