import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import ContentHeader from '../components/ContentHeader'
import Sidebar from '../components/Sidebar'

function MainLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  return (
    <div className="min-h-screen">
        <div
        className="grid min-h-screen gap-0 transition-[grid-template-columns] duration-300 lg:grid-cols-[var(--sidebar-width)_minmax(0,1fr)]"
        style={{ ['--sidebar-width' as string]: isSidebarCollapsed ? '108px' : '296px' }}
      >
        <div className="lg:sticky lg:top-0 lg:h-screen">
          <Sidebar collapsed={isSidebarCollapsed} onToggle={() => setIsSidebarCollapsed((value) => !value)} />
        </div>
        <main className="app-scrollbar min-h-screen overflow-y-auto bg-[var(--color-overlay)]">
          <ContentHeader />
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default MainLayout
