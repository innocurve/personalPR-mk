'use client'

import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import Image from 'next/image'
import { PostData } from '../types/post'
import { Language } from '../utils/translations'

// Swiper 스타일을 컴포넌트가 마운트된 후에 import
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

interface ProjectSliderProps {
  posts: PostData[];
  language: Language;
  handlePostClick: (postId: number) => void;
  translate: (key: string, lang: Language) => string;
}

export default function ProjectSlider({ posts, language, handlePostClick, translate }: ProjectSliderProps) {
  const [isReady, setIsReady] = useState(false);
  const [swiperKey, setSwiperKey] = useState(0); // Swiper 강제 리렌더링을 위한 key

  useEffect(() => {
    setIsReady(true);
    // 컴포넌트 마운트 후 약간의 지연을 두고 Swiper 초기화
    const timer = setTimeout(() => {
      setSwiperKey(prev => prev + 1);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (!isReady) return null;

  return (
    <div className="relative w-full">
      <Swiper
        key={swiperKey}
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
        onInit={() => console.log('Swiper initialized')}  // 디버깅용
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
    </div>
  );
} 