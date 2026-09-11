import { Star } from 'lucide-react'

export default function Stars({ count = 5, size = 13 }) {
  const safeCount = Math.floor(count || 5)

  return (
    <span className="inline-flex items-center gap-0.5 text-amber-500">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star 
          key={i} 
          size={size} 
          fill={i < safeCount ? 'currentColor' : 'none'} 
          strokeWidth={1.5} 
        />
      ))}
    </span>
  )
}
