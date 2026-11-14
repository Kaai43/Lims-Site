# LIMS — Laboratory of Innovation on Multimedia Systems (IFPI)

Site institucional do **Laboratory of Innovation on Multimedia Systems (LIMS)**, laboratório de pesquisa e inovação do **Instituto Federal do Piauí (IFPI)** focado em sistemas multimídia, robótica educacional, sistemas embarcados e tecnologias educacionais STEAM.

---

## Organização das pastas (em português)

Toda a árvore do projeto foi nomeada em português para fácil identificação:

```
LIMS/
├── lims.html                   # Atalho rápido: clique duas vezes para abrir o site
├── codigo-fonte/               # Código TypeScript do servidor e do navegador
│   ├── servidor.ts             # Ponto de entrada (sobe a porta HTTP)
│   ├── aplicacao.ts            # Montagem do Fastify + plugins + rotas
│   ├── configuracao.ts         # Leitura e validação de variáveis de ambiente (Zod)
│   ├── banco.ts                # Conexão Prisma 7 + SQLite
│   ├── plugins/                # Segurança (Helmet/CSP, Rate-limit, CSRF), Prisma e estáticos
│   ├── rotas/                  # Rotas HTTP (/, /laboratorio, /projetos, /pesquisadores, /eventos, /localizacoes)
│   ├── servicos/               # Consultas parametrizadas ao banco de dados
│   ├── validacoes/             # Esquemas Zod de validação de parâmetros
│   ├── telas/                  # Motor HTML com escape automático, layout, páginas e parciais HTMX
│   ├── estilos/                # Folha de estilos Tailwind CSS v4 (identidade IFPI + robótica)
│   ├── navegador/              # Scripts TypeScript do cliente (menu, tema e paletas do modo escuro)
│   └── utilitarios/            # Versionamento de assets por hash
├── arquivos-publicos/          # Imagens, PDFs e CSS/JS compilados servidos pelo Fastify
├── banco-de-dados/             # Schema Prisma, migrations SQL e script `popular.ts` (seed)
├── testes/                     # Suíte de testes automatizados (`node:test`)
└── documentacao/               # Planos (`planos/`) e relatórios (`relatorios/`)
```

---

## Como abrir com o `lims.html`

O arquivo [`lims.html`](lims.html) na raiz funciona como lançador inteligente:
1. Ao clicar duas vezes nele, ele verifica automaticamente se o servidor local (`http://localhost:3000`) está ativo.
2. **Se o servidor estiver ligado**, ele redireciona você imediatamente para o site.
3. **Se o servidor estiver desligado**, ele exibe um painel no estilo do LIMS e fica aguardando: assim que você rodar `npm run dev` no terminal, a página redireciona sozinha.

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
| `npm run dev` | Compila assets e sobe o servidor em modo watch (`codigo-fonte/servidor.ts`) |
| `npm run build` | Gera o cliente Prisma, compila TypeScript (`compilado/`) e minifica o CSS |
| `npm start` | Executa a versão compilada (`compilado/servidor.js`) |
| `npm test` | Executa a suíte de testes (`testes/**/*.test.ts`) |
| `npm run typecheck` | Verifica tipos do servidor e do cliente (`tsc --noEmit`) |
| `npm run db:deploy` | Aplica migrations pendentes no SQLite (`banco-de-dados/`) |
| `npm run db:seed` | Popula o banco de forma idempotente (`banco-de-dados/popular.ts`) |

---

## Deploy (Render)

O arquivo [`render.yaml`](render.yaml) configura o serviço web no plano gratuito do Render:

- **Build:** `npm ci --include=dev && npm run build && npx prisma migrate deploy && npm run db:seed`
- **Start:** `npm start`
- **Health check:** `/saude`

---

## Licença

Distribuído sob a licença [MIT](LICENSE).
