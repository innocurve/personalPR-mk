import { NextRequest } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import pdf from 'pdf-parse';
import prisma from '@/lib/prisma';

// Route Segment Config
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// 텍스트를 청크로 나누는 함수
function splitIntoChunks(text: string, maxChunkSize: number = 1000): string[] {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
  const chunks: string[] = [];
  let currentChunk = '';

  for (const sentence of sentences) {
    if ((currentChunk + sentence).length > maxChunkSize && currentChunk.length > 0) {
      chunks.push(currentChunk.trim());
      currentChunk = '';
    }
    currentChunk += sentence;
  }
  
  if (currentChunk.length > 0) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

// 키워드 추출 함수 (간단한 버전)
function extractKeywords(text: string): string[] {
  // 불용어 제거 및 빈도수 기반 키워드 추출
  const stopWords = new Set(['이', '그', '저', '것', '수', '등', '및', '를', '이다', '입니다', '했다', '했습니다']);
  const words = text.split(/[\s,.]+/).filter(word => 
    word.length > 1 && !stopWords.has(word)
  );
  
  // 빈도수 계산
  const frequency: {[key: string]: number} = {};
  words.forEach(word => {
    frequency[word] = (frequency[word] || 0) + 1;
  });
  
  // 상위 10개 키워드 반환
  return Object.entries(frequency)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([word]) => word);
}

// HTTP Methods
export async function POST(req: Request) {
  try {
    console.log('[API] Upload endpoint called');

    // 디렉토리 존재 여부 확인 및 생성
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    try {
      await writeFile(join(uploadDir, '.keep'), '');
    } catch (error) {
      console.log('[API] Creating uploads directory');
    }

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

    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const filename = `${uniqueSuffix}-${file.name}`;
    const filepath = join(uploadDir, filename);

    await writeFile(filepath, buffer);
    console.log('[API] File saved:', filepath);

    // 첫 번째 청크만 미리보기로 반환
    return new Response(JSON.stringify({
      success: true,
      text: chunks[0] + (chunks.length > 1 ? '...' : ''),
      filename: file.name,
      fileUrl: `/uploads/${filename}`,
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