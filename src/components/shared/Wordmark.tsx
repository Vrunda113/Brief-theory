type WordmarkProps = {
  /** Tailwind height classes for the plate. */
  className?: string
  /** Renders the navy glyph with no plate, for use on cream surfaces. */
  bare?: boolean
}

/**
 * The logo always reads navy-on-cream. On the navy page that means it carries
 * its own cream plate rather than inverting to a cream glyph.
 */
export function Wordmark({ className = 'h-11 md:h-12', bare = false }: WordmarkProps) {
  if (bare) {
    return (
      <img
        src="/images/brand/logo-navy.svg"
        alt="Brief Theory"
        className={`w-auto ${className}`}
      />
    )
  }

  // Square corners and a generous cream margin, matching how the mark is
  // presented in the source artwork — a printed card, not a rounded badge.
  return (
    <span
      className={`inline-flex items-center justify-center bg-cream px-5 py-3.5 sm:px-6 sm:py-4 ${className}`}
    >
      <img
        src="/images/brand/logo-navy.svg"
        alt="Brief Theory"
        className="h-full w-auto"
      />
    </span>
  )
}
