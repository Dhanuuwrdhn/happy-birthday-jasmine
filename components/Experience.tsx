'use client'

import { useRef, useState } from 'react'
import { content } from '@/lib/content'
import GiftBox from '@/components/GiftBox'
import { JasmineSprig, JasmineMark } from '@/components/Jasmine'
import Petals from '@/components/Petals'
import Letter from '@/components/Letter'
import Slideshow from '@/components/Slideshow'
import VideoMemory from '@/components/VideoMemory'
import Minigame from '@/components/Minigame'

const STEPS = ['special', 'letter', 'video', 'memories', 'prizebox', 'game', 'closing'] as const
type Step = (typeof STEPS)[number]

export default function Experience() {
  const [step, setStep] = useState<Step>('special')
  const [playing, setPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  function next() {
    setStep((s) => STEPS[Math.min(STEPS.indexOf(s) + 1, STEPS.length - 1)])
  }

  function pauseAudio() {
    const el = audioRef.current
    if (el && !el.paused) {
      el.pause()
      setPlaying(false)
    }
  }

  function resumeAudio() {
    audioRef.current
      ?.play()
      .then(() => setPlaying(true))
      .catch(() => setPlaying(false))
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

      <button onClick={toggleAudio} className="audio-toggle label" title={content.audioTitle}>
        {playing ? content.ui.soundOn : content.ui.soundOff}
      </button>

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
              // First tap of the visit, so it is also the browser's permission to play music.
              toggleAudio()
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

      {step === 'memories' && (
        <section className="sheet sheet--album">
          <h2 className="hand-lg text-[2.6rem]">{content.memoriesTitle}</h2>
          <Slideshow slides={content.slides} onDone={next} />
        </section>
      )}

      {step === 'video' && (
        <section className="sheet sheet--album">
          <VideoMemory
            onDone={next}
            onPlay={pauseAudio}
            onEnded={resumeAudio}
          />
        </section>
      )}

      {step === 'prizebox' && (
        <GiftBox title={content.prizeBox.title} hint={content.prizeBox.hint} onOpened={next} />
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
