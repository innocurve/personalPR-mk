'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { translate } from '../../utils/translations'
import { useLanguage } from '@/app/hooks/useLanguage'
import type { PostData } from '@/app/types/post'

export default function PostDetail() {
  const params = useParams()
  const router = useRouter()
  const { language } = useLanguage()
  const [post, setPost] = useState<PostData | null>(null)

  useEffect(() => {
    const fetchPost = () => {
      const posts = JSON.parse(localStorage.getItem('posts') || '[]')
      const foundPost = posts.find((p: PostData) => p.id === Number(params.id))
      if (foundPost) {
        // hit가 undefined일 경우 0으로 초기화
        setPost({
          ...foundPost,
          hit: foundPost.hit || 0
        })
        incrementViewCount({
          ...foundPost,
          hit: foundPost.hit || 0
        })
      }
    }

    fetchPost()
  }, [params.id])

  const incrementViewCount = (post: PostData) => {
    try {
      const now = new Date().getTime()
      const viewHistory = JSON.parse(localStorage.getItem('postViewHistory') || '{}')
      const lastViewTime = viewHistory[post.id] || 0
      
      // 24시간(86400000 밀리초)이 지났는지 확인
      if (now - lastViewTime > 86400000) {
        console.log('Incrementing view count for post:', post.id)
        
        // 조회수 증가 (hit가 undefined일 경우 0으로 처리)
        const updatedPost = { 
          ...post, 
          hit: (post.hit || 0) + 1 
        }
        
        // localStorage의 posts 업데이트
        const posts = JSON.parse(localStorage.getItem('posts') || '[]')
        const updatedPosts = posts.map((p: PostData) => 
          p.id === post.id ? updatedPost : p
        )
        
        // localStorage 업데이트
        localStorage.setItem('posts', JSON.stringify(updatedPosts))
        localStorage.setItem('postViewHistory', JSON.stringify({
          ...viewHistory,
          [post.id]: now
        }))
        
        // 상태 업데이트
        setPost(updatedPost)
        console.log('View count updated successfully')
      } else {
        console.log('View count not incremented - within 24h period')
      }
    } catch (error) {
      console.error('Error updating view count:', error)
    }
  }

  if (!post) {
    return <div>Loading...</div>
  }

  return (
    <div className="max-w-3xl mx-auto p-5 mt-24">
      <Card>
        <CardHeader>
          <CardTitle>{post.title[language]}</CardTitle>
        </CardHeader>
        <CardContent>
          <Image 
            src={post.image} 
            alt={post.title[language]} 
            width={600} 
            height={400} 
            className="w-full h-64 object-cover mb-4 rounded-lg"
          />
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">{post.date}</p>
            <p className="text-transparent bg-clip-text bg-gradient-to-r from-gray-600 to-gray-600 hover:from-blue-600 hover:to-cyan-500 transition-all duration-300">
              {translate('views', language)}: {post.hit || 0}
            </p>
          </div>
          <p className="font-bold mb-2">{translate('summary', language)}</p>
          <p className="mb-4">{post.description[language]}</p>
          
          {post.gallery && (
            <div>
              <h3 className="text-xl font-bold mb-4">{translate('gallery', language)}</h3>
              <div className="grid grid-cols-2 gap-4">
                {post.gallery.map((item) => (
                  <div 
                    key={item.id} 
                    className="cursor-pointer relative group"
                    onClick={() => router.push(`/gallery/${item.id}`)}
                  >
                    <Image 
                      src={item.image} 
                      alt={item.title[language]}
                      width={300}
                      height={200}
                      className="w-full h-40 object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-300 rounded-lg" />
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black to-transparent">
                      <h4 className="text-white text-sm font-semibold truncate">
                        {item.title[language]}
                      </h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="mt-8">
            <Button onClick={() => router.push('/#community')}>{translate('backToList', language)}</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

