import { NextRequest } from 'next/server';
import pdf from 'pdf-parse';
import { supabase } from '@/app/utils/supabase';
import { bucket } from '@/lib/firebase-admin';
import { splitIntoChunks, extractKeywords } from '@/lib/pdfUtils';

// Route Segment Config
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// HTTP Methods
export async function POST(request: NextRequest) {
  try {
    console.log('[API] Upload endpoint called');

    const formData = await request.formData();
    console.log('[API] FormData received');
    
    const file = formData.get('file') as File;
    if (!file) {
      console.log('[API] No file provided');
      return new Response(
        JSON.stringify({ error: 'No file provided' }),
        { status: 400 }
      );
    }

    console.log('[API] File received:', { name: file.name, size: file.size, type: file.type });

    if (file.size > 10 * 1024 * 1024) {
      console.log('[API] File too large');
      return new Response(
        JSON.stringify({ error: 'File size exceeds 10MB limit' }),
        { status: 413 }
      );
    }

    if (file.type !== 'application/pdf') {
      console.log('[API] Invalid file type');
      return new Response(
        JSON.stringify({ error: 'Only PDF files are supported' }),
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    console.log('[API] File converted to buffer');

    // PDF 파일 처리
    const data = await pdf(buffer);
    const text = data.text;
    console.log('[API] Text extracted from PDF, length:', text.length);

    // 텍스트를 청크로 나누기
    const chunks = splitIntoChunks(text);
    console.log(`[API] Split into ${chunks.length} chunks`);

    // Firebase에 파일 업로드
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const fileName = `pdfs/${Date.now()}-${file.name}`;
    await bucket.file(fileName).save(fileBuffer);

    // 청크를 Supabase에 저장
    for (const chunk of chunks) {
      const keywords = await extractKeywords(chunk);
      
      const { error } = await supabase
        .from('pdf_chunks')
        .insert({
          content: chunk,
          keywords: keywords,
          file_name: fileName,
          metadata: {
            title: file.name,
            pages: data.numpages,
            info: data.info
          }
        });

      if (error) throw error;
    }

    console.log(`[API] Saved ${chunks.length} chunks to Supabase`);

    // 첫 번째 청크만 미리보기로 반환
    return new Response(JSON.stringify({
      success: true,
      text: chunks[0] + (chunks.length > 1 ? '...' : ''),
      filename: file.name,
      totalChunks: chunks.length
    }));
  } catch (error) {
    console.error('[API] Upload error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process file' }),
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}; 