import { content } from '@/lib/content'
import { JasmineSprig } from '@/components/Jasmine'
import PhotoLine from '@/components/PhotoLine'

/** Warm out-of-focus lights, placed to frame the card without crowding it. */
const BOKEH = [
  { left: '8%', top: '18%', size: '13rem', delay: '0s' },
  { left: '74%', top: '10%', size: '9rem', delay: '3s' },
  { left: '82%', top: '62%', size: '15rem', delay: '1.5s' },
  { left: '14%', top: '70%', size: '11rem', delay: '4.5s' },
]

/**
 * The room around the letter: jasmine growing in from the corners and a few
 * soft lights behind it, so the page is never just a card on an empty field.
 *
 * `photos` hangs the photographs beside it. The countdown leaves them off —
 * the whole point of that screen is that nothing has been opened yet.
 */
export default function Garden({ photos = false }: { photos?: boolean }) {
  return (
    <>
      {BOKEH.map((b, i) => (
        <span
          key={i}
          className="bokeh"
          aria-hidden
          style={{ left: b.left, top: b.top, width: b.size, height: b.size, animationDelay: b.delay }}
        />
      ))}

      {photos && (
        <>
          <PhotoLine side="left" photos={content.hangingLeft} />
          <PhotoLine side="right" photos={content.hangingRight} />
        </>
      )}

      <div className="vine vine--tl" aria-hidden>
        <JasmineSprig />
      </div>
      <div className="vine vine--tr" aria-hidden>
        <JasmineSprig />
      </div>
      <div className="vine vine--bl" aria-hidden>
        <JasmineSprig />
      </div>
      <div className="vine vine--br" aria-hidden>
        <JasmineSprig />
      </div>
    </>
  )
}
