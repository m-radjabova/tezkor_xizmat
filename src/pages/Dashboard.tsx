import LogoutIcon from '@mui/icons-material/Logout'
import StorefrontIcon from '@mui/icons-material/Storefront'
import { useNavigate } from 'react-router-dom'
import useContextPro from '../hooks/useContextPro'

function Dashboard() {
  const { user, logout } = useContextPro()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-6 text-slate-950">
      <section className="mx-auto flex max-w-5xl items-center justify-between rounded-[8px] border border-slate-200 bg-white px-6 py-5 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="grid h-12 w-12 place-items-center rounded-[8px] bg-emerald-700 text-white">
            <StorefrontIcon />
          </div>
          <div>
            <h1 className="text-xl font-extrabold">YaqinXizmat dashboard</h1>
            <p className="text-sm font-semibold text-slate-500">
              {user?.full_name} · {user?.role}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="flex h-11 items-center gap-2 rounded-[8px] border border-slate-200 px-4 text-sm font-extrabold text-slate-700 hover:border-emerald-700 hover:text-emerald-700"
        >
          <LogoutIcon fontSize="small" />
          Chiqish
        </button>
      </section>
    </main>
  )
}

export default Dashboard
