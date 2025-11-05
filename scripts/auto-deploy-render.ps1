# Script de despliegue automático para Render (PowerShell)
# Ejecuta: .\scripts\auto-deploy-render.ps1

Write-Host "🚀 Iniciando despliegue automático en Render..." -ForegroundColor Green
Write-Host ""

# Verificar que estamos en el directorio correcto
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: No se encontró package.json" -ForegroundColor Red
    Write-Host "   Asegúrate de ejecutar este script desde la raíz del proyecto" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Verificando archivos de configuración..." -ForegroundColor Green

# Verificar render.yaml
if (-not (Test-Path "render.yaml")) {
    Write-Host "⚠️  render.yaml no encontrado, creándolo..." -ForegroundColor Yellow
    $renderYaml = @"
services:
  - type: web
    name: mqt-analyzer
    env: static
    buildCommand: npm run build
    staticPublishPath: ./dist
    routes:
      - type: rewrite
        source: /*
        destination: /index.html
"@
    $renderYaml | Out-File -FilePath "render.yaml" -Encoding UTF8
    Write-Host "✅ render.yaml creado" -ForegroundColor Green
} else {
    Write-Host "✅ render.yaml encontrado" -ForegroundColor Green
}

# Verificar .gitignore
if (-not (Test-Path ".gitignore")) {
    Write-Host "⚠️  .gitignore no encontrado, creándolo..." -ForegroundColor Yellow
    $gitignore = @"
node_modules
dist
.env
.env.local
*.log
.DS_Store
"@
    $gitignore | Out-File -FilePath ".gitignore" -Encoding UTF8
    Write-Host "✅ .gitignore creado" -ForegroundColor Green
} else {
    Write-Host "✅ .gitignore encontrado" -ForegroundColor Green
}

Write-Host ""
Write-Host "📦 Instalando dependencias..." -ForegroundColor Green
npm install

Write-Host ""
Write-Host "🔨 Ejecutando build..." -ForegroundColor Green
npm run build

Write-Host ""
Write-Host "✅ Verificación de Git..." -ForegroundColor Green

# Verificar si es un repositorio Git
if (Test-Path ".git") {
    Write-Host "✅ Es un repositorio Git" -ForegroundColor Green
    
    # Verificar si hay cambios sin commitear
    $gitStatus = git status --porcelain
    if ($gitStatus) {
        Write-Host "⚠️  Hay cambios sin commitear" -ForegroundColor Yellow
        $response = Read-Host "¿Deseas hacer commit y push automáticamente? (y/n)"
        if ($response -eq "y" -or $response -eq "Y") {
            git add .
            git commit -m "Ready for deployment on Render"
            Write-Host "✅ Cambios commiteados" -ForegroundColor Green
            
            # Verificar si hay un remote
            $remotes = git remote
            if ($remotes -match "origin") {
                $pushResponse = Read-Host "¿Deseas hacer push a GitHub? (y/n)"
                if ($pushResponse -eq "y" -or $pushResponse -eq "Y") {
                    git push origin main
                    if ($LASTEXITCODE -ne 0) {
                        git push origin master
                    }
                    Write-Host "✅ Push completado" -ForegroundColor Green
                }
            } else {
                Write-Host "⚠️  No hay remote configurado" -ForegroundColor Yellow
                Write-Host "   Configura tu remote con: git remote add origin <URL>" -ForegroundColor Yellow
            }
        }
    } else {
        Write-Host "✅ Todo está commiteado" -ForegroundColor Green
    }
} else {
    Write-Host "⚠️  No es un repositorio Git" -ForegroundColor Yellow
    Write-Host "   Inicializa Git con: git init" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🎉 ¡Preparación completada!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Próximos pasos para Render:" -ForegroundColor Green
Write-Host ""
Write-Host "   1. Ve a https://render.com"
Write-Host "   2. Inicia sesión con GitHub"
Write-Host "   3. Haz clic en 'New +' > 'Blueprint'"
Write-Host "   4. Selecciona tu repositorio de GitHub"
Write-Host "   5. Render detectará automáticamente el archivo render.yaml"
Write-Host "   6. Haz clic en 'Apply' para desplegar"
Write-Host ""
Write-Host "   O puedes usar 'Static Site' y configurar:" -ForegroundColor Yellow
Write-Host "   - Build Command: npm run build"
Write-Host "   - Publish Directory: dist"
Write-Host ""

