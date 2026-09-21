import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Bussiness from '../components/landing_page/Bussiness'
import Categories from '../components/landing_page/Categories'
import Hero from '../components/landing_page/Hero'
import HowItWorks from '../components/landing_page/HowItWorks'
import Testimonials from '../components/landing_page/Testimonials'
import Seo from '../components/Seo'
import { useBusinesses } from '../hooks/useBusinesses'
import { useCategories } from '../hooks/useCategories'
import { useDebounce } from '../hooks/useDebounce'

const LANDING_BUSINESS_LIMIT = 8

type LocationPoint = {
  latitude: number
  longitude: number
}

function LandingPage() {
  const navigate = useNavigate()
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('')
  const [search, setSearch] = useState('')
  const [userLocation, setUserLocation] = useState<LocationPoint | null>(null)
  const debouncedSearch = useDebounce(search)
  const { categories, isLoadingCategories } = useCategories()
  const { businesses, isLoadingBusinesses, refetchBusinesses } = useBusinesses({
    categoryId: selectedCategoryId,
    search: debouncedSearch,
    limit: LANDING_BUSINESS_LIMIT,
    latitude: userLocation?.latitude,
    longitude: userLocation?.longitude,
    sortBy: userLocation ? 'distance' : 'newest',
  })

  const popularTags = useMemo(() => categories.slice(0, 5).map((category) => category.name), [categories])

  useEffect(() => {
    if (!selectedCategoryId && categories[0]) {
      queueMicrotask(() => setSelectedCategoryId(categories[0].id))
    }
  }, [categories, selectedCategoryId])

  useEffect(() => {
    if (!navigator.geolocation) return

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
      },
      () => undefined,
      { enableHighAccuracy: true, timeout: 7000, maximumAge: 5 * 60 * 1000 },
    )
  }, [])

  return (
    <main className="min-h-screen bg-white text-slate-950">
      <Seo
        title="Yaqin xizmatlarni toping"
        description="O‘zingizga yaqin ishonchli xizmat ko‘rsatuvchilarni toping va ular bilan tez bog‘laning."
        canonicalPath="/"
      />
      <Hero
        search={search}
        onSearchChange={setSearch}
        categories={categories}
        popularTags={popularTags}
        selectedCategoryId={selectedCategoryId}
        onCategoryChange={setSelectedCategoryId}
        onSubmit={() => void refetchBusinesses()}
      />
      <Categories
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        isLoading={isLoadingCategories}
        onSelect={setSelectedCategoryId}
      />
      {/* Faqat 6 ta xizmat ko'rsatiladi, "Boshqalarini ko'rish" tugmasi /businesses sahifasiga olib boradi */}
      <Bussiness
        businesses={businesses}
        isLoading={isLoadingBusinesses}
        hasMore={false}
        onViewAll={() => navigate('/businesses')}
        title="Sizga eng yaqin xizmatlar"
        subtitle="Tanlangan kategoriya bo‘yicha joylashuvingizga eng yaqin xizmatlar"
        badge="Yaqin atrofda"
      />
      {/* <AppPromo /> */}
      <HowItWorks />
      <Testimonials />
    </main>
  )
}

export default LandingPage
