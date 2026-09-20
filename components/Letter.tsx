'use client'

import { content } from '@/lib/content'
import { useTypewriter } from '@/hooks/useTypewriter'

const FULL_TEXT = content.letter.join('\n\n')

export default function Letter({ onDone }: { onDone: () => void }) {
  const { shown, done, skip } = useTypewriter(FULL_TEXT)

  return (
    <div className="stack">
      <article className="letter min-h-[60dvh] w-full whitespace-pre-line">
        {shown}
        {!done && <span className="caret" aria-hidden />}
      </article>
      {done ? (
        <button onClick={onDone} className="btn">
          {content.ui.next}
        </button>
      ) : (
        <button onClick={skip} className="btn-ghost">
          {content.ui.skip}
        </button>
      )}
    </div>
  )
}
