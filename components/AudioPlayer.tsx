"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

export function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    // Set initial volume
    if (audioRef.current) {
      audioRef.current.volume = 0.2;
    }

    const handleFirstInteraction = () => {
      if (!hasInteracted) {
        setHasInteracted(true);
        if (audioRef.current) {
          // Play automatically upon user first interaction
          audioRef.current.play().catch((err) => {
            console.warn("Audio playback prevented by browser:", err);
          });
        }
      }
    };

    // Listen for common interaction events to start audio
    window.addEventListener("click", handleFirstInteraction, { once: true });
    window.addEventListener("keydown", handleFirstInteraction, { once: true });
    window.addEventListener("touchstart", handleFirstInteraction, { once: true });

    return () => {
      window.removeEventListener("click", handleFirstInteraction);
      window.removeEventListener("keydown", handleFirstInteraction);
      window.removeEventListener("touchstart", handleFirstInteraction);
    };
  }, [hasInteracted]);

  useEffect(() => {
    // Reactively apply mute state to the audio element
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid double-triggering window click
    
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    
    // If the user clicks the button, that counts as interaction
    if (!hasInteracted) {
      setHasInteracted(true);
    }

    // Ensure audio starts playing if it was paused
    if (audioRef.current && audioRef.current.paused) {
      audioRef.current.play().catch(console.warn);
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src="/flute.mp3"
        loop
        preload="lazy"
      />
      <button
        onClick={toggleMute}
        className="fixed bottom-6 right-6 z-50 p-3 rounded-full shadow-lg backdrop-blur-sm bg-amber-50/80 dark:bg-black/60 border border-amber-200/50 dark:border-amber-900/50 text-amber-700 dark:text-amber-500 hover:scale-110 hover:bg-amber-100/80 dark:hover:bg-amber-900/30 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
        aria-label={isMuted ? "Unmute background music" : "Mute background music"}
      >
        {isMuted ? <VolumeX size={20} strokeWidth={2.5} /> : <Volume2 size={20} strokeWidth={2.5} />}
      </button>
    </>
  );
}
