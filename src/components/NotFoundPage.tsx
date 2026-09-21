import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import SearchOffOutlinedIcon from '@mui/icons-material/SearchOffOutlined'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Seo from './Seo'

function NotFoundPage() {
  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-gradient-to-br from-slate-950 via-emerald-950 to-teal-950 px-5 py-10">
      <Seo title="Sahifa topilmadi" noindex />

      {/* ========== STATIC BACKGROUND ========== */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {/* Static glow orbs (no animation) */}
        <div className="absolute -top-40 -right-20 h-[480px] w-[480px] rounded-full bg-emerald-500/25 blur-[110px]" />
        <div className="absolute -bottom-40 -left-20 h-[480px] w-[480px] rounded-full bg-teal-400/25 blur-[110px]" />
        <div className="absolute top-1/2 left-1/2 h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/15 blur-[100px]" />

        {/* Grid pattern (static) */}
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(16, 185, 129, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(16, 185, 129, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 70%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 20%, transparent 70%)',
          }}
        />
      </div>

      {/* ========== MAIN CARD ========== */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="relative w-full max-w-xl"
      >
        {/* Glowing border effect (static) */}
        <div className="absolute -inset-[2px] rounded-[42px] bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 opacity-60 blur-lg" />

        <div className="relative overflow-hidden rounded-[40px] border border-white/10 bg-slate-900/80 p-10 text-center shadow-[0_25px_80px_rgba(0,0,0,0.5)] sm:p-14">
          {/* Inner glow (static) */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.08] to-transparent" />
          <div className="pointer-events-none absolute -top-32 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-emerald-500/20 blur-3xl" />

          {/* ========== ICON (no pulse rings) ========== */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.4, ease: 'easeOut' }}
            className="relative z-10 mx-auto grid h-28 w-28 place-items-center rounded-3xl bg-gradient-to-br from-emerald-400/20 to-teal-500/20 ring-1 ring-emerald-400/30"
          >
            <SearchOffOutlinedIcon
              className="relative z-10 text-emerald-300"
              sx={{ fontSize: 48 }}
            />
          </motion.div>

          {/* ========== 404 TEXT ========== */}
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="relative z-10 mt-8 bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 bg-clip-text text-[100px] font-black leading-none text-transparent drop-shadow-[0_0_30px_rgba(16,185,129,0.4)] sm:text-[120px]"
            style={{
              WebkitTextStroke: '1px rgba(16, 185, 129, 0.15)',
            }}
          >
            404
          </motion.h1>

          {/* Glow under 404 (static) */}
          <div className="mx-auto -mt-2 h-[3px] w-40 rounded-full bg-gradient-to-r from-transparent via-emerald-400 to-transparent" />

          {/* ========== TITLE ========== */}
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.35 }}
            className="relative z-10 mt-6 text-2xl font-extrabold tracking-tight text-white sm:text-3xl"
          >
            Sahifa topilmadi
          </motion.h2>

          {/* ========== DESCRIPTION ========== */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.35 }}
            className="relative z-10 mx-auto mt-3 max-w-sm text-sm font-medium leading-relaxed text-slate-400 sm:text-base"
          >
            Kechirasiz, siz qidirayotgan sahifa mavjud emas yoki ko'chirilgan bo'lishi mumkin.
          </motion.p>

          {/* ========== BUTTONS ========== */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.35 }}
            className="relative z-10 mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center"
          >
            {/* Home button */}
            <Link to="/">
              <button
                type="button"
                className="group relative inline-flex h-14 w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-8 text-sm font-extrabold text-white shadow-lg shadow-emerald-500/40 transition-all duration-200 hover:shadow-xl hover:shadow-emerald-500/60 active:scale-[0.98] sm:w-auto"
              >
                <HomeOutlinedIcon
                  fontSize="small"
                  className="transition-transform duration-200 group-hover:-translate-y-0.5"
                />
                <span>Bosh sahifa</span>
              </button>
            </Link>

            {/* Back button */}
            <button
              type="button"
              onClick={() => window.history.back()}
              className="group inline-flex h-14 items-center justify-center gap-3 rounded-2xl border border-white/15 bg-white/5 px-8 text-sm font-extrabold text-slate-200 transition-colors duration-200 hover:border-emerald-400/50 hover:bg-white/10 hover:text-emerald-300 active:scale-[0.98]"
            >
              <ArrowBackIcon
                fontSize="small"
                className="transition-transform duration-200 group-hover:-translate-x-1"
              />
              Orqaga
            </button>
          </motion.div>
        </div>
      </motion.section>

      {/* ========== FOOTER TEXT ========== */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        className="absolute bottom-6 text-xs font-medium tracking-widest text-slate-500 uppercase"
      >
        Error Code: 404 • Page Not Found
      </motion.p>
    </main>
  )
}

export default NotFoundPage