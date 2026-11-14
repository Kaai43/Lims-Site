/**
 * Templates HTML com escape por padrão.
 *
 * Regra de segurança (AGENTS.md §10.3): todo valor interpolado em html`` é
 * escapado. A única forma de inserir HTML sem escape é `raw()`, que deve ser
 * usada apenas com conteúdo escrito no código-fonte — nunca com dado externo.
 */

const MARCA = Symbol('SafeHtml');

export interface SafeHtml {
  readonly [MARCA]: true;
  readonly valor: string;
}

export type Interpolavel =
  | SafeHtml
  | string
  | number
  | boolean
  | null
  | undefined
  | readonly Interpolavel[];

const ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '`': '&#96;',
};

export function escapar(texto: string): string {
  return texto.replace(/[&<>"'`]/g, (c) => ESCAPES[c] ?? c);
}

function ehSafe(v: unknown): v is SafeHtml {
  return typeof v === 'object' && v !== null && MARCA in v;
}

function serializar(v: Interpolavel): string {
  if (v === null || v === undefined || v === false) return '';
  if (ehSafe(v)) return v.valor;
  if (Array.isArray(v)) return v.map((item: Interpolavel) => serializar(item)).join('');
  return escapar(String(v));
}

function seguro(valor: string): SafeHtml {
  return { [MARCA]: true, valor };
}

export function html(partes: TemplateStringsArray, ...valores: Interpolavel[]): SafeHtml {
  let saida = partes[0] ?? '';
  for (let i = 0; i < valores.length; i++) {
    saida += serializar(valores[i]) + (partes[i + 1] ?? '');
  }
  return seguro(saida);
}

/** HTML confiável escrito no código. NUNCA passe dado de usuário/banco aqui. */
export function raw(conteudoConfiavel: string): SafeHtml {
  return seguro(conteudoConfiavel);
}

export function renderizar(fragmento: SafeHtml): string {
  return fragmento.valor;
}
