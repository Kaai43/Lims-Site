import { z } from 'zod';

/**
 * Configuração lida exclusivamente de variáveis de ambiente e validada na
 * inicialização. Valor inválido derruba o processo cedo (fail fast) em vez de
 * subir o servidor num estado inseguro.
 */
const esquemaConfig = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  HOST: z.string().min(1).default('0.0.0.0'),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  DATABASE_URL: z.string().startsWith('file:').default('file:./prisma/dev.db'),
  RATE_LIMIT_MAX: z.coerce.number().int().min(1).default(100),
  RATE_LIMIT_JANELA: z.string().min(1).default('1 minute'),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']).default('info'),
});

export type Config = z.infer<typeof esquemaConfig>;

export function carregarConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const resultado = esquemaConfig.safeParse(env);
  if (!resultado.success) {
    const campos = resultado.error.issues.map((i) => i.path.join('.')).join(', ');
    throw new Error(`Configuração inválida nas variáveis: ${campos}`);
  }
  return resultado.data;
}
