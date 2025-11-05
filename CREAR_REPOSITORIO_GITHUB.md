# 🚀 CREAR REPOSITORIO EN GITHUB

## ❌ El repositorio NO existe en GitHub

Necesitas crearlo primero.

## 📋 PASOS EXACTOS:

### 1. Crear repositorio en GitHub:

1. Ve a: https://github.com/mqtanalizer-app
2. Haz clic en **"New repository"** (botón verde)
3. **Repository name:** `mqt-analyzer`
4. **Description:** "MQT Analyzer - Advanced Crypto Token Analysis Platform"
5. **Public** o **Private** (tu elección)
6. **NO marques** ninguna opción:
   - ❌ NO marques "Add a README file"
   - ❌ NO marques "Add .gitignore"
   - ❌ NO marques "Choose a license"
7. Haz clic en **"Create repository"**

### 2. Después de crear el repositorio:

Ejecuta estos comandos:

```powershell
cd C:\Users\Luis888\Desktop\mqt-analyzer
git remote add origin https://github.com/mqtanalizer-app/mqt-analyzer.git
git branch -M main
git push -u origin main
```

### 3. Crear proyecto en Render:

1. Ve a: https://render.com
2. Inicia sesión
3. Haz clic en **"New +"** → **"Static Site"**
4. **Connect GitHub** → Autoriza Render
5. Selecciona tu repositorio **`mqt-analyzer`**
6. **Name:** `mqt-analyzer`
7. **Build Command:** `npm install && npm run build`
8. **Publish Directory:** `dist`
9. Haz clic en **"Create Static Site"**

---

## ✅ RESULTADO:

Después de estos pasos:
- ✅ Repositorio en GitHub
- ✅ Proyecto en Render
- ✅ Sitio funcionando en: https://mqt-analyzer.onrender.com
- ✅ Errores 404 resueltos

