import { test } from 'node:test';
import assert from 'node:assert/strict';
import { html, raw, renderizar } from '../codigo-fonte/telas/html.js';
import { layout } from '../codigo-fonte/telas/layout.js';

test('html`` escapa todo valor interpolado', () => {
  const ataque = `<script>alert("x")</script>' & \``;
  const saida = renderizar(html`<p>${ataque}</p>`);
  assert.equal(
    saida,
    '<p>&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;&#39; &amp; &#96;</p>',
  );
});

test('html`` escapa valores dentro de atributos', () => {
  const saida = renderizar(html`<a href="${'" onmouseover="x'}">ok</a>`);
  assert.equal(saida, '<a href="&quot; onmouseover=&quot;x">ok</a>');
});

test('fragmentos html`` aninhados não são escapados duas vezes', () => {
  const item = (t: string) => html`<li>${t}</li>`;
  const saida = renderizar(html`<ul>${['a<b', 'c'].map(item)}</ul>`);
  assert.equal(saida, '<ul><li>a&lt;b</li><li>c</li></ul>');
});

test('raw() é a única forma de injetar HTML sem escape', () => {
  assert.equal(renderizar(html`${raw('<b>ok</b>')}`), '<b>ok</b>');
});

test('null, undefined e false não aparecem na saída', () => {
  assert.equal(renderizar(html`[${null}${undefined}${false}]`), '[]');
});

test('layout marca a rota ativa, define idioma e não tem script inline', () => {
  const pagina = renderizar(
    layout({
      titulo: 'Projetos',
      descricao: 'Projetos do LIMS',
      rotaAtiva: '/projetos',
      conteudo: html`<h1>Projetos</h1>`,
    }),
  );
  assert.match(pagina, /<html lang="pt-BR"/);
  assert.match(pagina, /<a[^>]*href="\/projetos"[^>]*aria-current="page"/);
  assert.match(pagina, /class="skip-link"/);
  assert.match(pagina, /<title>Projetos — LIMS · IFPI<\/title>/);
  assert.match(pagina, /src="\/imagens\/ifpi\.png"/);
  assert.doesNotMatch(pagina, /ifpi-branco\.png/);
  // CSP proíbe script inline: todo <script> precisa de src.
  for (const tag of pagina.match(/<script[^>]*>/g) ?? []) {
    assert.match(tag, /src="\/js\//);
  }
});

test('layout escapa o título vindo de dados', () => {
  const pagina = renderizar(
    layout({ titulo: '<x>', descricao: 'd', rotaAtiva: '/', conteudo: html`` }),
  );
  assert.match(pagina, /<title>&lt;x&gt; — LIMS · IFPI<\/title>/);
});

test('esqueleto Trocar de Cores valida as 3 paletas escuras (verde, preto, azul)', async () => {
  const { PALETAS_ESCURAS, PALETA_ESCURA_PADRAO, ehPaletaEscuraValida } = await import(
    '../codigo-fonte/navegador/paleta-escura.js'
  );
  assert.deepEqual(PALETAS_ESCURAS, ['verde', 'preto', 'azul']);
  assert.equal(PALETA_ESCURA_PADRAO, 'verde');
  assert.equal(ehPaletaEscuraValida('verde'), true);
  assert.equal(ehPaletaEscuraValida('preto'), true);
  assert.equal(ehPaletaEscuraValida('azul'), true);
  assert.equal(ehPaletaEscuraValida('roxo'), false);
});
