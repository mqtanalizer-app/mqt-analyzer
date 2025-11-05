#!/bin/bash

# Script de despliegue automático para Render
# Ejecuta: bash scripts/auto-deploy-render.sh

set -e

echo "🚀 Iniciando despliegue automático en Render..."
echo ""

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: No se encontró package.json${NC}"
    echo "   Asegúrate de ejecutar este script desde la raíz del proyecto"
    exit 1
fi

echo -e "${GREEN}✅ Verificando archivos de configuración...${NC}"

# Verificar render.yaml
if [ ! -f "render.yaml" ]; then
    echo -e "${YELLOW}⚠️  render.yaml no encontrado, creándolo...${NC}"
    cat > render.yaml << 'EOF'
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
EOF
    echo -e "${GREEN}✅ render.yaml creado${NC}"
else
    echo -e "${GREEN}✅ render.yaml encontrado${NC}"
fi

# Verificar .gitignore
if [ ! -f ".gitignore" ]; then
    echo -e "${YELLOW}⚠️  .gitignore no encontrado, creándolo...${NC}"
    cat > .gitignore << 'EOF'
node_modules
dist
.env
.env.local
*.log
.DS_Store
EOF
    echo -e "${GREEN}✅ .gitignore creado${NC}"
else
    echo -e "${GREEN}✅ .gitignore encontrado${NC}"
fi

echo ""
echo -e "${GREEN}📦 Instalando dependencias...${NC}"
npm install

echo ""
echo -e "${GREEN}🔨 Ejecutando build...${NC}"
npm run build

echo ""
echo -e "${GREEN}✅ Verificación de Git...${NC}"

# Verificar si es un repositorio Git
if [ -d ".git" ]; then
    echo -e "${GREEN}✅ Es un repositorio Git${NC}"
    
    # Verificar si hay cambios sin commitear
    if [ -n "$(git status --porcelain)" ]; then
        echo -e "${YELLOW}⚠️  Hay cambios sin commitear${NC}"
        read -p "¿Deseas hacer commit y push automáticamente? (y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            git add .
            git commit -m "Ready for deployment on Render"
            echo -e "${GREEN}✅ Cambios commiteados${NC}"
            
            # Verificar si hay un remote
            if git remote | grep -q "origin"; then
                read -p "¿Deseas hacer push a GitHub? (y/n) " -n 1 -r
                echo
                if [[ $REPLY =~ ^[Yy]$ ]]; then
                    git push origin main || git push origin master
                    echo -e "${GREEN}✅ Push completado${NC}"
                fi
            else
                echo -e "${YELLOW}⚠️  No hay remote configurado${NC}"
                echo "   Configura tu remote con: git remote add origin <URL>"
            fi
        fi
    else
        echo -e "${GREEN}✅ Todo está commiteado${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  No es un repositorio Git${NC}"
    echo "   Inicializa Git con: git init"
fi

echo ""
echo -e "${GREEN}🎉 ¡Preparación completada!${NC}"
echo ""
echo -e "${GREEN}📝 Próximos pasos para Render:${NC}"
echo ""
echo "   1. Ve a https://render.com"
echo "   2. Inicia sesión con GitHub"
echo "   3. Haz clic en 'New +' > 'Blueprint'"
echo "   4. Selecciona tu repositorio de GitHub"
echo "   5. Render detectará automáticamente el archivo render.yaml"
echo "   6. Haz clic en 'Apply' para desplegar"
echo ""
echo -e "${YELLOW}   O puedes usar 'Static Site' y configurar:${NC}"
echo "   - Build Command: npm run build"
echo "   - Publish Directory: dist"
echo ""


