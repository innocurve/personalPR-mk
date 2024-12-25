import React from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"

interface ReservationFormProps {
  onSubmit: (data: { name: string; email: string; date: string; message: string }) => void;
  onCancel: () => void;
}

export function ReservationForm({ onSubmit, onCancel }: ReservationFormProps) {
  const [name, setName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [date, setDate] = React.useState('')
  const [message, setMessage] = React.useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ name, email, date, message })
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>예약하기</CardTitle>
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
          <div className="flex justify-between">
            <Button type="submit">예약하기</Button>
            <Button type="button" variant="outline" onClick={onCancel}>취소</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

