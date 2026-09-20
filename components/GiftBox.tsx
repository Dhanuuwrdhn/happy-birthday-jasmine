'use client'

import { useState } from 'react'

type GiftBoxProps = {
  onOpened: () => void
  title: string
  hint: string
}

/** CSS gift box. The lid lifts when tapped, then onOpened fires. */
export default function GiftBox({ onOpened, title, hint }: GiftBoxProps) {
  const [opening, setOpening] = useState(false)

  function open() {
    if (opening) return
    setOpening(true)
    // Keep in sync with the .gift.is-open animation length in globals.css.
    setTimeout(onOpened, 1500)
  }

  return (
    <div className="stack gap-6 text-center">
      <h1 className="hand-lg text-[2.6rem] sm:text-[3.2rem]">{title}</h1>

      <div className="gift-stage">
        <span className="gift-halo" aria-hidden />
        <button
          onClick={open}
          aria-label={title}
          className={`gift ${opening ? 'is-open' : ''}`}
        >
          <span className="gift-shadow" aria-hidden />
          <span className="gift-body" aria-hidden>
            <span className="gift-band" />
          </span>
          <span className="gift-lid" aria-hidden>
            <span className="gift-bow" />
          </span>
          <span className="gift-burst" aria-hidden />
        </button>
      </div>

      <p className="hand">{opening ? '' : hint}</p>
    </div>
  )
}
