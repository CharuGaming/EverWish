// ─────────────────────────────────────────────────────────────
//  mockData.js  –  Demo siteData for each template preview
//  Shaped exactly like toComponentData() output so DemoPage
//  can pass it straight into ClientPage template components.
// ─────────────────────────────────────────────────────────────

const UNSPLASH = {
  couple1: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80',
  couple2: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
  couple3: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80',
  couple4: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80',
  couple5: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80',
  couple6: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80',
  bday1:   'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80',
  bday2:   'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=800&q=80',
  bday3:   'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80',
};

// ── Shared Valentine base ─────────────────────────────────────
const valentineBase = {
  isActive: true,
  category: 'valentine',
  coupleName: 'Sofia & Liam',
  coupleEmoji: '💌',
  heroSubtitle: 'A little corner of the internet, made just for you 💕',
  heroTitle: "Happy Valentine's Day",
  heroDate: 'February 14 · Forever',
  loveLetterText:
    'Every day with you feels like the beginning of something beautiful. You are my favourite adventure, my safe harbour, and the reason I smile for no reason at all.',
  lockScreenPrompt: 'Tap until the screen turns red 💕',
  valentineMessage: "Happy Valentine's Day, Sofia! 💕",
  timelineDates: { startDate: '2022', endDate: '2026' },
  heroImageUrl: UNSPLASH.couple1,
  music: { audioUrl: '', thumbnailUrl: '', isEnabled: false },
  gift: {
    recipient: 'Sofia',
    message: 'Every flower in the world reminded me of you.',
    bouquetUrl: UNSPLASH.couple2,
  },
  milestones: [
    { id: 1, title: 'The Day We Met', date: 'March 12, 2022', description: 'A random Tuesday that changed everything.', imageUrl: UNSPLASH.couple2, alignment: 'left', rotate: '-rotate-2' },
    { id: 2, title: 'Our First Date', date: 'April 3, 2022', description: 'Coffee that somehow lasted six hours.', imageUrl: UNSPLASH.couple3, alignment: 'right', rotate: 'rotate-2' },
    { id: 3, title: 'First Trip Together', date: 'July 18, 2022', description: 'Getting lost in a city we didn\'t know. Best kind of lost.', imageUrl: UNSPLASH.couple4, alignment: 'left', rotate: '-rotate-1' },
  ],
  gallery: {
    centerImage: UNSPLASH.couple1,
    centerCaption: 'Us, always ❤️',
    supporting: [
      { id: 1, url: UNSPLASH.couple2, caption: 'The beginning' },
      { id: 2, url: UNSPLASH.couple3, caption: 'First date' },
      { id: 3, url: UNSPLASH.couple4, caption: 'Adventures' },
      { id: 4, url: UNSPLASH.couple5, caption: 'Made it official' },
      { id: 5, url: UNSPLASH.couple6, caption: 'One year ✨' },
    ],
  },
  valentine: {
    matchImages: [UNSPLASH.couple1, UNSPLASH.couple2, UNSPLASH.couple3, UNSPLASH.couple4, UNSPLASH.couple5],
    reasons: ['You make me laugh every day 😄', 'Your kindness is boundless 💛', 'You always know what to say 🌸', 'You make even Mondays good ☀️', 'You are home 🏡'],
    scratchMemories: [
      { id: 0, imageUrl: UNSPLASH.couple2, caption: 'Where it all began' },
      { id: 1, imageUrl: UNSPLASH.couple3, caption: 'Our first date' },
      { id: 2, imageUrl: UNSPLASH.couple4, caption: 'Getting lost together' },
    ],
  },
  proposal: {
    proposalText: 'Will you be my Valentine forever? 💕',
    loveLetter: 'From the first moment I saw you, I knew you were someone special. Every day with you is a gift I never want to stop unwrapping.',
    giftImageUrl: UNSPLASH.couple5,
    giftMessage: 'You deserve all the love in the world 💖',
    activities: ['Movies 🎬', 'Dinner 🍽️', 'Picnic 🌸', 'Stargazing ✨'],
    foods: ['Pizza 🍕', 'Sushi 🍣', 'Chocolate 🍫', 'Ice Cream 🍦'],
    scratchGallery: [
      { id: 0, imageUrl: UNSPLASH.couple2, caption: 'Memory #1' },
      { id: 1, imageUrl: UNSPLASH.couple4, caption: 'Memory #2' },
    ],
  },
  thingsToDo: [
    { id: 0, title: 'Cook together', description: 'Pick a new recipe and make it from scratch.', imageUrl: UNSPLASH.couple3, completed: false },
    { id: 1, title: 'Sunset walk', description: 'Find the perfect spot to watch the sun go down.', imageUrl: UNSPLASH.couple4, completed: false },
  ],
  themeColors: {
    polaroid:  { primary: '#e11d48', background: '#fff0f5' },
    modern:    { primary: '#e11d48', background: '#f7f5f0' },
    valentine: { primary: '#e11d48', background: '#fff0f5', cardColor: '#ffccd5' },
    proposal:  { primary: '#9333ea', background: '#fdf2f8', cardColor: '#c084fc' },
    custom:    { primary: '#e11d48', background: '#fff0f5', cardColor: '#ffccd5' },
    bday1: { primary: '#f59e0b', background: '#fffbeb' },
    bday2: { primary: '#3b82f6', background: '#eff6ff' },
    bday3: { primary: '#10b981', background: '#ecfdf5' },
    bday4: { primary: '#8b5cf6', background: '#f5f3ff' },
  },
  customModules: {
    lockscreenType: 'tap', showMilestones: true, showScratchGallery: true,
    showWhyILoveYou: true, showDatePlanner: false, showVirtualGift: false,
  },
  birthday: { recipientAge: null, birthdayMessage: '', balloonColor: '#e11d48' },
  loveLock: null, reasonsJar: [], timeCapsule: null,
  unlockTime: null, voiceNoteUrl: '', scratchPrize: '',
  yearInReview: [], virtualGift: null, birthdayGallery: [],
};

// ── Shared Birthday base ──────────────────────────────────────
const birthdayBase = {
  isActive: true,
  category: 'birthday',
  coupleName: 'Happy Birthday, Jamie! 🎂',
  coupleEmoji: '🎉',
  heroSubtitle: 'Today is all about YOU! 🎈',
  heroDate: 'May 29 · Your Special Day',
  loveLetterText: 'Wishing you a day as bright and beautiful as you are!',
  lockScreenPrompt: 'Tap to reveal your surprise! 🎁',
  valentineMessage: 'Happy Birthday Jamie! 🎂',
  timelineDates: { startDate: '2000', endDate: '2026' },
  heroImageUrl: UNSPLASH.bday1,
  music: { audioUrl: '', thumbnailUrl: '', isEnabled: false },
  gift: { recipient: 'Jamie', message: 'A little gift with a lot of love!', bouquetUrl: UNSPLASH.bday2 },
  milestones: [],
  gallery: {
    centerImage: UNSPLASH.bday1,
    centerCaption: 'Always smiling 🌟',
    supporting: [
      { id: 1, url: UNSPLASH.bday2, caption: 'Party time!' },
      { id: 2, url: UNSPLASH.bday3, caption: 'Cake o\'clock 🍰' },
      { id: 3, url: UNSPLASH.couple4, caption: 'Good vibes' },
    ],
  },
  valentine: { matchImages: [], reasons: [], scratchMemories: [] },
  proposal: { proposalText: '', loveLetter: '', giftImageUrl: '', giftMessage: '', activities: [], foods: [], scratchGallery: [] },
  thingsToDo: [],
  themeColors: {
    polaroid:  { primary: '#e11d48', background: '#fff0f5' },
    modern:    { primary: '#e11d48', background: '#f7f5f0' },
    valentine: { primary: '#e11d48', background: '#fff0f5', cardColor: '#ffccd5' },
    proposal:  { primary: '#9333ea', background: '#fdf2f8', cardColor: '#c084fc' },
    custom:    { primary: '#e11d48', background: '#fff0f5', cardColor: '#ffccd5' },
    bday1: { primary: '#f59e0b', background: '#fffbeb' },
    bday2: { primary: '#3b82f6', background: '#eff6ff' },
    bday3: { primary: '#10b981', background: '#ecfdf5' },
    bday4: { primary: '#8b5cf6', background: '#f5f3ff' },
  },
  customModules: {
    lockscreenType: 'tap', showMilestones: false, showScratchGallery: false,
    showWhyILoveYou: false, showDatePlanner: false, showVirtualGift: false,
  },
  birthday: {
    recipientAge: 25,
    birthdayMessage: 'Wishing you the happiest of birthdays, Jamie! May this year be your most amazing yet! 🥳🎊',
    balloonColor: '#e11d48',
    birthDate: null,
  },
  loveLock: null, reasonsJar: [], timeCapsule: null,
  unlockTime: null, voiceNoteUrl: '', scratchPrize: 'A surprise coffee date ☕',
  yearInReview: [
    { emoji: '✈️', label: 'Trips taken', value: '3' },
    { emoji: '📚', label: 'Books read', value: '12' },
    { emoji: '🌟', label: 'Memories made', value: '∞' },
  ],
  virtualGift: { imageUrl: UNSPLASH.bday3, message: 'A little something to make you smile! 🎁' },
  birthdayGallery: [
    { id: 0, url: UNSPLASH.bday1, caption: 'Always celebrating 🎉' },
    { id: 1, url: UNSPLASH.bday2, caption: 'Birthday squad 🎈' },
    { id: 2, url: UNSPLASH.bday3, caption: 'Cake time! 🍰' },
    { id: 3, url: UNSPLASH.couple3, caption: 'Good times 🌟' },
  ],
};

// ── Template-specific mock data ───────────────────────────────
export const MOCK_DATA = {
  // Valentine templates
  v1: { ...valentineBase, templateType: 'polaroid' },
  v2: { ...valentineBase, templateType: 'modern' },
  v3: { ...valentineBase, templateType: 'valentine' },
  v4: { ...valentineBase, templateType: 'proposal' },

  v5: {
    ...valentineBase,
    templateType: 'cinematic',
    category: 'valentine',
    cinematic: {
      introVideoUrl: '',
      bgVideoUrl: '',
      heroImageUrl: UNSPLASH.couple1,
      songLyrics: `I found a love, for me\nDarling just dive right in, and follow my lead\nWell I found a girl, beautiful and sweet\nOh I never knew you were the someone waiting for me...`,
      reasons: [
        'You make ordinary days extraordinary ✨',
        'Your laugh is my favourite sound 😂',
        "You believe in me when I don't 💛",
        'You make every place feel like home 🏡',
        'Adventure is better with you 🌍',
        'You are my safe place 🤍',
        'Your kindness is boundless 🌟',
        'You always know what to say 🌸',
        'You make even Mondays good ☀️',
      ],
      startDate: '2022-03-12',
    },
  },

  // Birthday templates
  b1: { ...birthdayBase, templateType: 'bday1' },
  b2: { ...birthdayBase, templateType: 'bday2' },
  b3: { ...birthdayBase, templateType: 'bday3' },
  b4: { ...birthdayBase, templateType: 'bday4' },
  b5: { 
    ...birthdayBase, 
    templateType: 'bday5',
    category: 'birthday',
    cinematicBirthday: {
      introVideoUrl: '',
      bgVideoUrl: '',
      giftImageUrl: UNSPLASH.bday2,
      giftRevealText: 'A special gift just for you! 🎁',
      yearRecapText: 'This year has been amazing, and it is all because of you.',
      birthdayBucketList: [
        'More road trips 🚗',
        'Late night ice cream 🍦',
        'Learn a new skill together 🎸',
        'Binge-watch our favorite shows 📺'
      ],
      songAudioUrl: '',
      songLyrics: 'Happy birthday to you,\nHappy birthday to you...',
      galleryImages: [
        UNSPLASH.bday1,
        UNSPLASH.bday2,
        UNSPLASH.bday3,
        UNSPLASH.couple1,
        UNSPLASH.couple2
      ],
      nickname: 'Babe',
      heroPhotos: [
        UNSPLASH.bday1,
        UNSPLASH.bday2,
        UNSPLASH.bday3
      ],
      useInteractiveHero: true,
      loveLetterContent: "Dear Babe,\n\nHappy Birthday to the most amazing person in my life! You make every single moment brighter, and I am so grateful for all the love and laughter we share.\n\nHere's to making many more beautiful memories together.\n\nWith all my love,\nAlways 💛"
    }
  },
  b6: {
    ...birthdayBase,
    templateType: 'bday6',
    category: 'birthday',
    passcode: {
      title: "Enter Code",
      hint: "Hint: The day you finally said 'YES' to me.",
      targetPasscode: "0214",
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4"
    },
    bday6: {
      heroBadge: "🎂 Happy Birthday",
      heroTitle: "Happy Birthday, Jamie!",
      heroSubtitle: "Today is all about you ✨",
      scrollText: "Scroll to explore",
      giftSectionTitle: "A Gift For You",
      giftSectionSubtitle: "Something special, just for you 🎁",
      giftUnwrapText: "Tap to Unwrap 🎀",
      yearRecapIcon: "🌟",
      yearRecapTitle: "Your Year in Review",
      bucketListIcon: "✅",
      bucketListTitle: "Birthday Bucket List",
      bucketListSubtitle: "Things to do today!",
      songSectionTitle: "Your Birthday Song",
      songSectionSubtitle: "Play it loud 🎵",
      gallerySectionIcon: "💝",
      gallerySectionTitle: "Our Memories",
      gallerySectionSubtitle: "Tap a photo to relive the moment",
      footerText: "Made with love · EverWish",
      noMusicText: "No music uploaded yet"
    },
    cinematicBirthday: {
      giftImageUrl: UNSPLASH.bday2,
      giftRevealText: 'A special gift just for you! 🎁',
      yearRecapText: 'This year has been amazing, and it is all because of you.',
      birthdayBucketList: [
        'More road trips 🚗',
        'Late night ice cream 🍦'
      ],
      songAudioUrl: '',
      songLyrics: 'Happy birthday to you...',
      galleryImages: [UNSPLASH.bday1, UNSPLASH.bday2, UNSPLASH.bday3],
      loveLetterContent: "Dear Jamie,\nHappy Birthday!"
    }
  },
};

// WhatsApp number (single source of truth shared with Storefront)
export const WHATSAPP_NUMBER = '94XXXXXXXXX';
