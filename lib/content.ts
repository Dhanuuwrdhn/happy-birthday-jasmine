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
