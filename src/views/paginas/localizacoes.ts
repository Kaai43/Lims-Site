import { html, type SafeHtml } from '../html.js';
import { cabecalhoPagina, layout } from '../layout.js';

export function paginaLocalizacoes(): SafeHtml {
  return layout({
    titulo: 'Localizações',
    descricao: 'Onde encontrar o LIMS no Instituto Federal do Piauí (IFPI).',
    rotaAtiva: '/localizacoes',
    conteudo: html`
      ${cabecalhoPagina(
        '05 — ENDEREÇO & CONTATO',
        'Localizações',
        'Unidades do Instituto Federal do Piauí onde o LIMS desenvolve suas atividades.',
      )}

      <section class="secao">
        <div class="container grade-cards">
          <article class="card">
            <span class="tag">SEDE INSTITUCIONAL</span>
            <h2 class="card__titulo">IFPI — Teresina, Piauí</h2>
            <p class="card__texto">
              Instituto Federal de Educação, Ciência e Tecnologia do Piauí.<br>
              Teresina — PI, Brasil.
            </p>
            <p class="card__texto">
              <strong>Atendimento:</strong> segunda a sexta, em horário letivo institucional.
            </p>
            <div class="card__rodape">
              <a class="btn btn--primario"
                 href="https://www.openstreetmap.org/search?query=IFPI%20Teresina"
                 target="_blank"
                 rel="noopener noreferrer">
                Abrir mapa (OpenStreetMap)
              </a>
              <a class="btn"
                 href="https://www.ifpi.edu.br/"
                 target="_blank"
                 rel="noopener noreferrer">
                Portal do IFPI
              </a>
            </div>
          </article>

          <article class="card">
            <span class="tag">CONTATO CIENTÍFICO</span>
            <h2 class="card__titulo">Fale com a equipe</h2>
            <p class="card__texto">
              Para parcerias institucionais, projetos de iniciação científica ou oficinas em
              escolas públicas, entre em contato diretamente com os docentes na página de
              pesquisadores.
            </p>
            <div class="card__rodape">
              <a class="btn" href="/pesquisadores">Ver contatos dos pesquisadores</a>
            </div>
          </article>
        </div>
      </section>
    `,
  });
}
