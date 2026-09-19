import WhatshotIcon from '@mui/icons-material/Whatshot'
import heroImage from '../../assets/bg_image.png'
import type { Category } from '../../types'
import { motion } from 'framer-motion'

interface HeroProps {
  search: string
  onSearchChange: (value: string) => void
  categories: Category[]
  popularTags: string[]
  selectedCategoryId: string
  onCategoryChange: (value: string) => void
  onSubmit: () => void
}

function Hero({
  onSearchChange,
  popularTags,
}: HeroProps) {
  return (
    <section className="w-full px-0">
      <div className="relative min-h-[calc(100svh-80px)] overflow-hidden bg-[#032b24] text-white">
        {/* Background image */}
        <motion.img
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1.05, opacity: 1 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          src={heroImage}
          alt="manzarasi"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Multi-layer gradient overlays */}
        <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(3,45,38,0.98)_0%,rgba(4,80,60,0.85)_35%,rgba(6,120,88,0.4)_65%,rgba(6,120,88,0.1)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.3),transparent_50%)]" />
        <div className="absolute inset-x-0 bottom-0 h-96 bg-gradient-to-t from-[#021d18] via-[#021d18]/70 to-transparent" />

        {/* Decorative blurred orbs */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3] 
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-emerald-400/30 blur-[120px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.5, 0.2] 
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="pointer-events-none absolute top-1/3 right-0 h-96 w-96 rounded-full bg-teal-300/20 blur-[140px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3] 
          }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="pointer-events-none absolute -bottom-20 left-1/3 h-80 w-80 rounded-full bg-emerald-500/20 blur-[120px]" 
        />

        {/* Subtle grid pattern */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.1]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
            maskImage:
              'radial-gradient(ellipse at center, black 40%, transparent 80%)',
          }}
        />

        <div className="relative z-10 mx-auto flex min-h-[calc(100svh-80px)] max-w-7xl flex-col justify-center px-5 py-12 sm:px-10 lg:px-8 lg:py-16">
          {/* Badge */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-7 inline-flex w-fit items-center gap-3 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 backdrop-blur-md shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:bg-white/15 transition-colors duration-300"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
            </span>
            <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-white/95 sm:text-sm">
              Har bir hudud uchun yaqin xizmatlar
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="max-w-4xl text-5xl font-black leading-[1.1] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl drop-shadow-2xl"
          >
            Yaqin xizmatlar{'  - '}
            <span className="relative inline-block mt-2 sm:mt-0">
              <span className="relative z-10 bg-gradient-to-r from-emerald-300 via-teal-200 to-emerald-400 bg-clip-text text-transparent">
                bir qadam
              </span>
              <span className="absolute inset-x-0 -bottom-2 h-4 rounded-full bg-emerald-400/30 blur-lg" />
            </span>{' '}
            yaqinroq
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 max-w-2xl text-lg font-medium leading-8 text-white/85 sm:text-xl sm:leading-9 md:text-2xl md:leading-10 drop-shadow-md"
          >
            Shaharingizdagi ishonchli xizmatlarni toping va hayotingizni
            osonlashtiring — <span className="font-bold text-white">tez, qulay va ishonchli</span>.
          </motion.p>

          {/* Popular tags */}
          <motion.div 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <span className="flex items-center gap-2 text-sm font-extrabold text-white/90">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-orange-400 to-red-500 text-white shadow-lg shadow-orange-500/30">
                <WhatshotIcon sx={{ fontSize: 18 }} />
              </span>
              Ommabop:
            </span>
            {popularTags.map((tag) => (
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                key={tag}
                type="button"
                onClick={() => onSearchChange(tag)}
                className="group/tag relative overflow-hidden rounded-full border border-white/20 bg-white/[0.08] px-6 py-2.5 text-sm font-bold text-white backdrop-blur-md transition-all duration-300 hover:border-emerald-400/50 hover:bg-emerald-500/20 hover:shadow-[0_0_15px_rgba(52,211,153,0.3)]"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-emerald-400/0 via-emerald-400/10 to-emerald-400/0 opacity-0 transition-opacity duration-300 group-hover/tag:opacity-100" />
                <span className="relative">{tag}</span>
              </motion.button>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Hero
