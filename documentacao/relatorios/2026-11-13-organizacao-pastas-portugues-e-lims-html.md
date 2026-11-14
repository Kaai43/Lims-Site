# Relatório — Organização em pastas em português e atalho `lims.html` — 2026-11-13

## Identificação
- Branch: main
- Função: publicar e relatar

## O que foi feito
- **T-1 (Pastas e arquivos em português):** reorganização completa da árvore do projeto para nomes claros em português:
  - `src/` → `codigo-fonte/` (com `servidor.ts`, `aplicacao.ts`, `configuracao.ts`, `banco.ts`, `navegador/`, `estilos/`, `utilitarios/`, `plugins/`, `rotas/`, `servicos/`, `validacoes/`, `telas/paginas/`, `telas/parciais/`).
  - `public/` → `arquivos-publicos/` (`css/`, `js/`, `imagens/`, `pdf/`).
  - `prisma/` → `banco-de-dados/` (`schema.prisma`, `popular.ts`, `migrations/`).
  - `tests/` → `testes/` (`ajuda/`, `*.test.ts`).
  - `docs/` → `documentacao/` (`planos/`, `relatorios/`).
  - `dist/` → `compilado/`.
- **T-2 (Atalho `lims.html`):** criado o arquivo `lims.html` na raiz do projeto que detecta automaticamente se o servidor Fastify está rodando em `http://localhost:3000` e redireciona na hora; caso o servidor esteja desligado, exibe um painel visual do LIMS com instrução de 1 comando (`npm run dev`) e reconexão automática. Também adicionada a rota `GET /lims.html` → `301 /` no servidor.

## Arquivos alterados
| Arquivo / Pasta | Tipo | Resumo |
| --- | --- | --- |
| `lims.html` | novo | Lançador/atalho rápido que redireciona para o site em `http://localhost:3000/` |
| `codigo-fonte/**` | renomeado / editado | Todo o código TypeScript do servidor e do navegador organizado em português |
| `arquivos-publicos/**` | renomeado | Assets estáticos servidos pelo Fastify |
| `banco-de-dados/**` | renomeado / editado | Schema Prisma, migrations e script `popular.ts` |
| `testes/**` | renomeado / editado | Suíte de 33 testes adaptada para os novos caminhos + teste de `/lims.html` |
| `documentacao/**` | renomeado / novo | Planos e relatórios de entrega |
| `package.json`, `tsconfig*.json`, `prisma.config.ts`, `render.yaml`, `.gitignore`, `README.md` | editado | Scripts e caminhos ajustados para a estrutura em português |

## Dependências e dados
- Dependências novas: nenhuma.
- Migrations/schema: `output` do generator atualizado para `../codigo-fonte/gerado/prisma` e `prisma.config.ts` apontando para `banco-de-dados/`.

## Verificação
- `npx prisma validate` → schema válido em `banco-de-dados/schema.prisma`.
- `npx prisma migrate deploy` + `npm run db:seed` → migrations e seed aplicados em `banco-de-dados/dev.db`.
- `npm run build` → `compilado/` e `arquivos-publicos/` gerados sem erros.
- `npm run typecheck` → `0` erros.
- `npm test` → `33 pass, 0 fail`.

## Riscos e pendências
- Como o site agora é uma aplicação Node.js com banco SQLite, o `lims.html` redireciona automaticamente assim que `npm run dev` (ou `npm start`) estiver ativo na máquina.

## Próximo passo
- Clicar duas vezes em `lims.html` com `npm run dev` rodando para testar o redirecionamento imediato.
