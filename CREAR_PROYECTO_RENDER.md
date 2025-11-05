# 🚀 CREAR PROYECTO EN RENDER - PASO A PASO

## ⚠️ EL PROYECTO NO EXISTE EN RENDER
Necesitas crearlo desde cero.

## 📋 PASOS EXACTOS:

### 1. Subir a GitHub PRIMERO:

```powershell
cd C:\Users\Luis888\Desktop\mqt-analyzer

# Si NO tienes el repositorio en GitHub, créalo primero:
# 1. Ve a https://github.com
# 2. Crea un nuevo repositorio llamado "mqt-analyzer"
# 3. NO marques ninguna opción
# 4. Copia la URL que te da GitHub

# Luego ejecuta (reemplaza TU_USUARIO con tu usuario de GitHub):
git remote add origin https://github.com/TU_USUARIO/mqt-analyzer.git
git branch -M main
git push -u origin main
```

### 2. Crear proyecto en Render:

1. Ve a: https://render.com
2. Inicia sesión
3. Haz clic en **"New +"** → **"Static Site"**
4. **Connect GitHub** → Autoriza Render
5. Selecciona tu repositorio **`mqt-analyzer`**
6. **Name:** `mqt-analyzer`
7. **Branch:** `main`
8. **Build Command:** `npm install && npm run build`
9. **Publish Directory:** `dist`
10. Haz clic en **"Create Static Site"**

### 3. Esperar 3-5 minutos

Render construirá el proyecto automáticamente.

### 4. Verificar

El sitio estará en: `https://mqt-analyzer.onrender.com`

---

## ✅ RESULTADO:

Después de estos pasos:
- ✅ Proyecto en GitHub
- ✅ Proyecto en Render
- ✅ Sitio funcionando
- ✅ Errores 404 resueltos

---

## 🆘 Si tienes problemas:

**Error: "Repository not found"**
- Verifica que el repositorio existe en GitHub
- Verifica que usaste el usuario correcto

**Error: "No se puede conectar a GitHub"**
- Ve a Render → Settings → Integrations
- Conecta tu cuenta de GitHub

