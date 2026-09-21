'use client'

import { useState } from 'react'
import { content } from '@/lib/content'

/** Where a button runs off to, cycled each time she reaches for it. */
const DODGE = [
  'translate(-120px, -30px)',
  'translate(130px, 40px)',
  'translate(-90px, 55px)',
  'translate(110px, -50px)',
]

/** How many times "Yes" escapes before it lets itself be pressed. */
const YES_DODGES = 2

function Face({ mood }: { mood: 'happy' | 'sad' }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden>
      <circle cx="32" cy="32" r="28" fill="#fffaf3" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="23" cy="26" r="3.4" fill="currentColor" />
      <circle cx="41" cy="26" r="3.4" fill="currentColor" />
      {mood === 'happy' ? (
        <path d="M21 39c3.6 5.4 8.2 8 11 8s7.4-2.6 11-8" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
      ) : (
        <path d="M21 46c3.6-5.4 8.2-8 11-8s7.4 2.6 11 8" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
      )}
    </svg>
  )
}

export default function Mood({ onDone }: { onDone: () => void }) {
  const [asked, setAsked] = useState(false)
  const [yesRuns, setYesRuns] = useState(0)
  const [noRuns, setNoRuns] = useState(0)

  const yesSettled = yesRuns >= YES_DODGES
  const spot = (runs: number) => (runs === 0 ? undefined : { transform: DODGE[(runs - 1) % DODGE.length] })

  function reachForYes() {
    if (!yesSettled) setYesRuns((n) => n + 1)
  }

  if (!asked) {
    return (
      <section className="sheet text-center">
        <h2 className="hand-lg text-[2.4rem]">{content.mood.question}</h2>

        <div className="mood-faces">
          <button onClick={() => setAsked(true)} className="mood-face" aria-label={content.mood.happy}>
            <Face mood="happy" />
          </button>
          {/* It spins away from her the moment she reaches for it. */}
          <span className="mood-face mood-face--sad" role="presentation">
            <Face mood="sad" />
          </span>
        </div>

        <p className="hand">{content.mood.hint}</p>
      </section>
    )
  }

  return (
    <section className="sheet text-center">
      <h2 className="hand-lg text-[2.2rem]">{content.mood.confirm}</h2>

      <div className="mood-answers">
        {/* "Yes" escapes twice for the fun of it, then stands still. */}
        <button
          onPointerEnter={reachForYes}
          onMouseEnter={reachForYes}
          onFocus={reachForYes}
          onClick={() => (yesSettled ? onDone() : reachForYes())}
          className="btn mood-runner"
          style={spot(yesRuns)}
        >
          {content.mood.yes}
        </button>

        {/* "No" never lets itself be caught. */}
        <button
          onPointerEnter={() => setNoRuns((n) => n + 1)}
          onMouseEnter={() => setNoRuns((n) => n + 1)}
          onFocus={() => setNoRuns((n) => n + 1)}
          onClick={() => setNoRuns((n) => n + 1)}
          className="btn-ghost mood-runner"
          style={spot(noRuns)}
        >
          {content.mood.no}
        </button>
      </div>

      {noRuns > 0 && <p className="hand">{content.mood.tease}</p>}
      {yesRuns > 0 && !yesSettled && <p className="hand">{content.mood.chase}</p>}
    </section>
  )
}
