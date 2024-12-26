import { NextResponse } from 'next/server';
import  prisma  from '@/lib/prisma';
import { sendSMS } from '@/lib/sendSMS';

export async function POST(req: Request) {
  try {
    const { name, email, date, message } = await req.json();

    const reservation = await prisma.reservation.create({
      data: {
        name,
        email,
        date: new Date(date),
        message,
      },
    });

    // PR 사이트 주인의 전화번호
    const ownerPhone = process.env.OWNER_PHONE_NUMBER;
    
    if (!ownerPhone) {
      throw new Error('OWNER_PHONE_NUMBER is not set in environment variables');
    }
    
    // SMS 내용 구성
    const smsContent = `[예약 알림] 새로운 예약이 있습니다.
이름: ${name}
이메일: ${email}
날짜: ${new Date(date).toLocaleString('ko-KR')}
메시지: ${message}`;
    
    // SMS 발송
    await sendSMS(ownerPhone, smsContent);

    return NextResponse.json({ success: true, reservation });
  } catch (error: unknown) {
    console.error('Reservation error:', error);
    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: false, error: 'An unknown error occurred' }, { status: 500 });
  }
}

