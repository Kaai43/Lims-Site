import { html, raw, type SafeHtml } from './html.js';
import { comVersao } from '../utilitarios/versao-assets.js';

export interface ItemNav {
  rota: string;
  rotulo: string;
}

export const NAVEGACAO: readonly ItemNav[] = [
  { rota: '/', rotulo: 'Início' },
  { rota: '/laboratorio', rotulo: 'O Laboratório' },
  { rota: '/projetos', rotulo: 'Projetos' },
  { rota: '/pesquisadores', rotulo: 'Pesquisadores' },
  { rota: '/eventos', rotulo: 'Eventos' },
  { rota: '/localizacoes', rotulo: 'Localizações' },
];

export interface OpcoesLayout {
  titulo: string;
  descricao: string;
  rotaAtiva: string;
  conteudo: SafeHtml;
}

const ICONE_LUA = raw(
  '<svg class="icone icone--lua" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" fill="currentColor"/></svg>',
);
const ICONE_SOL = raw(
  '<svg class="icone icone--sol" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4.5" fill="currentColor"/><path d="M12 1.5v2.5M12 20v2.5M1.5 12H4M20 12h2.5M4.6 4.6l1.8 1.8M17.6 17.6l1.8 1.8M4.6 19.4l1.8-1.8M17.6 6.4l1.8-1.8"/></svg>',
);

function linkNav(item: ItemNav, rotaAtiva: string, classe: string): SafeHtml {
  const ativo = item.rota === rotaAtiva;
  return html`<li><a class="${classe}" href="${item.rota}"${ativo ? raw(' aria-current="page"') : ''}>${item.rotulo}</a></li>`;
}

export function layout({ titulo, descricao, rotaAtiva, conteudo }: OpcoesLayout): SafeHtml {
  const ano = new Date().getFullYear();
  return html`<!DOCTYPE html>
<html lang="pt-BR" data-theme="light">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${titulo} — LIMS · IFPI</title>
  <meta name="description" content="${descricao}">
  <meta name="theme-color" content="#2f9e41">
  <meta name="color-scheme" content="light dark">
  <link rel="icon" href="/imagens/ifpi.png" type="image/png">
  <link rel="stylesheet" href="${comVersao('/css/app.css')}">
  <script src="${comVersao('/js/tema-inicial.js')}"></script>
  <script src="${comVersao('/js/htmx.min.js')}" defer></script>
  <script src="${comVersao('/js/app.js')}" type="module"></script>
</head>
<body class="corpo">
  <a class="skip-link" href="#conteudo">Pular para o conteúdo</a>

  <div class="faixa-gov">
    <div class="container faixa-gov__interno">
      <span>Instituto Federal de Educação, Ciência e Tecnologia do Piauí</span>
      <span class="faixa-gov__codigo" aria-hidden="true">SYS://LIMS.IFPI</span>
    </div>
  </div>

  <header class="topo" id="topo">
    <div class="container topo__interno">
      <a class="marca" href="/" aria-label="LIMS — página inicial">
        <img class="marca__img" src="/imagens/lims-logo.png" alt="" width="96" height="42">
      </a>

      <nav class="nav" aria-label="Menu principal">
        <ul class="nav__lista">
          ${NAVEGACAO.map((i) => linkNav(i, rotaAtiva, 'nav__link'))}
        </ul>
      </nav>

      <div class="topo__acoes">
        <button type="button" class="botao-icone" id="tema-toggle"
                aria-pressed="false" aria-label="Ativar tema escuro" title="Alternar tema">
          ${ICONE_LUA}${ICONE_SOL}
        </button>
        <button type="button" class="botao-icone menu-toggle" id="menu-toggle"
                aria-controls="menu-movel" aria-expanded="false" aria-label="Abrir menu">
          <span class="menu-toggle__linha"></span>
          <span class="menu-toggle__linha"></span>
          <span class="menu-toggle__linha"></span>
        </button>
        <a class="ifpi" href="https://www.ifpi.edu.br/" rel="noopener noreferrer" target="_blank" aria-label="Portal do IFPI (abre em nova aba)">
          <img class="ifpi__img" src="/imagens/ifpi.png" alt="Instituto Federal do Piauí" width="60" height="48">
        </a>
      </div>
    </div>

    <nav class="menu-movel" id="menu-movel" aria-label="Menu principal (móvel)" hidden>
      <ul class="container menu-movel__lista">
        ${NAVEGACAO.map((i) => linkNav(i, rotaAtiva, 'menu-movel__link'))}
      </ul>
    </nav>
    <div class="topo__circuito" aria-hidden="true"></div>
  </header>

  <main id="conteudo" class="principal" tabindex="-1">
    ${conteudo}
  </main>

  <footer class="rodape">
    <div class="container rodape__grade">
      <div class="rodape__bloco">
        <p class="rotulo">// LIMS</p>
        <p class="rodape__nome">Laboratory of Innovation on Multimedia Systems</p>
        <p class="rodape__texto">Laboratório de pesquisa e inovação do Instituto Federal do Piauí.</p>
      </div>
      <nav class="rodape__bloco" aria-label="Mapa do site">
        <p class="rotulo">// Navegação</p>
        <ul class="rodape__links">
          ${NAVEGACAO.map((i) => html`<li><a href="${i.rota}">${i.rotulo}</a></li>`)}
        </ul>
      </nav>
      <div class="rodape__bloco">
        <p class="rotulo">// Instituição</p>
        <ul class="rodape__links">
          <li><a href="https://www.ifpi.edu.br/" rel="noopener noreferrer" target="_blank">Portal do IFPI</a></li>
          <li><a href="https://github.com/Kaai43/Lims-Site" rel="noopener noreferrer" target="_blank">Código-fonte (MIT)</a></li>
        </ul>
      </div>
    </div>
    <div class="container rodape__base">
      <span>© ${ano} LIMS · IFPI</span>
      <span class="rodape__status" aria-hidden="true"><span class="led"></span> sistema online</span>
    </div>
  </footer>
</body>
</html>`;
}

/** Cabeçalho padrão das páginas internas. */
export function cabecalhoPagina(codigo: string, titulo: string, subtitulo: string): SafeHtml {
  return html`<section class="pagina-topo">
    <div class="container">
      <p class="rotulo">// ${codigo}</p>
      <h1 class="pagina-topo__titulo">${titulo}</h1>
      <p class="pagina-topo__sub">${subtitulo}</p>
    </div>
  </section>`;
}
