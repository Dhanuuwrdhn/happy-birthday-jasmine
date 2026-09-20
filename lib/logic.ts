export type Remaining = { days: number; hours: number; minutes: number; seconds: number }

export function isUnlocked(now: number, unlockAt: Date): boolean {
  return now >= unlockAt.getTime()
}

/** Time left, clamped at zero so it never shows a negative number. */
export function remaining(now: number, unlockAt: Date): Remaining {
  const ms = Math.max(0, unlockAt.getTime() - now)
  const total = Math.floor(ms / 1000)
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  }
}

/** Fisher-Yates: shuffle the papers so the prizes aren't always in the same spot. */
export function shuffle<T>(items: readonly T[]): T[] {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export type Outcome = { kind: 'tease' } | { kind: 'prize'; index: number }

/**
 * The game is rigged, deliberately. A pick only wins once she has missed
 * `teaseTarget` times in this round, so the papers can be "reshuffled" after
 * every pick without ever trapping her in a game she cannot finish.
 */
export function nextOutcome(misses: number, teaseTarget: number, prizesFound: number): Outcome {
  if (misses >= teaseTarget) return { kind: 'prize', index: prizesFound }
  return { kind: 'tease' }
}

/** How many misses this round costs: 2 to 4, so the rhythm is never predictable. */
export function teaseTarget(rand: () => number = Math.random): number {
  return 2 + Math.floor(rand() * 3)
}
