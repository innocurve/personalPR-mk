'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from 'lucide-react'
import { translate } from '../utils/translations'
import { useLanguage } from '../hooks/useLanguage'
import Navigation from '../components/Navigation'
import Link from 'next/link'

export default function InquiryPage() {
  const { language } = useLanguage()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // 여기에 폼 제출 로직 추가
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navigation language={language} />

      <main className="flex-grow pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="w-full">
            <CardHeader className="flex flex-col items-center">
              <div className="self-start">
                <Link href="/" className="p-2 rounded-full hover:bg-gray-100 flex items-center gap-2">
                  <ArrowLeft className="w-5 h-5" />
                  <span className="text-gray-600">Back</span>
                </Link>
              </div>
              <CardTitle className="text-2xl font-bold mt-4">{translate('innoCardInquiry', language)}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {translate('formName', language)}
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={translate('formNamePlaceholder', language)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {translate('formBirthdate', language)}
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={translate('formBirthdatePlaceholder', language)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {translate('formPhone', language)}
                  </label>
                  <input
                    type="tel"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={translate('formPhonePlaceholder', language)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {translate('formInquiry', language)}
                  </label>
                  <textarea
                    className="w-full p-2 border border-gray-300 rounded-md h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={translate('formInquiryPlaceholder', language)}
                  />
                </div>
                <div className="flex justify-end">
                  <Button type="submit" className="bg-black text-white px-6">
                    {translate('formSubmit', language)}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="text-center space-y-4 mt-8 relative">
            <svg className="absolute top-0 left-0 w-16 h-16 text-gray-400 transform -translate-x-1/4 -translate-y-1/4 z-0" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
            </svg>
            <div className="relative z-10 text-2xl font-bold mb-4">
              {translate('greetingTitle', language).split('\n').map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
            <p className="text-lg relative z-10">
              {translate('greetingDescription', language).split('\n').map((line, i) => (
                <span key={i}>{line}<br /></span>
              ))}
            </p>
            <svg className="absolute top-0 right-0 w-16 h-16 text-gray-400 transform translate-x-1/4 -translate-y-1/4 rotate-180 z-0" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
            </svg>
          </div>
        </div>
      </main>
    </div>
  )
} 