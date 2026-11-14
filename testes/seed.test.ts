import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { criarBancoTeste } from './ajuda/banco.js';
import { popularBanco } from '../banco-de-dados/popular.js';
import type { Db } from '../codigo-fonte/banco.js';

// Regressão: o seed já existia, mas o guard de "executado direto" nunca era
// verdadeiro no Windows (`file://` + caminho gerava `file://C:/...` em vez de
// `file:///C:/...`). O comando `npm run db:seed` saía em silêncio com o banco
// vazio, e o build do Render publicava o site sem dados.
let db: Db;
let limpar: () => Promise<void>;

before(async () => {
  ({ db, limpar } = criarBancoTeste('seed'));
});

after(async () => {
  await limpar();
});

test('popularBanco insere os dados públicos do LIMS', async () => {
  await popularBanco(db);

  const [pesquisadores, projetos, eventos] = await Promise.all([
    db.pesquisador.count(),
    db.projeto.count(),
    db.evento.count(),
  ]);

  assert.ok(pesquisadores > 0, 'deveria haver pesquisadores após o seed');
  assert.ok(projetos > 0, 'deveria haver projetos após o seed');
  assert.ok(eventos > 0, 'deveria haver eventos após o seed');
});

test('popularBanco é idempotente', async () => {
  await popularBanco(db);
  const primeira = await db.pesquisador.count();
  await popularBanco(db);
  const segunda = await db.pesquisador.count();

  assert.equal(segunda, primeira, 'rodar o seed duas vezes não deve duplicar linhas');
});
