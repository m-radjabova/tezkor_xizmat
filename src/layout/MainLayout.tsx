import { Outlet } from 'react-router-dom'
import Footer from '../components/landing_page/Footer'
import Header from '../components/landing_page/Header'

export default function MainLayout() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-white text-slate-950">
      <Header />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}
