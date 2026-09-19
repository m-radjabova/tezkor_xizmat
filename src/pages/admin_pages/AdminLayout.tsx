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
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useContextPro from '../../hooks/useContextPro'

const menuItems = [
  { label: 'Boshqaruv', to: '/admin', icon: HiHome, description: 'Umumiy statistika' },
  { label: 'Xizmatlar', to: '/admin/services', icon: HiBriefcase, description: 'Xizmatlarni boshqarish' },
  { label: 'Kategoriyalar', to: '/admin/categories', icon: HiTag, description: 'Xizmat kategoriyalari' },
  { label: 'Providerlar', to: '/admin/providers', icon: HiUserGroup, description: 'Ta\'minotchilar' },
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
    <div className="flex h-full flex-col bg-gradient-to-b from-white via-white to-slate-50/50">
      {/* Logo Header */}
      <div className="relative px-6 py-6">
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
        <button 
          type="button" 
          onClick={() => navigate('/admin')} 
          className="group flex w-full items-center gap-3 rounded-2xl p-2 text-left transition-colors hover:bg-slate-50"
        >
          <div className="relative">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 blur-md opacity-40 group-hover:opacity-60 transition-opacity" />
            <span className="relative grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-slate-900 to-slate-700 text-white shadow-lg">
              <HiShieldCheck className="h-6 w-6" />
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[20px] font-black tracking-tight text-slate-950 leading-none">
              Admin
            </span>
            <span className="mt-1 text-[10px] font-bold uppercase tracking-[0.15em] text-emerald-500">
              Control Panel
            </span>
          </div>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1.5 px-3 py-2">
        <div className="mb-3 px-3">
          <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
            Asosiy menyu
          </span>
        </div>
        
        {menuItems.map((item, index) => {
          const Icon = item.icon
          
          return (
            <motion.div
              key={item.to}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
            >
              <NavLink
                to={item.to}
                end={item.to === '/admin'}
                onClick={onNavigate}
                className={({ isActive: navActive }) =>
                  `group relative flex min-h-[52px] items-center gap-3.5 rounded-2xl px-3.5 text-[14px] font-bold transition-all duration-300 ${
                    navActive 
                      ? 'bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-lg shadow-slate-900/20' 
                      : 'text-slate-500 hover:bg-slate-100/80 hover:text-slate-900'
                  }`
                }
              >
                {({ isActive: navActive }) => (
                  <>
                    {/* Active indicator */}
                    {navActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute -left-3 top-1/2 h-7 w-1.5 -translate-y-1/2 rounded-r-full bg-gradient-to-b from-emerald-400 to-teal-500 shadow-[0_0_12px_rgba(16,185,129,0.6)]"
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                    
                    <div className={`
                      grid h-9 w-9 shrink-0 place-items-center rounded-xl transition-all duration-300
                      ${navActive 
                        ? 'bg-white/10 text-white' 
                        : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-700'
                      }
                    `}>
                      <Icon className="h-[18px] w-[18px]" />
                    </div>
                    
                    <div className="flex flex-1 flex-col min-w-0">
                      <span className="truncate">{item.label}</span>
                      <span className={`truncate text-[10px] font-semibold ${
                        navActive ? 'text-emerald-300' : 'text-slate-400 group-hover:text-slate-500'
                      }`}>
                        {item.description}
                      </span>
                    </div>
                    
                    <HiChevronRight className={`h-4 w-4 shrink-0 transition-all duration-300 ${
                      navActive 
                        ? 'text-white/70 translate-x-0' 
                        : 'text-slate-300 -translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'
                    }`} />
                  </>
                )}
              </NavLink>
            </motion.div>
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
              className="group flex w-full items-center gap-3.5 rounded-2xl border border-transparent px-3.5 py-3 text-[14px] font-bold text-slate-500 transition-all duration-300 hover:border-red-100 hover:bg-red-50 hover:text-red-600"
            >
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-slate-100 transition-all duration-300 group-hover:bg-red-100 group-hover:text-red-600">
                <HiMiniArrowLeftOnRectangle className="h-[18px] w-[18px]" />
              </div>
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
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    queueMicrotask(() => setMobileOpen(false))
  }, [location.pathname])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f6f8fb] via-[#f6f8fb] to-[#eef2f8] text-slate-950 lg:flex">
      {/* Mobile Menu Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        type="button"
        onClick={() => setMobileOpen(true)}
        className={`
          fixed left-4 top-4 z-40 grid h-12 w-12 place-items-center rounded-2xl border transition-all duration-300 lg:hidden
          ${scrolled 
            ? 'border-slate-200 bg-white/95 text-slate-800 shadow-lg backdrop-blur-md' 
            : 'border-slate-200 bg-white text-slate-800 shadow-md'
          }
        `}
        aria-label="Menyuni ochish"
      >
        <HiBars3BottomLeft className="h-6 w-6" />
      </motion.button>

      {/* Desktop Sidebar */}
      <aside className="hidden h-screen w-[300px] shrink-0 border-r border-slate-200/70 bg-white/80 backdrop-blur-xl lg:sticky lg:top-0 lg:block">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer */}
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
            } 
          } 
        }}
      >
        <div className="relative h-full bg-white">
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-xl bg-slate-50 text-slate-700 transition-colors hover:bg-slate-100"
            aria-label="Menyuni yopish"
          >
            <HiXMark className="h-5 w-5" />
          </button>
          <SidebarContent onNavigate={() => setMobileOpen(false)} />
        </div>
      </Drawer>

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="min-h-screen"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}

export default AdminLayout
