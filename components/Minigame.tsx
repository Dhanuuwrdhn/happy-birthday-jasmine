'use client'

import { useState } from 'react'
import type { BallContent } from '@/lib/content'
import { shuffleBalls } from '@/lib/shuffleBalls'

type MinigameProps = {
  balls: BallContent[]
  onDone: () => void
}

export default function Minigame({ balls, onDone }: MinigameProps) {
  const [shuffled] = useState(() => {
    const result = shuffleBalls(balls)
    if (process.env.NODE_ENV !== 'production') {
      console.assert(
        result.filter((b) => b.isPrize).length === 1,
        'Minigame: expected exactly one prize ball in content.balls'
      )
    }
    return result
  })
  const [openedIndices, setOpenedIndices] = useState<Set<number>>(new Set())
  const [lastOpened, setLastOpened] = useState<number | null>(null)

  function openBall(i: number) {
    setOpenedIndices((prev) => new Set(prev).add(i))
    setLastOpened(i)
  }

  const foundPrize = lastOpened !== null && shuffled[lastOpened].isPrize

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 p-8 text-center text-rose-50">
      <h2 className="font-[family-name:var(--font-playfair)] text-3xl">Pick a ball!</h2>
      <div className="grid grid-cols-4 gap-4">
        {shuffled.map((ball, i) => (
          <button
            key={i}
            onClick={() => openBall(i)}
            disabled={openedIndices.has(i)}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-400 text-2xl shadow-lg transition hover:scale-105 disabled:opacity-40"
          >
            🔮
          </button>
        ))}
      </div>
      {lastOpened !== null && (
        <div className="rounded-lg bg-rose-900/80 p-6">
          <p className="text-lg">{shuffled[lastOpened].resultText}</p>
        </div>
      )}
      {foundPrize && (
        <button
          onClick={onDone}
          className="rounded-full bg-amber-400 px-6 py-3 font-semibold text-rose-950 transition hover:bg-amber-300"
        >
          Continue
        </button>
      )}
    </div>
  )
}
