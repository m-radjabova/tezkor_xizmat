interface SkeletonProps {
  className?: string
}

function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <span
      className={`relative block overflow-hidden rounded-xl bg-slate-100/80 backdrop-blur-sm shadow-inner ${className}`}
    >
      <span className="absolute inset-0 -translate-x-full animate-[skeletonShimmer_1.5s_infinite_ease-in-out] bg-gradient-to-r from-transparent via-white/80 to-transparent" />
      
      {/* Custom keyframes */}
      <style>{`
        @keyframes skeletonShimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </span>
  )
}

export function SkeletonText({ className = '' }: SkeletonProps) {
  return <Skeleton className={`h-3.5 rounded-full ${className}`} />
}

export default Skeleton
