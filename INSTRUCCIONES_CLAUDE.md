# 🤖 CÓMO USAR CLAUDE AI - INSTRUCCIONES COMPLETAS

> **Copyright © 2025 LELC & JTH Tecnology. Todos los derechos reservados.**

## 🚀 PASOS PARA CONFIGURAR CLAUDE AI

### Paso 1: Obtener API Key de Anthropic

1. Ve a: **https://console.anthropic.com/**
2. Crea una cuenta o inicia sesión
3. Ve a **"API Keys"** en el menú
4. Haz clic en **"Create Key"**
5. Copia tu API key (formato: `sk-ant-api03-...`)

### Paso 2: Configurar API Key en la Aplicación

1. Abre la aplicación MQT Analyzer
2. Ve a **"Claude AI Assistant"**
3. Haz clic en **"Configurar API Key"** (botón amarillo en la parte superior)
4. Pega tu API key
5. Haz clic en **"Guardar"**

### Paso 3: Iniciar el Backend Proxy

**IMPORTANTE:** La API de Claude no funciona directamente desde el navegador por CORS. Necesitas un backend proxy.

#### Opción A: Usar el Backend Proxy Incluido

1. Abre una terminal en la carpeta `mqt-analyzer`
2. Instala las dependencias del servidor:
   ```bash
   npm install
   ```

3. Crea un archivo `.env` en la carpeta `mqt-analyzer`:
   ```env
   CLAUDE_API_KEY=sk-ant-api03-tu-api-key-aqui
   PORT=3003
   ```

4. Inicia el servidor proxy:
   ```bash
   npm run server
   ```

5. Deberías ver:
   ```
   🚀 Claude AI Proxy Server running on port 3003
   📡 Endpoint: http://localhost:3003/api/claude/ask
   ```

6. Mantén esta terminal abierta mientras usas la aplicación

### Paso 4: Probar Claude AI

1. En la aplicación, ve a **"Claude AI Assistant"**
2. Haz una pregunta en el chat
3. Claude AI debería responder

## ⚠️ PROBLEMAS COMUNES

### Error: "Claude API key no configurada"

**Solución:** Configura tu API key en la aplicación (Paso 2)

### Error: "Error de CORS" o "Error al comunicarse con Claude AI"

**Solución:** Asegúrate de que el backend proxy esté corriendo (Paso 3)

### Error: "API key inválida"

**Solución:** Verifica que tu API key sea correcta y esté activa en Anthropic Console

### Error: "Límite de solicitudes excedido"

**Solución:** Has alcanzado el límite de tu plan de Anthropic. Espera unos minutos o actualiza tu plan

## 📝 NOTAS

- El backend proxy debe estar corriendo mientras uses Claude AI
- La API key se guarda localmente en tu navegador (nunca se comparte)
- Puedes configurar la API key en el `.env` del backend también (recomendado para producción)

## 🔧 CONFIGURACIÓN AVANZADA

### Cambiar Puerto del Backend

Si quieres usar otro puerto, edita el archivo `.env`:
```env
PORT=3004
```

Y actualiza `vite.config.ts` si es necesario.

### Usar API Key en el Backend

En lugar de configurar la API key en la aplicación, puedes ponerla en el `.env` del backend:

```env
CLAUDE_API_KEY=sk-ant-api03-tu-api-key-aqui
```

En este caso, no necesitas configurar la API key en la aplicación (el backend la usará automáticamente).

## ✅ CHECKLIST

- [ ] API key de Anthropic obtenida
- [ ] API key configurada en la aplicación (o en `.env`)
- [ ] Backend proxy corriendo (`npm run server`)
- [ ] Aplicación abierta y funcionando
- [ ] Pregunta enviada a Claude AI
- [ ] Respuesta recibida correctamente

## 🆘 AYUDA

Si tienes problemas:
1. Verifica que el backend proxy esté corriendo
2. Verifica que tu API key sea correcta
3. Revisa la consola del navegador para errores
4. Revisa los logs del servidor proxy

---

**¡Listo! Ahora Claude AI debería funcionar correctamente.** 🎉

