import { useEffect, useRef, useState, type ReactNode } from 'react'
import { prefersReducedMotion } from '../../lib/motion'

type MagnetProps = {
  children: ReactNode
  padding?: number
  strength?: number
  activeTransition?: string
  inactiveTransition?: string
  className?: string
}

export function Magnet({
  children,
  padding = 120,
  strength = 3,
  activeTransition = 'transform 0.3s ease-out',
  inactiveTransition = 'transform 0.6s ease-in-out',
  className,
}: MagnetProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [active, setActive] = useState(false)

  useEffect(() => {
    if (prefersReducedMotion()) return

    const handleMove = (e: MouseEvent) => {
      const el = ref.current
      if (!el) return

      const rect = el.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const distX = Math.abs(centerX - e.clientX)
      const distY = Math.abs(centerY - e.clientY)

      const withinReach =
        distX < rect.width / 2 + padding && distY < rect.height / 2 + padding

      if (withinReach) {
        setActive(true)
        setOffset({
          x: (e.clientX - centerX) / strength,
          y: (e.clientY - centerY) / strength,
        })
      } else {
        setActive(false)
        setOffset({ x: 0, y: 0 })
      }
    }

    window.addEventListener('mousemove', handleMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMove)
  }, [padding, strength])

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
        transition: active ? activeTransition : inactiveTransition,
        willChange: 'transform',
      }}
    >
      {children}
    </div>
  )
}
