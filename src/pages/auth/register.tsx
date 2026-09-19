import AuthCard from './AuthCard'
import AuthVisual from './AuthVisual'

function Register() {
  return (
    <div className="flex min-h-screen w-full">
      <AuthVisual />
      <AuthCard screen="register" />
    </div>
  )
}

export default Register
