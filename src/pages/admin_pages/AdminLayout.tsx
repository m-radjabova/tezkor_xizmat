import {
  HiBars3BottomLeft,
  HiBriefcase,
  HiHome,
  HiMiniArrowLeftOnRectangle,
  HiShieldCheck,
  HiUserCircle,
  HiUserGroup,
  HiXMark,
  HiChevronRight,
  HiTag,
} from 'react-icons/hi2'
import { Drawer, Tooltip } from '@mui/material'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import useContextPro from '../../hooks/useContextPro'

const menuItems = [
  { label: 'Boshqaruv', to: '/admin', icon: HiHome, description: 'Umumiy statistika' },
  { label: 'Xizmatlar', to: '/admin/services', icon: HiBriefcase, description: 'Xizmatlarni boshqarish' },
  { label: 'Kategoriyalar', to: '/admin/categories', icon: HiTag, description: 'Xizmat kategoriyalari' },
  { label: 'Providerlar', to: '/admin/providers', icon: HiUserGroup, description: "Ta'minotchilar" },
  { label: 'Foydalanuvchilar', to: '/admin/customers', icon: HiUserCircle, description: 'Customer hisoblar' },
]

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const { logout } = useContextPro()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="flex h-full flex-col bg-white">
      {/* Logo */}
      <div className="relative px-6 py-6">
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
        <button
          type="button"
          onClick={() => navigate('/admin')}
          className="flex w-full items-center gap-3 rounded-2xl p-2 text-left transition-colors duration-200 hover:bg-slate-50"
        >
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-slate-900 to-slate-700 text-white shadow-md">
            <HiShieldCheck className="h-6 w-6" />
          </span>
          <div className="flex flex-col">
            <span className="text-[20px] font-black leading-none tracking-tight text-slate-950">
              Admin
            </span>
            <span className="mt-1 text-[10px] font-bold uppercase tracking-[0.15em] text-emerald-500">
              Control Panel
            </span>
          </div>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1.5 overflow-y-auto px-3 py-2">
        <div className="mb-3 px-3">
          <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
            Asosiy menyu
          </span>
        </div>

        {menuItems.map((item) => {
          const Icon = item.icon

          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/admin'}
              onClick={onNavigate}
              className={({ isActive }) =>
                `group relative flex min-h-[52px] items-center gap-3.5 rounded-2xl px-3.5 text-[14px] font-bold transition-colors duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-md'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute -left-3 top-1/2 h-7 w-1.5 -translate-y-1/2 rounded-r-full bg-gradient-to-b from-emerald-400 to-teal-500" />
                  )}

                  <span
                    className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl transition-colors duration-200 ${
                      isActive
                        ? 'bg-white/10 text-white'
                        : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-700'
                    }`}
                  >
                    <Icon className="h-[18px] w-[18px]" />
                  </span>

                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate">{item.label}</span>
                    <span
                      className={`truncate text-[10px] font-semibold ${
                        isActive ? 'text-emerald-300' : 'text-slate-400 group-hover:text-slate-500'
                      }`}
                    >
                      {item.description}
                    </span>
                  </div>

                  <HiChevronRight
                    className={`h-4 w-4 shrink-0 transition-all duration-200 ${
                      isActive
                        ? 'translate-x-0 text-white/70'
                        : '-translate-x-1 text-slate-300 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'
                    }`}
                  />
                </>
              )}
            </NavLink>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="relative px-3 pb-5">
        <div className="absolute inset-x-3 top-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

        <div className="pt-4">
          <Tooltip title="Tizimdan chiqish" placement="right" arrow>
            <button
              type="button"
              onClick={() => void handleLogout()}
              className="group flex w-full items-center gap-3.5 rounded-2xl border border-transparent px-3.5 py-3 text-[14px] font-bold text-slate-500 transition-colors duration-200 hover:border-red-100 hover:bg-red-50 hover:text-red-600"
            >
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-slate-100 transition-colors duration-200 group-hover:bg-red-100 group-hover:text-red-600">
                <HiMiniArrowLeftOnRectangle className="h-[18px] w-[18px]" />
              </span>
              <span className="flex-1 text-left">Chiqish</span>
            </button>
          </Tooltip>
        </div>
      </div>
    </div>
  )
}

function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f6f8fb] via-[#f6f8fb] to-[#eef2f8] text-slate-950">
      {/* ============ MOBILE MENU BUTTON ============ */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-40 grid h-12 w-12 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-800 shadow-md transition-colors duration-200 hover:bg-slate-50 lg:hidden"
        aria-label="Menyuni ochish"
      >
        <HiBars3BottomLeft className="h-6 w-6" />
      </button>

      {/* ============ DESKTOP SIDEBAR — FIXED ============ */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[300px] border-r border-slate-200 bg-white lg:block">
        <SidebarContent />
      </aside>

      {/* ============ MOBILE DRAWER ============ */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        slotProps={{
          paper: {
            sx: {
              width: 'min(300px, 86vw)',
              boxShadow: '0 20px 60px rgba(15, 23, 42, 0.15)',
              border: 'none',
            },
          },
        }}
      >
        <div className="relative h-full bg-white">
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-xl bg-slate-50 text-slate-700 transition-colors duration-200 hover:bg-slate-100"
            aria-label="Menyuni yopish"
          >
            <HiXMark className="h-5 w-5" />
          </button>
          <SidebarContent onNavigate={() => setMobileOpen(false)} />
        </div>
      </Drawer>

      {/* ============ MAIN CONTENT — SIDEBAR YONIDA ============ */}
      <main className="min-w-0 lg:ml-[300px]">
        <div className="admin-page" key={location.pathname}>
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default AdminLayout