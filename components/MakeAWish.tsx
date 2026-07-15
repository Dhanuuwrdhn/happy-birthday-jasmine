'use client'

import { useLongPress } from '@/hooks/useLongPress'

type MakeAWishProps = {
  onAdvance: () => void
}

export default function MakeAWish({ onAdvance }: MakeAWishProps) {
  const longPressHandlers = useLongPress(onAdvance, 2000)

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 p-8 text-center text-rose-50">
      <p className="max-w-md text-xl">Close your eyes and make a wish 🕯️</p>
      <div
        {...longPressHandlers}
        className="flex h-40 w-40 select-none items-center justify-center rounded-full bg-rose-900 text-6xl"
      >
        🎂
      </div>
    </div>
  )
}
