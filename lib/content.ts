// Everything the site says lives here. Edit this file, not the components.

/**
 * The door opens on 27 September 2026, 00:00 WIB.
 * Written with a +07:00 offset so it still unlocks at midnight in Jakarta
 * even if her phone is set to another timezone.
 */
export const unlockAt = new Date('2026-09-27T00:00:00+07:00')

export type Slide = { photo: string; caption: string }
export type Photo = { src: string; caption?: string }
export type Paper = { text: string; isPrize: boolean }

export const content = {
  name: 'Jasmine',
  fullName: 'Jasmine Adlina',

  // Who the letter is signed by. Swap in whatever she actually calls you.
  from: 'Danu',

  /**
   * Background song: Pamungkas - Happy Birthday.
   * TODO(dhanu): drop the file yourself at public/audio/happy-birthday-pamungkas.mp3
   * (I can't download the song for you — it's copyrighted).
   */
  audioSrc: '/audio/happy-birthday-pamungkas.mp3',
  audioTitle: 'Pamungkas - Happy Birthday',

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

  memoriesTitle: 'Our Memories',
  galleryTitle: "The rest that didn't fit above",

  /**
   * The letter. One string = one paragraph.
   * Write specific moments, not general compliments — that's what makes it read honest.
   * TODO(dhanu): replace every [bracket] with what actually happened between you two.
   */
  letter: [
    "I'm not good at writing, so sorry if this goes in circles.",
    'I still remember [where you two first met]. You were [a small thing she did that day]. I remember something that trivial, and it still hasn\'t faded.',
    'What I\'m most thankful for isn\'t the big things. It\'s [a small habit of hers you love] — something you probably don\'t even notice you do.',
    'This year we went through [the hard thing you got through together]. And you stayed. That\'s not a small thing, and I don\'t want to treat it like it was.',
    'Next year I want us to [one concrete thing you want to do with her]. Actually do it, not just talk about it.',
    'Happy birthday. I love you.',
  ],

  // --- Slideshow: photo + caption, one at a time ---
  // Put the files in public/photos/
  slides: [
    { photo: '/photos/01.jpg', caption: '[when, where, why this photo]' },
    { photo: '/photos/02.jpg', caption: '[the story behind this one]' },
    { photo: '/photos/03.jpg', caption: '[the story behind this one]' },
  ] satisfies Slide[],

  // --- Gallery: a grid of photos, no long stories ---
  gallery: [
    { src: '/photos/04.jpg' },
    { src: '/photos/05.jpg' },
    { src: '/photos/06.jpg' },
    { src: '/photos/07.jpg' },
    { src: '/photos/08.jpg' },
    { src: '/photos/09.jpg' },
  ] satisfies Photo[],

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

  closing: {
    title: "That's all of it.",
    line: 'Thank you for going all the way to the last page. Happy birthday, Jasmine.',
    credit: 'Created with love by Syahrial Danu, for Jasmine Adlina.',
  },

  // --- Button and control labels ---
  ui: {
    next: 'Next',
    prev: 'Previous',
    continue: 'Continue',
    skip: 'skip',
    toPhotos: 'There are photos too',
    toGame: 'One last little game',
    soundOn: 'sound on',
    soundOff: 'sound off',
    photoMissing: 'photo not added yet',
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
