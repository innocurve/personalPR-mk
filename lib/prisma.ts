import { PrismaClient } from '.prisma/client';

// 전역 변수를 사용하여 Prisma Client 관리
const globalForPrisma = global as unknown as { prisma: PrismaClient | undefined };

// Prisma Client 인스턴스를 전역에서 관리
const prisma = globalForPrisma.prisma ?? new PrismaClient();

// 개발 환경에서만 Prisma 인스턴스를 전역 변수로 설정
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
