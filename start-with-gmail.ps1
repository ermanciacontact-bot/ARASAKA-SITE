$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$securePassword = Read-Host "Mot de passe d'application Google pour arasakaci.contact@gmail.com" -AsSecureString
$passwordPointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword)

try {
  $env:SMTP_USER = "arasakaci.contact@gmail.com"
  $env:SMTP_PASS = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($passwordPointer)
  $env:PORT = "4323"

  Set-Location $projectRoot
  node server.js
}
finally {
  Remove-Item Env:SMTP_PASS -ErrorAction SilentlyContinue
  [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($passwordPointer)
}
