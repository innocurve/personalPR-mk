import { NextResponse } from 'next/server';
import  prisma  from '@/lib/prisma';
import axios from 'axios';

export async function POST(req: Request) {
  try {
    const { reservationId } = await req.json();

    // Fetch the reservation data
    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
    });

    if (!reservation) {
      return NextResponse.json({ error: 'Reservation not found' }, { status: 404 });
    }

    // Prepare the message content
    const messageContent = `새로운 예약이 생성되었습니다.
    이름: ${reservation.name}
    이메일: ${reservation.email}
    날짜: ${reservation.date.toLocaleString('ko-KR')}
    메시지: ${reservation.message || '없음'}`;

    // Send KakaoTalk message
    const response = await axios.post(
      'https://kapi.kakao.com/v2/api/talk/memo/default/send',
      {
        template_object: {
          object_type: 'text',
          text: messageContent,
          link: {
            web_url: 'https://developers.kakao.com',
            mobile_web_url: 'https://developers.kakao.com'
          },
          button_title: '예약 확인하기'
        }
      },
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `KakaoAK ${process.env.KAKAO_REST_API_KEY}`
        }
      }
    );

    return NextResponse.json({ success: true, kakaoResponse: response.data });
  } catch (error) {
    console.error('Error sending KakaoTalk message:', error);
    return NextResponse.json({ error: 'Failed to send KakaoTalk message' }, { status: 500 });
  }
}

