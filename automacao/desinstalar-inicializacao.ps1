$ErrorActionPreference = 'SilentlyContinue'

$PastaStartup = [Environment]::GetFolderPath('Startup')
$ArquivoCmd = Join-Path $PastaStartup 'LIMS-Servidor-AutoStart.cmd'

if (Test-Path -LiteralPath $ArquivoCmd) {
  Remove-Item -LiteralPath $ArquivoCmd -Force
  Write-Output "Atalho de inicializacao automatica removido: $ArquivoCmd"
} else {
  Write-Output "Nenhum atalho encontrado em: $ArquivoCmd"
}
