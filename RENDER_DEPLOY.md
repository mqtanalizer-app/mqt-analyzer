# 🚀 Desplegar MQT Analyzer en Render

## 📋 Pasos Rápidos

### 1. Preparar el Código
```bash
# Asegúrate de estar en el directorio del proyecto
cd mqt-analyzer

# Verifica que todo funcione
npm install
npm run build
```

### 2. Subir a GitHub
```bash
# Si aún no tienes un repositorio en GitHub
git init
git add .
git commit -m "Initial commit - MQT Analyzer"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/mqt-analyzer.git
git push -u origin main
```

### 3. Crear Proyecto en Render

1. **Ir a Render:**
   - Visita: https://render.com
   - Inicia sesión con GitHub

2. **Crear Nuevo Servicio:**
   - Haz clic en "New +" en la esquina superior derecha
   - Selecciona "Static Site"

3. **Configurar el Servicio:**
   - **Name:** `mqt-analyzer`
   - **Repository:** Selecciona tu repositorio `mqt-analyzer`
   - **Branch:** `main`
   - **Root Directory:** (deja vacío)
   - **Build Command:** `npm run build`
   - **Publish Directory:** `dist`
   - **Environment:** `Static Site`

4. **Desplegar:**
   - Haz clic en "Create Static Site"
   - Render comenzará a construir tu aplicación
   - Espera 3-5 minutos para que termine el build

5. **Obtener URL:**
   - Una vez desplegado, obtendrás una URL como: `mqt-analyzer.onrender.com`
   - Esta URL es permanente y gratuita

---

## 🔧 Configuración Adicional

### Agregar Dominio Personalizado

1. En Render, ve a tu servicio
2. Ve a "Settings" > "Custom Domains"
3. Agrega tu dominio
4. Configura los DNS según las instrucciones de Render

### Variables de Entorno (si las necesitas)

1. Ve a "Environment"
2. Agrega las variables necesarias:
   - `NODE_ENV=production`
   - Otras variables que tu app necesite

---

## ⚙️ Usar el archivo render.yaml (Alternativa)

Si prefieres usar el archivo `render.yaml` ya creado:

1. En Render, haz clic en "New +" > "Blueprint"
2. Conecta tu repositorio
3. Render detectará automáticamente el archivo `render.yaml`
4. Haz clic en "Apply" para desplegar

---

## 🔍 Verificar el Despliegue

1. Ve a tu servicio en Render
2. Haz clic en la URL proporcionada
3. Verifica que la aplicación cargue correctamente
4. Prueba todas las funcionalidades

---

## 🐛 Solución de Problemas

### Error: "Build failed"
- Verifica que `npm run build` funcione localmente
- Revisa los logs en Render
- Asegúrate de que todas las dependencias estén en `package.json`

### Error: "404 Not Found"
- Verifica que `Publish Directory` sea `dist`
- Revisa que el build se complete correctamente
- Asegúrate de que el archivo `index.html` esté en `dist`

### Error: "Cannot find module"
- Verifica que todas las dependencias estén en `package.json`
- Asegúrate de que `npm install` se ejecute antes del build

---

## ✅ Checklist Pre-Despliegue

- [ ] Código subido a GitHub
- [ ] `npm run build` funciona localmente
- [ ] Archivo `render.yaml` creado (opcional)
- [ ] Variables de entorno configuradas (si las necesitas)
- [ ] Dominio personalizado configurado (opcional)

---

## 🎉 ¡Listo!

Tu aplicación estará disponible en: `https://mqt-analyzer.onrender.com`

**Nota:** Render puede tardar unos segundos en "despertar" si ha estado inactivo por más de 15 minutos (plan gratuito).

---

## 💡 Consejos

1. **Monitoreo:** Render te enviará un email si el despliegue falla
2. **Actualizaciones:** Cada vez que hagas `git push`, Render desplegará automáticamente
3. **Logs:** Puedes ver los logs de build en tiempo real en Render
4. **Rollback:** Puedes hacer rollback a una versión anterior desde Render

