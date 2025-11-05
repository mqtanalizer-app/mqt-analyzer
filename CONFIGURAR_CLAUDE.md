# 🤖 CONFIGURAR CLAUDE AI

> **Copyright © 2025 LELC & JTH Tecnology. Todos los derechos reservados.**

## 📋 CÓMO CONFIGURAR CLAUDE AI

### Paso 1: Obtener API Key de Anthropic

1. Ve a: https://console.anthropic.com/
2. Crea una cuenta o inicia sesión
3. Ve a "API Keys" en el menú
4. Haz clic en "Create Key"
5. Copia tu API key (formato: `sk-ant-api03-...`)

### Paso 2: Configurar en la Aplicación

1. Abre la aplicación MQT Analyzer
2. Ve a "Claude AI Assistant"
3. Haz clic en "Configurar API Key"
4. Pega tu API key
5. Haz clic en "Guardar"

### Paso 3: Probar

1. Haz una pregunta en el chat
2. Claude AI debería responder

## ⚠️ IMPORTANTE: CORS

**Problema:** La API de Anthropic no funciona directamente desde el navegador debido a CORS.

**Solución:** Necesitas un backend proxy. 

### Opción 1: Backend Proxy (Recomendado)

Crea un backend que actúe como proxy entre el frontend y la API de Claude:

```javascript
// Backend (Node.js/Express)
app.post('/api/claude', async (req, res) => {
  const { message, history } = req.body
  
  const response = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: history
  })
  
  res.json({ content: response.content[0].text })
})
```

### Opción 2: Usar Variable de Entorno

Si tienes un backend, puedes configurar la API key en el backend:

```bash
# .env (backend)
CLAUDE_API_KEY=sk-ant-api03-...
```

## 🔧 CONFIGURACIÓN ACTUAL

- **Frontend:** Intenta conectarse directamente (puede fallar por CORS)
- **Backend Proxy:** No implementado aún (requiere backend separado)

## 📝 NOTA

Para que Claude AI funcione completamente, necesitas:
1. Un backend proxy que maneje las llamadas a la API de Anthropic
2. O configurar la API key en el backend si ya tienes uno

¿Necesitas ayuda para crear el backend proxy?

