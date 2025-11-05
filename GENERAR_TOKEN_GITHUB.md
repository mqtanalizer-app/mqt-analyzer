# 🔐 Generar Token de GitHub - Paso a Paso

## 📋 PASOS EXACTOS:

### PASO 1: Ir a la página de tokens

1. Abre tu navegador
2. Ve a: **https://github.com/settings/tokens**
3. O si prefieres navegar:
   - Ve a: https://github.com
   - Haz clic en tu foto de perfil (esquina superior derecha)
   - Haz clic en **"Settings"**
   - En el menú izquierdo, haz clic en **"Developer settings"** (al final)
   - Haz clic en **"Personal access tokens"**
   - Haz clic en **"Tokens (classic)"**

### PASO 2: Generar nuevo token

1. Haz clic en el botón **"Generate new token"**
2. Selecciona **"Generate new token (classic)"** (NO el otro)
3. Si GitHub te pide tu contraseña, ingrésala

### PASO 3: Configurar el token

1. **Note (Nombre del token):**
   - Escribe: `mqt-analyzer-push`
   - O cualquier nombre que quieras para identificar este token

2. **Expiration (Expiración):**
   - Selecciona: **90 days** (o el tiempo que prefieras)
   - Puedes elegir: 7 days, 30 days, 90 days, o Custom

3. **Select scopes (Permisos):**
   - **IMPORTANTE:** Marca la casilla **`repo`**
   - Esto dará acceso completo a los repositorios privados
   - Si necesitas más permisos, también puedes marcar:
     - `workflow` (si usas GitHub Actions)
     - `write:packages` (si publicas paquetes)

4. **Scroll down (Desplázate hacia abajo)**

5. Haz clic en el botón verde **"Generate token"**

### PASO 4: Copiar el token

1. **⚠️ IMPORTANTE:** GitHub te mostrará el token **SOLO UNA VEZ**
2. **COPIA EL TOKEN INMEDIATAMENTE**
3. Se verá algo como: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
4. **Guárdalo en un lugar seguro** (bloc de notas, password manager, etc.)

### PASO 5: Usar el token

Una vez que tengas el token, ejecuta estos comandos:

```powershell
cd C:\Users\Luis888\Desktop\mqt-analyzer
git remote set-url origin https://mqtanalizer-app:TU_TOKEN@github.com/mqtanalizer-app/mqt-analyzer.git
git push -u origin main
```

**Reemplaza `TU_TOKEN` con el token que copiaste.**

Ejemplo:
```powershell
git remote set-url origin https://mqtanalizer-app:ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx@github.com/mqtanalizer-app/mqt-analyzer.git
git push -u origin main
```

---

## 📝 Ejemplo de URL completa:

Si tu token es: `ghp_abc123def456ghi789`

Entonces ejecuta:
```powershell
git remote set-url origin https://mqtanalizer-app:ghp_abc123def456ghi789@github.com/mqtanalizer-app/mqt-analyzer.git
git push -u origin main
```

---

## ✅ Verificación:

Después de ejecutar `git push`, deberías ver:
```
Enumerating objects: X, done.
Counting objects: 100% (X/X), done.
Writing objects: 100% (X/X), done.
To https://github.com/mqtanalizer-app/mqt-analyzer.git
   main -> main
```

---

## 🆘 Si tienes problemas:

**Error: "Invalid username or password"**
- Verifica que copiaste el token completo
- Verifica que no hay espacios antes o después del token
- Verifica que usaste el usuario correcto: `mqtanalizer-app`

**Error: "Permission denied"**
- Verifica que marcaste la casilla `repo` al generar el token
- Verifica que el token no haya expirado

**Error: "Token not found"**
- Si perdiste el token, necesitas generar uno nuevo
- Los tokens solo se muestran una vez

---

## 📌 Notas Importantes:

- **El token es como una contraseña:** NO lo compartas
- **El token expira:** Si expira, genera uno nuevo
- **Puedes revocar el token:** En cualquier momento desde GitHub Settings
- **Guarda el token:** Puedes guardarlo en un gestor de contraseñas

