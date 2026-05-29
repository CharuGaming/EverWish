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
    // ── Birthday Templates ────────────────────────────────────────
    birthday: {
      recipientAge:    { type: Number, default: null },
      birthdayMessage: { type: String, default: 'Wishing you the happiest of birthdays! 🥳' },
      balloonColor:    { type: String, default: '#e11d48' },
      birthDate:       { type: Date,   default: null },
    },
    // ── Birthday Exclusive Features ───────────────────────────────
    unlockTime:   { type: Date,   default: null },
    voiceNoteUrl: { type: String, default: '' },
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
    }
  },
  {
    timestamps: true, // adds createdAt, updatedAt
  }
);

module.exports = mongoose.model('Site', SiteSchema);
