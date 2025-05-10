import { PrismaClient } from '@prisma/client';
import { registerTriggers } from './db/triggers';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const db = globalThis.prisma || new PrismaClient();

// Register all database triggers
registerTriggers(db);

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = db;
} 