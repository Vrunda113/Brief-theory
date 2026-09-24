import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'

type VideoLightboxProps = {
  /** The clip to show, or `null` to render nothing. */
  src: string | null
  poster?: string
  onClose: () => void
}

/**
 * A full-screen viewer for a single clip, portalled to the document body.
 *
 * Portalled rather than simply `fixed` in place: the strip this opens from
 * sits inside a card that framer-motion scales as it scrolls, and a
 * `transform` on an ancestor turns `position: fixed` into "fixed to that
 * ancestor" rather than to the viewport. Rendering outside the card is what
 * lets the clip actually fill the screen instead of being boxed to the card's
 * own bounds.
 */
export function VideoLightbox({ src, poster, onClose }: VideoLightboxProps) {
  // Escape closes it, and the page behind it stops scrolling while it's open.
  useEffect(() => {
    if (!src) return

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
    }
  }, [src, onClose])

  return createPortal(
    <AnimatePresence>
      {src && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-navy-deep/92 p-6 backdrop-blur-sm"
          // Clicking the backdrop closes it; the video itself stops the click
          // below from reaching this handler.
          onClick={onClose}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-cream/30 text-cream transition-colors duration-300 hover:border-cream hover:bg-cream/10 sm:right-8 sm:top-8"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M1 1L15 15M15 1L1 15"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>

          <motion.video
            key={src}
            initial={{ scale: 0.94, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            src={src}
            poster={poster}
            controls
            autoPlay
            playsInline
            onClick={(event) => event.stopPropagation()}
            className="max-h-[88svh] max-w-[92vw] rounded-2xl shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] sm:rounded-3xl"
          />
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
