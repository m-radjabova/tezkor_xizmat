import { useLottie } from 'lottie-react'
import loadingAnimation from '../assets/Loading 40 _ Paperplane.json'
import { motion } from 'framer-motion'

function IsLoading() {
  const { View } = useLottie(
    {
      animationData: loadingAnimation,
      loop: true,
      autoplay: true,
    },
    {
      height: '100%',
      width: '100%',
    },
  )

  return (
    <div className="relative grid min-h-screen place-items-center bg-slate-50 overflow-hidden px-5">
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-emerald-200/40 blur-[100px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-teal-200/40 blur-[100px]" 
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative flex flex-col items-center justify-center p-8 rounded-3xl"
      >
        <div className="h-64 w-64 sm:h-80 sm:w-80 drop-shadow-xl">{View}</div>
        
        {/* Loading Text */}
        <div className="mt-4 flex items-center gap-2">
          <span className="text-sm font-extrabold tracking-widest text-emerald-700 uppercase">Yuklanmoqda</span>
          <span className="flex gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '300ms' }} />
          </span>
        </div>
      </motion.div>
    </div>
  )
}

export default IsLoading
