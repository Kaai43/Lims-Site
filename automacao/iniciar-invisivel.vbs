' Executa o script PowerShell sem abrir nenhuma janela no Windows.
Dim shell, fso, pasta, comando
Set fso = CreateObject("Scripting.FileSystemObject")
pasta = fso.GetParentFolderName(WScript.ScriptFullName)
Set shell = CreateObject("WScript.Shell")
comando = "powershell.exe -NoProfile -NonInteractive -ExecutionPolicy Bypass -WindowStyle Hidden -File """ & pasta & "\iniciar-servidor.ps1"""
shell.Run comando, 0, False
