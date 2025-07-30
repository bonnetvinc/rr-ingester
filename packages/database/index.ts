import { PrismaClient } from '@prisma/client';
export type { RawPassing, Prisma } from '@prisma/client';

const globalForDb = globalThis as unknown as {
  db?: PrismaClient;
};

export const db =
  globalForDb.db ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['info', 'warn', 'error']
  });

if (process.env.NODE_ENV !== 'production') {
  globalForDb.db = db;
}
