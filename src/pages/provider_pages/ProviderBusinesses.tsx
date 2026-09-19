import {
  HiArrowRight,
  HiBell,
  HiCamera,
  HiCheck,
  HiChevronDown,
  HiClock,
  HiMagnifyingGlass,
  HiMapPin,
  HiPencil,
  HiPhone,
  HiPlus,
  HiQrCode,
  HiShare,
  HiSparkles,
  HiStar,
  HiTrash,
  HiUserGroup,
  HiXMark,
  HiArrowPath,
} from 'react-icons/hi2'
import {
  type ChangeEvent,
  type FormEvent,
  type MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useSearchParams } from 'react-router-dom'
import AdminSidebar from '../AdminSidebar'
import useContextPro from '../../hooks/useContextPro'
import { useCategories } from '../../hooks/useCategories'
import {
  uploadBusinessImages,
  uploadBusinessLogo,
  useProviderBusinesses,
} from '../../hooks/useProviderBusinesses'
import { useProviderReviews } from '../../hooks/useProviderReviews'
import { showErrorToast, showSuccessToast } from '../../utils/toast'
import { getErrorMessage } from '../../utils/error'
import Skeleton, { SkeletonText } from '../../components/Skeleton'
import bgImage from '../../assets/bg_image.png'
import type { Business } from '../../types'

type WizardStep = 1 | 2 | 3
type FormMode = 'create' | 'edit'

const defaultForm = {
  category_id: '',
  name: '',
  description: '',
  phone: '',
  address: '',
  latitude: '41.3775',
  longitude: '64.5853',
  working_days: 'Har kuni',
  open_time: '08:00',
  close_time: '22:00',
}

const workingDayOptions = [
  'Har kuni',
  'Haftada 6 kun',
  'Dushanba - Juma',
  'Dushanba - Shanba',
  'Dam olish kunlari',
  'Boshqa',
]

const steps = [
  { id: 1, label: "Ma'lumotlar", description: 'Asosiy info' },
  { id: 2, label: 'Lokatsiya', description: 'Manzil' },
  { id: 3, label: 'Tasdiqlash', description: "Yakuniy ko'rik" },
]

function formatTime(value?: string | null) {
  return value ? value.slice(0, 5) : '--:--'
}

function businessToForm(business: Business) {
  return {
    category_id: business.category_id,
    name: business.name,
    description: business.description || '',
    phone: business.phone || '',
    address: business.address,
    latitude: String(business.latitude),
    longitude: String(business.longitude),
    working_days: business.working_days || 'Har kuni',
    open_time: formatTime(business.open_time),
    close_time: formatTime(business.close_time),
  }
}

interface LocationPickerProps {
  latitude: string
  longitude: string
  onChange: (latitude: string, longitude: string) => void
}

const mapZoom = 14
const tileSize = 256
const tileCount = 2 ** mapZoom
const tileRange = [-3, -2, -1, 0, 1, 2, 3]

function latLngToPoint(latitude: number, longitude: number) {
  const sinLatitude = Math.sin((latitude * Math.PI) / 180)
  const x = ((longitude + 180) / 360) * tileCount * tileSize
  const y =
    (0.5 - Math.log((1 + sinLatitude) / (1 - sinLatitude)) / (4 * Math.PI)) *
    tileCount *
    tileSize
  return { x, y }
}

function pointToLatLng(x: number, y: number) {
  const longitude = (x / (tileCount * tileSize)) * 360 - 180
  const mercator = Math.PI - (2 * Math.PI * y) / (tileCount * tileSize)
  const latitude = (180 / Math.PI) * Math.atan(0.5 * (Math.exp(mercator) - Math.exp(-mercator)))
  return { latitude, longitude }
}

function getTileUrl(x: number, y: number) {
  const servers = ['a', 'b', 'c']
  const wrappedX = ((x % tileCount) + tileCount) % tileCount
  const server = servers[Math.abs(x + y) % servers.length]
  return `https://${server}.tile.openstreetmap.fr/hot/${mapZoom}/${wrappedX}/${y}.png`
}

function LocationPicker({ latitude, longitude, onChange }: LocationPickerProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const currentLatitude = Number(latitude) || 41.3775
  const currentLongitude = Number(longitude) || 64.5853
  const centerPoint = latLngToPoint(currentLatitude, currentLongitude)
  const centerTileX = Math.floor(centerPoint.x / tileSize)
  const centerTileY = Math.floor(centerPoint.y / tileSize)

  const selectPoint = (x: number, y: number) => {
    const container = mapContainerRef.current
    if (!container) return
    const rect = container.getBoundingClientRect()
    const nextPoint = {
      x: centerPoint.x + x - rect.width / 2,
      y: centerPoint.y + y - rect.height / 2,
    }
    const nextPosition = pointToLatLng(nextPoint.x, nextPoint.y)
    onChange(nextPosition.latitude.toFixed(6), nextPosition.longitude.toFixed(6))
  }

  const handleMapClick = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    selectPoint(event.clientX - rect.left, event.clientY - rect.top)
  }

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      showErrorToast('Brauzeringiz geolokatsiyani qo‘llab-quvvatlamaydi')
      return
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        onChange(
          position.coords.latitude.toFixed(6),
          position.coords.longitude.toFixed(6),
        )
      },
      () => showErrorToast('Joriy lokatsiyani olish imkoni bo‘lmadi'),
      { enableHighAccuracy: true, timeout: 8000 },
    )
  }

  return (
    <div
      ref={mapContainerRef}
      className="relative mt-5 h-[520px] cursor-crosshair overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm"
      onClick={handleMapClick}
    >
      <div className="absolute inset-0">
        {tileRange.flatMap((offsetX) =>
          tileRange.map((offsetY) => {
            const tileX = centerTileX + offsetX
            const tileY = centerTileY + offsetY
            const left = tileX * tileSize - centerPoint.x
            const top = tileY * tileSize - centerPoint.y
            return (
              <img
                key={`${tileX}-${tileY}`}
                src={getTileUrl(tileX, tileY)}
                alt=""
                draggable={false}
                className="absolute h-64 w-64 select-none"
                style={{
                  left: `calc(50% + ${left}px)`,
                  top: `calc(50% + ${top}px)`,
                }}
              />
            )
          }),
        )}
      </div>

      {/* Pin */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-full">
        <div className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-[0_12px_30px_rgba(4,120,87,0.45)] ring-[10px] ring-emerald-500/20">
          <HiMapPin className="h-7 w-7" />
        </div>
      </div>

      {/* Top controls */}
      <div
        className="absolute left-4 right-4 top-4 z-10 flex flex-col gap-3 sm:left-6 sm:right-6 sm:flex-row"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex h-12 min-w-0 flex-1 items-center gap-3 rounded-xl bg-white/95 px-4 shadow-sm ring-1 ring-slate-200/60 backdrop-blur">
          <HiMagnifyingGlass className="h-5 w-5 shrink-0 text-slate-400" />
          <span className="truncate text-sm font-semibold text-slate-500">
            Xaritadan kerakli nuqtani bosing
          </span>
        </div>
        <button
          type="button"
          onClick={useCurrentLocation}
          className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 px-5 text-sm font-black text-white shadow-sm shadow-emerald-900/20 transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <HiArrowPath className="h-5 w-5" />
          Mening joyim
        </button>
      </div>

      <p className="absolute bottom-3 left-4 z-10 rounded-lg bg-white/90 px-3 py-2 text-xs font-bold text-slate-500 shadow-sm backdrop-blur">
        © OpenStreetMap contributors
      </p>
    </div>
  )
}

function ProviderBusinesses() {
  const { user } = useContextPro()
  const { categories, isLoadingCategories } = useCategories()
  const {
    businesses,
    isLoadingBusinesses,
    isCreatingBusiness,
    isUpdatingBusiness,
    isDeletingBusiness,
    createBusiness,
    updateBusiness,
    deleteBusiness,
    refetchBusinesses,
  } = useProviderBusinesses()
  const { reviews } = useProviderReviews()
  const [searchParams, setSearchParams] = useSearchParams()
  const [isAdding, setIsAdding] = useState(searchParams.get('new') === '1')
  const [formMode, setFormMode] = useState<FormMode>('create')
  const [editingBusinessId, setEditingBusinessId] = useState('')
  const [step, setStep] = useState<WizardStep>(1)
  const [form, setForm] = useState(defaultForm)
  const [isCustomWorkingDays, setIsCustomWorkingDays] = useState(false)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [existingLogo, setExistingLogo] = useState<string | null>(null)
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [existingImages, setExistingImages] = useState<string[]>([])
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [lightboxImageIndex, setLightboxImageIndex] = useState<number | null>(null)
  const [selectedBusinessId, setSelectedBusinessId] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<Business | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const selectedBusiness =
    businesses.find((business) => business.id === selectedBusinessId) ?? businesses[0]
  const selectedBusinessReviews = reviews.filter(
    (review) => review.is_approved && review.business_id === selectedBusiness?.id,
  )
  const selectedBusinessRatingAverage = selectedBusinessReviews.length
    ? selectedBusinessReviews.reduce((total, review) => total + review.rating, 0) /
      selectedBusinessReviews.length
    : 0
  const selectedBusinessRatingCount = selectedBusinessReviews.length
  const selectedCategory = categories.find((category) => category.id === form.category_id)
  const previewUrls = useMemo(
    () => imageFiles.map((file) => URL.createObjectURL(file)),
    [imageFiles],
  )
  const logoPreviewUrl = useMemo(
    () => (logoFile ? URL.createObjectURL(logoFile) : existingLogo),
    [existingLogo, logoFile],
  )
  const allPreviewUrls = useMemo(
    () => [...existingImages, ...previewUrls],
    [existingImages, previewUrls],
  )
  const selectedPreviewUrl = allPreviewUrls[selectedImageIndex] ?? allPreviewUrls[0]
  const displayName = user?.full_name || 'Provider'
  const initials = displayName
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [previewUrls])

  useEffect(() => {
    return () => {
      if (logoFile && logoPreviewUrl) URL.revokeObjectURL(logoPreviewUrl)
    }
  }, [logoFile, logoPreviewUrl])

  useEffect(() => {
    if (!form.category_id && categories[0]) {
      queueMicrotask(() =>
        setForm((current) => ({ ...current, category_id: categories[0].id })),
      )
    }
  }, [categories, form.category_id])

  useEffect(() => {
    if (!businesses.length) {
      queueMicrotask(() => setSelectedBusinessId(''))
      return
    }
    if (
      !selectedBusinessId ||
      !businesses.some((business) => business.id === selectedBusinessId)
    ) {
      queueMicrotask(() => setSelectedBusinessId(businesses[0].id))
    }
  }, [businesses, selectedBusinessId])

  useEffect(() => {
    if (selectedImageIndex >= allPreviewUrls.length) {
      queueMicrotask(() =>
        setSelectedImageIndex(Math.max(0, allPreviewUrls.length - 1)),
      )
    }
  }, [allPreviewUrls.length, selectedImageIndex])

  const updateForm = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const updateLocation = useCallback((latitude: string, longitude: string) => {
    setForm((current) => ({ ...current, latitude, longitude }))
  }, [])

  const openAddForm = () => {
    setIsAdding(true)
    setFormMode('create')
    setEditingBusinessId('')
    setStep(1)
    setForm(defaultForm)
    setLogoFile(null)
    setExistingLogo(null)
    setImageFiles([])
    setExistingImages([])
    setSelectedImageIndex(0)
    setLightboxImageIndex(null)
    setIsCustomWorkingDays(false)
    setSearchParams({ new: '1' })
  }

  const openEditForm = (business: Business) => {
    setIsAdding(true)
    setFormMode('edit')
    setEditingBusinessId(business.id)
    setStep(1)
    setForm(businessToForm(business))
    setLogoFile(null)
    setExistingLogo(business.logo_url)
    setExistingImages(business.images || [])
    setImageFiles([])
    setSelectedImageIndex(0)
    setLightboxImageIndex(null)
    setIsCustomWorkingDays(
      Boolean(business.working_days && !workingDayOptions.includes(business.working_days)),
    )
    setSearchParams({ edit: business.id })
  }

  const closeAddForm = () => {
    setIsAdding(false)
    setFormMode('create')
    setEditingBusinessId('')
    setStep(1)
    setLogoFile(null)
    setExistingLogo(null)
    setExistingImages([])
    setImageFiles([])
    setSelectedImageIndex(0)
    setLightboxImageIndex(null)
    setSearchParams({})
  }

  const handleImages = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? [])
    if (!files.length) return
    setImageFiles((current) => {
      const remainingSlots = 5 - existingImages.length - current.length
      if (remainingSlots <= 0) {
        showErrorToast('5 tagacha rasm yuklash mumkin')
        return current
      }
      const nextFiles = [...current, ...files.slice(0, remainingSlots)]
      if (files.length > remainingSlots) {
        showErrorToast(`Faqat ${remainingSlots} ta rasm qo'shildi. Jami limit 5 ta.`)
      }
      setSelectedImageIndex(existingImages.length + current.length)
      return nextFiles
    })
    event.target.value = ''
  }

  const handleLogo = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    setLogoFile(file)
    event.target.value = ''
  }

  const removeImage = (index: number) => {
    if (index < existingImages.length) {
      setExistingImages((current) =>
        current.filter((_, currentIndex) => currentIndex !== index),
      )
      setSelectedImageIndex((current) => {
        if (current === index) return Math.max(0, index - 1)
        if (current > index) return current - 1
        return current
      })
      setLightboxImageIndex((current) => {
        if (current === null) return null
        if (current === index) return null
        if (current > index) return current - 1
        return current
      })
      return
    }
    const fileIndex = index - existingImages.length
    setImageFiles((current) => current.filter((_, currentIndex) => currentIndex !== fileIndex))
    setSelectedImageIndex((current) => {
      if (current === index) return Math.max(0, index - 1)
      if (current > index) return current - 1
      return current
    })
    setLightboxImageIndex((current) => {
      if (current === null) return null
      if (current === index) return null
      if (current > index) return current - 1
      return current
    })
  }

  const goNext = () => {
    if (step === 1) {
      if (
        !form.category_id ||
        !form.name.trim() ||
        !form.description.trim() ||
        !form.phone.trim() ||
        !form.working_days.trim() ||
        (!logoFile && !existingLogo)
      ) {
        showErrorToast("Asosiy ma'lumotlar va logoni to'ldiring")
        return
      }
      setStep(2)
      return
    }
    if (step === 2) {
      if (
        !form.address.trim() ||
        !Number.isFinite(Number(form.latitude)) ||
        !Number.isFinite(Number(form.longitude))
      ) {
        showErrorToast("Lokatsiya ma'lumotlarini to'ldiring")
        return
      }
      setStep(3)
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (step !== 3) {
      goNext()
      return
    }
    setIsSubmitting(true)
    try {
      const [uploadedUrls, uploadedLogoUrl] = await Promise.all([
        uploadBusinessImages(imageFiles),
        logoFile ? uploadBusinessLogo(logoFile) : Promise.resolve(existingLogo),
      ])
      const imageUrls = [...existingImages, ...uploadedUrls]
      const payload = {
        category_id: form.category_id,
        name: form.name.trim(),
        description: form.description.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
        working_days: form.working_days.trim(),
        open_time: form.open_time || null,
        close_time: form.close_time || null,
        logo_url: uploadedLogoUrl,
        images: imageUrls,
      }
      const savedBusiness =
        formMode === 'edit' && editingBusinessId
          ? await updateBusiness({ id: editingBusinessId, payload })
          : await createBusiness(payload)
      setSelectedBusinessId(savedBusiness.id)
      await refetchBusinesses()
      showSuccessToast(
        formMode === 'edit'
          ? 'Xizmat muvaffaqiyatli yangilandi'
          : "Xizmat muvaffaqiyatli qo'shildi",
      )
      setForm(defaultForm)
      setLogoFile(null)
      setExistingLogo(null)
      setImageFiles([])
      setExistingImages([])
      setSelectedImageIndex(0)
      setLightboxImageIndex(null)
      setIsCustomWorkingDays(false)
      closeAddForm()
    } catch (error) {
      showErrorToast(
        getErrorMessage(error, 'Xizmatni saqlashda xatolik yuz berdi'),
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const confirmDeleteBusiness = async () => {
    if (!deleteTarget) return
    try {
      await deleteBusiness(deleteTarget.id)
      showSuccessToast("Xizmat o'chirildi")
      setDeleteTarget(null)
      if (selectedBusinessId === deleteTarget.id) {
        const nextBusiness = businesses.find(
          (business) => business.id !== deleteTarget.id,
        )
        setSelectedBusinessId(nextBusiness?.id ?? '')
      }
    } catch (error) {
      showErrorToast(
        getErrorMessage(error, "Xizmatni o'chirishda xatolik yuz berdi"),
      )
    }
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-slate-50 via-white to-emerald-50/40 text-slate-950 lg:flex">
      <AdminSidebar />

      <main className="min-w-0 flex-1 overflow-x-hidden px-4 pb-10 pt-20 sm:px-6 lg:px-10 lg:pt-0">
        {/* HEADER */}
        <header className="sticky top-0 z-20 -mx-4 mb-6 flex min-h-[76px] items-center gap-3 border-b border-slate-200/70 bg-white/80 px-4 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10">
          <div className="mr-auto">
            <h1 className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
              {isAdding
                ? formMode === 'edit'
                  ? 'Xizmatni tahrirlash'
                  : "Xizmat qo'shish"
                : 'Mening xizmatlarim'}
            </h1>
            <p className="hidden text-xs font-semibold text-slate-500 sm:block">
              {isAdding ? 'Bir necha qadamda yakunlang' : 'Xizmatlaringizni boshqaring'}
            </p>
          </div>

          <div className="hidden h-11 w-full max-w-[400px] items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/70 px-4 text-slate-400 transition focus-within:border-emerald-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-500/20 md:flex">
            <HiMagnifyingGlass className="h-5 w-5" />
            <input
              type="text"
              placeholder="Xizmatlar, mijozlar, xabarlar..."
              className="w-full bg-transparent text-sm font-semibold text-slate-700 placeholder:text-slate-400 focus:outline-none"
            />
          </div>

          <button
            type="button"
            className="relative grid h-11 w-11 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:text-emerald-700 hover:shadow-md"
            aria-label="Bildirishnomalar"
          >
            <HiBell className="h-5 w-5" />
            <span className="absolute right-2.5 top-2.5 h-2 w-2 animate-pulse rounded-full bg-red-500 ring-2 ring-white" />
          </button>

          <button
            type="button"
            className="hidden items-center gap-3 rounded-xl bg-white px-2.5 py-1.5 text-left shadow-sm ring-1 ring-slate-200 transition hover:ring-emerald-300 md:flex"
          >
            <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-sm font-black text-white shadow-sm">
              {initials}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-black text-slate-900">
                {displayName}
              </span>
              <span className="block truncate text-xs font-semibold text-slate-500">
                Provayder
              </span>
            </span>
            <HiChevronDown className="h-5 w-5 text-slate-400" />
          </button>
        </header>

        {isAdding ? (
          <form
            onSubmit={handleSubmit}
            className="mx-auto max-w-[1120px] overflow-hidden rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 sm:p-7 lg:p-9"
          >
            {/* STEPPER */}
            <div className="relative mx-auto mb-10 max-w-2xl">
              <div className="absolute left-0 right-0 top-5 -z-0 h-0.5 bg-slate-100" />
              <div
                className="absolute left-0 top-5 -z-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
                style={{
                  width: `${((step - 1) / (steps.length - 1)) * 100}%`,
                }}
              />
              <div className="relative grid grid-cols-3 items-start gap-3">
                {steps.map((item) => {
                  const isDone = step > item.id
                  const isActive = step === item.id
                  return (
                    <div key={item.id} className="text-center">
                      <div className="flex justify-center">
                        <span
                          className={`grid h-10 w-10 place-items-center rounded-full text-sm font-black ring-4 ring-white transition-all duration-300 ${
                            isDone
                              ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/30'
                              : isActive
                                ? 'bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-lg shadow-emerald-500/40 scale-110'
                                : 'bg-slate-100 text-slate-400'
                          }`}
                        >
                          {isDone ? <HiCheck className="h-5 w-5" /> : item.id}
                        </span>
                      </div>
                      <p
                        className={`mt-3 text-sm font-black transition ${
                          isActive ? 'text-slate-900' : 'text-slate-400'
                        }`}
                      >
                        {item.label}
                      </p>
                      <p className="hidden text-xs font-semibold text-slate-400 sm:block">
                        {item.description}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>

            {step === 1 && (
              <div className="grid min-w-0 gap-7 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.86fr)]">
                <section className="min-w-0">
                  <div className="mb-6">
                    <h2 className="text-2xl font-black text-slate-900 sm:text-3xl">
                      {formMode === 'edit' ? 'Xizmatni tahrirlash' : "Yangi xizmat qo'shish"}
                    </h2>
                    <p className="mt-1 text-sm font-semibold text-slate-500">
                      Mijozlar sizni oson topishsin
                    </p>
                  </div>

                  {/* Category */}
                  <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-5">
                    <label className="mb-2 block text-sm font-black text-slate-800">
                      Kategoriya
                    </label>
                    <select
                      value={form.category_id}
                      onChange={(event) => updateForm('category_id', event.target.value)}
                      disabled={isLoadingCategories}
                      className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 disabled:bg-slate-50 disabled:text-slate-400"
                    >
                      <option value="">
                        {isLoadingCategories
                          ? 'Kategoriyalar yuklanmoqda...'
                          : 'Kategoriya tanlang'}
                      </option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    {selectedCategory && (
                      <div className="mt-3 flex items-center gap-3 rounded-xl border border-emerald-100 bg-white px-4 py-3 shadow-sm">
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
                          <HiSparkles className="h-5 w-5" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                            Tanlangan kategoriya
                          </p>
                          <p className="truncate text-sm font-black text-slate-900">
                            {selectedCategory.name}
                          </p>
                        </div>
                        <HiCheck className="h-6 w-6 shrink-0 rounded-full bg-emerald-600 p-1 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Basic fields */}
                  <div className="mt-5 grid gap-5">
                    <label>
                      <span className="mb-2 block text-sm font-black text-slate-800">
                        Tashkilot nomi
                      </span>
                      <input
                        value={form.name}
                        onChange={(event) => updateForm('name', event.target.value)}
                        className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-900 outline-none transition placeholder:font-semibold placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                        placeholder="Masalan: Shifo Farm"
                      />
                    </label>
                    <label>
                      <span className="mb-2 block text-sm font-black text-slate-800">
                        Xizmat tavsifi
                      </span>
                      <textarea
                        value={form.description}
                        onChange={(event) =>
                          updateForm('description', event.target.value.slice(0, 3000))
                        }
                        className="min-h-28 w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition placeholder:font-semibold placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                        placeholder="Sifatli xizmat haqida qisqa ma'lumot yozing"
                      />
                      <span className="mt-1 block text-right text-xs font-bold text-slate-400">
                        {form.description.length} / 3000
                      </span>
                    </label>
                    <label>
                      <span className="mb-2 block text-sm font-black text-slate-800">
                        Telefon raqami
                      </span>
                      <div className="flex h-12 items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 transition focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20">
                        <HiPhone className="h-5 w-5 text-emerald-600" />
                        <input
                          value={form.phone}
                          onChange={(event) => updateForm('phone', event.target.value)}
                          className="min-w-0 flex-1 bg-transparent text-sm font-bold text-slate-900 outline-none placeholder:font-semibold placeholder:text-slate-400"
                          placeholder="+998 90 123 45 67"
                        />
                      </div>
                    </label>
                  </div>
                </section>

                {/* Right: image + preview */}
                <section className="min-w-0 space-y-5 rounded-2xl border border-slate-100 bg-slate-50/50 p-5">
                  <div className="grid gap-3 sm:grid-cols-3">
                    <label>
                      <span className="mb-2 block text-sm font-black text-slate-800">
                        Ish kuni
                      </span>
                      <div className="flex h-12 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold transition focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20">
                        <HiClock className="h-5 w-5 shrink-0 text-slate-500" />
                        <select
                          value={isCustomWorkingDays ? 'Boshqa' : form.working_days}
                          onChange={(event) => {
                            if (event.target.value === 'Boshqa') {
                              setIsCustomWorkingDays(true)
                              updateForm('working_days', '')
                              return
                            }
                            setIsCustomWorkingDays(false)
                            updateForm('working_days', event.target.value)
                          }}
                          className="min-w-0 flex-1 bg-transparent outline-none"
                        >
                          {workingDayOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>
                    </label>
                    <label>
                      <span className="mb-2 block text-sm font-black text-slate-800">
                        Ochiladi
                      </span>
                      <input
                        type="time"
                        value={form.open_time}
                        onChange={(event) => updateForm('open_time', event.target.value)}
                        className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                      />
                    </label>
                    <label>
                      <span className="mb-2 block text-sm font-black text-slate-800">
                        Yopiladi
                      </span>
                      <input
                        type="time"
                        value={form.close_time}
                        onChange={(event) => updateForm('close_time', event.target.value)}
                        className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                      />
                    </label>
                  </div>

                  {isCustomWorkingDays && (
                    <label className="block">
                      <span className="mb-2 block text-sm font-black text-slate-800">
                        Ish kunlarini qo'lda kiriting
                      </span>
                      <input
                        value={form.working_days}
                        onChange={(event) => updateForm('working_days', event.target.value)}
                        className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                        placeholder="Masalan: Seshanba - Yakshanba"
                      />
                      <p className="mt-2 text-xs font-semibold text-slate-500">
                        Mijozlarga tushunarli bo'lishi uchun qisqa yozing.
                      </p>
                    </label>
                  )}

                  <div>
                    <div className="mb-3 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-black text-slate-800">Xizmat logosi</p>
                        <p className="mt-0.5 text-xs font-semibold text-slate-500">
                          Kvadrat rasm tavsiya qilinadi
                        </p>
                      </div>
                      <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-black text-emerald-700">
                        Majburiy
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded-xl border border-slate-200 bg-white">
                        {logoPreviewUrl ? (
                          <img
                            src={logoPreviewUrl}
                            alt="Xizmat logosi"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <HiCamera className="h-8 w-8 text-slate-400" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <label className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 text-sm font-black text-white transition hover:bg-emerald-800">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleLogo}
                          />
                          <HiCamera className="h-5 w-5" />
                          {logoPreviewUrl ? 'Logoni almashtirish' : 'Logo yuklash'}
                        </label>
                        {logoPreviewUrl && (
                          <button
                            type="button"
                            onClick={() => {
                              setLogoFile(null)
                              setExistingLogo(null)
                            }}
                            className="ml-2 inline-flex h-11 items-center justify-center rounded-xl border border-red-200 px-3 text-sm font-black text-red-600 transition hover:bg-red-50"
                            title="Logoni olib tashlash"
                          >
                            <HiTrash className="h-5 w-5" />
                          </button>
                        )}
                        <p className="mt-2 truncate text-xs font-semibold text-slate-500">
                          {logoFile?.name || (existingLogo ? 'Hozirgi logo' : 'PNG, JPG yoki WEBP')}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Image uploader */}
                  <div>
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-sm font-black text-slate-800">Rasmlar</p>
                      <p className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-500">
                        {allPreviewUrls.length} / 5
                      </p>
                    </div>
                    <div className="flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                      <label className="group grid h-28 w-28 shrink-0 cursor-pointer place-items-center rounded-xl border-2 border-dashed border-emerald-300 bg-emerald-50 text-center text-xs font-black text-emerald-700 transition hover:border-emerald-500 hover:bg-emerald-100">
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={handleImages}
                        />
                        <HiPlus className="mb-1 h-7 w-7 transition group-hover:scale-110" />
                        Rasm qo'shish
                      </label>
                      {allPreviewUrls.map((url, index) => (
                        <div
                          key={url}
                          role="button"
                          tabIndex={0}
                          onClick={() => setSelectedImageIndex(index)}
                          onDoubleClick={() => setLightboxImageIndex(index)}
                          onKeyDown={(event) => {
                            if (event.key === 'Enter' || event.key === ' ') {
                              event.preventDefault()
                              setSelectedImageIndex(index)
                            }
                          }}
                          className={`group relative h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-slate-100 text-left ring-offset-2 transition ${
                            selectedImageIndex === index
                              ? 'ring-2 ring-emerald-600'
                              : 'ring-1 ring-slate-200 hover:ring-emerald-300'
                          }`}
                        >
                          <img
                            src={url}
                            alt={`Rasm ${index + 1}`}
                            className="h-full w-full object-cover transition group-hover:scale-105"
                          />
                          <span className="absolute left-2 top-2 rounded-full bg-slate-950/70 px-2 py-0.5 text-[10px] font-black text-white backdrop-blur">
                            {index + 1}
                          </span>
                          <span
                            role="button"
                            tabIndex={0}
                            onClick={(event) => {
                              event.stopPropagation()
                              setLightboxImageIndex(index)
                            }}
                            onKeyDown={(event) => {
                              if (event.key === 'Enter' || event.key === ' ') {
                                event.preventDefault()
                                event.stopPropagation()
                                setLightboxImageIndex(index)
                              }
                            }}
                            className="absolute inset-x-2 bottom-2 rounded-lg bg-slate-950/70 py-1 text-center text-[10px] font-black text-white opacity-0 backdrop-blur transition group-hover:opacity-100"
                          >
                            Katta ko'rish
                          </span>
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation()
                              removeImage(index)
                            }}
                            className="absolute right-1.5 top-1.5 grid h-7 w-7 place-items-center rounded-full bg-slate-900/70 text-white backdrop-blur transition hover:bg-red-600"
                          >
                            <HiTrash className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                    {allPreviewUrls.length > 0 && (
                      <p className="mt-1 text-xs font-semibold text-slate-500">
                        Tanlash uchun bosing, katta ko'rish uchun ikki marta bosing.
                      </p>
                    )}
                  </div>

                  {/* Preview card */}
                  <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                    <div className="mb-3 flex items-center gap-2">
                      <span className="grid h-6 w-6 place-items-center rounded-full bg-emerald-100 text-emerald-700">
                        <HiSparkles className="h-3.5 w-3.5" />
                      </span>
                      <p className="text-sm font-black text-slate-800">Ko'rinish</p>
                    </div>
                    <div className="flex gap-4">
                      <div className="h-24 w-32 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                        {selectedPreviewUrl ? (
                          <button
                            type="button"
                            onClick={() => setLightboxImageIndex(selectedImageIndex)}
                            className="h-full w-full"
                          >
                            <img
                              src={selectedPreviewUrl}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          </button>
                        ) : (
                          <div className="grid h-full place-items-center text-slate-400">
                            <HiCamera className="h-8 w-8" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <h3 className="truncate text-lg font-black text-slate-900">
                          {form.name || 'Xizmat nomi'}
                        </h3>
                        <p className="mt-1 line-clamp-2 text-sm font-semibold text-slate-500">
                          {form.description || "Xizmatingiz tavsifi shu yerda ko'rinadi."}
                        </p>
                        <p className="mt-2 flex items-center gap-2 text-sm font-black text-emerald-700">
                          <HiPhone className="h-4 w-4" />
                          {form.phone || '+998 90 123 45 67'}
                        </p>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {step === 2 && (
              <div className="grid gap-6 xl:grid-cols-[1.35fr_0.7fr]">
                <section>
                  <div className="mb-2">
                    <h2 className="text-2xl font-black text-slate-900 sm:text-3xl">
                      Lokatsiyani belgilang
                    </h2>
                    <p className="mt-1 text-sm font-semibold text-slate-500">
                      Mijozlar sizni oson topishsin
                    </p>
                  </div>
                  <LocationPicker
                    latitude={form.latitude}
                    longitude={form.longitude}
                    onChange={updateLocation}
                  />
                </section>

                <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                  <h3 className="text-lg font-black text-slate-900">Tanlangan joy</h3>
                  <div className="mt-4 flex gap-4">
                    <div className="grid h-24 w-32 shrink-0 place-items-center overflow-hidden rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50">
                      {selectedPreviewUrl ? (
                        <img
                          src={selectedPreviewUrl}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <HiMapPin className="h-8 w-8 text-emerald-700" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-lg font-black text-slate-900">
                        {form.name || 'Xizmat nomi'}
                      </p>
                      <p className="mt-2 flex gap-2 text-sm font-semibold text-slate-500">
                        <HiMapPin className="h-5 w-5 shrink-0 text-slate-400" />
                        <span className="line-clamp-2">{form.address}</span>
                      </p>
                    </div>
                  </div>
                  <div className="mt-6 grid gap-4">
                    <label>
                      <span className="mb-2 block text-sm font-black text-slate-800">
                        Manzil nomi
                      </span>
                      <input
                        value={form.address}
                        onChange={(event) => updateForm('address', event.target.value)}
                        className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                      />
                    </label>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <label>
                        <span className="mb-2 block text-sm font-black text-slate-800">
                          Kenglik
                        </span>
                        <input
                          value={form.latitude}
                          onChange={(event) => updateForm('latitude', event.target.value)}
                          className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
                        />
                      </label>
                      <label>
                        <span className="mb-2 block text-sm font-black text-slate-800">
                          Uzunlik
                        </span>
                        <input
                          value={form.longitude}
                          onChange={(event) => updateForm('longitude', event.target.value)}
                          className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
                        />
                      </label>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {step === 3 && (
              <div className="mx-auto max-w-3xl">
                <div className="mb-6 text-center">
                  <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30">
                    <HiCheck className="h-8 w-8" />
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 sm:text-3xl">
                    Tasdiqlash
                  </h2>
                  <p className="mt-1 text-sm font-semibold text-slate-500">
                    Ma'lumotlarni tekshirib, xizmatni saqlang
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-gradient-to-br from-slate-50 to-emerald-50/40 p-5">
                  <div className="flex flex-col gap-4 sm:flex-row">
                    <div className="h-32 w-full shrink-0 overflow-hidden rounded-xl bg-white shadow-sm sm:h-28 sm:w-36">
                      {selectedPreviewUrl ? (
                        <button
                          type="button"
                          onClick={() => setLightboxImageIndex(selectedImageIndex)}
                          className="h-full w-full"
                        >
                          <img
                            src={selectedPreviewUrl}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        </button>
                      ) : (
                        <div className="grid h-full place-items-center text-slate-400">
                          <HiCamera className="h-8 w-8" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-xl font-black text-slate-900 sm:text-2xl">
                          {form.name}
                        </h3>
                        {selectedCategory && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-black text-emerald-700">
                            <HiSparkles className="h-3 w-3" />
                            {selectedCategory.name}
                          </span>
                        )}
                      </div>
                      <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
                        {form.description}
                      </p>
                      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs font-bold text-slate-500">
                        <span className="inline-flex items-center gap-1">
                          <HiMapPin className="h-4 w-4" />
                          {form.address}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <HiClock className="h-4 w-4" />
                          {form.open_time} - {form.close_time}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <HiPhone className="h-4 w-4" />
                          {form.phone}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={
                  step === 1
                    ? closeAddForm
                    : () => setStep((current) => (current - 1) as WizardStep)
                }
                disabled={isSubmitting}
                className="h-12 rounded-xl border border-slate-200 bg-white px-8 text-sm font-black text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 disabled:opacity-60"
              >
                {step === 1 ? 'Bekor qilish' : 'Orqaga'}
              </button>
              <button
                type="submit"
                disabled={isSubmitting || isCreatingBusiness || isUpdatingBusiness}
                className="inline-flex h-12 items-center justify-center gap-3 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 px-8 text-sm font-black text-white shadow-lg shadow-emerald-900/20 transition hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-70"
              >
                {isSubmitting || isCreatingBusiness || isUpdatingBusiness ? (
                  <>
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Saqlanmoqda...
                  </>
                ) : step === 3 ? (
                  formMode === 'edit' ? (
                    'Yangilash'
                  ) : (
                    "Xizmatni saqlash"
                  )
                ) : (
                  <>
                    Keyingi bosqich <HiArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <>
            {isLoadingBusinesses ? (
              <section className="space-y-5">
                <Skeleton className="h-24 rounded-2xl" />
                <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
                  <Skeleton className="h-44 rounded-none sm:h-52" />
                  <div className="relative flex flex-col gap-4 px-5 pb-5 pt-4 lg:flex-row lg:items-center">
                    <Skeleton className="-mt-16 h-28 w-28 shrink-0 rounded-full border-8 border-white bg-emerald-50" />
                    <div className="min-w-0 flex-1 space-y-3">
                      <Skeleton className="h-8 w-56" />
                      <div className="flex flex-wrap gap-3">
                        <SkeletonText className="w-20" />
                        <SkeletonText className="w-28" />
                        <SkeletonText className="w-36" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {Array.from({ length: 4 }).map((_, index) => (
                        <Skeleton key={index} className="h-16 w-24 rounded-xl" />
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            ) : selectedBusiness ? (
              <section className="space-y-5">
                {/* Business selector */}
                <article className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-black text-slate-900">
                        Mening xizmatlarim
                      </h2>
                      <p className="text-xs font-semibold text-slate-500">
                        {businesses.length} ta xizmat qo'shilgan
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={openAddForm}
                      className="inline-flex h-10 items-center gap-2 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 px-4 text-sm font-black text-white shadow-sm shadow-emerald-900/20 transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <HiPlus className="h-4 w-4" />
                      Yangi xizmat
                    </button>
                  </div>
                  <div className="flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {businesses.map((business) => {
                      const isActive = selectedBusiness.id === business.id
                      return (
                        <button
                          key={business.id}
                          type="button"
                          onClick={() => setSelectedBusinessId(business.id)}
                          className={`group flex min-w-[240px] items-center gap-3 rounded-xl border p-3 text-left transition ${
                            isActive
                              ? 'border-emerald-500 bg-gradient-to-br from-emerald-50 to-teal-50 shadow-sm'
                              : 'border-slate-100 bg-slate-50 hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-white hover:shadow-sm'
                          }`}
                        >
                          <span className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-xl bg-white text-emerald-700 shadow-sm">
                            {business.logo_url ? (
                              <img
                                src={business.logo_url}
                                alt=""
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <HiSparkles className="h-6 w-6" />
                            )}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-black text-slate-900">
                              {business.name}
                            </span>
                            <span className="mt-0.5 block truncate text-xs font-bold text-slate-500">
                              {business.category?.name || 'Kategoriya'}
                            </span>
                          </span>
                          {isActive && (
                            <HiCheck className="h-5 w-5 shrink-0 rounded-full bg-emerald-600 p-1 text-white" />
                          )}
                        </button>
                      )
                    })}
                  </div>
                </article>

                {/* Hero */}
                <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
                  <div className="relative h-44 sm:h-56">
                    <div
                      className="absolute inset-0 bg-emerald-700"
                      style={{
                        backgroundImage: `linear-gradient(90deg, rgba(1,102,69,0.1), rgba(1,102,69,0.94)), url(${
                          selectedBusiness.images[0] || selectedBusiness.logo_url || bgImage
                        })`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                    />
                    <div className="absolute right-4 top-4 flex flex-wrap gap-2">
                      {selectedBusiness.is_verified ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-black text-emerald-700 shadow-sm backdrop-blur">
                          <HiCheck className="h-4 w-4 rounded-full bg-emerald-600 p-0.5 text-white" />
                          Tasdiqlangan
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100/95 px-3 py-1.5 text-xs font-black text-amber-700 shadow-sm backdrop-blur">
                          <HiClock className="h-4 w-4" />
                          Tekshiruvda
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="relative flex flex-col gap-4 px-5 pb-5 pt-4 lg:flex-row lg:items-center">
                    <div className="-mt-16 grid h-28 w-28 shrink-0 place-items-center overflow-hidden rounded-full border-8 border-white bg-gradient-to-br from-emerald-50 to-teal-50 shadow-md">
                      {selectedBusiness.logo_url ? (
                        <img
                          src={selectedBusiness.logo_url}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <HiSparkles className="h-12 w-12 text-emerald-700" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h2 className="text-2xl font-black text-slate-900">
                        {selectedBusiness.name}
                      </h2>
                      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-semibold text-slate-500">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-amber-700">
                          <HiStar className="h-4 w-4" />
                          <span className="font-black">
                            {selectedBusinessRatingAverage.toFixed(1)}
                          </span>
                          <span className="text-xs">
                            ({selectedBusinessRatingCount})
                          </span>
                        </span>
                        {selectedBusiness.category?.name && (
                          <span className="inline-flex items-center gap-1.5">
                            <HiSparkles className="h-4 w-4 text-slate-400" />
                            {selectedBusiness.category.name}
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1.5">
                          <HiMapPin className="h-4 w-4 text-slate-400" />
                          <span className="line-clamp-1">
                            {selectedBusiness.address}
                          </span>
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
                      {[
                        {
                          label: 'Tahrirlash',
                          icon: HiPencil,
                          onClick: () => openEditForm(selectedBusiness),
                          tone: 'emerald' as const,
                        },
                        {
                          label: "O'chirish",
                          icon: HiTrash,
                          onClick: () => setDeleteTarget(selectedBusiness),
                          tone: 'red' as const,
                        },
                        { label: 'QR kod', icon: HiQrCode, tone: 'slate' as const },
                        { label: 'Ulashish', icon: HiShare, tone: 'slate' as const },
                      ].map((item) => {
                        const Icon = item.icon
                        const toneClasses =
                          item.tone === 'red'
                            ? 'bg-red-50 text-red-600 hover:bg-red-100'
                            : item.tone === 'emerald'
                              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                              : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                        return (
                          <button
                            key={item.label}
                            type="button"
                            onClick={item.onClick}
                            className={`group flex min-h-[68px] flex-col items-center justify-center gap-1 rounded-xl px-3 text-xs font-black transition hover:-translate-y-0.5 ${toneClasses}`}
                          >
                            <Icon className="h-5 w-5 transition group-hover:scale-110" />
                            {item.label}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>

                {/* Content grid */}
                <div className="grid gap-5 xl:grid-cols-[1.25fr_0.8fr]">
                  <div className="space-y-5">
                    {/* Gallery */}
                    <article className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
                      <div className="mb-4 flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-black text-slate-900">
                            Rasmlar galereyasi
                          </h3>
                          <p className="text-xs font-semibold text-slate-500">
                            Xizmatingizni yorqin ko'rsating
                          </p>
                        </div>
                        <button
                          onClick={openAddForm}
                          className="text-sm font-black text-emerald-700 transition hover:text-emerald-800"
                        >
                          Yangi xizmat
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                        {(
                          selectedBusiness.images.length
                            ? selectedBusiness.images
                            : [selectedBusiness.logo_url].filter(Boolean)
                        ).map((image, index) => (
                          <div
                            key={`${image}-${index}`}
                            className="group relative aspect-[1.35] overflow-hidden rounded-xl bg-slate-100"
                          >
                            <img
                              src={image as string}
                              alt=""
                              className="h-full w-full object-cover transition group-hover:scale-105"
                            />
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => openEditForm(selectedBusiness)}
                          className="group flex aspect-[1.35] flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-slate-300 text-xs font-black text-slate-500 transition hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700"
                        >
                          <HiPlus className="h-6 w-6 transition group-hover:scale-110" />
                          Rasm qo'shish
                        </button>
                      </div>
                    </article>

                    <div className="grid gap-5 md:grid-cols-2">
                      <article className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
                        <div className="mb-4 flex items-center gap-2">
                          <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
                            <HiClock className="h-5 w-5" />
                          </span>
                          <h3 className="text-lg font-black text-slate-900">
                            Ish vaqti
                          </h3>
                        </div>
                        <div className="flex items-center justify-between text-sm font-bold">
                          <span className="text-slate-700">
                            {selectedBusiness.working_days || 'Har kuni'}
                          </span>
                          <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">
                            {formatTime(selectedBusiness.open_time)} -{' '}
                            {formatTime(selectedBusiness.close_time)}
                          </span>
                        </div>
                      </article>
                      <article className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
                        <div className="mb-4 flex items-center gap-2">
                          <span className="grid h-9 w-9 place-items-center rounded-xl bg-blue-50 text-blue-700">
                            <HiMapPin className="h-5 w-5" />
                          </span>
                          <h3 className="text-lg font-black text-slate-900">Manzil</h3>
                        </div>
                        <p className="text-sm font-semibold leading-6 text-slate-600">
                          {selectedBusiness.address}
                        </p>
                      </article>
                    </div>

                    <article className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
                      <div className="mb-3 flex items-center gap-2">
                        <span className="grid h-9 w-9 place-items-center rounded-xl bg-purple-50 text-purple-700">
                          <HiSparkles className="h-5 w-5" />
                        </span>
                        <h3 className="text-lg font-black text-slate-900">
                          Xizmat tavsifi
                        </h3>
                      </div>
                      <p className="text-sm font-semibold leading-7 text-slate-600">
                        {selectedBusiness.description}
                      </p>
                    </article>
                  </div>

                  {/* Sidebar */}
                  <div className="space-y-5">
                    <article className="overflow-hidden rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 p-5 shadow-sm ring-1 ring-amber-100">
                      <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-lg font-black text-slate-900">
                          Reyting
                        </h3>
                        <span className="rounded-full bg-white/70 px-2.5 py-1 text-xs font-black text-amber-700 backdrop-blur">
                          {selectedBusinessRatingCount} sharh
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="grid h-20 w-20 place-items-center rounded-2xl bg-white shadow-sm">
                          <HiStar className="h-10 w-10 text-amber-400" />
                        </div>
                        <div>
                          <p className="text-5xl font-black text-slate-900">
                            {selectedBusinessRatingAverage.toFixed(1)}
                          </p>
                          <p className="mt-1 text-xs font-bold uppercase tracking-wide text-slate-500">
                            O'rtacha baho
                          </p>
                        </div>
                      </div>
                    </article>

                    <article className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
                      <h3 className="mb-4 text-lg font-black text-slate-900">
                        Ko'rsatkichlar
                      </h3>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          {
                            icon: HiUserGroup,
                            value: selectedBusinessRatingCount,
                            label: 'Sharh',
                            tone: 'emerald',
                          },
                          {
                            icon: HiStar,
                            value: selectedBusinessRatingAverage.toFixed(1),
                            label: 'Reyting',
                            tone: 'amber',
                          },
                          {
                            icon: HiCheck,
                            value: selectedBusiness.is_verified ? 'Ha' : "Yo'q",
                            label: 'Tasdiq',
                            tone: 'blue',
                          },
                        ].map((item, index) => {
                          const Icon = item.icon
                          const toneClasses =
                            item.tone === 'emerald'
                              ? 'bg-emerald-50 text-emerald-700'
                              : item.tone === 'amber'
                                ? 'bg-amber-50 text-amber-600'
                                : 'bg-blue-50 text-blue-700'
                          return (
                            <div
                              key={index}
                              className="rounded-xl bg-slate-50 p-3 text-center transition hover:-translate-y-0.5 hover:bg-white hover:shadow-sm"
                            >
                              <span
                                className={`mx-auto grid h-9 w-9 place-items-center rounded-xl ${toneClasses}`}
                              >
                                <Icon className="h-5 w-5" />
                              </span>
                              <p className="mt-2 text-lg font-black text-slate-900">
                                {item.value}
                              </p>
                              <p className="text-xs font-bold text-slate-500">
                                {item.label}
                              </p>
                            </div>
                          )
                        })}
                      </div>
                    </article>
                  </div>
                </div>
              </section>
            ) : (
              /* Empty state */
              <div className="grid min-h-[520px] place-items-center rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-100">
                <div className="max-w-md">
                  <div className="mx-auto mb-6 grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br from-emerald-50 to-teal-50">
                    <div className="grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30">
                      <HiPlus className="h-8 w-8" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-black text-slate-900">
                    Hali xizmat qo'shilmagan
                  </h2>
                  <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">
                    Birinchi xizmatingizni qo'shing, mijozlar sizni katalog va
                    xarita orqali topa olishadi.
                  </p>
                  <button
                    onClick={openAddForm}
                    className="mt-6 inline-flex h-12 items-center gap-2 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 px-7 text-sm font-black text-white shadow-lg shadow-emerald-900/20 transition hover:-translate-y-0.5 hover:shadow-xl"
                  >
                    <HiPlus className="h-5 w-5" />
                    Xizmat qo'shish
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Delete modal */}
        {deleteTarget && (
          <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 px-4 py-6 backdrop-blur-sm">
            <div className="w-full max-w-md scale-100 rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-slate-100">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-red-50 text-red-600">
                <HiTrash className="h-8 w-8" />
              </div>
              <h3 className="mt-4 text-center text-xl font-black text-slate-900">
                Xizmatni o'chirishni tasdiqlang
              </h3>
              <p className="mt-2 text-center text-sm font-semibold leading-6 text-slate-500">
                <span className="font-black text-slate-700">
                  “{deleteTarget.name}”
                </span>{' '}
                o'chiriladi. Bu amalni ortga qaytarib bo'lmaydi.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setDeleteTarget(null)}
                  disabled={isDeletingBusiness}
                  className="h-11 rounded-xl border border-slate-200 bg-white text-sm font-black text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
                >
                  Bekor qilish
                </button>
                <button
                  type="button"
                  onClick={() => void confirmDeleteBusiness()}
                  disabled={isDeletingBusiness}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-red-500 to-red-600 text-sm font-black text-white shadow-sm shadow-red-900/20 transition hover:-translate-y-0.5 hover:shadow-md disabled:opacity-60"
                >
                  {isDeletingBusiness && (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  )}
                  O'chirish
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Lightbox */}
        {lightboxImageIndex !== null && allPreviewUrls[lightboxImageIndex] && (
          <div
            className="fixed inset-0 z-50 grid place-items-center bg-slate-950/80 px-4 py-6 backdrop-blur-sm"
            onClick={() => setLightboxImageIndex(null)}
          >
            <div
              className="relative w-full max-w-5xl"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setLightboxImageIndex(null)}
                className="absolute -top-12 right-0 grid h-10 w-10 place-items-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white/25"
                aria-label="Rasmni yopish"
              >
                <HiXMark className="h-6 w-6" />
              </button>

              <div className="overflow-hidden rounded-2xl bg-white p-2 shadow-2xl">
                <img
                  src={allPreviewUrls[lightboxImageIndex]}
                  alt={`Katta rasm ${lightboxImageIndex + 1}`}
                  className="max-h-[76vh] w-full rounded-xl object-contain"
                />
              </div>

              {allPreviewUrls.length > 1 && (
                <div className="mt-4 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setLightboxImageIndex((current) =>
                        current === null
                          ? 0
                          : (current - 1 + allPreviewUrls.length) %
                            allPreviewUrls.length,
                      )
                    }
                    className="h-11 rounded-xl bg-white px-5 text-sm font-black text-slate-900 shadow-sm transition hover:-translate-y-0.5"
                  >
                    Oldingi
                  </button>
                  <p className="rounded-full bg-white/15 px-4 py-2 text-sm font-black text-white backdrop-blur">
                    {lightboxImageIndex + 1} / {allPreviewUrls.length}
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      setLightboxImageIndex((current) =>
                        current === null
                          ? 0
                          : (current + 1) % allPreviewUrls.length,
                      )
                    }
                    className="h-11 rounded-xl bg-white px-5 text-sm font-black text-slate-900 shadow-sm transition hover:-translate-y-0.5"
                  >
                    Keyingi
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default ProviderBusinesses
