'use client'

import { useEffect, useRef, useState } from 'react'
import { content } from '@/lib/content'
import GiftBox from '@/components/GiftBox'
import { JasmineSprig, JasmineMark } from '@/components/Jasmine'
import Petals from '@/components/Petals'
import Letter from '@/components/Letter'
import VideoMemory from '@/components/VideoMemory'
import Minigame from '@/components/Minigame'
import Mood from '@/components/Mood'

const STEPS = ['special', 'letter', 'video', 'prizebox', 'game', 'mood', 'closing'] as const
type Step = (typeof STEPS)[number]

export default function Experience() {
  const [step, setStep] = useState<Step>('special')
  /** Covers the switch out of the dark room so the next page is not a hard cut. */
  const [veiled, setVeiled] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  /** Whether the song is meant to be on. Only the video turns it off. */
  const wantsSong = useRef(true)

  // A browser will not start audio before she has touched the page, and can
  // refuse to resume it outside a gesture. So every tap quietly tries again —
  // she never has to think about the song.
  useEffect(() => {
    const retry = () => {
      const el = audioRef.current
      if (!wantsSong.current || !el || !el.paused) return
      el.play().catch(() => {})
    }
    document.addEventListener('pointerdown', retry)
    return () => document.removeEventListener('pointerdown', retry)
  }, [])

  function next() {
    setStep((s) => STEPS[Math.min(STEPS.indexOf(s) + 1, STEPS.length - 1)])
  }

  /** Only the video does this, and only for as long as it runs. */
  function pauseAudio() {
    wantsSong.current = false
    audioRef.current?.pause()
  }

  function resumeAudio() {
    wantsSong.current = true
    audioRef.current?.play().catch(() => {})
  }

  return (
    <main className="page">
      <div className="aurora" aria-hidden />
      <div className="grain" aria-hidden />
      <Petals />
      <audio ref={audioRef} src={content.audioSrc} loop preload="none" />

      {veiled && (
        <div className="page-veil" aria-hidden onAnimationEnd={() => setVeiled(false)} />
      )}

      {step === 'special' && (
        <section className="sheet sheet--note text-center">
          <JasmineSprig />
          <p className="dateline">{content.dateline}</p>
          <h1 className="hand-lg text-[3rem] sm:text-[3.6rem]">{content.special.title}</h1>
          <p className="muted max-w-[16rem]">{content.special.sub}</p>
          <div className="rule" aria-hidden>
            <JasmineMark />
          </div>
          <button
            onClick={() => {
              // Her first tap of the visit: the browser's permission to play.
              resumeAudio()
              next()
            }}
            className="btn"
          >
            {content.special.cta}
          </button>
        </section>
      )}

      {step === 'letter' && (
        <section className="sheet sheet--ruled sheet--wide">
          <Letter onDone={next} />
        </section>
      )}

      {step === 'video' && (
        <VideoMemory
          onDone={() => {
            // The room is already black here, so the veil takes over without a seam.
            setVeiled(true)
            next()
          }}
          hushSong={pauseAudio}
          resumeSong={resumeAudio}
        />
      )}

      {step === 'prizebox' && (
        <GiftBox title={content.prizeBox.title} hint={content.prizeBox.hint} onOpened={next} />
      )}

      {step === 'game' && (
        <section className="sheet sheet--wide">
          <Minigame onDone={next} />
        </section>
      )}

      {step === 'mood' && <Mood onDone={next} />}

      {step === 'closing' && (
        <section className="sheet sheet--note text-center">
          <JasmineSprig />
          <h2 className="hand-lg text-[2.8rem]">{content.closing.title}</h2>
          <div className="rule" aria-hidden>
            <JasmineMark />
          </div>
          <p className="muted max-w-sm">{content.closing.line}</p>
          <p className="hand text-[1.3rem]">— {content.from}</p>
          <p className="credit">{content.closing.credit}</p>
        </section>
      )}
    </main>
  )
}
