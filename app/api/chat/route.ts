import { OpenAI } from 'openai';  // OpenAI 클래스를 임포트
import prisma from '@/lib/prisma';
import { PdfChunk } from '@prisma/client';

interface ScoredChunk {
  content: string;
  score: number;
}

// OpenAI 인스턴스 생성
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,  // API 키를 전달
});

// 키워드 기반 검색 함수
async function searchRelevantChunks(question: string): Promise<string> {
  // 질문에서 키워드 추출 (불용어 제거)
  const stopWords = new Set(['이', '그', '저', '것', '수', '등', '및', '를', '이다', '입니다', '했다', '했습니다']);
  const keywords = question
    .split(/[\s,.]+/)
    .filter(word => word.length > 1 && !stopWords.has(word));

  if (keywords.length === 0) return '';
  
  // 키워드가 포함된 청크 검색
  const chunks = await prisma.pdfChunk.findMany({
    where: {
      OR: keywords.map(word => ({
        OR: [
          { content: { contains: word } },
          { keywords: { has: word } }
        ]
      }))
    }
  });

  // 관련성 점수 계산
  const scoredChunks: ScoredChunk[] = chunks.map((chunk: PdfChunk) => {
    let score = 0;
    const lowerContent = chunk.content.toLowerCase();
    
    // 키워드 매칭 점수
    keywords.forEach(keyword => {
      const keywordLower = keyword.toLowerCase();
      // 내용에 키워드가 있으면 점수 추가
      if (lowerContent.includes(keywordLower)) {
        score += 2;
      }
      // 저장된 키워드에 있으면 추가 점수
      if (chunk.keywords.some((k: string) => k.toLowerCase() === keywordLower)) {
        score += 1;
      }
    });

    return {
      content: chunk.content,
      score
    };
  });

  // 점수순 정렬 후 상위 2개만 선택
  const topChunks = scoredChunks
    .sort((a: ScoredChunk, b: ScoredChunk) => b.score - a.score)
    .slice(0, 2);

  return topChunks.map((chunk: ScoredChunk) => chunk.content).join('\n\n');
}





export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body?.messages) {
      return new Response(JSON.stringify({ error: 'No messages field' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { messages } = body;
    const lastUserMessage = messages.findLast((msg: any) => msg.role === 'user')?.content || '';
    const relevantPdfContent = await searchRelevantChunks(lastUserMessage);

       // Prisma에서 기본 정보 가져오기
       const [projects, experiences, owner] = await Promise.all([
        prisma.project.findMany(),
        prisma.experience.findMany(),
        prisma.owner.findFirst()
      ]);

      const projectInfo = projects
  .map(p => `- ${p.title}: ${p.description} (기술 스택: ${p.techStack.join(', ')})`)
  .join('\n');

const experienceInfo = experiences
  .map(e => `- ${e.company}의 ${e.position} (${e.period})\n  ${e.description}`)
  .join('\n');

const ownerInfo = owner
  ? `이름: ${owner.name}\n나이: ${owner.age}\n취미: ${owner.hobbies.join(', ')}\n가치관: ${owner.values}`
  : '';
    // 기본 시스템 프롬프트 (짧게 유지)
    let systemPrompt = `당신은 정민기입니다. 아래 정보를 바탕으로 1인칭으로 자연스럽게 대화하세요.

    기본 정보:
    ${ownerInfo}
    
    경력:
    ${experienceInfo}
    
    프로젝트:
    ${projectInfo}`;

    // PDF 내용이 있고 관련이 있는 경우에만 추가
    if (relevantPdfContent && lastUserMessage.length > 0) {
      systemPrompt += `\n\n관련 문서 내용:\n${relevantPdfContent}\n이 내용을 참고하여 답변해주세요.`;
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
    });

    return new Response(JSON.stringify({ 
      response: response.choices[0].message.content 
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in chat route:', error);
    return new Response(JSON.stringify({ error: 'An error occurred' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

