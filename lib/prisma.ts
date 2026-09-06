import type { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

export const prisma = globalForPrisma.prisma

export function getPrismaClient() {
  if (!prisma) {
    throw new Error('Prisma client is not generated or DATABASE_URL is not configured.')
  }
  return prisma
}
