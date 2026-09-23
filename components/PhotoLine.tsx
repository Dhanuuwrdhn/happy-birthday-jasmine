'use client'

import { useState } from 'react'

type PhotoLineProps = {
  side: 'left' | 'right'
  photos: string[]
}

/**
 * A cord down one side of the page with photographs pegged to it, swaying
 * gently. If a file is not there yet the frame stays — blank paper in a frame
 * still reads as deliberate, while a broken image does not.
 */
function Hanging({ src, index }: { src: string; index: number }) {
  const [broken, setBroken] = useState(false)

  return (
    <figure className="hang" style={{ animationDelay: `${index * 0.8}s` }}>
      <span className="hang-peg" aria-hidden />
      {broken ? (
        <div className="hang-photo hang-photo--blank" />
      ) : (
        // ponytail: plain <img>; these are decorative and never above the fold.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" loading="lazy" onError={() => setBroken(true)} className="hang-photo" />
      )}
    </figure>
  )
}

export default function PhotoLine({ side, photos }: PhotoLineProps) {
  if (photos.length === 0) return null

  return (
    <div className={`photo-line photo-line--${side}`} aria-hidden>
      <span className="photo-cord" />
      {photos.map((src, i) => (
        <Hanging key={src} src={src} index={i} />
      ))}
    </div>
  )
}
