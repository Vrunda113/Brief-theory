import type { ReactNode } from 'react'
import { Magnet } from './Magnet'

type ButtonProps = {
  children: ReactNode
  href?: string
  className?: string
  /** The ground the button sits on, not the button's own colour. */
  on?: 'navy' | 'cream'
}

/**
 * Primary call to action. The reference template used a magenta/orange gradient;
 * here the button is simply the inverse of whatever it sits on, so it is always
 * the one solid object on the field.
 */
export function ContactButton({
  children,
  href = '#invitation',
  className = '',
  on = 'navy',
}: ButtonProps) {
  const fill =
    on === 'navy'
      ? 'bg-cream text-navy hover:shadow-[0_0_40px_-6px_rgba(246,240,233,0.45)]'
      : 'bg-navy text-cream hover:shadow-[0_0_40px_-10px_rgba(22,48,92,0.55)]'
  const wipe = on === 'navy' ? 'bg-slate-pale' : 'bg-navy-mid'

  return (
    <Magnet padding={90} strength={4}>
      <a
        href={href}
        className={`group relative inline-block overflow-hidden rounded-full px-8 py-3 text-xs font-medium uppercase tracking-[0.2em] transition-shadow duration-300 sm:px-10 sm:py-3.5 sm:text-sm md:px-12 md:py-4 md:text-base ${fill} ${className}`}
      >
        <span className="relative z-10">{children}</span>
        <span
          className={`absolute inset-0 -translate-x-full transition-transform duration-500 ease-out group-hover:translate-x-0 ${wipe}`}
        />
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
