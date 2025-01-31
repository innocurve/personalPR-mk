import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import pdf from 'pdf-parse';

// Route Segment Config
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// HTTP Methods
export async function POST(request: NextRequest) {
  try {
    console.log('[API] Upload endpoint called');

    // 디렉토리 존재 여부 확인 및 생성
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    try {
      await writeFile(join(uploadDir, '.keep'), '');
    } catch (error) {
      console.log('[API] Creating uploads directory');
    }

    const formData = await request.formData();
    console.log('[API] FormData received');
    
    const file = formData.get('file') as File;
    if (!file) {
      console.log('[API] No file provided');
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    console.log('[API] File received:', { name: file.name, size: file.size, type: file.type });

    if (file.size > 10 * 1024 * 1024) {
      console.log('[API] File too large');
      return NextResponse.json(
        { error: 'File size exceeds 10MB limit' },
        { status: 413 }
      );
    }

    if (file.type !== 'application/pdf') {
      console.log('[API] Invalid file type');
      return NextResponse.json(
        { error: 'Only PDF files are supported' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    console.log('[API] File converted to buffer');

    const data = await pdf(buffer);
    const text = data.text;
    console.log('[API] Text extracted from PDF, length:', text.length);

    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const filename = `${uniqueSuffix}-${file.name}`;
    const filepath = join(uploadDir, filename);

    await writeFile(filepath, buffer);
    console.log('[API] File saved:', filepath);

    return NextResponse.json({
      success: true,
      text,
      filename: file.name,
      fileUrl: `/uploads/${filename}`
    });
  } catch (error) {
    console.error('[API] Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to process file' },
      { status: 500 }
    );
  }
} 