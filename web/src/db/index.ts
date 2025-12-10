// Re-export prisma from the main lib/prisma.ts which handles proper initialization
// with the Neon adapter for Prisma v7
export { prisma as db } from '@/lib/prisma'
