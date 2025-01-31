'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from 'lucide-react'
import { translate } from '../utils/translations'
import { useLanguage } from '../hooks/useLanguage'
import Navigation from '../components/Navigation'
import Link from 'next/link'

export default function GreetingVideo() {
  const { language } = useLanguage()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const videoSources = {
    ko: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/KakaoTalk_20241215_192017967-fPJmLLPpokC9OE7iczdUQlgGvgImk3.mp4",
    en: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Untitled%20Video%20(10)-3TdUn7xqPnnpeeVyofZDDUKiIoig5x.mp4",
    ja: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/KakaoTalk_20241215_192019850-uUa3gchO094I9intvck6PuN9mrwKti.mp4",
    zh: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Untitled%20Video%20(13)-47V2mk3OlCFd5iuV7NdVvhnrVWCSuF.mp4"
  }

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  useEffect(() => {
    const video = videoRef.current
    if (video) {
      const handleEnded = () => setIsPlaying(false)
      video.addEventListener('ended', handleEnded)
      return () => video.removeEventListener('ended', handleEnded)
    }
  }, [])

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
              <CardTitle className="text-2xl font-bold mt-4">{translate('greetingVideo', language)}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="w-full max-w-lg aspect-w-16 aspect-h-9 mb-6">
                <div className="relative w-full h-full">
                  <video 
                    ref={videoRef}
                    src={videoSources[language] || videoSources['en']}
                    className="w-full h-full object-cover rounded-lg"
                    playsInline
                  >
                    Your browser does not support the video tag.
                  </video>
                  <button 
                    onClick={togglePlay}
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 transition-opacity duration-300 hover:bg-opacity-50 rounded-lg"
                    aria-label={isPlaying ? 'Pause video' : 'Play video'}
                  >
                    {isPlaying ? (
                      <svg className="w-16 h-16 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="6" y="4" width="4" height="16" />
                        <rect x="14" y="4" width="4" height="16" />
                      </svg>
                    ) : (
                      <svg className="w-16 h-16 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
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