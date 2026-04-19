"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

export function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Sync muted state with element
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  useEffect(() => {
    // 1. Handle reveal event
    const handleReveal = () => {
      setIsVisible(true);
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current.play().catch(console.warn);
      }
    };
    window.addEventListener("saarthi-reveal", handleReveal);

    // 2. Initial volume and muted state
    if (audioRef.current) {
      audioRef.current.volume = 0.25;
      audioRef.current.muted = isMuted;
    }

    // 3. Interaction listener to start audio on landing page
    const handleInteraction = () => {
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current.play().then(() => {
          console.log("Audio started by interaction");
        }).catch((err) => {
          console.warn("Audio play failed:", err);
        });
      }
    };

    // Use broader interaction events
    window.addEventListener("mousedown", handleInteraction);
    window.addEventListener("keydown", handleInteraction);
    window.addEventListener("touchstart", handleInteraction);

    return () => {
      window.removeEventListener("saarthi-reveal", handleReveal);
      window.removeEventListener("mousedown", handleInteraction);
      window.removeEventListener("keydown", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
    };
  }, [isMuted]);

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    
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
        preload="auto"
      />
      {isVisible && (
        <button
          onClick={toggleMute}
          className="fixed bottom-6 right-6 z-50 p-3 rounded-full shadow-lg backdrop-blur-sm bg-amber-50/80 dark:bg-black/60 border border-amber-200/50 dark:border-amber-900/50 text-amber-700 dark:text-amber-500 hover:scale-110 hover:bg-amber-100/80 dark:hover:bg-amber-900/30 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
          aria-label={isMuted ? "Unmute background music" : "Mute background music"}
        >
          {isMuted ? <VolumeX size={20} strokeWidth={2.5} /> : <Volume2 size={20} strokeWidth={2.5} />}
        </button>
      )}
    </>
  );
}
