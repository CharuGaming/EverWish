const mongoose = require('mongoose');

// ─── Milestone Sub-document ───────────────────────────────────────
const MilestoneSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  date:        { type: String, required: true, trim: true },
  description: { type: String, default: '',   trim: true },
  imageUrl:    { type: String, default: '',   trim: true },
  alignment:   { type: String, enum: ['left', 'right'], default: 'left' },
  rotate:      { type: String, default: '-rotate-2' },
}, { _id: false });

// ─── Gallery Supporting Image Sub-document ────────────────────────
const SupportingImageSchema = new mongoose.Schema({
  url:     { type: String, required: true },
  caption: { type: String, default: '' },
}, { _id: false });

// ─── Main Site Schema ─────────────────────────────────────────────
const SiteSchema = new mongoose.Schema(
  {
    // Unique identifier for this client's site (e.g. "maleesha-charu-2024")
    siteId: {
      type:     String,
      required: true,
      unique:   true,
      trim:     true,
      lowercase: true,
    },

    // ── Demo System ────────────────────────────────────────────
    isDemoPreview: {
      type: Boolean,
      default: false
    },

    // ── Template Selection ─────────────────────────────────────
    category: {
      type: String,
      enum: ['valentine', 'birthday'],
      default: 'valentine',
      required: true
    },
    templateType: {
      type: String,
      required: true,
      default: 'polaroid'
    },
    introButtonText: {
      type: String,
      default: 'Tap to Open'
    },

    // ── Site Lifecycle & Expiration ────────────────────────────
    isActive: {
      type: Boolean,
      default: true
    },
    expiresAt: {
      type: Date,
      default: () => Date.now() + 14 * 24 * 60 * 60 * 1000 // 14 days from creation
    },

    // ── General / Copy ─────────────────────────────────────────
    general: {
      coupleName:       { type: String, default: '' },
      coupleEmoji:      { type: String, default: '💌' },
      heroTitle:        { type: String, default: '' },
      heroSubtitle:     { type: String, default: '' },
      heroDate:         { type: String, default: '' },
      loveLetterText:   { type: String, default: '' },
      lockScreenPrompt: { type: String, default: 'Tap until the screen is full red' },
      valentineMessage: { type: String, default: "Happy Valentine's Day! 💕" },
      timelineDates: {
        startDate:      { type: String, default: '' },
        endDate:        { type: String, default: '' },
      },
    },

    // ── Images ─────────────────────────────────────────────────
    images: {
      heroImageUrl:    { type: String, default: '' },
      bouquetImageUrl: { type: String, default: '' },
    },

    // ── Music ──────────────────────────────────────────────────
    music: {
      audioUrl:     { type: String, default: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
      thumbnailUrl: { type: String, default: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=600&auto=format&fit=crop' },
      isEnabled:    { type: Boolean, default: true },
    },

    // ── Virtual Gift ───────────────────────────────────────────
    gift: {
      recipient: { type: String, default: '' },
      message:   { type: String, default: '' },
    },

    // ── Milestones Timeline ────────────────────────────────────
    milestones: {
      type:    [MilestoneSchema],
      default: [],
    },

    // ── Gallery ────────────────────────────────────────────────
    gallery: {
      centerImage:   { type: String, default: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=600&auto=format&fit=crop' },
      centerCaption: { type: String, default: 'Us, always ❤️' },
      supporting:    { type: [SupportingImageSchema], default: [
        { url: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=600&auto=format&fit=crop', caption: 'Laughter & Joy' },
        { url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=600&auto=format&fit=crop', caption: 'Your beautiful smile' },
        { url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=600&auto=format&fit=crop', caption: 'Hand in hand' },
        { url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=600&auto=format&fit=crop', caption: 'Forever together' }
      ] },
    },
    // ── Section Ordering ───────────────────────────────────────
    sectionOrder: {
      type: [String],
      default: ['hero', 'message', 'lifeStats', 'gallery', 'gift']
    },
    // ── Valentine Template ─────────────────────────────────────────
    valentine: {
      matchImages:     { type: [String], default: [] },
      reasons:         { type: [String], default: [] },
      scratchMemories: {
        type: [{
          imageUrl: { type: String, default: '' },
          caption:  { type: String, default: '' },
        }],
        default: [],
      },
    },
    // ── Valentine Exclusive Features ──────────────────────────────
    loveLock: {
      initials:  { type: String,  default: '' },
      isEnabled: { type: Boolean, default: false },
    },
    reasonsJar: { type: [String], default: [] },
    timeCapsule: {
      unlockDate: { type: Date,   default: null },
      message:    { type: String, default: '' },
      mediaUrl:   { type: String, default: '' },
    },
    // ── Proposal Template ─────────────────────────────────────────
    proposal: {
      proposalText:    { type: String, default: 'Will you be my Valentine? 💕' },
      loveLetter:      { type: String, default: '' },
      giftImageUrl:    { type: String, default: '' },
      giftMessage:     { type: String, default: '' },
      activities:      { type: [String], default: [] },
      foods:           { type: [String], default: [] },
      scratchGallery:  {
        type: [{
          imageUrl: { type: String, default: '' },
          caption:  { type: String, default: '' },
        }],
        default: [],
      },
    },
    // ── Cinematic Template ────────────────────────────────────────
    cinematic: {
      introVideoUrl:   { type: String, default: '' },
      bgVideoUrl:      { type: String, default: '' },
      heroImageUrl:    { type: String, default: '' },
      songLyrics:      { type: String, default: '' },
      reasons:         { type: [String], default: [] },
      startDate:       { type: String, default: '' },
      // ── 7 New Interactive Romantic Features ─────────────────────
      bucketList: {
        type: [{ item: { type: String, default: '' }, isCompleted: { type: Boolean, default: false } }],
        default: [],
      },
      specialLocations: {
        type: [{ title: { type: String, default: '' }, description: { type: String, default: '' }, imageUrl: { type: String, default: '' } }],
        default: [],
      },
      voiceNoteUrl:    { type: String, default: '' },
      funFacts: {
        type: [{ question: { type: String, default: '' }, answer: { type: String, default: '' } }],
        default: [],
      },
      openWhenLetters: {
        type: [{ condition: { type: String, default: '' }, message: { type: String, default: '' }, imageUrl: { type: String, default: '' } }],
        default: [],
      },
      videoMontageUrl: { type: String, default: '' },
      partnerWhatsApp: { type: String, default: '' },
    },
    // ── Cinematic Birthday Template ───────────────────────────────
    cinematicBirthday: {
      introVideoUrl:      { type: String, default: '' },
      bgVideoUrl:         { type: String, default: '' },
      giftImageUrl:       { type: String, default: '' },
      giftRevealText:     { type: String, default: '' },
      yearRecapText:      { type: String, default: '' },
      birthdayBucketList: { type: [String], default: [] },
      songAudioUrl:       { type: String, default: '' },
      songLyrics:         { type: String, default: '' },
      galleryImages:      { type: [String], default: [] },
      // ── Interactive Hero & Love Letter ──────────────────────────
      nickname:           { type: String,   default: '' },
      heroPhotos:         { type: [String], default: [] },
      useInteractiveHero: { type: Boolean,  default: false },
      loveLetterContent:  { type: String,   default: '' },
      galleryMessage:     { type: String,   default: '' },
    },
    // ── Bday6 Template ──────────────────────────────────────────────
    bday6: {
      heroBadge:           { type: String, default: '' },
      heroTitle:           { type: String, default: '' },
      heroSubtitle:        { type: String, default: '' },
      scrollText:          { type: String, default: '' },
      giftSectionTitle:    { type: String, default: '' },
      giftSectionSubtitle: { type: String, default: '' },
      giftUnwrapText:      { type: String, default: '' },
      yearRecapIcon:       { type: String, default: '' },
      yearRecapTitle:      { type: String, default: '' },
      bucketListIcon:      { type: String, default: '' },
      bucketListTitle:     { type: String, default: '' },
      bucketListSubtitle:  { type: String, default: '' },
      songSectionTitle:    { type: String, default: '' },
      songSectionSubtitle: { type: String, default: '' },
      noMusicText:         { type: String, default: '' },
      gallerySectionIcon:  { type: String, default: '' },
      gallerySectionTitle: { type: String, default: '' },
      gallerySectionSubtitle: { type: String, default: '' },
      footerText:          { type: String, default: '' },
    },
    passcode: {
      title:          { type: String, default: '' },
      hint:           { type: String, default: '' },
      targetPasscode: { type: String, default: '' },
      videoUrl:       { type: String, default: '' },
    },
    // ── Birthday Templates ────────────────────────────────────────
    birthday: {
      recipientAge:    { type: Number, default: null },
      birthdayMessage: { type: String, default: 'Wishing you the happiest of birthdays! 🥳' },
      balloonColor:    { type: String, default: '#e11d48' },
      birthDate:       { type: Date,   default: null },
      introVideoUrl:   { type: String, default: '' },
      gatekeeperBgColor: { type: String, default: '#fdf2f8' },
      gatekeeperButtonText: { type: String, default: 'Tap to Open 🎁' },
      bgVideoUrl:      { type: String, default: '' },
    },
    // ── Birthday Exclusive Features ───────────────────────────────
    unlockTime:   { type: Date,   default: null },
    voiceNoteUrl: { type: String, default: '' },
    heroBackgroundMediaUrl: { type: String, default: '' },
    // ── Polaroid Template Video Config ────────────────────────────
    polaroid: {
      introVideoUrl: { type: String, default: '' },
      bgVideoUrl:    { type: String, default: '' },
    },
    // ── Modern Template Video Config ──────────────────────────────
    modern: {
      introVideoUrl: { type: String, default: '' },
      bgVideoUrl:    { type: String, default: '' },
    },
    // ── Apology / Forgive Me Template ─────────────────────────────
    apology: {
      introVideoUrl:     { type: String, default: '' },
      bgVideoUrl:        { type: String, default: '' },
      heroTitle:         { type: String, default: 'I Am So Sorry 💔' },
      heroSubtitle:      { type: String, default: 'From the bottom of my heart...' },
      apologyMessage:    { type: String, default: 'I know I messed up. I am truly sorry for hurting you. You mean everything to me and I will do better. Please forgive me.' },
      forgiveQuestion:   { type: String, default: 'Will you forgive me? 🥺' },
      runawayButtonText: { type: String, default: 'No 🏃' },
      forgiveButtonText: { type: String, default: 'Yes, I forgive you 💕' },
      forgivenMessage:   { type: String, default: 'Thank you for giving me another chance. I promise I will do better. You are my everything. 💖' },
      successImageUrl:   { type: String, default: 'https://media1.tenor.com/m/Z-A_2HIfuUEAAAAC/milk-and-mocha-bear-hug.gif' },
      peaceOfferingsTitle:{ type: String, default: 'How can I make it up to you? Pick one! 👇' },
      peaceOfferings:    { type: [String], default: ["Sushi Date 🍣", "Shopping Spree 🛍️", "Unlimited Cuddles 🤗"] },
      musicUrl:          { type: String, default: '' },
      enableScratchReveal:{ type: Boolean, default: false },
      galleryImages:     { type: [String], default: [] },
    },
    scratchPrize: { type: String, default: '' },
    yearInReview: {
      type: [{ label: { type: String, default: '' }, value: { type: String, default: '' } }],
      default: [],
    },
    // ── Birthday Virtual Gift ──────────────────────────────────────
    virtualGift: {
      imageUrl: { type: String, default: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=600&auto=format&fit=crop' },
      message:  { type: String, default: '' },
    },
    // ── Birthday Gallery (flat array, separate from valentine gallery) ─
    birthdayGallery: {
      type: [{
        url:     { type: String, default: '' },
        caption: { type: String, default: '' },
      }],
      default: [],
    },
    // ── Things I Wanna Do With You ─────────────────────────────────
    thingsToDo: {
      type: [{
        title:       { type: String, default: '' },
        description: { type: String, default: '' },
        imageUrl:    { type: String, default: '' },
        completed:   { type: Boolean, default: false },
      }],
      default: []
    },
    // ── Theme / Colors configuration for each template separately ────
    themeColors: {
      polaroid: {
        primary: { type: String, default: '#e11d48' },
        background: { type: String, default: '#fff0f5' }
      },
      modern: {
        primary: { type: String, default: '#e11d48' },
        background: { type: String, default: '#f7f5f0' }
      },
      valentine: {
        primary: { type: String, default: '#e11d48' },
        background: { type: String, default: '#fff0f5' },
        cardColor: { type: String, default: '#ffccd5' }
      },
      proposal: {
        primary: { type: String, default: '#e11d48' },
        background: { type: String, default: '#fdf2f8' },
        cardColor: { type: String, default: '#c084fc' }
      },
      custom: {
        primary:    { type: String, default: '#e11d48' },
        background: { type: String, default: '#fff0f5' },
        cardColor:  { type: String, default: '#ffccd5' }
      },
      bday1: {
        primary:    { type: String, default: '#f59e0b' },
        background: { type: String, default: '#fffbeb' }
      },
      bday2: {
        primary:    { type: String, default: '#3b82f6' },
        background: { type: String, default: '#eff6ff' }
      },
      bday3: {
        primary:    { type: String, default: '#10b981' },
        background: { type: String, default: '#ecfdf5' }
      },
      bday4: {
        primary:    { type: String, default: '#8b5cf6' },
        background: { type: String, default: '#f5f3ff' }
      }
    },

    // ── Custom (Mix & Match) Template Modules ─────────────────────
    customModules: {
      lockscreenType:      { type: String, default: 'tap',  enum: ['tap', 'meter', 'memory', 'dodging'] },
      showMilestones:      { type: Boolean, default: false },
      showScratchGallery:  { type: Boolean, default: false },
      showWhyILoveYou:     { type: Boolean, default: false },
      showDatePlanner:     { type: Boolean, default: false },
      showVirtualGift:     { type: Boolean, default: false },
    },
    // ── Social Media / Contact Links ──────────────────────────────
    socialLinks: {
      whatsapp:  { type: String, default: '' },
      facebook:  { type: String, default: '' },
      instagram: { type: String, default: '' },
      tiktok:    { type: String, default: '' },
      youtube:   { type: String, default: '' }
    },
    // ── Custom Titles / Typography Configuration ──────────────────
    customTitles: {
      heroMainTitle:       { type: String, default: '' },
      heroSubtitle:        { type: String, default: '' },
      gameSectionTitle:    { type: String, default: '' },
      gallerySectionTitle: { type: String, default: '' }
    }
  },
  {
    timestamps: true, // adds createdAt, updatedAt
  }
);

module.exports = mongoose.models.Site || mongoose.model('Site', SiteSchema);
