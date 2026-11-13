import type { FastifyInstance } from 'fastify';
import { criarPrisma, type Db } from '../db.js';

declare module 'fastify' {
  interface FastifyInstance {
    db: Db;
  }
}

export async function configurarPrisma(app: FastifyInstance, url: string, dbInjetado?: Db): Promise<void> {
  const db = dbInjetado ?? criarPrisma(url);
  app.decorate('db', db);
  if (!dbInjetado) {
    app.addHook('onClose', async () => {
      await db.$disconnect();
    });
  }
}
