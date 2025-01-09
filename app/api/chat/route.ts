import { OpenAI } from 'openai';  // OpenAI 클래스를 임포트
import prisma from '@/lib/prisma';

// OpenAI 인스턴스 생성
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,  // API 키를 전달
});

export async function POST(req: Request) {
  try {

    // 1) JSON 파싱 시도 (파싱 실패하면 null)
    const body = await req.json().catch(() => null);
    console.log('Parsed body:', body); // <-- 여기서 무엇이 찍히는지 확인

    // 2) body나 body.messages가 없으면 400 리턴
    if (!body || !body.messages) {
      console.log('Body or messages is missing.'); 
      return new Response(JSON.stringify({ error: 'No messages field' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 3) 이후 로직...
    const { messages } = body
    console.log('Messages to OpenAI:', messages);

    // Prisma client를 사용하여 데이터 가져오기
    const projects = await prisma.project.findMany();
    const experiences = await prisma.experience.findMany( );
    const owner = await prisma.owner.findFirst()

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

      const ownerInfo = owner
      ? Object.entries(owner).map(([key, value]) => {
          if (key === 'hobbies' && Array.isArray(value)) {
            return `${key}: ${value.join(', ')}`;
          }
          if (key !== 'id' && key !== 'createdAt' && key !== 'updatedAt') {
            return `${key}: ${value}`;
          }
          return null;
        }).filter(Boolean).join('\n')
      : '소유자 정보가 없습니다.';
      
    const systemPrompt = `당신은 웹 개발자 이재권의 AI 어시스턴트입니다. 사용자의 질문에 답변하고, 예약 요청을 처리할 수 있습니다.

소유자 정보:
${ownerInfo}

프로젝트 경험:
${projectInfo}

경력 사항:
${experienceInfo}



예약 요청이 있을 경우, 반드시 "예약 폼을 표시하겠습니다."라는 문구로 응답을 시작하세요. 그 후 사용자에게 이름, 이메일, 날짜, 추가 메시지를 요청하세요.

위 정보를 바탕으로 질문에 답변해주세요.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
    });

    console.log('OpenAI response:', response)

    const content = response.choices[0].message.content

    return new Response(JSON.stringify({ content }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error in chat route:', error)
    return new Response(JSON.stringify({ error: 'An error occurred' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
