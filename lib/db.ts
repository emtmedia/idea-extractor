import { PrismaClient, Prisma } from '@/app/generated/prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set');
  }
  const adapter = new PrismaNeon({ connectionString });
  const options: Prisma.PrismaClientOptions = { adapter };
  return new PrismaClient(options);
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
