'use client'
import { useRef } from 'react'

/**
 * A fanned stack of "PDF pages" that tilts toward the cursor (CSS 3D — no WebGL).
 * Purely decorative; tilt is disabled on touch (CSS) and for reduced-motion users.
 */
export function PaperStack() {
  const tiltRef = useRef<HTMLDivElement>(null)
  const reduced = useRef(false)

  function onMove(e: React.MouseEvent) {
    const el = tiltRef.current
    if (!el) return
    if (
      reduced.current ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      reduced.current = true
      return
    }
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    el.style.setProperty('--ry', `${px * 26}deg`)
    el.style.setProperty('--rx', `${-py * 26}deg`)
  }

  function reset() {
    const el = tiltRef.current
    if (!el) return
    el.style.setProperty('--ry', '0deg')
    el.style.setProperty('--rx', '0deg')
  }

  return (
    <div className="paper-stage" onMouseMove={onMove} onMouseLeave={reset} aria-hidden>
      <div className="paper-float">
        <div ref={tiltRef} className="paper-tilt">
          <div className="paper paper-3" />
          <div className="paper paper-2" />
          <div className="paper paper-1">
            <div className="flex h-full flex-col gap-3.5">
              <div className="paper-badge" />
              <div className="paper-bar" style={{ width: '72%' }} />
              <div className="paper-bar" style={{ width: '92%' }} />
              <div className="paper-bar brand" style={{ width: '54%' }} />
              <div className="paper-bar" style={{ width: '84%' }} />
              <div className="paper-bar" style={{ width: '64%' }} />
              <div className="paper-bar mt-auto" style={{ width: '40%' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
