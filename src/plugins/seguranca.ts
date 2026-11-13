import type { FastifyInstance, FastifyError } from 'fastify';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import cookie from '@fastify/cookie';
import csrf from '@fastify/csrf-protection';
import { ZodError } from 'zod';
import type { Config } from '../config.js';
import { paginaErro } from '../views/paginas/erro.js';
import { renderizar } from '../views/html.js';

/**
 * Esqueleto de defesa do site (ver AGENTS.md §10 e Cyberseguranca.md).
 *
 * Camadas, na ordem em que a requisição passa:
 *  1. Limites do servidor (bodyLimit, timeouts, tamanho de parâmetro) — em app.ts.
 *  2. Rate limit por IP (força bruta, scraping agressivo, DoS leve).
 *  3. Helmet: CSP restritiva + cabeçalhos (nosniff, frame-ancestors, referrer, HSTS).
 *  4. Métodos: o site é somente leitura → qualquer método fora de GET/HEAD sem rota = 405.
 *  5. CSRF pronto para uso: rotas de escrita futuras DEVEM usar
 *     `{ onRequest: app.csrfProtection }` e o template enviar o token via
 *     `hx-headers='{"x-csrf-token": "..."}'` (token gerado com `reply.generateCsrf()`).
 *  6. Validação de entrada com Zod nas rotas → ZodError vira 400.
 *  7. Tratamento de erro sem vazamento: stack/mensagem só no log.
 */
export async function configurarSeguranca(app: FastifyInstance, config: Config): Promise<void> {
  const producao = config.NODE_ENV === 'production';

  await app.register(rateLimit, {
    global: true,
    max: config.RATE_LIMIT_MAX,
    timeWindow: config.RATE_LIMIT_JANELA,
    // Atrás do proxy do Render, req.ip já vem do X-Forwarded-For (trustProxy em app.ts).
    keyGenerator: (req) => req.ip,
  });

  await app.register(helmet, {
    global: true,
    contentSecurityPolicy: {
      useDefaults: false,
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'"],
        imgSrc: ["'self'", 'data:'],
        fontSrc: ["'self'"],
        connectSrc: ["'self'"],
        frameAncestors: ["'none'"],
        frameSrc: ["'none'"],
        formAction: ["'self'"],
        baseUri: ["'self'"],
        objectSrc: ["'none'"],
        manifestSrc: ["'self'"],
        ...(producao ? { upgradeInsecureRequests: [] } : {}),
      },
    },
    hsts: producao ? { maxAge: 31_536_000, includeSubDomains: true } : false,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    crossOriginResourcePolicy: { policy: 'same-origin' },
  });

  await app.register(cookie);
  await app.register(csrf, {
    cookieOpts: { path: '/', httpOnly: true, sameSite: 'strict', secure: producao, signed: false },
  });

  app.setNotFoundHandler({ preHandler: app.rateLimit() }, (req, reply) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      return reply
        .code(405)
        .header('allow', 'GET, HEAD')
        .type('text/html; charset=utf-8')
        .send(renderizar(paginaErro(405)));
    }
    return reply.code(404).type('text/html; charset=utf-8').send(renderizar(paginaErro(404)));
  });

  app.setErrorHandler((erro: FastifyError | ZodError, req, reply) => {
    let status = 500;
    if (erro instanceof ZodError) {
      status = 400;
    } else if (typeof erro.statusCode === 'number' && erro.statusCode >= 400 && erro.statusCode < 500) {
      status = erro.statusCode;
    }

    if (status >= 500) {
      req.log.error({ err: erro }, 'erro interno');
    } else {
      req.log.info({ status, code: 'code' in erro ? erro.code : undefined }, 'requisição rejeitada');
    }

    return reply.code(status).type('text/html; charset=utf-8').send(renderizar(paginaErro(status)));
  });
}
