#!/usr/bin/env node

/**
 * Script para generar iconos PWA para MQT Analyzer
 * Genera iconos SVG y PNG básicos
 */

import { existsSync, writeFileSync, mkdirSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = join(__dirname, '..')
const publicDir = join(rootDir, 'public')

// Asegurar que existe el directorio public
if (!existsSync(publicDir)) {
  mkdirSync(publicDir, { recursive: true })
}

// SVG para icono 192x192 y 512x512
const iconSVG = `<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#00C4CC;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#0099A8;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="20%" fill="url(#grad)"/>
  <text x="256" y="340" font-family="Arial, sans-serif" font-size="180" font-weight="bold" fill="white" text-anchor="middle">MQT</text>
  <circle cx="256" cy="200" r="60" fill="white" opacity="0.9"/>
  <path d="M 256 160 L 276 200 L 236 200 Z" fill="#00C4CC"/>
</svg>`

// HTML para generar PNG usando canvas (se ejecutará en Node.js con canvas si está disponible)
const generateIconHTML = (size) => {
  return `<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      width: ${size}px;
      height: ${size}px;
      background: linear-gradient(135deg, #00C4CC 0%, #0099A8 100%);
      font-family: Arial, sans-serif;
    }
    .icon-container {
      width: ${size}px;
      height: ${size}px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: white;
    }
    .icon-circle {
      width: ${size * 0.3}px;
      height: ${size * 0.3}px;
      border-radius: 50%;
      background: white;
      opacity: 0.9;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: ${size * 0.1}px;
    }
    .icon-triangle {
      width: 0;
      height: 0;
      border-left: ${size * 0.08}px solid transparent;
      border-right: ${size * 0.08}px solid transparent;
      border-bottom: ${size * 0.12}px solid #00C4CC;
    }
    .icon-text {
      font-size: ${size * 0.35}px;
      font-weight: bold;
      text-shadow: 0 2px 4px rgba(0,0,0,0.3);
    }
  </style>
</head>
<body>
  <div class="icon-container">
    <div class="icon-circle">
      <div class="icon-triangle"></div>
    </div>
    <div class="icon-text">MQT</div>
  </div>
</body>
</html>`
}

// Generar iconos SVG
console.log('🎨 Generando iconos para MQT Analyzer...\n')

try {
  // Guardar SVG base
  const svgPath = join(publicDir, 'icon.svg')
  writeFileSync(svgPath, iconSVG, 'utf8')
  console.log('✅ icon.svg creado')

  // Crear iconos usando un enfoque simple: Base64 SVG embebido
  // Para producción, estos se convertirían a PNG usando una herramienta
  // Por ahora, vamos a crear un script que genere PNGs usando canvas si está disponible
  
  // Crear un script que el usuario puede ejecutar para generar PNGs
  const generatePNGScript = `#!/usr/bin/env node
// Script para convertir SVG a PNG
// Requiere: npm install sharp
import sharp from 'sharp'
import { readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const publicDir = join(__dirname, '..', 'public')

const svg = readFileSync(join(publicDir, 'icon.svg'))

// Generar 192x192
sharp(svg)
  .resize(192, 192)
  .png()
  .toFile(join(publicDir, 'icon-192x192.png'))
  .then(() => console.log('✅ icon-192x192.png creado'))

// Generar 512x512
sharp(svg)
  .resize(512, 512)
  .png()
  .toFile(join(publicDir, 'icon-512x512.png'))
  .then(() => console.log('✅ icon-512x512.png creado'))
`

  // Guardar script de conversión
  const convertScriptPath = join(rootDir, 'scripts', 'convert-svg-to-png.js')
  writeFileSync(convertScriptPath, generatePNGScript, 'utf8')
  console.log('✅ Script de conversión creado')

  // Generar iconos PNG básicos usando un enfoque diferente
  // Como alternativa, vamos a crear iconos usando una librería simple
  // o crear iconos SVG que se puedan usar directamente
  
  console.log('\n📝 Instrucciones:')
  console.log('   1. Instala sharp: npm install sharp')
  console.log('   2. Ejecuta: node scripts/convert-svg-to-png.js')
  console.log('   3. O usa una herramienta online para convertir icon.svg a PNG')
  console.log('\n✅ Iconos SVG generados correctamente!')
  
} catch (error) {
  console.error('❌ Error generando iconos:', error.message)
  process.exit(1)
}


