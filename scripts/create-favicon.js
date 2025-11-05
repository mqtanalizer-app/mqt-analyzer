#!/usr/bin/env node

/**
 * Script para generar favicon.ico desde favicon.png
 */

import { existsSync, writeFileSync, readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = join(__dirname, '..')
const publicDir = join(rootDir, 'public')

// Intentar usar sharp para convertir PNG a ICO
async function createFavicon() {
  try {
    const sharp = await import('sharp')
    const faviconPng = join(publicDir, 'favicon.png')
    const faviconIco = join(publicDir, 'favicon.ico')
    
    if (!existsSync(faviconPng)) {
      console.error('❌ favicon.png no encontrado en public/')
      console.log('💡 Creando favicon.png desde icon-192x192.png...')
      
      const icon192 = join(publicDir, 'icon-192x192.png')
      if (existsSync(icon192)) {
        await sharp.default(icon192)
          .resize(32, 32)
          .png()
          .toFile(faviconPng)
        console.log('✅ favicon.png creado desde icon-192x192.png')
      } else {
        console.error('❌ icon-192x192.png tampoco existe')
        return false
      }
    }
    
    // Convertir PNG a ICO
    await sharp.default(faviconPng)
      .resize(32, 32)
      .toFormat('ico')
      .toFile(faviconIco)
    
    console.log('✅ favicon.ico generado exitosamente')
    return true
    
  } catch (error) {
    console.error('❌ Error generando favicon.ico:', error.message)
    console.log('\n💡 Solución alternativa:')
    console.log('   1. Renombra public/favicon.png a public/favicon.ico manualmente')
    console.log('   2. O usa una herramienta online: https://convertio.co/png-ico/')
    return false
  }
}

// Ejecutar
createFavicon().then(success => {
  if (success) {
    console.log('\n🎉 ¡Favicon.ico creado exitosamente!')
    process.exit(0)
  } else {
    process.exit(1)
  }
})

