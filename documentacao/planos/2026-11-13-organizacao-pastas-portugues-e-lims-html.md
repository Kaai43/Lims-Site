# Plano — Organização em pastas em português e atalho `lims.html`

> Função 1 (Planejar) → Função 2 (Desenvolver) → Função 3 (Publicar e relatar) executadas em sequência.

## Objetivo
1. Organizar todo o projeto em pastas com **nomes em português e fácil identificação** (`codigo-fonte/`, `arquivos-publicos/`, `banco-de-dados/`, `testes/`, `documentacao/`), com subpastas autoexplicativas (`rotas/`, `telas/`, `servicos/`, `validacoes/`, `navegador/`, `estilos/`, `utilitarios/`, `plugins/`).
2. Criar o arquivo **`lims.html`** na raiz do projeto (e espelhá-lo no servidor em `GET /lims.html` → `301 /`) para que, ao clicar duas vezes nele no computador, o usuário seja levado automaticamente ao site rodando (`http://localhost:3000/`) — ou veja na mesma tela a instrução rápida de 1 comando caso o servidor ainda não esteja ligado.

## Critérios de aceite
- [x] Pastas da raiz organizadas em português:
  - `codigo-fonte/` (com `navegador/`, `estilos/`, `utilitarios/`, `plugins/`, `rotas/`, `validacoes/`, `servicos/`, `telas/paginas/`, `telas/parciais/`, `servidor.ts`, `aplicacao.ts`, `configuracao.ts`, `banco.ts`)
  - `arquivos-publicos/` (com `css/`, `js/`, `imagens/`, `pdf/`)
  - `banco-de-dados/` (com `schema.prisma`, `popular.ts`, `migrations/`)
  - `testes/` (com `ajuda/` e todos os `*.test.ts`)
  - `documentacao/` (com `planos/` e `relatorios/`)
- [x] `lims.html` na raiz do projeto: ao abrir com duplo clique (`file://`), verifica se o servidor local (`http://localhost:3000`) está ativo e redireciona automaticamente; se o servidor estiver desligado, mostra um painel visual do LIMS com botão de abrir e o comando `npm run dev`.
- [x] Rota `GET /lims.html` no servidor redireciona com `301` para `/`.
- [x] `npm run typecheck`, `npm run build` e `npm test` passam 100% sem erros na nova estrutura.
- [x] Commit e `git push origin main` concluídos com relatório em `documentacao/relatorios/`.

## Tarefas

### T-1 — Reorganizar pastas para português e atualizar configurações
- **Arquivos:** `package.json`, `tsconfig.json`, `tsconfig.build.json`, `tsconfig.client.json`, `prisma.config.ts`, `render.yaml`, `.gitignore`, `.env.example`, `README.md` + movimentação das pastas.
- **O que fazer:** mover `src/` → `codigo-fonte/`, `public/` → `arquivos-publicos/`, `prisma/` → `banco-de-dados/`, `tests/` → `testes/`, `docs/` → `documentacao/` e renomear as subpastas internas de `codigo-fonte/` para português.

### T-2 — Criar o atalho inteligente `lims.html` e rota `/lims.html`
- **Arquivos:** `lims.html` (raiz), `codigo-fonte/rotas/index.ts`, `testes/rotas.test.ts`.
- **O que fazer:** criar `lims.html` autocontido que faz probe em `http://localhost:3000/saude` (via `Image`/`fetch` compatível com `file://`) e redireciona imediatamente para `http://localhost:3000/`, além de oferecer botão direto e instrução caso o servidor Node não esteja aberto; adicionar `/lims.html` → `301 /` nas rotas legadas.

## Riscos
- Caminhos relativos em `estaticos.ts` e `versao-assets.ts` usam `path.resolve` até a pasta de arquivos públicos → atualizar para `'arquivos-publicos'` e cobrir com os testes existentes.

## Ordem
T-1 → T-2
