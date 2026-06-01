import { optimizeCloudinaryUrl } from './imageHelpers';

// Premium User Uploaded Cloudinary URLs for Valentines/Romantic theme
const romanticImages = [
  'https://res.cloudinary.com/daczoccvq/image/upload/v1780333160/A_couple_holding_hands_while_202606010130_xhjqm0.webp',
  'https://res.cloudinary.com/daczoccvq/image/upload/v1780333171/A_couple_taking_a_selfie_202606010133_ftzm7b.jpg',
  'https://res.cloudinary.com/daczoccvq/image/upload/v1780333180/Couple_holding_hands_whimsical_sky_202606010148_sitlfu.jpg',
  'https://res.cloudinary.com/daczoccvq/image/upload/v1780333181/Couple_enjoying_romantic_dinner___202606010144_reaiwl.jpg',
  'https://res.cloudinary.com/daczoccvq/image/upload/v1780333172/A_couple_sitting_together_on_202606010132_pqzx0w.jpg',
  'https://res.cloudinary.com/daczoccvq/image/upload/v1780333181/Couple_standing_on_hill_202606010145_xtbtrl.jpg',
  'https://res.cloudinary.com/daczoccvq/image/upload/v1780333169/A_couple_in_a_car_202606010134_hdfjoh.jpg',
];

// Placeholder for cinematic videos
const cinematicVideoUrl = 'https://res.cloudinary.com/demo/video/upload/q_auto,f_auto/v1689254848/video/couple-sunset.mp4';

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
  // Force overwrite with premium demo data when isDemo is true
  
  // 1. General Hero & Bouquet Images
  if (!merged.images) merged.images = {};
  merged.images.heroImageUrl = demoFallback.heroImageUrl;
  merged.images.bouquetImageUrl = demoFallback.giftImageUrl;
  merged.heroImageUrl = demoFallback.heroImageUrl; // Some templates use flat heroImageUrl

  // 2. Music Player
  if (!merged.music) merged.music = {};
  merged.music.audioUrl = demoFallback.music.audioUrl;
  merged.music.thumbnailUrl = demoFallback.music.thumbnailUrl;
  merged.music.isEnabled = true;

  // 3. Gift
  if (!merged.gift) merged.gift = {};
  merged.gift.imageUrl = demoFallback.giftImageUrl;
  if (!merged.gift.bouquetUrl) merged.gift.bouquetUrl = demoFallback.giftImageUrl;

  // 4. Memory Grid / Gallery
  if (!merged.gallery) merged.gallery = { supporting: [] };
  merged.gallery.centerImage = demoFallback.heroImageUrl;
  merged.gallery.supporting = demoFallback.galleryImages;

  // 5. Cinematic Anniversary (templateType: 'cinematic')
  if (merged.templateType === 'cinematic') {
    if (!merged.cinematic) merged.cinematic = {};
    merged.cinematic.heroImageUrl = demoFallback.heroImageUrl;
    merged.cinematic.songLyrics = demoFallback.songLyrics;
    merged.cinematic.reasons = demoFallback.reasons;
    merged.cinematic.bgVideoUrl = cinematicVideoUrl;
    merged.cinematic.introVideoUrl = cinematicVideoUrl;
  }

  // 6. Valentine / Custom / Proposal
  if (['valentine', 'custom', 'proposal', 'polaroid', 'modern'].includes(merged.templateType)) {
    if (!merged.valentine) merged.valentine = { matchImages: [], reasons: [] };
    merged.valentine.reasons = demoFallback.reasons;
    merged.valentine.matchImages = demoFallback.galleryImages.slice(0, 5).map(g => g.url);
    if (!merged.milestones) merged.milestones = [];
    merged.milestones = merged.milestones.map((m, i) => ({ ...m, imageUrl: demoFallback.galleryImages[i % demoFallback.galleryImages.length].url }));
  }

  // 7. Cinematic Birthday (bday5)
  if (merged.templateType === 'bday5' || theme === 'birthday') {
    if (!merged.cinematicBirthday) merged.cinematicBirthday = {};
    merged.cinematicBirthday.giftImageUrl = demoFallback.giftImageUrl;
    merged.cinematicBirthday.galleryImages = demoFallback.galleryImages.map(g => g.url);
    merged.cinematicBirthday.songAudioUrl = demoFallback.music.audioUrl;
    merged.cinematicBirthday.songLyrics = demoFallback.songLyrics;
    merged.cinematicBirthday.yearRecapText = demoFallback.yearRecapText;
    merged.cinematicBirthday.birthdayBucketList = demoFallback.birthdayBucketList;
    merged.cinematicBirthday.bgVideoUrl = cinematicVideoUrl;
    merged.cinematicBirthday.introVideoUrl = cinematicVideoUrl;
  }

  // 8. General Birthday (bday1-4)
  if (merged.category === 'birthday') {
    if (!merged.virtualGift) merged.virtualGift = {};
    merged.virtualGift.imageUrl = demoFallback.giftImageUrl;
    merged.birthdayGallery = demoFallback.galleryImages;
  }

  return merged;
}
