# LIMS — Laboratory of Innovation on Multimedia Systems (IFPI)

Site institucional do **Laboratory of Innovation on Multimedia Systems (LIMS)**, laboratório de pesquisa e inovação do **Instituto Federal do Piauí (IFPI)** focado em sistemas multimídia, robótica educacional, sistemas embarcados e tecnologias educacionais STEAM.

---

## Stack tecnológica

| Camada | Tecnologia |
| --- | --- |
| Linguagem | TypeScript (`strict`, ESM) |
| Servidor HTTP | Node.js + Fastify 5 |
| Segurança HTTP | `@fastify/helmet` (CSP restritiva), `@fastify/rate-limit`, `@fastify/csrf-protection` |
| Validação de borda | Zod 4 |
| Banco de dados | SQLite + Prisma ORM 7 (`@prisma/adapter-better-sqlite3`) |
| Front-end | HTML renderizado no servidor (escape automático) + Tailwind CSS 4 + HTMX 2 vendorizado |
| Testes | `node:test` |

---

## Esqueleto de segurança (defesa em profundidade)

1. **CSP restritiva (`default-src 'self'`)**: scripts, estilos, fontes e imagens vêm exclusivamente do próprio servidor (`public/`). Nenhum CDN externo e nenhum `<script>` inline.
2. **Escape por padrão (`src/views/html.ts`)**: toda interpolação em `` html`...` `` escapa `& < > " ' \``.
3. **Consultas parametrizadas (`src/services/conteudo.ts`)**: somente a API tipada do Prisma; `$queryRawUnsafe` e `$executeRawUnsafe` são proibidos.
4. **Validação na borda (`src/schemas/filtros.ts`)**: parâmetros de query validados com Zod antes de chegar aos serviços; entradas inválidas retornam `400`.
5. **Superfície somente leitura**: o site é de divulgação (sem login e sem painel admin). Métodos diferentes de `GET`/`HEAD` recebem `405`. O plugin `@fastify/csrf-protection` já está registrado para proteger eventuais rotas futuras de escrita.
6. **Rate limit e limites de payload**: proteção por IP (`@fastify/rate-limit`) e `bodyLimit` de 16 KB.
7. **Erros sem vazamento**: respostas `4xx`/`5xx` usam páginas estáticas genéricas, sem expor stack trace ou mensagens internas.

---

## Como executar localmente

Pré-requisito: **Node.js >= 24**.

```powershell
# 1. Instalar dependências
npm install

# 2. Aplicar migrations e popular o banco SQLite local
npx prisma migrate deploy
npm run db:seed

# 3. Compilar CSS/JS e iniciar em modo desenvolvimento (http://localhost:3000)
npm run dev
```

### Scripts disponíveis

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Compila assets e sobe o servidor em modo watch |
| `npm run build` | Gera o cliente Prisma, compila TypeScript (back e front) e minifica o CSS |
| `npm start` | Executa a versão compilada (`dist/server.js`) |
| `npm test` | Executa a suíte de testes (`node:test`) |
| `npm run typecheck` | Verifica tipos do servidor e do cliente (`tsc --noEmit`) |
| `npm run db:deploy` | Aplica migrations pendentes no SQLite |
| `npm run db:seed` | Popula o banco de forma idempotente (`upsert` por `slug`) |

---

## Deploy (Render)

O arquivo [`render.yaml`](render.yaml) configura o serviço web no plano gratuito do Render:

- **Build:** `npm ci && npm run build && npx prisma migrate deploy && npm run db:seed`
- **Start:** `npm start`
- **Health check:** `/saude`

> **Nota sobre o plano gratuito do Render:** o disco é efêmero e a instância hiberna após inatividade (o primeiro acesso após hibernação pode levar ~30s). Como o site é **somente leitura**, o banco SQLite é recriado e populado automaticamente a cada build sem perda de dados. Lembre-se de desativar o GitHub Pages nas configurações do repositório caso utilize apenas o Render.

---

## Licença

Distribuído sob a licença [MIT](LICENSE).
