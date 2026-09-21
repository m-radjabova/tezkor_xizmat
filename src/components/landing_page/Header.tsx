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
  const { isAuthenticated, isLoading, user, logout } = useContextPro()
  const navigate = useNavigate()
  const location = useLocation()

  /* Scroll — throttled, faqat o'zgarganda */
  useEffect(() => {
    let ticking = false

    const updateScroll = () => {
      const next = window.scrollY > 20
      setScrolled((prev) => (prev === next ? prev : next))
      ticking = false
    }

    const onScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(updateScroll)
      }
    }

    updateScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* Body scroll lock */
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
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
      <header
        className={`fixed inset-x-0 top-0 z-50 text-white transition-[background-color,border-color,box-shadow] duration-300 ${
          scrolled
            ? 'border-b border-white/10 bg-[#021d18]/95 shadow-lg'
            : 'border-b border-white/5 bg-[#032b24]/80'
        }`}
      >
        {/* Top gradient line — statik */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />

        {/* Ambient glow — statik (animatsiyasiz) */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 left-1/4 h-40 w-40 rounded-full bg-emerald-400/10 blur-[60px]" />
          <div className="absolute -top-20 right-1/4 h-40 w-40 rounded-full bg-teal-300/10 blur-[60px]" />
        </div>

        <div className="relative mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 lg:h-20 lg:px-8">
          {/* ============ LOGO ============ */}
          <Link to="/" className="group flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-white to-emerald-50 text-[#047857] shadow-md lg:h-12 lg:w-12"
            >
              <LocationOnIcon fontSize="medium" />
            </motion.div>
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
                <Link
                  key={`${item.href}-${item.label}`}
                  to={item.href}
                  className={`relative block rounded-xl px-5 py-2.5 text-sm font-bold transition-colors duration-200 ${
                    active ? 'text-emerald-300' : 'text-white/80 hover:text-white'
                  }`}
                >
                  <span className="relative z-10">{item.label}</span>
                  <span className="absolute inset-0 rounded-xl bg-white/[0.06] opacity-0 transition-opacity duration-200 hover:opacity-100" />
                  {active && (
                    <span className="absolute inset-x-4 -bottom-0.5 h-0.5 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400" />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* ============ DESKTOP ACTIONS ============ */}
          <div className="hidden items-center gap-3 xl:flex">
            {isLoading ? (
              <div className="flex items-center gap-3" aria-label="Hisob tekshirilmoqda">
                <div className="h-11 w-36 animate-pulse rounded-xl border border-white/10 bg-white/10" />
                <div className="h-11 w-11 animate-pulse rounded-xl border border-white/10 bg-white/10" />
              </div>
            ) : isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="flex h-11 items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-5 text-sm font-extrabold text-emerald-100 transition-colors duration-200 hover:border-emerald-400/60 hover:bg-emerald-500/20"
                >
                  <StorefrontIcon fontSize="small" className="text-emerald-400" />
                  {user?.full_name?.split(' ')[0] ?? 'Profil'}
                </Link>

                <button
                  onClick={handleLogout}
                  type="button"
                  className="grid h-11 w-11 place-items-center rounded-xl border border-red-500/30 bg-red-500/10 text-red-200 transition-colors duration-200 hover:border-red-400/60 hover:bg-red-500/20"
                  aria-label="Chiqish"
                >
                  <LogoutIcon fontSize="small" />
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex h-11 items-center rounded-xl border border-white/20 bg-white/[0.08] px-6 text-sm font-extrabold text-white transition-colors duration-200 hover:border-emerald-400/50 hover:bg-emerald-500/20"
                >
                  Kirish
                </Link>

                <Link
                  to="/register"
                  className="flex h-11 items-center rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 px-6 text-sm font-extrabold text-white shadow-md transition-colors duration-200 hover:from-emerald-400 hover:to-teal-300"
                >
                  Ro'yxatdan o'tish
                </Link>
              </>
            )}
          </div>

          {/* ============ MOBILE MENU TOGGLE ============ */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="grid h-11 w-11 place-items-center rounded-xl border border-white/15 bg-white/[0.08] text-white transition-colors duration-200 hover:bg-emerald-500/20 xl:hidden"
            aria-label="Menyu"
          >
            <span className="relative grid h-5 w-5 place-items-center">
              <MenuIcon
                sx={{ fontSize: 20 }}
                className={`absolute transition-all duration-200 ${
                  open ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
                }`}
              />
              <CloseIcon
                sx={{ fontSize: 20 }}
                className={`absolute transition-all duration-200 ${
                  open ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'
                }`}
              />
            </span>
          </button>
        </div>
      </header>

      {/* Spacer */}
      <div className="h-[72px] lg:h-20" />

      {/* ============ MOBILE MENU ============ */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop — blur'siz */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 xl:hidden"
            />

            {/* Menu panel — tez animatsiya */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
              className="fixed right-0 top-0 z-50 h-full w-[85%] max-w-sm overflow-y-auto border-l border-white/10 bg-[#021d18] px-5 pb-8 pt-24 xl:hidden"
            >
              {/* Close button */}
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-xl border border-white/15 bg-white/[0.08] text-white transition-colors duration-200 hover:bg-emerald-500/20"
                aria-label="Yopish"
              >
                <CloseIcon sx={{ fontSize: 20 }} />
              </button>

              {/* User info */}
              {isLoading ? (
                <div className="mb-6 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] p-4" aria-label="Hisob tekshirilmoqda">
                  <div className="h-12 w-12 shrink-0 animate-pulse rounded-xl bg-white/10" />
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="h-4 w-32 animate-pulse rounded-full bg-white/10" />
                    <div className="h-3 w-24 animate-pulse rounded-full bg-white/10" />
                  </div>
                </div>
              ) : isAuthenticated && (
                <div className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 text-white">
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
                </div>
              )}

              {/* Nav items */}
              <nav className="grid gap-2">
                <p className="mb-1 px-3 text-[10px] font-extrabold uppercase tracking-[0.2em] text-white/40">
                  Navigatsiya
                </p>
                {navItems.map((item) => {
                  const active = isActive(item.href)
                  return (
                    <Link
                      key={`${item.href}-${item.label}`}
                      to={item.href}
                      onClick={() => setOpen(false)}
                      className={`group flex items-center justify-between rounded-2xl border px-4 py-3.5 text-sm font-bold transition-colors duration-200 ${
                        active
                          ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
                          : 'border-transparent text-white/90 hover:bg-white/[0.06] hover:text-white'
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            active ? 'bg-emerald-400' : 'bg-white/30'
                          }`}
                        />
                        {item.label}
                      </span>
                      <KeyboardArrowRightIcon
                        sx={{ fontSize: 18 }}
                        className={active ? 'text-emerald-400' : 'text-white/40'}
                      />
                    </Link>
                  )
                })}
              </nav>

              {/* Actions */}
              <div className="mt-8">
                <p className="mb-3 px-3 text-[10px] font-extrabold uppercase tracking-[0.2em] text-white/40">
                  Hisob
                </p>

                {isLoading ? (
                  <div className="grid gap-3" aria-label="Hisob tekshirilmoqda">
                    <div className="h-[52px] animate-pulse rounded-2xl border border-white/10 bg-white/10" />
                    <div className="h-[52px] animate-pulse rounded-2xl border border-white/10 bg-white/10" />
                  </div>
                ) : isAuthenticated ? (
                  <div className="grid gap-3">
                    <Link
                      to="/dashboard"
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-4 text-sm font-extrabold text-emerald-100 transition-colors duration-200 hover:bg-emerald-500/20"
                    >
                      <StorefrontIcon fontSize="small" className="text-emerald-400" />
                      Shaxsiy kabinet
                    </Link>
                    <button
                      onClick={handleLogout}
                      type="button"
                      className="flex items-center justify-center gap-2 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-4 text-sm font-extrabold text-red-200 transition-colors duration-200 hover:bg-red-500/20"
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
                      className="rounded-2xl border border-white/20 bg-white/[0.08] px-4 py-4 text-center text-sm font-extrabold text-white transition-colors duration-200 hover:bg-emerald-500/20"
                    >
                      Kirish
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setOpen(false)}
                      className="rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 px-4 py-4 text-center text-sm font-extrabold text-white shadow-md transition-colors duration-200 hover:from-emerald-400 hover:to-teal-300"
                    >
                      Ro'yxatdan o'tish
                    </Link>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="mt-8 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-500/20 text-emerald-300">
                  <LocationOnIcon sx={{ fontSize: 18 }} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-white/40">
                    Platform
                  </p>
                  <p className="text-xs font-bold text-white/80">Yaqin Xizmat v1.0</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default Header
