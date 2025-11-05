# 🚀 Desplegar MQT en Render AHORA

## ⚠️ IMPORTANTE: El proyecto MQT NO está en Render porque no está en GitHub

## Paso 1: Crear repositorio en GitHub

1. Ve a: https://github.com
2. Haz clic en **"New repository"** (botón verde o "+" arriba)
3. **Name:** `mqt-analyzer`
4. **Description:** "MQT Analyzer - Advanced Crypto Token Analysis Platform"
5. **Public** o **Private** (tu elección)
6. **NO marques** ninguna opción (README, .gitignore, license)
7. Haz clic en **"Create repository"**

## Paso 2: Subir código a GitHub

Abre PowerShell en: `C:\Users\Luis888\Desktop\mqt-analyzer`

```powershell
# 1. Agregar todos los cambios
git add .

# 2. Hacer commit
git commit -m "Preparado para desplegar en Render"

# 3. Agregar tu repositorio de GitHub (reemplaza TU_USUARIO con tu usuario de GitHub)
git remote add origin https://github.com/TU_USUARIO/mqt-analyzer.git

# 4. Subir a GitHub
git branch -M main
git push -u origin main
```

**IMPORTANTE:** Reemplaza `TU_USUARIO` con tu usuario de GitHub real.

## Paso 3: Crear proyecto en Render

1. Ve a: https://render.com
2. Asegúrate de estar logueado con la **misma cuenta** donde está "Bright Works"
3. Haz clic en **"New +"** (esquina superior derecha)
4. Selecciona **"Static Site"**

### Configurar el servicio:

- **Name:** `mqt-analyzer`
- **Repository:** Selecciona `mqt-analyzer` (debería aparecer después de conectar GitHub)
- **Branch:** `main`
- **Build Command:** `npm run build`
- **Publish Directory:** `dist`
- **Environment:** `Static Site`

5. Haz clic en **"Create Static Site"**
6. Espera 3-5 minutos mientras Render construye tu app

## Paso 4: Obtener tu link

Una vez desplegado:
- Verás la URL en la parte superior del servicio
- Será: `https://mqt-analyzer.onrender.com`
- **Ese es tu link de Render** ✅

## ✅ Resultado

Después de estos pasos:
- Verás **2 proyectos** en tu Dashboard de Render:
  1. **brightworks** (ya existe)
  2. **mqt-analyzer** (recién creado)

---

## 🆘 Si tienes problemas

### Error: "Repository not found"
- Verifica que el repositorio existe en GitHub
- Verifica que usaste el nombre correcto del usuario

### Error: "Build failed"
- Ejecuta `npm run build` localmente primero
- Verifica que no haya errores
- Revisa los logs en Render

### No aparece el repositorio en Render
- Verifica que conectaste tu cuenta de GitHub en Render
- Ve a Settings > Integrations y verifica GitHub

---

## 📝 Notas

- **Usa la misma cuenta de Render** donde está "Bright Works"
- **El proyecto aparecerá en tu Dashboard** después de crearlo
- **La URL será permanente** una vez desplegado

