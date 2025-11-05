# Script para subir automaticamente a GitHub
param(
    [string]$GitHubUser = "",
    [string]$GitHubRepo = "mqt-analyzer"
)

Write-Host "=== SUBIR PROYECTO A GITHUB ===" -ForegroundColor Cyan
Write-Host ""

# Verificar si ya hay remote configurado
$existingRemote = git remote get-url origin 2>$null
if ($LASTEXITCODE -eq 0 -and $existingRemote) {
    Write-Host "Repositorio remoto encontrado: $existingRemote" -ForegroundColor Green
    Write-Host "Subiendo cambios..." -ForegroundColor Yellow
    git push origin main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "SUCCESS! Cambios subidos a GitHub!" -ForegroundColor Green
        Write-Host "Render actualizara automaticamente en 3-5 minutos..." -ForegroundColor Cyan
        exit 0
    } else {
        Write-Host "ERROR: No se pudo subir. Verifica tu conexion." -ForegroundColor Red
        exit 1
    }
}

# Si no hay remote, necesitamos configurarlo
Write-Host "No hay repositorio remoto configurado." -ForegroundColor Yellow
Write-Host ""

if ([string]::IsNullOrEmpty($GitHubUser)) {
    Write-Host "Para configurar el repositorio, necesito tu usuario de GitHub." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "OPCION 1: Obtener URL desde Render (RECOMENDADO)" -ForegroundColor Cyan
    Write-Host "  1. Ve a https://render.com"
    Write-Host "  2. Entra a tu servicio 'mqt-analyzer'"
    Write-Host "  3. Ve a Settings > GitHub"
    Write-Host "  4. Copia la URL del repositorio"
    Write-Host "  5. Ejecuta: git remote add origin [URL_COPIADA]"
    Write-Host "  6. Ejecuta: git push -u origin main"
    Write-Host ""
    Write-Host "OPCION 2: Crear nuevo repositorio en GitHub" -ForegroundColor Cyan
    Write-Host "  1. Ve a https://github.com"
    Write-Host "  2. Crea un nuevo repositorio llamado 'mqt-analyzer'"
    Write-Host "  3. Ejecuta este script con tu usuario:"
    Write-Host "     .\scripts\push-to-github.ps1 -GitHubUser TU_USUARIO"
    Write-Host ""
    Write-Host "OPCION 3: Configurar manualmente" -ForegroundColor Cyan
    Write-Host "  git remote add origin https://github.com/TU_USUARIO/mqt-analyzer.git"
    Write-Host "  git branch -M main"
    Write-Host "  git push -u origin main"
    exit 1
}

# Si tenemos el usuario, intentar configurar
$repoUrl = "https://github.com/$GitHubUser/$GitHubRepo.git"
Write-Host "Configurando repositorio remoto: $repoUrl" -ForegroundColor Yellow

git remote add origin $repoUrl
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: No se pudo agregar el remote. Verifica que el repositorio existe." -ForegroundColor Red
    exit 1
}

git branch -M main
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "SUCCESS! Proyecto subido a GitHub!" -ForegroundColor Green
    Write-Host "Render actualizara automaticamente en 3-5 minutos..." -ForegroundColor Cyan
    Write-Host "Verifica en: https://mqt-analyzer.onrender.com" -ForegroundColor Cyan
    exit 0
} else {
    Write-Host ""
    Write-Host "ERROR: No se pudo subir. Verifica:" -ForegroundColor Red
    Write-Host "  - Que el repositorio existe en GitHub"
    Write-Host "  - Que tienes permisos para subir"
    Write-Host "  - Que tu usuario de GitHub es correcto"
    exit 1
}

