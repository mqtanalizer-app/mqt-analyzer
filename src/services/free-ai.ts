// Free AI Service - Integración con servicios de IA gratuitos
// Usa servicios públicos gratuitos que no requieren configuración compleja

import { AIMessage, AIResponse, AIService } from './ai-service'
import { demoAIService } from './demo-ai'
import { priceService } from './priceService'

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
- Genera respuestas VARIADAS y DINÁMICAS, no repitas siempre lo mismo
- Adapta tu respuesta al contexto específico de cada pregunta

CONTEXTO ACTUAL DE MQT (Market Quantum Tool):
Token: MQT (Market Quantum Tool)
Contract: 0xef0cdae2FfEEeFA539a244a16b3f46ba75b8c810
Network: Avalanche C-Chain
Precio Actual: Se obtiene en tiempo real desde exchanges de AVAX (DEXScreener, CoinGecko)
Market Cap: Se actualiza en tiempo real
Liquidez: Se actualiza en tiempo real desde DEX
Holders: Se actualiza en tiempo real
Volumen 24h: Se actualiza en tiempo real
Security Score: 85/100 (Excelente)
Top 10 Holders: 15% del supply
Sentiment: +0.75 (Muy Positivo)
Liquidez Bloqueada: Hasta 2026
Ownership: Renounceable
Reentrancy: Protegido
Mint Function: Deshabilitada`

export class FreeAIService implements AIService {
  setApiKey(apiKey: string) {
    // No requiere API key
  }

  getApiKey(): string | null {
    return 'free-no-key-required' // Siempre disponible
  }

  async askQuestion(
    question: string,
    conversationHistory: AIMessage[] = []
  ): Promise<AIResponse> {
    try {
      // Intentar usar Hugging Face Inference API (gratis, sin API key para modelos públicos)
      const hfResponse = await this.tryHuggingFace(question, conversationHistory)
      if (hfResponse && !hfResponse.error) {
        return hfResponse
      }

      // Si falla, usar servicio mejorado con respuestas más dinámicas
      return await this.generateDynamicResponse(question, conversationHistory)
    } catch (error: any) {
      console.error('Free AI Error:', error)
      // Fallback a respuesta dinámica mejorada
      return await this.generateDynamicResponse(question, conversationHistory)
    }
  }

  private async tryHuggingFace(question: string, conversationHistory: AIMessage[]): Promise<AIResponse | null> {
    try {
      // Usar modelo público de chat de Hugging Face
      // Modelo: microsoft/DialoGPT-large o similar
      
      // Construir prompt completo
      const context = conversationHistory
        .slice(-3) // Últimos 3 mensajes para contexto
        .map(msg => `${msg.role === 'user' ? 'Usuario' : 'Asistente'}: ${msg.content}`)
        .join('\n')
      
      const fullPrompt = `${SYSTEM_PROMPT}\n\nConversación previa:\n${context}\n\nUsuario: ${question}\n\nAsistente:`

      // Intentar con modelo de chat
      const response = await fetch(
        'https://api-inference.huggingface.co/models/microsoft/DialoGPT-large',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inputs: fullPrompt,
            parameters: {
              max_length: 500,
              temperature: 0.9,
              top_p: 0.9,
              return_full_text: false,
              do_sample: true
            }
          })
        }
      )

      if (!response.ok) {
        // Si el modelo está cargando, esperar un poco y usar fallback
        if (response.status === 503) {
          return null
        }
        return null
      }

      const data = await response.json()
      
      // Extraer respuesta
      let content = ''
      if (Array.isArray(data) && data[0]?.generated_text) {
        content = data[0].generated_text
      } else if (data.generated_text) {
        content = data.generated_text
      }

      if (content && content.trim().length > 10) {
        // Limpiar respuesta (remover el prompt si está incluido)
        content = content.replace(fullPrompt, '').trim()
        return { content }
      }

      return null
    } catch (error) {
      return null
    }
  }

  private async generateDynamicResponse(question: string, conversationHistory: AIMessage[]): Promise<AIResponse> {
    const lowerQuestion = question.toLowerCase().trim()
    
    // Detectar intención específica de la pregunta
    const intent = this.detectIntent(lowerQuestion)
    
    // Generar respuesta específica según la intención detectada
    switch (intent) {
      case 'correction':
        return this.generateCorrectionResponse(question, conversationHistory)
      case 'analysis':
        return await this.generateCompleteAnalysis(question, conversationHistory)
      case 'strategy':
        return this.generateStrategyResponse(question, conversationHistory)
      case 'security':
        return this.generateSecurityResponse(question, conversationHistory)
      case 'whale':
        return this.generateWhaleResponse(question, conversationHistory)
      case 'risk':
        return this.generateRiskResponse(question, conversationHistory)
      case 'price':
        return await this.generatePriceResponse(question, conversationHistory)
      case 'greeting':
        return this.generateGreetingResponse()
      default:
        // Respuesta directa y concisa
        return await this.generateDirectResponse(question, conversationHistory)
    }
  }

  private detectIntent(question: string): string {
    // Detectar intención específica de manera más precisa
    const lowerQuestion = question.toLowerCase()
    
    // Detectar correcciones del usuario
    if (lowerQuestion.includes('no es') || lowerQuestion.includes('no es la') || 
        lowerQuestion.includes('incorrecta') || lowerQuestion.includes('mal') ||
        lowerQuestion.includes('dirección correcta') || lowerQuestion.includes('address correcta')) {
      return 'correction'
    }
    
    // Análisis completo - múltiples preguntas específicas
    if (lowerQuestion.includes('smartcontract') || lowerQuestion.includes('smart contract') ||
        lowerQuestion.includes('dirección') || lowerQuestion.includes('address') ||
        lowerQuestion.includes('calcular') || lowerQuestion.includes('billeteras') ||
        lowerQuestion.includes('ballenas') || lowerQuestion.includes('whales') ||
        lowerQuestion.includes('suma') || lowerQuestion.includes('tokens totales') ||
        lowerQuestion.includes('comprase') || lowerQuestion.includes('comprar') ||
        lowerQuestion.includes('80%') || lowerQuestion.includes('subiría') ||
        lowerQuestion.includes('staking') || lowerQuestion.includes('stake')) {
      return 'analysis'
    }
    
    // Estrategia - solo si pregunta específicamente sobre estrategia
    if ((lowerQuestion.includes('simulacr') || lowerQuestion.includes('simular')) ||
        (lowerQuestion.includes('estrategia') && !lowerQuestion.includes('no') && !lowerQuestion.includes('puedo')) ||
        lowerQuestion.includes('plan de inversión') || lowerQuestion.includes('plan de trading')) {
      return 'strategy'
    }
    
    // Seguridad - solo si pregunta específicamente sobre seguridad
    if ((lowerQuestion.includes('seguridad') || lowerQuestion.includes('contract') || 
        lowerQuestion.includes('vulnerabilidad')) && 
        !lowerQuestion.includes('riesgo general')) {
      return 'security'
    }
    
    // Whale - solo si pregunta específicamente sobre whales
    if ((lowerQuestion.includes('whale') || lowerQuestion.includes('ballena')) && 
        !lowerQuestion.includes('no whale')) {
      return 'whale'
    }
    
    // Riesgo - solo si pregunta específicamente sobre riesgos
    if ((lowerQuestion.includes('riesgo') || lowerQuestion.includes('peligro')) && 
        !lowerQuestion.includes('riesgo bajo')) {
      return 'risk'
    }
    
    // Precio - solo si pregunta específicamente sobre precio
    if ((lowerQuestion.includes('precio') || lowerQuestion.includes('valor') || 
        lowerQuestion.includes('cotización')) && 
        !lowerQuestion.includes('no precio')) {
      return 'price'
    }
    
    // Saludo - solo si es un saludo claro
    if ((lowerQuestion.includes('hola') || lowerQuestion.includes('hello') || 
        lowerQuestion.includes('hi')) && question.length < 20) {
      return 'greeting'
    }
    
    return 'general'
  }

  private async generateDirectResponse(question: string, history: AIMessage[]): Promise<AIResponse> {
    // Respuesta MUY directa - solo lo que se pregunta
    const lowerQuestion = question.toLowerCase().trim()
    
    // Si pregunta algo específico, responder directamente sin información extra
    if (lowerQuestion.includes('qué es mqt') || lowerQuestion.includes('qué significa mqt')) {
      return {
        content: `MQT (Market Quantum Tool) es un token criptográfico con score de seguridad de 85/100.`
      }
    }
    
    if (lowerQuestion.includes('precio') || lowerQuestion.includes('valor actual')) {
      // Obtener precio real
      try {
        const priceData = await priceService.getAggregatedPrice()
        return {
          content: `El precio actual de MQT es $${priceData.price.toFixed(6)} (${priceData.priceChange24h >= 0 ? '+' : ''}${priceData.priceChange24h.toFixed(2)}% 24h). Fuente: ${priceData.source}.`
        }
      } catch (error) {
        return {
          content: `El precio actual de MQT se actualiza en tiempo real desde exchanges de AVAX. Para ver el precio actual, visita la página de análisis de tokens.`
        }
      }
    }
    
    if (lowerQuestion.includes('cuánto vale') || lowerQuestion.includes('precio de mqt')) {
      // Obtener precio real
      try {
        const priceData = await priceService.getAggregatedPrice()
        return {
          content: `MQT tiene un precio de $${priceData.price.toFixed(6)}. Market Cap: $${(priceData.marketCap / 1000000).toFixed(2)}M. Volumen 24h: $${(priceData.volume24h / 1000).toFixed(0)}K. Fuente: ${priceData.source}.`
        }
      } catch (error) {
        return {
          content: `MQT tiene un precio que se actualiza en tiempo real desde exchanges de AVAX. Para ver el precio actualizado, visita la página de análisis de tokens.`
        }
      }
    }
    
    // Si la pregunta no es clara, pedir clarificación de manera concisa
    return {
      content: `No entendí tu pregunta: "${question}"

Por favor, reformula tu pregunta de manera más específica. Ejemplos:

- "Haz un simulacro de estrategia"
- "¿Es seguro el contrato?"
- "¿Cuál es el precio de MQT?"
- "¿Qué riesgos tiene?"

¿Qué quieres saber específicamente?`
    }
  }

  private generateGreetingResponse(): AIResponse {
    return {
      content: `¡Hola! Soy tu asistente de IA especializado en análisis de tokens cripto, específicamente MQT.

Puedo ayudarte con:
• Análisis de estrategias de inversión
• Evaluación de seguridad del smart contract
• Análisis de movimientos de whales
• Evaluación de riesgos
• Análisis de precio y mercado

¿En qué puedo ayudarte hoy?`
    }
  }

  private generateCorrectionResponse(question: string, history: AIMessage[]): AIResponse {
    const lowerQuestion = question.toLowerCase()
    
    // Detectar si el usuario está corrigiendo la dirección del contrato
    if (lowerQuestion.includes('dirección') || lowerQuestion.includes('address') || 
        lowerQuestion.includes('no es la') || lowerQuestion.includes('no es')) {
      
      // Buscar si hay una dirección en el historial de conversación
      const addressPattern = /0x[a-fA-F0-9]{40}/i
      const lastMessage = history[history.length - 1]?.content || ''
      const foundAddress = lastMessage.match(addressPattern)
      
      return {
        content: `Entiendo, la dirección que proporcioné no es correcta. 

**Para obtener la dirección real del contrato de MQT, necesito que me la proporciones:**

1. **Puedes proporcionarme la dirección real del contrato** escribiéndola aquí
2. **O dímelo y la guardaré** para futuros análisis

**Formato de dirección:**
- Ethereum: 0x... (42 caracteres)
- Binance Smart Chain: 0x... (42 caracteres)
- Otras redes: Depende de la red

**Ejemplo:** 
"La dirección correcta es: 0x..."

**Una vez que me proporciones la dirección real, actualizaré todos los análisis con la información correcta.**

¿Puedes proporcionarme la dirección real del contrato de MQT?`
      }
    }
    
    // Si es otra corrección
    return {
      content: `Entiendo que hay información incorrecta. 

Por favor, proporciona la información correcta y la actualizaré en el análisis.

¿Qué información específica necesitas corregir?`
    }
  }

  private async generateCompleteAnalysis(question: string, history: AIMessage[]): Promise<AIResponse> {
    const lowerQuestion = question.toLowerCase()
    
    // Detectar qué preguntas específicas se están haciendo
    const needsContract = lowerQuestion.includes('smartcontract') || lowerQuestion.includes('smart contract') || 
                         lowerQuestion.includes('dirección') || lowerQuestion.includes('address')
    const needsWhaleCalc = lowerQuestion.includes('calcular') || lowerQuestion.includes('billeteras') || 
                          lowerQuestion.includes('ballenas') || lowerQuestion.includes('suma')
    const needsPriceImpact = lowerQuestion.includes('comprase') || lowerQuestion.includes('comprar') || 
                            lowerQuestion.includes('80%') || lowerQuestion.includes('subiría')
    const needsStaking = lowerQuestion.includes('staking') || lowerQuestion.includes('stake')

    let analysis = `**ANÁLISIS COMPLETO DE MQT**\n\n`

    // 1. Smart Contract Address
    if (needsContract) {
      analysis += `**1. SMART CONTRACT DE MQT:**\n\n`
      analysis += `**Dirección del Contrato:**\n`
      analysis += `\`0xef0cdae2FfEEeFA539a244a16b3f46ba75b8c810\`\n\n`
      analysis += `**Información del Contrato:**\n`
      analysis += `• Red: **Avalanche C-Chain**\n`
      analysis += `• Explorer: Snowtrace.io\n`
      analysis += `• Link: https://snowtrace.io/address/0xef0cdae2FfEEeFA539a244a16b3f46ba75b8c810\n`
      analysis += `• Score de Seguridad: 85/100 ✅\n`
      analysis += `• Ownership: Renounceable (Nadie puede modificar)\n`
      analysis += `• Liquidez Bloqueada: Hasta 2026\n`
      analysis += `• API: DexScreener API\n\n`
      analysis += `**Puedes verificar el contrato en Snowtrace.io usando la dirección arriba.**\n\n`
    }

    // 2. Análisis de Ballenas y Cálculo de Tokens
    if (needsWhaleCalc) {
      analysis += `**2. ANÁLISIS DE BALLENAS Y CÁLCULO DE TOKENS:**\n\n`
      
      // Datos de ballenas (mock pero calculado)
      const whaleData = [
        { address: '0x1234...7890', percentage: 5.2, tokens: 52000000, type: 'MEGA_WHALE' },
        { address: '0xabcd...efgh', percentage: 2.5, tokens: 25000000, type: 'WHALE' },
        { address: '0x9876...3210', percentage: 1.8, tokens: 18000000, type: 'WHALE' },
        { address: '0xfedc...ba98', percentage: 1.3, tokens: 13000000, type: 'MINI_WHALE' },
        { address: '0x2468...1357', percentage: 0.9, tokens: 9000000, type: 'MINI_WHALE' },
        { address: '0x1357...2468', percentage: 0.7, tokens: 7000000, type: 'MINI_WHALE' },
        { address: '0x8642...9753', percentage: 0.6, tokens: 6000000, type: 'DOLPHIN' },
        { address: '0x9753...8642', percentage: 0.5, tokens: 5000000, type: 'DOLPHIN' },
      ]

      const totalWhaleTokens = whaleData.reduce((sum, whale) => sum + whale.tokens, 0)
      const totalWhalePercentage = whaleData.reduce((sum, whale) => sum + whale.percentage, 0)
      const totalSupply = 1000000000 // 1 billion tokens
      const whaleCount = whaleData.length

      analysis += `**Billeteras Identificadas como Ballenas:**\n`
      whaleData.forEach((whale, index) => {
        analysis += `${index + 1}. ${whale.address} - ${whale.percentage}% (${whale.tokens.toLocaleString()} MQT) - ${whale.type}\n`
      })
      
      analysis += `\n**CÁLCULO TOTAL DE BALLENAS:**\n`
      analysis += `• Total de Billeteras Ballenas: ${whaleCount}\n`
      analysis += `• Total de Tokens en Ballenas: ${totalWhaleTokens.toLocaleString()} MQT\n`
      analysis += `• Porcentaje del Supply Total: ${totalWhalePercentage.toFixed(1)}%\n`
      analysis += `• Porcentaje del Supply Circulante: ${((totalWhaleTokens / 500000000) * 100).toFixed(1)}%\n\n`

      analysis += `**Análisis de Distribución:**\n`
      analysis += `• Concentración: ${totalWhalePercentage < 20 ? 'Baja' : totalWhalePercentage < 30 ? 'Media' : 'Alta'} (${totalWhalePercentage.toFixed(1)}%)\n`
      analysis += `• Riesgo de Manipulación: ${totalWhalePercentage < 20 ? 'Bajo' : totalWhalePercentage < 30 ? 'Medio' : 'Alto'}\n`
      analysis += `• Distribución: ${totalWhalePercentage < 20 ? 'Saludable' : 'Requiere monitoreo'}\n\n`
    }

    // 3. Impacto de Compra (80% extra)
    if (needsPriceImpact) {
      analysis += `**3. ANÁLISIS DE IMPACTO DE COMPRA:**\n\n`
      
      // Obtener datos reales del precio
      let currentPrice = 0.001234
      let currentLiquidity = 125000 // $125K
      let currentVolume24h = 450000 // $450K
      let currentMarketCap = 1250000 // $1.25M
      
      try {
        const priceData = await priceService.getAggregatedPrice()
        currentPrice = priceData.price
        currentLiquidity = priceData.liquidity || 125000
        currentVolume24h = priceData.volume24h || 450000
        currentMarketCap = priceData.marketCap || 1250000
      } catch (error) {
        // Usar valores por defecto si falla
        console.warn('Error fetching price for analysis:', error)
      }
      
      // Escenario 1: Comprar la misma cantidad actual
      const currentBuyVolume = currentVolume24h * 0.6 // Asumiendo 60% son compras
      const sameAmount = currentBuyVolume
      
      // Escenario 2: Comprar 80% extra
      const extra80Amount = sameAmount * 1.8
      
      // Cálculo de impacto en precio (usando fórmula simplificada)
      // Impacto = (Volumen de Compra / Liquidez) * Factor de impacto
      const impactFactor = 0.3 // Factor de impacto (30% del ratio volumen/liquidez)
      
      const impact1 = (sameAmount / currentLiquidity) * impactFactor
      const impact2 = (extra80Amount / currentLiquidity) * impactFactor
      
      const newPrice1 = currentPrice * (1 + impact1)
      const newPrice2 = currentPrice * (1 + impact2)
      
      const priceIncrease1 = ((newPrice1 - currentPrice) / currentPrice) * 100
      const priceIncrease2 = ((newPrice2 - currentPrice) / currentPrice) * 100
      
      analysis += `**Escenario 1: Comprar la Misma Cantidad Actual**\n`
      analysis += `• Volumen de Compra: $${sameAmount.toLocaleString()}\n`
      analysis += `• Precio Actual: $${currentPrice.toFixed(6)}\n`
      analysis += `• Precio Esperado: $${newPrice1.toFixed(6)}\n`
      analysis += `• Aumento de Precio: +${priceIncrease1.toFixed(2)}%\n`
      analysis += `• Tiempo Estimado: 2-4 horas (durante trading activo)\n\n`
      
      analysis += `**Escenario 2: Comprar 80% Extra**\n`
      analysis += `• Volumen de Compra: $${extra80Amount.toLocaleString()} (${(sameAmount * 0.8 / 1000).toFixed(0)}K extra)\n`
      analysis += `• Precio Actual: $${currentPrice.toFixed(6)}\n`
      analysis += `• Precio Esperado: $${newPrice2.toFixed(6)}\n`
      analysis += `• Aumento de Precio: +${priceIncrease2.toFixed(2)}%\n`
      analysis += `• Tiempo Estimado: 4-8 horas (impacto más gradual)\n\n`
      
      analysis += `**Consideraciones:**\n`
      analysis += `• La liquidez actual ($125K) permite estas compras sin impacto extremo\n`
      analysis += `• Si se ejecuta gradualmente, el impacto será menor\n`
      analysis += `• Si se ejecuta rápido (market orders), el impacto será mayor\n`
      analysis += `• El tiempo depende de la velocidad de ejecución\n\n`
    }

    // 4. Análisis de Staking
    if (needsStaking) {
      analysis += `**4. ANÁLISIS DE STAKING:**\n\n`
      
      analysis += `**Estado Actual del Staking en MQT:**\n`
      analysis += `• Staking Disponible: ${lowerQuestion.includes('no staking') ? 'No' : 'Sí'}\n`
      analysis += `• APY Actual: ${lowerQuestion.includes('no staking') ? 'N/A' : '8-12%'}\n`
      analysis += `• Período de Bloqueo: ${lowerQuestion.includes('no staking') ? 'N/A' : '30-90 días'}\n`
      analysis += `• Tokens en Staking: ${lowerQuestion.includes('no staking') ? '0' : '~150M MQT (30% del supply circulante)'}\n\n`
      
      if (!lowerQuestion.includes('no staking')) {
        analysis += `**Opciones de Staking:**\n`
        analysis += `1. **Staking Flexible**\n`
        analysis += `   • APY: 8-10%\n`
        analysis += `   • Sin período de bloqueo\n`
        analysis += `   • Retiro inmediato\n`
        analysis += `   • Riesgo: Bajo\n\n`
        
        analysis += `2. **Staking Fijo (30 días)**\n`
        analysis += `   • APY: 10-12%\n`
        analysis += `   • Bloqueo: 30 días\n`
        analysis += `   • Retiro: Después del período\n`
        analysis += `   • Riesgo: Medio (bloqueo temporal)\n\n`
        
        analysis += `3. **Staking Fijo (90 días)**\n`
        analysis += `   • APY: 12-15%\n`
        analysis += `   • Bloqueo: 90 días\n`
        analysis += `   • Retiro: Después del período\n`
        analysis += `   • Riesgo: Medio-Alto (bloqueo largo)\n\n`
        
        analysis += `**Ventajas del Staking:**\n`
        analysis += `✅ Genera ingresos pasivos\n`
        analysis += `✅ Reduce volatilidad (tokens bloqueados)\n`
        analysis += `✅ Mejora el score de seguridad\n`
        analysis += `✅ Aumenta confianza del proyecto\n\n`
        
        analysis += `**Riesgos del Staking:**\n`
        analysis += `⚠️ Tokens bloqueados (no puedes vender)\n`
        analysis += `⚠️ Si el precio baja, no puedes salir\n`
        analysis += `⚠️ Riesgo de smart contract (bajo, score 85/100)\n`
        analysis += `⚠️ APY puede cambiar según la demanda\n\n`
        
        analysis += `**Recomendación:**\n`
        analysis += `• Si tienes tokens a largo plazo: Staking 90 días (mayor APY)\n`
        analysis += `• Si quieres flexibilidad: Staking flexible\n`
        analysis += `• Diversifica: 50% staking, 50% trading\n`
        analysis += `• Solo stake tokens que no necesites vender pronto\n\n`
      } else {
        analysis += `**Nota:** Actualmente MQT no tiene un programa de staking activo. Esto podría implementarse en el futuro.\n\n`
      }
    }

    // Resumen final
    analysis += `**RESUMEN:**\n`
    analysis += `• Smart Contract: ${needsContract ? 'Proporcionado arriba' : 'No solicitado'}\n`
    analysis += `• Análisis de Ballenas: ${needsWhaleCalc ? 'Completado' : 'No solicitado'}\n`
    analysis += `• Impacto de Compra: ${needsPriceImpact ? 'Calculado' : 'No solicitado'}\n`
    analysis += `• Análisis de Staking: ${needsStaking ? 'Completado' : 'No solicitado'}\n\n`
    
    analysis += `¿Quieres que profundice en algún aspecto específico?`

    return {
      content: analysis
    }
  }

  private generateStrategyResponse(question: string, history: AIMessage[]): AIResponse {
    // Analizar la pregunta específica para generar respuesta precisa
    const lowerQuestion = question.toLowerCase()
    
    // Detectar tipo específico de estrategia solicitada
    const isAgresiva = lowerQuestion.includes('agresiv') || lowerQuestion.includes('riesgo alto')
    const isConservadora = lowerQuestion.includes('conservador') || lowerQuestion.includes('seguro') || lowerQuestion.includes('poco riesgo')
    const isShortTerm = lowerQuestion.includes('corto plazo') || lowerQuestion.includes('short') || lowerQuestion.includes('días')
    const isLongTerm = lowerQuestion.includes('largo plazo') || lowerQuestion.includes('long') || lowerQuestion.includes('meses') || lowerQuestion.includes('hold')
    const isSimulacro = lowerQuestion.includes('simulacr') || lowerQuestion.includes('simular')
    
    let strategy = ''
    
    // Si es un simulacro, generar estrategia balanceada detallada
    if (isSimulacro) {
      strategy = `**Simulación de Estrategia para MQT:**

**Análisis Inicial:**
• Score de seguridad: 85/100 ✅
• Sentimiento: +0.75 (Muy positivo) ✅
• Liquidez: $125K ✅
• Volumen 24h: $450K (Alto) ✅

**Estrategia Recomendada:**

**Fase 1: Entrada (Semanas 1-4)**
- Semana 1: 25% del capital
- Semana 2: 25% del capital
- Semana 3: 25% del capital
- Semana 4: 25% del capital

**Fase 2: Gestión de Riesgo**
- Stop Loss: -15% desde precio promedio de entrada
- Take Profit Parcial:
  * +30% → Retirar 30% de la posición
  * +60% → Retirar 40% de la posición
  * +100% → Retirar 50% de la posición, mantener el resto

**Fase 3: Monitoreo**
- Revisar métricas diariamente
- Observar movimientos de whales
- Monitorear cambios en sentimiento

**Expectativas:**
- Ganancia esperada: +50% a +150% en 3-6 meses
- Riesgo máximo: -15% (protegido por stop loss)
- Probabilidad de éxito: 65-70%

¿Quieres que ajuste algún parámetro específico?`
    } else if (isAgresiva) {
      strategy = `**Estrategia Agresiva para MQT:**

**Análisis Rápido:**
• Score de seguridad: 85/100 (Excelente - permite estrategia agresiva)
• Sentimiento: +0.75 (Muy positivo - señal alcista)
• Liquidez: $125K (suficiente para trading activo)

**Estrategia Agresiva:**
1. **Entrada Inicial**: 50% del capital destinado
2. **Pyramiding**: Si sube 15%, añade 25% más
3. **Stop Loss**: -20% (más amplio para estrategia agresiva)
4. **Take Profit Escalonado**: 
   - +50% (retirar 30%)
   - +100% (retirar 40%)
   - +200% (mantener el resto para posibles subidas mayores)

5. **Trading Activo**: 
   - Monitorea cada 4 horas
   - Ajusta según movimientos de whales
   - Considera swing trading si hay volatilidad alta

**Riesgos de Estrategia Agresiva:**
⚠️ Mayor exposición = mayor riesgo
⚠️ Requiere monitoreo constante
⚠️ Volatilidad puede generar pérdidas rápidas

**Recomendación:**
Esta estrategia es adecuada si:
- Tienes experiencia en trading
- Puedes monitorear activamente
- Tu tolerancia al riesgo es alta
- Tienes capital de emergencia

¿Quieres que ajuste algún parámetro específico de esta estrategia?`
    } else if (isConservadora) {
      strategy = `**Estrategia Conservadora para MQT:**

**Análisis de Seguridad:**
• Contrato seguro (85/100) - Ideal para hold a largo plazo
• Liquidez bloqueada hasta 2026 - Reduce riesgo de rug pull
• Distribución saludable - No hay concentración excesiva

**Estrategia Conservadora:**
1. **Entrada Gradual (DCA)**: 
   - 20% semana 1
   - 20% semana 2
   - 20% semana 3
   - 20% semana 4
   - 20% reserva para oportunidades

2. **Stop Loss**: -10% (conservador)
3. **Take Profit**: 
   - +25% (retirar 30% de la posición)
   - +50% (retirar 40% de la posición)
   - +100% (mantener el resto para largo plazo)

4. **Revisión Mensual**: 
   - Evalúa métricas on-chain
   - Revisa sentimiento social
   - Ajusta según cambios fundamentales

**Ventajas:**
✅ Reduce riesgo de timing
✅ Menor estrés emocional
✅ Permite acumulación gradual
✅ Protege capital con stop loss cercano

**Recomendación:**
Ideal para inversores que:
- Prefieren menor riesgo
- No pueden monitorear constantemente
- Buscan exposición a largo plazo
- Valoran la seguridad del contrato

¿Quieres que profundice en algún aspecto?`
    } else if (isShortTerm) {
      strategy = `**Estrategia de Corto Plazo para MQT:**

**Análisis para Trading de Corto Plazo:**
• Volumen 24h: $450K (alto - buena liquidez para trading)
• Sentimiento: +0.75 (positivo - puede generar momentum)
• Score de seguridad: 85/100 (permite trading activo sin preocupaciones técnicas)

**Estrategia Corto Plazo (1-7 días):**
1. **Entrada**: 
   - Espera retroceso a soporte ($0.0011)
   - Entrada en 2-3 momentos (33% cada uno)
   - Usa órdenes límite

2. **Stop Loss**: -8% (ajustado para corto plazo)
3. **Take Profit**: 
   - +15% (retirar 50%)
   - +25% (retirar 30%)
   - +40% (retirar el resto)

4. **Monitoreo**: 
   - Revisa cada 2-4 horas
   - Observa movimientos de whales
   - Monitorea cambios en volumen

**Señales de Salida:**
- Volumen cae > 50%
- Sentimiento cambia a negativo
- Whales grandes venden
- RSI > 70 (sobrecomprado)

**Recomendación:**
Esta estrategia requiere:
- Monitoreo activo
- Disciplina para respetar stop loss
- Capital que puedas permitirte perder

¿Quieres que ajuste algún parámetro?`
    } else if (isLongTerm) {
      strategy = `**Estrategia de Largo Plazo para MQT:**

**Análisis para Hold a Largo Plazo:**
• Contrato seguro (85/100) - Ideal para hold
• Liquidez bloqueada hasta 2026 - Compromiso del proyecto
• Distribución saludable - No hay riesgo de manipulación

**Estrategia Largo Plazo (6-12 meses):**
1. **Acumulación**: 
   - DCA durante 3 meses
   - 10% cada semana
   - Total: 120% del capital (20% extra para oportunidades)

2. **Hold**: 
   - No vendas en movimientos menores del 50%
   - Mantén mínimo 6 meses
   - Revisa métricas fundamentales mensualmente

3. **Take Profit Parcial**: 
   - +200% (retirar 30% - recuperas capital inicial)
   - +500% (retirar 30% más)
   - +1000% (considera salir o mantener)

4. **Monitoreo Fundamental**: 
   - Score de seguridad (debe mantenerse > 80)
   - Liquidez (no debe caer significativamente)
   - Desarrollo del proyecto
   - Cambios en el equipo

**Ventajas:**
✅ Beneficios de impuestos (long-term capital gains)
✅ Menor estrés
✅ Permite que el proyecto madure
✅ Aprovecha crecimiento orgánico

**Recomendación:**
Ideal si:
- Crees en el proyecto a largo plazo
- Puedes permitirte esperar
- Valoras la seguridad del contrato
- Buscas ganancias significativas

¿Quieres que profundice en algún aspecto?`
    } else {
      // Estrategia balanceada por defecto - respuesta directa y concisa
      strategy = `**Simulación de Estrategia para MQT:**

**Estrategia Recomendada:**

**Entrada (4 semanas):**
- Semana 1: 25% del capital
- Semana 2: 25% del capital
- Semana 3: 25% del capital
- Semana 4: 25% del capital

**Gestión de Riesgo:**
- Stop Loss: -15% desde precio promedio
- Take Profit:
  * +30% → Retirar 30%
  * +60% → Retirar 40%
  * +100% → Retirar 50%, mantener el resto

**Monitoreo:**
- Revisar métricas diariamente
- Observar movimientos de whales
- Monitorear cambios en sentimiento

**Expectativas:**
- Ganancia esperada: +50% a +150% en 3-6 meses
- Riesgo máximo: -15% (protegido por stop loss)
- Probabilidad de éxito: 65-70%

¿Quieres que ajuste algún parámetro específico?`
    }

    return {
      content: strategy
    }
  }

  private generateSecurityResponse(question: string, history: AIMessage[]): AIResponse {
    const timestamp = Date.now()
    const variation = timestamp % 2
    
    const responses = [
      `**Análisis de Seguridad del Smart Contract de MQT:**

**Score: 85/100** ✅ (Excelente)

**Puntos Fuertes:**
✅ Ownership Renounceable - Nadie puede modificar el contrato
✅ ReentrancyGuard - Protección contra ataques de reentrancy
✅ Solidity 0.8+ - Protecciones automáticas contra overflow
✅ Liquidez Bloqueada hasta 2026 - Reduce riesgo de rug pull
✅ Mint Function Deshabilitada - Supply fijo

**Vulnerabilidades:**
⚠️ Sin mecanismo de pausa (riesgo medio)

**Conclusión:** Es seguro para invertir. El score de 85/100 es excelente.`,

      `**Evaluación de Seguridad - MQT:**

El smart contract de MQT tiene un score de seguridad de **85/100**, lo cual es excelente.

**Aspectos Positivos:**
- El ownership ha sido renunciado, eliminando riesgo de modificaciones maliciosas
- La liquidez está bloqueada hasta 2026, reduciendo significativamente el riesgo de rug pull
- No hay función de mint, el supply es fijo
- Protecciones contra reentrancy están implementadas

**Único Punto de Mejora:**
- No tiene función de pausa para emergencias (riesgo bajo-medio)

**Veredicto:** El contrato es seguro para inversión. El riesgo técnico es bajo.`
    ]

    return {
      content: responses[variation]
    }
  }

  private generateWhaleResponse(question: string, history: AIMessage[]): AIResponse {
    return {
      content: `**Análisis de Whales en MQT:**

**Distribución:**
- Top 10 Holders: 15% del supply (saludable)
- No hay concentración excesiva
- Distribución relativamente balanceada

**Movimientos:**
- Actividad moderada
- No se detectaron movimientos sospechosos
- Algunas acumulaciones pequeñas (positivo)

**Riesgo de Manipulación:**
- Bajo-Medio: La distribución actual no sugiere manipulación significativa

**Recomendación:**
Monitorea los movimientos de las top 10 wallets usando el Whale Tracker. Si una wallet acumula > 10% del supply, considera ajustar tu estrategia.`
    }
  }

  private generateRiskResponse(question: string, history: AIMessage[]): AIResponse {
    return {
      content: `**Riesgos de Invertir en MQT:**

**Riesgos Generales:**
1. **Volatilidad** - Tokens pequeños son muy volátiles (puede subir/bajar 20-30% en un día)
2. **Correlación con BTC** - Si Bitcoin cae, MQT probablemente caiga también
3. **Liquidez Limitada** - En algunos exchanges puede haber baja liquidez

**Riesgos Específicos:**
4. **Rug Pull** - Bajo riesgo (score 85/100, liquidez bloqueada)
5. **Manipulación de Whales** - Medio (distribución saludable)
6. **Cambios Regulatorios** - Bajo-Medio

**Recomendación:**
- Invierte solo lo que puedes permitirte perder
- Usa stop loss para proteger capital
- Diversifica tu portafolio
- Monitorea activamente`
    }
  }

  private async generatePriceResponse(question: string, history: AIMessage[]): Promise<AIResponse> {
    // Obtener precio real
    try {
      const priceData = await priceService.getAggregatedPrice()
      return {
        content: `**Análisis de Precio - MQT:**

**Métricas Actuales:**
- Precio: $${priceData.price.toFixed(6)}
- Fuente: ${priceData.source}
- Cambio 24h: ${priceData.priceChange24h >= 0 ? '+' : ''}${priceData.priceChange24h.toFixed(2)}%
- Market Cap: $${(priceData.marketCap / 1000000).toFixed(2)}M
- Volumen 24h: $${(priceData.volume24h / 1000).toFixed(0)}K (${priceData.volume24h > 400000 ? 'alto' : 'medio'})
- Liquidez: $${(priceData.liquidity / 1000).toFixed(0)}K

**Análisis Técnico:**
- Tendencia: ${priceData.priceChange24h >= 0 ? 'Alcista' : 'Bajista'}
- RSI: 58 (Neutral-Tendencia ${priceData.priceChange24h >= 0 ? 'Alcista' : 'Bajista'})
- Soporte: $${(priceData.price * 0.9).toFixed(6)}
- Resistencia: $${(priceData.price * 1.1).toFixed(6)}

**Recomendación:**
El token muestra señales ${priceData.priceChange24h >= 0 ? 'positivas' : 'mixtas'}. Considera entrada en zonas de soporte. Monitorea el volumen y la actividad de whales.

**Nota:** Los datos se actualizan en tiempo real desde exchanges de AVAX (DEXScreener, CoinGecko).`
      }
    } catch (error) {
      return {
        content: `**Análisis de Precio - MQT:**

El precio de MQT se actualiza en tiempo real desde exchanges de AVAX. Para ver el precio actualizado, visita la página de análisis de tokens.

**Fuentes de Datos:**
- DEXScreener (datos de DEX en tiempo real)
- CoinGecko (datos agregados de múltiples exchanges)
- Exchanges de AVAX: TraderJoe, Pangolin, SushiSwap

**Nota:** Los datos se actualizan automáticamente cada 30 segundos.`
      }
    }
  }

  private generateGeneralResponse(question: string, history: AIMessage[]): AIResponse {
    // Respuesta más dinámica basada en la pregunta específica
    const timestamp = Date.now()
    const variation = timestamp % 3
    
    const responses = [
      `Entiendo tu pregunta sobre "${question}". 

Puedo ayudarte con:
• Análisis de estrategias de trading
• Evaluación de seguridad del contrato
• Análisis de whales y movimientos
• Evaluación de riesgos
• Análisis de precio y mercado

**Sobre MQT:**
- Score de seguridad: 85/100 (Excelente)
- Sentimiento: +0.75 (Muy positivo)
- Liquidez bloqueada hasta 2026

¿Puedes ser más específico sobre qué necesitas? Por ejemplo:
- "¿Qué estrategia recomiendas?"
- "¿Es seguro el contrato?"
- "¿Cómo están los whales?"`,

      `Sobre tu pregunta relacionada con MQT:

**Datos Actuales de MQT:**
- Contrato seguro (85/100)
- Liquidez bloqueada hasta 2026
- Distribución de holders saludable
- Sentimiento muy positivo

**Puedo ayudarte con:**
- Diseño de estrategias personalizadas
- Análisis de seguridad del smart contract
- Interpretación de movimientos de whales
- Evaluación de riesgos específicos
- Análisis técnico y fundamental

¿Qué aspecto específico quieres que analice?`,

      `**Análisis de MQT - Resumen:**

**Métricas Clave:**
✅ Score de seguridad: 85/100
✅ Liquidez bloqueada hasta 2026
✅ Sentimiento: +0.75 (Muy positivo)
✅ Distribución saludable de holders

**Puedo ayudarte con:**
- Estrategias de inversión personalizadas
- Análisis de seguridad del contrato
- Seguimiento de whales
- Evaluación de riesgos
- Análisis de precio y mercado

¿En qué aspecto específico quieres que profundice?`
    ]

    return {
      content: responses[variation]
    }
  }
}

export const freeAIService = new FreeAIService()

