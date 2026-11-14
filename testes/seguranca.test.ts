import { test } from 'node:test';
import assert from 'node:assert/strict';
import { z } from 'zod';
import { buildApp } from '../codigo-fonte/aplicacao.js';

test('cabeçalhos de segurança presentes em toda resposta', async (t) => {
  const app = await buildApp({ config: { LOG_LEVEL: 'silent' } });
  t.after(() => app.close());

  const res = await app.inject({ method: 'GET', url: '/saude' });
  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.json(), { status: 'ok' });

  const csp = String(res.headers['content-security-policy']);
  assert.match(csp, /default-src 'self'/);
  assert.match(csp, /script-src 'self'/);
  assert.match(csp, /frame-ancestors 'none'/);
  assert.match(csp, /object-src 'none'/);
  assert.equal(res.headers['x-content-type-options'], 'nosniff');
  assert.ok(res.headers['referrer-policy']);
  assert.equal(res.headers['x-powered-by'], undefined);
});

test('HSTS só é enviado em produção', async (t) => {
  const dev = await buildApp({ config: { LOG_LEVEL: 'silent', NODE_ENV: 'development' } });
  const prod = await buildApp({ config: { LOG_LEVEL: 'silent', NODE_ENV: 'production' } });
  t.after(async () => { await dev.close(); await prod.close(); });

  const rDev = await dev.inject({ method: 'GET', url: '/saude' });
  const rProd = await prod.inject({ method: 'GET', url: '/saude' });
  assert.equal(rDev.headers['strict-transport-security'], undefined);
  assert.match(String(rProd.headers['strict-transport-security']), /max-age=\d+/);
});

test('rate limit devolve 429 após o limite', async (t) => {
  const app = await buildApp({ config: { LOG_LEVEL: 'silent', RATE_LIMIT_MAX: 3 } });
  t.after(() => app.close());

  for (let i = 0; i < 3; i++) {
    const ok = await app.inject({ method: 'GET', url: '/saude' });
    assert.equal(ok.statusCode, 200);
  }
  const bloqueada = await app.inject({ method: 'GET', url: '/saude' });
  assert.equal(bloqueada.statusCode, 429);
});

test('rota inexistente → 404 HTML sem detalhes internos', async (t) => {
  const app = await buildApp({ config: { LOG_LEVEL: 'silent' } });
  t.after(() => app.close());

  const res = await app.inject({ method: 'GET', url: '/nao-existe' });
  assert.equal(res.statusCode, 404);
  assert.match(String(res.headers['content-type']), /text\/html/);
  assert.doesNotMatch(res.body, /at .*\.ts:\d+/);
});

test('erro interno → 500 genérico, sem vazar mensagem ou stack', async (t) => {
  const app = await buildApp({
    config: { LOG_LEVEL: 'silent' },
    extra: (a) => {
      a.get('/explode', async () => {
        throw new Error('segredo-interno-123');
      });
    },
  });
  t.after(() => app.close());

  const res = await app.inject({ method: 'GET', url: '/explode' });
  assert.equal(res.statusCode, 500);
  assert.doesNotMatch(res.body, /segredo-interno-123/);
  assert.doesNotMatch(res.body, /at .*\.ts:\d+/);
});

test('entrada inválida (ZodError) → 400', async (t) => {
  const app = await buildApp({
    config: { LOG_LEVEL: 'silent' },
    extra: (a) => {
      a.get('/valida', async (req) => {
        z.object({ n: z.coerce.number().int() }).parse(req.query);
        return 'ok';
      });
    },
  });
  t.after(() => app.close());

  const res = await app.inject({ method: 'GET', url: '/valida?n=abc' });
  assert.equal(res.statusCode, 400);
});

test('método não permitido em rota existente → 405', async (t) => {
  const app = await buildApp({ config: { LOG_LEVEL: 'silent' } });
  t.after(() => app.close());

  for (const method of ['POST', 'PUT', 'DELETE', 'PATCH'] as const) {
    const res = await app.inject({ method, url: '/saude' });
    assert.equal(res.statusCode, 405, `${method} deveria ser 405`);
  }
});

test('corpo acima de 16 KB → 413', async (t) => {
  const app = await buildApp({
    config: { LOG_LEVEL: 'silent' },
    extra: (a) => {
      a.post('/recebe', async () => 'ok');
    },
  });
  t.after(() => app.close());

  const res = await app.inject({
    method: 'POST',
    url: '/recebe',
    headers: { 'content-type': 'application/json' },
    payload: JSON.stringify({ x: 'a'.repeat(20_000) }),
  });
  assert.equal(res.statusCode, 413);
});

test('esqueleto CSRF: POST protegido sem token → 403', async (t) => {
  const app = await buildApp({
    config: { LOG_LEVEL: 'silent' },
    extra: (a) => {
      a.post('/protegido', { onRequest: a.csrfProtection }, async () => 'ok');
    },
  });
  t.after(() => app.close());

  const res = await app.inject({ method: 'POST', url: '/protegido', payload: {} });
  assert.equal(res.statusCode, 403);
});
