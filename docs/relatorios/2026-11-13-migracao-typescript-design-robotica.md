# Relatório — Migração para TypeScript + Fastify, design IFPI/robótica e esqueleto de segurança — 2026-11-13

## Identificação
- Branch: main · Commits: `0841096` (aplicação, banco, rotas, estilos, testes) + commit deste relatório
- Função: publicar e relatar

## O que foi feito
- **T-1 (Scaffold TypeScript):** configuração `strict` em `tsconfig.json`, `tsconfig.build.json` e `tsconfig.client.json`; scripts de build, dev, test, typecheck e banco em `package.json`; `.env.example` e `.gitignore` endurecido.
- **T-2 (Esqueleto de segurança):** plugin `src/plugins/seguranca.ts` com `@fastify/helmet` (CSP `default-src 'self'`, `script-src 'self'`, `frame-ancestors 'none'`, `object-src 'none'`, `nosniff`, `Referrer-Policy`, HSTS em produção), `@fastify/rate-limit`, `@fastify/cookie` + `@fastify/csrf-protection`, bloqueio de métodos não-GET/HEAD (`405`), `bodyLimit` de 16 KB (`413`) e handlers de erro `400`/`404`/`500` sem exposição de stack trace.
- **T-3 (Escape de saída e layout):** tagged template `html` em `src/views/html.ts` com escape automático de `& < > " ' \`` e `raw()` explícito; layout institucional responsivo em `src/views/layout.ts` com skip-link, navegação desktop/móvel acessível e alternância de tema sem script inline.
- **T-4 (Design system Tailwind v4 + JS cliente):** identidade visual verde IFPI + grafite com grid técnico de circuito, tipografia mono nos títulos/rótulos, suporte a tema claro/escuro persistido (`localStorage["lims-theme"]`) e configuração HTMX endurecida (`selfRequestsOnly = true`, `allowEval = false`, `allowScriptTags = false`).
- **T-5 (Banco SQLite + Prisma 7):** `prisma/schema.prisma`, `prisma.config.ts`, migration `20261113215723_inicial`, seed idempotente (`prisma/seed.ts`) com os dados públicos de pesquisadores, projetos e eventos, e camada `src/services/conteudo.ts` exclusivamente com queries parametrizadas.
- **T-6 a T-11 (Todas as 6 páginas + redirecionamentos + HTMX):** rotas `/`, `/laboratorio`, `/pesquisadores`, `/projetos` (filtro por categoria com partial HTMX e fallback GET), `/eventos` (filtro próximos/realizados com partial HTMX), `/localizacoes`, `/saude`, `/robots.txt`, `/.well-known/security.txt` e redirecionamentos `301` para `/index.html` e `/paginas/:nome.html` via allowlist fixa.
- **T-12 (Limpeza do legado e deploy Render):** remoção de `index.html`, `paginas/`, `css/`, `js/`, `.nojekyll`, movimentação dos assets para `public/`, criação do `render.yaml` e atualização do `README.md`.

## Arquivos alterados
| Arquivo | Tipo | Resumo |
| --- | --- | --- |
| `package.json` / `package-lock.json` | novo | Dependências com versões exatas e scripts de build/test/db |
| `tsconfig.json` / `tsconfig.build.json` / `tsconfig.client.json` | novo | Configuração TypeScript `strict` para servidor, testes e cliente |
| `.gitignore` / `.env.example` | editado / novo | Proteção contra commit de `.env`, `*.db`, `dist/` e artefatos gerados |
| `prisma/schema.prisma` / `prisma.config.ts` | novo | Modelos `Pesquisador`, `Projeto` e `Evento` no Prisma 7 (SQLite) |
| `prisma/migrations/20261113215723_inicial/migration.sql` | novo | Migration SQL inicial das três tabelas e índices |
| `prisma/seed.ts` | novo | Seed idempotente (`upsert` por `slug`) com dados públicos do LIMS |
| `src/config.ts` / `src/db.ts` / `src/app.ts` / `src/server.ts` | novo | Bootstrap Fastify, leitura validada de ambiente e injeção do Prisma |
| `src/plugins/seguranca.ts` / `prisma.ts` / `estaticos.ts` | novo | Helmet/CSP, rate-limit, CSRF, erros sem vazamento e arquivos estáticos |
| `src/views/html.ts` / `src/views/layout.ts` | novo | Motor de template com escape automático e layout base responsivo |
| `src/views/paginas/*.ts` / `src/views/parciais/*.ts` | novo | Views das 6 páginas, página de erro e parciais HTMX |
| `src/routes/index.ts` / `src/schemas/filtros.ts` / `src/services/conteudo.ts` | novo | Rotas HTTP, validação Zod na borda e consultas ao banco |
| `src/styles/app.css` / `src/client/app.ts` / `src/client/tema-inicial.ts` | novo | Design system Tailwind v4 (IFPI + robótica) e scripts do navegador |
| `public/imagens/**` / `public/pdf/your-student-space.pdf` | movido | Imagens institucionais, fotos de docentes e PDF de projeto |
| `tests/*.test.ts` / `tests/ajuda/banco.ts` | novo | 30 testes automatizados (segurança, escape XSS, banco e rotas) |
| `render.yaml` / `README.md` | novo / editado | Blueprint de deploy para o Render e documentação de uso e arquitetura |
| `index.html`, `paginas/*`, `css/*`, `js/*`, `.nojekyll` | removido | Protótipo estático substituído pelas rotas equivalentes |

## Dependências e dados
- Dependências novas (produção):
  - `fastify@5.12.8`, `@fastify/helmet@13.2.0`, `@fastify/csrf-protection@8.0.2`, `@fastify/cookie@11.1.5`, `@fastify/rate-limit@11.2.2`, `@fastify/static@10.1.11` — servidor HTTP e camadas de segurança.
  - `@prisma/client@7.10.1`, `@prisma/adapter-better-sqlite3@7.10.1` — acesso parametrizado ao SQLite no Prisma 7.
  - `zod@4.6.7` — validação de variáveis de ambiente e parâmetros de requisição.
- Dependências novas (desenvolvimento):
  - `prisma@7.10.1`, `typescript@5.9.3`, `tsx@4.23.15`, `@types/node@24.19.2`, `tailwindcss@4.3.5`, `@tailwindcss/cli@4.3.5`, `htmx.org@2.0.11`.
- Migrations/schema: criada migration `20261113215723_inicial` com as tabelas `Pesquisador`, `Projeto` e `Evento`.

## Verificação
- `npm run typecheck` → saída limpa (`exit code 0` nos dois `tsconfig`).
- `npx prisma validate` → `The schema at prisma\schema.prisma is valid 🚀`.
- `npm run db:seed` (executado 2x seguidas) → idempotente, sem erro e sem duplicação.
- `npm test` → `30 pass, 0 fail` (cobrindo CSP, HSTS, rate-limit `429`, `400` Zod, `404`, `405`, `413`, `403` CSRF, `500` sem vazamento, escape XSS em HTML/atributos/banco, filtros HTMX e redirecionamentos `301`).
- `npm run build` + probe HTTP real em `dist/server.js` → `/saude`, `/`, `/laboratorio`, `/pesquisadores`, `/projetos`, `/eventos`, `/localizacoes`, `/css/app.css`, `/js/app.js` e `/js/htmx.min.js` responderam `200`.
- `npm audit --omit=dev` → `found 0 vulnerabilities`.

## Riscos e pendências
- No plano gratuito do Render o disco é efêmero e o serviço hiberna após períodos sem acesso (~30s na primeira requisição); como o site é somente leitura, o banco SQLite é recriado no build (`prisma migrate deploy && npm run db:seed`).
- Caso o domínio principal passe a apontar para o Render, desativar o GitHub Pages nas configurações do repositório para evitar servir versão antiga em paralelo.

## Próximo passo
- Conectar o repositório ao Render usando o Blueprint `render.yaml` na raiz do projeto.
