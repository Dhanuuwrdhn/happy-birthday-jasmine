# Birthday Minigame Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the single-page Next.js birthday surprise site described in `docs/superpowers/specs/2026-07-15-birthday-minigame-website-design.md` — landing → slideshow → make a wish → prize-ball minigame → closing.

**Architecture:** A client-side state machine (`Experience.tsx`) switches between five step components based on a `step` string in `useState`. All editable copy/media paths live in one typed config file (`lib/content.ts`). No backend, no routing between steps, no persistence.

**Tech Stack:** Next.js (App Router) + TypeScript + Tailwind CSS, deployed to Vercel. No test framework (see Global Constraints).

## Global Constraints

- All on-site copy is in English (spec §1).
- No backend, database, authentication, or multi-user support (spec §1, §8).
- No cross-session persistence — refresh restarts at landing (spec §8).
- No automated test framework. Verification per task is `npx tsc --noEmit` / `npm run build` for type/compile correctness, plus a manual browser check (`npm run dev`) for UI behavior. The one non-trivial pure-logic function (ball shuffle) gets a dev-only `console.assert` invariant check inline — not a separate test file (spec §8).
- Visual palette, locked in Task 3 and reused by every later task: background `bg-gradient-to-b from-rose-950 via-neutral-900 to-rose-950`, body text `text-rose-50`, accent buttons `rounded-full bg-amber-400 px-6 py-3 font-semibold text-rose-950 transition hover:bg-amber-300`, heading font Playfair Display via CSS var `--font-playfair` (used as `font-[family-name:var(--font-playfair)]`), body font Inter via `--font-inter`.
- Make a Wish long-press threshold: exactly 2000ms (spec §2.3, §6).
- `content.ts` ships with 8 sample balls, exactly 1 with `isPrize: true` (within spec's 6–9 range, spec §2.4).
- Package manager: npm. Deploy target: Vercel free tier (spec §5).

---

### Task 1: Scaffold Next.js project

**Files:**
- Create: full Next.js scaffold (`package.json`, `app/`, `public/`, `next.config.ts`, `tsconfig.json`, `.gitignore`, ESLint config) at the repo root.

**Interfaces:**
- Produces: a working `npm run dev` / `npm run build` Next.js + TypeScript + Tailwind + App Router project at the repo root, importable via the `@/*` path alias.

- [ ] **Step 1: Scaffold into a temp dir and merge into the repo root**

The repo root already has `docs/` and `.claude/` in it, so scaffold into a throwaway subdirectory first, then merge:

```bash
npx create-next-app@latest _scaffold --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*" --use-npm
```

If the CLI prompts interactively for anything not covered by these flags, accept the default (press Enter).

```bash
rsync -a _scaffold/ . && rm -rf _scaffold
```

- [ ] **Step 2: Verify the scaffold builds**

Run: `npm run build`
Expected: output ends with `✓ Compiled successfully` (or equivalent success message) and no TypeScript errors.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js app with TypeScript and Tailwind"
```

---

### Task 2: Content data model

**Files:**
- Create: `lib/content.ts`
- Create: `public/audio/.gitkeep`
- Create: `public/photos/.gitkeep`

**Interfaces:**
- Produces: `type Slide = { text: string; photoUrl?: string }`, `type BallContent = { resultText: string; isPrize: boolean }`, `type Content = { partnerName: string; age: number; audioSrc: string; slides: Slide[]; balls: BallContent[] }`, and `content: Content` — the single source of truth every later component reads from.

- [ ] **Step 1: Write `lib/content.ts`**

```ts
export type Slide = {
  text: string
  photoUrl?: string
}

export type BallContent = {
  resultText: string
  isPrize: boolean
}

export type Content = {
  partnerName: string
  age: number
  audioSrc: string
  slides: Slide[]
  balls: BallContent[]
}

export const content: Content = {
  partnerName: 'Jasmine',
  age: 25,
  audioSrc: '/audio/theme.mp3',
  slides: [
    { text: 'Happy 25th Birthday, Jasmine! 🎂' },
    { text: 'Another year of your smile lighting up my world.' },
    { text: 'Thank you for every laugh, every late-night talk, every little moment together.' },
    { text: 'Thank you for staying, even on my hardest days.' },
    { text: 'I hope this year brings you everything you deserve, and more.' },
  ],
  balls: [
    { resultText: 'Try again!', isPrize: false },
    { resultText: "Empty... better luck next one 😅", isPrize: false },
    { resultText: 'So close! (not really)', isPrize: false },
    { resultText: 'Nice try 😏', isPrize: false },
    { resultText: 'Nope, keep going', isPrize: false },
    { resultText: 'Almost! (jk)', isPrize: false },
    { resultText: 'Empty again, sorry not sorry', isPrize: false },
    { resultText: '🎁 You found it! [edit me: describe the real prize here]', isPrize: true },
  ],
}
```

- [ ] **Step 2: Add placeholders for user-provided media**

```bash
mkdir -p public/audio public/photos
touch public/audio/.gitkeep public/photos/.gitkeep
```

- [ ] **Step 3: Verify types compile**

Run: `npx tsc --noEmit`
Expected: no output, exit code 0.

- [ ] **Step 4: Commit**

```bash
git add lib/content.ts public/audio/.gitkeep public/photos/.gitkeep
git commit -m "feat: add typed content config with sample copy"
```

---

### Task 3: Fonts, root layout, and Landing step

**Files:**
- Modify: `app/layout.tsx`
- Modify: `app/globals.css`
- Modify: `app/page.tsx`
- Create: `components/Experience.tsx`
- Create: `components/Landing.tsx`

**Interfaces:**
- Consumes: `content` from `lib/content.ts` (Task 2).
- Produces: `<Landing partnerName age onPlay onStart />` prop contract, reused by no one else. `Experience` owns `step: 'landing' | 'slideshow' | 'wish' | 'minigame' | 'closing'` state and an `audioRef` — later tasks add branches to its switch and consume `audioRef.current?.play()` indirectly via the callbacks `Experience` passes down.

- [ ] **Step 1: Replace `app/globals.css` with a minimal Tailwind entrypoint**

```css
@import "tailwindcss";

html,
body {
  height: 100%;
}
```

- [ ] **Step 2: Replace `app/layout.tsx` with font setup**

```tsx
import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Happy Birthday',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${inter.variable} font-[family-name:var(--font-inter)]`}>
        {children}
      </body>
    </html>
  )
}
```

- [ ] **Step 3: Create `components/Landing.tsx`**

```tsx
'use client'

type LandingProps = {
  partnerName: string
  age: number
  onPlay: () => void
  onStart: () => void
}

export default function Landing({ partnerName, age, onPlay, onStart }: LandingProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 p-8 text-center text-rose-50">
      <button
        onClick={onPlay}
        aria-label="Play music"
        className="rounded-full bg-amber-400 px-6 py-3 text-lg font-semibold text-rose-950 transition hover:bg-amber-300"
      >
        ▶ Play
      </button>
      <h1 className="font-[family-name:var(--font-playfair)] text-4xl sm:text-5xl">
        {/* ponytail: hardcoded "th" suffix, fine since this is a one-time site for one age */}
        Happy {age}th Birthday, {partnerName}
      </h1>
      <button
        onClick={onStart}
        className="rounded-full bg-amber-400 px-8 py-4 text-lg font-semibold text-rose-950 transition hover:bg-amber-300"
      >
        Start
      </button>
    </div>
  )
}
```

- [ ] **Step 4: Create `components/Experience.tsx`**

```tsx
'use client'

import { useRef, useState } from 'react'
import { content } from '@/lib/content'
import Landing from '@/components/Landing'

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
    </main>
  )
}
```

- [ ] **Step 5: Wire up `app/page.tsx`**

```tsx
import Experience from '@/components/Experience'

export default function Home() {
  return <Experience />
}
```

- [ ] **Step 6: Manually verify in the browser**

Run: `npm run dev`
Open `http://localhost:3000`.
Expected: dark rose gradient background, "Happy 25th Birthday, Jasmine" headline in serif font, a Play button and a Start button both visible and clickable (no console errors from clicking either — the missing `/audio/theme.mp3` file may log a harmless media error, that's expected until the user adds the mp3).

- [ ] **Step 7: Commit**

```bash
git add app/layout.tsx app/globals.css app/page.tsx components/Experience.tsx components/Landing.tsx
git commit -m "feat: add root layout, fonts, and landing step"
```

---

### Task 4: Slideshow step

**Files:**
- Create: `components/Slideshow.tsx`
- Modify: `components/Experience.tsx`

**Interfaces:**
- Consumes: `Slide[]` type from `lib/content.ts` (Task 2).
- Produces: `<Slideshow slides={Slide[]} onDone={() => void} />`.

- [ ] **Step 1: Create `components/Slideshow.tsx`**

```tsx
'use client'

import { useState } from 'react'
import type { Slide } from '@/lib/content'

type SlideshowProps = {
  slides: Slide[]
  onDone: () => void
}

export default function Slideshow({ slides, onDone }: SlideshowProps) {
  const [index, setIndex] = useState(0)
  const slide = slides[index]
  const isLast = index === slides.length - 1

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 p-8 text-center text-rose-50">
      {slide.photoUrl && (
        // ponytail: plain <img>, swap to next/image if LCP/optimization ever matters
        // eslint-disable-next-line @next/next/no-img-element
        <img src={slide.photoUrl} alt="" className="max-h-64 rounded-lg object-cover shadow-lg" />
      )}
      <p className="max-w-md text-xl">{slide.text}</p>
      <div className="flex gap-4">
        <button
          onClick={() => setIndex((i) => i - 1)}
          disabled={index === 0}
          className="rounded-full bg-rose-900 px-6 py-3 font-semibold text-rose-50 transition hover:bg-rose-800 disabled:opacity-30"
        >
          Prev
        </button>
        <button
          onClick={() => (isLast ? onDone() : setIndex((i) => i + 1))}
          className="rounded-full bg-amber-400 px-6 py-3 font-semibold text-rose-950 transition hover:bg-amber-300"
        >
          {isLast ? 'Continue to make a wish' : 'Next'}
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Wire it into `components/Experience.tsx`**

Add the import and the `slideshow` branch:

```tsx
'use client'

import { useRef, useState } from 'react'
import { content } from '@/lib/content'
import Landing from '@/components/Landing'
import Slideshow from '@/components/Slideshow'

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
    </main>
  )
}
```

- [ ] **Step 3: Manually verify in the browser**

Run: `npm run dev` (if not already running)
Open `http://localhost:3000`, click Start.
Expected: first slide text appears, Prev is disabled on slide 1, Next advances through all 5 sample slides, last slide's button reads "Continue to make a wish" and clicking it moves past the slideshow (screen goes blank for now — Task 5 fills it in).

- [ ] **Step 4: Commit**

```bash
git add components/Slideshow.tsx components/Experience.tsx
git commit -m "feat: add slideshow step"
```

---

### Task 5: Make a Wish step with hidden long-press control

**Files:**
- Create: `hooks/useLongPress.ts`
- Create: `components/MakeAWish.tsx`
- Modify: `components/Experience.tsx`

**Interfaces:**
- Produces: `useLongPress(callback: () => void, delayMs?: number) => { onPointerDown: () => void; onPointerUp: () => void; onPointerLeave: () => void }` — spreadable onto any JSX element. `<MakeAWish onAdvance={() => void} />`.

- [ ] **Step 1: Create `hooks/useLongPress.ts`**

```ts
import { useCallback, useRef } from 'react'

export function useLongPress(callback: () => void, delayMs = 2000) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const start = useCallback(() => {
    timerRef.current = setTimeout(callback, delayMs)
  }, [callback, delayMs])

  const clear = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  return {
    onPointerDown: start,
    onPointerUp: clear,
    onPointerLeave: clear,
  }
}
```

- [ ] **Step 2: Create `components/MakeAWish.tsx`**

```tsx
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
```

- [ ] **Step 3: Wire it into `components/Experience.tsx`**

Add the import and the `wish` branch (insert after the `slideshow` block):

```tsx
{step === 'wish' && <MakeAWish onAdvance={() => setStep('minigame')} />}
```

And add `import MakeAWish from '@/components/MakeAWish'` to the import list.

- [ ] **Step 4: Manually verify in the browser**

Run: `npm run dev` (if not already running)
Navigate through to the Make a Wish screen (Start → click through all slides).
Expected: cake emoji visible, no visible "next" button anywhere. A quick tap on the cake does nothing. Pressing and holding on the cake for ~2 seconds advances the screen (it goes blank for now — Task 6 fills it in). Releasing before 2 seconds does not advance.

- [ ] **Step 5: Commit**

```bash
git add hooks/useLongPress.ts components/MakeAWish.tsx components/Experience.tsx
git commit -m "feat: add make-a-wish step with hidden long-press control"
```

---

### Task 6: Minigame step (bowl of balls)

**Files:**
- Create: `lib/shuffleBalls.ts`
- Create: `components/Minigame.tsx`
- Modify: `components/Experience.tsx`

**Interfaces:**
- Consumes: `BallContent` type and `content.balls` from `lib/content.ts` (Task 2).
- Produces: `shuffleBalls(balls: BallContent[]): BallContent[]` (pure, returns a new shuffled array, does not mutate input). `<Minigame balls={BallContent[]} onDone={() => void} />`.

- [ ] **Step 1: Create `lib/shuffleBalls.ts`**

```ts
import type { BallContent } from './content'

export function shuffleBalls(balls: BallContent[]): BallContent[] {
  const copy = [...balls]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}
```

- [ ] **Step 2: Create `components/Minigame.tsx`**

```tsx
'use client'

import { useState } from 'react'
import type { BallContent } from '@/lib/content'
import { shuffleBalls } from '@/lib/shuffleBalls'

type MinigameProps = {
  balls: BallContent[]
  onDone: () => void
}

export default function Minigame({ balls, onDone }: MinigameProps) {
  const [shuffled] = useState(() => {
    const result = shuffleBalls(balls)
    if (process.env.NODE_ENV !== 'production') {
      console.assert(
        result.filter((b) => b.isPrize).length === 1,
        'Minigame: expected exactly one prize ball in content.balls'
      )
    }
    return result
  })
  const [openedIndices, setOpenedIndices] = useState<Set<number>>(new Set())
  const [lastOpened, setLastOpened] = useState<number | null>(null)

  function openBall(i: number) {
    setOpenedIndices((prev) => new Set(prev).add(i))
    setLastOpened(i)
  }

  const foundPrize = lastOpened !== null && shuffled[lastOpened].isPrize

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 p-8 text-center text-rose-50">
      <h2 className="font-[family-name:var(--font-playfair)] text-3xl">Pick a ball!</h2>
      <div className="grid grid-cols-4 gap-4">
        {shuffled.map((ball, i) => (
          <button
            key={i}
            onClick={() => openBall(i)}
            disabled={openedIndices.has(i)}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-400 text-2xl shadow-lg transition hover:scale-105 disabled:opacity-40"
          >
            🔮
          </button>
        ))}
      </div>
      {lastOpened !== null && (
        <div className="rounded-lg bg-rose-900/80 p-6">
          <p className="text-lg">{shuffled[lastOpened].resultText}</p>
        </div>
      )}
      {foundPrize && (
        <button
          onClick={onDone}
          className="rounded-full bg-amber-400 px-6 py-3 font-semibold text-rose-950 transition hover:bg-amber-300"
        >
          Continue
        </button>
      )}
    </div>
  )
}
```

- [ ] **Step 3: Wire it into `components/Experience.tsx`**

Add the import and the `minigame` branch (insert after the `wish` block):

```tsx
{step === 'minigame' && (
  <Minigame balls={content.balls} onDone={() => setStep('closing')} />
)}
```

And add `import Minigame from '@/components/Minigame'` to the import list.

- [ ] **Step 4: Manually verify in the browser**

Run: `npm run dev` (if not already running)
Navigate through to the minigame screen, open the browser devtools console.
Expected: no `console.assert` failure logged (confirms exactly one prize ball). Clicking a ball reveals its text and disables that ball; clicking non-prize balls never shows a Continue button. Clicking every ball eventually reveals the prize ball's text and a Continue button appears; clicking it advances to a blank screen (Task 7 fills it in).

- [ ] **Step 5: Commit**

```bash
git add lib/shuffleBalls.ts components/Minigame.tsx components/Experience.tsx
git commit -m "feat: add prize-ball minigame step"
```

---

### Task 7: Closing step

**Files:**
- Create: `components/Closing.tsx`
- Modify: `components/Experience.tsx`

**Interfaces:**
- Produces: `<Closing partnerName={string} />`.

- [ ] **Step 1: Create `components/Closing.tsx`**

```tsx
type ClosingProps = {
  partnerName: string
}

export default function Closing({ partnerName }: ClosingProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-8 text-center text-rose-50">
      <h2 className="font-[family-name:var(--font-playfair)] text-3xl">
        Thank you for playing my minigame
      </h2>
      <p className="max-w-md text-xl">Happy Birthday, {partnerName}. I love you. 🎉</p>
    </div>
  )
}
```

- [ ] **Step 2: Wire it into `components/Experience.tsx`**

Add the import and the `closing` branch (insert after the `minigame` block):

```tsx
{step === 'closing' && <Closing partnerName={content.partnerName} />}
```

And add `import Closing from '@/components/Closing'` to the import list.

- [ ] **Step 3: Manually verify the full flow end-to-end in the browser**

Run: `npm run dev` (if not already running)
Open `http://localhost:3000` and click through the entire flow: Play → Start → all slides → 2s long-press on the cake → open balls until the prize → Continue.
Expected: every step transitions correctly with no console errors, ending on the closing screen with "Thank you for playing my minigame" and the birthday message.

- [ ] **Step 4: Commit**

```bash
git add components/Closing.tsx components/Experience.tsx
git commit -m "feat: add closing step, complete end-to-end flow"
```

---

### Task 8: README and Vercel deployment

**Files:**
- Create: `README.md`

- [ ] **Step 1: Write `README.md`**

```md
# Birthday Minigame Website

A one-time-use birthday surprise site. See `docs/superpowers/specs/2026-07-15-birthday-minigame-website-design.md` for the full PRD.

## Before the big day

Edit `lib/content.ts`:
- [ ] Set the real slideshow wishes/thank-you messages (and optional photos in `public/photos/`).
- [ ] Set the real ball prize text (the one ball with `isPrize: true`).
- [ ] Drop a background music file at `public/audio/theme.mp3` (or update `audioSrc`).
- [ ] Double check `partnerName` and `age`.

## Local development

\`\`\`bash
npm install
npm run dev
\`\`\`

Open http://localhost:3000.

## Deploy to Vercel

\`\`\`bash
npx vercel
\`\`\`

Follow the prompts (link/create a Vercel project, accept the default Next.js build settings). Vercel gives you a shareable HTTPS link — that's what you send to open the site.
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: add README with content checklist and deploy instructions"
```

---

## Self-Review Notes

- **Spec coverage:** §2.1 Landing (Task 3), §2.2 Slideshow (Task 4), §2.3 Make a Wish + hidden control (Task 5), §2.4 Minigame + shuffle (Task 6), §2.5 Closing (Task 7), §3 content model (Task 2), §4 audio trigger-on-gesture (Task 3), §5 tech stack/deploy (Task 1, Task 8), §6 long-press detail (Task 5), §7 responsive — base layout uses `min-h-screen`/`flex`/`max-w-md`, works at any width; no dedicated task needed since it's not a separate concern from each step's markup. §8 out-of-scope respected (no test framework, no backend). §9 open items captured as the README checklist (Task 8).
- **Type consistency:** `Step` union, `Slide`, `BallContent`, `Content` types match across all tasks; `Experience.tsx`'s full file is re-shown in each task that adds a branch, so no drift between task edits.
