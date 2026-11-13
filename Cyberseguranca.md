# Cybersegurança — LIMS

Documento de trabalho para auditoria de segurança do site deste repositório.

Define **três papéis independentes** — ataque, revisão e relatório — que podem ser
executados por **qualquer modelo de IA** com acesso a arquivos e terminal. Nenhum
papel depende de fornecedor, API ou produto específico: onde houver nome de modelo,
há um espaço reservado (`<MODELO-...>`) para você preencher.

Complementa o `AGENTS.md`: segurança aqui é **análise do próprio código**, não
permissão para atacar terceiros. Em caso de conflito, valem as regras do `AGENTS.md`.

---

## 1. Escopo e limites (obrigatório, vale para os três papéis)

1. **Alvo permitido:** apenas este repositório — `index.html`, `paginas/`, `css/`,
   `js/`, `imagens/` — servido localmente (`localhost`) ou no domínio oficial do
   projeto quando houver autorização escrita.
2. **Proibido:** testar domínio de terceiro, varredura de rede, força bruta,
   negação de serviço, engenharia social ou qualquer ação contra sistema que não
   seja este site.
3. **Proibido dado real.** Nada de dados de pacientes, amostras ou laudos em provas
   de conceito, logs ou relatórios. Gere dados sintéticos (LGPD).
4. **Não alterar código de produção.** Os papéis 1 e 2 são somente leitura. Quem
   corrige é o fluxo normal do `AGENTS.md` (lead + workers), depois do relatório.
5. **Nada destrutivo.** Sem apagar arquivos, sem instalar ferramenta global, sem
   commit/push. Provas de conceito rodam em página local descartável.
6. **Evidência antes de afirmação.** Achado sem arquivo, linha e prova reproduzível
   não entra no relatório.

---

## 2. Visão geral do fluxo

```
        ┌──────────────┐     achados-ataque.md     ┌──────────────┐
        │  MODELO 1    │ ────────────────────────► │  MODELO 2    │
        │   ATAQUE     │                           │   REVISÃO    │
        └──────────────┘                           └──────────────┘
                                                        │
                                          achados-revisao.md
                                                        ▼
                                                   ┌──────────────┐
                                                   │  MODELO 3    │
                                                   │  RELATÓRIO   │
                                                   └──────────────┘
                                                        │
                                        relatorios ataques/<data>-relatorio-seguranca.{md,txt}
```

Regra de ouro do fluxo: **cada papel trabalha sem confiar no anterior.** O modelo 1
pode errar; o modelo 2 existe para pegá-los. O modelo 3 só publica o que o modelo 2
validou.

---

## 3. MODELO 1 — Ataque (ofensivo)

**Missão:** encontrar falhas reais exploráveis no código do site antes que alguém
de fora encontre.

**Perfil de modelo:** `<MODELO-ATAQUE>` — precisa de contexto longo (lê vários
arquivos) e boa capacidade de raciocínio sobre fluxo de dados.

### 3.1 Entradas

- Todos os arquivos de `index.html`, `paginas/`, `js/`, `css/`.
- `AGENTS.md` (convenções) e este documento.
- Opcional: o site aberto em `localhost` para confirmar comportamento.

### 3.2 O que procurar neste tipo de site (HTML/CSS/JS estático)

Mapeie primeiro a **superfície**: toda entrada que vira saída.

| Classe | Onde olhar no projeto |
| --- | --- |
| XSS por DOM | uso de `innerHTML`, `insertAdjacentHTML`, `document.write`, `eval`, `new Function`; dados vindos de `location.hash`, `location.search`, `searchParams`, `referrer` |
| Sink de URL | `location.href = ...`, `window.open`, `iframe.src`, `a.href` montado com entrada do usuário → open redirect / `javascript:` |
| `postMessage` | `addEventListener("message", ...)` sem checagem de `event.origin`; `postMessage(..., "*")` |
| Armazenamento no cliente | `localStorage` / `sessionStorage` guardando dado sensível (tema é ok; token, nome de paciente ou laudo não) |
| `target="_blank"` | ausência de `rel="noopener noreferrer"` |
| Terceiros | script/CSS de CDN externo sem `integrity` (SRI) e sem `crossorigin`; `<iframe>` externo |
| Exposição de arquivos | `.git/` publicado, `sourceMappingURL` apontando para `.map`, arquivos de backup, `.env`, `README` com caminho interno |
| Metadados | segredos e caminhos pessoais em comentários HTML/JS; EXIF em `imagens/` |
| Cabeçalhos / transporte | ausência de CSP, `X-Content-Type-Options`, `Referrer-Policy`; conteúdo misto (http dentro de https); ausência de HSTS — registrar como configuração de hospedagem, não como bug de código |
| Lógica e integridade | links e caminhos que aceitam parâmetro e mudam destino; validação de formulário só no cliente |
| Robustez | `JSON.parse` de entrada não confiável, dependência de `data-*` para decisão de segurança, concatenação de string em HTML |

### 3.3 Método

1. Liste arquivos e pontos de entrada (URL, hash, formulários, `localStorage`).
2. Trace cada entrada até o consumidor (grep por `innerHTML`, `location`, `href`).
3. Para cada hipótese, escreva a **prova de conceito mínima** — o menor HTML/JS ou
   URL que demonstra o efeito, em página local descartável. Nunca contra terceiros.
4. Registre evidência: arquivo:linha, trecho, comando, o que se esperava e o que
   aconteceu.
5. Descarte o que não conseguir reproduzir — mas registre como "não confirmado",
   não como achado.

### 3.4 Saída

Arquivo: `relatorios ataques/AAAA-MM-DD-achados-ataque.md`

Um bloco por hipótese, neste formato:

```md
### A-01 — <título curto>
- **Classe:** XSS DOM / open redirect / exposição / ...
- **Local:** `js/arquivo.js:42`
- **Entrada → sink:** `location.hash` → `innerHTML`
- **PoC:** <passos mínimos + código/URL>
- **Impacto hipotético:** <o que um atacante conseguiria>
- **Confiança:** alta / média / baixa
- **Sugestão de correção:** <1–3 linhas>
```

### 3.5 Critérios de conclusão

- [ ] Superfície mapeada e registrada.
- [ ] Toda hipótese tem PoC ou foi marcada como não confirmada.
- [ ] Arquivo de saída criado no caminho acima.
- [ ] Nenhum arquivo do site alterado.

---

## 4. MODELO 2 — Revisão de erros do código (verificador)

**Missão:** julgar os achados do modelo 1 e, de forma independente, revisar o
código para achar o que o ataque deixou passar.

**Perfil de modelo:** `<MODELO-REVISAO>` — de preferência **fornecedor diferente**
do modelo 1. Modelos do mesmo fornecedor tendem a repetir o mesmo ponto cego.

### 4.1 Entradas

- Código-fonte (mesmos caminhos do modelo 1).
- `relatorios ataques/AAAA-MM-DD-achados-ataque.md`.

### 4.2 O que fazer

1. **Reexecutar** cada PoC. Sem reproduzir, o achado não é confirmado.
2. **Classificar** cada achado como `confirmado`, `falso positivo` ou `inconclusivo`,
   sempre com o motivo.
3. **Corrigir a severidade** por impacto real no contexto (site estático, sem
   autenticação e sem dado sensível = impacto menor). Use CVSS quando ajudar;
   justifique a nota em uma linha.
4. **Revisão independente:** varra o código por conta própria procurando o que não
   está na lista — erros de robustez (exceção não tratada ao ler `localStorage`,
   JSON inválido quebrando o menu) também contam, com severidade informativa.
5. **Detectar exagero:** achado inflado ou teórico demais deve ser rebaixado. Isso
   protege o relatório.

### 4.3 Saída

Arquivo: `relatorios ataques/AAAA-MM-DD-achados-revisao.md`

```md
### V-01 — ref. A-01 — <título>
- **Veredito:** confirmado / falso positivo / inconclusivo
- **Reprodução:** <comando ou passos + resultado observado>
- **Severidade final:** crítica / alta / média / baixa / informativa (CVSS: x.y)
- **Causa raiz:** <uma frase>
- **Remediação:** <passos concretos, com arquivo e linha>
```

Ao final, uma tabela-resumo com todos os IDs (`A-xx` → `V-xx` → severidade final →
veredito).

### 4.4 Critérios de conclusão

- [ ] Todo achado do modelo 1 tem veredito.
- [ ] Toda severidade final justificada.
- [ ] Toda remediação indica arquivo e linha.
- [ ] Revisão independente registrada (mesmo que "nada novo encontrado").

---

## 5. MODELO 3 — Relatório

**Missão:** transformar as duas saídas anteriores em um documento legível para quem
não é técnico, sem inventar nada.

**Perfil de modelo:** `<MODELO-RELATORIO>` — precisa de boa escrita em português.
Pode ser um modelo menor/mais barato; a análise já foi feita.

### 5.1 O que faz

1. **Cria a pasta** `relatorios ataques/` se ela não existir.
2. Lê `achados-ataque.md` e `achados-revisao.md`.
3. Publica **apenas** o que a revisão marcou como `confirmado`. Falsos positivos vão
   para um anexo curto ("descartados"), nunca para o resumo executivo.
4. Grava o relatório **nos dois formatos**: `.md` e `.txt`, com o mesmo conteúdo.

### 5.2 Saída

```
relatorios ataques/
├── AAAA-MM-DD-achados-ataque.md
├── AAAA-MM-DD-achados-revisao.md
├── AAAA-MM-DD-relatorio-seguranca.md
└── AAAA-MM-DD-relatorio-seguranca.txt
```

Regra de nomenclatura: data ISO (`AAAA-MM-DD`) no início, nome em kebab-case, sem
acento, sem espaço. Uma execução por data; se houver duas no mesmo dia, acrescente
`-2`, `-3`.

### 5.3 Estrutura obrigatória do relatório

1. **Identificação** — projeto, escopo auditado, data, perfis de modelo usados
   (preenchidos, sem segredo nem chave de API).
2. **Resumo executivo** — 5 a 10 linhas: quantos achados, quantos críticos/altos,
   risco geral, o que fazer primeiro.
3. **Tabela de achados** — ID, título, severidade, status, arquivo.
4. **Detalhamento** — por achado: descrição, evidência, impacto, reprodução,
   remediação.
5. **Descartados / falsos positivos** — lista curta, com o motivo.
6. **Recomendações gerais** — padrões a adotar (ex.: CSP, SRI, `rel="noopener"`).
7. **Limitações** — o que não foi testado e por quê.
8. **Anexos** — comandos executados e saída relevante.

### 5.4 Critérios de conclusão

- [ ] Pasta `relatorios ataques/` existe.
- [ ] `.md` e `.txt` gravados, conteúdo equivalente.
- [ ] Nenhum achado sem veredito `confirmado` no corpo principal.
- [ ] Nenhum dado sensível, segredo ou token no texto.
- [ ] Resumo executivo entende-se sem ler o resto.

---

## 6. Contrato entre os modelos (handoff)

| De → Para | Arquivo | Obrigatório conter |
| --- | --- | --- |
| 1 → 2 | `AAAA-MM-DD-achados-ataque.md` | ID, local, entrada→sink, PoC, impacto, confiança |
| 2 → 3 | `AAAA-MM-DD-achados-revisao.md` | veredito, severidade final, causa raiz, remediação |
| 3 → usuário | `...-relatorio-seguranca.md` + `.txt` | estrutura da seção 5.3 |

Se um arquivo do contrato não existir, o papel seguinte **para e avisa** — não
inventa o que faltou.

---

## 7. Escolha dos modelos (agnóstico de fornecedor)

Os três papéis são independentes. Preencha a tabela ao iniciar uma auditoria:

| Papel | Requisito mínimo | Sugestão | Placeholder |
| --- | --- | --- | --- |
| 1 — Ataque | leitura de arquivos + terminal + contexto longo | modelo mais forte disponível | `<PROVEDOR>/<MODELO-ATAQUE>` |
| 2 — Revisão | idem, **fornecedor diferente** do papel 1 | modelo igual ou mais forte | `<PROVEDOR>/<MODELO-REVISAO>` |
| 3 — Relatório | escrita clara em português | pode ser modelo menor | `<PROVEDOR>/<MODELO-RELATORIO>` |

Regras de escolha:

- Não amarre o documento a um fornecedor. Qualquer modelo que leia arquivos e rode
  comandos serve.
- Prefira **três modelos diferentes** (ou ao menos dois fornecedores distintos): a
  diversidade é o que faz o papel 2 encontrar o erro do papel 1.
- Se só houver um modelo disponível, rode os três papéis em **sessões separadas e
  sem histórico compartilhado** — o efeito de revisão independente se mantém.
- Registre no relatório quais modelos foram usados; **nunca** registre chaves de API.

---

## 8. Integração com as skills já instaladas

As skills do projeto (`.opencode/skills/`) e as de segurança instaladas globalmente
continuam valendo. Combinações úteis:

| Papel | Skills sugeridas |
| --- | --- |
| 1 — Ataque | `offensive-*`, `web-security-testing`, `top-web-vulnerabilities` |
| 2 — Revisão | `code-review`, `vulnerability-triage-brocards`, `systematic-debugging` |
| 3 — Relatório | `cvss-scoring`, `offensive-reporting`, `verification-before-completion` |

Para validar comportamento real da página, `webapp-testing` (Playwright) serve aos
papéis 1 e 2. Se um script da skill não rodar no Windows, siga o procedimento
manual — o método continua valendo.

---

## 9. Definição de pronto da auditoria

- [ ] Os três arquivos do contrato existem em `relatorios ataques/`.
- [ ] Relatório final em `.md` **e** `.txt`.
- [ ] Todo achado publicado tem veredito `confirmado` e PoC reproduzível.
- [ ] Falsos positivos listados à parte.
- [ ] Nenhum arquivo do site foi modificado durante a auditoria.
- [ ] Riscos residuais e limitações escritos em português.

---

> **Escreva sempre um `.txt` e um `.md` para usos posteriores.**
