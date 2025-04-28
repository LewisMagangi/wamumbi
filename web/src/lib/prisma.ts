import { PrismaClient } from '../generated/prisma'
import { Pool } from '@neondatabase/serverless'
import { PrismaNeon } from '@prisma/adapter-neon'

// Extend the globalThis interface to include our prisma client
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

// Create a singleton Prisma client instance
export function createPrismaClient() {
  // In production, use the Neon adapter for optimal serverless performance
  if (process.env.NODE_ENV === 'production') {
    const connectionString = process.env.DATABASE_URL!
    
    // Create a Neon pool
    const pool = new Pool({ connectionString })
    
    // We need to type cast because of version incompatibilities
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const adapter = new PrismaNeon(pool as any)
    
    return new PrismaClient({ 
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      adapter: adapter as any 
    })
  } 
  
  // In development, use a standard connection for better developer experience
  return new PrismaClient()
}

// Use a global variable to maintain a single instance during development
// This prevents multiple connections during hot reloads
const prisma = global.prisma || createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma
}

export { prisma }