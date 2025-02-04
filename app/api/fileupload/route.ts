import { NextRequest } from 'next/server';
import pdf from 'pdf-parse';
import prisma from '@/lib/prisma';
import { bucket } from '@/lib/firebase-admin';
import { splitIntoChunks, extractKeywords } from '@/lib/pdfUtils';

// Route Segment Config
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// HTTP Methods
export async function POST(req: Request) {
  try {
    console.log('[API] Upload endpoint called');

    const formData = await req.formData();
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

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    console.log('[API] File converted to buffer');

    // Firebase Storage에 업로드
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const filename = `${uniqueSuffix}-${file.name}`;
    const fileRef = bucket.file(`pdfs/${filename}`);
    
    await fileRef.save(buffer, {
      metadata: {
        contentType: file.type,
      },
    });

    // 파일의 공개 URL 생성
    const [url] = await fileRef.getSignedUrl({
      action: 'read',
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7일 동안 유효
    });

    console.log('[API] File uploaded to Firebase Storage:', url);

    // PDF 텍스트 추출
    const data = await pdf(buffer);
    const text = data.text;
    console.log('[API] Text extracted from PDF, length:', text.length);

    // 텍스트를 청크로 나누기
    const chunks = splitIntoChunks(text);
    console.log(`[API] Split into ${chunks.length} chunks`);

    // 각 청크를 DB에 저장
    const savedChunks = await Promise.all(
      chunks.map(async (chunk) => {
        const keywords = extractKeywords(chunk);
        return prisma.pdfChunk.create({
          data: {
            content: chunk,
            keywords,
            fileName: file.name,
          }
        });
      })
    );
    console.log(`[API] Saved ${savedChunks.length} chunks to database`);

    // 첫 번째 청크만 미리보기로 반환
    return new Response(JSON.stringify({
      success: true,
      text: chunks[0] + (chunks.length > 1 ? '...' : ''),
      filename: file.name,
      fileUrl: url,
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