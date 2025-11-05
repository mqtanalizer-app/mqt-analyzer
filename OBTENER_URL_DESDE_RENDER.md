# 🔍 Obtener URL del Repositorio desde Render

## Si el proyecto ya está en Render:

### Paso 1: Obtener la URL del repositorio desde Render

1. Ve a: https://render.com
2. Inicia sesión
3. Ve a tu servicio `mqt-analyzer`
4. Haz clic en **"Settings"** (Configuración)
5. Ve a la sección **"GitHub"** o **"Repository"**
6. Ahí verás la URL del repositorio de GitHub
7. Copia esa URL (ejemplo: `https://github.com/tu-usuario/mqt-analyzer.git`)

### Paso 2: Conectar el repositorio local

Ejecuta estos comandos en PowerShell:

```powershell
cd C:\Users\Luis888\Desktop\mqt-analyzer
git remote add origin [URL_QUE_COPIASTE_DE_RENDER]
git branch -M main
git push -u origin main
```

**Reemplaza `[URL_QUE_COPIASTE_DE_RENDER]` con la URL que copiaste de Render.**

---

## Alternativa: Obtener desde GitHub directamente

1. Ve a: https://github.com
2. Inicia sesión
3. Busca tu repositorio `mqt-analyzer`
4. Haz clic en el repositorio
5. Haz clic en el botón verde **"Code"**
6. Copia la URL (ejemplo: `https://github.com/tu-usuario/mqt-analyzer.git`)
7. Ejecuta los comandos de arriba con esa URL

---

## ✅ Después de hacer push:

Render detectará automáticamente los cambios y actualizará el sitio en 3-5 minutos.

