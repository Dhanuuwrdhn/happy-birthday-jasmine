'use client'

import { useState } from 'react'
import type React from 'react'
import { content } from '@/lib/content'
import { nextOutcome, teaseTarget } from '@/lib/logic'
import { JasmineMark } from '@/components/Jasmine'

const REVEAL_MS = 1400
const SHUFFLE_MS = 1050

/** What the four slips read once the game is over. */
const LOVE = ['L', 'O', 'V', 'E']

/** Petals and gold thrown outward when the first prize turns up. */
const CONFETTI = [
  { x: -150, y: -70, spin: 220, gold: false, delay: '0s' },
  { x: -95, y: -120, spin: -180, gold: true, delay: '.05s' },
  { x: -40, y: -140, spin: 300, gold: false, delay: '.1s' },
  { x: 25, y: -135, spin: -260, gold: true, delay: '.04s' },
  { x: 85, y: -110, spin: 200, gold: false, delay: '.12s' },
  { x: 145, y: -60, spin: -320, gold: true, delay: '.08s' },
  { x: -170, y: 20, spin: 160, gold: true, delay: '.16s' },
  { x: -110, y: 60, spin: -200, gold: false, delay: '.2s' },
  { x: 0, y: 80, spin: 260, gold: false, delay: '.14s' },
  { x: 115, y: 55, spin: -160, gold: false, delay: '.18s' },
  { x: 165, y: 15, spin: 240, gold: true, delay: '.22s' },
  { x: 60, y: 90, spin: -300, gold: false, delay: '.26s' },
]

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
  /** The first prize gets its own moment before the game carries on. */
  const [cheering, setCheering] = useState<string | null>(null)

  const done = found.length === content.prizes.length
  const busy = reveal !== null || shuffling || cheering !== null

  function pick(i: number) {
    if (busy || done) return

    const outcome = nextOutcome(misses, target, found.length)
    setPicked(i)

    const firstPrize = outcome.kind === 'prize' && found.length === 0

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

    // Show the result, then either celebrate the first prize or sweep the
    // papers around and turn them all back over.
    setTimeout(() => {
      setReveal(null)
      setPicked(null)
      if (firstPrize) {
        setCheering(content.prizes[0])
        return
      }
      setShuffling(true)
      setTimeout(() => setShuffling(false), SHUFFLE_MS)
    }, REVEAL_MS)
  }

  /** Back to the slips, with the papers sweeping round once more. */
  function keepLooking() {
    setCheering(null)
    setShuffling(true)
    setTimeout(() => setShuffling(false), SHUFFLE_MS)
  }

  if (cheering) {
    return (
      <div className="stack text-center">
        <div className="cheer">
          {CONFETTI.map((c, i) => (
            <span
              key={i}
              className={`cheer-bit ${c.gold ? 'cheer-bit--gold' : ''}`}
              aria-hidden
              style={{ '--x': `${c.x}px`, '--y': `${c.y}px`, '--spin': `${c.spin}deg`, animationDelay: c.delay } as React.CSSProperties}
            />
          ))}
          <h3 className="hand-lg text-[2.6rem]">{content.foundOne.title}</h3>
        </div>

        <p className="paper-prize">{cheering}</p>
        <div className="rule" aria-hidden>
          <JasmineMark />
        </div>
        <p className="muted max-w-sm">{content.foundOne.line}</p>
        <button onClick={keepLooking} className="btn">
          {content.foundOne.cta}
        </button>
      </div>
    )
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
            ) : done ? (
              // Once both presents are out, the slips turn over into a word.
              <span className="paper-love">{LOVE[i]}</span>
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
