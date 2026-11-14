$ErrorActionPreference = 'Stop'

$PastaStartup = [Environment]::GetFolderPath('Startup')
$ArquivoCmd = Join-Path $PastaStartup 'LIMS-Servidor-AutoStart.cmd'
$VbsCaminho = Join-Path $PSScriptRoot 'iniciar-invisivel.vbs'

$ConteudoCmd = @"
@echo off
wscript.exe //B //Nologo "$VbsCaminho"
"@

Set-Content -LiteralPath $ArquivoCmd -Value $ConteudoCmd -Encoding ASCII

# Também já inicia o servidor imediatamente caso ainda não esteja rodando.
& powershell.exe -NoProfile -ExecutionPolicy Bypass -File (Join-Path $PSScriptRoot 'iniciar-servidor.ps1')

Write-Output "Inicializacao automatica instalada em: $ArquivoCmd"
