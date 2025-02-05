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
        url: '/favicon.ico',
        href: '/favicon.ico',
      }
    ],
    // 애플 기기를 위한 아이콘 (선택사항)
    apple: [
      {
        url: '/apple-icon.png',
        sizes: '180x180',
        type: 'image/png',
      }
    ],
  },
  openGraph: {
    title: "InnoCard",
    description: "InnoCard - 혁신적인 전자 명함 솔루션",
    type: "website",
    images: [{
      url: '/og-image.png',
      width: 1200,
      height: 630,
      alt: 'InnoCard'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'INNOCURVE',
    description: 'INNOCURVE - AI 기반 디지털 혁신 기업',
    images: ['/images/og-image.png'],
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
