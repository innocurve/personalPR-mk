import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { LanguageProvider } from './contexts/LanguageContext';
import { Inter } from 'next/font/google'

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  title: "정민기 AI Clone",
  description: "정민기의 AI 클론 채팅봇",
  icons: {
    icon: [
      {
        url: '/logo.png',
        href: '/logo.png',
      }
    ],
    apple: [
      {
        url: '/logo.png',
        sizes: '180x180',
        type: 'image/png',
      }
    ],
  },
  openGraph: {
    title: "정민기 AI Clone",
    description: "정민기의 AI 클론 채팅봇",
    type: "website",
    images: [{
      url: '/logo.png',
      width: 800,
      height: 800,
      alt: '정민기 AI Clone'
    }],
    siteName: "정민기 AI Clone"
  },
  twitter: {
    card: 'summary_large_image',
    title: '정민기 AI Clone',
    description: '정민기의 AI 클론 채팅봇',
    images: ['/logo.png'],
    creator: '@minki',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-icon.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased ${inter.className}`}
      >
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
