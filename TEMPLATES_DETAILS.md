# EverWish Birthday Templates Details

This document outlines the features, configuration schemas, and comparison details for **Birthday Template 5 (Cinematic Birthday)** and **Birthday Template 6 (Passcode & Cinematic Experience)**.

---

## 🎂 Birthday Template 5 (Cinematic Birthday)
* **Template Type Code:** `bday5`
* **Source Component:** `src/components/CinematicBirthday.jsx`
* **Key Concept:** Full-page immersive cinematic experience featuring a global fixed background video (or radial gradient) with premium glassmorphism overlay cards.

### 🌟 Features & Sections
1. **Interactive Intro Screen:**
   - Centered play button with floating particles (`🎂`, `🎈`, `🎉`, etc.).
   - Starts a full-screen intro video transition on click before revealing the hero section.
2. **Immersive Hero Section:**
   - Custom headline text (`coupleName` / `heroTitle`).
   - Supports an interactive Polaroid collage of photos (`heroPhotos`).
   - Can toggle between static layouts and interactive grid collages.
3. **Interactive Gift Box:**
   - Premium 3D gift box container that shakes on hover.
   - Triggers confetti and reveals the gift image (`giftImageUrl`) and custom reveal note (`giftRevealText`) when unwrapped.
4. **Year Recap:**
   - Text narrative (`yearRecapText`) showcasing summary milestones or statistics of the year.
5. **Love Letter Envelope:**
   - An interactive, slide-out letter container revealing deep-dive markdown or custom message content.
6. **Music Player with Lyrics:**
   - Glassmorphic media player with progress bar tracking, playback state controls, and a custom scrolling lyrics panel.
7. **Photo Gallery:**
   - Standard photo grid showcasing selected memory images.

---

## 🔐 Birthday Template 6 (Passcode & Cinematic Experience)
* **Template Type Code:** `bday6`
* **Source Component:** `src/components/BirthdayTemplate6.jsx`
* **Key Concept:** A security-gated luxury experience starting with an interactive 4-digit passcode lock screen, playing a cinematic transition video, and scrolling into a fully custom-themed birthday page.

### 🌟 Features & Sections
1. **Shader Lock Screen:**
   - High-performance canvas-based shader background.
   - Customizable passcode gate title, input hints, and target 4-digit passcode.
2. **Transition Intro Video:**
   - Plays a cinematic intro video that automatically transitions the visitor to the landing page when completed or skipped.
3. **Hero Landing Page:**
   - High-contrast typography with customized badges (`heroBadge`), main headers, subheaders, and scrolling text indicators.
4. **Unwrap Gift Box:**
   - Custom header settings (`giftSectionTitle`, `giftSectionSubtitle`).
   - Confetti burst animation upon opening the gift wrapper.
5. **Year Recap Section:**
   - Custom icon markers and recap headers with an immersive year recap narrative.
6. **Interactive Bucket List:**
   - Fully interactive checklist displaying custom icons and title, with checkable bullet list items (`birthdayBucketList`).
7. **Love Letter Envelope:**
   - Slide-out letter containing custom letter content.
8. **Birthday Song Player:**
   - Standard glassmorphic control player displaying scrollable lyric cards.
9. **Photo Gallery Grid:**
   - Collage of images with customizable icon tags and headers.
10. **Footer Section:**
    - Dedicated signature text at the bottom.

---

## 🛠️ Data Schema & Config Properties

Here is the exact schema representation mapping both templates in the Mongo database:

| Field Path | Template | Type | Default Value | Description |
|---|---|---|---|---|
| `passcode.title` | `bday6` | String | `"Enter Code"` | Header on the Lock Screen |
| `passcode.hint` | `bday6` | String | `"Hint: ..."` | Password hint helper text |
| `passcode.targetPasscode` | `bday6` | String | `"0214"` | 4-digit unlocking passcode |
| `passcode.videoUrl` | `bday6` | String | `""` | Transition video after passcode unlock |
| `bday6.heroBadge` | `bday6` | String | `"🎂 Happy Birthday"` | Small pill badge above hero |
| `bday6.heroTitle` | `bday6` | String | `"Happy Birthday, Jamie!"` | Hero main header |
| `bday6.heroSubtitle` | `bday6` | String | `"Today is all about you ✨"` | Hero subheading |
| `bday6.scrollText` | `bday6` | String | `"Scroll to explore"` | Text beneath hero indicator |
| `bday6.giftSectionTitle` | `bday6` | String | `"A Gift For You"` | Header for gift section |
| `bday6.giftUnwrapText` | `bday6` | String | `"Tap to Unwrap 🎀"` | Call-to-action button for gift |
| `cinematicBirthday.giftImageUrl` | `bday5`, `bday6` | String | `""` | Image URL of the hidden gift |
| `cinematicBirthday.giftRevealText` | `bday5`, `bday6` | String | `""` | Message revealed after unwrapping |
| `cinematicBirthday.yearRecapText` | `bday5`, `bday6` | String | `""` | Recap summary story |
| `cinematicBirthday.birthdayBucketList` | `bday5`, `bday6` | Array | `[]` | List of items for bucket list |
| `cinematicBirthday.songAudioUrl` | `bday5`, `bday6` | String | `""` | Audio file link for the page music |
| `cinematicBirthday.songLyrics` | `bday5`, `bday6` | String | `""` | Scrollable lyrics text |
| `cinematicBirthday.loveLetterContent` | `bday5`, `bday6` | String | `""` | Content inside the envelope letter |
