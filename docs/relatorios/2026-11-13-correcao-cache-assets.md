# Relatório — Versionamento de assets para corrigir cache do navegador — 2026-11-13

## Identificação
- Branch: main
- Função: publicar e relatar

## O que foi feito
- Diagnosticado que o reenquadramento das fotos não aparecia no navegador do usuário
  por **cache**, não por falta de build: `/css/app.css` era servido com
  `Cache-Control: public, max-age=604800` (7 dias) e a URL nunca mudava.
- Criado `src/lib/versao-assets.ts`, que anexa `?v=<hash do conteúdo>` aos caminhos
  servidos de `public/`.
- `layout.ts` passou a usar URLs versionadas para `/css/app.css`,
  `/js/tema-inicial.js`, `/js/htmx.min.js` e `/js/app.js`.

## Arquivos alterados
| Arquivo | Tipo | Resumo |
| --- | --- | --- |
| `src/lib/versao-assets.ts` | novo | função `comVersao()` com hash SHA-256 curto e cache em memória |
| `src/views/layout.ts` | editado | links de CSS/JS passam por `comVersao()` |

## Dependências e dados
- Dependências novas: nenhuma (usa `node:crypto` e `node:fs`).
- Dados: nada mudou.

## Verificação
- Build e servidor reiniciados; HTML passou a emitir:
  `/css/app.css?v=0ee0642023`, `/js/app.js?v=52536d790d`, entre outros.
- Requisição à URL versionada → `200`, e o CSS servido contém `aspect-ratio:3/4` e
  `object-fit:cover` do enquadramento novo.
- `npm run typecheck` → exit 0.
- `npm test` → `33 pass, 0 fail`.

## Riscos e pendências
- O navegador que ainda tem o HTML antigo em memória precisa de **um** recarregamento
  forçado (`Ctrl+F5`). Depois disso, cada mudança de CSS/JS gera URL nova e o
  problema não volta.
- O cache de 7 dias foi mantido: com URL versionada ele passa a ser seguro e
  acelera o carregamento.

## Próximo passo
- Recarregar com `Ctrl+F5` e conferir o enquadramento 3:4 das fotos.
