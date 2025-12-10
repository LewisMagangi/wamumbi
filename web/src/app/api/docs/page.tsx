'use client'
import { useEffect, useRef } from 'react'
import Script from 'next/script'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const window: Window & { SwaggerUIBundle: any }

export default function ApiDocs() {
  const containerRef = useRef<HTMLDivElement>(null)
  const initialized = useRef(false)

  useEffect(() => {
    // Initialize Swagger UI when the script loads
    const initSwagger = () => {
      if (initialized.current) return
      if (typeof window !== 'undefined' && window.SwaggerUIBundle && containerRef.current) {
        initialized.current = true
        window.SwaggerUIBundle({
          url: '/openapi.json',
          dom_id: '#swagger-ui',
          presets: [
            window.SwaggerUIBundle.presets.apis,
          ],
          layout: 'BaseLayout',
          deepLinking: true,
          showExtensions: true,
          showCommonExtensions: true
        })
      }
    }

    // Check if already loaded
    initSwagger()

    // Also listen for script load
    window.addEventListener('swagger-ui-loaded', initSwagger)
    return () => window.removeEventListener('swagger-ui-loaded', initSwagger)
  }, [])

  return (
    <>
      <link
        rel="stylesheet"
        href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css"
      />
      <Script
        src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"
        strategy="afterInteractive"
        onLoad={() => {
          window.dispatchEvent(new Event('swagger-ui-loaded'))
        }}
      />
      <div className="min-h-screen bg-white">
        <div id="swagger-ui" ref={containerRef} />
      </div>
    </>
  )
}