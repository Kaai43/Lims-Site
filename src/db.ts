import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from './generated/prisma/client.js';

export type Db = PrismaClient;

/** Cria o client do Prisma 7 com o driver adapter SQLite. Um por processo. */
export function criarPrisma(url: string): Db {
  return new PrismaClient({ adapter: new PrismaBetterSqlite3({ url }) });
}
