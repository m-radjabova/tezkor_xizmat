import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

function TelegramWebAppBridge() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const webApp = window.Telegram?.WebApp

  useEffect(() => {
    if (!webApp) return

    const root = document.documentElement
    const updateViewport = () => {
      root.style.setProperty('--tg-viewport-height', `${webApp.viewportHeight}px`)
      root.style.setProperty('--tg-viewport-stable-height', `${webApp.viewportStableHeight}px`)
    }

    root.classList.add('telegram-webapp')
    webApp.ready()
    webApp.expand()
    webApp.setHeaderColor('#ffffff')
    webApp.setBackgroundColor('#ffffff')
    updateViewport()
    webApp.onEvent('viewportChanged', updateViewport)

    return () => {
      webApp.offEvent('viewportChanged', updateViewport)
      root.classList.remove('telegram-webapp')
      root.style.removeProperty('--tg-viewport-height')
      root.style.removeProperty('--tg-viewport-stable-height')
    }
  }, [webApp])

  useEffect(() => {
    if (!webApp) return

    const backButton = webApp.BackButton
    if (pathname === '/') {
      backButton.hide()
      return
    }

    const onBack = () => {
      const historyState: unknown = window.history.state
      const historyIndex =
        typeof historyState === 'object' && historyState !== null && 'idx' in historyState
          ? historyState.idx
          : undefined

      if (typeof historyIndex === 'number' && historyIndex > 0) {
        navigate(-1)
      } else {
        navigate(pathname.startsWith('/businesses/') ? '/businesses' : '/', { replace: true })
      }
    }

    backButton.show()
    backButton.onClick(onBack)
    return () => backButton.offClick(onBack)
  }, [navigate, pathname, webApp])

  return null
}

export default TelegramWebAppBridge
