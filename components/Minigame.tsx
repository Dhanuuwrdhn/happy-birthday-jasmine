'use client'

import { useState } from 'react'
import type React from 'react'
import { content } from '@/lib/content'
import { nextOutcome, teaseTarget } from '@/lib/logic'
import { JasmineMark } from '@/components/Jasmine'

const REVEAL_MS = 1400
const SHUFFLE_MS = 1050

/**
 * Four face-down papers that get shuffled again after every pick.
 * ponytail: the papers are identical while face down, so there is nothing to track —
 * the shuffle is pure theatre and the result is decided at pick time by nextOutcome().
 * That keeps her losing for a while without ever making the game unwinnable.
 */
export default function Minigame({ onDone }: { onDone: () => void }) {
  const [misses, setMisses] = useState(0)
  const [target, setTarget] = useState(teaseTarget)
  const [found, setFound] = useState<string[]>([])
  const [picked, setPicked] = useState<number | null>(null)
  const [reveal, setReveal] = useState<{ text: string; isPrize: boolean } | null>(null)
  const [shuffling, setShuffling] = useState(false)

  const done = found.length === content.prizes.length
  const busy = reveal !== null || shuffling

  function pick(i: number) {
    if (busy || done) return

    const outcome = nextOutcome(misses, target, found.length)
    setPicked(i)

    if (outcome.kind === 'prize') {
      const prize = content.prizes[outcome.index]
      setReveal({ text: prize, isPrize: true })
      setFound((prev) => [...prev, prize])
      setMisses(0)
      setTarget(teaseTarget())
    } else {
      setReveal({ text: content.teases[misses % content.teases.length], isPrize: false })
      setMisses((n) => n + 1)
    }

    // Show the result, then sweep the papers around and turn them all back over.
    setTimeout(() => {
      setReveal(null)
      setPicked(null)
      setShuffling(true)
      setTimeout(() => setShuffling(false), SHUFFLE_MS)
    }, REVEAL_MS)
  }

  return (
    <div className="stack">
      <p className="title text-center text-2xl">{content.prizeIntro}</p>

      <div className={`paper-deck grid w-full grid-cols-2 gap-4 sm:grid-cols-4 ${shuffling ? 'is-shuffling' : ''}`}>
        {[0, 1, 2, 3].map((i) => (
          <button
            key={i}
            onClick={() => pick(i)}
            disabled={busy || done}
            aria-label={`${content.ui.paper} ${i + 1}`}
            className="paper"
            // Each slip takes its own path through the shuffle.
            style={{ '--slot': i, '--dir': i % 2 ? 1 : -1 } as React.CSSProperties}
          >
            {picked === i && reveal ? (
              <span className={reveal.isPrize ? 'paper-prize' : 'muted'}>{reveal.text}</span>
            ) : (
              <span className="paper-num">{i + 1}</span>
            )}
          </button>
        ))}
      </div>

      {found.length > 0 && !done && <p className="hand">{content.prizeFound}</p>}

      {done ? (
        <>
          <h3 className="hand-lg text-[2.4rem]">{content.win.title}</h3>
          <div className="rule" aria-hidden>
            <JasmineMark />
          </div>
          <div className="prize-list">
            {found.map((prize) => (
              <p key={prize} className="paper-prize text-center">
                {prize}
              </p>
            ))}
          </div>
          <p className="muted max-w-sm text-center">{content.win.line}</p>
          <button onClick={onDone} className="btn">
            {content.ui.continue}
          </button>
        </>
      ) : (
        <p className="hand">{shuffling ? content.ui.shuffling : content.prizeNudge}</p>
      )}
    </div>
  )
}
