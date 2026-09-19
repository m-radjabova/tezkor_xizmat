import AppleIcon from '@mui/icons-material/Apple'
import FlashOnIcon from '@mui/icons-material/FlashOn'
import GetAppIcon from '@mui/icons-material/GetApp'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import StarIcon from '@mui/icons-material/Star'
import VerifiedIcon from '@mui/icons-material/Verified'
import type { SvgIconComponent } from '@mui/icons-material'
import { motion, useReducedMotion } from 'framer-motion'
import appPromoImage from '../../assets/yaqin_xizmat_mobile.png'

interface Feature {
  icon: SvgIconComponent
  title: string
  desc: string
  gradient: string
  glow: string
}

const features: Feature[] = [
  {
    icon: FlashOnIcon,
    title: 'Tez va qulay',
    desc: 'Kerakli xizmatni bir necha soniyada toping',
    gradient: 'from-emerald-400 to-teal-500 shadow-emerald-500/40',
    glow: 'group-hover:shadow-emerald-500/60',
  },
  {
    icon: LocationOnIcon,
    title: 'Sizga yaqin',
    desc: 'Eng yaqin xizmat ko‘rsatuvchilar xaritada',
    gradient: 'from-sky-400 to-blue-500 shadow-blue-500/40',
    glow: 'group-hover:shadow-blue-500/60',
  },
  {
    icon: VerifiedIcon,
    title: 'Ishonchli',
    desc: 'Tekshirilgan ustalar va mijozlar',
    gradient: 'from-violet-400 to-purple-500 shadow-violet-500/40',
    glow: 'group-hover:shadow-violet-500/60',
  },
]

function StoreButton({
  href,
  icon: Icon,
  store,
  label = 'Yuklab olish',
  primary = false,
}: {
  href: string
  icon: SvgIconComponent
  store: string
  label?: string
  primary?: boolean
}) {
  const look = primary
    ? 'bg-white text-slate-950 shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/35'
    : 'border border-white/20 bg-white/[0.08] text-white backdrop-blur-md hover:border-white/30 hover:bg-white/15'

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${store} orqali yuklab olish`}
      whileHover={{ y: -3, scale: 1.03 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 400, damping: 24 }}
      className={`group/btn relative inline-flex h-14 min-w-[172px] items-center gap-3 overflow-hidden rounded-2xl px-5 text-left ${look}`}
    >
      {/* Yaltiroq chiziq (shine) */}
      <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover/btn:translate-x-full" />
      <Icon sx={{ fontSize: 30 }} />
      <span className="relative leading-tight">
        <span className={`relative block text-[11px] font-semibold ${primary ? 'text-slate-500' : 'text-white/70'}`}>
          {label}
        </span>
        <span className="relative block text-base font-extrabold tracking-tight">{store}</span>
      </span>
    </motion.a>
  )
}

function AppPromo({ appStoreUrl = '#', playStoreUrl = '#' }) {
  const reduce = useReducedMotion()

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.09, delayChildren: 0.05 } },
  }
  const item = {
    hidden: { opacity: 0, y: reduce ? 0 : 18 },
    show: { opacity: 1, y: 0, transition: { duration: reduce ? 0 : 0.55, ease: 'easeOut' as const } },
  }

  return (
    <section
      id="ilova"
      aria-labelledby="app-promo-title"
      className="relative isolate w-full overflow-hidden bg-[#04241e] text-white"
    >
      {/* Orqa fon: yumshoq yorug'lik va grid */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-40 top-[-10%] h-[620px] w-[620px] rounded-full bg-emerald-500/20 blur-[140px]" />
        <div className="absolute bottom-[-20%] right-[10%] h-[460px] w-[460px] rounded-full bg-teal-400/10 blur-[130px]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-200/50 to-transparent" />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)',
            backgroundSize: '72px 72px',
            maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
          }}
        />
      </div>

      {/* Kontent kengligi: 1660px */}
      <div className="mx-auto grid min-h-[100svh] w-full max-w-[1660px] lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)]">
        {/* Chap tomon: ilova namoyishi */}
        <motion.div
          initial={{ opacity: 0, scale: reduce ? 1 : 1.04 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: reduce ? 0 : 0.9, ease: 'easeOut' }}
          className="relative flex min-h-[440px] items-center justify-center px-6 py-14 sm:min-h-[560px] sm:px-10 lg:min-h-0 lg:py-0"
        >
          {/* Porlash (glow) */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 h-[72%] w-[92%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(16,185,129,0.45),transparent)] blur-2xl"
          />

          <div className="relative w-full max-w-xl lg:max-w-[620px]">
            {/* Gradient halqa */}
            <div
              aria-hidden="true"
              className="absolute -inset-5 rounded-[2.75rem] bg-gradient-to-br from-emerald-500/50 via-teal-400/20 to-transparent opacity-95 blur-2xl"
            />

            {/* Ilova ramkasi */}
            <div className="relative overflow-hidden rounded-[2rem] border border-white/20 bg-white/10 p-3 shadow-[0_55px_110px_-25px_rgba(0,0,0,0.68)] backdrop-blur-sm">
              <div className="relative overflow-hidden rounded-[1.6rem]">
                <img
                  src={appPromoImage}
                  alt="YaqinXizmat mobil ilovasi ekranlari"
                  className="aspect-[3/2] w-full object-cover object-center"
                  loading="lazy"
                  decoding="async"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#032b24]/45 via-transparent to-transparent" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* O'ng tomon: ixcham matn */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="relative z-10 flex flex-col justify-center px-6 py-12 sm:px-10 lg:py-16 lg:pl-2 lg:pr-10 xl:pr-16"
        >
          <div className="w-full max-w-lg">
            {/* Badge */}
            <motion.div
              variants={item}
              className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-emerald-300/30 bg-emerald-400/10 px-4 py-2 backdrop-blur-md"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
              </span>
              <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-emerald-300">
                Mobil ilova
              </span>
            </motion.div>

            {/* Sarlavha */}
            <motion.h2
              id="app-promo-title"
              variants={item}
              className="text-4xl font-black leading-[1.08] tracking-tight sm:text-5xl xl:text-[52px]"
            >
              Ilovani yuklab oling,
              <span className="mt-2 block">
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-emerald-400 bg-clip-text text-transparent">
                    hamma narsa
                  </span>
                  <span className="absolute inset-x-0 -bottom-1 h-3 rounded-full bg-emerald-400/30 blur-lg" />
                </span>{' '}
                qo‘lingizda
              </span>
            </motion.h2>

            {/* Izoh */}
            <motion.p variants={item} className="mt-5 text-base leading-7 text-white/75 sm:text-lg">
              Yaqin atrofingizdagi eng yaxshi xizmatlarni telefoningizdan toping. Tez, oson va ishonchli — barchasi bir
              ilova ichida.
            </motion.p>

            {/* Yuklab olish tugmalari */}
            <motion.div variants={item} className="mt-8 flex flex-wrap gap-4">
              <StoreButton href={appStoreUrl} icon={AppleIcon} store="App Store" primary />
              <StoreButton href={playStoreUrl} icon={PlayArrowIcon} store="Google Play" />
            </motion.div>

            {/* Statistika */}
            <motion.div variants={item} className="mt-7 flex items-center gap-7">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-amber-400/15 text-amber-300">
                  <StarIcon sx={{ fontSize: 20 }} />
                </div>
                <div>
                  <p className="text-base font-black leading-none">4.9</p>
                  <p className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-white/55">Reyting</p>
                </div>
              </div>
              <div className="h-10 w-px bg-white/15" />
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-400/15 text-emerald-300">
                  <GetAppIcon sx={{ fontSize: 20 }} />
                </div>
                <div>
                  <p className="text-base font-black leading-none">10 000+</p>
                  <p className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-white/55">Yuklab olish</p>
                </div>
              </div>
            </motion.div>

            {/* Xususiyatlar */}
            <motion.ul variants={item} className="mt-9 space-y-3.5">
              {features.map((feature) => (
                <li key={feature.title}>
                  <div className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.05] p-4 backdrop-blur-md transition-all duration-300 hover:border-white/25 hover:bg-white/[0.09]">
                    <span
                      className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${feature.gradient} text-white shadow-lg ${feature.glow} transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3`}
                    >
                      <feature.icon sx={{ fontSize: 22 }} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[15px] font-extrabold">{feature.title}</p>
                      <p className="mt-0.5 text-xs leading-5 text-white/60">{feature.desc}</p>
                    </div>
                  </div>
                </li>
              ))}
            </motion.ul>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default AppPromo