import { useEffect, useRef, useState } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar'
import LocationOnIcon from '@mui/icons-material/LocationOn'

interface InteractiveRouteMapProps {
  endCoords: { lat: number; lng: number }
}

type RouteStatus = 'requesting_location' | 'fetching_route' | 'success' | 'error'

function formatDistance(meters: number) {
  return meters >= 1000 ? `${(meters / 1000).toFixed(1)} km` : `${Math.round(meters)} m`
}

function formatDuration(seconds: number) {
  if (seconds >= 3600) return `${Math.floor(seconds / 3600)} soat ${Math.round((seconds % 3600) / 60)} daqiqa`
  return `${Math.max(1, Math.round(seconds / 60))} daqiqa`
}

export default function InteractiveRouteMap({ endCoords }: InteractiveRouteMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<maplibregl.Map | null>(null)
  const [status, setStatus] = useState<RouteStatus>(() => 'geolocation' in navigator ? 'requesting_location' : 'error')
  const [errorMessage, setErrorMessage] = useState(() => 'geolocation' in navigator ? '' : "Brauzeringiz joylashuvni aniqlashni qo'llab-quvvatlamaydi.")
  const [routeSummary, setRouteSummary] = useState<{ distance: string; duration: string } | null>(null)

  useEffect(() => {
    if (!mapContainer.current) return
    let disposed = false

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json',
      center: [endCoords.lng, endCoords.lat],
      zoom: 13,
      attributionControl: false,
    })
    map.current.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right')
    new maplibregl.Marker({ color: '#059669' }).setLngLat([endCoords.lng, endCoords.lat]).addTo(map.current)

    const fetchRoute = async (start: { lat: number; lng: number }) => {
      setStatus('fetching_route')
      try {
        const response = await fetch(`https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${endCoords.lng},${endCoords.lat}?overview=full&geometries=geojson`)
        if (!response.ok) throw new Error('Route service unavailable')
        const data = await response.json()
        if (disposed || data.code !== 'Ok' || !data.routes?.length) throw new Error('Marshrut topilmadi')

        const route = data.routes[0]
        setRouteSummary({ distance: formatDistance(route.distance), duration: formatDuration(route.duration) })

        const addRoute = () => {
          if (disposed || !map.current || map.current.getSource('route')) return
          map.current.addSource('route', { type: 'geojson', data: { type: 'Feature', properties: {}, geometry: route.geometry } })
          map.current.addLayer({ id: 'route-line-shadow', type: 'line', source: 'route', layout: { 'line-join': 'round', 'line-cap': 'round' }, paint: { 'line-color': '#064e3b', 'line-width': 10, 'line-opacity': 0.2 } })
          map.current.addLayer({ id: 'route-line', type: 'line', source: 'route', layout: { 'line-join': 'round', 'line-cap': 'round' }, paint: { 'line-color': '#059669', 'line-width': 5 } })
          const bounds = route.geometry.coordinates.reduce((currentBounds: maplibregl.LngLatBounds, coordinate: [number, number]) => currentBounds.extend(coordinate), new maplibregl.LngLatBounds(route.geometry.coordinates[0], route.geometry.coordinates[0]))
          map.current.fitBounds(bounds, { padding: { top: 100, bottom: 150, left: 50, right: 50 }, duration: 1000 })
        }

        if (map.current?.isStyleLoaded()) addRoute()
        else map.current?.once('load', addRoute)
        setStatus('success')
      } catch (error) {
        if (disposed) return
        console.error('Route fetch error:', error)
        setStatus('error')
        setErrorMessage("Marshrutni chizib bo'lmadi. Internet aloqasini tekshirib, qayta urinib ko'ring.")
      }
    }

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (disposed || !map.current) return
          const startCoords = { lat: position.coords.latitude, lng: position.coords.longitude }
          new maplibregl.Marker({ color: '#2563eb' }).setLngLat([startCoords.lng, startCoords.lat]).addTo(map.current)
          void fetchRoute(startCoords)
        },
        (error) => {
          if (disposed) return
          setStatus('error')
          setErrorMessage(error.code === error.PERMISSION_DENIED ? 'Marshrutni chizish uchun joylashuvga ruxsat bering.' : "Joylashuvingizni aniqlab bo'lmadi.")
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 },
      )
    }

    return () => {
      disposed = true
      map.current?.remove()
      map.current = null
    }
  }, [endCoords.lat, endCoords.lng])

  return (
    <div className="relative h-full min-h-[400px] w-full overflow-hidden bg-slate-50">
      <div ref={mapContainer} className="absolute inset-0 h-full w-full" />
      <div className="pointer-events-none absolute inset-x-4 top-4 z-10 flex items-start justify-between gap-3">
        <div className="rounded-2xl bg-white/95 px-4 py-3 shadow-lg backdrop-blur-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-emerald-700">Sizdan xizmatgacha</p>
          <p className="mt-1 text-sm font-extrabold text-slate-950">Ichki marshrut</p>
        </div>
        {routeSummary && status === 'success' && (
          <div className="flex gap-3 rounded-2xl bg-white/95 px-4 py-3 text-sm shadow-lg backdrop-blur-sm">
            <span className="flex items-center gap-1.5 font-bold text-slate-800"><DirectionsCarIcon sx={{ fontSize: 18 }} />{routeSummary.distance}</span>
            <span className="flex items-center gap-1.5 font-semibold text-slate-500"><AccessTimeIcon sx={{ fontSize: 17 }} />{routeSummary.duration}</span>
          </div>
        )}
      </div>
      {status !== 'success' && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/85 px-6 text-center backdrop-blur-sm">
          {(status === 'requesting_location' || status === 'fetching_route') && (
            <>
              <div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-emerald-50 text-emerald-700"><LocationOnIcon /></div>
              <div className="h-9 w-9 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-600" />
              <p className="mt-4 font-semibold text-slate-800">{status === 'requesting_location' ? 'Joylashuvingiz aniqlanmoqda...' : 'Marshrut chizilmoqda...'}</p>
            </>
          )}
          {status === 'error' && (
            <div className="max-w-sm">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-amber-50 text-amber-600"><LocationOnIcon /></div>
              <p className="mt-3 text-lg font-extrabold text-slate-950">Marshrut tayyorlanmadi</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">{errorMessage}</p>
              <button type="button" onClick={() => window.location.reload()} className="mt-4 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-800">Qayta urinib ko'rish</button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}