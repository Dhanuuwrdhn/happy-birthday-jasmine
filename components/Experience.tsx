'use client'

import { useRef, useState } from 'react'
import { content } from '@/lib/content'
import GiftBox from '@/components/GiftBox'
import { JasmineSprig, JasmineMark } from '@/components/Jasmine'
import Petals from '@/components/Petals'
import Letter from '@/components/Letter'
import Photo from '@/components/Photo'
import Slideshow from '@/components/Slideshow'
import Minigame from '@/components/Minigame'

const STEPS = ['gift', 'special', 'letter', 'memories', 'gallery', 'game', 'closing'] as const
type Step = (typeof STEPS)[number]

export default function Experience() {
  const [step, setStep] = useState<Step>('gift')
  const [playing, setPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  function next() {
    setStep((s) => STEPS[Math.min(STEPS.indexOf(s) + 1, STEPS.length - 1)])
  }

  function toggleAudio() {
    const el = audioRef.current
    if (!el) return
    if (el.paused) {
      // The browser may refuse before a user gesture; ignore it, the button stays available.
      el.play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false))
    } else {
      el.pause()
      setPlaying(false)
    }
  }

  return (
    <main className="page">
      <div className="aurora" aria-hidden />
      <div className="grain" aria-hidden />
      <Petals />
      <audio ref={audioRef} src={content.audioSrc} loop preload="none" />

      {step !== 'gift' && (
        <button onClick={toggleAudio} className="audio-toggle label" title={content.audioTitle}>
          {playing ? content.ui.soundOn : content.ui.soundOff}
        </button>
      )}

      {step === 'gift' && (
        <GiftBox
          onOpened={() => {
            // Tapping the box doubles as the browser's permission to start the music.
            toggleAudio()
            next()
          }}
        />
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
          <button onClick={next} className="btn">
            {content.special.cta}
          </button>
        </section>
      )}

      {step === 'letter' && (
        <section className="sheet sheet--ruled sheet--wide">
          <Letter onDone={next} />
        </section>
      )}

      {step === 'memories' && (
        <section className="sheet sheet--album">
          <h2 className="hand-lg text-[2.6rem]">{content.memoriesTitle}</h2>
          <Slideshow slides={content.slides} onDone={next} />
        </section>
      )}

      {step === 'gallery' && (
        <section className="sheet sheet--album sheet--wide">
          <h2 className="hand text-center text-[1.4rem]">{content.galleryTitle}</h2>
          <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-3">
            {content.gallery.map((photo) => (
              <Photo key={photo.src} src={photo.src} className="aspect-square w-full" />
            ))}
          </div>
          <button onClick={next} className="btn">
            {content.ui.toGame}
          </button>
        </section>
      )}

      {step === 'game' && (
        <section className="sheet sheet--wide">
          <Minigame onDone={next} />
        </section>
      )}

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
