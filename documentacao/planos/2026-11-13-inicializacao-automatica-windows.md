# Plano — Inicialização automática do servidor LIMS ao ligar o computador

> Função 1 (Planejar) → Função 2 (Desenvolver) → Função 3 (Publicar e relatar) executadas em sequência.

## Objetivo
Permitir que o site do LIMS suba sozinho em segundo plano assim que o usuário fizer login no Windows (sem precisar abrir o terminal e digitar `npm run dev`), para que o clique em `lims.html` sempre redirecione imediatamente para `http://localhost:3000/`. Além disso, documentar a opção de nuvem 100% gratuita (Render via `render.yaml`) caso queira o site no ar mesmo com o computador desligado.

## Critérios de aceite
- [x] Pasta `automacao/` em português contendo:
  - `iniciar-servidor.ps1`: verifica se a porta `3000` já está ativa; se não estiver, sobe o servidor LIMS em segundo plano (`WindowStyle Hidden`) na pasta do projeto.
  - `iniciar-invisivel.vbs`: wrapper Windows Script Host que executa o PowerShell em modo totalmente oculto (zero janela piscando ao ligar o PC).
  - `instalar-inicializacao.ps1`: registra o atalho `LIMS-Servidor-AutoStart.cmd` na pasta oficial de Inicialização do Windows (`shell:startup`) e já inicia o servidor imediatamente.
  - `desinstalar-inicializacao.ps1`: remove o atalho da Inicialização do Windows e encerra o processo caso o usuário queira desativar no futuro.
- [x] Scripts registrados em `package.json`: `npm run autostart:instalar` e `npm run autostart:remover`.
- [x] Atalho instalado na pasta de Inicialização do Windows do usuário e servidor rodando e respondendo `200` em `http://127.0.0.1:3000/saude`.
- [x] `npm test` e `npm run typecheck` passando; commit e push realizados com relatório em `documentacao/relatorios/`.

## Tarefas

### T-1 — Criar scripts de inicialização automática em `automacao/` e scripts no `package.json`
- **Arquivos:** `automacao/iniciar-servidor.ps1`, `automacao/iniciar-invisivel.vbs`, `automacao/instalar-inicializacao.ps1`, `automacao/desinstalar-inicializacao.ps1`, `package.json`, `README.md`.
- **O que fazer:** implementar os scripts com detecção de porta `3000` ocupada (idempotente) e execução silenciosa.

### T-2 — Instalar o autostart no Windows do usuário e verificar servidor ativo
- **Arquivos:** pasta Startup do Windows (`%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup\LIMS-Servidor-AutoStart.cmd`).
- **Verificação:** executar `npm run autostart:instalar`, confirmar que o arquivo existe na pasta Startup e que `http://127.0.0.1:3000/saude` responde `200`.

## Riscos
- Se o usuário mover a pasta do projeto de lugar no futuro, basta rodar `npm run autostart:instalar` novamente para atualizar o caminho na Inicialização do Windows.

## Ordem
T-1 → T-2
