import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// `dist/lib/versao-assets.js` → sobe dois níveis até a raiz do projeto.
const RAIZ_PUBLIC = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
  'arquivos-publicos',
);

const cache = new Map<string, string>();

/**
 * Acrescenta `?v=<hash do conteúdo>` a um caminho servido de `public/`.
 *
 * O plugin de estáticos responde com `Cache-Control: max-age=7d`. Sem mudar a
 * URL quando o arquivo muda, o navegador continua usando o CSS/JS antigo por
 * dias — foi o que aconteceu depois de reenquadrar as fotos dos pesquisadores.
 * Com o hash no endereço, cada build gera uma URL nova e o cache longo passa a
 * ser seguro.
 */
export function comVersao(caminhoPublico: string): string {
  const emCache = cache.get(caminhoPublico);
  if (emCache !== undefined) {
    return `${caminhoPublico}?v=${emCache}`;
  }

  let hash: string;
  try {
    const conteudo = readFileSync(path.join(RAIZ_PUBLIC, caminhoPublico));
    hash = createHash('sha256').update(conteudo).digest('hex').slice(0, 10);
  } catch {
    // Arquivo ausente (ex.: build incompleto): não quebra a renderização.
    hash = 'dev';
  }

  cache.set(caminhoPublico, hash);
  return `${caminhoPublico}?v=${hash}`;
}
