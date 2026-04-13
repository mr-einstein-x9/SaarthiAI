import type { Metadata } from "next";
import "./globals.css";
import { AudioPlayer } from "@/components/AudioPlayer";

export const metadata: Metadata = {
  title: "SaarathiAI - Bhagavad Gita Wisdom",
  description: "Find clarity through the timeless wisdom of the Bhagavad Gita.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;600&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans antialiased selection:bg-accent-gold/20">
        {children}
        <AudioPlayer />
      </body>
    </html>
  );
}
