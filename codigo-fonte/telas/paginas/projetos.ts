import { html, type SafeHtml } from '../html.js';
import { cabecalhoPagina, layout } from '../layout.js';
import { parcialProjetos, type ProjetoView } from '../parciais/lista-projetos.js';

export function paginaProjetos(
  projetos: readonly ProjetoView[],
  categorias: readonly string[],
  categoriaAtiva?: string | undefined,
): SafeHtml {
  return layout({
    titulo: 'Projetos',
    descricao: 'Projetos de pesquisa, extensão, robótica e educação STEAM desenvolvidos no LIMS (IFPI).',
    rotaAtiva: '/projetos',
    conteudo: html`
      ${cabecalhoPagina(
        '02 — PESQUISA & EXTENSÃO',
        'Projetos',
        'Plataformas, protótipos e ações desenvolvidas pela equipe do LIMS no IFPI.',
      )}

      <section class="secao">
        <div class="container" id="area-projetos">
          ${parcialProjetos(projetos, categorias, categoriaAtiva)}
        </div>
      </section>
    `,
  });
}
