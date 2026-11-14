# Relatório — Numeração das páginas na ordem do menu — 2026-11-13

## Identificação
- Branch: main
- Função: publicar e relatar

## O que foi feito
- Corrigida a numeração dos rótulos de página, que estava fora de ordem: **Projetos**
  aparecia como `03` e **Pesquisadores** como `02`, invertendo a ordem do menu.
- Sequência final, da esquerda para a direita: Início `00`, Laboratório `01`,
  Projetos `02`, Pesquisadores `03`, Eventos `04`, Localizações `05`.
- Adicionado teste de regressão que percorre as cinco rotas internas e confere se o
  número do rótulo bate com a ordem da navegação.

## Arquivos alterados
| Arquivo | Tipo | Resumo |
| --- | --- | --- |
| `src/views/paginas/projetos.ts` | editado | rótulo passou de `03` para `02` |
| `src/views/paginas/pesquisadores.ts` | editado | rótulo passou de `02` para `03` |
| `tests/numeracao.test.ts` | novo | garante a ordem `01..05` conforme o menu |

## Dependências e dados
- Dependências novas: nenhuma.
- Dados: nada mudou.

## Verificação
- HTML das seis rotas conferido:
  `/` → `00`, `/laboratorio` → `01`, `/projetos` → `02`, `/pesquisadores` → `03`,
  `/eventos` → `04`, `/localizacoes` → `05`.
- `npm run typecheck` → exit 0.
- `npm test` → `34 pass, 0 fail`.

## Riscos e pendências
- A página inicial usa `01` e `02` como numeração **interna** de seções
  ("LINHAS DE ATUAÇÃO", "PROJETOS EM DESTAQUE"). É um contador separado do número da
  página (`00`) e foi mantido como estava.

## Próximo passo
- Nenhum.
