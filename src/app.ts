import Fastify, { type FastifyInstance } from 'fastify';
import { carregarConfig, type Config } from './config.js';
import { configurarSeguranca } from './plugins/seguranca.js';
import { configurarPrisma } from './plugins/prisma.js';
import { configurarEstaticos } from './plugins/estaticos.js';
import type { Db } from './db.js';

export interface OpcoesApp {
  config?: Partial<Config>;
  db?: Db;
  registrarRotas?: boolean;
  extra?: (app: FastifyInstance) => void | Promise<void>;
}

export async function buildApp(opcoes: OpcoesApp = {}): Promise<FastifyInstance> {
  const configBase = carregarConfig();
  const config: Config = { ...configBase, ...opcoes.config };

  const app = Fastify({
    trustProxy: true,
    bodyLimit: 16_384, // 16 KB max payload (anti-DoS)
    routerOptions: { maxParamLength: 100 },
    logger: {
      level: config.LOG_LEVEL,
      redact: {
        paths: ['req.headers.cookie', 'req.headers.authorization', 'res.headers["set-cookie"]'],
        censor: '[REDACTED]',
      },
    },
  });

  await configurarSeguranca(app, config);
  await configurarPrisma(app, config.DATABASE_URL, opcoes.db);
  await configurarEstaticos(app, config.NODE_ENV === 'production');

  // Healthcheck
  app.get('/saude', async () => ({ status: 'ok' }));

  if (opcoes.registrarRotas !== false) {
    const { registrarTodasRotas } = await import('./routes/index.js');
    await registrarTodasRotas(app);
  }

  if (opcoes.extra) {
    await opcoes.extra(app);
  }

  return app;
}
