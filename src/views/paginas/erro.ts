import { html, type SafeHtml } from '../html.js';
import { layout } from '../layout.js';

const MENSAGENS: Record<number, { titulo: string; texto: string }> = {
  400: { titulo: 'Requisição inválida', texto: 'Os parâmetros enviados não são válidos.' },
  403: { titulo: 'Acesso negado', texto: 'Esta ação não é permitida.' },
  404: { titulo: 'Página não encontrada', texto: 'O endereço acessado não existe ou foi movido.' },
  405: { titulo: 'Método não permitido', texto: 'Este site aceita apenas consultas (GET).' },
  413: { titulo: 'Conteúdo muito grande', texto: 'O corpo da requisição excede o limite permitido.' },
  429: { titulo: 'Muitas requisições', texto: 'Aguarde alguns instantes e tente novamente.' },
  500: { titulo: 'Erro interno', texto: 'Algo deu errado do nosso lado. Tente novamente mais tarde.' },
};

/** Página de erro genérica: nunca recebe mensagem/stack do erro original. */
export function paginaErro(status: number): SafeHtml {
  const m = MENSAGENS[status] ?? (status >= 500 ? MENSAGENS[500]! : MENSAGENS[400]!);
  return layout({
    titulo: m.titulo,
    descricao: m.texto,
    rotaAtiva: '',
    conteudo: html`<section class="secao erro">
      <div class="container erro__interno">
        <p class="erro__codigo" aria-hidden="true">ERR_${status}</p>
        <h1 class="erro__titulo">${m.titulo}</h1>
        <p class="erro__texto">${m.texto}</p>
        <a class="btn btn--primario" href="/">Voltar ao início</a>
      </div>
    </section>`,
  });
}
