'use client'

import { useState } from 'react'
import { useChat } from 'ai/react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'

export default function ChatBot() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat()

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>AI 챗봇 어시스턴트</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[600px] p-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`mb-4 flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`rounded-lg px-4 py-2 max-w-[80%] ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
      <CardFooter className="border-t p-4">
        <form onSubmit={handleSubmit} className="flex w-full gap-2">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="메시지를 입력하세요..."
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading}>
            전송
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}

