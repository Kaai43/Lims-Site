import { html, type SafeHtml } from '../html.js';
import { layout } from '../layout.js';
import type { ProjetoView } from '../parciais/lista-projetos.js';

export interface DadosInicio {
  destaques: readonly ProjetoView[];
  contagem: { pesquisadores: number; projetos: number; eventos: number };
}

export function paginaInicio({ destaques, contagem }: DadosInicio): SafeHtml {
  return layout({
    titulo: 'Início',
    descricao:
      'LIMS — Laboratory of Innovation on Multimedia Systems do Instituto Federal do Piauí (IFPI). Pesquisa em sistemas multimídia, robótica e educação STEAM.',
    rotaAtiva: '/',
    conteudo: html`
      <section class="hero">
        <div class="container hero__grade">
          <div>
            <p class="rotulo">// 00 — IFPI · PESQUISA &amp; ROBÓTICA</p>
            <h1 class="hero__titulo">LIMS — Laboratory of Innovation on Multimedia Systems</h1>
            <p class="hero__sub">
              Laboratório institucional do Instituto Federal do Piauí dedicado a sistemas
              multimídia, robótica educacional, sistemas embarcados e tecnologias abertas
              para a educação pública.
            </p>
            <div class="hero__acoes">
              <a class="btn btn--primario" href="/projetos">Explorar projetos</a>
              <a class="btn" href="/pesquisadores">Conhecer pesquisadores</a>
              <a class="btn" href="/laboratorio">Sobre o laboratório</a>
            </div>
          </div>

          <aside class="hero__painel" aria-label="Identidade visual e indicadores do LIMS">
            <img class="hero__logo" src="/imagens/lims-logo.png" alt="Logotipo do LIMS" width="320" height="140">
            <div class="metricas">
              <div>
                <strong>${contagem.pesquisadores}</strong>
                <span>Pesquisadores</span>
              </div>
              <div>
                <strong>${contagem.projetos}</strong>
                <span>Projetos</span>
              </div>
              <div>
                <strong>${contagem.eventos}</strong>
                <span>Eventos</span>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section class="secao">
        <div class="container">
          <p class="rotulo">// 01 — LINHAS DE ATUAÇÃO</p>
          <div class="grade-cards grade-cards--3">
            <article class="card">
              <span class="tag">LINHA_01</span>
              <h2 class="card__titulo">Robótica &amp; Sistemas Embarcados</h2>
              <p class="card__texto">
                Prototipagem com microcontroladores, sensores, atuadores e kits abertos
                para ensino prático e automação nos campi do IFPI.
              </p>
            </article>
            <article class="card">
              <span class="tag">LINHA_02</span>
              <h2 class="card__titulo">Sistemas Multimídia Interativos</h2>
              <p class="card__texto">
                Aplicações web de alto desempenho, visualização de dados, áudio/vídeo e
                interfaces acessíveis voltadas à divulgação científica.
              </p>
            </article>
            <article class="card">
              <span class="tag">LINHA_03</span>
              <h2 class="card__titulo">Tecnologias Educacionais &amp; STEAM</h2>
              <p class="card__texto">
                Plataformas gratuitas que conectam estudantes da rede pública a ciência,
                tecnologia, engenharia, artes e matemática.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section class="secao" style="border-top:1px solid var(--borda)">
        <div class="container">
          <div style="display:flex;justify-content:space-between;align-items:end;gap:1rem;flex-wrap:wrap;margin-bottom:1.5rem">
            <div>
              <p class="rotulo">// 02 — PROJETOS EM DESTAQUE</p>
              <h2 style="font-family:var(--font-mono);margin:0">Iniciativas do laboratório</h2>
            </div>
            <a class="btn" href="/projetos">Ver todos os projetos</a>
          </div>
          <div class="grade-cards">
            ${destaques.map(
              (p) => html`<article class="card">
                <span class="tag">${p.categoria}</span>
                <h3 class="card__titulo">${p.titulo}</h3>
                <p class="card__texto">${p.resumo}</p>
                <div class="card__rodape">
                  <a class="btn" href="/projetos">Detalhes</a>
                </div>
              </article>`,
            )}
          </div>
        </div>
      </section>
    `,
  });
}
