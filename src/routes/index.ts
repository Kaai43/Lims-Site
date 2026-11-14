import type { FastifyInstance } from 'fastify';
import { renderizar } from '../views/html.js';
import { paginaInicio } from '../views/paginas/inicio.js';
import { paginaLaboratorio } from '../views/paginas/laboratorio.js';
import { paginaPesquisadores } from '../views/paginas/pesquisadores.js';
import { paginaProjetos } from '../views/paginas/projetos.js';
import { paginaEventos } from '../views/paginas/eventos.js';
import { paginaLocalizacoes } from '../views/paginas/localizacoes.js';
import { parcialProjetos } from '../views/parciais/lista-projetos.js';
import { parcialEventos } from '../views/parciais/lista-eventos.js';
import { paginaErro } from '../views/paginas/erro.js';
import {
  contarConteudo,
  listarCategorias,
  listarEventos,
  listarPesquisadores,
  listarProjetos,
  projetosEmDestaque,
} from '../services/conteudo.js';
import { esquemaFiltroEventos, esquemaFiltroProjetos } from '../schemas/filtros.js';

/** Allowlist fixa de páginas antigas → evita qualquer possibilidade de open redirect. */
const REDIRECIONAMENTOS_LEGADOS: Readonly<Record<string, string>> = {
  laboratorio: '/laboratorio',
  pesquisadores: '/pesquisadores',
  projetos: '/projetos',
  eventos: '/eventos',
  localizacoes: '/localizacoes',
};

const ROBOTS_TXT = `User-agent: *
Allow: /
`;

const SECURITY_TXT = `Contact: https://github.com/Kaai43/Lims-Site/security
Preferred-Languages: pt-BR, en
Expires: 2027-12-31T23:59:59.000Z
`;

export async function registrarTodasRotas(app: FastifyInstance): Promise<void> {
  app.get('/', async (_req, reply) => {
    const [destaques, contagem] = await Promise.all([
      projetosEmDestaque(app.db, 3),
      contarConteudo(app.db),
    ]);
    return reply.type('text/html; charset=utf-8').send(renderizar(paginaInicio({ destaques, contagem })));
  });

  app.get('/laboratorio', async (_req, reply) => {
    return reply.type('text/html; charset=utf-8').send(renderizar(paginaLaboratorio()));
  });

  app.get('/pesquisadores', async (_req, reply) => {
    const lista = await listarPesquisadores(app.db);
    return reply.type('text/html; charset=utf-8').send(renderizar(paginaPesquisadores(lista)));
  });

  app.get('/projetos', async (req, reply) => {
    const { categoria } = esquemaFiltroProjetos.parse(req.query);
    const [projetos, categorias] = await Promise.all([
      listarProjetos(app.db, { categoria }),
      listarCategorias(app.db),
    ]);
    const ehHtmx = req.headers['hx-request'] === 'true';
    const htmlSaida = ehHtmx
      ? parcialProjetos(projetos, categorias, categoria)
      : paginaProjetos(projetos, categorias, categoria);
    return reply.type('text/html; charset=utf-8').send(renderizar(htmlSaida));
  });

  app.get('/eventos', async (req, reply) => {
    const { periodo: periodoPedido } = esquemaFiltroEventos.parse(req.query);
    let periodo = periodoPedido ?? 'proximos';
    let eventos = await listarEventos(app.db, periodo);
    if (!periodoPedido && eventos.length === 0) {
      periodo = 'anteriores';
      eventos = await listarEventos(app.db, 'anteriores');
    }
    const ehHtmx = req.headers['hx-request'] === 'true';
    const htmlSaida = ehHtmx ? parcialEventos(eventos, periodo) : paginaEventos(eventos, periodo);
    return reply.type('text/html; charset=utf-8').send(renderizar(htmlSaida));
  });

  app.get('/localizacoes', async (_req, reply) => {
    return reply.type('text/html; charset=utf-8').send(renderizar(paginaLocalizacoes()));
  });

  // Redirecionamentos 301 das URLs antigas do site estático.
  app.get('/index.html', async (_req, reply) => {
    return reply.redirect('/', 301);
  });

  app.get<{ Params: { nome: string } }>('/paginas/:nome.html', async (req, reply) => {
    const destino = REDIRECIONAMENTOS_LEGADOS[req.params.nome];
    if (!destino) {
      return reply.code(404).type('text/html; charset=utf-8').send(renderizar(paginaErro(404)));
    }
    return reply.redirect(destino, 301);
  });

  app.get('/robots.txt', async (_req, reply) => {
    return reply.type('text/plain; charset=utf-8').send(ROBOTS_TXT);
  });

  app.get('/.well-known/security.txt', async (_req, reply) => {
    return reply.type('text/plain; charset=utf-8').send(SECURITY_TXT);
  });
}
