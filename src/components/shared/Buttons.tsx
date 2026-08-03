import type { ReactNode } from 'react'
import { Magnet } from './Magnet'

type ButtonProps = {
  children: ReactNode
  href?: string
  className?: string
}

/**
 * Primary call to action. The reference template used a magenta/orange gradient;
 * here the fill is the brand cream so the button reads as the one warm, solid
 * object on a field of navy.
 */
export function ContactButton({ children, href = '#invitation', className = '' }: ButtonProps) {
  return (
    <Magnet padding={90} strength={4}>
      <a
        href={href}
        className={`group relative inline-block overflow-hidden rounded-full bg-cream px-8 py-3 text-xs font-medium uppercase tracking-[0.2em] text-navy transition-shadow duration-300 hover:shadow-[0_0_40px_-6px_rgba(246,240,233,0.45)] sm:px-10 sm:py-3.5 sm:text-sm md:px-12 md:py-4 md:text-base ${className}`}
      >
        <span className="relative z-10">{children}</span>
        <span className="absolute inset-0 -translate-x-full bg-slate-pale transition-transform duration-500 ease-out group-hover:translate-x-0" />
      </a>
    </Magnet>
  )
}

/** Outline pill used inside case cards. */
export function GhostButton({ children, href, className = '' }: ButtonProps) {
  const classes = `inline-block rounded-full border border-cream/40 px-6 py-2.5 text-xs font-medium uppercase tracking-[0.2em] text-cream transition-colors duration-300 hover:border-cream hover:bg-cream/10 sm:px-8 sm:py-3 sm:text-sm ${className}`

  if (!href) return <span className={classes}>{children}</span>

  return (
    <a href={href} target="_blank" rel="noreferrer" className={classes}>
      {children}
    </a>
  )
}
