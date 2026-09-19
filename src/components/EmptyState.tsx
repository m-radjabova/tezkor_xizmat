import type { IconType } from 'react-icons'
import type { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface EmptyStateProps {
  icon: IconType
  title: string
  description: string
  action?: ReactNode
}

function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="group relative overflow-hidden rounded-[36px] border border-slate-100 bg-white px-6 py-16 text-center shadow-[0_8px_40px_-12px_rgba(15,23,42,0.08)] transition-all duration-500 hover:shadow-[0_20px_60px_-15px_rgba(16,185,129,0.15)] sm:px-12 sm:py-24"
    >
      {/* ========== DECORATIVE BACKGROUND ========== */}
      {/* Soft gradient glow top */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.08)_0%,transparent_70%)]" />

      {/* Animated floating orbs */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute -right-20 top-16 h-48 w-48 rounded-full bg-emerald-300/20 blur-[60px]"
      />
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="pointer-events-none absolute -left-20 bottom-16 h-48 w-48 rounded-full bg-teal-300/20 blur-[60px]"
      />
      <motion.div
        animate={{ scale: [1, 1.4, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="pointer-events-none absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-200/20 blur-[80px]"
      />

      {/* Grid pattern (subtle) */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(16, 185, 129, 0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(16, 185, 129, 0.06) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
        }}
      />

      {/* Floating particles */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="pointer-events-none absolute h-1 w-1 rounded-full bg-emerald-400/40"
          style={{
            left: `${10 + ((i * 37) % 80)}%`,
            top: `${10 + ((i * 53) % 80)}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0, 0.8, 0],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 5 + ((i * 29) % 40) / 10,
            repeat: Infinity,
            delay: ((i * 17) % 50) / 10,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* ========== ICON CONTAINER ========== */}
      <div className="relative mx-auto flex h-28 w-28 items-center justify-center">
        {/* Pulse rings */}
        <motion.div
          animate={{ scale: [1, 1.6, 1], opacity: [0.4, 0, 0.4] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeOut' }}
          className="absolute inset-0 rounded-full border-2 border-emerald-300/50"
        />
        <motion.div
          animate={{ scale: [1, 1.9, 1], opacity: [0.3, 0, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeOut', delay: 0.8 }}
          className="absolute inset-0 rounded-full border-2 border-teal-300/40"
        />
        <motion.div
          animate={{ scale: [1, 2.2, 1], opacity: [0.2, 0, 0.2] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeOut', delay: 1.6 }}
          className="absolute inset-0 rounded-full border border-cyan-300/30"
        />

        {/* Main icon box */}
        <motion.div
          whileHover={{ scale: 1.05, rotate: 3 }}
          transition={{ type: 'spring', stiffness: 300 }}
          className="relative grid h-24 w-24 place-items-center overflow-hidden rounded-[28px] bg-gradient-to-br from-white via-emerald-50 to-teal-50 shadow-[0_15px_40px_-10px_rgba(16,185,129,0.3)] ring-1 ring-emerald-100/80 transition-all duration-500 group-hover:shadow-[0_25px_60px_-15px_rgba(16,185,129,0.4)] sm:h-28 sm:w-28"
        >
          {/* Inner shine */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.9),transparent_60%)]" />
          <div className="absolute -bottom-6 -right-6 h-20 w-20 rounded-full bg-emerald-300/30 blur-2xl" />

          {/* Rotating conic gradient ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 rounded-[28px] opacity-40"
            style={{
              background: 'conic-gradient(from 0deg, transparent, rgba(16,185,129,0.3), transparent)',
            }}
          />

          <Icon className="relative z-10 text-[36px] text-emerald-600 drop-shadow-sm transition-all duration-500 group-hover:scale-110 sm:text-[44px]" />
        </motion.div>

        {/* Sparkle dots */}
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.8)]"
        />
        <motion.div
          animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          className="absolute bottom-2 left-2 h-2 w-2 rounded-full bg-teal-400 shadow-[0_0_10px_rgba(20,184,166,0.8)]"
        />
      </div>

      {/* ========== TEXT CONTENT ========== */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.6 }}
        className="relative mx-auto mt-8 max-w-md"
      >
        <h4 className="relative text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
          {title}
          {/* Underline accent */}
          <motion.span
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.5, duration: 0.6, ease: 'easeOut' }}
            className="mx-auto mt-3 block h-[3px] w-16 origin-center rounded-full bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400"
          />
        </h4>
        <p className="mt-4 text-sm font-medium leading-relaxed text-slate-500 sm:text-base">
          {description}
        </p>
      </motion.div>

      {/* ========== ACTION ========== */}
      {action && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="relative mt-10 flex justify-center"
        >
          {action}
        </motion.div>
      )}

      {/* ========== BOTTOM DECORATIVE LINE ========== */}
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-[2px] w-0 -translate-x-1/2 bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent transition-all duration-700 group-hover:w-2/3" />
    </motion.div>
  )
}

export default EmptyState