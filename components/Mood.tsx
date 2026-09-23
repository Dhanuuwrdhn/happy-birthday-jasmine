'use client'

import { useState } from 'react'
import { content } from '@/lib/content'
import { JasmineSprig, JasmineMark } from '@/components/Jasmine'

/**
 * Where a button runs off to. The offsets stay small enough that it never
 * leaves the paper — it should look playful, not broken.
 */
const DODGE = [
  { x: -78, y: -18 },
  { x: 84, y: 22 },
  { x: -62, y: 26 },
  { x: 70, y: -24 },
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
  /** The gloomy face is not an option; it leaves as soon as she reaches for it. */
  const [sadGone, setSadGone] = useState(false)
  /** Taken out of the page once it has finished leaving, so it cannot linger. */
  const [sadRemoved, setSadRemoved] = useState(false)

  function waveOffSad() {
    if (sadGone) return
    setSadGone(true)
    window.setTimeout(() => setSadRemoved(true), 560)
  }
  const [yesRuns, setYesRuns] = useState(0)
  const [noRuns, setNoRuns] = useState(0)

  const yesSettled = yesRuns >= YES_DODGES
  const spot = (runs: number) => {
    if (runs === 0) return undefined
    const { x, y } = DODGE[(runs - 1) % DODGE.length]
    return { transform: `translate(${x}px, ${y}px)` }
  }

  function reachForYes() {
    if (!yesSettled) setYesRuns((n) => n + 1)
  }

  if (!asked) {
    return (
      <section className="sheet sheet--note text-center">
        <JasmineSprig />
        <h2 className="hand-lg text-[2.3rem]">{content.mood.question}</h2>
        <p className="muted max-w-[16rem]">{content.mood.sub}</p>

        <div className="mood-faces">
          <button onClick={() => setAsked(true)} className="mood-pick">
            <span className="mood-face">
              <Face mood="happy" />
            </span>
            <span className="hand">{content.mood.happy}</span>
          </button>

          {/* It spins once, then vanishes — leaving the happy one in the middle. */}
          {!sadRemoved && (
            <span
              className={`mood-pick mood-pick--sad ${sadGone ? 'is-gone' : ''}`}
              role="presentation"
              onPointerEnter={waveOffSad}
              onMouseEnter={waveOffSad}
              onClick={waveOffSad}
            >
              <span className="mood-face">
                <Face mood="sad" />
              </span>
              <span className="hand">{content.mood.sad}</span>
            </span>
          )}
        </div>

        <div className="rule" aria-hidden>
          <JasmineMark />
        </div>
        <p className="hand">{sadGone ? content.mood.sadGone : content.mood.hint}</p>
      </section>
    )
  }

  return (
    <section className="sheet sheet--note text-center">
      <JasmineSprig />
      <h2 className="hand-lg text-[2.1rem]">{content.mood.confirm}</h2>
      <p className="muted max-w-[16rem]">{content.mood.confirmSub}</p>

      {/* The buttons only ever run around inside this patch of paper. */}
      <div className="mood-yard">
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

      <p className="hand mood-whisper">
        {noRuns > 0 ? content.mood.tease : yesSettled ? content.mood.caught : content.mood.chase}
      </p>
    </section>
  )
}
