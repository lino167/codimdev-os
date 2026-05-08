'use client'

import { useEffect } from 'react'
import Script from 'next/script'

interface UnicornBackgroundProps {
  projectId?: string;
  hueRotate?: number;
  opacity?: number;
}

export default function UnicornBackground({ 
  projectId = "vTTCp5g4cVl9nwjlT56Z", 
  hueRotate = 90, 
  opacity = 1.0,
}: UnicornBackgroundProps) {
  
  useEffect(() => {
    // Inicialização segura caso o script já esteja carregado globalmente com delay
    const timer = setTimeout(() => {
      if (typeof window !== 'undefined' && (window as any).UnicornStudio) {
        try {
          (window as any).UnicornStudio.init();
        } catch (e) {
          // Silencia erros de inicializações duplas
        }
      }
    }, 150);
    return () => clearTimeout(timer);
  }, [projectId]);

  return (
    <>
      <Script 
        src="https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.1.12/dist/unicornStudio.umd.js"
        strategy="lazyOnload"
        onLoad={() => {
          setTimeout(() => {
            if (typeof window !== 'undefined' && (window as any).UnicornStudio) {
              try {
                (window as any).UnicornStudio.init();
              } catch (e) {
                console.error("Erro ao inicializar o Unicorn Studio:", e);
              }
            }
          }, 150);
        }}
      />
      <div 
        className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-20"
        style={{ 
          opacity: opacity,
        }}
      >
        <div 
          className="absolute w-full h-full left-0 top-0" 
          style={{ 
            filter: hueRotate ? `hue-rotate(${hueRotate}deg) brightness(0.65) contrast(1.15)` : 'brightness(0.65) contrast(1.15)' 
          }}
        >
          <div 
            data-us-project={projectId} 
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      </div>
    </>
  )
}
