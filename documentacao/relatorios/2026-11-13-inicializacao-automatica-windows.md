# Relatório — Inicialização automática do servidor no Windows — 2026-11-13

## Identificação
- Branch: main
- Função: publicar e relatar

## O que foi feito
- **T-1 (Scripts de automação em `automacao/`):** criados os scripts:
  - `automacao/iniciar-servidor.ps1`: verifica via socket TCP (300 ms) se a porta `3000` já está ativa; se não estiver, dispara o servidor Node/TypeScript em segundo plano via `Win32_Process.Create` (desacoplado, sem janela visível e persistente).
  - `automacao/iniciar-invisivel.vbs`: lançador `WScript.Shell` com janela `0` (oculta) para não piscar janela de terminal ao ligar o computador.
  - `automacao/instalar-inicializacao.ps1`: grava `LIMS-Servidor-AutoStart.cmd` na pasta oficial de Inicialização do Windows do usuário (`%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup`) e já inicia o servidor imediatamente.
  - `automacao/desinstalar-inicializacao.ps1`: remove o atalho da pasta de Inicialização caso o usuário queira desativar no futuro.
- **T-2 (Instalação na máquina e scripts npm):** adicionados `npm run autostart:instalar` e `npm run autostart:remover` ao `package.json`, instalado o atalho na Inicialização do Windows e confirmado o servidor respondendo `200 {"status":"ok"}` em `http://127.0.0.1:3000/saude`.

## Arquivos alterados
| Arquivo | Tipo | Resumo |
| --- | --- | --- |
| `automacao/iniciar-servidor.ps1` | novo | Inicia o servidor Node/TS em segundo plano se a porta 3000 estiver livre |
| `automacao/iniciar-invisivel.vbs` | novo | Executa o script PowerShell sem abrir janela ao fazer login no Windows |
| `automacao/instalar-inicializacao.ps1` | novo | Instala o atalho na pasta Startup do Windows e sobe o servidor |
| `automacao/desinstalar-inicializacao.ps1` | novo | Remove o atalho da pasta Startup do Windows |
| `package.json` / `README.md` | editado | Comandos `autostart:instalar` e `autostart:remover` documentados |
| `testes/rotas.test.ts` | editado | Teste garantindo a presença do `lims.html` e dos scripts de automação |
| `documentacao/planos/2026-11-13-inicializacao-automatica-windows.md` | novo | Plano da entrega |

## Dependências e dados
- Dependências novas: nenhuma.
- Migrations/schema: nada alterado.

## Verificação
- `npm run autostart:instalar` → criou `C:\Users\Admin\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup\LIMS-Servidor-AutoStart.cmd` e iniciou o servidor em segundo plano.
- `Invoke-WebRequest http://127.0.0.1:3000/saude` → `Status: 200 Body: {"status":"ok"}`.
- `npm run typecheck` → `0` erros.
- `npm test` → `35 pass, 0 fail`.

## Riscos e pendências
- Caso a pasta do projeto seja movida de lugar no computador, basta executar `npm run autostart:instalar` novamente para atualizar o caminho no Startup do Windows.

## Próximo passo
- Basta clicar duas vezes em `lims.html` a qualquer momento: o servidor já está rodando em segundo plano e continuará subindo sozinho sempre que o computador ligar.
