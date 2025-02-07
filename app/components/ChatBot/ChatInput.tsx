'use client'

import { useState, FormEvent } from 'react'
import { Send } from 'lucide-react'

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: number;
}

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isDarkMode?: boolean;
  placeholder?: string;
}

export default function ChatInput({ onSendMessage, isDarkMode, placeholder = '메시지를 입력하세요...' }: ChatInputProps) {
  const [message, setMessage] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (message.trim()) {
      onSendMessage(message)
      setMessage('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={placeholder}
        className={`flex-1 p-3 rounded-lg border ${
          isDarkMode 
            ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
      />
      <button
        type="submit"
        className={`p-3 rounded-lg ${
          isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
        } text-white transition-colors duration-200`}
      >
        <Send className="w-5 h-5" />
      </button>
    </form>
  )
}

