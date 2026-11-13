import { html, type SafeHtml } from '../html.js';
import { cabecalhoPagina, layout } from '../layout.js';

export function paginaLaboratorio(): SafeHtml {
  return layout({
    titulo: 'O Laboratório',
    descricao:
      'Conheça a missão, infraestrutura e linhas de pesquisa do LIMS — Laboratory of Innovation on Multimedia Systems (IFPI).',
    rotaAtiva: '/laboratorio',
    conteudo: html`
      ${cabecalhoPagina(
        '01 — INSTITUCIONAL',
        'O Laboratório',
        'Pesquisa aplicada, prototipagem e formação científica no Instituto Federal do Piauí.',
      )}

      <section class="secao">
        <div class="container grade-cards">
          <article class="card">
            <span class="tag">MISSÃO</span>
            <h2 class="card__titulo">Inovação aberta para o ensino público</h2>
            <p class="card__texto">
              O LIMS (Laboratory of Innovation on Multimedia Systems) articula docentes e
              estudantes do IFPI no desenvolvimento de soluções em sistemas multimídia,
              robótica educacional e plataformas digitais acessíveis.
            </p>
          </article>

          <article class="card">
            <span class="tag">METODOLOGIA</span>
            <h2 class="card__titulo">Da bancada ao código em produção</h2>
            <p class="card__texto">
              Os projetos integram hardware aberto, software livre e padrões modernos de
              engenharia e segurança da informação, priorizando reprodutibilidade e impacto
              direto nas escolas públicas.
            </p>
          </article>

          <article class="card">
            <span class="tag">EIXOS</span>
            <h2 class="card__titulo">Sistemas Multimídia, Robótica e STEAM</h2>
            <p class="card__texto">
              Atuamos em informática na educação, engenharia de software, sistemas
              embarcados, bioinformática e divulgação científica para estudantes do ensino
              básico, técnico e superior.
            </p>
          </article>

          <article class="card">
            <span class="tag">VÍNCULO</span>
            <h2 class="card__titulo">Instituto Federal do Piauí (IFPI)</h2>
            <p class="card__texto">
              Integrado às ações de ensino, pesquisa e extensão do IFPI, o laboratório
              apoia iniciação científica, trabalhos de conclusão e parcerias interinstitucionais.
            </p>
          </article>
        </div>
      </section>
    `,
  });
}
