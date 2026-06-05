import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

const FALLBACK_URL = "https://upload.wikimedia.org/wikipedia/commons/6/6f/Nocturne_in_E_flat_major%2C_Op._9_no._2.mp3";

export default function MusicPlayer({ isUnlocked, playTrigger, musicUrl }) {
  const audioUrl = musicUrl || FALLBACK_URL;
  const audioRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
    }
  }, []);

  // Trigger play on unlock (from the trusted click event stack trace)
  useEffect(() => {
    if (playTrigger && audioRef.current) {
      document.querySelectorAll('audio').forEach(el => {
        if (el !== audioRef.current) el.pause();
      });
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          setIsMuted(false);
        })
        .catch((err) => {
          console.log("Play trigger failed (potentially blocked):", err);
          setIsPlaying(false);
        });
    }
  }, [playTrigger]);

  const toggleMute = () => {
    if (!audioRef.current) return;

    // If it hasn't started playing yet due to browser restrictions, start it on click
    if (!isPlaying) {
      document.querySelectorAll('audio').forEach(el => {
        if (el !== audioRef.current) el.pause();
      });
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          audioRef.current.muted = false;
          setIsMuted(false);
        })
        .catch((err) => console.log("Failed to play audio on click:", err));
      return;
    }

    // Toggle muted state
    const targetMute = !isMuted;
    audioRef.current.muted = targetMute;
    setIsMuted(targetMute);
  };

  if (!isUnlocked) return null;

  const active = isPlaying && !isMuted;

  return (
    <button
      onClick={toggleMute}
      className={`fixed bottom-6 right-6 z-50 p-3.5 rounded-full bg-white/90 backdrop-blur border border-rose-100 shadow-lg hover:shadow-xl text-rose-600 hover:text-rose-700 transition-all duration-300 flex items-center justify-center group cursor-pointer ${
        !isPlaying ? "animate-pulse border-rose-300 bg-rose-50" : ""
      }`}
      title={active ? "Mute Background Music" : "Play Background Music"}
    >
      {active ? (
        <Volume2 size={20} className="animate-pulse" />
      ) : (
        <VolumeX size={20} className={!isPlaying ? "text-rose-500 scale-110" : ""} />
      )}
      {/* Fallback indicator helper for autoplay block */}
      {!isPlaying && (
        <span className="absolute -top-10 right-0 bg-rose-600 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-md whitespace-nowrap animate-bounce pointer-events-none">
          Tap to play music 🎵
        </span>
      )}
      {/* Mini note details on hover */}
      <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-out whitespace-nowrap text-xs font-medium text-rose-500 pl-0 group-hover:pl-2">
        Background Music
      </span>
      <audio
        ref={audioRef}
        src={audioUrl}
        loop
        onPlay={() => { setIsPlaying(true); setIsMuted(false); }}
        onPause={() => setIsPlaying(false)}
      />
    </button>
  );
}
