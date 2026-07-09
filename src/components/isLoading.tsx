import LottieModule from 'lottie-react'
import { useEffect, useRef, type ComponentType } from 'react'
import contractAnimation from '../assets/Contract.json'

type LottieProps = {
  animationData: object
  loop?: boolean
  autoplay?: boolean
  className?: string
  lottieRef?: {
    current: {
      setSpeed: (speed: number) => void
    } | null
  }
}

const Lottie = ((LottieModule as { default?: unknown }).default ??
  LottieModule) as ComponentType<LottieProps>

function IsLoading() {
  const lottieRef = useRef<{ setSpeed: (speed: number) => void } | null>(null)

  useEffect(() => {
    lottieRef.current?.setSpeed(0.65)
  }, [])

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden  px-4">
      <div className="pointer-events-none absolute inset-0 " />

      <div className="relative w-full max-w-xl overflow-hidden ">
        <div className="relative flex flex-col items-center text-center">
          <div className="relative flex h-72 w-72 items-center justify-center md:h-80 md:w-80">
            <div className="absolute inset-3 rounded-full " />
            <Lottie
              lottieRef={lottieRef}
              animationData={contractAnimation}
              loop
              autoplay
              className="relative h-full w-full scale-110"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default IsLoading
