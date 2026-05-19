import { Outlet } from 'react-router-dom'

function MainLayout({ navbar, footer }) {
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
