import { execSync } from 'node:child_process';
import { mkdirSync, rmSync } from 'node:fs';
import { criarPrisma, type Db } from '../../codigo-fonte/banco.js';

/**
 * Cria um banco SQLite descartável em testes/.tmp/<nome>.db com as migrations
 * aplicadas. Dados de teste são sempre sintéticos.
 */
export function criarBancoTeste(nome: string): { db: Db; url: string; limpar: () => Promise<void> } {
  mkdirSync('testes/.tmp', { recursive: true });
  const arquivo = `testes/.tmp/${nome}.db`;
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
