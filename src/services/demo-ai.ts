// Demo AI Service - Sin necesidad de API keys
// Respuestas inteligentes predefinidas basadas en contexto

import { AIMessage, AIResponse, AIService } from './ai-service'

const SYSTEM_RESPONSES = {
  greeting: [
    '¡Hola! Soy tu asistente de IA especializado en análisis de tokens cripto. Puedo ayudarte con análisis de estrategias, métricas on-chain, smart contracts, sentimiento y recomendaciones de trading.',
    'Hola, estoy aquí para ayudarte con todo lo relacionado con MQT y análisis de tokens. ¿En qué puedo ayudarte?',
    '¡Bienvenido! Soy tu asistente de análisis cripto. Puedo responder preguntas sobre estrategias, seguridad, whales, y mucho más.'
  ],
  strategy: [
    `Basándome en el análisis actual de MQT, te recomiendo:

**Análisis de MQT:**
• Score de seguridad: 85/100 (Excelente)
• Liquidez bloqueada hasta 2026
• Distribución de holders saludable (15% en top 10)
• Sentimiento: +0.75 (Muy Positivo)

**Recomendaciones de Estrategia:**
1. **Entrada gradual (DCA)**: Considera Dollar Cost Averaging en lugar de compra única
   - Divide tu inversión en 3-5 compras durante 1-2 semanas
   - Reduce el riesgo de timing

2. **Stop Loss**: Configura un stop loss en -15% desde tu precio de entrada
   - Protege tu capital en caso de reversión
   - Ajusta según tu tolerancia al riesgo

3. **Take Profit**: Define objetivos de salida escalonados
   - +30% (retirar 30% de la posición)
   - +50% (retirar 40% de la posición)
   - +100% (retirar el resto o mantener)

4. **Posición**: No más del 5-10% de tu portafolio en MQT
   - Diversificación es clave
   - Nunca inviertas más de lo que puedes permitirte perder

**Riesgos a considerar:**
• Volatilidad inherente de tokens pequeños
• Riesgo de mercado general (correlación con BTC)
• Liquidez limitada en algunos exchanges
• Riesgo de rug pull (bajo, pero presente)

**Timing:**
Observa los movimientos de whales y el sentimiento social. Si hay acumulación de whales y sentimiento positivo, podría ser un buen momento de entrada.

¿Quieres que profundice en algún aspecto específico?`,

    `Para MQT, considero una estrategia conservadora:

**Estrategia Conservadora:**
- Compra inicial: 30% del capital destinado
- Si baja 10%: Compra 30% más (promedio a la baja)
- Si sube 20%: Toma ganancias parciales (20% de la posición)
- Stop Loss: -12%
- Take Profit: +40%, +80%, +150%

**Por qué esta estrategia:**
- El score de seguridad (85/100) es excelente
- La liquidez bloqueada hasta 2026 reduce riesgo de rug pull
- La distribución de holders es saludable
- El sentimiento actual es muy positivo

**Monitorea:**
- Movimientos de whales (usa el Whale Tracker)
- Cambios en el sentimiento social
- Volumen de trading (debe ser consistente)

¿Te parece bien esta estrategia o prefieres algo más agresivo?`
  ],
  security: [
    `**Análisis de Seguridad del Smart Contract de MQT:**

**Score: 85/100** ✅ (Excelente)

**Puntos Fuertes:**
✅ **Ownership Renounceable**: El ownership del contrato ha sido renunciado, nadie puede modificarlo
✅ **ReentrancyGuard**: Protección contra ataques de reentrancy implementada
✅ **Solidity 0.8+**: Protección automática contra overflow/underflow
✅ **Funciones Administrativas Protegidas**: Solo el owner puede ejecutar funciones críticas
✅ **Liquidez Bloqueada**: Hasta 2026 (reduce riesgo de rug pull)
✅ **Blacklist Reversible**: Sistema de blacklist controlado
✅ **Mint Function Deshabilitada**: No se pueden crear nuevos tokens

**Áreas de Mejora:**
⚠️ **Sin Mecanismo de Pausa**: No tiene función de pausa para emergencias
   - Riesgo: Medio
   - Recomendación: Considerar agregar función de pausa para casos extremos

**Vulnerabilidades Detectadas:**
• Ninguna crítica
• 1 vulnerabilidad de nivel medio (falta de pausa)

**Análisis de Código:**
- El contrato sigue las mejores prácticas de seguridad
- No se detectaron vulnerabilidades conocidas
- La estructura del código es sólida

**Conclusión:**
El contrato es seguro para inversión. El score de 85/100 es excelente y está por encima del promedio del mercado. El único punto a considerar es la falta de mecanismo de pausa, pero esto es común en tokens descentralizados.

**Riesgo General: BAJO-MEDIO**
- Seguro para inversión a largo plazo
- Seguro para inversión a corto plazo
- Monitorea actividad de whales y cambios en el contrato

¿Quieres que analice algún aspecto específico del contrato?`,

    `El smart contract de MQT es bastante seguro:

**Aspectos de Seguridad:**
- Ownership renunciado: ✅ Máxima seguridad
- Liquidez bloqueada: ✅ No puede ser removida
- Sin mint function: ✅ Supply fijo
- Reentrancy protegido: ✅ Sin vulnerabilidades conocidas

**Recomendación:**
Es seguro para invertir. El score de 85/100 es excelente.`
  ],
  whales: [
    `**Análisis de Whales en MQT:**

**Distribución de Holders:**
• Top 10 Holders: 15% del supply
• Distribución: Relativamente saludable
• No hay concentración excesiva (buena señal)

**Movimientos Recientes:**
• Actividad de whales: Moderada
• No se detectaron movimientos sospechosos
• Transacciones normales de trading
• Algunas acumulaciones pequeñas (positivo)

**Tipos de Whales:**
1. **Exchanges**: Algunas wallets de exchanges (normal)
2. **Instituciones**: Algunas wallets institucionales (confianza)
3. **Individuos**: Whales individuales con buen historial

**Riesgo de Manipulación:**
• **BAJO-MEDIO**: La distribución actual no sugiere manipulación significativa
• No hay una sola wallet controlando más del 5%
• Movimientos son graduales, no pump & dump

**Recomendaciones:**
• Monitorea los movimientos de las top 10 wallets (usa Whale Tracker)
• Alertas configuradas para transacciones > 5% del supply
• Observa si hay acumulación excesiva en una sola wallet
• Si ves ventas masivas de whales, considera ajustar tu estrategia

**Indicadores Positivos:**
✅ Distribución saludable
✅ Sin movimientos sospechosos
✅ Acumulaciones graduales (confianza)

**Indicadores de Precaución:**
⚠️ Si una wallet acumula > 10% del supply, monitorea de cerca
⚠️ Si hay ventas masivas > 5% del supply, considera salir

¿Quieres ver los detalles de alguna wallet específica?`,

    `Los whales en MQT están distribuidos de manera saludable:

**Situación Actual:**
- Top 10 controlan 15% (normal)
- No hay concentración excesiva
- Movimientos normales de trading

**Recomendación:**
Monitorea pero no hay señales de alerta. La distribución es saludable.`
  ],
  risks: [
    `**Riesgos de Invertir en MQT:**

**Riesgos Generales del Mercado:**
1. **Volatilidad**: Los tokens pequeños son muy volátiles
   - Puede subir o bajar 20-30% en un día
   - Impacto: Alto
   - Mitigación: Solo invierte lo que puedes permitirte perder

2. **Correlación con BTC**: Si Bitcoin cae, MQT probablemente caiga también
   - Impacto: Alto
   - Mitigación: Monitorea el mercado general

3. **Liquidez Limitada**: En algunos exchanges puede haber baja liquidez
   - Impacto: Medio
   - Mitigación: Usa exchanges con buen volumen

**Riesgos Específicos de MQT:**
4. **Rug Pull**: Aunque el contrato es seguro, siempre existe riesgo
   - Impacto: Crítico (pérdida total)
   - Probabilidad: BAJA (score 85/100, liquidez bloqueada)
   - Mitigación: Ya mitigado por la seguridad del contrato

5. **Manipulación de Whales**: Si un whale grande vende, puede afectar el precio
   - Impacto: Medio
   - Probabilidad: MEDIA
   - Mitigación: Monitorea movimientos de whales

6. **Cambios Regulatorios**: Regulaciones pueden afectar tokens pequeños
   - Impacto: Medio-Alto
   - Probabilidad: BAJA
   - Mitigación: Diversificación

**Recomendaciones:**
✅ Invierte solo lo que puedes permitirte perder
✅ Diversifica tu portafolio (no más del 5-10% en MQT)
✅ Usa stop loss para proteger tu capital
✅ Monitorea activamente whales y sentimiento
✅ Ten un plan de salida claro

**Riesgo General: MEDIO**
- El contrato es seguro (reduce riesgo técnico)
- El mercado es volátil (aumenta riesgo de precio)
- La distribución es saludable (reduce riesgo de manipulación)

¿Quieres que profundice en algún riesgo específico?`,

    `Los principales riesgos son:

1. **Volatilidad** - Tokens pequeños son muy volátiles
2. **Rug Pull** - Bajo riesgo (contrato seguro)
3. **Manipulación** - Monitorea whales
4. **Regulaciones** - Riesgo bajo pero presente

**Conclusión:**
Riesgo medio, pero el contrato seguro reduce el riesgo técnico.`
  ],
  price: [
    `**Análisis de Precio y Mercado - MQT:**

**Métricas Actuales:**
• Precio: $0.001234
• Cambio 24h: +12.5%
• Market Cap: $1.25M
• Volumen 24h: $450K (alto)
• Liquidez: $125K
• Holders: 1,250

**Análisis Técnico:**
📈 **Tendencia**: Alcista a corto plazo
📊 **RSI**: 58 (Neutral-Tendencia Alcista, no sobrecomprado)
📉 **Soporte**: $0.0011 (zona de soporte fuerte)
📈 **Resistencia**: $0.0015 (próxima resistencia)
📊 **Media Móvil**: Precio por encima de la MA de 20 días (señal alcista)

**Volumen:**
• Volumen 24h: Alto (sugiere interés real)
• Ratio Buy/Sell: 60/40 (compras superan ventas - positivo)
• Volumen vs Market Cap: Alto (35% - muy líquido)

**Indicadores:**
✅ Volumen alto sugiere interés real
✅ Precio por encima de soporte
✅ RSI no sobrecomprado (espacio para subir)
✅ Ratio compras/ventas positivo

**Recomendación:**
El token muestra señales positivas a corto plazo:
- Entrada en zonas de soporte ($0.0011) sería ideal
- Si rompe resistencia ($0.0015), podría subir más
- Monitorea el volumen (debe mantenerse alto)

**Consideraciones:**
• No inviertas más de lo que puedes permitirte perder
• Usa stop loss para proteger ganancias
• Monitorea el volumen y la actividad de whales
• El mercado cripto es impredecible

¿Quieres un análisis más profundo de algún indicador técnico?`,

    `Precio actual: $0.001234 (+12.5% 24h)

**Análisis:**
- Tendencia alcista
- Volumen alto
- RSI saludable

**Recomendación:**
Considera entrada en zonas de soporte. Monitorea volumen.`
  ],
  default: [
    `Entiendo tu pregunta sobre el análisis de MQT. 

Como asistente especializado en análisis de tokens cripto, puedo ayudarte con:

• **Análisis de estrategias**: Te ayudo a diseñar estrategias de trading basadas en datos
• **Interpretación de métricas**: Explico qué significan las métricas on-chain
• **Análisis de seguridad**: Evalúo smart contracts y detecto riesgos
• **Recomendaciones**: Proporciono consejos basados en análisis técnico y fundamental
• **Análisis de whales**: Interpreto movimientos de grandes wallets
• **Análisis de sentimiento**: Evalúo el sentimiento social

**Sobre MQT:**
- Score de seguridad: 85/100 (Excelente)
- Liquidez bloqueada hasta 2026
- Distribución de holders saludable
- Sentimiento: Muy positivo (+0.75)

¿Puedes ser más específico? Por ejemplo:
- "¿Qué estrategia recomiendas para MQT?"
- "Explícame qué significa el score de seguridad"
- "¿Cómo interpreto los movimientos de whales?"
- "¿Es seguro este contrato?"
- "¿Qué riesgos tiene invertir en MQT?"`,

    `Puedo ayudarte con análisis de estrategias, seguridad, whales, riesgos, precio y más sobre MQT.

¿En qué aspecto específico quieres que profundice?`
  ]
}

export class DemoAIService implements AIService {
  setApiKey(apiKey: string) {
    // No hace nada en modo demo
  }

  getApiKey(): string | null {
    return 'demo-mode' // Siempre devuelve que está configurado
  }

  async askQuestion(
    question: string,
    conversationHistory: AIMessage[] = []
  ): Promise<AIResponse> {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 700))

    const lowerQuestion = question.toLowerCase().trim()

    // Detectar tipo de pregunta
    if (lowerQuestion.includes('hola') || lowerQuestion.includes('hello') || lowerQuestion.includes('hi')) {
      return {
        content: SYSTEM_RESPONSES.greeting[Math.floor(Math.random() * SYSTEM_RESPONSES.greeting.length)]
      }
    }

    if (lowerQuestion.includes('estrategia') || lowerQuestion.includes('invertir') || lowerQuestion.includes('comprar') || lowerQuestion.includes('cuándo')) {
      return {
        content: SYSTEM_RESPONSES.strategy[Math.floor(Math.random() * SYSTEM_RESPONSES.strategy.length)]
      }
    }

    if (lowerQuestion.includes('seguridad') || lowerQuestion.includes('contract') || lowerQuestion.includes('seguro') || lowerQuestion.includes('vulnerabilidad')) {
      return {
        content: SYSTEM_RESPONSES.security[Math.floor(Math.random() * SYSTEM_RESPONSES.security.length)]
      }
    }

    if (lowerQuestion.includes('whale') || lowerQuestion.includes('ballena') || lowerQuestion.includes('wallet') || lowerQuestion.includes('holder')) {
      return {
        content: SYSTEM_RESPONSES.whales[Math.floor(Math.random() * SYSTEM_RESPONSES.whales.length)]
      }
    }

    if (lowerQuestion.includes('riesgo') || lowerQuestion.includes('peligro') || lowerQuestion.includes('pérdida')) {
      return {
        content: SYSTEM_RESPONSES.risks[Math.floor(Math.random() * SYSTEM_RESPONSES.risks.length)]
      }
    }

    if (lowerQuestion.includes('precio') || lowerQuestion.includes('market') || lowerQuestion.includes('valor') || lowerQuestion.includes('cotización')) {
      return {
        content: SYSTEM_RESPONSES.price[Math.floor(Math.random() * SYSTEM_RESPONSES.price.length)]
      }
    }

    // Respuesta por defecto
    return {
      content: SYSTEM_RESPONSES.default[Math.floor(Math.random() * SYSTEM_RESPONSES.default.length)]
    }
  }
}

export const demoAIService = new DemoAIService()

