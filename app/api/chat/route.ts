import { OpenAI } from 'openai';  // OpenAI 클래스를 임포트
import prisma from '@/lib/prisma';

// OpenAI 인스턴스 생성
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,  // API 키를 전달
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Prisma client를 사용하여 데이터 가져오기
    const projects = await prisma.project.findMany();
    const experiences = await prisma.experience.findMany( );

    const projectInfo = projects
      .map(
        (p) =>
          `- ${p.title}: ${p.description} (기술 스택: ${p.techStack.join(', ')})`
      )
      .join('\n');
    const experienceInfo = experiences
      .map(
        (e) =>
          `- ${e.company}의 ${e.position} (${e.period})\n  ${e.description}`
      )
      .join('\n');

    const systemPrompt = `당신은 웹 개발자 이재권의 AI 어시스턴트입니다.

프로젝트 경험:
${projectInfo}

경력 사항:
${experienceInfo}

위 정보를 바탕으로 질문에 답변해주세요.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
    });

    const stream = response.choices[0].message.content;
    return new Response(stream);
  } catch (error) {
    console.error('Error in chat route:', error);
    return new Response('An error occurred', { status: 500 });
  }
}
