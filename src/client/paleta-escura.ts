/**
 * Esqueleto de "Trocar de Cores" (variantes de paleta para o modo escuro).
 *
 * Preparado para uso futuro (sem seletor visível na UI por enquanto).
 * Paletas suportadas no CSS (`[data-theme="dark"][data-dark-palette="..."]`):
 *  - "verde" (padrão atual: grafite com verde institucional IFPI)
 *  - "preto" (preto puro OLED `#000000` com contraste alto)
 *  - "azul"  (azul-noite robótico/cibernético)
 */

export const PALETAS_ESCURAS = ['verde', 'preto', 'azul'] as const;
export type PaletaEscura = (typeof PALETAS_ESCURAS)[number];

export const CHAVE_PALETA_ESCURA = 'lims-dark-palette';
export const PALETA_ESCURA_PADRAO: PaletaEscura = 'verde';

export function ehPaletaEscuraValida(valor: unknown): valor is PaletaEscura {
  return typeof valor === 'string' && (PALETAS_ESCURAS as readonly string[]).includes(valor);
}

export function lerPaletaEscura(): PaletaEscura {
  try {
    const salvo = localStorage.getItem(CHAVE_PALETA_ESCURA);
    if (ehPaletaEscuraValida(salvo)) {
      return salvo;
    }
  } catch {
    // Ignorar se localStorage estiver indisponível
  }
  return PALETA_ESCURA_PADRAO;
}

export interface AlvoAtributo {
  setAttribute(nome: string, valor: string): void;
}

export function aplicarPaletaEscura(
  paleta: PaletaEscura,
  persistir = true,
  elementoRaiz?: AlvoAtributo,
): void {
  if (!ehPaletaEscuraValida(paleta)) return;
  const alvo =
    elementoRaiz ??
    (typeof globalThis !== 'undefined' && 'document' in globalThis
      ? (globalThis as unknown as { document: { documentElement: AlvoAtributo } }).document.documentElement
      : undefined);
  alvo?.setAttribute('data-dark-palette', paleta);
  if (persistir) {
    try {
      localStorage.setItem(CHAVE_PALETA_ESCURA, paleta);
    } catch {
      // Ignorar erro de storage
    }
  }
}
