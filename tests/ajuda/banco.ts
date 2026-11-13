import { execSync } from 'node:child_process';
import { mkdirSync, rmSync } from 'node:fs';
import { criarPrisma, type Db } from '../../src/db.js';

/**
 * Cria um banco SQLite descartável em tests/.tmp/<nome>.db com as migrations
 * aplicadas. Dados de teste são sempre sintéticos.
 */
export function criarBancoTeste(nome: string): { db: Db; url: string; limpar: () => Promise<void> } {
  mkdirSync('tests/.tmp', { recursive: true });
  const arquivo = `tests/.tmp/${nome}.db`;
  rmSync(arquivo, { force: true });
  const url = `file:./${arquivo}`;
  execSync('npx prisma migrate deploy', {
    env: { ...process.env, DATABASE_URL: url },
    stdio: 'ignore',
  });
  const db = criarPrisma(url);
  return {
    db,
    url,
    limpar: async () => {
      await db.$disconnect();
      rmSync(arquivo, { force: true });
    },
  };
}
