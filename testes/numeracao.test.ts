import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import type { FastifyInstance } from 'fastify';
import { buildApp } from '../codigo-fonte/aplicacao.js';
import { criarBancoTeste } from './ajuda/banco.js';
import { popularBanco } from '../banco-de-dados/popular.js';
import type { Db } from '../codigo-fonte/banco.js';

/**
 * Regressão: Projetos aparecia como "03" e Pesquisadores como "02", invertendo a
 * ordem do menu. A numeração das páginas deve seguir a ordem da navegação.
 */
const ORDEM = [
  { rota: '/laboratorio', numero: '01' },
  { rota: '/projetos', numero: '02' },
  { rota: '/pesquisadores', numero: '03' },
  { rota: '/eventos', numero: '04' },
  { rota: '/localizacoes', numero: '05' },
] as const;

let app: FastifyInstance;
let db: Db;
let limpar: () => Promise<void>;

before(async () => {
  ({ db, limpar } = criarBancoTeste('numeracao'));
  await popularBanco(db);
  app = await buildApp({ config: { LOG_LEVEL: 'silent', RATE_LIMIT_MAX: 500 }, db });
});

after(async () => {
  await app.close();
  await limpar();
});

test('numeração das páginas segue a ordem do menu', async () => {
  for (const { rota, numero } of ORDEM) {
    const res = await app.inject({ method: 'GET', url: rota });
    assert.equal(res.statusCode, 200, `${rota} deveria responder 200`);

    const rotulo = res.body.match(/class="rotulo">\/\/ (\d{2}) —/);
    assert.ok(rotulo, `${rota} deveria ter um rótulo numerado`);
    assert.equal(rotulo[1], numero, `${rota} deveria ser ${numero}`);
  }
});
