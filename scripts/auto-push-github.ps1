# Script para subir automaticamente a GitHub
Write-Host "Subiendo cambios a GitHub..." -ForegroundColor Green

# Verificar si hay un remote configurado
$remote = git remote get-url origin 2>$null

if ($LASTEXITCODE -eq 0 -and $remote) {
    Write-Host "Repositorio remoto encontrado: $remote" -ForegroundColor Green
    Write-Host "Subiendo cambios..." -ForegroundColor Yellow
    git push origin main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Cambios subidos exitosamente a GitHub!" -ForegroundColor Green
        Write-Host "Render actualizara automaticamente en 3-5 minutos..." -ForegroundColor Cyan
    } else {
        Write-Host "Error al subir cambios. Verifica tu conexion a GitHub." -ForegroundColor Red
    }
} else {
    Write-Host "No hay repositorio remoto configurado." -ForegroundColor Yellow
    Write-Host "Para configurar:"
    Write-Host "1. Ve a https://github.com y crea un repositorio llamado 'mqt-analyzer'"
    Write-Host "2. Ejecuta: git remote add origin https://github.com/TU_USUARIO/mqt-analyzer.git"
    Write-Host "3. Ejecuta: git branch -M main"
    Write-Host "4. Ejecuta: git push -u origin main"
}
