# 🔗 Conectar a GitHub - Paso a Paso

## ❌ Error Detectado:
Estás usando `TU_USUARIO` en lugar de tu usuario real de GitHub.

## ✅ Solución:

### Opción 1: Si ya tienes el repositorio en GitHub

1. Ve a: https://github.com
2. Busca tu repositorio `mqt-analyzer`
3. Copia la URL del repositorio (ejemplo: `https://github.com/tu-usuario-real/mqt-analyzer.git`)
4. Ejecuta estos comandos:

```powershell
cd C:\Users\Luis888\Desktop\mqt-analyzer
git remote add origin https://github.com/TU_USUARIO_REAL/mqt-analyzer.git
git branch -M main
git push -u origin main
```

**Reemplaza `TU_USUARIO_REAL` con tu usuario de GitHub real.**

### Opción 2: Crear nuevo repositorio en GitHub

1. Ve a: https://github.com
2. Haz clic en **"New repository"** (botón verde)
3. **Name:** `mqt-analyzer`
4. **Description:** "MQT Analyzer - Advanced Crypto Token Analysis Platform"
5. **Public** o **Private** (tu elección)
6. **NO marques** ninguna opción (README, .gitignore, license)
7. Haz clic en **"Create repository"**
8. GitHub te mostrará la URL del repositorio
9. Copia esa URL y ejecuta:

```powershell
cd C:\Users\Luis888\Desktop\mqt-analyzer
git remote add origin https://github.com/TU_USUARIO_REAL/mqt-analyzer.git
git branch -M main
git push -u origin main
```

**Reemplaza `TU_USUARIO_REAL` con tu usuario de GitHub real.**

---

## 📝 Cómo encontrar tu usuario de GitHub:

1. Ve a: https://github.com
2. Inicia sesión
3. Tu usuario aparece en la esquina superior derecha
4. O ve a tu perfil: https://github.com/TU_USUARIO

---

## 🔍 Si no sabes tu usuario de GitHub:

1. Ve a: https://github.com
2. Inicia sesión
3. Haz clic en tu foto de perfil (esquina superior derecha)
4. Tu usuario aparece en la URL o en tu perfil

---

## ✅ Después de hacer push:

Render actualizará automáticamente:
- Detectará los cambios en 1-2 minutos
- Iniciará un nuevo build
- Actualizará el sitio en 3-5 minutos
- Los errores 404 desaparecerán

---

## 🆘 Si tienes problemas:

### Error: "Repository not found"
- Verifica que el repositorio existe en GitHub
- Verifica que usaste el nombre correcto del usuario
- Verifica que tienes permisos para acceder al repositorio

### Error: "Authentication failed"
- Necesitas autenticarte con GitHub
- Usa: `git remote set-url origin https://TU_USUARIO:TOKEN@github.com/TU_USUARIO/mqt-analyzer.git`
- O configura GitHub CLI: `gh auth login`

