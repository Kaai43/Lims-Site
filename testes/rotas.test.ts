import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import type { FastifyInstance } from 'fastify';
import { buildApp } from '../codigo-fonte/aplicacao.js';
import { criarBancoTeste } from './ajuda/banco.js';
import { popularBanco } from '../banco-de-dados/popular.js';
import type { Db } from '../codigo-fonte/banco.js';

let app: FastifyInstance;
let db: Db;
let limpar: () => Promise<void>;

before(async () => {
  ({ db, limpar } = criarBancoTeste('rotas'));
  await popularBanco(db);
  app = await buildApp({ config: { LOG_LEVEL: 'silent', RATE_LIMIT_MAX: 500 }, db });
});

after(async () => {
  await app.close();
  await limpar();
});

test('GET / devolve página inicial com h1 e projetos em destaque', async () => {
  const res = await app.inject({ method: 'GET', url: '/' });
  assert.equal(res.statusCode, 200);
  assert.match(res.body, /<h1[^>]*>.*Laboratory of Innovation on Multimedia Systems/s);
  assert.match(res.body, /Your Student Space/);
});

test('URLs antigas redirecionam com 301 para as rotas novas', async () => {
  const casos: Array<[string, string]> = [
    ['/index.html', '/'],
    ['/lims.html', '/'],
    ['/paginas/laboratorio.html', '/laboratorio'],
    ['/paginas/pesquisadores.html', '/pesquisadores'],
    ['/paginas/projetos.html', '/projetos'],
    ['/paginas/eventos.html', '/eventos'],
    ['/paginas/localizacoes.html', '/localizacoes'],
  ];
  for (const [de, para] of casos) {
    const res = await app.inject({ method: 'GET', url: de });
    assert.equal(res.statusCode, 301, `${de} deveria ser 301`);
    assert.equal(res.headers.location, para);
  }
});

test('URL legada fora da allowlist → 404 (sem open redirect)', async () => {
  const res = await app.inject({ method: 'GET', url: '/paginas/inexistente.html' });
  assert.equal(res.statusCode, 404);
});

test('GET /laboratorio → 200', async () => {
  const res = await app.inject({ method: 'GET', url: '/laboratorio' });
  assert.equal(res.statusCode, 200);
  assert.match(res.body, /<h1[^>]*>O Laboratório<\/h1>/);
});

test('GET /pesquisadores lista do banco e escapa HTML malicioso', async () => {
  await db.pesquisador.create({
    data: { slug: 'xss-teste', nome: '<script>alert(1)</script>', formacao: 'Teste', ordem: 99 },
  });
  const res = await app.inject({ method: 'GET', url: '/pesquisadores' });
  assert.equal(res.statusCode, 200);
  assert.match(res.body, /Fabio de Jesus Lima Gomes/);
  assert.match(res.body, /Fernando Castelo Branco Gonçalves Santana/);
  assert.match(res.body, /Ricardo Martins Ramos/);
  assert.match(res.body, /card--pesquisador/);
  assert.match(res.body, /card__foto--pesquisador/);
  assert.match(res.body, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/);
  assert.doesNotMatch(res.body, /<script>alert\(1\)<\/script>/);
});

test('GET /projetos devolve página completa normal e partial quando HX-Request: true', async () => {
  const pagina = await app.inject({ method: 'GET', url: '/projetos' });
  assert.equal(pagina.statusCode, 200);
  assert.match(pagina.body, /<!DOCTYPE html>/);
  assert.match(pagina.body, /Your Student Space/);

  const parcial = await app.inject({
    method: 'GET',
    url: '/projetos?categoria=steam-educacao',
    headers: { 'hx-request': 'true' },
  });
  assert.equal(parcial.statusCode, 200);
  assert.doesNotMatch(parcial.body, /<!DOCTYPE html>/);
  assert.match(parcial.body, /Your Student Space/);
});

test('GET /projetos com categoria inválida → 400', async () => {
  const res = await app.inject({ method: 'GET', url: '/projetos?categoria=<script>' });
  assert.equal(res.statusCode, 400);
});

test('GET /eventos inclui SEMINOVA 2026 (Teresina Info), remove mostra antiga e valida período', async () => {
  const padrao = await app.inject({ method: 'GET', url: '/eventos' });
  assert.equal(padrao.statusCode, 200);
  assert.match(padrao.body, /seminova2026\.com\.br/);
  assert.match(padrao.body, /Teresina Info/);
  assert.doesNotMatch(padrao.body, /Mostra de Projetos e Protótipos do LIMS/);

  const ok = await app.inject({ method: 'GET', url: '/eventos?periodo=anteriores' });
  assert.equal(ok.statusCode, 200);
  assert.match(ok.body, /<!DOCTYPE html>/);
  assert.match(ok.body, /seminova2026\.com\.br/);

  const hx = await app.inject({
    method: 'GET',
    url: '/eventos?periodo=proximos',
    headers: { 'hx-request': 'true' },
  });
  assert.equal(hx.statusCode, 200);
  assert.doesNotMatch(hx.body, /<!DOCTYPE html>/);

  const ruim = await app.inject({ method: 'GET', url: '/eventos?periodo=qualquer' });
  assert.equal(ruim.statusCode, 400);
});

test('GET /localizacoes → 200 sem iframe (respeita CSP)', async () => {
  const res = await app.inject({ method: 'GET', url: '/localizacoes' });
  assert.equal(res.statusCode, 200);
  assert.match(res.body, /<h1[^>]*>Localizações<\/h1>/);
  assert.doesNotMatch(res.body, /<iframe/i);
});

test('GET /robots.txt e /.well-known/security.txt respondem 200', async () => {
  const r1 = await app.inject({ method: 'GET', url: '/robots.txt' });
  const r2 = await app.inject({ method: 'GET', url: '/.well-known/security.txt' });
  assert.equal(r1.statusCode, 200);
  assert.equal(r2.statusCode, 200);
});
