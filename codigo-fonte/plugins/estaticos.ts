import type { FastifyInstance } from 'fastify';
import fastifyStatic from '@fastify/static';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const RAIZ_PUBLIC = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
  'arquivos-publicos',
);

export async function configurarEstaticos(app: FastifyInstance, producao: boolean): Promise<void> {
  await app.register(fastifyStatic, {
    root: RAIZ_PUBLIC,
    prefix: '/',
    index: false,
    list: false,
    dotfiles: 'deny',
    wildcard: true,
    maxAge: producao ? '7d' : 0,
    // Só GET/HEAD são servidos; demais métodos caem no 405 do plugin de segurança.
  });
}
