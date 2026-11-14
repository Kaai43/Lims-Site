import { html, raw, type SafeHtml } from '../html.js';

export interface ProjetoView {
  slug: string;
  titulo: string;
  resumo: string;
  descricao: string;
  categoria: string;
  status: string;
  anoInicio: number | null;
  instagramUrl: string | null;
  pdfUrl: string | null;
}

const ROTULOS_CATEGORIA: Record<string, string> = {
  'steam-educacao': 'STEAM & Educação',
  robotica: 'Robótica & Embarcados',
};

function rotuloCategoria(cat: string): string {
  return ROTULOS_CATEGORIA[cat] ?? cat;
}

export function parcialProjetos(
  projetos: readonly ProjetoView[],
  categorias: readonly string[],
  categoriaAtiva?: string | undefined,
): SafeHtml {
  return html`
    <nav class="filtros" aria-label="Filtrar projetos por área">
      <a class="filtro"
         href="/projetos"
         hx-get="/projetos"
         hx-target="#area-projetos"
         hx-push-url="true"
         ${!categoriaAtiva ? raw('aria-current="true"') : ''}>
        Todos
      </a>
      ${categorias.map(
        (cat) => html`<a class="filtro"
           href="/projetos?categoria=${cat}"
           hx-get="/projetos?categoria=${cat}"
           hx-target="#area-projetos"
           hx-push-url="true"
           ${categoriaAtiva === cat ? raw('aria-current="true"') : ''}>
          ${rotuloCategoria(cat)}
        </a>`,
      )}
    </nav>

    ${projetos.length === 0
      ? html`<p class="card__texto">Nenhum projeto encontrado nesta categoria.</p>`
      : html`<div class="grade-cards">
          ${projetos.map(
            (p) => html`<article class="card">
              <div style="display:flex;justify-content:space-between;gap:.5rem;flex-wrap:wrap">
                <span class="tag">${rotuloCategoria(p.categoria)}</span>
                <span class="tag">${p.status === 'concluido' ? 'Concluído' : 'Em andamento'}${p.anoInicio ? ` · ${p.anoInicio}` : ''}</span>
              </div>
              <h2 class="card__titulo">${p.titulo}</h2>
              <p class="card__texto">${p.descricao}</p>
              <div class="card__rodape">
                ${p.instagramUrl
                  ? html`<a class="btn" href="${p.instagramUrl}" target="_blank" rel="noopener noreferrer">Instagram</a>`
                  : null}
                ${p.pdfUrl
                  ? html`<a class="btn btn--primario" href="${p.pdfUrl}" target="_blank" rel="noopener noreferrer">Apresentação (PDF)</a>`
                  : null}
              </div>
            </article>`,
          )}
        </div>`}
  `;
}
