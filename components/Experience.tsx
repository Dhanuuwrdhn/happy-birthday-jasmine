'use client'

import { useRef, useState } from 'react'
import { content } from '@/lib/content'
import Landing from '@/components/Landing'
import Slideshow from '@/components/Slideshow'
import MakeAWish from '@/components/MakeAWish'

type Step = 'landing' | 'slideshow' | 'wish' | 'minigame' | 'closing'

export default function Experience() {
  const [step, setStep] = useState<Step>('landing')
  const audioRef = useRef<HTMLAudioElement>(null)

  function handlePlay() {
    audioRef.current?.play().catch(() => {})
  }

  function handleStart() {
    audioRef.current?.play().catch(() => {})
    setStep('slideshow')
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-rose-950 via-neutral-900 to-rose-950">
      <audio ref={audioRef} src={content.audioSrc} loop />
      {step === 'landing' && (
        <Landing
          partnerName={content.partnerName}
          age={content.age}
          onPlay={handlePlay}
          onStart={handleStart}
        />
      )}
      {step === 'slideshow' && (
        <Slideshow slides={content.slides} onDone={() => setStep('wish')} />
      )}
      {step === 'wish' && <MakeAWish onAdvance={() => setStep('minigame')} />}
    </main>
  )
}
