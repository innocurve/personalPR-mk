
import Image from 'next/image'
import ChatBot from './components/ChatBot'
import { ProjectList } from './components/ProjectList'


export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 프로필 섹션 */}
          <div className="space-y-6">
            <div className="text-center md:text-left">
              <Image
                src="/placeholder.svg"
                alt="프로필 이미지"
                width={200}
                height={200}
                className="rounded-full mx-auto md:mx-0"
              />
              <h1 className="text-3xl font-bold mt-4">이재권</h1>
              <p className="text-gray-600">풀스택 웹 개발자</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">자기소개</h2>
              <p className="text-gray-700">
                안녕하세요! 저는 1년차 웹 개발자 이재권입니다. 
                React, Node.js, TypeScript를 주로 사용하며, 
                사용자 경험을 중시하는 웹 애플리케이션 개발에 관심이 많습니다.
              </p>
            </div>

            <ProjectList />
          </div>

          {/* 챗봇 섹션 */}
          <div className="h-[800px]">
            <ChatBot />
          </div>
        </div>
      </div>
    </div>
  )
}

