import type { Db } from '../db.js';

/**
 * Consultas de conteúdo. Somente a API de query do Prisma (parametrizada).
 * Proibido $queryRawUnsafe / $executeRawUnsafe (AGENTS.md §10.1).
 */

export function listarPesquisadores(db: Db) {
  return db.pesquisador.findMany({ orderBy: [{ ordem: 'asc' }, { nome: 'asc' }] });
}

export function listarProjetos(db: Db, filtro: { categoria?: string | undefined } = {}) {
  return db.projeto.findMany({
    where: filtro.categoria ? { categoria: filtro.categoria } : {},
    orderBy: [{ ordem: 'asc' }, { titulo: 'asc' }],
  });
}

export async function listarCategorias(db: Db): Promise<string[]> {
  const linhas = await db.projeto.findMany({
    distinct: ['categoria'],
    select: { categoria: true },
    orderBy: { categoria: 'asc' },
  });
  return linhas.map((l) => l.categoria);
}

export function projetosEmDestaque(db: Db, quantidade = 3) {
  return db.projeto.findMany({ orderBy: [{ ordem: 'asc' }], take: quantidade });
}

export type Periodo = 'proximos' | 'anteriores';

export function listarEventos(db: Db, periodo: Periodo, agora: Date = new Date()) {
  return periodo === 'proximos'
    ? db.evento.findMany({ where: { data: { gte: agora } }, orderBy: { data: 'asc' } })
    : db.evento.findMany({ where: { data: { lt: agora } }, orderBy: { data: 'desc' } });
}

export function contarConteudo(db: Db) {
  return Promise.all([db.pesquisador.count(), db.projeto.count(), db.evento.count()]).then(
    ([pesquisadores, projetos, eventos]) => ({ pesquisadores, projetos, eventos }),
  );
}
