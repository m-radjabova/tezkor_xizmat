import { type ChangeEvent, type FormEvent, useEffect, useState } from 'react'
import {
  HiBell,
  HiCamera,
  HiEnvelope,
  HiLockClosed,
  HiPhone,
  HiTrash,
  HiUser,
} from 'react-icons/hi2'
import AdminSidebar from '../AdminSidebar'
import useContextPro from '../../hooks/useContextPro'
import { useProfile } from '../../hooks/useProfile'
import { showErrorToast } from '../../utils/toast'

const defaultPasswordForm = {
  current_password: '',
  new_password: '',
  confirm_password: '',
}

function ProviderProfile() {
  const { user, setCurrentUser } = useContextPro()
  const {
    updateMe,
    uploadAvatar,
    deleteAvatar,
    changePassword,
    isUpdating,
    isUploadingAvatar,
    isDeletingAvatar,
    isChangingPassword,
  } = useProfile()
  const [profileForm, setProfileForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    organization_name: '',
    responsible_person: '',
  })
  const [passwordForm, setPasswordForm] = useState(defaultPasswordForm)

  useEffect(() => {
    if (!user) return
    queueMicrotask(() => {
      setProfileForm({
        full_name: user.full_name || '',
        email: user.email || '',
        phone: user.phone || '',
        organization_name: user.organization_name || '',
        responsible_person: user.responsible_person || '',
      })
    })
  }, [user])

  const initials = (user?.full_name || 'Provider')
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const handleProfileSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      const updatedUser = await updateMe({
        full_name: profileForm.full_name.trim(),
        email: profileForm.email.trim(),
        phone: profileForm.phone.trim() || null,
        organization_name: profileForm.organization_name.trim() || null,
        responsible_person: profileForm.responsible_person.trim() || null,
      })
      setCurrentUser(updatedUser)
    } catch {
      // useProfile already shows a clear toast.
    }
  }

  const handleAvatarChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    try {
      const updatedUser = await uploadAvatar(file)
      setCurrentUser(updatedUser)
    } catch {
      // useProfile already shows a clear toast.
    }
  }

  const handleDeleteAvatar = async () => {
    try {
      const updatedUser = await deleteAvatar()
      setCurrentUser(updatedUser)
    } catch {
      // useProfile already shows a clear toast.
    }
  }

  const handlePasswordSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (passwordForm.new_password !== passwordForm.confirm_password) {
      showErrorToast('Yangi parol takrori mos emas')
      return
    }

    try {
      await changePassword({
        current_password: passwordForm.current_password,
        new_password: passwordForm.new_password,
      })
      setPasswordForm(defaultPasswordForm)
    } catch {
      // useProfile already shows a clear toast.
    }
  }

  return (
    <div className="min-h-screen bg-[#f6f8fb] text-slate-950 lg:flex">
      <AdminSidebar />
      <main className="min-w-0 flex-1 px-4 pb-6 pt-20 sm:px-6 lg:px-8 lg:pt-0">
        <header className="sticky top-0 z-20 -mx-4 mb-5 flex min-h-[70px] items-center gap-4 border-b border-slate-100 bg-white/90 px-4 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <h1 className="mr-auto text-2xl font-black tracking-tight">Profil</h1>
          <button className="relative grid h-11 w-11 place-items-center rounded-[8px] bg-white text-slate-700 shadow-sm">
            <HiBell className="h-5 w-5" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
          </button>
        </header>

        <section className="grid gap-5 xl:grid-cols-[0.85fr_1.15fr]">
          <article className="rounded-[8px] bg-white p-6 shadow-sm">
            <div className="flex flex-col items-center text-center">
              <div className="grid h-32 w-32 place-items-center overflow-hidden rounded-full bg-emerald-50 text-3xl font-black text-emerald-700 ring-8 ring-slate-50">
                {user?.avatar_url ? (
                  <img src={user.avatar_url} alt={user.full_name} className="h-full w-full object-cover" />
                ) : (
                  initials
                )}
              </div>
              <h2 className="mt-4 text-2xl font-black">{user?.full_name}</h2>
              <p className="mt-1 text-sm font-bold text-slate-500">{user?.email}</p>
              <div className="mt-5 grid w-full gap-3 sm:grid-cols-2">
                <label className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-[8px] bg-emerald-700 text-sm font-black text-white">
                  <HiCamera className="h-5 w-5" />
                  {isUploadingAvatar ? 'Yuklanmoqda...' : 'Avatar yuklash'}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={isUploadingAvatar}
                    onChange={handleAvatarChange}
                  />
                </label>
                <button
                  type="button"
                  onClick={() => void handleDeleteAvatar()}
                  disabled={!user?.avatar_url || isDeletingAvatar}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-[8px] border border-red-100 text-sm font-black text-red-600 disabled:opacity-50"
                >
                  <HiTrash className="h-5 w-5" />
                  O'chirish
                </button>
              </div>
            </div>
          </article>

          <form onSubmit={handleProfileSubmit} className="rounded-[8px] bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black">Shaxsiy ma'lumotlar</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <label>
                <span className="mb-2 block text-sm font-black">F.I.Sh</span>
                <div className="flex h-12 items-center gap-3 rounded-[8px] border border-slate-200 px-4">
                  <HiUser className="h-5 w-5 text-slate-400" />
                  <input
                    value={profileForm.full_name}
                    onChange={(event) => setProfileForm((current) => ({ ...current, full_name: event.target.value }))}
                    className="min-w-0 flex-1 text-sm font-bold outline-none"
                  />
                </div>
              </label>
              <label>
                <span className="mb-2 block text-sm font-black">Email</span>
                <div className="flex h-12 items-center gap-3 rounded-[8px] border border-slate-200 px-4">
                  <HiEnvelope className="h-5 w-5 text-slate-400" />
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={(event) => setProfileForm((current) => ({ ...current, email: event.target.value }))}
                    className="min-w-0 flex-1 text-sm font-bold outline-none"
                  />
                </div>
              </label>
              <label>
                <span className="mb-2 block text-sm font-black">Telefon</span>
                <div className="flex h-12 items-center gap-3 rounded-[8px] border border-slate-200 px-4">
                  <HiPhone className="h-5 w-5 text-slate-400" />
                  <input
                    value={profileForm.phone}
                    onChange={(event) => setProfileForm((current) => ({ ...current, phone: event.target.value }))}
                    className="min-w-0 flex-1 text-sm font-bold outline-none"
                  />
                </div>
              </label>
              <label>
                <span className="mb-2 block text-sm font-black">Tashkilot nomi</span>
                <input
                  value={profileForm.organization_name}
                  onChange={(event) => setProfileForm((current) => ({ ...current, organization_name: event.target.value }))}
                  className="h-12 w-full rounded-[8px] border border-slate-200 px-4 text-sm font-bold outline-none focus:border-emerald-600"
                />
              </label>
              <label className="md:col-span-2">
                <span className="mb-2 block text-sm font-black">Mas'ul shaxs</span>
                <input
                  value={profileForm.responsible_person}
                  onChange={(event) => setProfileForm((current) => ({ ...current, responsible_person: event.target.value }))}
                  className="h-12 w-full rounded-[8px] border border-slate-200 px-4 text-sm font-bold outline-none focus:border-emerald-600"
                />
              </label>
            </div>
            <button
              type="submit"
              disabled={isUpdating}
              className="mt-6 h-12 rounded-[8px] bg-emerald-700 px-7 text-sm font-black text-white disabled:opacity-60"
            >
              {isUpdating ? 'Saqlanmoqda...' : "Ma'lumotlarni saqlash"}
            </button>
          </form>
        </section>

        <form onSubmit={handlePasswordSubmit} className="mt-5 rounded-[8px] bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black">Parolni o'zgartirish</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {[
              { key: 'current_password', label: 'Joriy parol' },
              { key: 'new_password', label: 'Yangi parol' },
              { key: 'confirm_password', label: 'Yangi parol takrori' },
            ].map((item) => (
              <label key={item.key}>
                <span className="mb-2 block text-sm font-black">{item.label}</span>
                <div className="flex h-12 items-center gap-3 rounded-[8px] border border-slate-200 px-4">
                  <HiLockClosed className="h-5 w-5 text-slate-400" />
                  <input
                    type="password"
                    value={passwordForm[item.key as keyof typeof passwordForm]}
                    onChange={(event) =>
                      setPasswordForm((current) => ({ ...current, [item.key]: event.target.value }))
                    }
                    className="min-w-0 flex-1 text-sm font-bold outline-none"
                    minLength={6}
                  />
                </div>
              </label>
            ))}
          </div>
          <button
            type="submit"
            disabled={isChangingPassword}
            className="mt-6 h-12 rounded-[8px] bg-slate-950 px-7 text-sm font-black text-white disabled:opacity-60"
          >
            {isChangingPassword ? "O'zgartirilmoqda..." : "Parolni o'zgartirish"}
          </button>
        </form>
      </main>
    </div>
  )
}

export default ProviderProfile
