'use client'

import { useRef, useState } from 'react'
import { content } from '@/lib/content'

type VideoMemoryProps = {
  onDone: () => void
  /** The background song has to step aside while the clip is playing. */
  onPlay: () => void
  onEnded: () => void
}

type Stage = 'ask' | 'playing' | 'done'

export default function VideoMemory({ onDone, onPlay, onEnded }: VideoMemoryProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [stage, setStage] = useState<Stage>('ask')
  const [teased, setTeased] = useState(false)
  const [missing, setMissing] = useState(false)

  function play() {
    setStage('playing')
    onPlay()
    videoRef.current?.play().catch(() => {})
  }

  function finish() {
    setStage('done')
    onEnded()
  }

  return (
    <div className="stack">
      <h2 className="hand-lg text-[2.4rem]">{content.video.title}</h2>

      {/* The clip is portrait, so it is shown in the phone it was filmed on. */}
      <div className="phone">
        <div className="phone-screen">
          <span className="phone-island" aria-hidden />

          {missing ? (
            <div className="phone-empty">
              <span className="hand">{content.video.missing}</span>
            </div>
          ) : (
            <video
              ref={videoRef}
              className="phone-video"
              src={content.video.src}
              controls={stage === 'playing'}
              playsInline
              preload="metadata"
              onEnded={finish}
              onError={() => setMissing(true)}
            />
          )}

          {stage === 'ask' && !missing && (
            <div className="phone-overlay">
              <p className="phone-ask">{content.video.confirm}</p>
              <div className="flex items-center gap-3">
                <button onClick={play} className="btn">
                  {content.video.yes}
                </button>
                <button onClick={() => setTeased(true)} className="btn-ghost btn-ghost--dark">
                  {content.video.no}
                </button>
              </div>
              {teased && <p className="hand phone-tease">{content.video.tease}</p>}
            </div>
          )}

          {stage === 'done' && (
            <div className="phone-overlay">
              <p className="hand phone-after">{content.video.after}</p>
            </div>
          )}
        </div>
      </div>

      {stage === 'playing' ? (
        <button onClick={finish} className="btn-ghost">
          {content.ui.skip}
        </button>
      ) : (
        <button onClick={onDone} className="btn">
          {content.video.cta}
        </button>
      )}
    </div>
  )
}
