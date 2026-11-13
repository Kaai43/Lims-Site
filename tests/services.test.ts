import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { criarBancoTeste } from './ajuda/banco.js';
import {
  listarCategorias,
  listarEventos,
  listarPesquisadores,
  listarProjetos,
} from '../src/services/conteudo.js';
import type { Db } from '../src/db.js';

let db: Db;
let limpar: () => Promise<void>;

before(async () => {
  ({ db, limpar } = criarBancoTeste('services'));
  // Dados sintéticos.
  await db.pesquisador.createMany({
    data: [
      { slug: 'b', nome: 'Pessoa B', formacao: 'Mestrado', ordem: 2 },
      { slug: 'a', nome: 'Pessoa A', formacao: 'Doutorado', ordem: 1 },
    ],
  });
  await db.projeto.createMany({
    data: [
      { slug: 'p1', titulo: 'Robô 1', resumo: 'r', descricao: 'd', categoria: 'robotica', status: 'em-andamento', ordem: 2 },
      { slug: 'p2', titulo: 'App 2', resumo: 'r', descricao: 'd', categoria: 'educacao', status: 'concluido', ordem: 1 },
      { slug: 'p3', titulo: 'Robô 3', resumo: 'r', descricao: 'd', categoria: 'robotica', status: 'concluido', ordem: 3 },
    ],
  });
  await db.evento.createMany({
    data: [
      { slug: 'e-passado', titulo: 'Passado', descricao: 'd', data: new Date('2020-01-01'), local: 'Sala 1' },
      { slug: 'e-futuro-2', titulo: 'Futuro 2', descricao: 'd', data: new Date('2099-06-01'), local: 'Sala 2' },
      { slug: 'e-futuro-1', titulo: 'Futuro 1', descricao: 'd', data: new Date('2099-01-01'), local: 'Sala 3' },
    ],
  });
});

after(async () => {
  await limpar();
});

test('pesquisadores ordenados por ordem', async () => {
  const lista = await listarPesquisadores(db);
  assert.deepEqual(lista.map((p) => p.slug), ['a', 'b']);
});

test('projetos filtram por categoria e respeitam ordem', async () => {
  const todos = await listarProjetos(db);
  assert.deepEqual(todos.map((p) => p.slug), ['p2', 'p1', 'p3']);
  const robotica = await listarProjetos(db, { categoria: 'robotica' });
  assert.deepEqual(robotica.map((p) => p.slug), ['p1', 'p3']);
});

test('categorias distintas em ordem alfabética', async () => {
  assert.deepEqual(await listarCategorias(db), ['educacao', 'robotica']);
});

test('eventos próximos (asc) e anteriores (desc) relativos a "agora"', async () => {
  const agora = new Date('2026-11-13T12:00:00Z');
  const proximos = await listarEventos(db, 'proximos', agora);
  assert.deepEqual(proximos.map((e) => e.slug), ['e-futuro-1', 'e-futuro-2']);
  const anteriores = await listarEventos(db, 'anteriores', agora);
  assert.deepEqual(anteriores.map((e) => e.slug), ['e-passado']);
});
