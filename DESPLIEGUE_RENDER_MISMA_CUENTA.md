# 🚀 Desplegar MQT en la MISMA cuenta de Render donde está Bright Works

## ⚠️ IMPORTANTE: El proyecto MQT debe estar en GitHub primero

## Paso 1: Verificar si el proyecto está en GitHub

Abre PowerShell en: `C:\Users\Luis888\Desktop\mqt-analyzer`

```powershell
# Verificar si hay un repositorio remoto configurado
git remote -v
```

**Si NO aparece nada:**
- El proyecto NO está en GitHub
- Necesitas subirlo primero (ve al Paso 2)

**Si aparece una URL de GitHub:**
- El proyecto YA está en GitHub
- Puedes ir directamente al Paso 3

---

## Paso 2: Subir el proyecto a GitHub (si no está)

### 2.1: Crear repositorio en GitHub

1. Ve a: https://github.com
2. Haz clic en **"New repository"** (botón verde o "+" arriba)
3. **Name:** `mqt-analyzer`
4. **Description:** "MQT Analyzer - Advanced Crypto Token Analysis Platform"
5. **Public** o **Private** (tu elección)
6. **NO marques** ninguna opción (README, .gitignore, license)
7. Haz clic en **"Create repository"**

### 2.2: Subir código a GitHub

En PowerShell (en `C:\Users\Luis888\Desktop\mqt-analyzer`):

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

---

## Paso 3: Crear proyecto en Render (misma cuenta)

1. Ve a: https://render.com
2. **Asegúrate de estar logueado con la MISMA cuenta donde está "Bright Works"**
3. Haz clic en **"New +"** (esquina superior derecha)
4. Selecciona **"Static Site"**

### 3.1: Conectar repositorio

1. Si no aparece `mqt-analyzer`, haz clic en **"Configure account"** o **"Connect GitHub"**
2. Autoriza a Render para acceder a tus repositorios
3. Una vez conectado, busca `mqt-analyzer` en la lista
4. Selecciona `mqt-analyzer`

### 3.2: Configurar el servicio

- **Name:** `mqt-analyzer` (o el nombre que prefieras)
- **Branch:** `main`
- **Root Directory:** (deja vacío)
- **Build Command:** `npm run build`
- **Publish Directory:** `dist`
- **Environment:** `Static Site`

### 3.3: Crear el servicio

1. Haz clic en **"Create Static Site"**
2. Render comenzará a construir tu aplicación
3. Espera 3-5 minutos mientras Render construye tu app

---

## Paso 4: Obtener tu link

Una vez desplegado:
- Verás la URL en la parte superior del servicio
- Será: `https://mqt-analyzer.onrender.com`
- **Ese es tu link de Render** ✅

---

## ✅ Resultado

Después de estos pasos:
- Verás **2 proyectos** en tu Dashboard de Render:
  1. **brightworks** (ya existe)
  2. **mqt-analyzer** (recién creado)

Ambos en la misma cuenta de Render.

---

## 🆘 Si tienes problemas

### Error: "Repository not found"
- Verifica que el repositorio existe en GitHub
- Verifica que conectaste tu cuenta de GitHub en Render
- Ve a Settings > Integrations y verifica GitHub

### Error: "Build failed"
- Ejecuta `npm run build` localmente primero
- Verifica que no haya errores
- Revisa los logs en Render

### No aparece el repositorio en Render
- Verifica que conectaste tu cuenta de GitHub en Render
- Ve a Settings > Integrations > GitHub
- Autoriza a Render para acceder a tus repositorios

---

## 📝 Notas

- **Usa la misma cuenta de Render** donde está "Bright Works"
- **El proyecto aparecerá en tu Dashboard** después de crearlo
- **La URL será permanente** una vez desplegado
- **Ambos proyectos estarán en la misma cuenta**

