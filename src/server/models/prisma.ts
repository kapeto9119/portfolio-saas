import { PrismaClient } from '@prisma/client'

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
// Learn more: https://pris.ly/d/help/next-js-best-practices

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined
}

// Custom logger for Prisma queries in development
const prismaLogger = () => {
  if (process.env.NODE_ENV === 'development') {
    return {
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'event', level: 'error' },
        { emit: 'event', level: 'warn' },
      ],
    }
  }
  return {
    log: ['error'],
  }
}

// Initialize PrismaClient
export const prisma = 
  globalForPrisma.prisma ?? 
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

// Add prisma to the globalThis object in non-production environments
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// Utility function to safely execute database operations
export async function executeDbOperation<T>(
  operation: () => Promise<T>,
  errorMsg = 'Database operation failed'
): Promise<T> {
  try {
    return await operation()
  } catch (error) {
    console.error(errorMsg, error)
    throw new Error(errorMsg)
  }
}