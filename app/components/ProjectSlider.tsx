'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import Image from 'next/image'
import { PostData } from '../types/post'

interface ProjectSliderProps {
  posts: PostData[];
  language: string;
  handlePostClick: (postId: number) => void;
  translate: (key: string, lang: string) => string;
}

export default function ProjectSlider({ posts, language, handlePostClick, translate }: ProjectSliderProps) {
  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      spaceBetween={30}
      slidesPerView={1}
      navigation
      pagination={{ clickable: true }}
      loop={true}
      autoplay={{
        delay: 3000,
        disableOnInteraction: false,
      }}
      breakpoints={{
        640: {
          slidesPerView: 2,
        },
        1024: {
          slidesPerView: 3,
        },
      }}
      className="mySwiper"
    >
      {posts.map((post: PostData) => (
        <SwiperSlide key={post.id}>
          <div
            onClick={() => handlePostClick(post.id)}
            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-transform duration-300 hover:scale-105"
          >
            <div className="relative h-48">
              <Image
                src={post.image}
                alt={post.title[language]}
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{post.title[language]}</h3>
              <p className="text-gray-600 mb-2">{post.description[language]}</p>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>{post.date}</span>
                <span>{translate('views', language)}: {post.hit || 0}</span>
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  )
} 