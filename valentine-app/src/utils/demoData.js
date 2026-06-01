import { optimizeCloudinaryUrl } from './imageHelpers';

// Premium Unsplash URLs for Valentines/Romantic theme
const romanticImages = [
  'https://images.unsplash.com/photo-1518199266791-5375a83164ba?q=80&w=2940&auto=format&fit=crop', // Couple silhouette at sunset
  'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=2787&auto=format&fit=crop', // Hands holding flowers
  'https://images.unsplash.com/photo-1494774157365-9e04c6720e47?q=80&w=2940&auto=format&fit=crop', // Romantic coffee and flowers
  'https://images.unsplash.com/photo-1518568814500-bf0f8d125f46?q=80&w=2787&auto=format&fit=crop', // Polaroid style couple
  'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=2940&auto=format&fit=crop', // Abstract romance
];

// Premium Unsplash URLs for Birthday/Celebration theme
const birthdayImages = [
  'https://images.unsplash.com/photo-1530103862676-de8892b07439?q=80&w=2940&auto=format&fit=crop', // Balloons and confetti
  'https://images.unsplash.com/photo-1464349153735-7db50ed83c84?q=80&w=2966&auto=format&fit=crop', // Cake with sparklers
  'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?q=80&w=2940&auto=format&fit=crop', // Beautiful gift box
  'https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=2940&auto=format&fit=crop', // Celebration lights
  'https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?q=80&w=2940&auto=format&fit=crop', // Party atmosphere
];

// Free high-quality acoustic/romantic background track (from a royalty-free source)
const acousticAudioUrl = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

export const PREMIUM_DEMO_DATA = {
  valentine: {
    heroImageUrl: optimizeCloudinaryUrl(romanticImages[0], 1200),
    galleryImages: romanticImages.map(url => ({
      url: optimizeCloudinaryUrl(url, 800),
      caption: 'A beautiful memory ✨'
    })),
    giftImageUrl: optimizeCloudinaryUrl('https://images.unsplash.com/photo-1583847268964-b28e5033c5e8?q=80&w=2862&auto=format&fit=crop', 800), // Roses
    music: {
      audioUrl: acousticAudioUrl,
      isEnabled: true,
      thumbnailUrl: optimizeCloudinaryUrl(romanticImages[2], 400),
    },
    songLyrics: "And I'd choose you;\nin a hundred lifetimes,\nin a hundred worlds,\nin any version of reality,\nI'd find you and I'd choose you. ✨",
    reasons: [
      "The way you always know how to make me smile",
      "Your endless compassion for others",
      "How we can talk for hours about nothing",
      "Your beautiful laugh that lights up any room",
      "The way you support my wildest dreams"
    ],
  },
  birthday: {
    heroImageUrl: optimizeCloudinaryUrl(birthdayImages[0], 1200),
    galleryImages: birthdayImages.map(url => ({
      url: optimizeCloudinaryUrl(url, 800),
      caption: 'Unforgettable moments 🎈'
    })),
    giftImageUrl: optimizeCloudinaryUrl(birthdayImages[2], 800),
    music: {
      audioUrl: acousticAudioUrl,
      isEnabled: true,
      thumbnailUrl: optimizeCloudinaryUrl(birthdayImages[1], 400),
    },
    songLyrics: "Another trip around the sun,\nAnother year of endless fun.\nMay all your wishes come true,\nHappy birthday to you! 🎂",
    yearRecapText: "This past year has been nothing short of spectacular. From spontaneous road trips to quiet evenings laughing until we cried, every moment with you has been a gift. I can't wait to see what this next chapter brings.",
    birthdayBucketList: [
      "Travel to that place we always talk about ✈️",
      "Try a new adrenaline-pumping activity 🎢",
      "Have a movie marathon weekend 🍿",
      "Eat at that fancy restaurant downtown 🍽️"
    ]
  }
};

/**
 * Helper to deeply merge or fallback missing properties to demo data.
 * Usage: const data = mergeDemoData(actualData, 'birthday', isDemo);
 */
export function mergeDemoData(siteData, theme = 'valentine', isDemo = false) {
  if (!isDemo) return siteData;
  
  const demoFallback = PREMIUM_DEMO_DATA[theme];
  if (!demoFallback) return siteData;

  // Clone siteData to avoid mutating the original
  const merged = { ...siteData };

  // Helper to check if an array is empty or missing
  const isArrayEmpty = (arr) => !arr || (Array.isArray(arr) && arr.length === 0);
  // Helper to check if string is empty
  const isStringEmpty = (str) => !str || str.trim() === '';

  // Merge specific fields based on theme logic
  if (theme === 'birthday' && merged.cinematicBirthday) {
    if (isStringEmpty(merged.cinematicBirthday.giftImageUrl)) merged.cinematicBirthday.giftImageUrl = demoFallback.giftImageUrl;
    if (isArrayEmpty(merged.cinematicBirthday.galleryImages)) merged.cinematicBirthday.galleryImages = demoFallback.galleryImages.map(g => g.url);
    if (isStringEmpty(merged.cinematicBirthday.songAudioUrl)) merged.cinematicBirthday.songAudioUrl = demoFallback.music.audioUrl;
    if (isStringEmpty(merged.cinematicBirthday.songLyrics)) merged.cinematicBirthday.songLyrics = demoFallback.songLyrics;
    if (isStringEmpty(merged.cinematicBirthday.yearRecapText)) merged.cinematicBirthday.yearRecapText = demoFallback.yearRecapText;
    if (isArrayEmpty(merged.cinematicBirthday.birthdayBucketList)) merged.cinematicBirthday.birthdayBucketList = demoFallback.birthdayBucketList;
  }

  return merged;
}
