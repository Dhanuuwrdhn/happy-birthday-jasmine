# PRD: Birthday Minigame Website

**Date:** 2026-07-15
**Target event:** September 27, 2026
**Purpose:** A personal birthday surprise website for a partner — a linear experience (landing → wishes slideshow → make a wish → prize-ball minigame → closing) run live together during the birthday moment.

## 1. Summary

A single-page web app (Next.js) that guides the partner through a linear sequence of steps, ending in a minigame where she opens balls containing prizes. The "make a wish" moment is synced live — only the phone owner (you) can advance to the next step, since that's when the real gift is handed over in person.

All on-site copy is in **English**. No backend, database, or multi-user support — used once, live, together.

## 2. User flow

```
Landing → Slideshow → Make a Wish → Minigame (Bowl of Balls) → Closing
```

Implemented as a **single-page client-side state machine** (not multi-route Next.js), so that:
- The browser back button can't break the surprise flow.
- Background audio keeps playing without remounting when steps change.

### 2.1 Landing
- **Play** button.
- Text: `Happy Birthday 25 [Partner Name]`.
- **Start** button.
- Clicking Play/Start = first user gesture → also used to trigger `audio.play()` (avoids the browser autoplay block).

### 2.2 Slideshow — Birthday Wishes
- A series of slides with birthday wishes, thank-you messages, etc.
- Each slide: text + optional photo.
- Next/Prev navigation (swipe on mobile, buttons on desktop).
- Last slide: **"Continue to make a wish"** button.

### 2.3 Make a Wish
- Cake with a lit candle + instruction "close your eyes and make a wish".
- **This is a live moment**: you hand over the real gift in person while she has her eyes closed.
- The page has **no visible/normal continue button**. Advancing to the minigame is triggered by a **~2-second long-press** on the candle/cake area. A normal tap does nothing.
- Reason: prevents her from accidentally/curiously skipping ahead before the real gift moment is done. Control stays entirely in your hands.

### 2.4 Minigame — Bowl of Balls
- Shows a bowl with 6–9 balls.
- Clicking a ball → ball-opening animation → reveals a paper with text inside.
- Ball contents (data-driven, see §3):
  - Mostly: "try again", "empty", other playful/teasing messages.
  - 1 ball: the real prize (e.g. gift name/clue/special message).
- The mapping of ball → content is **shuffled once at session start** (on component mount), then stays fixed for the rest of the session (not re-shuffled on every render).
- Opened balls are marked "opened" so they can't be re-clicked for the same animation (optional polish, not a hard requirement).

### 2.5 Closing
- Closing text: "Thank you for playing my minigame", one more happy birthday wish.

## 3. Content data model

All editable content (name, text, photos, prizes) lives in **one config file**, separate from UI components:

```ts
// content.ts
export const content = {
  partnerName: string,
  age: number,
  audioSrc: string,          // path to mp3 file, place in /public
  slides: Array<{
    text: string,
    photoUrl?: string,       // optional
  }>,
  balls: Array<{
    resultText: string,
    isPrize: boolean,        // true for exactly 1 ball
  }>,
}
```

Changing wording/photos/prizes only requires editing this file, no component logic touched.

## 4. Audio

- Background music, mp3 file provided by the user, placed in `/public`.
- **No autoplay on page load** — `play()` fires only after clicking Play/Start (user gesture), which safely sidesteps browser autoplay policy with no extra workaround needed.

## 5. Tech stack & deployment

- **Next.js (App Router)**, React, TypeScript.
- Styling & animation: use the `frontend-design` skill during implementation for visual direction (color theme, typography, animation) — not decided in this PRD, to be settled during visual design.
- Latest API/library reference during implementation: use `context7`.
- No backend/database. All state lives on the client (`useState`/`useReducer` for step + ball shuffle result).
- Deploy: **Vercel** (free tier), zero-config fit for Next.js.

## 6. Hidden control mechanism (technical detail)

- Implementation: `onPointerDown` starts a timer, `onPointerUp`/`onPointerLeave` clears the timer before ~2000ms → no trigger. Timer completing without release → triggers `advance()`.
- No backend/multi-device sync needed — one device, one secret gesture is enough, since she has her eyes closed during this moment.

## 7. Responsive design

- Must be responsive on mobile + desktop (standard Tailwind/CSS breakpoints, details decided during implementation).
- Priority: smooth experience on phone (most likely opened via a WhatsApp link on mobile), but must not break on laptop either.

## 8. Out of scope

- No backend, database, authentication, or multi-user support.
- No cross-session persistence — refreshing the page restarts at landing (acceptable, since it's used once, live).
- No full automated test suite — for non-trivial logic (one-time ball shuffle, long-press timer) a single lightweight manual sanity check during implementation is enough, not a full test framework (personal one-off project scope).

## 9. Open items (to be filled in by the user before/during implementation)

- Final text for each slideshow slide (wishes, thank-you, etc.).
- Partner's name & age for the landing page.
- Text content for each ball (mostly "try again"/"empty"/playful, 1 real prize).
- Photo files per slide (optional) & the background music mp3 file.
- Visual direction/color theme (decided together when using the `frontend-design` skill).
