import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import BusinessIcon from '@mui/icons-material/Business'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import GoogleIcon from '@mui/icons-material/Google'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined'
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined'
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { signInWithPopup } from 'firebase/auth'
import { type FormEvent, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { firebaseaaAuth, googleProvider } from '../../firebase'
import useContextPro from '../../hooks/useContextPro'
import { useCategories } from '../../hooks/useCategories'
import { getErrorMessage } from '../../utils/error'
import { showErrorToast } from '../../utils/toast'

type AuthMode = 'customer' | 'provider'
type AuthScreen = 'login' | 'register'

interface AuthCardProps {
  screen: AuthScreen
}

/* ==================== INPUT FIELD ==================== */
function AuthField({
  icon,
  type,
  placeholder,
  value,
  onChange,
  autoComplete,
  right,
  label,
}: {
  icon: React.ReactNode
  type: string
  placeholder: string
  value: string
  onChange: (value: string) => void
  autoComplete?: string
  right?: React.ReactNode
  label?: string
}) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="flex items-center gap-1.5 text-[13px] font-bold tracking-wide text-slate-700">
          {label}
        </label>
      )}
      <div className="group relative">
        <label className="relative flex h-[54px] items-center gap-3 overflow-hidden rounded-2xl border border-slate-200 bg-white px-4 text-slate-400 shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition-all duration-300 focus-within:border-emerald-500 focus-within:shadow-[0_0_0_4px_rgba(16,185,129,0.1)] hover:border-slate-300">
          {/* Icon */}
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-slate-50 text-slate-500 transition-all duration-300 group-focus-within:bg-emerald-50 group-focus-within:text-emerald-600">
            {icon}
          </span>

          <input
            className="h-full min-w-0 flex-1 border-0 bg-transparent text-[15px] font-semibold text-slate-900 outline-none placeholder:font-medium placeholder:text-slate-400"
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            autoComplete={autoComplete}
          />

          {right}
        </label>
      </div>
    </div>
  )
}

/* ==================== SEGMENTED CONTROL ==================== */
function SegmentedControl({
  mode,
  onChange,
}: {
  mode: AuthMode
  onChange: (mode: AuthMode) => void
}) {
  return (
    <div className="relative mt-7 grid h-[52px] grid-cols-2 gap-1 rounded-2xl border border-slate-200 bg-slate-50/80 p-1">
      {/* Sliding indicator */}
      <motion.div
        layout
        transition={{ type: 'spring', stiffness: 400, damping: 32 }}
        className={`absolute inset-y-1 w-[calc(50%-4px)] rounded-xl shadow-sm ${
          mode === 'customer'
            ? 'left-1 bg-white shadow-slate-200/60'
            : 'left-[calc(50%+2px)] bg-gradient-to-br from-emerald-500 to-teal-500 shadow-emerald-500/30'
        }`}
      />

      <button
        type="button"
        onClick={() => onChange('customer')}
        className={`relative z-10 flex items-center justify-center gap-2 rounded-xl text-sm font-bold transition-colors duration-300 ${
          mode === 'customer'
            ? 'text-slate-900'
            : 'text-slate-500 hover:text-slate-700'
        }`}
      >
        <PersonOutlinedIcon sx={{ fontSize: 18 }} />
        Mijoz
      </button>
      <button
        type="button"
        onClick={() => onChange('provider')}
        className={`relative z-10 flex items-center justify-center gap-2 rounded-xl text-sm font-bold transition-colors duration-300 ${
          mode === 'provider'
            ? 'text-white'
            : 'text-slate-500 hover:text-slate-700'
        }`}
      >
        <BusinessIcon sx={{ fontSize: 18 }} />
        Xizmat ko'rsatuvchi
      </button>
    </div>
  )
}

/* ==================== GOOGLE BUTTON ==================== */
function GoogleButton({
  onClick,
  disabled,
  label = 'Google orqali kirish',
}: {
  onClick: () => void
  disabled?: boolean
  label?: string
}) {
  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="group relative flex h-[54px] w-full items-center justify-center gap-3 overflow-hidden rounded-2xl border border-slate-200 bg-white text-[15px] font-extrabold text-slate-800 shadow-sm transition-all duration-300 hover:border-emerald-300 hover:shadow-[0_10px_30px_-10px_rgba(16,185,129,0.3)] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {/* Shine sweep */}
      <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-emerald-50/80 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

      <GoogleIcon
        className="relative transition-transform duration-300 group-hover:scale-110"
        sx={{ fontSize: 22 }}
      />
      <span className="relative">{label}</span>
    </motion.button>
  )
}

/* ==================== MAIN COMPONENT ==================== */
function AuthCard({ screen }: AuthCardProps) {
  const isRegister = screen === 'register'
  const [mode, setMode] = useState<AuthMode>(isRegister ? 'provider' : 'customer')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [organizationName, setOrganizationName] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [identifier, setIdentifier] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { login, loginWithGoogle, register } = useContextPro()
  const { categories, isLoadingCategories } = useCategories()
  const navigate = useNavigate()

  const subtitle = isRegister
    ? "Xizmat ko'rsatuvchi hisobini yarating"
    : "Hisobingizga kirish uchun ma'lumotlaringizni kiriting"

  const primaryLabel = useMemo(() => {
    if (isSubmitting) return 'Kuting...'
    return isRegister ? "Ro'yxatdan o'tish" : 'Kirish'
  }, [isRegister, isSubmitting])

  /* Password strength */
  const passwordStrength = useMemo(() => {
    if (!password) return 0
    let score = 0
    if (password.length >= 6) score++
    if (password.length >= 10) score++
    if (/[A-Z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++
    return Math.min(score, 4)
  }, [password])

  const strengthLabel = ['Juda zaif', 'Zaif', 'Yaxshi', 'Kuchli', 'Juda kuchli'][passwordStrength]
  const strengthColor = [
    'bg-slate-200',
    'bg-rose-400',
    'bg-amber-400',
    'bg-emerald-400',
    'bg-emerald-500',
  ][passwordStrength]

  const handleProviderSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)

    try {
      if (isRegister) {
        if (!categoryId) {
          showErrorToast('Xizmat kategoriyasini tanlang')
          return
        }

        await register({
          full_name: fullName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          password,
          organization_name: organizationName.trim(),
          responsible_person: fullName.trim(),
          category_ids: [categoryId],
        })
      } else {
        const loggedInUser = await login({
          identifier: identifier.trim(),
          password,
        })
        navigate(loggedInUser.role === 'admin' ? '/admin' : '/provider', { replace: true })
        return
      }
      navigate('/provider', { replace: true })
    } catch (error) {
      showErrorToast(getErrorMessage(error, 'Kirishda xatolik yuz berdi'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoogle = async () => {
    setIsSubmitting(true)
    try {
      const result = await signInWithPopup(firebaseaaAuth, googleProvider)
      const idToken = await result.user.getIdToken()
      await loginWithGoogle({ id_token: idToken })
      navigate('/', { replace: true })
    } catch (error) {
      showErrorToast(getErrorMessage(error, 'Google orqali kirishda xatolik yuz berdi'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative flex min-h-screen flex-1 items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 px-5 py-10 sm:px-8 lg:px-12">
      {/* ============ DECORATIVE BACKGROUND ============ */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {/* Glow orbs */}
        <motion.div
          animate={{ y: [0, -25, 0], x: [0, 15, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-40 left-1/4 h-[420px] w-[420px] rounded-full bg-emerald-200/50 blur-[130px]"
        />
        <motion.div
          animate={{ y: [0, 25, 0], x: [0, -15, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-40 right-1/4 h-[420px] w-[420px] rounded-full bg-teal-200/50 blur-[130px]"
        />

        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(15,23,42,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.8) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
            maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
          }}
        />

        {/* Floating particles */}
        {[...Array(14)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-1 w-1 rounded-full bg-emerald-400/50"
            style={{
              left: `${(i * 37) % 100}%`,
              top: `${(i * 61) % 100}%`,
            }}
            animate={{ y: [0, -60, 0], opacity: [0, 1, 0] }}
            transition={{
              duration: 5 + (i % 4),
              repeat: Infinity,
              delay: (i * 3) % 6,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* ============ CARD WRAPPER ============ */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-[520px]"
      >
        {/* Outer glow */}
        <div className="pointer-events-none absolute -inset-2 rounded-[36px] bg-gradient-to-r from-emerald-400/20 via-teal-300/10 to-emerald-400/20 blur-2xl" />

        {/* ============ MAIN CARD ============ */}
        <div className="relative overflow-hidden rounded-[32px] border border-white/80 bg-white/90 px-6 py-8 shadow-[0_30px_90px_-25px_rgba(15,23,42,0.25)] backdrop-blur-xl sm:px-9 sm:py-10">
          {/* Top gradient line */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />

          {/* Inner subtle glow */}
          <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-emerald-400/10 blur-3xl" />

          {/* ============ HEADER ============ */}
          <div className="relative text-center">
            {/* Small badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50/80 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-emerald-700"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {isRegister ? "Yangi hisob" : 'Xush kelibsiz'}
            </motion.div>

            <h2 className="text-[28px] font-black leading-tight tracking-tight text-slate-950 sm:text-[34px]">
              {isRegister ? (
                <>
                  Ro'yxatdan{' '}
                  <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                    o'tish
                  </span>
                </>
              ) : (
                <>
                  Xush{' '}
                  <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                    kelibsiz!
                  </span>
                </>
              )}
            </h2>
            <p className="mx-auto mt-2 max-w-xs text-sm font-medium leading-relaxed text-slate-500">
              {subtitle}
            </p>
          </div>

          {/* ============ SEGMENTED CONTROL ============ */}
          {!isRegister && <SegmentedControl mode={mode} onChange={setMode} />}

          {/* ============ CONTENT (Animated) ============ */}
          <AnimatePresence mode="wait">
            {mode === 'customer' && !isRegister ? (
              /* ---------- CUSTOMER LOGIN ---------- */
              <motion.div
                key="customer"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="mt-7 space-y-4"
              >
                <GoogleButton onClick={handleGoogle} disabled={isSubmitting} />

                <div className="relative py-1 text-center">
                  <p className="text-xs font-bold text-slate-400">
                    Faqat Google orqali tez va oson kirish
                  </p>
                </div>
              </motion.div>
            ) : (
              /* ---------- PROVIDER (LOGIN + REGISTER) ---------- */
              <motion.form
                key="provider"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="mt-7 space-y-4"
                onSubmit={handleProviderSubmit}
              >
                {isRegister && (
                  <>
                    <AuthField
                      label="Mas'ul shaxs F.I.Sh"
                      icon={<PersonOutlinedIcon sx={{ fontSize: 18 }} />}
                      type="text"
                      placeholder="Ali Valiyev"
                      value={fullName}
                      onChange={setFullName}
                      autoComplete="name"
                    />

                    <AuthField
                      label="Biznes nomi"
                      icon={<BusinessIcon sx={{ fontSize: 18 }} />}
                      type="text"
                      placeholder="Shifo Farm"
                      value={organizationName}
                      onChange={setOrganizationName}
                      autoComplete="organization"
                    />

                    <AuthField
                      label="Email"
                      icon={<EmailOutlinedIcon sx={{ fontSize: 18 }} />}
                      type="email"
                      placeholder="biznes@example.com"
                      value={email}
                      onChange={setEmail}
                      autoComplete="email"
                    />

                    {/* Category select */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-1.5 text-[13px] font-bold tracking-wide text-slate-700">
                        Xizmat kategoriyasi
                      </label>
                      <div className="group relative">
                        <label className="relative flex h-[54px] items-center gap-3 overflow-hidden rounded-2xl border border-slate-200 bg-white px-4 text-slate-400 shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition-all duration-300 focus-within:border-emerald-500 focus-within:shadow-[0_0_0_4px_rgba(16,185,129,0.1)] hover:border-slate-300">
                          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-slate-50 text-slate-500 transition-all duration-300 group-focus-within:bg-emerald-50 group-focus-within:text-emerald-600">
                            <BusinessIcon sx={{ fontSize: 18 }} />
                          </span>
                          <select
                            className="h-full min-w-0 flex-1 cursor-pointer appearance-none border-0 bg-transparent text-[15px] font-semibold text-slate-900 outline-none"
                            value={categoryId}
                            onChange={(event) => setCategoryId(event.target.value)}
                            disabled={isLoadingCategories}
                          >
                            <option value="">
                              {isLoadingCategories ? 'Yuklanmoqda...' : 'Kategoriya tanlang'}
                            </option>
                            {categories.map((category) => (
                              <option key={category.id} value={category.id}>
                                {category.name}
                              </option>
                            ))}
                          </select>
                          {/* Dropdown arrow */}
                          <svg
                            className="pointer-events-none h-4 w-4 shrink-0 text-slate-400 transition-colors group-focus-within:text-emerald-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="6 9 12 15 18 9" />
                          </svg>
                        </label>
                      </div>
                    </div>
                  </>
                )}

                <AuthField
                  label={isRegister ? 'Telefon raqami' : 'Telefon raqami yoki email'}
                  icon={<PhoneOutlinedIcon sx={{ fontSize: 18 }} />}
                  type="text"
                  placeholder="+998 90 123 45 67"
                  value={isRegister ? phone : identifier}
                  onChange={isRegister ? setPhone : setIdentifier}
                  autoComplete="tel"
                />

                <AuthField
                  label="Parol"
                  icon={<LockOutlinedIcon sx={{ fontSize: 18 }} />}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={setPassword}
                  autoComplete={isRegister ? 'new-password' : 'current-password'}
                  right={
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-slate-400 transition-all duration-300 hover:bg-emerald-50 hover:text-emerald-600"
                      aria-label={showPassword ? 'Parolni yashirish' : "Parolni ko'rsatish"}
                    >
                      {showPassword ? (
                        <VisibilityOffOutlinedIcon sx={{ fontSize: 18 }} />
                      ) : (
                        <VisibilityOutlinedIcon sx={{ fontSize: 18 }} />
                      )}
                    </button>
                  }
                />

                {/* Password strength */}
                <AnimatePresence>
                  {isRegister && password && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-2 overflow-hidden"
                    >
                      <div className="flex gap-1.5">
                        {[0, 1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                              i < passwordStrength ? strengthColor : 'bg-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-slate-500">
                          Parol darajasi:{' '}
                          <span
                            className={
                              passwordStrength >= 3
                                ? 'text-emerald-600'
                                : passwordStrength >= 2
                                  ? 'text-amber-600'
                                  : 'text-rose-500'
                            }
                          >
                            {strengthLabel}
                          </span>
                        </p>
                        {passwordStrength >= 3 && (
                          <CheckCircleIcon sx={{ fontSize: 14 }} className="text-emerald-500" />
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Remember + Forgot */}
                {!isRegister && (
                  <div className="flex items-center justify-between pt-1">
                    <label className="group flex cursor-pointer items-center gap-2.5 text-sm font-semibold text-slate-600 transition hover:text-slate-800">
                      <span className="relative grid h-5 w-5 place-items-center">
                        <input
                          checked={remember}
                          onChange={(event) => setRemember(event.target.checked)}
                          type="checkbox"
                          className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-slate-300 bg-white transition-all duration-200 checked:border-emerald-500 checked:bg-emerald-500 hover:border-emerald-400"
                        />
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          className="pointer-events-none absolute h-3.5 w-3.5 text-white opacity-0 transition-opacity duration-200 peer-checked:opacity-100"
                          stroke="currentColor"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                      </span>
                      Eslab qolish
                    </label>
                    <button
                      type="button"
                      className="text-sm font-extrabold text-emerald-700 underline-offset-4 transition hover:text-emerald-800 hover:underline"
                    >
                      Parolni unutdingizmi?
                    </button>
                  </div>
                )}

                {/* Submit */}
                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isSubmitting}
                  className="group/btn relative flex h-[54px] w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-[15px] font-extrabold text-white shadow-[0_14px_30px_-8px_rgba(4,120,87,0.5)] transition-all duration-300 hover:from-emerald-400 hover:to-teal-400 hover:shadow-[0_20px_40px_-8px_rgba(4,120,87,0.6)] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover/btn:translate-x-full" />
                  {isSubmitting ? (
                    <>
                      <span className="relative h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      <span className="relative">{primaryLabel}</span>
                    </>
                  ) : (
                    <>
                      <span className="relative">{primaryLabel}</span>
                      <ArrowForwardIcon
                        sx={{ fontSize: 20 }}
                        className="relative transition-transform duration-300 group-hover/btn:translate-x-1"
                      />
                    </>
                  )}
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Provider mode - customer alternative (login only) */}
          {!isRegister && mode === 'provider' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
            >
              <div className="my-5 flex items-center gap-4 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                <span className="h-px flex-1 bg-slate-200" />
                yoki
                <span className="h-px flex-1 bg-slate-200" />
              </div>

              <GoogleButton
                onClick={() => setMode('customer')}
                label="Google orqali mijoz sifatida kirish"
              />
            </motion.div>
          )}

          {/* Footer */}
          {(isRegister || mode === 'provider') && (
            <p className="mt-7 text-center text-sm font-semibold text-slate-500">
              {isRegister ? 'Hisobingiz bormi?' : "Hisobingiz yo'qmi?"}{' '}
              <Link
                to={isRegister ? '/login' : '/register'}
                className="font-extrabold text-emerald-700 underline-offset-4 transition hover:text-emerald-800 hover:underline"
              >
                {isRegister ? 'Kirish' : "Ro'yxatdan o'tish"}
              </Link>
            </p>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default AuthCard