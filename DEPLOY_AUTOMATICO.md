# 🤖 Despliegue Automático en Render

## 🚀 Opción 1: Script Automático (Recomendado)

### Para Windows (PowerShell):

```powershell
# Ejecutar el script de automatización
.\scripts\auto-deploy-render.ps1
```

### Para Linux/Mac (Bash):

```bash
# Dar permisos de ejecución
chmod +x scripts/auto-deploy-render.sh

# Ejecutar el script
bash scripts/auto-deploy-render.sh
```

### O usar npm:

```bash
# Ejecutar preparación y build
npm run deploy:render
```

---

## 📋 ¿Qué hace el script automáticamente?

1. ✅ **Verifica archivos de configuración**
   - Crea `render.yaml` si no existe
   - Crea `.gitignore` si no existe

2. ✅ **Instala dependencias**
   - Ejecuta `npm install`

3. ✅ **Ejecuta build**
   - Ejecuta `npm run build` para verificar que funciona

4. ✅ **Verifica Git**
   - Verifica si es un repositorio Git
   - Opcionalmente hace commit y push automático

5. ✅ **Prepara todo**
   - Todo listo para desplegar en Render

---

## 🎯 Opción 2: Despliegue Manual (Paso a Paso)

### Paso 1: Preparar el proyecto

```bash
# Instalar dependencias
npm install

# Verificar que el build funciona
npm run build
```

### Paso 2: Subir a GitHub

```bash
# Si no tienes Git inicializado
git init
git add .
git commit -m "Initial commit - MQT Analyzer"

# Agregar repositorio remoto (reemplaza con tu URL)
git remote add origin https://github.com/TU_USUARIO/mqt-analyzer.git
git branch -M main
git push -u origin main
```

### Paso 3: Desplegar en Render

1. **Ir a Render:**
   - Visita: https://render.com
   - Inicia sesión con GitHub

2. **Crear Nuevo Servicio:**
   - Haz clic en "New +" en la esquina superior derecha
   - Selecciona "Blueprint" (recomendado) o "Static Site"

3. **Si usas Blueprint:**
   - Selecciona tu repositorio `mqt-analyzer`
   - Render detectará automáticamente el archivo `render.yaml`
   - Haz clic en "Apply"
   - ¡Listo! Render desplegará automáticamente

4. **Si usas Static Site:**
   - Name: `mqt-analyzer`
   - Repository: Selecciona tu repositorio
   - Branch: `main`
   - Build Command: `npm run build`
   - Publish Directory: `dist`
   - Haz clic en "Create Static Site"

### Paso 4: Obtener URL

Una vez desplegado, obtendrás una URL como:
- `mqt-analyzer.onrender.com`

---

## ⚙️ Configuración Automática con render.yaml

El archivo `render.yaml` ya está configurado y Render lo detectará automáticamente:

```yaml
services:
  - type: web
    name: mqt-analyzer
    env: static
    buildCommand: npm run build
    staticPublishPath: ./dist
    routes:
      - type: rewrite
        source: /*
        destination: /index.html
```

---

## 🔄 Actualizaciones Automáticas

Una vez conectado a GitHub, Render desplegará automáticamente cada vez que hagas `git push`:

```bash
# Hacer cambios en tu código
git add .
git commit -m "Actualización de funcionalidades"
git push origin main

# Render detectará el cambio y desplegará automáticamente
```

---

## 🔧 Solución de Problemas

### Error: "Build failed"

1. Verifica que el build funciona localmente:
   ```bash
   npm run build
   ```

2. Revisa los logs en Render:
   - Ve a tu servicio en Render
   - Haz clic en "Logs"
   - Revisa los mensajes de error

### Error: "Cannot find module"

1. Verifica que todas las dependencias estén en `package.json`:
   ```bash
   npm install
   ```

2. Verifica que no haya dependencias faltantes

### Error: "404 Not Found"

1. Verifica que `Publish Directory` sea `dist`
2. Verifica que el build se complete correctamente
3. Asegúrate de que `index.html` esté en `dist`

---

## ✅ Checklist Pre-Despliegue

- [ ] Código subido a GitHub
- [ ] `npm run build` funciona localmente
- [ ] Archivo `render.yaml` existe
- [ ] Archivo `.gitignore` configurado correctamente
- [ ] Todas las dependencias en `package.json`

---

## 🎉 ¡Listo!

Después de ejecutar el script o seguir los pasos manuales:

1. Ve a https://render.com
2. Conecta tu repositorio
3. Render detectará automáticamente la configuración
4. ¡Tu app estará en línea en 3-5 minutos!

**URL:** `https://mqt-analyzer.onrender.com`

---

## 💡 Pro Tips

1. **Dominio Personalizado:**
   - Ve a Settings > Custom Domains
   - Agrega tu dominio personalizado gratis

2. **Variables de Entorno:**
   - Si necesitas variables de entorno, agrégalas en Environment > Environment Variables

3. **Monitoreo:**
   - Render te enviará un email si el despliegue falla
   - Puedes ver los logs en tiempo real

4. **Rollback:**
   - Puedes hacer rollback a una versión anterior desde Render

---

## 🆘 ¿Necesitas Ayuda?

Si tienes problemas:
1. Revisa los logs en Render
2. Verifica que `npm run build` funcione localmente
3. Asegúrate de que tu código esté en GitHub
4. Revisa la documentación de Render

¡Buena suerte con tu despliegue! 🚀

