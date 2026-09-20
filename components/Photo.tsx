'use client'

import { useState } from 'react'
import { content } from '@/lib/content'

/** A photo in a polaroid frame. If the file isn't there yet, the frame still shows. */
export default function Photo({ src, className = '' }: { src: string; className?: string }) {
  const [broken, setBroken] = useState(false)

  return (
    <figure className={`frame ${className}`}>
      {broken ? (
        <div className="frame-inner frame-empty">
          <span className="hand">{content.ui.photoMissing}</span>
        </div>
      ) : (
        // ponytail: plain <img>. Switch to next/image if the photo count ever grows.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" loading="lazy" onError={() => setBroken(true)} className="frame-inner" />
      )}
    </figure>
  )
}
