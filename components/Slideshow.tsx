'use client'

import { useState } from 'react'
import type { Slide } from '@/lib/content'

type SlideshowProps = {
  slides: Slide[]
  onDone: () => void
}

export default function Slideshow({ slides, onDone }: SlideshowProps) {
  const [index, setIndex] = useState(0)
  const slide = slides[index]
  const isLast = index === slides.length - 1

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 p-8 text-center text-rose-50">
      {slide.photoUrl && (
        // ponytail: plain <img>, swap to next/image if LCP/optimization ever matters
        // eslint-disable-next-line @next/next/no-img-element
        <img src={slide.photoUrl} alt="" className="max-h-64 rounded-lg object-cover shadow-lg" />
      )}
      <p className="max-w-md text-xl">{slide.text}</p>
      <div className="flex gap-4">
        <button
          onClick={() => setIndex((i) => i - 1)}
          disabled={index === 0}
          className="rounded-full bg-rose-900 px-6 py-3 font-semibold text-rose-50 transition hover:bg-rose-800 disabled:opacity-30"
        >
          Prev
        </button>
        <button
          onClick={() => (isLast ? onDone() : setIndex((i) => i + 1))}
          className="rounded-full bg-amber-400 px-6 py-3 font-semibold text-rose-950 transition hover:bg-amber-300"
        >
          {isLast ? 'Continue to make a wish' : 'Next'}
        </button>
      </div>
    </div>
  )
}
