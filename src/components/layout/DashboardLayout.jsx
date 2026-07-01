import { useState } from 'react'
import Sidebar from './Sidebar.jsx'
import Navbar from './Navbar.jsx'

export default function DashboardLayout({ title, subtitle, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="app-shell">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="app-main-wrap">
        <Navbar
          title={title}
          subtitle={subtitle}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <main className="app-main">{children}</main>
      </div>
    </div>
  )
}
