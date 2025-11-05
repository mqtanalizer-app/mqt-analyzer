import { useEffect, useState } from 'react'
import { Languages } from 'lucide-react'
import { motion } from 'framer-motion'

declare global {
  interface Window {
    google?: {
      translate: {
        TranslateElement: {
          new (
            config: { pageLanguage: string; includedLanguages: string; layout?: number; autoDisplay?: boolean },
            elementId: string
          ): void
          InlineLayout: {
            SIMPLE: number
          }
        }
      }
    }
    googleTranslateElementInit?: () => void
  }
}

export default function GoogleTranslate() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)

  useEffect(() => {
    // Verificar si ya existe el script
    const existingScript = document.querySelector('script[src*="translate.google.com"]')
    if (existingScript) {
      setIsLoaded(true)
      return
    }

    // Cargar el script de Google Translate
    const script = document.createElement('script')
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
    script.async = true
    document.body.appendChild(script)

    // Función de inicialización global
    window.googleTranslateElementInit = () => {
      if (window.google && window.google.translate) {
        try {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: 'en',
              includedLanguages: 'es,en,fr,de,it,pt,ru,zh-CN,ja,ko,ar,hi,tr,pl,nl,sv,da,fi,no,cs,hu,ro,bg,el,hr,sk,sl,et,lv,lt,mt,ga,cy,eu,ca,gl',
              layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
              autoDisplay: false,
            },
            'google_translate_element'
          )
          setIsLoaded(true)
        } catch (error) {
          console.error('Error initializing Google Translate:', error)
        }
      }
    }

    return () => {
      // Limpiar el script al desmontar
      const scriptToRemove = document.querySelector('script[src*="translate.google.com"]')
      if (scriptToRemove) {
        scriptToRemove.remove()
      }
      delete window.googleTranslateElementInit
    }
  }, [])

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (showDropdown && !target.closest('.google-translate-container')) {
        setShowDropdown(false)
      }
    }

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showDropdown])

  return (
    <>
      {/* Botón flotante de Google Translate */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed bottom-6 right-6 z-50 google-translate-container"
      >
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowDropdown(!showDropdown)}
            className="glass-card p-4 rounded-xl border border-primary/30 hover:border-primary/60 transition-all glow-effect shadow-2xl"
            title="Traducir página"
          >
            <Languages className="w-6 h-6 text-primary" />
          </motion.button>

          {/* Dropdown con selector de idioma */}
          {showDropdown && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-full right-0 mb-2 glass-card rounded-xl p-4 min-w-[250px] border border-primary/30 shadow-2xl google-translate-container"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Languages className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-white">Seleccionar Idioma</h3>
                </div>
              </div>
              <div id="google_translate_element" className="w-full"></div>
              {isLoaded && (
                <p className="text-xs text-gray-400 mt-3 text-center">
                  Selecciona un idioma para traducir la página
                </p>
              )}
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Estilos para el widget de Google Translate */}
      <style>{`
        #google_translate_element {
          display: inline-block;
        }
        
        #google_translate_element .goog-te-banner-frame {
          display: none !important;
        }
        
        #google_translate_element .goog-te-menu-frame {
          max-width: 100% !important;
        }
        
        #google_translate_element .goog-te-menu-value {
          color: #00C4CC !important;
          background: transparent !important;
          border: 1px solid rgba(0, 196, 204, 0.3) !important;
          border-radius: 8px !important;
          padding: 8px 12px !important;
          font-size: 14px !important;
          width: 100% !important;
        }
        
        #google_translate_element .goog-te-menu-value span {
          color: #00C4CC !important;
        }
        
        #google_translate_element .goog-te-menu-value:hover {
          background: rgba(0, 196, 204, 0.1) !important;
          border-color: rgba(0, 196, 204, 0.5) !important;
        }
        
        body {
          top: 0 !important;
        }
        
        .goog-te-banner-frame.skiptranslate {
          display: none !important;
        }
        
        body {
          position: static !important;
        }
      `}</style>
    </>
  )
}

