import { html, type SafeHtml } from '../html.js';
import { cabecalhoPagina, layout } from '../layout.js';

export interface PesquisadorView {
  slug: string;
  nome: string;
  email: string | null;
  formacao: string;
  area: string | null;
  fotoUrl: string | null;
  lattesUrl: string | null;
}

export function paginaPesquisadores(pesquisadores: readonly PesquisadorView[]): SafeHtml {
  return layout({
    titulo: 'Pesquisadores',
    descricao: 'Docentes e pesquisadores do LIMS — Laboratory of Innovation on Multimedia Systems (IFPI).',
    rotaAtiva: '/pesquisadores',
    conteudo: html`
      ${cabecalhoPagina(
        '02 — CORPO CIENTÍFICO',
        'Pesquisadores',
        'Docentes do Instituto Federal do Piauí que conduzem as pesquisas e projetos do laboratório.',
      )}

      <section class="secao">
        <div class="container grade-cards grade-cards--3" aria-label="Lista de pesquisadores">
          ${pesquisadores.map(
            (p) => html`<article class="card card--pesquisador">
              ${p.fotoUrl
                ? html`<div class="card__midia">
                    <img class="card__foto card__foto--pesquisador" src="${p.fotoUrl}" alt="Foto de ${p.nome}" loading="lazy" width="280" height="320">
                  </div>`
                : null}
              ${p.area ? html`<span class="tag">${p.area}</span>` : null}
              <h2 class="card__titulo">${p.nome}</h2>
              <p class="card__texto">${p.formacao}</p>
              <div class="card__rodape">
                ${p.email ? html`<a class="btn" href="mailto:${p.email}">${p.email}</a>` : null}
                ${p.lattesUrl
                  ? html`<a class="btn" href="${p.lattesUrl}" target="_blank" rel="noopener noreferrer">Currículo Lattes</a>`
                  : null}
              </div>
            </article>`,
          )}
        </div>
      </section>
    `,
  });
}
