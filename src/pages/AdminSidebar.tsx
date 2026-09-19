import {
  HiBars3BottomLeft,
  HiBriefcase,
  HiChartBar,
  HiChatBubbleLeftRight,
  HiHome,
  HiMiniArrowLeftOnRectangle,
  HiMiniXMark,
  HiUserCircle,
} from 'react-icons/hi2'
import { Drawer } from '@mui/material'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import type { IconType } from 'react-icons'
import useContextPro from '../hooks/useContextPro'

interface MenuItem {
  label: string
  to: string
  icon: IconType
  hasDot?: boolean
}

const menuItems: MenuItem[] = [
  { label: 'Bosh sahifa', to: '/provider', icon: HiHome },
  { label: 'Xizmatlarim', to: '/provider/services', icon: HiBriefcase },
  { label: 'Statistika', to: '/provider/statistics', icon: HiChartBar },
  { label: 'Sharhlar', to: '/provider/reviews', icon: HiChatBubbleLeftRight },
  { label: 'Profil', to: '/provider/profile', icon: HiUserCircle },
]

function LogoBlock() {
  const navigate = useNavigate()

  return (
    <button
      type="button"
      onClick={() => navigate('/provider')}
      className="flex w-full items-center gap-3 text-left"
    >
      <span className="grid h-10 w-10 place-items-center rounded-full bg-emerald-600 text-white shadow-sm">
        <svg width="23" height="23" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 4.5c-4.4 0-8 3.1-8 7 0 2.3 1.3 4.4 3.2 5.6l-.7 2.4 2.7-1.4c.9.3 1.8.4 2.8.4 4.4 0 8-3.1 8-7s-3.6-7-8-7Z"
            fill="currentColor"
            opacity="0.25"
          />
          <path
            d="M8.4 11.1 10.7 14l4.9-5.1M12 4.5c-4.4 0-8 3.1-8 7 0 2.3 1.3 4.4 3.2 5.6l-.7 2.4 2.7-1.4c.9.3 1.8.4 2.8.4 4.4 0 8-3.1 8-7s-3.6-7-8-7Z"
            stroke="white"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="text-[22px] font-black tracking-tight text-emerald-700">
        YaqinXizmat
      </span>
    </button>
  )
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const { logout } = useContextPro()
  const navigate = useNavigate()
  const location = useLocation()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    if (isLoggingOut) return
    setIsLoggingOut(true)
    try {
      await logout()
      navigate('/login', { replace: true })
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="px-7 py-7">
        <LogoBlock />
      </div>

      <nav className="flex-1 space-y-2 px-4">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive =
            location.pathname === item.to ||
            (item.to !== '/provider' && location.pathname.startsWith(item.to))

          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/provider'}
              onClick={onNavigate}
              className={`flex min-h-12 items-center gap-4 rounded-[8px] px-4 text-[15px] font-bold transition ${
                isActive
                  ? 'bg-emerald-50 text-emerald-800'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon className={`h-6 w-6 ${isActive ? 'text-emerald-700' : 'text-slate-500'}`} />
              <span className="min-w-0 flex-1 truncate">{item.label}</span>
              {item.hasDot && <span className="h-2 w-2 rounded-full bg-emerald-500" />}
            </NavLink>
          )
        })}
      </nav>

      <div className="px-5 pb-6">

        <button
          type="button"
          onClick={() => void handleLogout()}
          disabled={isLoggingOut}
          className="flex w-full items-center gap-3 rounded-[8px] px-4 py-3 text-sm font-bold text-slate-500 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-60"
        >
          <HiMiniArrowLeftOnRectangle className="h-5 w-5" />
          {isLoggingOut ? 'Chiqilmoqda...' : 'Chiqish'}
        </button>
      </div>
    </div>
  )
}

export default function AdminSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    queueMicrotask(() => setMobileOpen(false))
  }, [location.pathname])

  return (
    <>
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-40 grid h-11 w-11 place-items-center rounded-[8px] border border-slate-200 bg-white text-slate-800 shadow-sm lg:hidden"
        aria-label="Menyuni ochish"
      >
        <HiBars3BottomLeft className="h-6 w-6" />
      </button>

      <aside className="hidden h-screen w-[300px] shrink-0 border-r border-slate-100 bg-white lg:sticky lg:top-0 lg:block">
        <SidebarContent />
      </aside>

      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        slotProps={{
          paper: {
            sx: {
              width: 'min(300px, 86vw)',
              boxShadow: 'none',
              background: 'transparent',
            },
          },
        }}
      >
        <div className="relative h-full bg-white">
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-[8px] bg-slate-50 text-slate-700"
            aria-label="Menyuni yopish"
          >
            <HiMiniXMark className="h-6 w-6" />
          </button>
          <SidebarContent onNavigate={() => setMobileOpen(false)} />
        </div>
      </Drawer>
    </>
  )
}
