"use client";

import { useState, useEffect } from "react";
import type { Language } from "@/lib/types";
import { t } from "@/lib/i18n";

interface LoadingStateProps {
  lang: Language;
  onTimeout?: () => void;
}

export default function LoadingState({ lang, onTimeout }: LoadingStateProps) {
  const strings = t(lang);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setPhase(1), 2500);
    const timer2 = setTimeout(() => setPhase(2), 6000);
    const timer3 = setTimeout(() => {
      setPhase(3);
      onTimeout?.();
    }, 10000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onTimeout]);

  const messages = [
    strings.loading,
    strings.loadingExtended,
    strings.loadingTimeout,
    strings.loadingTimeout,
  ];

  return (
    <div className="py-20 text-center animate-fade-in">
      {/* Animated ॐ */}
      <div className="relative inline-block">
        <span className="text-6xl text-[var(--accent-gold)] animate-pulse-slow">
          ॐ
        </span>
        {/* Glow ring */}
        <div
          className="absolute inset-0 -m-4 rounded-full animate-ping-slow"
          style={{
            background:
              "radial-gradient(circle, var(--accent-gold-glow) 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />
      </div>

      {/* Progressive message */}
      <p className="mt-6 text-[var(--text-secondary)] text-sm transition-all duration-500">
        {messages[phase]}
      </p>

      {/* Progress dots */}
      <div className="flex gap-1.5 justify-center mt-4">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-[var(--accent-gold)] animate-bounce"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>
    </div>
  );
}
