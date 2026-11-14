$ErrorActionPreference = 'SilentlyContinue'

$RaizProjeto = Split-Path -Parent $PSScriptRoot
Set-Location -LiteralPath $RaizProjeto

# Verifica rapidamente (300 ms) se a porta 3000 já está ocupada para não abrir dois servidores.
$cliente = New-Object System.Net.Sockets.TcpClient
try {
  $ar = $cliente.BeginConnect('127.0.0.1', 3000, $null, $null)
  if ($ar.AsyncWaitHandle.WaitOne(300, $false) -and $cliente.Connected) {
    $cliente.Close()
    exit 0
  }
} catch {} finally {
  $cliente.Close()
}

# Se ainda não houver build compilado, prepara uma única vez.
if (-not (Test-Path -LiteralPath (Join-Path $RaizProjeto 'compilado\servidor.js'))) {
  & npm.cmd run build | Out-Null
}

$NodeExe = (Get-Command node.exe -ErrorAction SilentlyContinue).Source
if (-not $NodeExe) {
  $NodeExe = 'node.exe'
}

# Inicia o servidor Node em segundo plano de forma desacoplada (sobrevive ao fechar o terminal).
$Argumentos = '--import tsx --env-file-if-exists=.env codigo-fonte/servidor.ts'
Invoke-CimMethod -ClassName Win32_Process -MethodName Create -Arguments @{
  CommandLine      = "`"$NodeExe`" $Argumentos"
  CurrentDirectory = $RaizProjeto
} | Out-Null
