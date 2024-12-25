import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Image from 'next/image'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '홍길동의 개인 PR 사이트',
  description: '웹 개발자 홍길동의 포트폴리오 및 챗봇',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={`${inter.className} bg-background text-foreground`}>
        <header className="bg-white shadow-md">
          <div className="container mx-auto px-6 py-4 flex items-center">
            <Image
              src="/placeholder.svg"
              alt="프로필 이미지"
              width={50}
              height={50}
              className="rounded-full mr-4"
            />
            <h1 className="text-2xl font-bold text-gray-800">이재권의 PR 사이트</h1>
          </div>
        </header>
        <main className="container mx-auto px-6 py-8">
          {children}
        </main>
        <footer className="bg-white shadow-md mt-8">
          <div className="container mx-auto px-6 py-4 text-center text-gray-600">
            © 2024 이재권. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  )
}

