import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://spoken-english-nepal-launchpad.digitalsaugatb.chatgpt.site"),
  title: "Spoken English Nepal | English Fluency Launchpad",
  description: "Build your English confidence with daily live classes, speaking practice, and assignments in a focused two-month program.",
  openGraph: {
    title: "Stop getting stuck. Start speaking.",
    description: "Explore the two-month English Fluency Launchpad from Spoken English Nepal.",
    type: "website",
    images: [{ url: "/sen-logo.png", width: 225, height: 225, alt: "Spoken English Nepal" }],
  },
  twitter: { card: "summary", title: "Spoken English Nepal", description: "Stop getting stuck. Start speaking." },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
