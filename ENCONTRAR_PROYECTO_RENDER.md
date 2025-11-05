# 🔍 Encontrar o Crear Proyecto en Render

## ❌ Problema:
No ves tu proyecto `mqt-analyzer` en Render.

## 🔍 Posibles Causas:

### 1. El proyecto no existe en Render
- El proyecto nunca fue creado en Render
- O fue eliminado

### 2. El proyecto está en otra cuenta
- Está en una cuenta diferente de Render
- Está en un equipo diferente

### 3. El nombre del proyecto es diferente
- Puede tener otro nombre en Render
- Puede estar en un proyecto diferente

## ✅ Solución:

### Paso 1: Verificar en Render

1. Ve a: https://render.com
2. **Inicia sesión** (si no estás logueado)
3. Ve a tu **Dashboard**
4. Busca en la lista de servicios:
   - Busca por `mqt-analyzer`
   - Busca por `mqt`
   - Busca por `analyzer`
   - Revisa todos los servicios

### Paso 2: Si NO encuentras el proyecto

**Necesitas CREAR el proyecto en Render:**

1. Ve a: https://render.com
2. Inicia sesión
3. Haz clic en **"New +"** (botón verde)
4. Selecciona **"Static Site"**
5. **Connect GitHub** → Conecta tu cuenta de GitHub
6. Selecciona tu repositorio `mqt-analyzer`
   - Si no aparece, haz clic en **"Configure account"** o **"Connect GitHub"**
7. **Name:** `mqt-analyzer`
8. **Build Command:** `npm install && npm run build`
9. **Publish Directory:** `dist`
10. Haz clic en **"Create Static Site"**

### Paso 3: Si encuentras el proyecto

1. Haz clic en el servicio `mqt-analyzer`
2. Ve a **Settings** (Configuración)
3. Ve a la sección **GitHub** o **Repository**
4. Copia la URL del repositorio de GitHub
5. Ejecuta estos comandos:

```powershell
cd C:\Users\Luis888\Desktop\mqt-analyzer
git remote add origin [URL_QUE_COPIASTE]
git branch -M main
git push -u origin main
```

---

## 📝 Notas Importantes:

- **Si el proyecto no existe:** Necesitas crearlo en Render
- **Si el proyecto existe:** Necesitas obtener la URL del repositorio de GitHub desde Render
- **Después de crear/conectar:** Render actualizará automáticamente cuando hagas `git push`

---

## 🆘 Si sigues sin ver el proyecto:

1. Verifica que estás en la cuenta correcta de Render
2. Verifica que estás en el equipo correcto (si usas equipos)
3. Busca en todos los servicios, no solo en "Static Sites"
4. Verifica si hay proyectos archivados o eliminados

