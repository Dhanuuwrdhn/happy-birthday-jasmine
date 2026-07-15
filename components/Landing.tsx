'use client'

type LandingProps = {
  partnerName: string
  age: number
  onPlay: () => void
  onStart: () => void
}

export default function Landing({ partnerName, age, onPlay, onStart }: LandingProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 p-8 text-center text-rose-50">
      <button
        onClick={onPlay}
        aria-label="Play music"
        className="rounded-full bg-amber-400 px-6 py-3 text-lg font-semibold text-rose-950 transition hover:bg-amber-300"
      >
        ▶ Play
      </button>
      <h1 className="font-[family-name:var(--font-playfair)] text-4xl sm:text-5xl">
        {/* ponytail: hardcoded "th" suffix, fine since this is a one-time site for one age */}
        Happy {age}th Birthday, {partnerName}
      </h1>
      <button
        onClick={onStart}
        className="rounded-full bg-amber-400 px-8 py-4 text-lg font-semibold text-rose-950 transition hover:bg-amber-300"
      >
        Start
      </button>
    </div>
  )
}
