// Everything the site says lives here. Edit this file, not the components.

/**
 * The door opens on 27 September 2026, 00:00 WIB.
 * Written with a +07:00 offset so it still unlocks at midnight in Jakarta
 * even if her phone is set to another timezone.
 */
export const unlockAt = new Date('2026-09-27T00:00:00+07:00')

export type Paper = { text: string; isPrize: boolean }

export const content = {
  name: 'Jasmine',
  fullName: 'Jasmine Adlina',

  // Who the letter is signed by. Swap in whatever she actually calls you.
  from: 'Danu',

  // Background song. It pauses on its own while the video is playing.
  // TODO(dhanu): drop the track at public/audio/valentine-laufey.mp3
  audioSrc: '/audio/valentine-laufey.mp3',
  // Played instead if the track above is missing, so the site is never silent.
  audioFallback: '/audio/happy-birthday-piano.mp3',
  audioTitle: 'Laufey — Valentine',

  // --- Countdown screen (she can open this any time before the date) ---
  gate: {
    line: 'Your Special Day',
    sub: "There's something in here. It only opens on your birthday.",
  },

  // --- "Your Special Day" screen ---
  special: {
    title: 'Your Special Day',
    sub: 'Take your time with this one.',
    cta: 'Open the letter',
  },

  // The letter, in his own words.
  letter: [
    'I am bad at writing things like this, but I wanted to try anyway.',
    'Happy birthday. You achieved so much last year, and you have accomplished just as much again this year.',
    'Seeing you help your parents and lower your ego to save money makes me proud.',
    'Thank you for spending so much time with me and staying by my side through my mood swings.',
    'I hope we keep going together. Just try not to get angry all the time, or someone else might take me away.',
    'Happy birthday. I love you, sayang.',
  ],

  /**
   * Photographs pegged to the cords down the sides of the page. Drop the files
   * in public/photos/ — any that are missing simply hang as blank frames.
   */
  hangingLeft: ['/photos/01.jpg', '/photos/02.jpg', '/photos/03.jpg'],
  hangingRight: ['/photos/04.jpg', '/photos/05.jpg', '/photos/06.jpg'],

  // --- The video: its own screen, right after the letter ---
  // Put the file at public/videos/our-memories.mp4 (keep it under 25 MB — that is
  // the per-file limit on Cloudflare, so compress it if your phone's clip is bigger).
  video: {
    src: '/videos/our-memories.mp4',
    title: 'One more thing',
    blocked: 'Tap to start it.',
    rotate: 'Turn your phone sideways first — this one is widescreen.',
    yes: 'Play',
    after: 'Sorry if the edit is bad. I tried.',
    cta: 'Continue',
    missing: 'video not added yet',
  },

  // --- The second box: it teases the game before the prizes ---
  prizeBox: {
    title: 'Want your present?',
    hint: 'you have to play for it first, hehe',
  },

  // --- Minigame: four face-down papers ---
  prizeIntro: 'Your present is hiding in one of these.',
  prizeNudge: 'pick one',

  // The two real prizes, found in this order.
  prizes: [
    'Ask for any gift you want. Anything, I mean it.',
    'Dinner at any restaurant you pick.',
  ],

  // Shown on a miss. Keep them teasing, not mean — the point is the eye-roll.
  teases: [
    'Empty.',
    'Empty again.',
    'Nope. Not this one either.',
    'Wrong paper, love.',
    'So close. (No, it was not.)',
    'Still nothing. Keep going.',
  ],

  prizeFound: 'Found one. One more in there.',

  // Shown once she has uncovered both.
  win: {
    title: 'Congratulations',
    line: 'You got both of them. Tell me what you want, and where you want to eat.',
  },

  // --- One last question before the goodbye ---
  mood: {
    question: 'How are you feeling today?',
    sub: 'Only one of these is allowed on your birthday.',
    happy: 'happy',
    sad: 'gloomy',
    hint: 'go on, pick',
    confirm: "Are you sure you're happy?",
    confirmSub: 'I want to hear it properly.',
    yes: 'Yes',
    no: 'No',
    chase: 'catch it first, hehe',
    caught: 'alright, I believe you',
    tease: 'that one is not for you',
  },

  closing: {
    title: "That's all of it.",
    line: 'Thank you for going all the way to the last page. Happy birthday, Jasmine.',
    credit: 'Created with love by Syahrial Danu, for Jasmine Adlina.',
  },

  // --- Button and control labels ---
  ui: {
    next: 'Next',
    continue: 'Continue',
    skip: 'skip',
    toGame: 'One last little game',
    paper: 'Paper',
    shuffling: 'shuffling...',
  },

  dateline: '27 September 2026',

  units: [
    ['days', 'days'],
    ['hours', 'hours'],
    ['minutes', 'minutes'],
    ['seconds', 'seconds'],
  ] as const,
}
