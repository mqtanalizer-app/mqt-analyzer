# 🎨 Crear Iconos para PWA

Para que la aplicación funcione como PWA (Progressive Web App) y se pueda instalar en dispositivos móviles, necesitas crear iconos.

## 📋 Iconos Necesarios

1. **icon-192x192.png** - Icono 192x192 píxeles
2. **icon-512x512.png** - Icono 512x512 píxeles

## 🎯 Opciones para Crear Iconos

### Opción 1: Usar Herramienta Online (Recomendado)

1. **Favicon.io:**
   - Visita: https://favicon.io/favicon-generator/
   - Crea un icono con texto "MQT" o usa un logo
   - Descarga los iconos PNG

2. **RealFaviconGenerator:**
   - Visita: https://realfavicongenerator.net/
   - Sube tu imagen
   - Genera todos los tamaños necesarios

### Opción 2: Usar Canva o Photoshop

1. Crea un diseño de 512x512 píxeles
2. Exporta como PNG
3. Redimensiona a 192x192 para el icono pequeño

### Opción 3: Usar Imagen Simple

Si tienes una imagen/logo:
1. Redimensiona a 512x512 píxeles
2. Redimensiona a 192x192 píxeles
3. Coloca ambos archivos en la carpeta `public/`

## 📁 Ubicación de los Archivos

Coloca los iconos en la carpeta `public/`:

```
mqt-analyzer/
  public/
    icon-192x192.png
    icon-512x512.png
    manifest.json (ya creado)
```

## ✅ Verificación

Después de crear los iconos:

1. Verifica que los archivos estén en `public/`
2. Verifica que `manifest.json` esté configurado correctamente
3. Ejecuta `npm run build` para verificar que todo funciona

## 🎨 Diseño Sugerido

- **Color de fondo:** #00C4CC (primary) o #121212 (dark)
- **Texto:** "MQT" en blanco o el logo de tu empresa
- **Formato:** PNG con transparencia
- **Estilo:** Moderno, minimalista, profesional

## 💡 Nota

Si no tienes iconos ahora, la aplicación funcionará igual, pero los usuarios no verán un icono personalizado al instalar la app en sus dispositivos.


