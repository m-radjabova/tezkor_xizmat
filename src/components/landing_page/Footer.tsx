import FacebookIcon from '@mui/icons-material/Facebook'
import InstagramIcon from '@mui/icons-material/Instagram'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import SendIcon from '@mui/icons-material/Send'
import YouTubeIcon from '@mui/icons-material/YouTube'
import TelegramIcon from '@mui/icons-material/Telegram'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

function Footer() {
  const currentYear = new Date().getFullYear()

  const socials = [
    { icon: <InstagramIcon />, href: '#', label: 'Instagram', color: 'from-pink-500 to-purple-600' },
    { icon: <FacebookIcon />, href: '#', label: 'Facebook', color: 'from-blue-500 to-blue-700' },
    { icon: <YouTubeIcon />, href: '#', label: 'YouTube', color: 'from-red-500 to-red-700' },
    { icon: <TelegramIcon />, href: '#', label: 'Telegram', color: 'from-sky-400 to-sky-600' },
  ]

  const mainLinks = [
    { label: 'Bosh sahifa', path: '/' },
    { label: 'Kategoriyalar', path: '#kategoriyalar' },
    { label: 'Biz haqimizda', path: '#haqimizda' },
    { label: 'Aloqa', path: '#aloqa' },
  ]

  const userLinks = [
    { label: 'Kirish', path: '/login' },
    { label: "Ro'yxatdan o'tish", path: '/register' },
    { label: 'Savol va javoblar', path: '#' },
    { label: 'Maxfiylik siyosati', path: '#' },
  ]

  return (
    <footer
      id="aloqa"
      className="relative mt-24 overflow-hidden bg-slate-950 text-slate-300"
    >
      {/* === Statik background === */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950" />
        <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-emerald-500/15 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-teal-500/15 blur-3xl" />
        <div className="absolute top-1/3 left-1/2 h-[300px] w-[300px] rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      {/* === Grid pattern === */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* === Top glow line === */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />

      {/* === Main content === */}
      <div className="relative z-10 mx-auto max-w-7xl px-5 pt-20 pb-12 lg:px-8">
        {/* CTA Banner */}
        <div className="footer-fade footer-fade-1 relative mb-20 overflow-hidden rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent p-8 lg:p-12">
          <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-emerald-500/15 blur-3xl" />
          <div className="relative flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
            <div>
              <h2 className="text-3xl font-black tracking-tight text-white lg:text-4xl">
                Xizmatingizni bugun boshlang 🚀
              </h2>
              <p className="mt-3 max-w-xl text-[15px] font-medium text-slate-400">
                Minglab foydalanuvchilar orasida o'z biznesingizni tanishtiring va yangi mijozlarga ega bo'ling.
              </p>
            </div>
            <a
              href="/register"
              className="group flex items-center gap-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-7 py-4 font-bold text-white shadow-md transition-colors duration-200 hover:from-emerald-400 hover:to-teal-400"
            >
              Boshlash
              <ArrowForwardIcon className="transition-transform duration-200 group-hover:translate-x-1" />
            </a>
          </div>
        </div>

        {/* === Grid sections === */}
        <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr_1fr_1.6fr]">
          {/* Brand */}
          <div className="footer-fade footer-fade-2 flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="relative grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 text-white shadow-md">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent" />
                <LocationOnIcon fontSize="medium" className="relative z-10" />
              </div>
              <div>
                <span className="block text-2xl font-black tracking-tight text-white">
                  Yaqin
                  <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                    Xizmat
                  </span>
                </span>
                <span className="text-xs font-semibold uppercase tracking-widest text-emerald-400/80">
                  Local Services Platform
                </span>
              </div>
            </div>

            <p className="max-w-[300px] text-[15px] leading-relaxed text-slate-400">
              Mahalliy bizneslar va xizmatlarni topish endi juda oson. O'z xizmatingizni taklif qiling yoki
              keraklisini toping.
            </p>

            {/* Social icons */}
            <div className="flex gap-3">
              {socials.map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  aria-label={social.label}
                  className="group relative grid h-11 w-11 place-items-center overflow-hidden rounded-xl border border-white/10 bg-white/5 text-slate-400 transition-colors duration-200 hover:border-transparent hover:text-white"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${social.color} opacity-0 transition-opacity duration-200 group-hover:opacity-100`}
                  />
                  <span className="relative z-10">{social.icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Main links */}
          <div className="footer-fade footer-fade-3">
            <h3 className="mb-6 flex items-center gap-2 text-sm font-black uppercase tracking-widest text-emerald-400">
              <span className="h-px w-6 bg-emerald-400" />
              Asosiy
            </h3>
            <div className="grid gap-4">
              {mainLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.path}
                  className="group flex items-center gap-2 text-[15px] font-semibold text-slate-400 transition-colors duration-200 hover:text-white"
                >
                  <ArrowForwardIcon className="h-4 w-4 -translate-x-2 opacity-0 text-emerald-400 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100" />
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          {/* User links */}
          <div className="footer-fade footer-fade-4">
            <h3 className="mb-6 flex items-center gap-2 text-sm font-black uppercase tracking-widest text-emerald-400">
              <span className="h-px w-6 bg-emerald-400" />
              Foydalanuvchi
            </h3>
            <div className="grid gap-4">
              {userLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.path}
                  className="group flex items-center gap-2 text-[15px] font-semibold text-slate-400 transition-colors duration-200 hover:text-white"
                >
                  <ArrowForwardIcon className="h-4 w-4 -translate-x-2 opacity-0 text-emerald-400 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100" />
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div className="footer-fade footer-fade-5 relative">
            <h3 className="mb-6 flex items-center gap-2 text-sm font-black uppercase tracking-widest text-emerald-400">
              <span className="h-px w-6 bg-emerald-400" />
              Newsletter
            </h3>

            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-emerald-500/15 blur-3xl" />

              <h4 className="relative z-10 text-lg font-extrabold text-white">
                Yangiliklardan xabardor bo'ling
              </h4>
              <p className="relative z-10 mt-2 mb-5 text-sm font-medium text-slate-400">
                Eng so'nggi xizmatlar va imtiyozlar haqida birinchilardan bo'lib bilib oling.
              </p>

              <form className="relative z-10 flex flex-col gap-2">
                <div className="relative">
                  <input
                    type="email"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm font-semibold text-white outline-none transition-colors duration-200 placeholder:text-slate-500 focus:border-emerald-400/50 focus:bg-white/10"
                    placeholder="Email manzilingiz"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-3.5 text-sm font-bold text-white shadow-md transition-colors duration-200 hover:from-emerald-400 hover:to-teal-400"
                >
                  Obuna bo'lish
                  <SendIcon
                    fontSize="small"
                    className="transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-0.5"
                  />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* === Bottom bar === */}
      <div className="relative border-t border-white/10 bg-slate-950/80">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-6 text-sm font-semibold text-slate-500 sm:flex-row lg:px-8">
          <p className="flex items-center gap-2">
            <span>© {currentYear}</span>
            <span className="text-white">YaqinXizmat</span>
            <span className="hidden h-1 w-1 rounded-full bg-slate-600 sm:block" />
            <span>Barcha huquqlar himoyalangan</span>
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="transition-colors duration-200 hover:text-emerald-400">Shartlar</a>
            <span className="h-4 w-px bg-white/10" />
            <a href="#" className="transition-colors duration-200 hover:text-emerald-400">Maxfiylik</a>
            <span className="h-4 w-px bg-white/10" />
            <a href="#" className="transition-colors duration-200 hover:text-emerald-400">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer