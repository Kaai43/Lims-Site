# Relatório — Preparação do deploy no Render — 2026-11-13

## Identificação
- Branch: main
- Função: publicar e relatar

## O que foi feito
- Validado o build de produção ponta a ponta com banco novo (`render-sim.db`).
- Corrigido `render.yaml`: `npm ci --include=dev` e `NODE_VERSION=24`.

## Arquivos alterados
| Arquivo | Tipo | Resumo |
| --- | --- | --- |
| `render.yaml` | editado | build instala devDependencies e fixa Node 24 |
| `docs/relatorios/2026-11-13-configuracao-deploy-render.md` | novo | este relatório |

## Dependências e dados
- Dependências novas: nenhuma.
- Migrations/schema: nada mudou; `prisma migrate deploy` aplica `20261113215723_inicial`.

## Verificação
- `npx prisma migrate deploy` em banco vazio → `All migrations have been successfully applied`.
- `npm run db:seed` → concluiu sem erro.
- `npm run build` → `prisma generate` + `tsc` (servidor e cliente) + Tailwind + cópia do HTMX, sem erro.
- `node dist/server.js` com `NODE_ENV=production`: `/saude`, `/`, `/pesquisadores`, `/projetos?categoria=robotica` e `/eventos` → `200`, com `Content-Security-Policy` e `Strict-Transport-Security` presentes.
- `npm test` → `30 pass, 0 fail`.

## Riscos e pendências
- **GitHub Pages não serve esta aplicação.** A migração removeu os arquivos estáticos; as páginas são renderizadas pelo Fastify a partir do SQLite. O Pages responde `404` na API do repositório (não está ativado) e, ainda que fosse ativado, não passaria de `404` na raiz.
- No plano free do Render o disco é efêmero: o banco é recriado e semeado a cada build. O site é somente leitura, então isso não perde dado de usuário.
- O serviço hiberna após ociosidade; a primeira requisição pode levar ~30 s.

## Próximo passo
- Conectar o repositório ao Render via Blueprint `render.yaml`.
