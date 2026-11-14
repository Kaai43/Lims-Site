# Relatório — Enquadramento 3:4 das fotos dos pesquisadores — 2026-11-13

## Identificação
- Branch: main
- Função: publicar e relatar

## O que foi feito
- Padronizado o enquadramento das fotos em retrato **3:4**, para os três cartões
  alinharem mesmo com proporções diferentes de origem (0,75 / 0,87 / 1,06).
- `object-fit: cover` com `object-position: center 30%`: o recorte acontece nas
  laterais, e a faixa vertical priorizada é a de cima, onde estão os rostos.
- Nenhum arquivo de imagem foi alterado — a mudança é só de apresentação.

## Arquivos alterados
| Arquivo | Tipo | Resumo |
| --- | --- | --- |
| `src/styles/app.css` | editado | foto em `aspect-ratio: 3 / 4` com `cover` e foco em 30% |
| `src/views/paginas/pesquisadores.ts` | editado | atributos `width`/`height` ajustados para 300×400 |

## Dependências e dados
- Dependências novas: nenhuma.
- Imagens: nenhuma alterada.

## Verificação
- `npm run typecheck` → exit 0.
- `npm test` → `33 pass, 0 fail`.
- `/pesquisadores` → 3 cartões com altura de foto idêntica, rostos centralizados e
  nenhuma cabeça cortada (conferido em captura de navegador real).

## Riscos e pendências
- O recorte lateral é intencional: sem ele, as faixas livres voltariam a aparecer.
  Se algum dia entrar uma foto muito alta (proporção menor que 0,75), o
  `object-position` em 30% já preserva o topo da cabeça.
- O logo do IFPI continua a 40 px de altura no cabeçalho, com o texto pequeno.

## Próximo passo
- Conferir no Render quando o serviço estiver conectado.
