import { html, type SafeHtml } from '../html.js';
import { cabecalhoPagina, layout } from '../layout.js';
import { parcialEventos, type EventoView } from '../parciais/lista-eventos.js';
import type { Periodo } from '../../services/conteudo.js';

export function paginaEventos(eventos: readonly EventoView[], periodo: Periodo): SafeHtml {
  return layout({
    titulo: 'Eventos',
    descricao: 'Agenda de mostras, oficinas de robótica, apresentações e eventos científicos do LIMS (IFPI).',
    rotaAtiva: '/eventos',
    conteudo: html`
      ${cabecalhoPagina(
        '04 — AGENDA CIENTÍFICA',
        'Eventos',
        'Oficinas, mostras tecnológicas e apresentações abertas à comunidade.',
      )}

      <section class="secao">
        <div class="container" id="area-eventos">
          ${parcialEventos(eventos, periodo)}
        </div>
      </section>
    `,
  });
}
