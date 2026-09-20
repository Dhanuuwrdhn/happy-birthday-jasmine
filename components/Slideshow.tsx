'use client'

import { useState } from 'react'
import { content, type Slide } from '@/lib/content'
import Photo from '@/components/Photo'

export default function Slideshow({ slides, onDone }: { slides: Slide[]; onDone: () => void }) {
  const [i, setI] = useState(0)
  const slide = slides[i]
  const isLast = i === slides.length - 1

  return (
    <div className="stack">
      <Photo src={slide.photo} className="w-60 sm:w-72" />
      <p className="hand max-w-sm text-center text-[1.35rem]">{slide.caption}</p>
      <div className="flex items-center gap-3">
        <button onClick={() => setI((n) => n - 1)} disabled={i === 0} className="btn-ghost">
          {content.ui.prev}
        </button>
        <span className="hand whitespace-nowrap tabular-nums">
          {i + 1} / {slides.length}
        </span>
        <button onClick={() => (isLast ? onDone() : setI((n) => n + 1))} className="btn">
          {isLast ? content.ui.continue : content.ui.next}
        </button>
      </div>
    </div>
  )
}
