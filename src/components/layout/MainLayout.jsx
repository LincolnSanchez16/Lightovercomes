import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

function MainLayout({ navbar, footer }) {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [pathname])

  return (
    <div className="site-shell">
      {navbar}
      <main className="site-main">
        <div className="container">
          <Outlet />
        </div>
      </main>
      {footer}
    </div>
  )
}

export default MainLayout
