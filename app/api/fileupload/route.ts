import { NextRequest } from 'next/server';
import { PDFExtract } from 'pdf.js-extract';
import { supabase } from '@/app/utils/supabase';
import { bucket } from '@/lib/firebase-admin';
import { splitIntoChunks, extractKeywords } from '@/lib/pdfUtils';

const pdfExtract = new PDFExtract();

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
    const data = await pdfExtract.extractBuffer(buffer, {});
    const text = data.pages.map(page => page.content.map(item => item.str).join(' ')).join('\n');
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
          keywords: keywords || [],
          file_name: fileName,
          metadata: {
            title: file.name,
            pages: data.pages.length,
            info: {}
          }
        });

      if (error) {
        console.error('[API] Supabase insert error:', error);
        throw error;
      }
    }

    console.log(`[API] Saved ${chunks.length} chunks to Supabase`);

    return new Response(JSON.stringify({
      success: true,
      text: chunks[0] + (chunks.length > 1 ? '...' : ''),
      filename: file.name,
      totalChunks: chunks.length
    }));
  } catch (error) {
    console.error('[API] Upload error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to process file',
        details: error instanceof Error ? error.message : String(error)
      }),
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}; 