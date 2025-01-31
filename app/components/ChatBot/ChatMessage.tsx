'use client'

import { Message } from './ChatInput'

interface ChatMessageProps {
  message: Message
  isDarkMode?: boolean
}

export default function ChatMessage({ message, isDarkMode }: ChatMessageProps) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] rounded-lg px-4 py-2 ${
          isUser
            ? 'bg-blue-500 text-white'
            : isDarkMode
            ? 'bg-gray-700 text-white'
            : 'bg-gray-100 text-gray-900'
        }`}
      >
        <p className="whitespace-pre-wrap break-words">{message.content}</p>
      </div>
    </div>
  )
}

