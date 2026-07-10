import { Outlet } from 'react-router-dom'

function AuthLayout() {
  return (
    <main className="relative flex min-h-screen w-full overflow-hidden">
      <Outlet />
    </main>
  )
}

export default AuthLayout