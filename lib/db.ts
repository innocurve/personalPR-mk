import prisma from '@/lib/prisma';

export async function getProjects() {
  return await prisma.project.findMany({
    orderBy: { createdAt: 'desc' }
  })
}

export async function getExperiences() {
  return await prisma.experience.findMany({
    orderBy: { createdAt: 'desc' }
  })
}

