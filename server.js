// Backend Proxy para Claude AI
// Evita problemas de CORS

import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import Anthropic from '@anthropic-ai/sdk'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3003

app.use(cors())
app.use(express.json())

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY || ''
})

const SYSTEM_PROMPT = `Eres un experto asesor financiero especializado en criptomonedas y análisis técnico.
Tu especialidad es el token MQT (Market Quantum Tool).

INSTRUCCIONES:
- Proporciona respuestas detalladas y fundamentadas
- Incluye análisis técnico cuando sea relevante
- Menciona riesgos y advertencias cuando sea apropiado
- Sé honesto sobre limitaciones y riesgos
- Usa datos actuales cuando sea posible
- Proporciona recomendaciones claras y accionables
- Responde siempre en español de manera profesional y clara
- Si no tienes información específica, dilo honestamente

CONTEXTO ACTUAL DE MQT (Market Quantum Tool):
Token: MQT (Market Quantum Tool)
Precio Actual: $0.001234
Market Cap: $1.25M
Liquidez: $125K
Holders: 1,250
Volumen 24h: $450K
Security Score: 85/100 (Excelente)
Top 10 Holders: 15% del supply
Sentiment: +0.75 (Muy Positivo)
Liquidez Bloqueada: Hasta 2026
Ownership: Renounceable
Reentrancy: Protegido
Mint Function: Deshabilitada`

app.post('/api/claude/ask', async (req, res) => {
  try {
    const { question, history, apiKey } = req.body

    if (!question) {
      return res.status(400).json({ error: 'Question is required' })
    }

    // Usar API key del request o del environment
    const key = apiKey || process.env.CLAUDE_API_KEY

    if (!key) {
      return res.status(400).json({ 
        error: 'Claude API key no configurada. Por favor, configura tu API key.' 
      })
    }

    const client = new Anthropic({ apiKey: key })

    // Construir mensajes
    const messages = [
      ...(history || []).map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      })),
      {
        role: 'user',
        content: question
      }
    ]

    const response = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: messages
    })

    const content = response.content[0]?.type === 'text' 
      ? response.content[0].text 
      : ''

    res.json({ content })
  } catch (error) {
    console.error('Claude API Error:', error)
    
    let errorMessage = 'Error al comunicarse con Claude AI.'
    
    if (error.status === 401) {
      errorMessage = 'API key inválida. Por favor, verifica tu API key.'
    } else if (error.status === 429) {
      errorMessage = 'Límite de solicitudes excedido. Por favor, intenta más tarde.'
    } else if (error.message) {
      errorMessage = error.message
    }
    
    res.status(error.status || 500).json({ error: errorMessage })
  }
})

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Claude AI Proxy Server' })
})

app.listen(PORT, () => {
  console.log(`🚀 Claude AI Proxy Server running on port ${PORT}`)
  console.log(`📡 Endpoint: http://localhost:${PORT}/api/claude/ask`)
})

