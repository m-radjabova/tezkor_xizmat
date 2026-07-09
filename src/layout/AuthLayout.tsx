import { Outlet } from 'react-router-dom'

function AuthLayout() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(79,124,255,0.2),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(34,197,94,0.12),_transparent_24%)]" />
      <div className="absolute left-[-120px] top-16 h-72 w-72 rounded-full bg-[var(--color-primary)]/10 blur-3xl" />
      <div className="absolute bottom-[-120px] right-0 h-72 w-72 rounded-full bg-[var(--color-success)]/10 blur-3xl" />
      <section className="relative w-full max-w-6xl" aria-label="Authentication">
        <Outlet />
      </section>
    </main>
  )
}

export default AuthLayout
