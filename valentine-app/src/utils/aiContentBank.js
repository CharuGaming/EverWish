/**
 * aiContentBank.js
 * ─────────────────────────────────────────────────────────────────
 * Contextual content generation for EverWish Admin Panel fields.
 * Easily swap `pick()` calls with an API call to OpenAI / Gemini later.
 */

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

// ── Content Banks ─────────────────────────────────────────────────

const DATES = [
  'February 14 · Forever',
  'Since Day One ✨',
  'Always & Forever',
  'Since the First Hello',
  'Every Day Is Our Day',
  'Valentines · Eternally',
  'From That Day Forward',
  'A Date to Remember',
  'Day 1 · Infinity',
  'Not Just Today — Always',
];

const SUBTITLES = [
  'A little corner of the internet, just for us 💕',
  'To a lifetime of memories…',
  'Because you deserve the whole world.',
  'Our love, captured in a moment.',
  'Crafted with love, just for you ❤️',
  'A surprise, from my heart to yours.',
  'Because every love story deserves to be told.',
  'For the person who makes everything brighter.',
  'Something special, for someone irreplaceable.',
  'Where every pixel is a piece of my heart.',
  'This one is all yours 🌸',
  'Dedicated entirely to you.',
];

const LOVE_LETTERS = [
  `From the very first moment I saw you, I knew something had shifted in my world. You bring a kind of light that I never knew I was missing. Every day with you feels like the beginning of something beautiful, and I never want it to end.`,

  `I never believed in perfect moments until you came along. You turned ordinary Tuesday evenings into something I look forward to all week. Thank you for being my favorite person — today, tomorrow, and in every version of my life that comes after this.`,

  `There are a thousand ways I try to tell you how much you mean to me, but words always feel a little too small. So instead, I made this — a small digital corner of the world that's entirely yours, a reminder that you are deeply, completely, endlessly loved.`,

  `You are the song I didn't know I needed until I heard it. The chapter I want to reread forever. Loving you is the easiest, most natural thing I have ever done, and I would choose you in every universe, in every lifetime, without hesitation.`,

  `What we have is not a love story I could have written — it's better than anything I ever imagined. You are home to me. The place I run to and the place I always want to return. Thank you for being exactly who you are.`,

  `I find you in the little things — the way you laugh, the way you make ordinary moments feel precious. I am grateful every single day that the universe conspired to bring us together. Here's to us, to every memory we've made, and to every one still to come.`,
];

const BIRTHDAY_WISHES = [
  `Happy Birthday to someone who makes every room brighter just by walking into it! Today is all about you — I hope it's as incredible as you are. 🎂✨`,

  `Another year of being absolutely amazing! Wishing you a day filled with joy, laughter, and all the things that make you smile. Here's to YOU! 🎉`,

  `On your special day, I just want to remind you how loved and appreciated you are. You bring so much light into my world — today, it's your turn to shine. 🌟`,

  `Happy Birthday! You deserve all the cake, all the confetti, and every single good thing life has to offer. Wishing you a year even better than the last.`,

  `To the most wonderful person I know — Happy Birthday! May today be just the beginning of an incredible year filled with adventure, laughter, and magic. 🎈`,
];

const MILESTONE_DESCRIPTIONS = [
  'The day everything changed — in the best way possible.',
  'A memory I will treasure for the rest of my life.',
  'One of those moments that feels like it was made just for us.',
  'Where it all began — and I would go back in a heartbeat.',
  'A perfect day, with the most perfect person.',
  'Laughing until we couldn\'t breathe. Just us.',
  'The adventure that reminded us of what matters most.',
];

const CAPTION_TEXTS = [
  'Us, always ❤️',
  'My favorite memory',
  'Here we are 🌸',
  'Together, this is everything',
  'Just the two of us',
  'A moment frozen in time',
  'Our little world 💕',
];

const LOCK_PROMPTS = [
  'Tap to unlock a surprise 💝',
  'Keep tapping — something special awaits!',
  'Fill the heart to open your gift ❤️',
  'Tap until the love overflows…',
  'Ready? Tap away! 💫',
];

const REASONS = [
  'The way you laugh makes everything better',
  'You always know exactly what to say',
  'Your kindness is absolutely limitless',
  'The warmth you bring to every room',
  'You make the ordinary feel extraordinary',
  'Your smile is my favorite thing in the world',
  'You never give up, even when things are hard',
  'The way you see the good in everyone',
  'You make me a better version of myself',
  'Every adventure is better with you',
  'You remember the little things that matter',
  'Your laugh is genuinely contagious 😄',
];

const SONG_LYRICS = [
  `All of me loves all of you\nAll your curves and all your edges\nAll your perfect imperfections\nGive your all to me, I'll give my all to you`,

  `I found a love for me\nDarling just dive right in and follow my lead\nWell I found a girl beautiful and sweet\nI never knew you were the someone waiting for me`,

  `And I'll be loving you 'til we're 70\nAnd baby my heart could still fall as hard at 23\nAnd I'm thinking 'bout how people fall in love in mysterious ways\nMaybe just the touch of a hand`,
];

// ── Main Export ───────────────────────────────────────────────────

/**
 * generateRandomContent(fieldType, theme?)
 * Returns a randomly selected string for the given admin field type.
 * @param {'date'|'subtitle'|'loveLetter'|'birthdayWish'|'milestoneDesc'|'caption'|'lockPrompt'|'reason'|'songLyrics'} fieldType
 * @param {'valentine'|'birthday'|string} [theme]
 */
export function generateRandomContent(fieldType, theme = 'valentine') {
  switch (fieldType) {
    case 'date':          return pick(DATES);
    case 'subtitle':      return pick(SUBTITLES);
    case 'loveLetter':    return pick(theme === 'birthday' ? BIRTHDAY_WISHES : LOVE_LETTERS);
    case 'birthdayWish':  return pick(BIRTHDAY_WISHES);
    case 'milestoneDesc': return pick(MILESTONE_DESCRIPTIONS);
    case 'caption':       return pick(CAPTION_TEXTS);
    case 'lockPrompt':    return pick(LOCK_PROMPTS);
    case 'reason':        return pick(REASONS);
    case 'songLyrics':    return pick(SONG_LYRICS);
    default:              return pick(SUBTITLES);
  }
}
