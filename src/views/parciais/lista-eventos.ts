import { html, raw, type SafeHtml } from '../html.js';
import type { Periodo } from '../../services/conteudo.js';

export interface EventoView {
  slug: string;
  titulo: string;
  descricao: string;
  data: Date;
  local: string;
  linkUrl: string | null;
}

const formatador = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'long',
  timeZone: 'America/Fortaleza',
});

export function parcialEventos(eventos: readonly EventoView[], periodo: Periodo): SafeHtml {
  return html`
    <nav class="filtros" aria-label="Período dos eventos">
      <a class="filtro"
         href="/eventos?periodo=proximos"
         hx-get="/eventos?periodo=proximos"
         hx-target="#area-eventos"
         hx-push-url="true"
         ${periodo === 'proximos' ? raw('aria-current="true"') : ''}>
        Próximos
      </a>
      <a class="filtro"
         href="/eventos?periodo=anteriores"
         hx-get="/eventos?periodo=anteriores"
         hx-target="#area-eventos"
         hx-push-url="true"
         ${periodo === 'anteriores' ? raw('aria-current="true"') : ''}>
        Realizados
      </a>
    </nav>

    ${eventos.length === 0
      ? html`<p class="card__texto">Nenhum evento registrado neste período.</p>`
      : html`<div class="grade-cards">
          ${eventos.map(
            (ev) => html`<article class="card">
              <span class="tag"><time datetime="${ev.data.toISOString()}">${formatador.format(ev.data)}</time></span>
              <h2 class="card__titulo">${ev.titulo}</h2>
              <p class="card__texto">${ev.descricao}</p>
              <p class="card__texto"><strong>Local:</strong> ${ev.local}</p>
              ${ev.linkUrl
                ? html`<div class="card__rodape">
                    <a class="btn" href="${ev.linkUrl}" target="_blank" rel="noopener noreferrer">Mais informações</a>
                  </div>`
                : null}
            </article>`,
          )}
        </div>`}
  `;
}
