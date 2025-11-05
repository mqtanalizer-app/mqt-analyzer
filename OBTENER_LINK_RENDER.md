# 🔗 Cómo Obtener tu Link de Render

## 🚀 Opción 1: Si ya desplegaste en Render

### Paso 1: Acceder a tu Dashboard de Render
1. Ve a: **https://render.com**
2. Inicia sesión con tu cuenta
3. Ve a **Dashboard** (tu lista de servicios)

### Paso 2: Encontrar tu Servicio
1. Busca tu servicio llamado **`mqt-analyzer`** (o el nombre que le diste)
2. Haz clic en el servicio

### Paso 3: Obtener la URL
1. En la página del servicio, verás la **URL** en la parte superior
2. Será algo como: `https://mqt-analyzer.onrender.com`
3. **Copia esa URL** - ese es tu link de Render

---

## 🆕 Opción 2: Si aún no has desplegado

### Paso 1: Preparar el Código
```bash
cd mqt-analyzer
npm run build
```

### Paso 2: Subir a GitHub (si no lo has hecho)
```bash
git add .
git commit -m "Preparado para Render"
git push origin main
```

### Paso 3: Desplegar en Render

1. **Ir a Render:**
   - Visita: https://render.com
   - Inicia sesión con GitHub

2. **Crear Nuevo Servicio:**
   - Haz clic en **"New +"** en la esquina superior derecha
   - Selecciona **"Static Site"**

3. **Configurar el Servicio:**
   - **Name:** `mqt-analyzer`
   - **Repository:** Selecciona tu repositorio `mqt-analyzer`
   - **Branch:** `main`
   - **Build Command:** `npm run build`
   - **Publish Directory:** `dist`

4. **Crear el Servicio:**
   - Haz clic en **"Create Static Site"**
   - Render comenzará a construir tu aplicación
   - Espera 3-5 minutos

5. **Obtener la URL:**
   - Una vez desplegado, verás la URL en la parte superior
   - Será: `https://mqt-analyzer.onrender.com`
   - **Esa es tu URL de Render** ✅

---

## 📝 Tu Link de Render será:

```
https://mqt-analyzer.onrender.com
```

O si le diste otro nombre:
```
https://TU-NOMBRE.onrender.com
```

---

## 🔍 Verificar tu Link

1. Abre la URL de Render en tu navegador
2. Deberías ver tu aplicación funcionando
3. Si ves la app, ¡tu link está funcionando correctamente!

---

## 💡 Tips

- **El link es permanente:** Una vez desplegado, el link no cambia
- **Actualizaciones automáticas:** Cada vez que hagas `git push`, Render actualizará automáticamente
- **Dominio personalizado:** Puedes agregar tu propio dominio en Settings > Custom Domains

---

## 🆘 ¿Necesitas Ayuda?

Si tienes problemas:
1. Verifica que el build funciona: `npm run build`
2. Revisa los logs en Render (sección "Logs")
3. Asegúrate de que el código esté en GitHub

---

## ✅ Listo

Una vez que tengas tu link de Render, podrás:
- Compartir tu aplicación con otros
- Acceder desde cualquier dispositivo
- Usar el QR code con esa URL
- Instalar la app PWA desde esa URL

**Tu link de Render:** `https://mqt-analyzer.onrender.com`

