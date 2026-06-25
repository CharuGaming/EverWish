import { useState } from "react";
import { siteData as defaultData } from "../siteData";
import {
  Settings, Music, Gift, MapPin, Image,
  Plus, Trash2, Download, Save, ExternalLink,
  Heart, ChevronRight, AlertCircle, Check, Lock, Type
} from "lucide-react";

// ── Helpers ──────────────────────────────────────────────────────
const uid = () => Date.now() + Math.random();

const TABS = [
  { id: "general",   label: "General",      icon: Settings },
  { id: "passcode",  label: "Passcode",     icon: Lock     },
  { id: "landing",   label: "Landing Texts",icon: Type     },
  { id: "music",     label: "Music",        icon: Music    },
  { id: "gift",      label: "Virtual Gift", icon: Gift     },
  { id: "milestones",label: "Milestones",   icon: MapPin   },
  { id: "gallery",   label: "Gallery",      icon: Image    },
];

// ── Reusable primitives ───────────────────────────────────────────
function Field({ label, hint, children }) {
  return (
    <div className="mb-5">
      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5">
        {label}
      </label>
      {children}
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

function Input({ value, onChange, placeholder, type = "text", rows }) {
  const base =
    "w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition";
  return rows ? (
    <textarea rows={rows} value={value} onChange={onChange} placeholder={placeholder} className={base} />
  ) : (
    <input type={type} value={value} onChange={onChange} placeholder={placeholder} className={base} />
  );
}

function Toggle({ checked, onChange, label }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none">
      <div
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors ${checked ? "bg-rose-500" : "bg-slate-700"}`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${checked ? "translate-x-5" : "translate-x-0"}`}
        />
      </div>
      <span className="text-sm text-slate-300">{label}</span>
    </label>
  );
}

function SectionCard({ title, children }) {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 mb-6">
      <h3 className="text-sm font-bold text-rose-400 uppercase tracking-widest mb-5">{title}</h3>
      {children}
    </div>
  );
}

// ── Tab Components ────────────────────────────────────────────────
function GeneralTab({ data, set }) {
  return (
    <>
      <SectionCard title="Couple Identity">
        <Field label="Couple's Names" hint="Displayed in Hero and Footer">
          <Input value={data.coupleName} onChange={e => set("coupleName", e.target.value)} placeholder="e.g. Maleesha & Charu" />
        </Field>
        <Field label="Couple Emoji">
          <Input value={data.coupleEmoji} onChange={e => set("coupleEmoji", e.target.value)} placeholder="💌" />
        </Field>
      </SectionCard>

      <SectionCard title="Hero Section">
        <Field label="Hero Image URL">
          <Input value={data.heroImageUrl} onChange={e => set("heroImageUrl", e.target.value)} placeholder="https://..." />
        </Field>
        <Field label="Hero Date Text">
          <Input value={data.heroDate} onChange={e => set("heroDate", e.target.value)} placeholder="February 14 · Forever" />
        </Field>
        <Field label="Hero Subtitle">
          <Input value={data.heroSubtitle} onChange={e => set("heroSubtitle", e.target.value)} rows={2} />
        </Field>
        <Field label="Love Letter Body" hint="Displayed in the card below hero image">
          <Input value={data.loveLetterText} onChange={e => set("loveLetterText", e.target.value)} rows={4} />
        </Field>
      </SectionCard>

      <SectionCard title="Lock Screen">
        <Field label="Lock Screen Prompt">
          <Input value={data.lockScreenPrompt} onChange={e => set("lockScreenPrompt", e.target.value)} placeholder="Tap until the screen is full red" />
        </Field>
        <Field label="Valentine Message (shown on unlock)">
          <Input value={data.valentineMessage} onChange={e => set("valentineMessage", e.target.value)} placeholder="Happy Valentine's Day! 💕" />
        </Field>
      </SectionCard>
    </>
  );
}

function PasscodeTab({ data, set }) {
  const updatePasscode = (field, value) => {
    set("passcode", { ...data.passcode, [field]: value });
  };
  return (
    <>
      <SectionCard title="Passcode Screen">
        <Field label="Page Title">
          <Input value={data.passcode?.title || ""} onChange={e => updatePasscode("title", e.target.value)} placeholder="Enter Code" />
        </Field>
        <Field label="Hint Text">
          <Input value={data.passcode?.hint || ""} onChange={e => updatePasscode("hint", e.target.value)} placeholder="Hint: The day you finally said 'YES' to me." />
        </Field>
        <Field label="Target Passcode">
          <Input value={data.passcode?.targetPasscode || ""} onChange={e => updatePasscode("targetPasscode", e.target.value)} placeholder="0214" type="number" />
        </Field>
      </SectionCard>
      <SectionCard title="Intro Video">
        <Field label="Video URL">
          <Input value={data.passcode?.videoUrl || ""} onChange={e => updatePasscode("videoUrl", e.target.value)} placeholder="https://..." />
        </Field>
      </SectionCard>
    </>
  );
}

function LandingPageTab({ data, set }) {
  const updateBday6 = (field, value) => set("bday6", { ...data.bday6, [field]: value });
  const updateCinematic = (field, value) => set("cinematicBirthday", { ...data.cinematicBirthday, [field]: value });
  
  return (
    <>
      <SectionCard title="Hero Section">
        <Field label="Hero Badge">
          <Input value={data.bday6?.heroBadge || ""} onChange={e => updateBday6("heroBadge", e.target.value)} />
        </Field>
        <Field label="Main Title">
          <Input value={data.bday6?.heroTitle || ""} onChange={e => updateBday6("heroTitle", e.target.value)} />
        </Field>
        <Field label="Subtitle">
          <Input value={data.bday6?.heroSubtitle || ""} onChange={e => updateBday6("heroSubtitle", e.target.value)} />
        </Field>
        <Field label="Scroll Text">
          <Input value={data.bday6?.scrollText || ""} onChange={e => updateBday6("scrollText", e.target.value)} />
        </Field>
      </SectionCard>

      <SectionCard title="Gift Section">
        <Field label="Section Title">
          <Input value={data.bday6?.giftSectionTitle || ""} onChange={e => updateBday6("giftSectionTitle", e.target.value)} />
        </Field>
        <Field label="Section Subtitle">
          <Input value={data.bday6?.giftSectionSubtitle || ""} onChange={e => updateBday6("giftSectionSubtitle", e.target.value)} />
        </Field>
        <Field label="Gift Image URL">
          <Input value={data.cinematicBirthday?.giftImageUrl || ""} onChange={e => updateCinematic("giftImageUrl", e.target.value)} />
        </Field>
        <Field label="Tap to Unwrap Text">
          <Input value={data.bday6?.giftUnwrapText || ""} onChange={e => updateBday6("giftUnwrapText", e.target.value)} />
        </Field>
        <Field label="Gift Reveal Message">
          <Input value={data.cinematicBirthday?.giftRevealText || ""} onChange={e => updateCinematic("giftRevealText", e.target.value)} rows={3} />
        </Field>
      </SectionCard>

      <SectionCard title="Year Recap Section">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Section Icon">
            <Input value={data.bday6?.yearRecapIcon || ""} onChange={e => updateBday6("yearRecapIcon", e.target.value)} />
          </Field>
          <Field label="Section Title">
            <Input value={data.bday6?.yearRecapTitle || ""} onChange={e => updateBday6("yearRecapTitle", e.target.value)} />
          </Field>
        </div>
        <Field label="Recap Text">
          <Input value={data.cinematicBirthday?.yearRecapText || ""} onChange={e => updateCinematic("yearRecapText", e.target.value)} rows={3} />
        </Field>
      </SectionCard>

      <SectionCard title="Bucket List Section">
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-1">
            <Field label="Section Icon">
              <Input value={data.bday6?.bucketListIcon || ""} onChange={e => updateBday6("bucketListIcon", e.target.value)} />
            </Field>
          </div>
          <div className="col-span-2">
            <Field label="Section Title">
              <Input value={data.bday6?.bucketListTitle || ""} onChange={e => updateBday6("bucketListTitle", e.target.value)} />
            </Field>
          </div>
        </div>
        <Field label="Section Subtitle">
          <Input value={data.bday6?.bucketListSubtitle || ""} onChange={e => updateBday6("bucketListSubtitle", e.target.value)} />
        </Field>
        <Field label="Bucket List Items" hint="Comma separated">
          <Input value={data.cinematicBirthday?.birthdayBucketList?.join(", ") || ""} onChange={e => updateCinematic("birthdayBucketList", e.target.value.split(",").map(i => i.trim()))} rows={2} />
        </Field>
      </SectionCard>

      <SectionCard title="Love Letter Envelope">
        <Field label="Letter Content">
          <Input value={data.cinematicBirthday?.loveLetterContent || ""} onChange={e => updateCinematic("loveLetterContent", e.target.value)} rows={5} />
        </Field>
      </SectionCard>

      <SectionCard title="Music Section (Birthday Song)">
        <Field label="Section Title">
          <Input value={data.bday6?.songSectionTitle || ""} onChange={e => updateBday6("songSectionTitle", e.target.value)} />
        </Field>
        <Field label="Section Subtitle">
          <Input value={data.bday6?.songSectionSubtitle || ""} onChange={e => updateBday6("songSectionSubtitle", e.target.value)} />
        </Field>
        <Field label="No Music Warning">
          <Input value={data.bday6?.noMusicText || ""} onChange={e => updateBday6("noMusicText", e.target.value)} />
        </Field>
        <Field label="Song URL">
          <Input value={data.cinematicBirthday?.songAudioUrl || ""} onChange={e => updateCinematic("songAudioUrl", e.target.value)} />
        </Field>
        <Field label="Song Lyrics">
          <Input value={data.cinematicBirthday?.songLyrics || ""} onChange={e => updateCinematic("songLyrics", e.target.value)} rows={4} />
        </Field>
      </SectionCard>

      <SectionCard title="Gallery Section">
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-1">
            <Field label="Section Icon">
              <Input value={data.bday6?.gallerySectionIcon || ""} onChange={e => updateBday6("gallerySectionIcon", e.target.value)} />
            </Field>
          </div>
          <div className="col-span-2">
            <Field label="Section Title">
              <Input value={data.bday6?.gallerySectionTitle || ""} onChange={e => updateBday6("gallerySectionTitle", e.target.value)} />
            </Field>
          </div>
        </div>
        <Field label="Section Subtitle">
          <Input value={data.bday6?.gallerySectionSubtitle || ""} onChange={e => updateBday6("gallerySectionSubtitle", e.target.value)} />
        </Field>
      </SectionCard>

      <SectionCard title="Footer">
        <Field label="Footer Text">
          <Input value={data.bday6?.footerText || ""} onChange={e => updateBday6("footerText", e.target.value)} />
        </Field>
      </SectionCard>
    </>
  );
}

function MusicTab({ data, set }) {
  return (
    <SectionCard title="Background Music">
      <Field label="Audio URL (.mp3 or .ogg)" hint="Use a publicly accessible direct link">
        <Input
          value={data.musicUrl}
          onChange={e => set("musicUrl", e.target.value)}
          placeholder="https://upload.wikimedia.org/.../Nocturne.mp3"
        />
      </Field>
      <Toggle
        checked={data.musicAutoplay}
        onChange={v => set("musicAutoplay", v)}
        label="Auto-play when site unlocks"
      />
      <div className="mt-4 p-3 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-400">
        <AlertCircle size={12} className="inline mr-1 text-yellow-400" />
        Browsers may block autoplay unless the user has interacted with the page first.
        The 10-tap lockscreen interaction bypasses this policy.
      </div>
    </SectionCard>
  );
}

function VirtualGiftTab({ data, set }) {
  return (
    <>
      <SectionCard title="Gift Box Message">
        <Field label="Recipient Name">
          <Input value={data.giftRecipient} onChange={e => set("giftRecipient", e.target.value)} placeholder="Maleesha" />
        </Field>
        <Field label="Hidden Message" hint="Revealed when the gift box is opened">
          <Input value={data.giftMessage} onChange={e => set("giftMessage", e.target.value)} rows={3} placeholder="You deserve all the flowers..." />
        </Field>
      </SectionCard>

      <SectionCard title="Pop-up Flower Bouquet">
        <Field label="Bouquet Image URL" hint="Use a transparent PNG for best results">
          <Input value={data.bouquetImageUrl} onChange={e => set("bouquetImageUrl", e.target.value)} placeholder="https://pngimg.com/uploads/bouquet/..." />
        </Field>
        {data.bouquetImageUrl && (
          <div className="mt-3 flex justify-center">
            <img loading="lazy" src={data.bouquetImageUrl} alt="Bouquet Preview" className="h-32 object-contain rounded-lg border border-slate-700" />
          </div>
        )}
      </SectionCard>
    </>
  );
}

function MilestonesTab({ data, setMilestones }) {
  const add = () => setMilestones(prev => [
    ...prev,
    {
      id: uid(),
      title: "A Special Moment",
      date: "March 12, 2022",
      description: "Describe this memory…",
      imageUrl: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80",
      alignment: "left",
      rotate: "-rotate-2",
    }
  ]);

  const remove = id => setMilestones(prev => prev.filter(m => m.id !== id));

  const update = (id, field, value) =>
    setMilestones(prev => prev.map(m => m.id === id ? { ...m, [field]: value } : m));

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <p className="text-slate-400 text-sm">{data.milestones.length} milestone{data.milestones.length !== 1 ? "s" : ""}</p>
        <button
          onClick={add}
          className="flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
        >
          <Plus size={15} /> Add Milestone
        </button>
      </div>

      <div className="space-y-4">
        {data.milestones.map((m, i) => (
          <div key={m.id} className="bg-slate-800 border border-slate-700 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-rose-400 uppercase tracking-widest">#{i + 1}</span>
              <button
                onClick={() => remove(m.id)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-700 transition"
              >
                <Trash2 size={15} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Title">
                <Input value={m.title} onChange={e => update(m.id, "title", e.target.value)} placeholder="The Day We Met" />
              </Field>
              <Field label="Date">
                <Input value={m.date} onChange={e => update(m.id, "date", e.target.value)} placeholder="March 12, 2022" />
              </Field>
            </div>
            <Field label="Description">
              <Input value={m.description} onChange={e => update(m.id, "description", e.target.value)} rows={2} />
            </Field>
            <Field label="Image URL">
              <Input value={m.imageUrl} onChange={e => update(m.id, "imageUrl", e.target.value)} placeholder="https://..." />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Alignment">
                <select
                  value={m.alignment}
                  onChange={e => update(m.id, "alignment", e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option value="left">Left</option>
                  <option value="right">Right</option>
                </select>
              </Field>
              <Field label="Photo Tilt">
                <select
                  value={m.rotate}
                  onChange={e => update(m.id, "rotate", e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option value="-rotate-2">Slight Left Tilt</option>
                  <option value="-rotate-1">Small Left Tilt</option>
                  <option value="rotate-1">Small Right Tilt</option>
                  <option value="rotate-2">Slight Right Tilt</option>
                  <option value="rotate-3">More Right Tilt</option>
                </select>
              </Field>
            </div>
          </div>
        ))}

        {data.milestones.length === 0 && (
          <div className="text-center py-16 text-slate-500 border-2 border-dashed border-slate-700 rounded-xl">
            <MapPin size={32} className="mx-auto mb-3 opacity-40" />
            <p className="text-sm">No milestones yet. Click "Add Milestone" to begin.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function GalleryTab({ data, set }) {
  const addSupporting = () =>
    set("gallery", {
      ...data.gallery,
      supporting: [
        ...data.gallery.supporting,
        {
          id: uid(),
          url: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80",
          caption: "A memory",
        },
      ],
    });

  const removeSupporting = id =>
    set("gallery", {
      ...data.gallery,
      supporting: data.gallery.supporting.filter(s => s.id !== id),
    });

  const updateSupporting = (id, field, value) =>
    set("gallery", {
      ...data.gallery,
      supporting: data.gallery.supporting.map(s =>
        s.id === id ? { ...s, [field]: value } : s
      ),
    });

  const updateCenter = (field, value) =>
    set("gallery", { ...data.gallery, [field]: value });

  return (
    <>
      <SectionCard title="Center (Hero) Image">
        <Field label="Image URL" hint="This uses a ripped-paper clip-path mask">
          <Input
            value={data.gallery.centerImage}
            onChange={e => updateCenter("centerImage", e.target.value)}
            placeholder="https://..."
          />
        </Field>
        <Field label="Caption">
          <Input
            value={data.gallery.centerCaption}
            onChange={e => updateCenter("centerCaption", e.target.value)}
            placeholder="Us, always ❤️"
          />
        </Field>
        {data.gallery.centerImage && (
          <img
            src={data.gallery.centerImage}
            alt="center preview"
            className="mt-3 w-32 h-32 object-cover rounded-lg border border-slate-700"
          />
        )}
      </SectionCard>

      <SectionCard title="Supporting Photos">
        <div className="flex justify-between items-center mb-4">
          <p className="text-slate-400 text-sm">{data.gallery.supporting.length} photo{data.gallery.supporting.length !== 1 ? "s" : ""}</p>
          <button
            onClick={addSupporting}
            className="flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
          >
            <Plus size={15} /> Add Photo
          </button>
        </div>

        <div className="space-y-3">
          {data.gallery.supporting.map((s, i) => (
            <div key={s.id} className="bg-slate-900 border border-slate-700 rounded-xl p-4 flex gap-4 items-start">
              {s.url && (
                <img loading="lazy" src={s.url} alt="thumb" className="w-14 h-14 object-cover rounded-lg flex-shrink-0 border border-slate-700" />
              )}
              <div className="flex-1 min-w-0 space-y-2">
                <Input
                  value={s.url}
                  onChange={e => updateSupporting(s.id, "url", e.target.value)}
                  placeholder="Image URL"
                />
                <Input
                  value={s.caption}
                  onChange={e => updateSupporting(s.id, "caption", e.target.value)}
                  placeholder="Caption"
                />
              </div>
              <button
                onClick={() => removeSupporting(s.id)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-700 transition flex-shrink-0"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}

          {data.gallery.supporting.length === 0 && (
            <div className="text-center py-10 text-slate-500 border-2 border-dashed border-slate-700 rounded-xl">
              <Image size={28} className="mx-auto mb-2 opacity-40" />
              <p className="text-sm">No supporting images yet.</p>
            </div>
          )}
        </div>
      </SectionCard>
    </>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────
const initialState = {
  coupleName:      defaultData.coupleName,
  coupleEmoji:     defaultData.coupleEmoji,
  heroSubtitle:    defaultData.heroSubtitle,
  heroDate:        defaultData.heroDate,
  heroImageUrl:    defaultData.heroImageUrl,
  loveLetterText:  defaultData.loveLetterText,
  lockScreenPrompt:defaultData.lockScreenPrompt,
  valentineMessage:defaultData.valentineMessage,

  musicUrl:        "https://upload.wikimedia.org/wikipedia/commons/6/6f/Nocturne_in_E_flat_major%2C_Op._9_no._2.mp3",
  musicAutoplay:   true,

  giftRecipient:   "Maleesha",
  giftMessage:     "You deserve all the flowers in the world. Here's a virtual bouquet for you, filled with my endless love, hugs, and a promise to always make you smile.",
  bouquetImageUrl: "https://pngimg.com/uploads/bouquet/bouquet_PNG48.png",

  passcode:   defaultData.passcode || {
    title: "Enter Code",
    hint: "Hint: The day you finally said 'YES' to me.",
    targetPasscode: "0214",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4"
  },
  bday6:             defaultData.bday6 || {},
  cinematicBirthday: defaultData.cinematicBirthday || {},
  milestones: defaultData.milestones,
  gallery:    defaultData.gallery,
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("general");
  const [data, setData] = useState(initialState);
  const [savedFlash, setSavedFlash] = useState(false);

  const set = (key, value) => setData(prev => ({ ...prev, [key]: value }));
  const setMilestones = updater => setData(prev => ({
    ...prev,
    milestones: typeof updater === "function" ? updater(prev.milestones) : updater,
  }));

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url;
    a.download = "siteData.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSave = () => {
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 2000);
    // In a real app this would POST to an API endpoint
  };

  const activeTabObj = TABS.find(t => t.id === activeTab);

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* ── Sidebar ── */}
      <aside className="w-64 flex-shrink-0 bg-slate-900 border-r border-slate-800 flex flex-col">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-rose-600 rounded-lg flex items-center justify-center">
              <Heart size={16} fill="white" color="white" />
            </div>
            <div>
              <p className="text-sm font-bold text-white leading-none">Celebration</p>
              <p className="text-[10px] text-slate-500 font-medium tracking-wider uppercase">Admin Dashboard</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {TABS.map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  active
                    ? "bg-rose-600/20 text-rose-400 border border-rose-600/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                }`}
              >
                <Icon size={16} />
                {tab.label}
                {active && <ChevronRight size={14} className="ml-auto" />}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <a
            href="http://localhost:5173"
            target="_blank"
            rel="noreferrer"
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-700 transition"
          >
            <ExternalLink size={13} /> Preview Site
          </a>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-16 flex-shrink-0 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6">
          <div>
            <h1 className="text-base font-bold text-white">{activeTabObj?.label}</h1>
            <p className="text-xs text-slate-500">
              Editing: <span className="text-rose-400 font-medium">{data.coupleName || "—"}</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={exportJson}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 text-sm font-medium transition"
            >
              <Download size={15} /> Export JSON
            </button>
            <button
              onClick={handleSave}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${
                savedFlash
                  ? "bg-green-600 text-white"
                  : "bg-rose-600 hover:bg-rose-500 text-white"
              }`}
            >
              {savedFlash ? <><Check size={15} /> Saved!</> : <><Save size={15} /> Save Changes</>}
            </button>
          </div>
        </header>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto">
            {activeTab === "general"    && <GeneralTab data={data} set={set} />}
            {activeTab === "passcode"   && <PasscodeTab data={data} set={set} />}
            {activeTab === "landing"    && <LandingPageTab data={data} set={set} />}
            {activeTab === "music"      && <MusicTab data={data} set={set} />}
            {activeTab === "gift"       && <VirtualGiftTab data={data} set={set} />}
            {activeTab === "milestones" && <MilestonesTab data={data} setMilestones={setMilestones} />}
            {activeTab === "gallery"    && <GalleryTab data={data} set={set} />}
          </div>
        </main>

        {/* Status bar */}
        <footer className="h-8 bg-slate-900 border-t border-slate-800 flex items-center px-6 gap-4">
          <span className="text-[11px] text-slate-600">
            {data.milestones.length} milestones · {data.gallery.supporting.length} gallery photos
          </span>
          <span className="text-[11px] text-slate-700">|</span>
          <span className="text-[11px] text-slate-600">Changes are in-memory — use Export JSON to save</span>
        </footer>
      </div>
    </div>
  );
}
