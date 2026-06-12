// ── Centralised API client ────────────────────────────────────────
// Set VITE_API_URL in .env.local to override for production
const BASE = import.meta.env.VITE_API_URL || '';

const getAuthHeaders = () => {
  const token = localStorage.getItem('adminToken');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// ── Auth ──────────────────────────────────────────────────────────
export async function loginAdmin(username, password) {
  const r = await fetch(`${BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  return r.json();
}

export async function requestPasswordReset(email) {
  const r = await fetch(`${BASE}/api/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  return r.json();
}

export async function resetPassword(email, otp, newPassword) {
  const r = await fetch(`${BASE}/api/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp, newPassword }),
  });
  return r.json();
}

// ── Sites ─────────────────────────────────────────────────────────
export async function listSites() {
  const r = await fetch(`${BASE}/api/sites`, { 
    headers: getAuthHeaders(),
    cache: 'no-store'
  });
  if (!r.ok) {
    let msg = 'API error';
    try {
      const text = await r.text();
      try {
        const data = JSON.parse(text);
        msg = data.message || msg;
      } catch (e) {
        msg = text.slice(0, 100); // Capture Vercel HTML timeout or 500 error
      }
    } catch(e) {}
    throw new Error(msg);
  }
  const data = await r.json();
  if (!data.success) throw new Error(data.message || 'API returned failure');
  return data;
}

export async function getSite(siteId) {
  const r = await fetch(`${BASE}/api/sites/${siteId}`, { cache: 'no-store' });
  return r.json();
}

export async function saveSite(siteId, payload) {
  const r = await fetch(`${BASE}/api/sites/${siteId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(payload),
  });
  return r.json();
}

export async function deleteSite(siteId) {
  const r = await fetch(`${BASE}/api/sites/${siteId}`, { method: 'DELETE', headers: getAuthHeaders() });
  return r.json();
}

export async function toggleSiteStatus(siteId, isActive) {
  const r = await fetch(`${BASE}/api/sites/${siteId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ isActive }),
  });
  return r.json();
}

export async function setSiteDemo(siteId) {
  const r = await fetch(`${BASE}/api/sites/${siteId}/set-demo`, {
    method: 'PUT',
    headers: getAuthHeaders(),
  });
  return r.json();
}

export async function getDemoSite(templateId) {
  const r = await fetch(`${BASE}/api/sites/demo/${templateId}`);
  if (!r.ok) {
    throw new Error('Failed to fetch demo site');
  }
  return r.json();
}

// ── Storefront Configuration ──────────────────────────────────────
export async function getStorefront() {
  const r = await fetch(`${BASE}/api/storefront`, { cache: 'no-store' });
  if (!r.ok) {
    let msg = 'API error';
    try {
      const text = await r.text();
      try {
        const data = JSON.parse(text);
        msg = data.message || msg;
      } catch (e) {
        msg = text.slice(0, 100);
      }
    } catch(e) {}
    throw new Error(msg);
  }
  const data = await r.json();
  if (!data.success) throw new Error(data.message || 'API returned failure');
  return data;
}

export async function updateStorefront(payload) {
  const r = await fetch(`${BASE}/api/storefront`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!r.ok) {
    let msg = 'API error';
    try { const data = await r.json(); msg = data.message; } catch(e) {}
    throw new Error(msg);
  }
  const data = await r.json();
  if (!data.success) throw new Error(data.message || 'API returned failure');
  return data;
}

export async function toggleTemplateStatus(templateId) {
  const r = await fetch(`${BASE}/api/storefront/templates/${templateId}/toggle`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() }
  });
  if (!r.ok) {
    let msg = 'API error';
    try { const data = await r.json(); msg = data.message; } catch(e) {}
    throw new Error(msg);
  }
  const data = await r.json();
  if (!data.success) throw new Error(data.message || 'API returned failure');
  return data;
}

export async function uploadImage(file) {
  try {
    // 1. Fetch upload signature from backend
    const sigRes = await fetch(`${BASE}/api/upload/signature`);
    if (!sigRes.ok) throw new Error('Failed to fetch upload signature');
    const { timestamp, signature, cloudName, apiKey } = await sigRes.json();

    // 2. Upload directly to Cloudinary
    const fd = new FormData();
    fd.append('file', file);
    fd.append('api_key', apiKey);
    fd.append('timestamp', timestamp);
    fd.append('signature', signature);
    fd.append('folder', 'everwish-celebrations');

    const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
      method: 'POST',
      body: fd,
    });

    const data = await uploadRes.json();
    if (data.error) throw new Error(data.error.message);

    // 3. Optimize image URLs if it's an image
    let optimizedUrl = data.secure_url;
    if (data.resource_type === 'image' && optimizedUrl.includes('/upload/')) {
      optimizedUrl = optimizedUrl.replace('/upload/', '/upload/f_auto,q_auto/');
    }

    return { success: true, url: optimizedUrl };
  } catch (err) {
    console.error("Direct upload failed:", err);
    return { success: false, message: err.message || 'Upload failed' };
  }
}

export async function deleteImage(url) {
  const r = await fetch(`${BASE}/api/upload`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  });
  return r.json();
}

// ── Orders ────────────────────────────────────────────────────────
export async function createOrder(payload) {
  const r = await fetch(`${BASE}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return r.json();
}

export async function listOrders() {
  const r = await fetch(`${BASE}/api/orders`, { headers: getAuthHeaders() });
  return r.json();
}

export async function updateOrderStatus(orderId, status) {
  const r = await fetch(`${BASE}/api/orders/${orderId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify({ status }),
  });
  return r.json();
}

// ── Transform MongoDB doc → format existing components expect ─────
export function toComponentData(doc) {
  if (!doc) return null;
  return {
    isActive:         doc.isActive !== false,
    expiresAt:        doc.expiresAt,
    introButtonText:  doc.introButtonText || 'Tap to Open',
    category:         doc.category || 'valentine',
    templateType:     doc.templateType || 'polaroid',
    coupleName:       doc.general?.coupleName       || 'Your Names',
    coupleEmoji:      doc.general?.coupleEmoji       || '💌',
    heroSubtitle:     doc.general?.heroSubtitle      || '',
    heroDate:         doc.general?.heroDate          || '',
    loveLetterText:   doc.general?.loveLetterText    || '',
    lockScreenPrompt: doc.general?.lockScreenPrompt  || 'Tap until the screen is full red',
    valentineMessage: doc.general?.valentineMessage  || "Happy Valentine's Day! 💕",
    timelineDates: {
      startDate:      doc.general?.timelineDates?.startDate || '',
      endDate:        doc.general?.timelineDates?.endDate   || '',
    },
    heroImageUrl:     doc.images?.heroImageUrl       || '',
    music: {
      audioUrl:     doc.music?.audioUrl     || '',
      thumbnailUrl: doc.music?.thumbnailUrl || '',
      isEnabled:    doc.music?.isEnabled ?? true,
    },
    gift: {
      recipient:    doc.gift?.recipient       || '',
      message:      doc.gift?.message         || '',
      bouquetUrl:   doc.images?.bouquetImageUrl || '',
    },
    milestones: (doc.milestones || []).map(m => ({
      id:          m._id || m.id,
      title:       m.title       || '',
      date:        m.date        || '',
      description: m.description || '',
      imageUrl:    m.imageUrl    || '',
      alignment:   m.alignment   || 'left',
      rotate:      m.rotate      || '-rotate-2',
    })),
    gallery: {
      centerImage:   doc.gallery?.centerImage   || '',
      centerCaption: doc.gallery?.centerCaption || '',
      supporting:    (doc.gallery?.supporting || []).map((s, i) => ({
        id:      s._id || s.id || i,
        url:     s.url     || '',
        caption: s.caption || '',
      })),
    },
    valentine: {
      matchImages:     (doc.valentine?.matchImages     || []),
      reasons:         (doc.valentine?.reasons         || []),
      scratchMemories: (doc.valentine?.scratchMemories || []).map((s, i) => ({
        id:       s._id || s.id || i,
        imageUrl: s.imageUrl || '',
        caption:  s.caption  || '',
      })),
    },
    proposal: {
      proposalText:    doc.proposal?.proposalText    || 'Will you be my Valentine? 💕',
      loveLetter:      doc.proposal?.loveLetter      || '',
      giftImageUrl:    doc.proposal?.giftImageUrl    || '',
      giftMessage:     doc.proposal?.giftMessage     || '',
      activities:      (doc.proposal?.activities     || []),
      foods:           (doc.proposal?.foods          || []),
      scratchGallery:  (doc.proposal?.scratchGallery || []).map((s, i) => ({
        id:       s._id || s.id || i,
        imageUrl: s.imageUrl || '',
        caption:  s.caption  || '',
      })),
    },
    thingsToDo: (doc.thingsToDo || []).map((t, i) => ({
      id:          t._id || t.id || i,
      title:       t.title || '',
      description: t.description || '',
      imageUrl:    t.imageUrl || '',
      completed:   t.completed ?? false,
    })),
    themeColors: {
      polaroid: {
        primary:    doc.themeColors?.polaroid?.primary    || '#e11d48',
        background: doc.themeColors?.polaroid?.background || '#fff0f5',
      },
      modern: {
        primary:    doc.themeColors?.modern?.primary    || '#e11d48',
        background: doc.themeColors?.modern?.background || '#f7f5f0',
      },
      valentine: {
        primary:    doc.themeColors?.valentine?.primary    || '#e11d48',
        background: doc.themeColors?.valentine?.background || '#fff0f5',
        cardColor:  doc.themeColors?.valentine?.cardColor  || '#ffccd5',
      },
      proposal: {
        primary:    doc.themeColors?.proposal?.primary    || '#e11d48',
        background: doc.themeColors?.proposal?.background || '#fdf2f8',
        cardColor:  doc.themeColors?.proposal?.cardColor  || '#c084fc',
      },
      custom: {
        primary:    doc.themeColors?.custom?.primary    || '#e11d48',
        background: doc.themeColors?.custom?.background || '#fff0f5',
        cardColor:  doc.themeColors?.custom?.cardColor  || '#ffccd5',
      },
      bday1: {
        primary:    doc.themeColors?.bday1?.primary    || '#f59e0b',
        background: doc.themeColors?.bday1?.background || '#fffbeb',
      },
      bday2: {
        primary:    doc.themeColors?.bday2?.primary    || '#3b82f6',
        background: doc.themeColors?.bday2?.background || '#eff6ff',
      },
      bday3: {
        primary:    doc.themeColors?.bday3?.primary    || '#10b981',
        background: doc.themeColors?.bday3?.background || '#ecfdf5',
      },
      bday4: {
        primary:    doc.themeColors?.bday4?.primary    || '#8b5cf6',
        background: doc.themeColors?.bday4?.background || '#f5f3ff',
      },
    },
    birthday: {
      recipientAge:    doc.birthday?.recipientAge,
      birthdayMessage: doc.birthday?.birthdayMessage || 'Wishing you the happiest of birthdays! 🥳',
      balloonColor:    doc.birthday?.balloonColor    || '#e11d48',
      birthDate:       doc.birthday?.birthDate       || null,
    },
    customModules: {
      lockscreenType:     doc.customModules?.lockscreenType     || 'tap',
      showMilestones:     doc.customModules?.showMilestones     ?? false,
      showScratchGallery: doc.customModules?.showScratchGallery ?? false,
      showWhyILoveYou:    doc.customModules?.showWhyILoveYou    ?? false,
      showDatePlanner:    doc.customModules?.showDatePlanner    ?? false,
      showVirtualGift:    doc.customModules?.showVirtualGift    ?? false,
    },
    // ── Birthday Exclusive Features ───────────────────────────────
    unlockTime:   doc.unlockTime || null,
    voiceNoteUrl: doc.voiceNoteUrl || '',
    heroBackgroundMediaUrl: doc.heroBackgroundMediaUrl || '',
    scratchPrize: doc.scratchPrize || '',
    yearInReview: doc.yearInReview || [],
    virtualGift:  doc.virtualGift ? {
      imageUrl: doc.virtualGift.imageUrl || '',
      message:  doc.virtualGift.message  || '',
    } : null,
    birthdayGallery: (doc.birthdayGallery || []).map((bg, i) => ({
      id:      bg._id || bg.id || i,
      url:     bg.url     || '',
      caption: bg.caption || '',
    })),
    // ── Valentine Exclusive Features ──────────────────────────────
    loveLock: doc.loveLock ? {
      initials:  doc.loveLock.initials || '',
      isEnabled: doc.loveLock.isEnabled ?? false,
    } : null,
    reasonsJar: doc.reasonsJar || [],
    timeCapsule: doc.timeCapsule ? {
      unlockDate: doc.timeCapsule.unlockDate || null,
      message:    doc.timeCapsule.message    || '',
      mediaUrl:   doc.timeCapsule.mediaUrl   || '',
    } : null,
    cinematic: doc.cinematic ? {
      introVideoUrl: doc.cinematic.introVideoUrl || '',
      bgVideoUrl:    doc.cinematic.bgVideoUrl    || '',
      heroImageUrl:  doc.cinematic.heroImageUrl  || '',
      songLyrics:    doc.cinematic.songLyrics    || '',
      reasons:       doc.cinematic.reasons       || [],
      startDate:     doc.cinematic.startDate     || '',
    } : null,
    cinematicBirthday: doc.cinematicBirthday ? {
      introVideoUrl:      doc.cinematicBirthday.introVideoUrl      || '',
      bgVideoUrl:         doc.cinematicBirthday.bgVideoUrl         || '',
      giftImageUrl:       doc.cinematicBirthday.giftImageUrl       || '',
      giftRevealText:     doc.cinematicBirthday.giftRevealText     || '',
      yearRecapText:      doc.cinematicBirthday.yearRecapText      || '',
      birthdayBucketList: doc.cinematicBirthday.birthdayBucketList || [],
      songAudioUrl:       doc.cinematicBirthday.songAudioUrl       || '',
      songLyrics:         doc.cinematicBirthday.songLyrics         || '',
      galleryImages:      doc.cinematicBirthday.galleryImages      || [],
      nickname:           doc.cinematicBirthday.nickname           || '',
      heroPhotos:         doc.cinematicBirthday.heroPhotos         || [],
      useInteractiveHero: doc.cinematicBirthday.useInteractiveHero ?? false,
      loveLetterContent:  doc.cinematicBirthday.loveLetterContent  || '',
    } : null,
  };
}

// ── Build empty site template for new clients ─────────────────────
export function emptyTemplate(siteId, templateType = 'polaroid', category = 'valentine') {
  return {
    siteId,
    category,
    templateType,
    introButtonText: 'Tap to Open',
    general: {
      coupleName: 'Name & Name',
      coupleEmoji: '💌',
      heroSubtitle: 'A little corner of the internet, made just for you 💕',
      heroDate: 'February 14 · Forever',
      loveLetterText: 'Write your love letter here…',
      lockScreenPrompt: 'Tap until the screen is full red',
      valentineMessage: "Happy Valentine's Day! 💕",
      timelineDates: { startDate: '2020', endDate: '2026' },
    },
    images: { heroImageUrl: '', bouquetImageUrl: '' },
    music:  { audioUrl: '', thumbnailUrl: '', isEnabled: true },
    gift:   { recipient: '', message: 'You deserve all the flowers…' },
    milestones: [],
    gallery: { centerImage: '', centerCaption: 'Us, always ❤️', supporting: [] },
    valentine: { matchImages: ['','','','',''], reasons: [], scratchMemories: [] },
    proposal: {
      proposalText: 'Will you be my Valentine? 💕',
      loveLetter: '',
      giftImageUrl: '',
      giftMessage: 'You deserve all the love in the world 💖',
      activities: ['Movies 🎬', 'Dinner 🍽️', 'Picnic 🌸', 'Stargazing ✨'],
      foods: ['Pizza 🍕', 'Sushi 🍣', 'Chocolate 🍫', 'Ice Cream 🍦'],
      scratchGallery: [],
    },
    thingsToDo: [],
    themeColors: {
      polaroid:  { primary: '#e11d48', background: '#fff0f5' },
      modern:    { primary: '#e11d48', background: '#f7f5f0' },
      valentine: { primary: '#e11d48', background: '#fff0f5', cardColor: '#ffccd5' },
      proposal:  { primary: '#e11d48', background: '#fdf2f8', cardColor: '#c084fc' },
      custom:    { primary: '#e11d48', background: '#fff0f5', cardColor: '#ffccd5' },
      bday1:     { primary: '#f59e0b', background: '#fffbeb' },
      bday2:     { primary: '#3b82f6', background: '#eff6ff' },
      bday3:     { primary: '#10b981', background: '#ecfdf5' },
      bday4:     { primary: '#8b5cf6', background: '#f5f3ff' },
    },
    customModules: {
      lockscreenType:     'tap',
      showMilestones:     false,
      showScratchGallery: false,
      showWhyILoveYou:    false,
      showDatePlanner:    false,
      showVirtualGift:    false,
    },
    birthday: {
      recipientAge: null,
      birthdayMessage: 'Wishing you the happiest of birthdays! 🥳',
      balloonColor: '#e11d48',
    },
    cinematic: {
      introVideoUrl: '',
      bgVideoUrl: '',
      heroImageUrl: '',
      songLyrics: '',
      reasons: [],
      startDate: '2022-01-01',
    },
    cinematicBirthday: {
      introVideoUrl:      '',
      bgVideoUrl:         '',
      giftImageUrl:       '',
      giftRevealText:     'Happy Birthday! 🎂 A gift made just for you.',
      yearRecapText:      '',
      birthdayBucketList: [],
      songAudioUrl:       '',
      songLyrics:         '',
      galleryImages:      [],
      nickname:           '',
      heroPhotos:         [],
      useInteractiveHero: false,
      loveLetterContent:  '',
    }
  };
}
