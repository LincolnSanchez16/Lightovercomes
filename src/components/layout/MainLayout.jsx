import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import EmailSignupPrompt from '../email/EmailSignupPrompt'

function MainLayout({ navbar, footer }) {
  const { pathname } = useLocation()
  const isHomeRoute = pathname === '/' || pathname === '/home'
  const hasFlushFooter = isHomeRoute || pathname === '/about' || pathname === '/resources'
  const hasValuesHero = pathname === '/christian-values'
  const mainClassName = [
    'site-main',
    hasFlushFooter ? 'site-main-flush-footer' : '',
    hasValuesHero ? 'site-main-values' : '',
  ]
    .filter(Boolean)
    .join(' ')

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [pathname])

  return (
    <div className="site-shell">
      {navbar}
      <main className={mainClassName}>
        <div className="container">
          <Outlet />
        </div>
      </main>
      {footer}
      <EmailSignupPrompt />
    </div>
  )
}

export default MainLayout
