import { OpenAI } from 'openai';
import { supabase } from '@/app/utils/supabase';
import { stopWords } from '@/lib/pdfUtils';

// OpenAI 인스턴스 생성
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// 타입 정의
interface ScoredChunk {
  content: string;
  score: number;
}

interface PdfChunk {
  content: string;
  keywords: string[];
 
}

interface Project {
  title: string;
  description: string;
  tech_stack: string[];
  owner_id: number;
}

interface Experience {
  company: string;
  position: string;
  period: string;
  description: string;
  owner_id: number;
}

interface Owner {
  name: string;
  age: number;
  hobbies: string[];
  values: string;
  country?: string;
  birth?: string;
  owner_id: number;
}

interface ChatHistory {
  role: string;
  content: string;
  owner_id: number;
  created_at?: string;
}

// 키워드 기반 PDF 청크 검색 함수
async function searchRelevantChunks(question: string): Promise<string> {
  const ownerId = process.env.NEXT_PUBLIC_OWNER_ID;
  const keywords = question
    .split(/[\s,.]+/)
    .filter(word => word.length > 1 && !stopWords.has(word));

  if (keywords.length === 0) return '';

  try {
    const { data: chunks, error } = await supabase
      .from('pdf_chunks')
      .select('*')
      .or(keywords.map(word => 
        `content.ilike.%${word}%,keywords.cs.{${word}}`
      ).join(','));

    if (error) throw error;

    // 점수 계산 로직
    const scoredChunks = (chunks || []).map((chunk: PdfChunk) => {
      let score = 0;
      const lowerContent = chunk.content.toLowerCase();
      
      keywords.forEach(keyword => {
        const keywordLower = keyword.toLowerCase();
        if (lowerContent.includes(keywordLower)) {
          score += 2;
        }
        if (chunk.keywords?.some(k => k.toLowerCase() === keywordLower)) {
          score += 1;
        }
      });

      return { content: chunk.content, score };
    });

    const topChunks = scoredChunks
      .sort((a, b) => b.score - a.score)
      .slice(0, 2);

    return topChunks.map(chunk => chunk.content).join('\n\n');
  } catch (error) {
    console.error('PDF 검색 오류:', error);
    return '';
  }
}

export async function GET(request: Request) {
  const ownerId = process.env.NEXT_PUBLIC_OWNER_ID;

  try {
    const { data, error } = await supabase
      .from('chat_history')
      .select('*')
      .eq('owner_id', ownerId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return new Response(JSON.stringify(data));
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch messages' }), { status: 500 });
  }
}

export async function POST(request: Request) {
  const { messages, pdfContent } = await request.json();
  const lastUserMessage = messages.findLast((msg: any) => msg.role === 'user')?.content || '';
  const ownerId = process.env.NEXT_PUBLIC_OWNER_ID;

  try {
    // owner_id로 필터링하여 해당 소유자의 데이터만 가져오기
    const [{ data: projects }, { data: experiences }, { data: owner }] = await Promise.all([
      supabase
        .from('projects')
        .select('*')
        .eq('owner_id', ownerId),  // owner_id로 필터링
      supabase
        .from('experiences')
        .select('*')
        .eq('owner_id', ownerId),  // owner_id로 필터링
      supabase
        .from('owners')
        .select('*')
        .eq('owner_id', ownerId)   // owner_id로 필터링
        .single()
    ]);

    // 데이터가 없는 경우 처리
    if (!owner) {
      throw new Error('Owner not found');
    }

    const projectInfo = (projects || [])
      .map((p: Project) => `- ${p.title}: ${p.description} (기술 스택: ${p.tech_stack.join(', ')})`)
      .join('\n');

    const experienceInfo = (experiences || [])
      .map((e: Experience) => `- ${e.company}의 ${e.position} (${e.period})\n  ${e.description}`)
      .join('\n');

    const ownerInfo = owner
      ? `이름: ${owner.name}\n나이: ${owner.age}\n취미: ${owner.hobbies.join(', ')}\n가치관: ${owner.values}\n나라: ${owner.country}\n생년월일: ${owner.birth}\nowner_id: ${owner.owner_id}`
      : '';

    // 관련 PDF 내용 검색
    const relevantPdfContent = await searchRelevantChunks(lastUserMessage);

    // 시스템 프롬프트 작성
    let systemPrompt = `당신은 정민기의 AI 클론입니다. 아래 정보를 바탕으로 1인칭으로 자연스럽게 대화하세요.
    현재 시각은 ${new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })} 입니다.
  
기본 정보:
${ownerInfo}

경력:
${experienceInfo}

프로젝트:
${projectInfo}`;

    if (relevantPdfContent) {
      systemPrompt += `\n\n관련 문서 내용:\n${relevantPdfContent}`;
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
    });

    // 채팅 내역 저장
    await supabase.from('chat_history').insert({
      role: 'user',
      content: lastUserMessage,
      owner_id: ownerId
    });

    return new Response(
      JSON.stringify({ response: response.choices[0].message.content }),
      { headers: { 'Content-Type': 'application/json' } },
    );
  } catch (error) {
    console.error('Error in chat route:', error);
    return new Response(JSON.stringify({ error: 'An error occurred' }), { status: 500 });
  }
}
