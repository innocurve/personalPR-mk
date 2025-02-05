import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/utils/supabase';

type RouteParams = {
  params: {
    id: string;
  };
};

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { data: gallery, error } = await supabase
      .from('gallery')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error) throw error;
    if (!gallery) {
      return NextResponse.json(
        { error: '갤러리를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return NextResponse.json(gallery);
  } catch (error) {
    console.error('Error fetching gallery:', error);
    return NextResponse.json(
      { error: '갤러리를 불러오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 