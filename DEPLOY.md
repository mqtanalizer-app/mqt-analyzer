# 🚀 Guía de Despliegue - MQT Analyzer

Esta guía te ayudará a desplegar la aplicación MQT Analyzer en diferentes plataformas gratuitas.

## 📋 Opciones de Despliegue Gratuitas

### 1. **Vercel** (Recomendado - Más fácil) ⭐
- ✅ **Gratis** con dominio personalizado
- ✅ Despliegue automático desde GitHub
- ✅ CDN global (muy rápido)
- ✅ SSL automático
- ✅ Soporte para Vite/React perfecto

### 2. **Netlify**
- ✅ **Gratis** con dominio personalizado
- ✅ Despliegue automático desde GitHub
- ✅ CDN global
- ✅ SSL automático
- ✅ Formularios y funciones serverless

### 3. **Render**
- ✅ **Gratis** (con limitaciones)
- ✅ Dominio personalizado
- ✅ SSL automático
- ⚠️ Puede tardar en "despertar" después de inactividad

### 4. **Cloudflare Pages**
- ✅ **Gratis** ilimitado
- ✅ CDN global (muy rápido)
- ✅ SSL automático
- ✅ Integración con GitHub

---

## 🎯 Opción 1: Desplegar en Vercel (MÁS FÁCIL)

### Pasos:

1. **Preparar el repositorio:**
   ```bash
   # Asegúrate de que tu código esté en GitHub
   git add .
   git commit -m "Preparar para despliegue"
   git push origin main
   ```

2. **Ir a Vercel:**
   - Visita: https://vercel.com
   - Inicia sesión con GitHub
   - Haz clic en "Add New Project"
   - Selecciona tu repositorio `mqt-analyzer`

3. **Configuración:**
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **Desplegar:**
   - Haz clic en "Deploy"
   - ¡Listo! En 2-3 minutos tendrás tu app en línea

5. **URL:**
   - Obtendrás una URL como: `mqt-analyzer-xxxxx.vercel.app`
   - Puedes agregar dominio personalizado después

---

## 🎯 Opción 2: Desplegar en Netlify

### Pasos:

1. **Preparar el repositorio:**
   ```bash
   git add .
   git commit -m "Preparar para despliegue"
   git push origin main
   ```

2. **Ir a Netlify:**
   - Visita: https://netlify.com
   - Inicia sesión con GitHub
   - Haz clic en "Add new site" > "Import an existing project"
   - Selecciona tu repositorio

3. **Configuración:**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Base directory: (deja vacío)

4. **Desplegar:**
   - Haz clic en "Deploy site"
   - ¡Listo!

5. **URL:**
   - Obtendrás una URL como: `mqt-analyzer-xxxxx.netlify.app`

---

## 🎯 Opción 3: Desplegar en Render

### Pasos:

1. **Crear archivo `render.yaml`** (ya creado en el proyecto)

2. **Ir a Render:**
   - Visita: https://render.com
   - Inicia sesión con GitHub
   - Haz clic en "New +" > "Static Site"

3. **Configuración:**
   - Name: `mqt-analyzer`
   - Environment: `Static Site`
   - Build Command: `npm run build`
   - Publish Directory: `dist`
   - Branch: `main`

4. **Desplegar:**
   - Haz clic en "Create Static Site"
   - Espera a que termine el build

5. **URL:**
   - Obtendrás una URL como: `mqt-analyzer.onrender.com`

---

## 🎯 Opción 4: Desplegar en Cloudflare Pages

### Pasos:

1. **Ir a Cloudflare:**
   - Visita: https://pages.cloudflare.com
   - Inicia sesión con GitHub
   - Haz clic en "Create a project"

2. **Configuración:**
   - Connect to Git: Selecciona tu repositorio
   - Framework preset: **Vite**
   - Build command: `npm run build`
   - Build output directory: `dist`

3. **Desplegar:**
   - Haz clic en "Save and Deploy"
   - ¡Listo!

4. **URL:**
   - Obtendrás una URL como: `mqt-analyzer.pages.dev`

---

## ⚙️ Configuración Adicional

### Variables de Entorno (si las necesitas):

Si tienes variables de entorno, agrégalas en la configuración de cada plataforma:

1. **Vercel:** Settings > Environment Variables
2. **Netlify:** Site settings > Build & deploy > Environment variables
3. **Render:** Environment > Environment Variables
4. **Cloudflare:** Settings > Environment Variables

---

## 🔧 Solución de Problemas

### Error: "Build failed"
- Verifica que `npm run build` funcione localmente
- Revisa los logs de build en la plataforma

### Error: "Cannot find module"
- Asegúrate de que todas las dependencias estén en `package.json`
- No olvides hacer `npm install` antes de build

### Error: "404 Not Found"
- Verifica que el `output directory` sea `dist`
- Revisa que el build se complete correctamente

---

## 📝 Notas Importantes

1. **GitHub es necesario:** Todas estas plataformas requieren que tu código esté en GitHub/GitLab
2. **Dominio personalizado:** Todas las plataformas permiten agregar tu propio dominio gratis
3. **SSL automático:** Todas incluyen certificados SSL gratis
4. **Actualizaciones automáticas:** Cada vez que hagas `git push`, se desplegará automáticamente

---

## 🎉 Recomendación Final

**Para esta aplicación, recomiendo Vercel porque:**
- ✅ Es el más rápido de configurar
- ✅ Mejor rendimiento para React/Vite
- ✅ Mejor documentación
- ✅ Más fácil de usar

¿Necesitas ayuda con alguna plataforma específica? ¡Dímelo y te ayudo!

