import { defineConfig } from 'prisma/config';

// Prisma 7 não carrega .env sozinho. Em dev: `node --env-file=.env` ou variável no shell.
export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    url: process.env.DATABASE_URL ?? 'file:./prisma/dev.db',
  },
});
