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
  metadataBase: new URL("https://studioforge.site"),

  title: {
    default: "Studio Forge",
    template: "%s | Studio Forge",
  },

  description: "단순한 게임이 아닌, 독창적인 세계와 경험을 만듭니다.",

  openGraph: {
    title: "Studio Forge",
    description: "인디 게임 스튜디오",
    url: "https://studioforge.site",
    siteName: "Studio Forge",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
  },

  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
