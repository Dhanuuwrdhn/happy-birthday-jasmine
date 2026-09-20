# happy-birthday-jasmine

A birthday site for Jasmine Adlina. It stays locked until 27 September 2026, then
opens as a paper letter set: a wrapped gift, a handwritten note, a letter that types
itself out, photographs, and a small game hiding two real presents.

Created with love by Syahrial Danu, for Jasmine Adlina.

## Running it

```bash
npm install
npm run dev      # http://localhost:3000
npm run check    # unlock date + prize logic self-check
npm run build
```

Add `?preview=1` to the URL to skip the countdown while testing.

## What to fill in

Everything the site says lives in `lib/content.ts`.

| What | Where |
| --- | --- |
| The letter | `content.letter` — replace every `[bracket]` with what actually happened |
| Photos | `public/photos/01.jpg` … `09.jpg`, listed in `content.slides` and `content.gallery` |
| Song | `public/audio/happy-birthday-pamungkas.mp3` (Pamungkas — Happy Birthday) |
| The two prizes | `content.prizes` |
| Unlock date | `unlockAt` in `lib/content.ts` |

## How it works

- **The gate** (`components/Gate.tsx`) reads the browser clock and renders the site
  only once 27 September 2026 00:00 WIB has passed.
- **The game** (`components/Minigame.tsx`) is rigged on purpose: picks miss for a
  random two to four tries before a prize appears, and the slips are swept around
  after every pick. It always ends with both presents found.
- **The look** is one idea carried through: every step is a different piece of
  paper — a sealed envelope, a folded note, ruled letter paper, an album page,
  folded slips — with a jasmine sprig as the recurring mark.

Built with Next.js, Tailwind, Cormorant Garamond and Caveat.
