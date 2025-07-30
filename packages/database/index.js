import { PrismaClient } from '@prisma/client';
const globalForDb = globalThis;
export const db = globalForDb.db ??
    new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['info', 'warn', 'error']
    });
if (process.env.NODE_ENV !== 'production') {
    globalForDb.db = db;
}
