# 🔐 Solución: Error de Permisos en GitHub

## ❌ Error:
```
remote: Permission to mqtanalizer-app/mqt-analyzer.git denied to Brightworkss.
```

## 🔍 Problema:
Estás autenticado con la cuenta **Brightworkss**, pero el repositorio pertenece a **mqtanalizer-app**.

## ✅ Solución:

### Opción 1: Autenticarse con la cuenta correcta (RECOMENDADO)

1. Ve a: https://github.com/settings/tokens
2. Inicia sesión con la cuenta **mqtanalizer-app**
3. Genera un **Personal Access Token**:
   - Haz clic en **"Generate new token"** → **"Generate new token (classic)"**
   - **Name:** `mqt-analyzer-push`
   - **Expiration:** 90 days (o el que prefieras)
   - Marca **`repo`** (Full control of private repositories)
   - Haz clic en **"Generate token"**
   - **COPIA EL TOKEN** (solo se muestra una vez)

4. Ejecuta estos comandos:

```powershell
cd C:\Users\Luis888\Desktop\mqt-analyzer
git remote set-url origin https://mqtanalizer-app:TU_TOKEN@github.com/mqtanalizer-app/mqt-analyzer.git
git push -u origin main
```

**Reemplaza `TU_TOKEN` con el token que copiaste.**

### Opción 2: Cambiar autenticación de Windows

1. Ve a: **Configuración de Windows** → **Cuentas** → **Credenciales**
2. Busca credenciales de GitHub
3. Elimina las credenciales de **Brightworkss**
4. Cuando hagas `git push`, Windows te pedirá autenticarte
5. Usa la cuenta **mqtanalizer-app** o el token

### Opción 3: Usar GitHub Desktop

1. Descarga GitHub Desktop: https://desktop.github.com/
2. Inicia sesión con la cuenta **mqtanalizer-app**
3. Abre el repositorio local
4. Haz clic en **"Push origin"**

---

## ✅ Después de solucionar los permisos:

1. Los cambios se subirán a GitHub
2. Render detectará los cambios automáticamente
3. Render actualizará el sitio en 3-5 minutos

---

## 🆘 Si sigues teniendo problemas:

**Verifica que estás autenticado con la cuenta correcta:**
- Ve a: https://github.com
- Verifica que estás logueado como **mqtanalizer-app**

