import { NAV_LINKS } from '../../config/copy'
import { FadeIn } from '../shared/FadeIn'
import { Wordmark } from '../shared/Wordmark'

export function Navbar() {
  return (
    <FadeIn
      as="nav"
      delay={0}
      y={-20}
      className="relative z-30 flex items-center justify-between px-6 pt-6 md:px-10 md:pt-8"
    >
      <a href="#top" className="shrink-0 transition-opacity duration-200 hover:opacity-80">
        <Wordmark className="h-12 sm:h-14 md:h-16" />
      </a>

      <div className="flex items-center gap-3.5 sm:gap-8 md:gap-9">
        {NAV_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="text-[0.6rem] font-light uppercase tracking-[0.12em] text-slate-pale transition-opacity duration-200 hover:opacity-70 sm:text-xs sm:tracking-[0.2em] md:text-sm"
          >
            {link.label}
          </a>
        ))}
      </div>
    </FadeIn>
  )
}
