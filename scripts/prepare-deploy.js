#!/usr/bin/env node

/**
 * Script de preparación automática para despliegue en Render
 * Ejecuta: node scripts/prepare-deploy.js
 */

import { execSync } from 'child_process'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = join(__dirname, '..')

console.log('🚀 Preparando aplicación para despliegue en Render...\n')

// Verificar que estamos en el directorio correcto
if (!existsSync(join(rootDir, 'package.json'))) {
  console.error('❌ Error: No se encontró package.json')
  console.error('   Asegúrate de ejecutar este script desde la raíz del proyecto')
  process.exit(1)
}

console.log('✅ Verificando archivos de configuración...')

// Verificar render.yaml
const renderYamlPath = join(rootDir, 'render.yaml')
if (!existsSync(renderYamlPath)) {
  console.log('⚠️  render.yaml no encontrado, creándolo...')
  const renderYaml = `services:
  - type: web
    name: mqt-analyzer
    env: static
    buildCommand: npm run build
    staticPublishPath: ./dist
    routes:
      - type: rewrite
        source: /*
        destination: /index.html
`
  writeFileSync(renderYamlPath, renderYaml)
  console.log('✅ render.yaml creado')
} else {
  console.log('✅ render.yaml encontrado')
}

// Verificar .gitignore
const gitignorePath = join(rootDir, '.gitignore')
if (!existsSync(gitignorePath)) {
  console.log('⚠️  .gitignore no encontrado, creándolo...')
  const gitignore = `node_modules
dist
.env
.env.local
*.log
.DS_Store
`
  writeFileSync(gitignorePath, gitignore)
  console.log('✅ .gitignore creado')
} else {
  console.log('✅ .gitignore encontrado')
}

console.log('\n📦 Verificando dependencias...')

try {
  // Verificar que node_modules existe
  if (!existsSync(join(rootDir, 'node_modules'))) {
    console.log('⚠️  node_modules no encontrado, instalando dependencias...')
    execSync('npm install', { stdio: 'inherit', cwd: rootDir })
    console.log('✅ Dependencias instaladas')
  } else {
    console.log('✅ Dependencias ya instaladas')
  }
} catch (error) {
  console.error('❌ Error instalando dependencias:', error.message)
  process.exit(1)
}

console.log('\n🔨 Probando build...')

try {
  execSync('npm run build', { stdio: 'inherit', cwd: rootDir })
  console.log('✅ Build exitoso')
} catch (error) {
  console.error('❌ Error en el build:', error.message)
  console.error('   Por favor, corrige los errores antes de desplegar')
  process.exit(1)
}

console.log('\n📋 Verificando archivos necesarios...')

const requiredFiles = [
  'package.json',
  'vite.config.ts',
  'index.html',
  'src/main.tsx',
  'src/App.tsx',
  'render.yaml'
]

let allFilesExist = true
requiredFiles.forEach(file => {
  const filePath = join(rootDir, file)
  if (existsSync(filePath)) {
    console.log(`✅ ${file}`)
  } else {
    console.log(`❌ ${file} - NO ENCONTRADO`)
    allFilesExist = false
  }
})

if (!allFilesExist) {
  console.error('\n❌ Faltan archivos necesarios. Por favor, verifica tu proyecto.')
  process.exit(1)
}

console.log('\n✅ Verificación de Git...')

try {
  // Verificar si es un repositorio Git
  execSync('git status', { stdio: 'ignore', cwd: rootDir })
  console.log('✅ Es un repositorio Git')
  
  // Verificar si hay cambios sin commitear
  try {
    const status = execSync('git status --porcelain', { encoding: 'utf8', cwd: rootDir })
    if (status.trim()) {
      console.log('⚠️  Hay cambios sin commitear')
      console.log('   Ejecuta: git add . && git commit -m "Ready for deployment"')
    } else {
      console.log('✅ Todo está commiteado')
    }
  } catch (error) {
    // Ignorar errores de git status
  }
} catch (error) {
  console.log('⚠️  No es un repositorio Git')
  console.log('   Inicializa Git con: git init')
  console.log('   Luego agrega tu repositorio remoto de GitHub')
}

console.log('\n🎉 ¡Preparación completada!\n')
console.log('📝 Próximos pasos:')
console.log('   1. Asegúrate de que tu código esté en GitHub')
console.log('   2. Ve a https://render.com')
console.log('   3. Inicia sesión con GitHub')
console.log('   4. Haz clic en "New +" > "Blueprint"')
console.log('   5. Selecciona tu repositorio')
console.log('   6. Render detectará automáticamente el archivo render.yaml')
console.log('   7. Haz clic en "Apply" para desplegar\n')
console.log('   O puedes usar "Static Site" y configurar manualmente:')
console.log('   - Build Command: npm run build')
console.log('   - Publish Directory: dist\n')


