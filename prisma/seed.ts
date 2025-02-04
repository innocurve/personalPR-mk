import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient()

async function main() {
  // Add your seeding logic here
  const project = await prisma.project.create({
    data: {
      title: '개인 PR 사이트',
      description: 'Next.js와 OpenAI를 활용한 개인 PR 사이트 개발',
      techStack: ['Next.js', 'React', 'TypeScript', 'OpenAI', 'Prisma'],
    },
  })

  const experience = await prisma.experience.create({
    data: {
      company: '테크 스타트업',
      position: '시니어 웹 개발자',
      period: '2021-현재',
      description: '풀스택 개발 및 팀 리딩',
    },
  })
    // Owner 데이터 추가
    const owner = await prisma.owner.create({
      data: {
        name: '이재권',
        age: 30,
        hobbies: ['코딩', '독서', '여행'],
        values: '지속적인 학습과 혁신을 통한 가치 창출',
      
      },
    })
    

  console.log({ project, experience, owner})
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

