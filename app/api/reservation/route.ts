import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

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

    return NextResponse.json({ success: true, reservation });
  } catch (error) {
    console.error('Reservation error:', error);
    return NextResponse.json({ success: false, error: 'Reservation failed' }, { status: 500 });
  }
}

