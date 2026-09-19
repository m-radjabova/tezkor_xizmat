import LocationOnIcon from '@mui/icons-material/LocationOn'
import LogoutIcon from '@mui/icons-material/Logout'
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'
import StorefrontIcon from '@mui/icons-material/Storefront'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import useContextPro from '../../hooks/useContextPro'

const navItems = [
  { label: 'Bosh sahifa', href: '/' },
  { label: 'Kategoriyalar', href: '/' },
  { label: 'Biz haqimizda', href: '/' },
  { label: 'Aloqa', href: '/' },
]

function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { isAuthenticated, user, logout } = useContextPro()
  const navigate = useNavigate()
  const location = useLocation()

  /* Scroll holati */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* Body scroll lock — mobil menyu ochilganda */
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const handleLogout = async () => {
    await logout()
    navigate('/', { replace: true })
  }

  const isActive = (href: string) =>
    href === '/' ? location.pathname === '/' : location.pathname.startsWith(href)

  return (
    <>
      <motion.header
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={`fixed inset-x-0 top-0 z-50 text-white transition-all duration-500 ${
          scrolled
            ? 'border-b border-white/10 bg-[#021d18]/85 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6)] backdrop-blur-2xl'
            : 'border-b border-white/5 bg-[#032b24]/60 backdrop-blur-lg'
        }`}
      >
        {/* ============ TOP GRADIENT LINE ============ */}
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400/80 to-transparent" />

        {/* ============ AMBIENT GLOW ORBS ============ */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <motion.div
            animate={{ x: [0, 30, 0], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-20 left-1/4 h-40 w-40 rounded-full bg-emerald-400/20 blur-[80px]"
          />
          <motion.div
            animate={{ x: [0, -30, 0], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="absolute -top-20 right-1/4 h-40 w-40 rounded-full bg-teal-300/20 blur-[80px]"
          />
        </div>

        <div className="relative mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 lg:h-20 lg:px-8">
          {/* ============ LOGO ============ */}
          <Link to="/" className="group flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-emerald-400/60 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />
              <motion.div
                whileHover={{ scale: 1.08, rotate: 8 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                className="relative grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-white to-emerald-50 text-[#047857] shadow-xl shadow-emerald-900/40 lg:h-12 lg:w-12"
              >
                <LocationOnIcon fontSize="medium" />
              </motion.div>
            </div>
            <div className="hidden flex-col sm:flex">
              <span className="text-lg font-extrabold leading-none tracking-tight lg:text-xl">
                Yaqin{' '}
                <span className="bg-gradient-to-r from-emerald-300 to-teal-200 bg-clip-text text-transparent">
                  Xizmat
                </span>
              </span>
              <span className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.2em] text-white/40">
                Platform
              </span>
            </div>
          </Link>

          {/* ============ DESKTOP NAV ============ */}
          <nav className="hidden items-center gap-1 xl:flex">
            {navItems.map((item) => {
              const active = isActive(item.href)
              return (
                <motion.div key={`${item.href}-${item.label}`} whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
                  <Link
                    to={item.href}
                    className={`group relative block rounded-xl px-5 py-2.5 text-sm font-bold transition-colors duration-300 ${
                      active ? 'text-emerald-300' : 'text-white/80 hover:text-white'
                    }`}
                  >
                    <span className="relative z-10">{item.label}</span>

                    {/* Hover bg */}
                    <span className="absolute inset-0 rounded-xl bg-white/[0.08] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                    {/* Active indicator */}
                    {active && (
                      <motion.span
                        layoutId="activeNav"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        className="absolute inset-x-4 -bottom-0.5 h-0.5 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 shadow-[0_0_10px_rgba(52,211,153,0.9)]"
                      />
                    )}
                  </Link>
                </motion.div>
              )
            })}
          </nav>

          {/* ============ DESKTOP ACTIONS ============ */}
          <div className="hidden items-center gap-3 xl:flex">
            {isAuthenticated ? (
              <>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/dashboard"
                    className="group relative flex h-11 items-center gap-2 overflow-hidden rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-5 text-sm font-extrabold text-emerald-100 backdrop-blur-md transition-colors duration-300 hover:border-emerald-400/60 hover:bg-emerald-500/20"
                  >
                    <StorefrontIcon fontSize="small" className="text-emerald-400" />
                    {user?.full_name?.split(' ')[0] ?? 'Profil'}
                  </Link>
                </motion.div>

                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  type="button"
                  className="grid h-11 w-11 place-items-center rounded-xl border border-red-500/30 bg-red-500/10 text-red-200 backdrop-blur-md transition-colors duration-300 hover:border-red-400/60 hover:bg-red-500/20"
                  aria-label="Chiqish"
                >
                  <LogoutIcon fontSize="small" />
                </motion.button>
              </>
            ) : (
              <>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/login"
                    className="flex h-11 items-center rounded-xl border border-white/20 bg-white/[0.08] px-6 text-sm font-extrabold text-white backdrop-blur-md transition-colors duration-300 hover:border-emerald-400/50 hover:bg-emerald-500/20"
                  >
                    Kirish
                  </Link>
                </motion.div>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/register"
                    className="group/btn relative flex h-11 items-center overflow-hidden rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 px-6 text-sm font-extrabold text-white shadow-[0_0_20px_rgba(52,211,153,0.4)] transition-all duration-300 hover:from-emerald-400 hover:to-teal-300 hover:shadow-[0_0_25px_rgba(52,211,153,0.6)]"
                  >
                    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover/btn:translate-x-full" />
                    <span className="relative">Ro'yxatdan o'tish</span>
                  </Link>
                </motion.div>
              </>
            )}
          </div>

          {/* ============ MOBILE MENU TOGGLE ============ */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="grid h-11 w-11 place-items-center rounded-xl border border-white/15 bg-white/[0.08] text-white backdrop-blur-md transition-colors duration-300 hover:border-emerald-400/40 hover:bg-emerald-500/20 xl:hidden"
            aria-label="Menyu"
          >
            <span className="relative grid h-5 w-5 place-items-center">
              <MenuIcon
                sx={{ fontSize: 20 }}
                className={`absolute transition-all duration-300 ${
                  open ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
                }`}
              />
              <CloseIcon
                sx={{ fontSize: 20 }}
                className={`absolute transition-all duration-300 ${
                  open ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'
                }`}
              />
            </span>
          </motion.button>
        </div>
      </motion.header>

      {/* ============ SPACER (fixed header uchun) ============ */}
      <div className="h-[72px] lg:h-20" />

      {/* ============ MOBILE MENU ============ */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm xl:hidden"
            />

            {/* Menu panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 350, damping: 35 }}
              className="fixed right-0 top-0 z-50 h-full w-[85%] max-w-sm overflow-y-auto border-l border-white/10 bg-[#021d18]/98 px-5 pb-8 pt-24 backdrop-blur-3xl xl:hidden"
            >
              {/* Decorative glow */}
              <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-emerald-400/20 blur-[100px]" />
              <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-teal-400/20 blur-[100px]" />

              {/* Close button */}
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-xl border border-white/15 bg-white/[0.08] text-white transition hover:bg-emerald-500/20"
                aria-label="Yopish"
              >
                <CloseIcon sx={{ fontSize: 20 }} />
              </button>

              {/* User info (if authenticated) */}
              {isAuthenticated && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="relative mb-6 flex items-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4"
                >
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-lg shadow-emerald-500/30">
                    <StorefrontIcon />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-extrabold text-white">
                      {user?.full_name ?? 'Foydalanuvchi'}
                    </p>
                    <p className="mt-0.5 text-xs font-semibold text-emerald-300/80">
                      Xush kelibsiz!
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Nav items */}
              <nav className="relative grid gap-2">
                <p className="mb-1 px-3 text-[10px] font-extrabold uppercase tracking-[0.2em] text-white/40">
                  Navigatsiya
                </p>
                {navItems.map((item, index) => {
                  const active = isActive(item.href)
                  return (
                    <motion.div
                      key={`${item.href}-${item.label}`}
                      initial={{ x: 30, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.1 + index * 0.06 }}
                    >
                      <Link
                        to={item.href}
                        onClick={() => setOpen(false)}
                        className={`group relative flex items-center justify-between overflow-hidden rounded-2xl border px-4 py-3.5 text-sm font-bold transition-all duration-300 ${
                          active
                            ? 'border-emerald-500/30 bg-gradient-to-r from-emerald-500/20 to-teal-500/10 text-emerald-200'
                            : 'border-transparent text-white/90 hover:border-white/10 hover:bg-white/[0.06] hover:text-white'
                        }`}
                      >
                        <span className="relative z-10 flex items-center gap-3">
                          <span
                            className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                              active
                                ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]'
                                : 'bg-white/30 group-hover:bg-emerald-400'
                            }`}
                          />
                          {item.label}
                        </span>
                        <KeyboardArrowRightIcon
                          sx={{ fontSize: 18 }}
                          className={`relative z-10 transition-transform duration-300 ${
                            active
                              ? 'text-emerald-400'
                              : 'text-white/40 group-hover:translate-x-1 group-hover:text-emerald-400'
                          }`}
                        />
                      </Link>
                    </motion.div>
                  )
                })}
              </nav>

              {/* Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="relative mt-8"
              >
                <p className="mb-3 px-3 text-[10px] font-extrabold uppercase tracking-[0.2em] text-white/40">
                  Hisob
                </p>

                {isAuthenticated ? (
                  <div className="grid gap-3">
                    <Link
                      to="/dashboard"
                      onClick={() => setOpen(false)}
                      className="group flex items-center justify-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-4 text-sm font-extrabold text-emerald-100 backdrop-blur-md transition hover:border-emerald-400/60 hover:bg-emerald-500/20"
                    >
                      <StorefrontIcon fontSize="small" className="text-emerald-400" />
                      Shaxsiy kabinet
                    </Link>
                    <button
                      onClick={handleLogout}
                      type="button"
                      className="flex items-center justify-center gap-2 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-4 text-sm font-extrabold text-red-200 transition hover:border-red-400/60 hover:bg-red-500/20"
                    >
                      <LogoutIcon fontSize="small" />
                      Chiqish
                    </button>
                  </div>
                ) : (
                  <div className="grid gap-3">
                    <Link
                      to="/login"
                      onClick={() => setOpen(false)}
                      className="rounded-2xl border border-white/20 bg-white/[0.08] px-4 py-4 text-center text-sm font-extrabold text-white backdrop-blur-md transition hover:border-emerald-400/50 hover:bg-emerald-500/20"
                    >
                      Kirish
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setOpen(false)}
                      className="group/btn relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 px-4 py-4 text-center text-sm font-extrabold text-white shadow-lg shadow-emerald-500/40 transition hover:from-emerald-400 hover:to-teal-300"
                    >
                      <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover/btn:translate-x-full" />
                      <span className="relative">Ro'yxatdan o'tish</span>
                    </Link>
                  </div>
                )}
              </motion.div>

              {/* Footer info */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="relative mt-8 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3"
              >
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-500/20 text-emerald-300">
                  <LocationOnIcon sx={{ fontSize: 18 }} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-white/40">
                    Platform
                  </p>
                  <p className="text-xs font-bold text-white/80">
                    Yaqin Xizmat v1.0
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default Header