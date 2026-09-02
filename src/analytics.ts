type EventParameters = Record<string, string | number | boolean>

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID

export function initializeAnalytics() {
  if (!measurementId || window.gtag) return

  window.dataLayer = window.dataLayer ?? []
  window.gtag = (...args) => window.dataLayer?.push(args)
  window.gtag('js', new Date())
  window.gtag('config', measurementId)

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
  document.head.appendChild(script)
}

export function trackEvent(name: string, parameters: EventParameters = {}) {
  if (!measurementId || !window.gtag) return
  window.gtag('event', name, parameters)
}
