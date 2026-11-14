# Plano — Logo IFPI enviado, visualização inteira das fotos de pesquisadores, evento SEMINOVA 2026 (Teresina Info) e esqueleto "Trocar de Cores"

> Função 1 (Planejar) → Função 2 (Desenvolver) → Função 3 (Publicar e relatar) executadas em sequência conforme solicitado.

## Objetivo
1. Substituir a logo do IFPI no cabeçalho pela nova imagem enviada pelo usuário (`public/imagens/ifpi.png`).
2. Na página `/pesquisadores`, ao passar o mouse (ou focar via teclado) no card/foto do pesquisador, exibir a foto inteira sem corte (`object-fit: contain` e expansão suave do quadro).
3. Remover o evento fictício de amostragem (`mostra-projetos-lims-2026`) e cadastrar o evento já realizado **SEMINOVA 2026 — Teresina Info** (`https://seminova2026.com.br/`) com descrição institucional; na página `/eventos`, se não houver próximos eventos, exibir os eventos realizados ou orientar claramente o usuário.
4. Deixar preparado o **esqueleto arquitetural de "Trocar de Cores"** (variantes de modo escuro: `verde` atual, `preto` puro e `azul` robótico via `data-dark-palette="verde|preto|azul"` no `<html>`, tokens CSS e API cliente em `src/client/paleta-escura.ts`), **sem ativar seletor na interface por enquanto**.

## Critérios de aceite
- [x] Imagem enviada salva em `public/imagens/ifpi.png` e referenciada no cabeçalho (`src/views/layout.ts`).
- [x] Em `/pesquisadores`, passar o mouse sobre o pesquisador faz a foto exibir a imagem inteira (`object-fit: contain`, sem cortar a cabeça/corpo).
- [x] No banco/seed, `mostra-projetos-lims-2026` é removido e `seminova-2026-teresina-info` (`https://seminova2026.com.br/`) está cadastrado como evento realizado.
- [x] Esqueleto "Trocar de Cores" documentado e tipado em `src/client/paleta-escura.ts` + variáveis `[data-theme="dark"][data-dark-palette="..."]` em `src/styles/app.css`, sem botão visível ainda.
- [x] `npm run typecheck`, `npm test` e `npm run build` passam sem erros; commit e push concluídos com relatório em `docs/relatorios/`.

## Tarefas

### T-1 — Nova logo do IFPI no cabeçalho
- **Arquivos:** `public/imagens/ifpi.png` (novo), `src/views/layout.ts`, `src/styles/app.css`.
- **O que fazer:** copiar a imagem enviada para `public/imagens/ifpi.png` e atualizar `.ifpi` no cabeçalho.
- **Verificação:** `npm test` → 200 e `src="/imagens/ifpi.png"` presente no layout.

### T-2 — Visualização da foto inteira dos pesquisadores no hover
- **Arquivos:** `src/views/paginas/pesquisadores.ts`, `src/styles/app.css`, `tests/rotas.test.ts`.
- **O que fazer:** envolver a foto em `.card__midia` com classe `.card__foto--pesquisador`; no `:hover` / `:focus-within` do `.card--pesquisador`, exibir a foto completa (`object-fit: contain`, altura ampliada e fundo técnico suave).
- **Verificação:** `npm test` e inspeção do CSS compilado.

### T-3 — Substituição do evento de amostragem pelo SEMINOVA 2026 (Teresina Info)
- **Arquivos:** `prisma/seed.ts`, `src/routes/index.ts`, `tests/rotas.test.ts`.
- **O que fazer:** remover `mostra-projetos-lims-2026` no seed (`deleteMany({ where: { slug: 'mostra-projetos-lims-2026' } })`), inserir `seminova-2026-teresina-info` apontando para `https://seminova2026.com.br/` e ajustar `/eventos` para que, quando a aba padrão não for informada e não houver eventos futuros, exiba diretamente a aba de realizados (`anteriores`) para que o evento apareça imediatamente.
- **Verificação:** `npm run db:seed` e `npm test`.

### T-4 — Esqueleto "Trocar de Cores" (3 temas escuros: verde, preto, azul)
- **Arquivos:** `src/client/paleta-escura.ts` (novo), `src/styles/app.css`, `tests/html.test.ts`.
- **O que fazer:** definir os 3 presets de paleta escura (`verde`, `preto`, `azul`) em `src/styles/app.css` sob `[data-theme="dark"][data-dark-palette="..."]` e criar o módulo `src/client/paleta-escura.ts` com os tipos `PaletaEscura`, constante `PALETAS_ESCURAS` e funções `lerPaletaEscura()` / `aplicarPaletaEscura()` prontas para uso futuro, sem renderizar seletor na UI agora.
- **Verificação:** `npm run typecheck` e `npm run build`.

## Riscos
- Como a nova logo do IFPI tem texto preto ("INSTITUTO FEDERAL Piauí") e fundo transparente, no modo escuro sem tratamento o texto preto perderia contraste → mitigar aplicando um fundo claro discreto/pílula no `.ifpi` ou mantendo a variante branca no escuro se necessário; como o usuário pediu especificamente essa imagem no lugar da logo que muda de cor, exibiremos a nova imagem com um container de fundo claro suave e borda arredondada para que fique nítida tanto no tema claro quanto no escuro.

## Ordem
T-1 → T-2 → T-3 → T-4
