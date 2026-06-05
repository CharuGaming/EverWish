import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getSite, saveSite, uploadImage, deleteImage } from '../api';
import {
  Save, ArrowLeft, Upload, Loader2, CheckCircle2,
  Plus, Trash2, Settings, Music, Gift, MapPin, Image,
  ExternalLink, AlertTriangle, ToggleLeft, ToggleRight, Layers, Sun, Moon, Heart,
  Share2
} from 'lucide-react';

const toLocalDateTimeString = (dateOrStr) => {
  if (!dateOrStr) return '';
  const date = new Date(dateOrStr);
  if (isNaN(date.getTime())) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

// ── Shared primitives ─────────────────────────────────────────────
function Label({ children }) {
  return <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">{children}</label>;
}

function TextInput({ value, onChange, placeholder, type = 'text' }) {
  return (
    <input
      type={type}
      value={value || ''}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full bg-white/40 dark:bg-black/30 backdrop-blur-md border border-white/60 dark:border-white/10 rounded-2xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:bg-white/60 dark:focus:bg-white/20 focus:ring-2 focus:ring-rose-500/50 shadow-inner transition-all"
    />
  );
}

function TextArea({ value, onChange, placeholder, rows = 3 }) {
  return (
    <textarea
      rows={rows}
      value={value || ''}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full bg-white/40 dark:bg-black/30 backdrop-blur-md border border-white/60 dark:border-white/10 rounded-2xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:bg-white/60 dark:focus:bg-white/20 focus:ring-2 focus:ring-rose-500/50 shadow-inner transition-all resize-none"
    />
  );
}

function Toggle({ checked, onChange, label }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none group">
      <div onClick={() => onChange(!checked)}
        className={`relative w-12 h-6 rounded-full transition-colors shadow-inner ${checked ? 'bg-gradient-to-r from-rose-500 to-pink-500' : 'bg-slate-300 dark:bg-slate-700'}`}>
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${checked ? 'translate-x-6' : 'translate-x-0'}`} />
      </div>
      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{label}</span>
    </label>
  );
}

function Card({ title, children }) {
  return (
    <div className="bg-white/50 dark:bg-black/20 backdrop-blur-xl border border-white/60 dark:border-white/10 rounded-[2rem] p-6 md:p-8 mb-6 shadow-xl shadow-black/5">
      {title && <h3 className="text-xs font-black text-rose-500 uppercase tracking-[0.2em] mb-6">{title}</h3>}
      {children}
    </div>
  );
}

// ── Image Upload Field ────────────────────────────────────────────
function ImageField({ label, hint, value, onChange }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef();

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const res = await uploadImage(file);
      if (res.success) {
        onChange(res.url);
      } else {
        setError(res.message || 'Upload failed');
      }
    } catch {
      setError('Network error. Is the backend running?');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDelete = async () => {
    if (!value) return;
    if (!confirm('Are you sure you want to delete this file from the cloud?')) return;
    
    setUploading(true);
    try {
      if (value.includes('cloudinary.com')) {
        await deleteImage(value);
      }
      onChange(''); // clear field
    } catch {
      setError('Failed to delete file. It might already be removed.');
      onChange(''); // clear field anyway
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mb-5 relative">
      <Label>{label}</Label>
      {hint && <p className="text-[11px] text-slate-500 mb-2">{hint}</p>}

      <div className="flex gap-2">
        <input
          value={value || ''}
          onChange={e => onChange(e.target.value)}
          placeholder="https://... (or upload below)"
          className="flex-1 bg-white/40 dark:bg-black/30 backdrop-blur-md border border-white/60 dark:border-white/10 rounded-2xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:bg-white/60 dark:focus:bg-white/20 focus:ring-2 focus:ring-rose-500/50 shadow-inner transition-all"
        />
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 bg-gradient-to-r from-slate-200 to-slate-100 dark:from-slate-800 dark:to-slate-700 hover:from-white hover:to-slate-100 dark:hover:from-slate-700 dark:hover:to-slate-600 disabled:opacity-50 text-slate-700 dark:text-slate-200 text-xs font-bold px-4 py-3 rounded-2xl transition-all shadow-sm border border-white/60 dark:border-white/10 whitespace-nowrap"
        >
          {uploading ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
          {uploading ? 'Uploading…' : 'Upload'}
        </button>
        <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
      </div>

      {error && (
        <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
          <AlertTriangle size={11} /> {error}
        </p>
      )}

      {value && !error && (
        <div className="mt-3 relative inline-block group">
          <img src={value} alt="preview" className="h-20 w-auto object-contain rounded-lg border border-slate-700 bg-slate-900" />
          <button
            onClick={handleDelete}
            disabled={uploading}
            title="Delete File from Cloud"
            className="absolute -top-2 -right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-transform hover:scale-110 disabled:opacity-50"
          >
            <Trash2 size={12} />
          </button>
        </div>
      )}
    </div>
  );
}

// ── Audio Upload Field ────────────────────────────────────────────
function AudioField({ label, hint, value, onChange }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef();

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const res = await uploadImage(file);
      if (res.success) {
        onChange(res.url);
      } else {
        setError(res.message || 'Upload failed');
      }
    } catch {
      setError('Network error. Is the backend running?');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDelete = async () => {
    if (!value) return;
    if (!confirm('Are you sure you want to delete this audio from the cloud?')) return;
    
    setUploading(true);
    try {
      if (value.includes('cloudinary.com')) {
        await deleteImage(value);
      }
      onChange('');
    } catch {
      setError('Failed to delete audio.');
      onChange('');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mb-5 relative">
      <Label>{label}</Label>
      {hint && <p className="text-[11px] text-slate-500 mb-2">{hint}</p>}

      <div className="flex gap-2">
        <input
          value={value || ''}
          onChange={e => onChange(e.target.value)}
          placeholder="https://... (or upload audio below)"
          className="flex-1 bg-white/40 dark:bg-black/30 backdrop-blur-md border border-white/60 dark:border-white/10 rounded-2xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:bg-white/60 dark:focus:bg-white/20 focus:ring-2 focus:ring-rose-500/50 shadow-inner transition-all"
        />
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 bg-gradient-to-r from-slate-200 to-slate-100 dark:from-slate-800 dark:to-slate-700 hover:from-white hover:to-slate-100 dark:hover:from-slate-700 dark:hover:to-slate-600 disabled:opacity-50 text-slate-700 dark:text-slate-200 text-xs font-bold px-4 py-3 rounded-2xl transition-all shadow-sm border border-white/60 dark:border-white/10 whitespace-nowrap"
        >
          {uploading ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
          {uploading ? 'Uploading…' : 'Upload Audio'}
        </button>
        <input ref={inputRef} type="file" accept="audio/*" onChange={handleFile} className="hidden" />
      </div>

      {error && (
        <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
          <AlertTriangle size={11} /> {error}
        </p>
      )}

      {value && !error && (
        <div className="mt-3 relative w-full md:w-2/3 lg:w-1/2 flex items-center gap-3">
          <div className="flex-1 p-3 bg-slate-900 border border-slate-700 rounded-lg">
            <audio controls src={value} className="w-full h-8" />
          </div>
          <button
            onClick={handleDelete}
            disabled={uploading}
            title="Delete Audio from Cloud"
            className="flex-shrink-0 p-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-md transition-colors disabled:opacity-50"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

// ── Video Upload Field ────────────────────────────────────────────
function VideoField({ label, hint, value, onChange }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef();

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const res = await uploadImage(file);
      if (res.success) {
        onChange(res.url);
      } else {
        setError(res.message || 'Upload failed');
      }
    } catch {
      setError('Network error. Is the backend running?');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDelete = async () => {
    if (!value) return;
    if (!confirm('Are you sure you want to delete this video from the cloud?')) return;
    
    setUploading(true);
    try {
      if (value.includes('cloudinary.com')) {
        await deleteImage(value);
      }
      onChange('');
    } catch {
      setError('Failed to delete video.');
      onChange('');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mb-5 relative">
      <Label>{label}</Label>
      {hint && <p className="text-[11px] text-slate-500 mb-2">{hint}</p>}

      <div className="flex gap-2">
        <input
          value={value || ''}
          onChange={e => onChange(e.target.value)}
          placeholder="https://... (or upload video below)"
          className="flex-1 bg-white/40 dark:bg-black/30 backdrop-blur-md border border-white/60 dark:border-white/10 rounded-2xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:bg-white/60 dark:focus:bg-white/20 focus:ring-2 focus:ring-rose-500/50 shadow-inner transition-all"
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 bg-gradient-to-r from-slate-200 to-slate-100 dark:from-slate-800 dark:to-slate-700 hover:from-white hover:to-slate-100 dark:hover:from-slate-700 dark:hover:to-slate-600 disabled:opacity-50 text-slate-700 dark:text-slate-200 text-xs font-bold px-4 py-3 rounded-2xl transition-all shadow-sm border border-white/60 dark:border-white/10 whitespace-nowrap"
        >
          {uploading ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
          {uploading ? 'Uploading…' : 'Upload Video'}
        </button>
        <input ref={inputRef} type="file" accept="video/*" onChange={handleFile} className="hidden" />
      </div>

      {error && (
        <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
          <AlertTriangle size={11} /> {error}
        </p>
      )}

      {value && !error && (
        <div className="mt-3 relative inline-block group">
          <div className="p-3 bg-slate-900 border border-slate-700 rounded-lg max-w-xs">
            <video src={value} controls className="w-full rounded-md max-h-40 object-cover" />
          </div>
          <button
            onClick={handleDelete}
            disabled={uploading}
            title="Delete Video from Cloud"
            className="absolute -top-3 -right-3 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-transform hover:scale-110 disabled:opacity-50"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

// ── Tabs ──────────────────────────────────────────────────────────
const TABS = [
  { id: 'general',    label: 'General',      Icon: Settings },
  { id: 'music',      label: 'Music',        Icon: Music    },
  { id: 'gift',       label: 'Virtual Gift', Icon: Gift     },
  { id: 'thingsToDo', label: 'Things To Do', Icon: CheckCircle2 },
  { id: 'milestones', label: 'Milestones',   Icon: MapPin   },
  { id: 'gallery',    label: 'Gallery',      Icon: Image    },
  { id: 'socialLinks',label: 'Social Links', Icon: Share2   },
];

const CINEMATIC_TABS = [
  { id: 'general',    label: 'General & Videos',  Icon: Settings },
  { id: 'music',      label: 'Music & Lyrics',    Icon: Music    },
  { id: 'loveLetter', label: 'Love Letter',       Icon: Gift     },
  { id: 'milestones', label: 'Milestones',        Icon: MapPin   },
  { id: 'gallery',    label: 'Photo Gallery',     Icon: Image    },
  { id: 'reasons',    label: 'Why I Love You',    Icon: Heart    },
  { id: 'socialLinks',label: 'Social Links',      Icon: Share2   },
];

const VALENTINE_TABS = [
  { id: 'general',     label: 'General',           Icon: Settings },
  { id: 'music',       label: 'Music',             Icon: Music    },
  { id: 'gift',        label: 'Virtual Gift',      Icon: Gift     },
  { id: 'thingsToDo',  label: 'Things To Do',      Icon: CheckCircle2 },
  { id: 'match',       label: 'Memory Match',      Icon: Image    },
  { id: 'reasons',     label: 'Why I Love You',    Icon: MapPin   },
  { id: 'scratch',     label: 'Scratch Cards',     Icon: Image    },
  { id: 'valFeatures', label: 'Valentine Features', Icon: Heart   },
  { id: 'socialLinks', label: 'Social Links',      Icon: Share2   },
];

const PROPOSAL_TABS = [
  { id: 'general',    label: 'General',        Icon: Settings },
  { id: 'music',      label: 'Music',          Icon: Music    },
  { id: 'thingsToDo', label: 'Things To Do',   Icon: CheckCircle2 },
  { id: 'scratch',    label: 'Scratch Gallery', Icon: Image   },
  { id: 'activities', label: 'Date Planner',   Icon: MapPin   },
  { id: 'socialLinks',label: 'Social Links',   Icon: Share2   },
];

const CUSTOM_TABS = [
  { id: 'modules',    label: 'Module Builder', Icon: Layers   },
  { id: 'general',   label: 'General',         Icon: Settings },
  { id: 'music',     label: 'Music',           Icon: Music    },
  { id: 'thingsToDo',label: 'Things To Do',    Icon: CheckCircle2 },
  { id: 'socialLinks',label: 'Social Links',   Icon: Share2   },
];

const BIRTHDAY_TABS = [
  { id: 'bday_general', label: 'Birthday Settings', Icon: Settings },
  { id: 'gallery',      label: 'Gallery',           Icon: Image    },
  { id: 'music',        label: 'Music',             Icon: Music    },
  { id: 'sectionOrder', label: 'Section Order',     Icon: Layers   },
  { id: 'socialLinks',  label: 'Social Links',      Icon: Share2   },
];

const CINEMATIC_BDAY_TABS = [
  { id: 'cinbday_general', label: 'General & Videos', Icon: Settings },
  { id: 'cinbday_gift',    label: 'Gift Reveal',      Icon: Gift     },
  { id: 'cinbday_recap',   label: 'Year Recap',       Icon: CheckCircle2 },
  { id: 'cinbday_music',   label: 'Music & Lyrics',   Icon: Music    },
  { id: 'cinbday_gallery', label: 'Photo Gallery',    Icon: Image    },
  { id: 'socialLinks',     label: 'Social Links',     Icon: Share2   },
];

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;

// ── Section components ────────────────────────────────────────────
// ── Valentine Premium Features tab ──────────────────────────────────
function ValentineFeaturesTab({ doc, setDoc }) {
  const ll  = doc.loveLock   || {};
  const tc  = doc.timeCapsule|| {};
  const jar = doc.reasonsJar || [];

  const upLock = (f, v) => setDoc(d => ({ ...d, loveLock:    { ...(d.loveLock   ||{}), [f]: v } }));
  const upTC   = (f, v) => setDoc(d => ({ ...d, timeCapsule: { ...(d.timeCapsule||{}), [f]: v } }));

  return (
    <>
      {/* Love Lock */}
      <Card title="🔒 Virtual Love Lock">
        <p className="text-[11px] text-slate-500 mb-4">
          A 3D padlock featuring your initials. Visitors tap it to "lock your love" with a satisfying snap animation.
        </p>
        <div className="mb-5">
          <Toggle
            checked={ll.isEnabled ?? false}
            onChange={v => upLock('isEnabled', v)}
            label="Enable Love Lock"
          />
        </div>
        <div className={`transition-opacity ${!ll.isEnabled ? 'opacity-40 pointer-events-none' : ''}`}>
          <Label>Initials (e.g. "M & C")</Label>
          <TextInput
            value={ll.initials || ''}
            onChange={e => upLock('initials', e.target.value)}
            placeholder="M & C"
          />
        </div>
      </Card>

      {/* Reasons Jar */}
      <Card title="💌 Reasons I Love You Jar">
        <p className="text-[11px] text-slate-500 mb-4">
          Visitors draw a random "reason" from a glassmorphism jar. Add one reason per entry.
        </p>
        {jar.map((reason, i) => (
          <div key={i} className="flex gap-2 mb-3">
            <TextInput
              value={reason}
              onChange={e => setDoc(d => ({ ...d, reasonsJar: d.reasonsJar.map((r, j) => j === i ? e.target.value : r) }))}
              placeholder={`Reason ${i + 1}`}
            />
            <button
              onClick={() => setDoc(d => ({ ...d, reasonsJar: d.reasonsJar.filter((_, j) => j !== i) }))}
              className="shrink-0 p-2 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors cursor-pointer text-xs font-bold"
            >
              ✕
            </button>
          </div>
        ))}
        <button
          onClick={() => setDoc(d => ({ ...d, reasonsJar: [...(d.reasonsJar || []), ''] }))}
          className="w-full py-2.5 rounded-2xl border-2 border-dashed border-slate-300 dark:border-white/20 text-slate-500 text-xs font-bold hover:border-rose-400 hover:text-rose-500 transition-colors cursor-pointer"
        >
          + Add a Reason
        </button>
      </Card>

      {/* Time Capsule */}
      <Card title="⏳ Time Capsule Vault">
        <p className="text-[11px] text-slate-500 mb-5">
          A sealed digital vault. If you set an unlock date, visitors see a countdown timer until then. Once it passes, the vault opens to reveal the message and media.
        </p>
        <div className="mb-5">
          <Label>Unlock Date &amp; Time</Label>
          <input
            type="datetime-local"
            value={toLocalDateTimeString(tc.unlockDate)}
            onChange={e => {
              const val = e.target.value;
              upTC('unlockDate', val ? new Date(val).toISOString() : null);
            }}
            className="w-full bg-white/40 dark:bg-black/30 backdrop-blur-md border border-white/60 dark:border-white/10 rounded-2xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/50 shadow-inner transition-all"
          />
          {tc.unlockDate && (
            <button onClick={() => upTC('unlockDate', null)}
              className="text-xs text-red-400 hover:text-red-600 underline mt-1 cursor-pointer">
              Clear date
            </button>
          )}
        </div>
        <div className="mb-5">
          <Label>Message / Love Letter</Label>
          <TextArea
            value={tc.message || ''}
            onChange={e => upTC('message', e.target.value)}
            rows={5}
            placeholder="Write a heartfelt message to be revealed on the unlock date…"
          />
        </div>
        <ImageField
          label="Photo or Video (Optional)"
          hint="Upload an image or video to be revealed inside the vault"
          value={tc.mediaUrl || ''}
          onChange={v => upTC('mediaUrl', v)}
        />
        {tc.mediaUrl && (
          <button onClick={() => upTC('mediaUrl', '')}
            className="text-xs text-red-400 hover:text-red-600 underline mt-1 block cursor-pointer">
            Remove media
          </button>
        )}
      </Card>
    </>
  );
}

function GeneralTab({ doc, setDoc }) {
  const g = doc.general || {};
  const imgs = doc.images || {};
  const up = (field, val) => setDoc(d => ({ ...d, general: { ...d.general, [field]: val } }));
  const upImg = (field, val) => setDoc(d => ({ ...d, images: { ...d.images, [field]: val } }));

  // Helper for timelineDates
  const upTimeline = (field, val) => setDoc(d => ({
    ...d,
    general: {
      ...d.general,
      timelineDates: {
        ...(d.general?.timelineDates || {}),
        [field]: val
      }
    }
  }));

  const isModern = doc.templateType === 'modern';

  return (
    <>
      <Card title="Couple Identity">
        <div className="mb-5"><Label>Couple's Names</Label><TextInput value={g.coupleName} onChange={e => up('coupleName', e.target.value)} placeholder="Name & Name" /></div>
        <div className="mb-0"><Label>Couple Emoji</Label><TextInput value={g.coupleEmoji} onChange={e => up('coupleEmoji', e.target.value)} placeholder="💌" /></div>
      </Card>

      {isModern ? (
        <Card title="Memories Setup">
          <ImageField 
            label="Primary Memory Image" 
            hint="Main photo shown in the center of the memories page" 
            value={imgs.heroImageUrl} 
            onChange={v => upImg('heroImageUrl', v)} 
          />
          <div className="mb-5">
            <Label>Romantic Quote</Label>
            <TextArea 
              value={g.heroSubtitle} 
              onChange={e => up('heroSubtitle', e.target.value)} 
              placeholder="A beautiful romantic quote or caption…" 
              rows={4}
            />
          </div>
          <div className="mb-5">
            <Label>Love Message / Letter</Label>
            <TextArea 
              value={g.loveLetterText} 
              onChange={e => up('loveLetterText', e.target.value)} 
              placeholder="Write a special love message or letter to show on the page…" 
              rows={6}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Start Date / Year</Label>
              <TextInput 
                value={g.timelineDates?.startDate} 
                onChange={e => upTimeline('startDate', e.target.value)} 
                placeholder="e.g. 2020" 
              />
            </div>
            <div>
              <Label>Current Date / Year</Label>
              <TextInput 
                value={g.timelineDates?.endDate} 
                onChange={e => upTimeline('endDate', e.target.value)} 
                placeholder="e.g. 2026" 
              />
            </div>
          </div>
        </Card>
      ) : (
        <Card title="Hero Section">
          <ImageField label="Hero Image" hint="Main polaroid photo shown in the hero section" value={imgs.heroImageUrl} onChange={v => upImg('heroImageUrl', v)} />
          <div className="mb-5"><Label>Date Text</Label><TextInput value={g.heroDate} onChange={e => up('heroDate', e.target.value)} placeholder="February 14 · Forever" /></div>
          <div className="mb-5"><Label>Subtitle</Label><TextInput value={g.heroSubtitle} onChange={e => up('heroSubtitle', e.target.value)} /></div>
          <div className="mb-0"><Label>Love Letter</Label><TextArea value={g.loveLetterText} onChange={e => up('loveLetterText', e.target.value)} rows={5} /></div>
        </Card>
      )}

      <Card title="Lock Screen">
        <div className="mb-5">
          <Label>Lock Screen Prompt</Label>
          <TextInput 
            value={g.lockScreenPrompt} 
            onChange={e => up('lockScreenPrompt', e.target.value)} 
            placeholder={isModern ? "Tap repeatedly to fill the meter" : "Tap until the screen is full red"}
          />
        </div>
        {!isModern && (
          <div className="mb-0">
            <Label>Unlock Message</Label>
            <TextInput value={g.valentineMessage} onChange={e => up('valentineMessage', e.target.value)} />
          </div>
        )}
      </Card>

      <ThemeColorsCard doc={doc} setDoc={setDoc} />
    </>
  );
}

function ThemeColorsCard({ doc, setDoc }) {
  const type = doc.templateType || 'polaroid';
  const colors = doc.themeColors?.[type] || {};

  const defaultPrimary = '#e11d48';
  const defaultBg = type === 'modern' ? '#f7f5f0' : (type === 'proposal' ? '#fdf2f8' : '#fff0f5');
  const defaultCard = type === 'proposal' ? '#c084fc' : '#ffccd5';

  const upColor = (field, val) => {
    setDoc(d => ({
      ...d,
      themeColors: {
        ...(d.themeColors || {}),
        [type]: {
          ...(d.themeColors?.[type] || {}),
          [field]: val
        }
      }
    }));
  };

  return (
    <Card title="Custom Theme Colors">
      <p className="text-[11px] text-slate-500 mb-5">Customize the colors for this active template ({type}) separately. They will apply directly to the page.</p>
      <div className="space-y-4">
        {/* Primary/Accent */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-10 rounded-lg overflow-hidden border border-slate-700 bg-slate-900 relative">
            <input type="color" value={colors.primary || defaultPrimary} onChange={e => upColor('primary', e.target.value)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            <div className="w-full h-full" style={{ backgroundColor: colors.primary || defaultPrimary }} />
          </div>
          <div className="flex-1">
            <Label>Primary / Accent Color</Label>
            <TextInput value={colors.primary || defaultPrimary} onChange={e => upColor('primary', e.target.value)} placeholder={defaultPrimary} />
          </div>
        </div>

        {/* Background */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-10 rounded-lg overflow-hidden border border-slate-700 bg-slate-900 relative">
            <input type="color" value={colors.background || defaultBg} onChange={e => upColor('background', e.target.value)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            <div className="w-full h-full" style={{ backgroundColor: colors.background || defaultBg }} />
          </div>
          <div className="flex-1">
            <Label>Background Color</Label>
            <TextInput value={colors.background || defaultBg} onChange={e => upColor('background', e.target.value)} placeholder={defaultBg} />
          </div>
        </div>

        {/* Optional Card Cover Color (valentine or proposal) */}
        {(type === 'valentine' || type === 'proposal') && (
          <div className="flex items-center gap-3">
            <div className="w-12 h-10 rounded-lg overflow-hidden border border-slate-700 bg-slate-900 relative">
              <input type="color" value={colors.cardColor || defaultCard} onChange={e => upColor('cardColor', e.target.value)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              <div className="w-full h-full" style={{ backgroundColor: colors.cardColor || defaultCard }} />
            </div>
            <div className="flex-1">
              <Label>{type === 'valentine' ? 'Memory Match Card Cover Color' : 'Scratch Card Cover Color'}</Label>
              <TextInput value={colors.cardColor || defaultCard} onChange={e => upColor('cardColor', e.target.value)} placeholder={defaultCard} />
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

function MusicTab({ doc, setDoc }) {
  const m = doc.music || {};
  const up = (f, v) => setDoc(d => ({ ...d, music: { ...d.music, [f]: v } }));
  return (
    <Card title="Global Music Player">
      <div className="mb-6">
        <Toggle checked={m.isEnabled ?? true} onChange={v => up('isEnabled', v)} label="Enable Music Player" />
        <p className="mt-2 text-[11px] text-slate-500 font-medium leading-relaxed">
          If enabled, a floating record player will appear on the site. Music will play automatically on the first scroll (or first tap).
        </p>
      </div>

      <div className={`transition-opacity ${m.isEnabled === false ? 'opacity-50 pointer-events-none' : ''}`}>
        <div className="mb-6">
          <AudioField
            label="Background Audio"
            hint="Upload an MP3/WAV file or paste a direct audio URL"
            value={m.audioUrl}
            onChange={v => up('audioUrl', v)}
          />
        </div>
        
        <div>
          <ImageField
            label="Record Thumbnail"
            hint="Upload a square image to act as the spinning record cover"
            value={m.thumbnailUrl}
            onChange={v => up('thumbnailUrl', v)}
          />
        </div>

        {m.audioUrl && m.audioUrl.includes('youtube.com') && (
          <p className="mt-4 text-xs text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 rounded-lg p-3 flex items-center gap-1.5">
            <AlertTriangle size={14} className="flex-shrink-0" />
            Note: YouTube URLs are web links and cannot be played directly by the HTML audio player. Please upload an MP3 file instead.
          </p>
        )}
      </div>
    </Card>
  );
}

function GiftTab({ doc, setDoc }) {
  const g = doc.gift || {};
  const imgs = doc.images || {};
  const up = (f, v) => setDoc(d => ({ ...d, gift: { ...d.gift, [f]: v } }));
  const upImg = v => setDoc(d => ({ ...d, images: { ...d.images, bouquetImageUrl: v } }));
  return (
    <>
      <Card title="Gift Message">
        <div className="mb-5"><Label>Recipient Name</Label><TextInput value={g.recipient} onChange={e => up('recipient', e.target.value)} placeholder="Maleesha" /></div>
        <div className="mb-0"><Label>Hidden Message</Label><TextArea value={g.message} onChange={e => up('message', e.target.value)} rows={4} /></div>
      </Card>
      <Card title="Flower Bouquet Image">
        <ImageField label="Bouquet PNG" hint="Use a transparent PNG for best visual results" value={imgs.bouquetImageUrl} onChange={upImg} />
      </Card>
    </>
  );
}

function MilestonesTab({ doc, setDoc }) {
  const milestones = doc.milestones || [];
  const add = () => setDoc(d => ({
    ...d,
    milestones: [...(d.milestones || []), {
      id: uid(), title: 'A Special Moment', date: 'March 12, 2022',
      description: 'Describe this memory…', imageUrl: '', alignment: 'left', rotate: '-rotate-2',
    }]
  }));
  const del = id => setDoc(d => ({ ...d, milestones: d.milestones.filter(m => m.id !== id) }));
  const upM = (id, f, v) => setDoc(d => ({ ...d, milestones: d.milestones.map(m => m.id === id ? { ...m, [f]: v } : m) }));

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <p className="text-slate-400 text-sm">{milestones.length} milestone{milestones.length !== 1 ? 's' : ''}</p>
        <button onClick={add} className="flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition">
          <Plus size={14} /> Add Milestone
        </button>
      </div>

      <div className="space-y-4">
        {milestones.map((m, i) => (
          <Card key={m.id}>
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-bold text-rose-400 uppercase tracking-widest">Milestone #{i + 1}</span>
              <button onClick={() => del(m.id)} className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-700 transition"><Trash2 size={14} /></button>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div><Label>Title</Label><TextInput value={m.title} onChange={e => upM(m.id, 'title', e.target.value)} /></div>
              <div><Label>Date</Label><TextInput value={m.date} onChange={e => upM(m.id, 'date', e.target.value)} /></div>
            </div>
            <div className="mb-3"><Label>Description</Label><TextArea value={m.description} onChange={e => upM(m.id, 'description', e.target.value)} rows={2} /></div>
            <ImageField label="Photo" value={m.imageUrl} onChange={v => upM(m.id, 'imageUrl', v)} />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Alignment</Label>
                <select value={m.alignment} onChange={e => upM(m.id, 'alignment', e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500">
                  <option value="left">Left</option>
                  <option value="right">Right</option>
                </select>
              </div>
              <div>
                <Label>Photo Tilt</Label>
                <select value={m.rotate} onChange={e => upM(m.id, 'rotate', e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500">
                  <option value="-rotate-2">Slight Left</option>
                  <option value="-rotate-1">Small Left</option>
                  <option value="rotate-1">Small Right</option>
                  <option value="rotate-2">Slight Right</option>
                  <option value="rotate-3">More Right</option>
                </select>
              </div>
            </div>
          </Card>
        ))}
        {milestones.length === 0 && (
          <div className="text-center py-14 border-2 border-dashed border-slate-700 rounded-xl text-slate-500">
            <MapPin size={28} className="mx-auto mb-2 opacity-40" />
            <p className="text-sm">No milestones yet. Click "Add Milestone".</p>
          </div>
        )}
      </div>
    </div>
  );
}

function GalleryTab({ doc, setDoc }) {
  const g = doc.gallery || { centerImage: '', centerCaption: '', supporting: [] };
  const upG = (f, v) => setDoc(d => ({ ...d, gallery: { ...d.gallery, [f]: v } }));
  const addPhoto = () => setDoc(d => ({
    ...d, gallery: { ...d.gallery, supporting: [...(d.gallery?.supporting || []), { id: uid(), url: '', caption: '' }] }
  }));
  const delPhoto = id => setDoc(d => ({ ...d, gallery: { ...d.gallery, supporting: d.gallery.supporting.filter(s => s.id !== id) } }));
  const upP = (id, f, v) => setDoc(d => ({
    ...d, gallery: { ...d.gallery, supporting: d.gallery.supporting.map(s => s.id === id ? { ...s, [f]: v } : s) }
  }));

  return (
    <>
      <Card title="Center (Hero) Image">
        <ImageField label="Center Image" hint="Displayed with a ripped-paper mask in the gallery" value={g.centerImage} onChange={v => upG('centerImage', v)} />
        <div><Label>Center Caption</Label><TextInput value={g.centerCaption} onChange={e => upG('centerCaption', e.target.value)} placeholder="Us, always ❤️" /></div>
      </Card>

      <Card title="Supporting Photos">
        <div className="flex justify-between items-center mb-4">
          <p className="text-slate-400 text-sm">{(g.supporting || []).length} photo{(g.supporting || []).length !== 1 ? 's' : ''}</p>
          <button onClick={addPhoto} className="flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition">
            <Plus size={14} /> Add Photo
          </button>
        </div>
        <div className="space-y-3">
          {(g.supporting || []).map((s) => (
            <div key={s.id} className="bg-slate-900 border border-slate-700 rounded-xl p-4">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs text-slate-500 font-mono">{s.id?.toString().slice(0, 8)}…</span>
                <button onClick={() => delPhoto(s.id)} className="p-1 text-slate-500 hover:text-red-400 transition"><Trash2 size={13} /></button>
              </div>
              <ImageField label="Photo" value={s.url} onChange={v => upP(s.id, 'url', v)} />
              <div><Label>Caption</Label><TextInput value={s.caption} onChange={e => upP(s.id, 'caption', e.target.value)} placeholder="A beautiful memory" /></div>
            </div>
          ))}
          {!g.supporting?.length && (
            <div className="text-center py-10 border-2 border-dashed border-slate-700 rounded-xl text-slate-500">
              <Image size={24} className="mx-auto mb-2 opacity-40" />
              <p className="text-sm">No supporting images yet.</p>
            </div>
          )}
        </div>
      </Card>
    </>
  );
}

// ── Valentine: Match Images tab ──────────────────────────────────
function ValentineMatchTab({ doc, setDoc }) {
  const images = doc.valentine?.matchImages || ['','','','',''];
  const [uploading, setUploading] = useState([false,false,false,false,false]);
  const [errors, setErrors] = useState(['','','','','']);
  const refs = [useRef(),useRef(),useRef(),useRef(),useRef()];

  const upImg = async (idx, file) => {
    if (!file) return;
    setUploading(u => { const n=[...u]; n[idx]=true; return n; });
    setErrors(e => { const n=[...e]; n[idx]=''; return n; });
    try {
      const res = await uploadImage(file);
      if (res.success) {
        setDoc(d => {
          const imgs = [...(d.valentine?.matchImages || ['','','','',''])];
          imgs[idx] = res.url;
          return { ...d, valentine: { ...(d.valentine||{}), matchImages: imgs } };
        });
      } else {
        setErrors(e => { const n=[...e]; n[idx]=res.message||'Upload failed'; return n; });
      }
    } catch { setErrors(e => { const n=[...e]; n[idx]='Network error'; return n; }); }
    finally { setUploading(u => { const n=[...u]; n[idx]=false; return n; }); }
  };

  const setUrl = (idx, val) => {
    setDoc(d => {
      const imgs = [...(d.valentine?.matchImages || ['','','','',''])];
      imgs[idx] = val;
      return { ...d, valentine: { ...(d.valentine||{}), matchImages: imgs } };
    });
  };

  return (
    <Card title="Memory Match Images (exactly 5)">
      <p className="text-[11px] text-slate-500 mb-5">Upload exactly 5 images. They will be duplicated (×2) and shuffled to form 10 cards in a heart shape.</p>
      <div className="space-y-4">
        {images.map((url, i) => (
          <div key={i}>
            <Label>Image {i+1}</Label>
            <div className="flex gap-2">
              <input value={url} onChange={e=>setUrl(i,e.target.value)} placeholder="https://..."
                className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500 transition" />
              <button onClick={()=>refs[i].current?.click()} disabled={uploading[i]}
                className="flex items-center gap-1.5 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-slate-200 text-xs font-semibold px-3 py-2 rounded-lg transition whitespace-nowrap">
                {uploading[i] ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
                {uploading[i] ? 'Uploading…' : 'Upload'}
              </button>
              <input ref={refs[i]} type="file" accept="image/*" onChange={e=>upImg(i,e.target.files?.[0])} className="hidden" />
            </div>
            {errors[i] && <p className="mt-1 text-xs text-red-400 flex items-center gap-1"><AlertTriangle size={11}/>{errors[i]}</p>}
            {url && !errors[i] && <img src={url} alt={`match-${i}`} className="mt-2 h-16 w-auto object-contain rounded-lg border border-slate-700 bg-slate-900" />}
          </div>
        ))}
      </div>
    </Card>
  );
}

// ── Valentine: Why I Love You tab ─────────────────────────────────
function ValentineReasonsTab({ doc, setDoc }) {
  const reasons = doc.valentine?.reasons || [];
  const add = () => setDoc(d => ({ ...d, valentine: { ...(d.valentine||{}), reasons:[...(d.valentine?.reasons||[]),''] } }));
  const del = i => setDoc(d => { const r=[...(d.valentine?.reasons||[])]; r.splice(i,1); return { ...d, valentine:{...(d.valentine||{}),reasons:r} }; });
  const upR = (i,v) => setDoc(d => { const r=[...(d.valentine?.reasons||[])]; r[i]=v; return { ...d, valentine:{...(d.valentine||{}),reasons:r} }; });
  return (
    <Card title="Why I Love You — Reasons List">
      <p className="text-[11px] text-slate-500 mb-5">Each reason appears as a floating card on the client page. Keep them short and heartfelt.</p>
      <div className="space-y-3 mb-4">
        {reasons.map((r,i) => (
          <div key={i} className="flex gap-2 items-center">
            <span className="text-rose-400 font-mono text-xs w-5 flex-shrink-0">#{i+1}</span>
            <TextInput value={r} onChange={e=>upR(i,e.target.value)} placeholder={`Reason ${i+1}…`} />
            <button onClick={()=>del(i)} className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-slate-700 rounded-lg transition flex-shrink-0"><Trash2 size={13}/></button>
          </div>
        ))}
        {reasons.length===0 && (
          <p className="text-center py-8 text-slate-600 text-sm border-2 border-dashed border-slate-700 rounded-xl">No reasons yet. Add one below.</p>
        )}
      </div>
      <button onClick={add} className="flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition">
        <Plus size={14}/> Add Reason
      </button>
    </Card>
  );
}

// ── Valentine: Scratch Memories tab ──────────────────────────────
function ValentineScratchTab({ doc, setDoc }) {
  const items = doc.valentine?.scratchMemories || [];
  const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const add = () => setDoc(d => ({ ...d, valentine:{ ...(d.valentine||{}), scratchMemories:[...(d.valentine?.scratchMemories||[]),{id:uid(),imageUrl:'',caption:''}] } }));
  const del = id => setDoc(d => ({ ...d, valentine:{ ...(d.valentine||{}), scratchMemories:d.valentine.scratchMemories.filter(s=>s.id!==id) } }));
  const upS = (id,f,v) => setDoc(d => ({ ...d, valentine:{ ...(d.valentine||{}), scratchMemories:d.valentine.scratchMemories.map(s=>s.id===id?{...s,[f]:v}:s) } }));
  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <p className="text-slate-400 text-sm">{items.length} scratch card{items.length!==1?'s':''}</p>
        <button onClick={add} className="flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition">
          <Plus size={14}/> Add Card
        </button>
      </div>
      <div className="space-y-4">
        {items.map((s,i) => (
          <Card key={s.id}>
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-bold text-rose-400 uppercase tracking-widest">Scratch Card #{i+1}</span>
              <button onClick={()=>del(s.id)} className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-700 transition"><Trash2 size={14}/></button>
            </div>
            <ImageField label="Memory Photo" value={s.imageUrl} onChange={v=>upS(s.id,'imageUrl',v)} />
            <div><Label>Caption (shown after scratch)</Label><TextInput value={s.caption} onChange={e=>upS(s.id,'caption',e.target.value)} placeholder="A beautiful memory…" /></div>
          </Card>
        ))}
        {items.length===0 && (
          <div className="text-center py-14 border-2 border-dashed border-slate-700 rounded-xl text-slate-500">
            <Image size={28} className="mx-auto mb-2 opacity-40"/>
            <p className="text-sm">No scratch cards yet. Click "Add Card".</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Proposal: General tab (proposal-specific fields) ─────────────
function ProposalGeneralTab({ doc, setDoc }) {
  const g  = doc.general  || {};
  const p  = doc.proposal || {};
  const up  = (f,v) => setDoc(d => ({ ...d, general:  { ...d.general,  [f]: v } }));
  const upP = (f,v) => setDoc(d => ({ ...d, proposal: { ...d.proposal, [f]: v } }));
  return (
    <>
      <Card title="Couple Identity">
        <div className="mb-5"><Label>Couple's Names</Label><TextInput value={g.coupleName} onChange={e => up('coupleName', e.target.value)} placeholder="Name & Name" /></div>
        <div className="mb-0"><Label>Couple Emoji</Label><TextInput value={g.coupleEmoji} onChange={e => up('coupleEmoji', e.target.value)} placeholder="💌" /></div>
      </Card>
      <Card title="Proposal Lockscreen">
        <div className="mb-0">
          <Label>Proposal Question</Label>
          <TextInput value={p.proposalText} onChange={e => upP('proposalText', e.target.value)} placeholder="Will you be my Valentine? 💕" />
          <p className="text-[11px] text-slate-500 mt-1.5">This text is shown prominently on the lockscreen with Yes/No buttons.</p>
        </div>
      </Card>
      <Card title="Physical Love Letter">
        <div className="mb-0">
          <Label>Love Letter Text</Label>
          <TextArea value={p.loveLetter} onChange={e => upP('loveLetter', e.target.value)} placeholder="My dearest love, every moment with you feels like a fairytale…" rows={8} />
        </div>
      </Card>
      <Card title="Virtual Gift">
        <ImageField label="Gift Image" hint="Upload a photo or illustration to reveal inside the gift box" value={p.giftImageUrl} onChange={v => upP('giftImageUrl', v)} />
        <div className="mb-0">
          <Label>Gift Message</Label>
          <TextArea value={p.giftMessage} onChange={e => upP('giftMessage', e.target.value)} placeholder="You deserve all the love in the world 💖" rows={4} />
        </div>
      </Card>
      <ThemeColorsCard doc={doc} setDoc={setDoc} />
    </>
  );
}

// ── Proposal: Scratch Gallery tab ────────────────────────────────
function ProposalScratchTab({ doc, setDoc }) {
  const uid2 = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const items = doc.proposal?.scratchGallery || [];
  const add = () => setDoc(d => ({ ...d, proposal:{ ...(d.proposal||{}), scratchGallery:[...(d.proposal?.scratchGallery||[]),{id:uid2(),imageUrl:'',caption:''}] } }));
  const del = id => setDoc(d => ({ ...d, proposal:{ ...(d.proposal||{}), scratchGallery:d.proposal.scratchGallery.filter(s=>s.id!==id) } }));
  const upS = (id,f,v) => setDoc(d => ({ ...d, proposal:{ ...(d.proposal||{}), scratchGallery:d.proposal.scratchGallery.map(s=>s.id===id?{...s,[f]:v}:s) } }));
  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <p className="text-slate-400 text-sm">{items.length} scratch card{items.length!==1?'s':''}</p>
        <button onClick={add} className="flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"><Plus size={14}/> Add Card</button>
      </div>
      <div className="space-y-4">
        {items.map((s,i) => (
          <Card key={s.id}>
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-bold text-rose-400 uppercase tracking-widest">Scratch Card #{i+1}</span>
              <button onClick={()=>del(s.id)} className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-700 transition"><Trash2 size={14}/></button>
            </div>
            <ImageField label="Memory Photo" value={s.imageUrl} onChange={v=>upS(s.id,'imageUrl',v)} />
            <div><Label>Caption (shown after scratch)</Label><TextInput value={s.caption} onChange={e=>upS(s.id,'caption',e.target.value)} placeholder="A beautiful memory…" /></div>
          </Card>
        ))}
        {items.length===0 && (
          <div className="text-center py-14 border-2 border-dashed border-slate-700 rounded-xl text-slate-500">
            <Image size={28} className="mx-auto mb-2 opacity-40"/>
            <p className="text-sm">No scratch cards yet. Click "Add Card".</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Proposal: Activities & Foods tab ─────────────────────────────
function ProposalActivitiesTab({ doc, setDoc }) {
  const p = doc.proposal || {};
  const acts = p.activities || [];
  const fds  = p.foods      || [];

  const addAct = ()    => setDoc(d => ({ ...d, proposal:{ ...(d.proposal||{}), activities:[...(d.proposal?.activities||[]),''] } }));
  const delAct = i     => setDoc(d => { const a=[...(d.proposal?.activities||[])]; a.splice(i,1); return { ...d, proposal:{...(d.proposal||{}),activities:a} }; });
  const upAct  = (i,v) => setDoc(d => { const a=[...(d.proposal?.activities||[])]; a[i]=v; return { ...d, proposal:{...(d.proposal||{}),activities:a} }; });

  const addFd  = ()    => setDoc(d => ({ ...d, proposal:{ ...(d.proposal||{}), foods:[...(d.proposal?.foods||[]),''] } }));
  const delFd  = i     => setDoc(d => { const f=[...(d.proposal?.foods||[])]; f.splice(i,1); return { ...d, proposal:{...(d.proposal||{}),foods:f} }; });
  const upFd   = (i,v) => setDoc(d => { const f=[...(d.proposal?.foods||[])]; f[i]=v; return { ...d, proposal:{...(d.proposal||{}),foods:f} }; });

  return (
    <>
      <Card title="Activity Options">
        <p className="text-[11px] text-slate-500 mb-4">Each option appears as a clickable pill. User picks one for the date.</p>
        <div className="space-y-2 mb-4">
          {acts.map((a,i) => (
            <div key={i} className="flex gap-2 items-center">
              <span className="text-rose-400 font-mono text-xs w-5 flex-shrink-0">#{i+1}</span>
              <TextInput value={a} onChange={e=>upAct(i,e.target.value)} placeholder={`Activity ${i+1} e.g. Movies 🎬`} />
              <button onClick={()=>delAct(i)} className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-slate-700 rounded-lg transition flex-shrink-0"><Trash2 size={13}/></button>
            </div>
          ))}
          {acts.length===0 && <p className="text-center py-6 text-slate-600 text-sm border-2 border-dashed border-slate-700 rounded-xl">No activities yet.</p>}
        </div>
        <button onClick={addAct} className="flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"><Plus size={14}/> Add Activity</button>
      </Card>

      <Card title="Food Options">
        <p className="text-[11px] text-slate-500 mb-4">Each option appears as a clickable pill. User picks one for the date.</p>
        <div className="space-y-2 mb-4">
          {fds.map((f,i) => (
            <div key={i} className="flex gap-2 items-center">
              <span className="text-rose-400 font-mono text-xs w-5 flex-shrink-0">#{i+1}</span>
              <TextInput value={f} onChange={e=>upFd(i,e.target.value)} placeholder={`Food ${i+1} e.g. Pizza 🍕`} />
              <button onClick={()=>delFd(i)} className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-slate-700 rounded-lg transition flex-shrink-0"><Trash2 size={13}/></button>
            </div>
          ))}
          {fds.length===0 && <p className="text-center py-6 text-slate-600 text-sm border-2 border-dashed border-slate-700 rounded-xl">No food options yet.</p>}
        </div>
        <button onClick={addFd} className="flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"><Plus size={14}/> Add Food Option</button>
      </Card>
    </>
  );
}

// ── Things I Wanna Do With You tab ────────────────────────────────
function ThingsToDoTab({ doc, setDoc }) {
  const items = doc.thingsToDo || [];
  const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const add = () => setDoc(d => ({ ...d, thingsToDo: [...(d.thingsToDo || []), { id: uid(), title: '', description: '', imageUrl: '', completed: false }] }));
  const del = id => setDoc(d => ({ ...d, thingsToDo: (d.thingsToDo || []).filter(s => s.id !== id) }));
  const upT = (id, f, v) => setDoc(d => ({ ...d, thingsToDo: (d.thingsToDo || []).map(s => s.id === id ? { ...s, [f]: v } : s) }));

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <p className="text-slate-400 dark:text-slate-400 text-sm">{items.length} item{items.length !== 1 ? 's' : ''}</p>
        <button onClick={add} className="flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition">
          <Plus size={14}/> Add Item
        </button>
      </div>
      <div className="space-y-4">
        {items.map((s, i) => (
          <Card key={s.id}>
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-bold text-rose-400 uppercase tracking-widest">Bucket List Item #{i+1}</span>
              <button onClick={() => del(s.id)} className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-700 transition">
                <Trash2 size={14}/>
              </button>
            </div>
            <div className="mb-4">
              <Label>Title</Label>
              <TextInput value={s.title} onChange={e => upT(s.id, 'title', e.target.value)} placeholder="e.g. Go on a hot air balloon ride 🎈" />
            </div>
            <div className="mb-4">
              <Label>Short Description / Note</Label>
              <TextInput value={s.description} onChange={e => upT(s.id, 'description', e.target.value)} placeholder="e.g. In Ella or Kandalama..." />
            </div>
            <ImageField label="Image / Illustration" value={s.imageUrl} onChange={v => upT(s.id, 'imageUrl', v)} />
          </Card>
        ))}
        {items.length === 0 && (
          <div className="text-center py-14 border-2 border-dashed border-slate-700 rounded-xl text-slate-500">
            <CheckCircle2 size={28} className="mx-auto mb-2 opacity-40"/>
            <p className="text-sm">No items added yet. Click "Add Item" to build a romantic bucket list.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Custom Template: Module Builder tab ───────────────────────────
function CustomModulesTab({ doc, setDoc }) {
  const cm = doc.customModules || {};
  const upCM = (field, val) => setDoc(d => ({ ...d, customModules: { ...(d.customModules || {}), [field]: val } }));

  const moduleToggles = [
    { key: 'showMilestones',     label: 'Timeline / Milestones',   icon: MapPin,  desc: 'A scrollable timeline of your love story moments.' },
    { key: 'showScratchGallery', label: 'Scratch-to-Reveal Gallery', icon: Image,  desc: 'Hidden photos revealed by scratching the screen.' },
    { key: 'showWhyILoveYou',    label: 'Why I Love You',           icon: Gift,   desc: 'A grid of sweet floating reasons.' },
    { key: 'showDatePlanner',    label: 'Date Night Planner',       icon: MapPin,  desc: 'Interactive activity & food selection for a date.' },
    { key: 'showVirtualGift',    label: 'Virtual Gift Box',         icon: Gift,   desc: 'An animated gift box that reveals a surprise photo.' },
  ];

  return (
    <>
      {/* Lockscreen Selector */}
      <Card title="Opening Lockscreen">
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-5">Choose the interactive game that opens this page. All options include the HeartBurst animation on unlock.</p>
        <Label>Lockscreen Type</Label>
        <select
          value={cm.lockscreenType || 'tap'}
          onChange={e => upCM('lockscreenType', e.target.value)}
          className="w-full bg-white/40 dark:bg-black/30 backdrop-blur-md border border-white/60 dark:border-white/10 rounded-2xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/50 shadow-inner transition-all appearance-none mb-3"
        >
          <option value="tap">❤️ Standard Tap (fill the screen red)</option>
          <option value="meter">💗 Love Meter (tap to fill a heart meter)</option>
          <option value="memory">🧩 Memory Match (flip card pairs)</option>
          <option value="dodging">💌 Dodging Button (catch the Yes button)</option>
        </select>

        {/* Lockscreen-specific fields */}
        {cm.lockscreenType === 'memory' && (
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-white/10">
            <p className="text-[11px] text-rose-500 font-bold uppercase tracking-wider mb-3">Memory Match — Upload 5 Pair Images</p>
            {[0,1,2,3,4].map(i => {
              const imgs = doc.valentine?.matchImages || ['','','','',''];
              return (
                <div key={i} className="mb-3">
                  <Label>Image {i+1}</Label>
                  <ImageField
                    label={`Pair image ${i+1}`}
                    value={imgs[i] || ''}
                    onChange={v => setDoc(d => {
                      const next = [...(d.valentine?.matchImages || ['','','','',''])];
                      next[i] = v;
                      return { ...d, valentine: { ...(d.valentine || {}), matchImages: next } };
                    })}
                  />
                </div>
              );
            })}
          </div>
        )}

        {cm.lockscreenType === 'dodging' && (
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-white/10">
            <Label>Proposal / Question Text</Label>
            <TextInput
              value={doc.proposal?.proposalText || ''}
              onChange={e => setDoc(d => ({ ...d, proposal: { ...(d.proposal || {}), proposalText: e.target.value } }))}
              placeholder="Will you be my Valentine? 💕"
            />
          </div>
        )}

        {(cm.lockscreenType === 'tap' || cm.lockscreenType === 'meter') && (
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-white/10 space-y-3">
            <div>
              <Label>Lockscreen Prompt</Label>
              <TextInput
                value={doc.general?.lockScreenPrompt || ''}
                onChange={e => setDoc(d => ({ ...d, general: { ...(d.general||{}), lockScreenPrompt: e.target.value } }))}
                placeholder={cm.lockscreenType === 'meter' ? 'Tap to fill the meter…' : 'Tap until the screen is full red'}
              />
            </div>
          </div>
        )}
      </Card>

      {/* Module Toggles */}
      <Card title="Page Sections — Toggle Modules On/Off">
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-6">Each active module will appear in order on the celebration page once unlocked.</p>
        <div className="space-y-4">
          {moduleToggles.map(({ key, label, icon: Icon, desc }) => {
            const active = !!cm[key];
            return (
              <div key={key} className={`flex items-start gap-4 p-4 rounded-2xl transition-all border ${
                active
                  ? 'bg-rose-500/5 dark:bg-rose-500/10 border-rose-300/50 dark:border-rose-500/20'
                  : 'bg-white/20 dark:bg-black/10 border-white/30 dark:border-white/5'
              }`}>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                  active ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                }`}>
                  <Icon size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-bold mb-0.5 ${active ? 'text-rose-600 dark:text-rose-400' : 'text-slate-700 dark:text-slate-300'}`}>{label}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
                </div>
                <button onClick={() => upCM(key, !active)} className="flex-shrink-0 mt-0.5">
                  {active
                    ? <ToggleRight size={28} className="text-rose-500" />
                    : <ToggleLeft  size={28} className="text-slate-400" />}
                </button>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Conditional Module Content Forms */}
      {cm.showMilestones && (
        <div className="mt-2">
          <p className="text-xs font-black text-rose-500 uppercase tracking-[0.2em] mb-4 px-1">✏️ Milestones Content</p>
          <MilestonesTab doc={doc} setDoc={setDoc} />
        </div>
      )}

      {cm.showScratchGallery && (
        <div className="mt-6">
          <p className="text-xs font-black text-rose-500 uppercase tracking-[0.2em] mb-4 px-1">✏️ Scratch Gallery Content</p>
          <ValentineScratchTab doc={doc} setDoc={setDoc} />
        </div>
      )}

      {cm.showWhyILoveYou && (
        <div className="mt-6">
          <p className="text-xs font-black text-rose-500 uppercase tracking-[0.2em] mb-4 px-1">✏️ Why I Love You — Reasons</p>
          <ValentineReasonsTab doc={doc} setDoc={setDoc} />
        </div>
      )}

      {cm.showDatePlanner && (
        <div className="mt-6">
          <p className="text-xs font-black text-rose-500 uppercase tracking-[0.2em] mb-4 px-1">✏️ Date Planner Options</p>
          <ProposalActivitiesTab doc={doc} setDoc={setDoc} />
        </div>
      )}

      {cm.showVirtualGift && (
        <div className="mt-6">
          <p className="text-xs font-black text-rose-500 uppercase tracking-[0.2em] mb-4 px-1">✏️ Virtual Gift Content</p>
          <GiftTab doc={doc} setDoc={setDoc} />
        </div>
      )}

      <ThemeColorsCard doc={doc} setDoc={setDoc} />
    </>
  );
}

function SocialLinksTab({ doc, setDoc }) {
  const s = doc.socialLinks || {};
  const up = (field, val) => setDoc(d => ({
    ...d,
    socialLinks: { ...(d.socialLinks || {}), [field]: val }
  }));

  return (
    <>
      <Card title="WhatsApp & Social Media Links">
        <p className="text-[11px] text-slate-500 mb-6 leading-relaxed">
          Provide links to WhatsApp and your social media pages. These will be saved for this site.
        </p>
        <div className="space-y-5">
          <div>
            <Label>WhatsApp Number / Link</Label>
            <TextInput
              value={s.whatsapp}
              onChange={e => up('whatsapp', e.target.value)}
              placeholder="e.g. +94771234567 or https://wa.me/..."
            />
            <p className="text-[10px] text-slate-500 mt-1">Provide a phone number with country code, or a direct wa.me link.</p>
          </div>
          <div>
            <Label>Instagram Link</Label>
            <TextInput
              value={s.instagram}
              onChange={e => up('instagram', e.target.value)}
              placeholder="https://instagram.com/yourprofile"
            />
          </div>
          <div>
            <Label>Facebook Link</Label>
            <TextInput
              value={s.facebook}
              onChange={e => up('facebook', e.target.value)}
              placeholder="https://facebook.com/yourprofile"
            />
          </div>
          <div>
            <Label>TikTok Link</Label>
            <TextInput
              value={s.tiktok}
              onChange={e => up('tiktok', e.target.value)}
              placeholder="https://tiktok.com/@yourprofile"
            />
          </div>
          <div>
            <Label>YouTube Link</Label>
            <TextInput
              value={s.youtube}
              onChange={e => up('youtube', e.target.value)}
              placeholder="https://youtube.com/@yourchannel"
            />
          </div>
        </div>
      </Card>
    </>
  );
}

const SECTION_LABELS = {
  hero: '🎉 Hero Header',
  message: '✉️ Birthday Message',
  lifeStats: '🔢 Life in Numbers Stats',
  gallery: '📸 Birthday Photo Gallery',
  voiceNote: '🎤 Audio Voice Note',
  yearInReview: '🎧 Year in Review (Stats)',
  gift: '🎁 Virtual Gift Box',
  scratchPrize: '🎠 Scratch & Win Coupon'
};

function SectionOrderTab({ doc, setDoc }) {
  const defaultOrder = ['hero', 'message', 'lifeStats', 'gallery', 'voiceNote', 'yearInReview', 'gift', 'scratchPrize'];
  const currentOrder = doc.sectionOrder && doc.sectionOrder.length > 0 ? doc.sectionOrder : defaultOrder;

  const move = (index, direction) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= currentOrder.length) return;

    const newOrder = [...currentOrder];
    const temp = newOrder[index];
    newOrder[index] = newOrder[nextIndex];
    newOrder[nextIndex] = temp;

    setDoc(d => ({ ...d, sectionOrder: newOrder }));
  };

  return (
    <Card title="Page Section Order">
      <p className="text-[11px] text-slate-500 mb-6 leading-relaxed">
        Reorder the sections below to change the layout sequence on the live page. Use the up and down arrow buttons.
      </p>
      <div className="space-y-3">
        {currentOrder.map((section, idx) => {
          const displayName = SECTION_LABELS[section] || section;
          return (
            <div key={section} className="flex items-center justify-between p-4 bg-white/40 dark:bg-black/30 backdrop-blur-md border border-white/60 dark:border-white/10 rounded-2xl shadow-sm">
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                {idx + 1}. {displayName}
              </span>
              <div className="flex gap-2">
                <button
                  disabled={idx === 0}
                  onClick={() => move(idx, -1)}
                  className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 disabled:opacity-30 rounded-xl transition text-slate-600 dark:text-slate-400 cursor-pointer animate-none"
                  title="Move Up"
                >
                  ▲
                </button>
                <button
                  disabled={idx === currentOrder.length - 1}
                  onClick={() => move(idx, 1)}
                  className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 disabled:opacity-30 rounded-xl transition text-slate-600 dark:text-slate-400 cursor-pointer animate-none"
                  title="Move Down"
                >
                  ▼
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

// ── Birthday Template: General Settings tab ────────────────────────
function BirthdayGeneralTab({ doc, setDoc }) {
  const g  = doc.general    || {};
  const b  = doc.birthday   || {};
  const vg = doc.virtualGift|| {};
  const isBday2 = doc.templateType === 'bday2';

  const up     = (field, val) => setDoc(d => ({ ...d, general:     { ...d.general,     [field]: val } }));
  const upBday = (field, val) => setDoc(d => ({ ...d, birthday:    { ...(d.birthday   || {}), [field]: val } }));
  const upGift = (field, val) => setDoc(d => ({ ...d, virtualGift: { ...(d.virtualGift|| {}), [field]: val } }));

  const bdayGallery      = doc.birthdayGallery || [];
  const addBdayPhoto     = (url) => setDoc(d => ({ ...d, birthdayGallery: [...(d.birthdayGallery || []), { url, caption: '' }] }));
  const removeBdayPhoto  = (idx) => setDoc(d => ({ ...d, birthdayGallery: (d.birthdayGallery || []).filter((_, i) => i !== idx) }));
  const updateCaption    = (idx, cap) => setDoc(d => ({ ...d, birthdayGallery: (d.birthdayGallery || []).map((p, i) => i === idx ? { ...p, caption: cap } : p) }));

  return (
    <>
      <Card title="Birthday Details">
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div>
            <Label>Recipient's Name</Label>
            <TextInput value={g.coupleName} onChange={e => up('coupleName', e.target.value)} placeholder="e.g. Charu" />
          </div>
          <div>
            <Label>Age (Optional)</Label>
            <TextInput value={b.recipientAge || ''} onChange={e => upBday('recipientAge', e.target.value ? Number(e.target.value) : null)} placeholder="e.g. 21" type="number" />
          </div>
        </div>

        <div className="mb-5">
          <Label>Date of Birth</Label>
          <p className="text-[11px] text-slate-500 mb-2">Powers the "Life in Numbers" animated stats section.</p>
          <input
            type="date"
            value={b.birthDate ? new Date(b.birthDate).toISOString().split('T')[0] : ''}
            onChange={e => upBday('birthDate', e.target.value || null)}
            className="w-full bg-white/40 dark:bg-black/30 backdrop-blur-md border border-white/60 dark:border-white/10 rounded-2xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/50 shadow-inner transition-all"
          />
        </div>

        <div className="mb-0">
          <Label>Birthday Message</Label>
          <TextArea value={b.birthdayMessage} onChange={e => upBday('birthdayMessage', e.target.value)} rows={4} placeholder="Wishing you the happiest of birthdays! 🥳" />
        </div>
      </Card>

      {/* Virtual Gift */}
      <Card title="🎁 Virtual Gift">
        <p className="text-[11px] text-slate-500 mb-4">A surprise gift the recipient unwraps with a tap at the bottom of their page.</p>
        <ImageField
          label="Gift Image"
          hint="Upload a fun image or illustration to reveal inside the gift"
          value={vg.imageUrl}
          onChange={v => upGift('imageUrl', v)}
        />
        <div className="mt-1">
          <Label>Gift Message</Label>
          <TextArea
            value={vg.message}
            onChange={e => upGift('message', e.target.value)}
            rows={3}
            placeholder="A sweet note to accompany the gift…"
          />
        </div>
      </Card>

      {/* Birthday Gallery */}
      <Card title="📸 Birthday Gallery">
        <p className="text-[11px] text-slate-500 mb-4">Photos displayed in a masonry gallery on their birthday page.</p>
        {bdayGallery.length > 0 && (
          <div className="grid grid-cols-2 gap-3 mb-4">
            {bdayGallery.map((ph, i) => (
              <div key={i} className="relative group rounded-xl overflow-hidden border border-slate-200 dark:border-white/10 bg-slate-900">
                <img src={ph.url} alt={ph.caption || `Photo ${i + 1}`} className="w-full h-24 object-cover" />
                <button
                  onClick={() => removeBdayPhoto(i)}
                  className="absolute top-1.5 right-1.5 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  ✕
                </button>
                <input
                  value={ph.caption || ''}
                  onChange={e => updateCaption(i, e.target.value)}
                  placeholder="Caption (optional)"
                  className="w-full text-xs px-2 py-1.5 bg-white/10 dark:bg-black/30 text-white placeholder-slate-400 border-t border-white/10 focus:outline-none"
                />
              </div>
            ))}
          </div>
        )}
        <ImageField
          label="Add a Photo"
          hint="Upload a photo and it will be appended to the gallery"
          value=""
          onChange={url => { if (url) addBdayPhoto(url); }}
        />
      </Card>

      {isBday2 && (
        <Card title="Template Settings">
          <div className="flex items-center gap-3">
            <div className="w-12 h-10 rounded-lg overflow-hidden border border-slate-700 bg-slate-900 relative">
              <input type="color" value={b.balloonColor || '#e11d48'} onChange={e => upBday('balloonColor', e.target.value)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              <div className="w-full h-full" style={{ backgroundColor: b.balloonColor || '#e11d48' }} />
            </div>
            <div className="flex-1">
              <Label>Balloon Color</Label>
              <TextInput value={b.balloonColor || '#e11d48'} onChange={e => upBday('balloonColor', e.target.value)} placeholder="#e11d48" />
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">This color will be used for the large floating balloon in the lockscreen animation.</p>
        </Card>
      )}

      {/* ── Countdown Timer ────────────────────────────────── */}
      <Card title="⏰ Countdown Timer (Optional)">
        <p className="text-[11px] text-slate-500 mb-4">
          If set, recipients will see a live countdown and cannot view the birthday page until this date/time arrives.
        </p>
        <Label>Unlock Date &amp; Time</Label>
        <input
          type="datetime-local"
          value={toLocalDateTimeString(doc.unlockTime)}
          onChange={e => {
            const val = e.target.value;
            setDoc(d => ({ ...d, unlockTime: val ? new Date(val).toISOString() : null }));
          }}
          className="w-full bg-white/40 dark:bg-black/30 backdrop-blur-md border border-white/60 dark:border-white/10 rounded-2xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/50 shadow-inner transition-all mb-2"
        />
        {doc.unlockTime && (
          <button onClick={() => setDoc(d => ({ ...d, unlockTime: null }))}
            className="text-xs text-red-400 hover:text-red-600 underline cursor-pointer">
            Clear countdown
          </button>
        )}
      </Card>

      {/* ── Voice Note ─────────────────────────────────────── */}
      <Card title="🎤 Voice Note (Optional)">
        <p className="text-[11px] text-slate-500 mb-4">
          Upload a personal audio message. It appears as a retro cassette player on the birthday page.
        </p>
        <AudioField
          label="Voice Note Audio"
          hint="Upload an MP3 or WAV file (max ~10MB recommended)"
          value={doc.voiceNoteUrl}
          onChange={v => setDoc(d => ({ ...d, voiceNoteUrl: v }))}
        />
        {doc.voiceNoteUrl && (
          <button onClick={() => setDoc(d => ({ ...d, voiceNoteUrl: '' }))}
            className="text-xs text-red-400 hover:text-red-600 underline cursor-pointer mt-1 block">
            Remove voice note
          </button>
        )}
      </Card>

      {/* ── Greeting Video ─────────────────────────────────── */}
      <Card title="🎬 Personal Greeting Video (Optional)">
        <p className="text-[11px] text-slate-500 mb-4">
          Upload a short personal video greeting (e.g. recorded on your phone). It will appear as a premium video player just below the main hero section on the birthday page.
        </p>
        <VideoField
          label="Greeting Video"
          hint="Upload an MP4/MOV file. Keep it under 50MB for fast loading."
          value={doc.greetingVideoUrl}
          onChange={v => setDoc(d => ({ ...d, greetingVideoUrl: v }))}
        />
        {doc.greetingVideoUrl && (
          <button onClick={() => setDoc(d => ({ ...d, greetingVideoUrl: '' }))}
            className="text-xs text-red-400 hover:text-red-600 underline cursor-pointer mt-1 block">
            Remove greeting video
          </button>
        )}
      </Card>

      {/* ── Scratch & Win ──────────────────────────────────── */}
      <Card title="🎠 Scratch & Win (Optional)">
        <p className="text-[11px] text-slate-500 mb-4">
          Enter the prize text that is revealed when the recipient scratches the lottery ticket.
        </p>
        <Label>Hidden Prize Text</Label>
        <TextInput
          value={doc.scratchPrize || ''}
          onChange={e => setDoc(d => ({ ...d, scratchPrize: e.target.value }))}
          placeholder="e.g. A Free Dinner Date 🍽️"
        />
      </Card>

      {/* ── Year in Review ─────────────────────────────────── */}
      <Card title="🎧 Year in Review (Optional)">
        <p className="text-[11px] text-slate-500 mb-4">
          Add stats displayed in a Spotify Wrapped-style layout. Each card shows a Label and a Value.
        </p>
        {(doc.yearInReview || []).map((item, i) => (
          <div key={i} className="flex gap-2 mb-3 items-start">
            <div className="flex-1">
              <TextInput
                value={item.label}
                onChange={e => setDoc(d => ({ ...d, yearInReview: d.yearInReview.map((x, j) => j === i ? { ...x, label: e.target.value } : x) }))}
                placeholder="Label e.g. Pizzas shared"
              />
            </div>
            <div className="flex-1">
              <TextInput
                value={item.value}
                onChange={e => setDoc(d => ({ ...d, yearInReview: d.yearInReview.map((x, j) => j === i ? { ...x, value: e.target.value } : x) }))}
                placeholder="Value e.g. 47"
              />
            </div>
            <button
              onClick={() => setDoc(d => ({ ...d, yearInReview: d.yearInReview.filter((_, j) => j !== i) }))}
              className="mt-1 p-2 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors cursor-pointer text-xs font-bold"
            >
              ✕
            </button>
          </div>
        ))}
        <button
          onClick={() => setDoc(d => ({ ...d, yearInReview: [...(d.yearInReview || []), { label: '', value: '' }] }))}
          className="w-full py-2.5 rounded-2xl border-2 border-dashed border-slate-300 dark:border-white/20 text-slate-500 dark:text-slate-400 text-xs font-bold hover:border-rose-400 hover:text-rose-500 transition-colors cursor-pointer"
        >
          + Add Stat
        </button>
      </Card>

      <ThemeColorsCard doc={doc} setDoc={setDoc} />
    </>
  );
}

// ── Cinematic: General & Videos tab ─────────────────────────────────
function CinGeneralTab({ doc, setDoc }) {
  const g = doc.general || {};
  const cin = doc.cinematic || {};
  
  const up = (field, val) => setDoc(d => ({ ...d, general: { ...d.general, [field]: val } }));
  const upCin = (field, val) => setDoc(d => ({ ...d, cinematic: { ...(d.cinematic || {}), [field]: val } }));

  return (
    <>
      <Card title="Couple Identity">
        <div className="mb-5">
          <Label>Couple's Names</Label>
          <TextInput value={g.coupleName} onChange={e => up('coupleName', e.target.value)} placeholder="Name & Name" />
        </div>
        <div className="mb-0">
          <Label>Couple Emoji</Label>
          <TextInput value={g.coupleEmoji} onChange={e => up('coupleEmoji', e.target.value)} placeholder="💌" />
        </div>
      </Card>

      <Card title="Hero Setup & Anniversary">
        <div className="mb-5">
          <Label>Hero Subtitle</Label>
          <TextInput value={g.heroSubtitle} onChange={e => up('heroSubtitle', e.target.value)} placeholder="A love written in the stars" />
        </div>
        <div className="mb-0">
          <Label>Anniversary Start Date</Label>
          <TextInput type="date" value={cin.startDate || ''} onChange={e => upCin('startDate', e.target.value)} />
          <p className="text-[11px] text-slate-500 mt-1">Used to count exact years, months, days, hours, and seconds.</p>
        </div>
      </Card>

      <Card title="Cinematic Video Elements">
        <VideoField
          label="Intro Interaction Video"
          hint="Plays in full screen when 'Tap to Open' is clicked. Short reveal teaser clip."
          value={cin.introVideoUrl}
          onChange={v => upCin('introVideoUrl', v)}
        />
        <VideoField
          label="Background Loop Video"
          hint="Smooth muted looping atmospheric background video shown in the Hero section."
          value={cin.bgVideoUrl}
          onChange={v => upCin('bgVideoUrl', v)}
        />
        <ImageField
          label="Fallback Hero Image"
          hint="Shown if background video is empty or fails to load."
          value={cin.heroImageUrl || doc.images?.heroImageUrl}
          onChange={v => {
            upCin('heroImageUrl', v);
            setDoc(d => ({ ...d, images: { ...(d.images || {}), heroImageUrl: v } }));
          }}
        />
      </Card>
    </>
  );
}

// ── Cinematic: Music & Lyrics tab ───────────────────────────────────
function CinMusicTab({ doc, setDoc }) {
  const m = doc.music || {};
  const cin = doc.cinematic || {};
  
  const up = (f, v) => setDoc(d => ({ ...d, music: { ...d.music, [f]: v } }));
  const upCin = (f, v) => setDoc(d => ({ ...d, cinematic: { ...(d.cinematic || {}), [f]: v } }));

  return (
    <>
      <Card title="Global Music Player">
        <div className="mb-6">
          <Toggle checked={m.isEnabled ?? true} onChange={v => up('isEnabled', v)} label="Enable Music Player" />
        </div>

        <div className={`transition-opacity ${m.isEnabled === false ? 'opacity-50 pointer-events-none' : ''}`}>
          <div className="mb-6">
            <AudioField
              label="Background Audio"
              hint="Upload an MP3/WAV file or paste a direct audio URL"
              value={m.audioUrl}
              onChange={v => up('audioUrl', v)}
            />
          </div>
          <div>
            <ImageField
              label="Record Thumbnail"
              hint="Spinning record cover image"
              value={m.thumbnailUrl}
              onChange={v => up('thumbnailUrl', v)}
            />
          </div>
        </div>
      </Card>

      <Card title="Song Lyrics">
        <Label>Favorite Song Lyrics</Label>
        <p className="text-[11px] text-slate-500 mb-2">Display lyrics below the music player on the client page.</p>
        <TextArea
          value={cin.songLyrics || ''}
          onChange={e => upCin('songLyrics', e.target.value)}
          placeholder="Paste song lyrics here…"
          rows={10}
        />
      </Card>
    </>
  );
}

// ── Cinematic: Love Letter tab ──────────────────────────────────────
function CinLoveLetterTab({ doc, setDoc }) {
  const g = doc.general || {};
  const up = (field, val) => setDoc(d => ({ ...d, general: { ...d.general, [field]: val } }));

  return (
    <Card title="Love Letter">
      <Label>Love Letter Text</Label>
      <p className="text-[11px] text-slate-500 mb-2">Write a special message to be shown in the premium glassmorphic section.</p>
      <TextArea
        value={g.loveLetterText || ''}
        onChange={e => up('loveLetterText', e.target.value)}
        placeholder="Dear..., Everyday with you is a gift..."
        rows={12}
      />
    </Card>
  );
}

// ── Cinematic: Why I Love You tab ──────────────────────────────────
function CinReasonsTab({ doc, setDoc }) {
  const reasons = doc.cinematic?.reasons || [];
  
  const add = () => setDoc(d => ({
    ...d,
    cinematic: {
      ...(d.cinematic || {}),
      reasons: [...(d.cinematic?.reasons || []), '']
    }
  }));

  const del = i => setDoc(d => {
    const r = [...(d.cinematic?.reasons || [])];
    r.splice(i, 1);
    return {
      ...d,
      cinematic: { ...(d.cinematic || {}), reasons: r }
    };
  });

  const upR = (i, v) => setDoc(d => {
    const r = [...(d.cinematic?.reasons || [])];
    r[i] = v;
    return {
      ...d,
      cinematic: { ...(d.cinematic || {}), reasons: r }
    };
  });

  return (
    <Card title="Why I Love You">
      <p className="text-[11px] text-slate-500 mb-5">These reasons will display as beautiful badges in a premium mason/grid layout.</p>
      <div className="space-y-3 mb-4">
        {reasons.map((r, i) => (
          <div key={i} className="flex gap-2 items-center">
            <span className="text-rose-400 font-mono text-xs w-5 flex-shrink-0">#{i + 1}</span>
            <TextInput value={r} onChange={e => upR(i, e.target.value)} placeholder={`Reason ${i + 1}…`} />
            <button
              type="button"
              onClick={() => del(i)}
              className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-slate-700 rounded-lg transition flex-shrink-0"
            >
              <Trash2 size={13} />
            </button>
          </div>
        ))}
        {reasons.length === 0 && (
          <p className="text-center py-8 text-slate-600 text-sm border-2 border-dashed border-slate-700 rounded-xl">No reasons yet. Add one below.</p>
        )}
      </div>
      <button
        type="button"
        onClick={add}
        className="flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
      >
        <Plus size={14} /> Add Reason
      </button>
    </Card>
  );
}

// ── Cinematic Birthday: General & Videos ──────────────────────────
function CinBdayGeneralTab({ doc, setDoc }) {
  const g  = doc.general  || {};
  const cb = doc.cinematicBirthday || {};
  const bd = doc.birthday || {};

  const upG  = (f, v) => setDoc(d => ({ ...d, general:          { ...d.general,          [f]: v } }));
  const upCb = (f, v) => setDoc(d => ({ ...d, cinematicBirthday:{ ...(d.cinematicBirthday||{}), [f]: v } }));
  const upBd = (f, v) => setDoc(d => ({ ...d, birthday:         { ...d.birthday,         [f]: v } }));

  return (
    <>
      <Card title="Birthday Subject">
        <div className="mb-5">
          <Label>Recipient Name</Label>
          <TextInput value={g.coupleName} onChange={e => upG('coupleName', e.target.value)} placeholder="Maleesha, Kavindu…" />
        </div>
        <div className="mb-5">
          <Label>Birthday Message Subtitle</Label>
          <TextInput value={g.heroSubtitle} onChange={e => upG('heroSubtitle', e.target.value)} placeholder="Wishing you a magical birthday!" />
        </div>
        <div className="mb-0">
          <Label>Birth Date</Label>
          <TextInput type="date" value={bd.birthDate ? bd.birthDate.slice(0,10) : ''} onChange={e => upBd('birthDate', e.target.value)} />
        </div>
      </Card>

      <Card title="Cinematic Video Elements">
        <VideoField
          label="Intro Interaction Video"
          hint="Full-screen video played after 'Tap to Open' is clicked."
          value={cb.introVideoUrl}
          onChange={v => upCb('introVideoUrl', v)}
        />
        <VideoField
          label="Background Loop Video"
          hint="Muted atmospheric looping video behind the Hero section."
          value={cb.bgVideoUrl}
          onChange={v => upCb('bgVideoUrl', v)}
        />
      </Card>
    </>
  );
}

// ── Cinematic Birthday: Gift Reveal ───────────────────────────────
function CinBdayGiftTab({ doc, setDoc }) {
  const cb = doc.cinematicBirthday || {};
  const up = (f, v) => setDoc(d => ({ ...d, cinematicBirthday: { ...(d.cinematicBirthday||{}), [f]: v } }));

  return (
    <Card title="Interactive Gift Box Reveal">
      <p className="text-[11px] text-slate-500 mb-5">Upload a gift image and write a reveal message. Visitors tap a 3D gift box to open it and reveal your content.</p>
      <ImageField
        label="Gift Reveal Image"
        hint="Shown inside the gift box after tapping."
        value={cb.giftImageUrl}
        onChange={v => up('giftImageUrl', v)}
      />
      <div className="mt-4">
        <Label>Gift Reveal Message</Label>
        <TextArea
          value={cb.giftRevealText || ''}
          onChange={e => up('giftRevealText', e.target.value)}
          placeholder="Happy Birthday! 🎂 This is your special gift…"
          rows={4}
        />
      </div>
    </Card>
  );
}

// ── Cinematic Birthday: Year Recap & Bucket List ──────────────────
function CinBdayRecapTab({ doc, setDoc }) {
  const cb     = doc.cinematicBirthday || {};
  const bucket = cb.birthdayBucketList || [];
  const up     = (f, v) => setDoc(d => ({ ...d, cinematicBirthday: { ...(d.cinematicBirthday||{}), [f]: v } }));

  const addItem    = ()    => up('birthdayBucketList', [...bucket, '']);
  const delItem    = (i)   => up('birthdayBucketList', bucket.filter((_, j) => j !== i));
  const updateItem = (i,v) => { const a=[...bucket]; a[i]=v; up('birthdayBucketList', a); };

  return (
    <>
      <Card title="Year Recap">
        <Label>Year Recap Text</Label>
        <p className="text-[11px] text-slate-500 mb-2">A heartfelt summary of their year — shown in the Year Recap section.</p>
        <TextArea
          value={cb.yearRecapText || ''}
          onChange={e => up('yearRecapText', e.target.value)}
          placeholder="What a year it has been! From the highs to the unforgettable moments…"
          rows={8}
        />
      </Card>

      <Card title="Birthday Bucket List">
        <p className="text-[11px] text-slate-500 mb-4">Things to do on their birthday. Each item is revealed with a scroll animation.</p>
        <div className="space-y-3 mb-4">
          {bucket.map((item, i) => (
            <div key={i} className="flex gap-2 items-center">
              <span className="text-amber-400 font-mono text-xs w-5 flex-shrink-0">#{i+1}</span>
              <TextInput value={item} onChange={e => updateItem(i, e.target.value)} placeholder={`Bucket list item ${i+1}…`} />
              <button type="button" onClick={() => delItem(i)} className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-slate-700 rounded-lg transition flex-shrink-0">
                <Trash2 size={13} />
              </button>
            </div>
          ))}
          {bucket.length === 0 && (
            <p className="text-center py-8 text-slate-600 text-sm border-2 border-dashed border-slate-700 rounded-xl">No items yet. Add one below.</p>
          )}
        </div>
        <button type="button" onClick={addItem} className="flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition">
          <Plus size={14} /> Add Item
        </button>
      </Card>
    </>
  );
}

// ── Cinematic Birthday: Music & Lyrics ────────────────────────────
function CinBdayMusicTab({ doc, setDoc }) {
  const cb = doc.cinematicBirthday || {};
  const up = (f, v) => setDoc(d => ({ ...d, cinematicBirthday: { ...(d.cinematicBirthday||{}), [f]: v } }));

  return (
    <>
      <Card title="Song Audio">
        <AudioField
          label="Birthday Song"
          hint="Upload an MP3 or paste a direct audio URL"
          value={cb.songAudioUrl}
          onChange={v => up('songAudioUrl', v)}
        />
      </Card>
      <Card title="Song Lyrics">
        <Label>Lyrics</Label>
        <p className="text-[11px] text-slate-500 mb-2">Displayed below the audio player with a soft glow effect.</p>
        <TextArea
          value={cb.songLyrics || ''}
          onChange={e => up('songLyrics', e.target.value)}
          placeholder="Paste song lyrics here…"
          rows={10}
        />
      </Card>
    </>
  );
}

// ── Cinematic Birthday: Photo Gallery ────────────────────────────
function CinBdayGalleryTab({ doc, setDoc }) {
  const cb     = doc.cinematicBirthday || {};
  const images = cb.galleryImages || [];
  const [uploading, setUploading] = useState(false);

  const upImages = (arr) => setDoc(d => ({ ...d, cinematicBirthday: { ...(d.cinematicBirthday||{}), galleryImages: arr } }));

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    const newUrls = [];
    for (const file of files) {
      const res = await uploadImage(file);
      if (res.success) newUrls.push(res.url);
    }
    upImages([...images, ...newUrls]);
    setUploading(false);
    e.target.value = '';
  };

  const remove = (i) => upImages(images.filter((_, j) => j !== i));

  return (
    <Card title="Photo Gallery">
      <p className="text-[11px] text-slate-500 mb-5">These photos appear in the masonry gallery grid on the birthday page.</p>
      <div className="grid grid-cols-2 gap-3 mb-4">
        {images.map((url, i) => (
          <div key={i} className="relative group rounded-xl overflow-hidden border border-white/10">
            <img src={url} alt={`gallery ${i}`} className="w-full h-28 object-cover" />
            <button
              type="button"
              onClick={() => remove(i)}
              className="absolute top-2 right-2 bg-black/60 hover:bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
            >
              <Trash2 size={12} />
            </button>
          </div>
        ))}
        {images.length === 0 && (
          <div className="col-span-2 text-center py-8 text-slate-600 text-sm border-2 border-dashed border-slate-700 rounded-xl">No photos yet.</div>
        )}
      </div>
      <label className={`flex items-center justify-center gap-2 border-2 border-dashed border-slate-600 hover:border-amber-400 rounded-xl py-4 cursor-pointer transition-colors ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
        {uploading ? <Loader2 size={16} className="animate-spin text-amber-400" /> : <Upload size={16} className="text-slate-400" />}
        <span className="text-sm text-slate-400 font-medium">{uploading ? 'Uploading…' : 'Upload Photos'}</span>
        <input type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} />
      </label>
    </Card>
  );
}

// ── Main Editor Page ──────────────────────────────────────────────
export default function AdminEditor() {
  const { siteId } = useParams();
  const nav = useNavigate();
  const [doc, setDoc]       = useState(null);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [saved, setSaved]       = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [error, setError]   = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    setIsDarkMode(document.documentElement.classList.contains('dark'));
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDarkMode;
    setIsDarkMode(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  useEffect(() => {
    getSite(siteId).then(res => {
      if (res.success) {
        setDoc(res.data);
      } else {
        const msg = (res.message || '').toLowerCase();
        if (msg.includes('token') || msg.includes('unauthorized')) {
          localStorage.removeItem('adminToken');
          window.location.href = '/login';
          return;
        }
        setError(res.message);
      }
      setLoading(false);
    }).catch(e => {
        const msg = (e.message || '').toLowerCase();
        if (msg.includes('token') || msg.includes('unauthorized')) {
          localStorage.removeItem('adminToken');
          window.location.href = '/login';
          return;
        }
        setError(e.message);
        setLoading(false);
    });
  }, [siteId]);

  const handleSave = async () => {
    setSaving(true);
    setError('');
    const res = await saveSite(siteId, doc);
    setSaving(false);
    if (res.success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } else {
      setError(res.message || 'Save failed.');
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 dark:from-neutral-900 dark:to-neutral-950 flex items-center justify-center transition-colors duration-500">
      <Loader2 size={36} className="animate-spin text-rose-500" />
    </div>
  );

  if (!doc) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 dark:from-neutral-900 dark:to-neutral-950 flex items-center justify-center text-slate-500 dark:text-slate-400 font-bold transition-colors duration-500">
      <AlertTriangle size={24} className="mr-3 text-yellow-500" /> Site not found: {siteId}
    </div>
  );

  const isValentine        = doc.templateType === 'valentine';
  const isProposal         = doc.templateType === 'proposal';
  const isCustom           = doc.templateType === 'custom';
  const isBirthday         = doc.category === 'birthday' && doc.templateType !== 'bday5';
  const isBirthdayCinematic= doc.templateType === 'bday5';
  const isCinematic        = doc.templateType === 'cinematic';
  
  const availableTabs = isBirthdayCinematic ? CINEMATIC_BDAY_TABS
    : isBirthday ? BIRTHDAY_TABS
    : isValentine ? VALENTINE_TABS
    : isProposal ? PROPOSAL_TABS
    : isCustom   ? CUSTOM_TABS
    : isCinematic ? CINEMATIC_TABS
    : doc.templateType === 'modern' ? TABS.filter(t => t.id !== 'milestones')
    : TABS;
  const ActiveTab = availableTabs.find(t => t.id === activeTab) || availableTabs[0];

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-200 dark:from-neutral-900 dark:to-neutral-950 text-slate-900 dark:text-slate-100 overflow-hidden font-sans transition-colors duration-500">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-white/40 dark:bg-black/20 backdrop-blur-2xl border-r border-white/60 dark:border-white/10 flex flex-col shadow-xl shadow-black/5 z-20">
        <div className="px-6 py-5 border-b border-white/40 dark:border-white/10">
          <Link to="/admin" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white text-sm font-semibold transition mb-4">
            <ArrowLeft size={16} strokeWidth={2.5} /> All Clients
          </Link>
          <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-pink-500 rounded-xl flex items-center justify-center mb-3 shadow-lg shadow-rose-500/30">
            <span className="text-base text-white">💌</span>
          </div>
          <p className="text-slate-900 dark:text-white font-extrabold text-base leading-tight truncate">{doc.general?.coupleName || siteId}</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-1 tracking-tight truncate">{siteId}</p>
        </div>

        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {availableTabs.map(({ id, label, Icon }) => (
            <button key={id} onClick={() => setActiveTab(id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all shadow-sm ${activeTab === id ? 'bg-white/80 dark:bg-white/10 text-rose-600 dark:text-rose-400 border border-white/60 dark:border-white/10' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/40 dark:hover:bg-white/5 border border-transparent'}`}>
              <Icon size={16} strokeWidth={2.5} /> {label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/40 dark:border-white/10">
          <a href={`/${siteId}`} target="_blank" rel="noreferrer"
            className="w-full flex items-center justify-center gap-2 py-3 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/10 rounded-2xl border border-white/60 dark:border-white/10 transition shadow-sm">
            <ExternalLink size={14} /> Preview Site
          </a>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Topbar */}
        <header className="h-16 flex-shrink-0 bg-white/40 dark:bg-black/20 backdrop-blur-xl border-b border-white/60 dark:border-white/10 flex items-center justify-between px-8 z-10 shadow-sm">
          <h1 className="text-lg font-bold text-slate-900 dark:text-white">{ActiveTab?.label}</h1>
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleTheme}
              className="p-2.5 bg-white/40 dark:bg-black/30 backdrop-blur-md border border-white/60 dark:border-white/10 rounded-2xl hover:scale-105 transition-transform"
            >
              {isDarkMode ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} className="text-slate-700 dark:text-slate-300" />}
            </button>
            {error && <span className="text-xs font-bold text-red-500 flex items-center gap-1.5 bg-red-500/10 px-3 py-1.5 rounded-full"><AlertTriangle size={14} />{error}</span>}
            <button onClick={handleSave} disabled={saving}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl text-sm font-bold transition-all shadow-md ${saved ? 'bg-emerald-500 text-white' : 'bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white'} border border-white/20 disabled:opacity-60 hover:scale-105 active:scale-95`}>
              {saving ? <Loader2 size={16} className="animate-spin" /> : saved ? <CheckCircle2 size={16} /> : <Save size={16} />}
              {saving ? 'Saving…' : saved ? 'Saved!' : 'Save Changes'}
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-2xl mx-auto">
            {isValentine ? (
              <>
                {activeTab === 'general'     && <GeneralTab doc={doc} setDoc={setDoc} />}
                {activeTab === 'music'       && <MusicTab   doc={doc} setDoc={setDoc} />}
                {activeTab === 'gift'        && <GiftTab    doc={doc} setDoc={setDoc} />}
                {activeTab === 'thingsToDo'  && <ThingsToDoTab doc={doc} setDoc={setDoc} />}
                {activeTab === 'match'       && <ValentineMatchTab   doc={doc} setDoc={setDoc} />}
                {activeTab === 'reasons'     && <ValentineReasonsTab doc={doc} setDoc={setDoc} />}
                {activeTab === 'scratch'     && <ValentineScratchTab doc={doc} setDoc={setDoc} />}
                {activeTab === 'valFeatures' && <ValentineFeaturesTab doc={doc} setDoc={setDoc} />}
                {activeTab === 'socialLinks' && <SocialLinksTab doc={doc} setDoc={setDoc} />}
              </>
            ) : isProposal ? (
              <>
                {activeTab === 'general'    && <ProposalGeneralTab    doc={doc} setDoc={setDoc} />}
                {activeTab === 'music'      && <MusicTab              doc={doc} setDoc={setDoc} />}
                {activeTab === 'thingsToDo' && <ThingsToDoTab         doc={doc} setDoc={setDoc} />}
                {activeTab === 'scratch'    && <ProposalScratchTab    doc={doc} setDoc={setDoc} />}
                {activeTab === 'activities' && <ProposalActivitiesTab doc={doc} setDoc={setDoc} />}
                {activeTab === 'socialLinks' && <SocialLinksTab doc={doc} setDoc={setDoc} />}
              </>
            ) : isCustom ? (
              <>
                {activeTab === 'modules'    && <CustomModulesTab  doc={doc} setDoc={setDoc} />}
                {activeTab === 'general'    && <GeneralTab         doc={doc} setDoc={setDoc} />}
                {activeTab === 'music'      && <MusicTab           doc={doc} setDoc={setDoc} />}
                {activeTab === 'thingsToDo' && <ThingsToDoTab      doc={doc} setDoc={setDoc} />}
                {activeTab === 'socialLinks' && <SocialLinksTab doc={doc} setDoc={setDoc} />}
              </>
            ) : isBirthdayCinematic ? (
              <>
                {activeTab === 'cinbday_general' && <CinBdayGeneralTab doc={doc} setDoc={setDoc} />}
                {activeTab === 'cinbday_gift'    && <CinBdayGiftTab    doc={doc} setDoc={setDoc} />}
                {activeTab === 'cinbday_recap'   && <CinBdayRecapTab   doc={doc} setDoc={setDoc} />}
                {activeTab === 'cinbday_music'   && <CinBdayMusicTab   doc={doc} setDoc={setDoc} />}
                {activeTab === 'cinbday_gallery' && <CinBdayGalleryTab doc={doc} setDoc={setDoc} />}
                {activeTab === 'socialLinks'     && <SocialLinksTab    doc={doc} setDoc={setDoc} />}
              </>
            ) : isBirthday ? (
              <>
                {activeTab === 'bday_general' && <BirthdayGeneralTab doc={doc} setDoc={setDoc} />}
                {activeTab === 'gallery'      && <GalleryTab         doc={doc} setDoc={setDoc} />}
                {activeTab === 'music'        && <MusicTab           doc={doc} setDoc={setDoc} />}
                {activeTab === 'sectionOrder' && <SectionOrderTab    doc={doc} setDoc={setDoc} />}
                {activeTab === 'socialLinks'  && <SocialLinksTab     doc={doc} setDoc={setDoc} />}
              </>
            ) : isCinematic ? (
              <>
                {activeTab === 'general'    && <CinGeneralTab    doc={doc} setDoc={setDoc} />}
                {activeTab === 'music'      && <CinMusicTab      doc={doc} setDoc={setDoc} />}
                {activeTab === 'loveLetter' && <CinLoveLetterTab doc={doc} setDoc={setDoc} />}
                {activeTab === 'milestones' && <MilestonesTab    doc={doc} setDoc={setDoc} />}
                {activeTab === 'gallery'    && <GalleryTab       doc={doc} setDoc={setDoc} />}
                {activeTab === 'reasons'    && <CinReasonsTab    doc={doc} setDoc={setDoc} />}
                {activeTab === 'socialLinks' && <SocialLinksTab doc={doc} setDoc={setDoc} />}
              </>
            ) : doc.templateType === 'polaroid' || doc.templateType === 'modern' || !doc.templateType ? (
              <>
                {activeTab === 'general'    && <GeneralTab    doc={doc} setDoc={setDoc} />}
                {activeTab === 'music'      && <MusicTab      doc={doc} setDoc={setDoc} />}
                {activeTab === 'gift'       && <GiftTab       doc={doc} setDoc={setDoc} />}
                {activeTab === 'thingsToDo' && <ThingsToDoTab doc={doc} setDoc={setDoc} />}
                {activeTab === 'milestones' && <MilestonesTab doc={doc} setDoc={setDoc} />}
                {activeTab === 'gallery'    && <GalleryTab    doc={doc} setDoc={setDoc} />}
                {activeTab === 'socialLinks' && <SocialLinksTab doc={doc} setDoc={setDoc} />}
              </>
            ) : (
              <div className="text-center py-20 text-slate-500">
                <p className="text-sm">Editor for {doc.templateType} template is coming soon.</p>
              </div>
            )}
          </div>
        </main>

        <footer className="h-8 flex-shrink-0 bg-white/40 dark:bg-black/20 backdrop-blur-xl border-t border-white/60 dark:border-white/10 flex items-center px-8 z-10">
          <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">
            {isBirthday
              ? `Birthday Celebration · ${doc.gallery?.supporting?.length||0} gallery photos`
              : isValentine
              ? `${doc.valentine?.reasons?.length||0} reasons · ${doc.valentine?.scratchMemories?.length||0} scratch cards · ${doc.thingsToDo?.length||0} bucket items`
              : isProposal
              ? `${doc.proposal?.scratchGallery?.length||0} scratch cards · ${doc.proposal?.activities?.length||0} activities · ${doc.proposal?.foods?.length||0} foods · ${doc.thingsToDo?.length||0} bucket items`
              : isCustom
              ? `Lockscreen: ${doc.customModules?.lockscreenType || 'tap'} · ${doc.thingsToDo?.length||0} bucket items · ${Object.values(doc.customModules||{}).filter(v=>v===true).length} modules active`
              : isCinematic
              ? `Cinematic · ${doc.cinematic?.reasons?.length || 0} reasons · ${doc.milestones?.length || 0} milestones · ${doc.general?.loveLetterText ? 'Love Letter configured' : 'No Love Letter'}`
              : `${doc.milestones?.length||0} milestones · ${doc.gallery?.supporting?.length||0} gallery photos · ${doc.thingsToDo?.length||0} bucket items`
            } · Unsaved changes not persisted
          </span>
        </footer>
      </div>
    </div>
  );
}
