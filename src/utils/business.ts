export function formatBusinessTime(value: string | null) {
  if (!value) return null
  return value.slice(0, 5)
}

function getTashkentCurrentMinutes() {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Tashkent',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(new Date())

  const hour = Number(parts.find((part) => part.type === 'hour')?.value ?? 0)
  const minute = Number(parts.find((part) => part.type === 'minute')?.value ?? 0)

  return hour * 60 + minute
}

export function getBusinessStatus(openTime: string | null, closeTime: string | null) {
  const formattedOpenTime = formatBusinessTime(openTime)
  const formattedCloseTime = formatBusinessTime(closeTime)

  if (!formattedOpenTime || !formattedCloseTime) {
    return {
      label: 'Ish vaqti kiritilmagan',
      tone: 'text-slate-500',
      badge: 'bg-slate-100 text-slate-600',
      timeLabel: null,
    }
  }

  const [openHours, openMinutes] = formattedOpenTime.split(':').map(Number)
  const [closeHours, closeMinutes] = formattedCloseTime.split(':').map(Number)
  const openTotal = openHours * 60 + openMinutes
  const closeTotal = closeHours * 60 + closeMinutes

  if (openTotal === closeTotal) {
    return {
      label: 'Hozir ochiq',
      tone: 'text-emerald-700',
      badge: 'bg-emerald-50 text-emerald-700',
      timeLabel: '24 soat',
    }
  }

  const currentMinutes = getTashkentCurrentMinutes()
  const isOvernight = closeTotal < openTotal
  const isOpen = isOvernight
    ? currentMinutes >= openTotal || currentMinutes <= closeTotal
    : currentMinutes >= openTotal && currentMinutes <= closeTotal

  return {
    label: isOpen ? 'Hozir ochiq' : 'Hozir yopiq',
    tone: isOpen ? 'text-emerald-700' : 'text-rose-500',
    badge: isOpen ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-600',
    timeLabel: `${formattedOpenTime} - ${formattedCloseTime}`,
  }
}

export function getReviewStats(reviews: { rating: number }[]) {
  const ratingCount = reviews.length
  const ratingAverage = ratingCount > 0 ? reviews.reduce((total, review) => total + review.rating, 0) / ratingCount : null
  const distribution = [5, 4, 3, 2, 1].map((rating) => {
    const count = reviews.filter((review) => review.rating === rating).length
    return {
      rating,
      count,
      percent: ratingCount > 0 ? Math.round((count / ratingCount) * 100) : 0,
    }
  })

  return {
    ratingAverage,
    ratingCount,
    distribution,
  }
}
