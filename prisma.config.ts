import { defineConfig } from 'prisma/config';

// Prisma 7 não carrega .env sozinho. Em dev: `node --env-file=.env` ou variável no shell.
export default defineConfig({
  schema: 'banco-de-dados/schema.prisma',
  migrations: {
    path: 'banco-de-dados/migrations',
    seed: 'tsx banco-de-dados/popular.ts',
  },
  datasource: {
    url: process.env.DATABASE_URL ?? 'file:./banco-de-dados/dev.db',
  },
});
