'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"

export function ReservationForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [date, setDate] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    try {
      const response = await fetch('/api/reservation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, date, message }),
      })

      if (response.ok) {
        setStatus('success')
        setName('')
        setEmail('')
        setDate('')
        setMessage('')
      } else {
        setStatus('error')
      }
    } catch (error) {
      console.error('Reservation error:', error)
      setStatus('error')
    }
  }

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>예약하기</CardTitle>
        <CardDescription>상담 예약을 위해 아래 양식을 작성해주세요.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name">이름</label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="email">이메일</label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="date">날짜</label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="message">메시지</label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={status === 'loading'}>
            {status === 'loading' ? '예약 중...' : '예약하기'}
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        {status === 'success' && <p className="text-green-500">예약이 완료되었습니다!</p>}
        {status === 'error' && <p className="text-red-500">예약 중 오류가 발생했습니다. 다시 시도해주세요.</p>}
      </CardFooter>
    </Card>
  )
}

