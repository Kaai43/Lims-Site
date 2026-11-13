# Plano — Migração para TypeScript + Fastify, novo design IFPI/robótica e esqueleto de segurança

> Função 1 (Planejar). Executar com `lims-builder`, **uma tarefa por sessão**, na ordem do fim do arquivo.
> Publicação com `lims-shipper` ao fim de cada tarefa (ou de um grupo aprovado).

## Objetivo
Trocar o site estático (`index.html`, `paginas/`, `css/`, `js/`) por uma aplicação
TypeScript (Fastify + Prisma/SQLite + HTMX + Tailwind v4), responsiva de verdade
(mobile-first, 320px → 1440px+), com identidade **IFPI institucional + robótica**
em **todas as 6 páginas**, e um **esqueleto de defesa** (Helmet/CSP, rate limit,
validação Zod, escape de saída, CSRF pronto, erros sem vazamento).

## Decisões tomadas (com o usuário em 2026-11-13)
- **Deploy:** Render (plano gratuito). O disco do free tier é efêmero → o SQLite é
  **gerado no build** (`prisma migrate deploy` + `seed`). Isso só funciona porque o
  site é **somente leitura**.
- **Sem painel admin e sem login.** Banco serve para servir conteúdo de divulgação com
  segurança (consulta parametrizada, sem HTML editável). Nenhuma rota de escrita.
- **Visual:** verde institucional IFPI + grafite/escuro, grid técnico/trilhas de
  circuito como detalhe, títulos em fonte mono. Tema claro/escuro mantido.
- **Templates:** sem engine externa. Tagged template `html\`\`` próprio com escape por
  padrão (menos dependência, testável, tipado).

## Critérios de aceite
- [x] `npm run dev` sobe em `http://localhost:3000` e as rotas `/`, `/laboratorio`,
      `/pesquisadores`, `/projetos`, `/eventos`, `/localizacoes` respondem 200.
- [x] URLs antigas `/index.html` e `/paginas/<nome>.html` respondem **301** para a rota nova.
- [x] Layout sem rolagem horizontal em 320, 375, 768, 1024 e 1440 px; menu vira
      hambúrguer acessível (`aria-expanded`, foco, `Esc` fecha) abaixo de 768 px.
- [x] Pesquisadores, projetos e eventos vêm do SQLite via Prisma (seed com o conteúdo
      público atual do site). Filtro de projetos funciona via HTMX e **sem JS** (fallback GET).
- [x] Toda resposta tem CSP `default-src 'self'`, `X-Content-Type-Options: nosniff`,
      `Referrer-Policy`, `frame-ancestors 'none'`; nenhum script/estilo de CDN.
- [x] Rate limit ativo (429 após o limite); query/params inválidos → 400 sem stack trace;
      rota inexistente → 404 com página própria; erro interno → 500 genérico.
- [x] Entrada `<script>alert(1)</script>` em qualquer parâmetro aparece escapada no HTML.
- [x] `npx tsc --noEmit` sem erro · `npm test` verde · `npx prisma validate` ok ·
      `npm audit --omit=dev` sem high/critical.
- [x] Contraste AA, foco visível, `alt` em todas as imagens, `lang="pt-BR"`, skip-link.
- [x] Pastas antigas removidas só depois de todas as rotas equivalentes existirem (T-12).

## Dependências aprovadas (pinar versão exata, conferir com `npm view <pkg> version`)
| Pacote | Tipo | Versão / regra | Motivo |
| --- | --- | --- | --- |
| `fastify` | prod | 5.12.8 | servidor |
| `@fastify/helmet` | prod | 13.2.0 | cabeçalhos/CSP |
| `@fastify/csrf-protection` | prod | 8.0.2 | esqueleto CSRF p/ futuro POST |
| `@fastify/cookie` | prod | última 11.x | exigido pelo csrf-protection |
| `@fastify/rate-limit` | prod | última 10.x | anti-brute-force/DoS leve |
| `@fastify/static` | prod | última 8.x | servir `public/` |
| `@prisma/client` | prod | 7.10.1 | ORM |
| `@prisma/adapter-better-sqlite3` | prod | **mesma 7.x do client** | Prisma 7 exige driver adapter p/ SQLite |
| `zod` | prod | 4.6.7 | validação na borda |
| `prisma` | dev | **7.10.1** (não usar `latest`, que é 8.0.0-rc) | CLI/migrations |
| `typescript` | dev | última 5.x estável | compilador |
| `@types/node` | dev | casar com Node do Render (fixar `engines.node`) | tipos |
| `tsx` | dev | última 4.x | `dev` com watch e `node --test` em `.ts` |
| `tailwindcss` + `@tailwindcss/cli` | dev | 4.3.5 (mesma nos dois) | CSS |
| `htmx.org` | dev | 2.0.11 | copiado para `public/js/htmx.min.js` (vendorizado) |

Qualquer pacote fora desta tabela = **parar e pedir aprovação**.

## Contratos

### Rotas (todas GET, todas devolvem HTML; nenhuma rota de escrita)
| Rota | Entrada (validada com Zod) | Saída |
| --- | --- | --- |
| `GET /` | — | página inicial completa |
| `GET /laboratorio` | — | página |
| `GET /pesquisadores` | — | página com cards do banco (ordenado por `ordem`) |
| `GET /projetos` | query `categoria?`: string 1–40, `[a-z0-9-]` | com header `HX-Request: true` → **partial** só da lista; sem ele → página completa. Categoria inválida → 400 |
| `GET /eventos` | query `periodo?`: `proximos` \| `anteriores` (padrão `proximos`) | idem projetos (partial com HTMX) |
| `GET /localizacoes` | — | página (mapa como link/imagem estática; iframe só se CSP `frame-src` for liberado no plano futuro) |
| `GET /index.html`, `GET /paginas/:nome.html` | `nome` ∈ lista fixa | 301 → rota nova; fora da lista → 404 |
| `GET /saude` | — | `200 {"status":"ok"}` (health check do Render) |
| `GET /robots.txt`, `GET /.well-known/security.txt` | — | texto estático |
| qualquer outra | — | 404 HTML próprio |

### Schema (`prisma/schema.prisma`, provider `sqlite`)
```prisma
model Pesquisador {
  id         Int     @id @default(autoincrement())
  slug       String  @unique
  nome       String
  titulacao  String
  area       String
  bio        String
  fotoUrl    String?
  lattesUrl  String?
  ordem      Int     @default(0)
}

model Projeto {
  id         Int     @id @default(autoincrement())
  slug       String  @unique
  titulo     String
  resumo     String
  categoria  String          // slug kebab-case, usado no filtro
  status     String          // "em-andamento" | "concluido"
  anoInicio  Int
  imagemUrl  String?
  ordem      Int     @default(0)
  @@index([categoria])
}

model Evento {
  id         Int      @id @default(autoincrement())
  slug       String   @unique
  titulo     String
  descricao  String
  data       DateTime
  local      String
  linkUrl    String?
  @@index([data])
}
```
Se o HTML atual tiver um campo que não cabe aqui, adicionar como **opcional** e
registrar no relatório. Nada de campo com dado pessoal além do que já é público no site.

## Estrutura-alvo
```
src/server.ts            # cria e exporta buildApp(); listen só se executado direto
src/config.ts            # lê env com Zod (PORT, HOST, NODE_ENV, DATABASE_URL, RATE_LIMIT_MAX)
src/plugins/seguranca.ts # helmet+CSP, rate-limit, cookie+csrf, bodyLimit, error/404 handlers
src/plugins/prisma.ts    # 1 PrismaClient por processo, decorate + onClose
src/plugins/estaticos.ts # @fastify/static em /public com cache
src/views/html.ts        # tag html`` com escape + raw() explícito
src/views/layout.ts      # <head>, header/nav responsivo, footer, skip-link
src/views/paginas/*.ts   # uma view por página
src/views/parciais/*.ts  # listas para HTMX
src/routes/*.ts          # uma rota por arquivo
src/services/*.ts        # consultas Prisma, sem HTTP
src/schemas/*.ts         # Zod de query/params
src/styles/app.css       # entrada Tailwind v4 (@theme)
public/{css,js,imagens}/
prisma/{schema.prisma,seed.ts,migrations/}
prisma.config.ts
tests/*.test.ts
render.yaml
```

## Tarefas

### T-1 — Scaffold TypeScript
- **Arquivos (criar/editar):** `package.json`, `package-lock.json`, `tsconfig.json`, `.gitignore`, `.env.example` · (ler) este plano.
- **O que fazer:** `npm init`, instalar a tabela de dependências com versão exata
  (`--save-exact`). `tsconfig`: `strict`, `module`/`moduleResolution` `NodeNext`,
  `target` ES2023, `noUncheckedIndexedAccess`, `outDir dist`. `"type": "module"`,
  `engines.node`. Scripts: `dev` (tsx watch + tailwind --watch), `build`
  (`prisma generate && tsc && tailwind --minify && copiar htmx`), `start`
  (`node dist/server.js`), `test` (`node --import tsx --test tests/**/*.test.ts`),
  `typecheck`, `db:migrate`, `db:seed`. `.gitignore`: `node_modules/`, `dist/`,
  `.env`, `*.db`, `*.db-journal`, `src/generated/`, `public/css/app.css`.
  `.env.example` só com chaves e valores fictícios.
- **Verificação:** `npx tsc --noEmit` → sem erro (com um `src/server.ts` vazio exportando `{}`); `npm ls --depth=0` → versões batem com a tabela.
- **Fora de escopo:** qualquer rota, CSS ou schema.

### T-2 — Esqueleto de segurança (o "anti-ataque")
- **Arquivos:** `src/config.ts`, `src/server.ts`, `src/plugins/seguranca.ts`, `tests/seguranca.test.ts`.
- **O que fazer:** `buildApp()` com `bodyLimit: 16384`, `trustProxy: true` (Render),
  logger sem `req.body` e com `redact` de `headers.cookie`/`authorization`.
  `seguranca.ts`: helmet com CSP `default-src 'self'; script-src 'self'; style-src 'self';
  img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-ancestors 'none';
  form-action 'self'; base-uri 'self'; object-src 'none'`, HSTS só em produção;
  rate-limit global (padrão 100 req/min por IP, via env); cookie + csrf registrados
  (sem rota usando ainda — documentar no código como usar em futuro POST);
  `setErrorHandler`: ZodError → 400, demais → 500 com mensagem genérica (stack só em log);
  `setNotFoundHandler` → 404; bloquear métodos ≠ GET/HEAD com 405.
  Rota `GET /saude`.
- **Testes primeiro (`app.inject`):** cabeçalhos CSP/nosniff/referrer presentes;
  101ª requisição → 429; rota inexistente → 404 sem stack; erro forçado → 500 sem
  stack no corpo; `POST /` → 405; corpo > 16 KB → 413.
- **Verificação:** `npm test` → todos verdes (e falhavam antes); `npx tsc --noEmit` ok.
- **Fora de escopo:** views, Prisma, CSS.

### T-3 — Escape de saída e layout base
- **Arquivos:** `src/views/html.ts`, `src/views/layout.ts`, `tests/html.test.ts`.
- **O que fazer:** `html` tagged template que escapa `& < > " ' \``  em todo valor
  interpolado; arrays são unidos; `raw()` é o único jeito de injetar HTML confiável
  (tipo branded `SafeHtml`). `layout({ titulo, descricao, rotaAtiva, conteudo })` com
  `lang="pt-BR"`, meta viewport, skip-link, header com logos IFPI/LIMS (troca por tema),
  nav com `aria-current`, botão hambúrguer, botão de tema, footer institucional.
  `<script src="/js/htmx.min.js" defer>` e `/js/app.js` — nenhum script inline (CSP).
- **Testes primeiro:** `html\`${'<script>'}\`` → `&lt;script&gt;`; `raw` não escapa;
  layout marca `aria-current="page"` na rota ativa.
- **Verificação:** `npm test`, `npx tsc --noEmit`.
- **Fora de escopo:** conteúdo das páginas, CSS.

### T-4 — Design system Tailwind v4 (IFPI + robótica) e JS do cliente
- **Arquivos:** `src/styles/app.css`, `src/client/app.ts` (compila para `public/js/app.js`), `public/js/htmx.min.js` (copiado), `public/fonts/*` (se usar fonte local), `css/styles.css` (só ler, para extrair cores/variáveis atuais).
- **Skills:** `tailwind-patterns` (primária), `wcag-audit-patterns` para contraste.
- **O que fazer:** `@theme` com tokens: verde IFPI (`#2F9E41` como base, conferir com a
  logo), vermelho IFPI de acento (`#CD191E`) usado com parcimônia, escala grafite,
  fonte sans para texto e mono para títulos/rótulos (local, sem Google Fonts por CSP).
  Tema por `[data-theme]` + `localStorage["lims-theme"]`, respeitando
  `prefers-color-scheme`. Elementos "robótica": fundo com grid técnico em CSS
  (gradientes), cantos chanfrados em cards, linhas de circuito decorativas em SVG
  `aria-hidden`, rótulos estilo `// 01 — PESQUISA`. Animações só com
  `prefers-reduced-motion: no-preference`. Componentes: `.btn`, `.card`,
  `.tag`, `.secao`, `.hero`, grid responsivo. `app.ts`: menu (aria-expanded, Esc, foco),
  tema, `htmx.config.selfRequestsOnly = true`, `allowEval = false`, `allowScriptTags = false`.
- **Verificação:** `npm run build` gera `public/css/app.css` e `public/js/app.js`;
  `npx tsc --noEmit`; contraste AA dos pares texto/fundo nos dois temas (anotar valores no relatório).
- **Fora de escopo:** conteúdo das páginas.

### T-5 — Banco: schema, migration, seed e plugin Prisma
- **Arquivos:** `prisma/schema.prisma`, `prisma.config.ts`, `prisma/seed.ts`, `prisma/migrations/*`, `src/plugins/prisma.ts`, `src/services/{pesquisadores,projetos,eventos}.ts`, `tests/services.test.ts` · (ler) `paginas/pesquisadores.html`, `paginas/projetos.html`, `paginas/eventos.html`, `js/projetos.js`, `imagens/*.txt`.
- **Skills:** `prisma-expert`. **Conferir na doc oficial do Prisma 7** o uso de
  `prisma.config.ts`, generator `prisma-client` com `output` e o adapter SQLite — não usar memória.
- **O que fazer:** schema do contrato acima; migration inicial; seed idempotente
  (`upsert` por `slug`) com o conteúdo **público** que já está nos HTMLs. Plugin injeta
  um único client e desconecta no `onClose`. Services só com API de query
  (proibido `$queryRawUnsafe`/`$executeRawUnsafe`).
- **Testes primeiro:** com banco de teste (`DATABASE_URL=file:./test.db`, criado e
  apagado no teste): `listarProjetos({ categoria })` filtra; `listarEventos('proximos')`
  só datas ≥ hoje; listas ordenadas por `ordem`.
- **Verificação:** `npx prisma validate`; `npm run db:migrate && npm run db:seed` duas vezes sem duplicar; `npm test`.
- **Fora de escopo:** rotas e views.

### T-6 — Página inicial `/` e redirecionamentos legados
- **Arquivos:** `src/routes/inicio.ts`, `src/routes/legado.ts`, `src/views/paginas/inicio.ts`, `src/plugins/estaticos.ts`, `tests/rotas-inicio.test.ts` · (ler) `index.html`.
- **O que fazer:** hero "LIMS — Laboratory of Innovation on Multimedia Systems · IFPI"
  com visual robótico, seções resumo (laboratório, áreas, projetos em destaque do banco,
  CTA para pesquisadores/eventos). Redirecionamentos 301 do contrato. Servir `public/`.
  Mover imagens usadas de `imagens/` para `public/imagens/` (git mv).
- **Testes primeiro:** `/` → 200 com `<h1>`; `/index.html` → 301 `Location: /`; `/paginas/projetos.html` → 301 `/projetos`; `/paginas/x.html` → 404.
- **Verificação:** `npm test`; `npm run dev` e conferir no navegador em 375 e 1440 px.

### T-7 — `/laboratorio`
- **Arquivos:** `src/routes/laboratorio.ts`, `src/views/paginas/laboratorio.ts`, `tests/rotas-laboratorio.test.ts` · (ler) `paginas/laboratorio.html`.
- **O que fazer:** migrar o conteúdo para o novo layout (texto estático na view).
- **Verificação:** teste 200 + título; navegador 320/768/1440.

### T-8 — `/pesquisadores`
- **Arquivos:** `src/routes/pesquisadores.ts`, `src/views/paginas/pesquisadores.ts`, `tests/rotas-pesquisadores.test.ts`.
- **O que fazer:** cards do banco (foto com `alt="Foto de <nome>"`, titulação, área, link Lattes com `rel="noopener noreferrer"`).
- **Testes primeiro:** 200; nome do seed aparece; pesquisador com nome malicioso inserido no teste sai escapado.

### T-9 — `/projetos` com filtro HTMX
- **Arquivos:** `src/routes/projetos.ts`, `src/schemas/projetos.ts`, `src/views/paginas/projetos.ts`, `src/views/parciais/lista-projetos.ts`, `tests/rotas-projetos.test.ts`.
- **O que fazer:** filtros como links `<a href="/projetos?categoria=x" hx-get hx-target="#lista-projetos" hx-push-url="true">` (funciona sem JS). `HX-Request` → só partial.
- **Testes primeiro:** sem header → página completa; com header → só a lista; `categoria=<script>` → 400.

### T-10 — `/eventos`
- **Arquivos:** `src/routes/eventos.ts`, `src/schemas/eventos.ts`, `src/views/paginas/eventos.ts`, `src/views/parciais/lista-eventos.ts`, `tests/rotas-eventos.test.ts` · (ler) `paginas/eventos.html`.
- **O que fazer:** abas próximos/anteriores no mesmo padrão HTMX; datas formatadas com `Intl.DateTimeFormat('pt-BR')`; `<time datetime>`.
- **Testes primeiro:** `periodo=invalido` → 400; partial com HTMX.

### T-11 — `/localizacoes`
- **Arquivos:** `src/routes/localizacoes.ts`, `src/views/paginas/localizacoes.ts`, `tests/rotas-localizacoes.test.ts` · (ler) `paginas/localizacoes.html`.
- **O que fazer:** endereço(s), horário, link "Abrir no mapa" (externo, `noopener`). Sem iframe (CSP).
- **Verificação:** teste 200; navegador.

### T-12 — Remoção do legado, deploy e documentação
- **Arquivos:** remover `index.html`, `paginas/`, `css/`, `js/`, `.nojekyll`; criar `render.yaml`, `public/robots.txt`, rota/arquivo `security.txt`; editar `README.md`.
- **Pré-condição:** T-6…T-11 concluídas e publicadas.
- **O que fazer:** `render.yaml` com build `npm ci && npm run build && npx prisma migrate deploy && npm run db:seed`, start `npm start`, `healthCheckPath: /saude`, `NODE_ENV=production`. README: como rodar, arquitetura, decisão de deploy. Avisar o usuário para **desligar o GitHub Pages** do repositório.
- **Verificação:** `npm run build && npm start` + `/saude` → 200 (mesmo comando); `npm audit --omit=dev`; `git status` sem `.db`/`.env`.

## Riscos
- Prisma 7 mudou a configuração (adapter, `prisma.config.ts`) → builder confere a doc oficial antes de T-5; se travar, reporta bloqueio em vez de cair para v6 por conta própria.
- Render free hiberna após inatividade (primeira visita lenta ~30 s) → aceitável para divulgação; registrar no README.
- SQLite efêmero no Render → ok porque o site é somente leitura; qualquer escrita futura exige novo plano (disco pago ou outro banco).
- CSP estrita pode quebrar HTMX → `allowEval=false`, nenhum `hx-on`, nada inline; testar no navegador em T-9.
- Fontes: Google Fonts violaria CSP → fonte local ou pilha do sistema.
- Python ausente → verificação visual responsiva é manual (DevTools), registrar tamanhos testados no relatório.
- Links antigos do GitHub Pages deixam de funcionar quando ele for desligado → redirecionamentos 301 só cobrem o novo host.

## Fora de escopo
Painel admin, login, formulários de contato/POST, CMS, i18n, analytics, CDN, domínio próprio, testes E2E automatizados.

## Ordem
T-1 → T-2 → T-3 → T-4 → T-5 → T-6 → (T-7, T-8, T-9, T-10, T-11 — arquivos disjuntos, podem ir em paralelo; `src/server.ts` registra rotas: **só o T-6 edita** e deixa um carregador próprio que importa todo `src/routes/*.ts` via `fs.readdir` + `import()` — sem `@fastify/autoload`) → T-12
