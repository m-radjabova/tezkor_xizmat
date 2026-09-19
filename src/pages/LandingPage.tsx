import { useEffect, useMemo, useState } from 'react'
import Bussiness from '../components/landing_page/Bussiness'
import Categories from '../components/landing_page/Categories'
import Footer from '../components/landing_page/Footer'
import Header from '../components/landing_page/Header'
import Hero from '../components/landing_page/Hero'
import HowItWorks from '../components/landing_page/HowItWorks'
import Testimonials from '../components/landing_page/Testimonials'
import Seo from '../components/Seo'
import { useBusinesses } from '../hooks/useBusinesses'
import { useCategories } from '../hooks/useCategories'
import { useDebounce } from '../hooks/useDebounce'

type LocationPoint = {
  latitude: number
  longitude: number
}

function LandingPage() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('')
  const [search, setSearch] = useState('')
  const [userLocation, setUserLocation] = useState<LocationPoint | null>(null)
  const debouncedSearch = useDebounce(search, 350)
  const { categories, isLoadingCategories } = useCategories()
  const {
    businesses,
    isLoadingBusinesses,
    isLoadingMoreBusinesses,
    hasMoreBusinesses,
    loadMoreBusinesses,
    refetchBusinesses,
  } = useBusinesses({
    categoryId: selectedCategoryId,
    search: debouncedSearch,
    limit: 8,
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
      <Header />
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
      <Bussiness
        businesses={businesses}
        isLoading={isLoadingBusinesses}
        isLoadingMore={isLoadingMoreBusinesses}
        hasMore={hasMoreBusinesses}
        onLoadMore={() => void loadMoreBusinesses()}
        title="Sizga eng yaqin xizmatlar"
        subtitle="Tanlangan kategoriya bo‘yicha joylashuvingizga eng yaqin xizmatlar"
        badge="Yaqin atrofda"
      />
      {/* <AppPromo /> */}
      <HowItWorks />
      <Testimonials />
      <Footer />
    </main>
  )
}

export default LandingPage
