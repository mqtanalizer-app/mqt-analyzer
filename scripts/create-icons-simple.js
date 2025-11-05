#!/usr/bin/env node

/**
 * Script simple para crear iconos usando sharp (si está disponible)
 * o crear instrucciones para generarlos
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

// Crear SVG del icono
const createIconSVG = (size) => {
  return `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#00C4CC;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#0099A8;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${size * 0.2}" fill="url(#grad)"/>
  <circle cx="${size / 2}" cy="${size * 0.4}" r="${size * 0.12}" fill="white" opacity="0.95"/>
  <path d="M ${size / 2} ${size * 0.31} L ${size * 0.54} ${size * 0.39} L ${size * 0.46} ${size * 0.39} Z" fill="#00C4CC"/>
  <text x="${size / 2}" y="${size * 0.66}" font-family="Arial, sans-serif" font-size="${size * 0.35}" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">MQT</text>
</svg>`
}

console.log('🎨 Generando iconos para MQT Analyzer...\n')

try {
  // Generar SVG base
  const svgBase = createIconSVG(512)
  const svgPath = join(publicDir, 'icon.svg')
  writeFileSync(svgPath, svgBase, 'utf8')
  console.log('✅ icon.svg creado (512x512)')

  // Intentar usar sharp si está disponible
  let sharpAvailable = false
  try {
    const sharp = await import('sharp')
    sharpAvailable = true
    
    // Convertir SVG a PNG
    const svgBuffer = Buffer.from(svgBase)
    
    // Generar 192x192
    await sharp.default(svgBuffer)
      .resize(192, 192)
      .png()
      .toFile(join(publicDir, 'icon-192x192.png'))
    console.log('✅ icon-192x192.png creado')
    
    // Generar 512x512
    await sharp.default(svgBuffer)
      .resize(512, 512)
      .png()
      .toFile(join(publicDir, 'icon-512x512.png'))
    console.log('✅ icon-512x512.png creado')
    
    // Generar favicon 32x32
    await sharp.default(svgBuffer)
      .resize(32, 32)
      .png()
      .toFile(join(publicDir, 'favicon.png'))
    console.log('✅ favicon.png creado')
    
    console.log('\n🎉 ¡Todos los iconos generados exitosamente!')
    
  } catch (sharpError) {
    console.log('⚠️  Sharp no está disponible, generando instrucciones...')
    console.log('\n📝 Para generar los PNGs, ejecuta:')
    console.log('   npm install sharp')
    console.log('   node scripts/create-icons-simple.js')
    console.log('\n💡 O usa una herramienta online:')
    console.log('   https://convertio.co/svg-png/')
    console.log('   https://cloudconvert.com/svg-to-png')
    console.log('\n✅ Icono SVG generado en public/icon.svg')
    console.log('   Puedes convertirlo manualmente a PNG')
  }
  
} catch (error) {
  console.error('❌ Error generando iconos:', error.message)
  process.exit(1)
}

