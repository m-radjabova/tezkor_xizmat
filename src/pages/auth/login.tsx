import AuthCard from './AuthCard'
import AuthVisual from './AuthVisual'

function Login() {
  return (
    <div className="flex min-h-screen w-full">
      <AuthVisual />
      <AuthCard screen="login" />
    </div>
  )
}

export default Login
