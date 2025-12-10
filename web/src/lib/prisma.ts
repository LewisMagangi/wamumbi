import { PrismaClient } from '../generated/prisma'

// Extend the globalThis interface to include our prisma client
declare global {
   
  var __prisma: PrismaClient | undefined
   
  var __prismaInitialized: boolean | undefined
}

// Create a singleton Prisma client instance - deferred until first use
async function createPrismaClient(): Promise<PrismaClient> {
  const connectionString = process.env.DATABASE_URL

  if (!connectionString) {
    throw new Error(
      'DATABASE_URL environment variable is not set. ' +
      'Please set it in your .env.local file.'
    )
  }

  // Dynamically import to avoid build-time evaluation
  const { neonConfig } = await import('@neondatabase/serverless')
  const { PrismaNeon } = await import('@prisma/adapter-neon')
  
  // Configure Neon for edge environments  
  neonConfig.webSocketConstructor = WebSocket

  // Create the Neon adapter factory with connection config
  const adapter = new PrismaNeon({ connectionString })

  return new PrismaClient({ adapter })
}

// Synchronous getter that returns a proxy with async initialization
function getPrismaProxy(): PrismaClient {
  // Return a proxy that handles async initialization
  return new Proxy({} as PrismaClient, {
    get(_target, prop: string | symbol) {
      if (prop === 'then' || prop === 'catch' || prop === 'finally') {
        return undefined
      }
      
      // For model access (user, campaign, etc.), return an async handler
      return new Proxy({}, {
        get(_modelTarget, methodProp: string | symbol) {
          return async (...args: unknown[]) => {
            if (!global.__prisma) {
              global.__prisma = await createPrismaClient()
            }
            const client = global.__prisma as unknown as Record<string, Record<string, (...args: unknown[]) => unknown>>
            return client[prop as string][methodProp as string](...args)
          }
        }
      })
    }
  })
}

// Export the proxy
export const prisma = getPrismaProxy()