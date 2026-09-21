'use client'

import { useEffect, useState } from 'react'
import { content, unlockAt } from '@/lib/content'
import { isUnlocked, remaining } from '@/lib/logic'
import Envelope from '@/components/Envelope'
import Petals from '@/components/Petals'
import Garden from '@/components/Garden'
import { JasmineMark } from '@/components/Jasmine'

/** Gold specks catching the light, placed by hand so they sit evenly. */
const MOTES = [
  { left: '18%', top: '28%', delay: '0s' },
  { left: '76%', top: '22%', delay: '2.1s' },
  { left: '30%', top: '72%', delay: '4.2s' },
  { left: '68%', top: '66%', delay: '1.3s' },
  { left: '12%', top: '55%', delay: '3.4s' },
  { left: '88%', top: '46%', delay: '5s' },
]

/**
 * The front door. The site itself is only rendered once the date has passed.
 * ponytail: this trusts the browser clock, so it can be cheated by changing the phone's time.
 * If it ever needs to be cheat-proof, fetch the time from a server (e.g. worldtimeapi.org) here.
 */
export default function Gate({ children }: { children: React.ReactNode }) {
  // null = not mounted yet. This page is static, so the clock is only read in the browser —
  // rendering it on the server would bake in build time and mismatch the client's HTML.
  const [now, setNow] = useState<number | null>(null)

  useEffect(() => {
    const tick = () => setNow(Date.now())
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  // Your own shortcut while testing: add ?preview=1 to the URL.
  const preview =
    typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('preview')

  if (now === null) return <main className="page" />
  if (preview || isUnlocked(now, unlockAt)) return <>{children}</>

  const left = remaining(now, unlockAt)

  return (
    <main className="page">
      <div className="aurora" aria-hidden />
      <div className="grain" aria-hidden />
      <Garden />
      <Petals />
      {MOTES.map((m, i) => (
        <span key={i} className="mote" style={{ left: m.left, top: m.top, animationDelay: m.delay }} aria-hidden />
      ))}

      <section className="sheet">
        <Envelope />
        <p className="dateline">{content.dateline}</p>
        <h1 className="hand-lg text-balance text-center text-[2.8rem] sm:text-[3.4rem]">
          {content.gate.line}
        </h1>

        <div className="counter">
          {content.units.map(([key, label]) => (
            <div key={key} className="counter-cell">
              <span className="counter-num tabular-nums">{String(left[key]).padStart(2, '0')}</span>
              <span className="counter-label">{label}</span>
            </div>
          ))}
        </div>

        <div className="rule" aria-hidden>
          <JasmineMark />
        </div>
        <p className="muted max-w-[22rem] text-center">{content.gate.sub}</p>
      </section>
    </main>
  )
}
