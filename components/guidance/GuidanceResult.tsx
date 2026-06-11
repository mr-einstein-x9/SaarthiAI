"use client";

import { useRef, useEffect, useState } from "react";
import { Copy, RotateCcw, Share2, Check } from "lucide-react";
import type { Language, GuidanceData } from "@/lib/types";
import { t } from "@/lib/i18n";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import VerseCard from "./VerseCard";
import DialogueBlock from "./DialogueBlock";
import ActionList from "./ActionList";

interface GuidanceResultProps {
  data: GuidanceData;
  lang: Language;
  onAskAgain: () => void;
}

export default function GuidanceResult({
  data,
  lang,
  onAskAgain,
}: GuidanceResultProps) {
  const strings = t(lang);
  const resultRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  // Auto-scroll into view
  useEffect(() => {
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 150);
  }, []);

  const handleCopy = async () => {
    const text = [
      `${data.verse_ref}`,
      data.verse,
      "",
      `Arjuna: ${data.arjuna_question}`,
      `Krishna: ${data.krishna_answer}`,
      "",
      `Meaning: ${data.meaning}`,
      `For You: ${data.meaning_for_you}`,
      "",
      `Action: ${data.action.join(", ")}`,
    ].join("\n");

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API not available
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `SaarathiAI — ${data.verse_ref}`,
          text: `${data.verse_ref}\n${data.verse}\n\nKrishna: ${data.krishna_answer}\n\n${data.meaning_for_you}`,
        });
      } catch {
        // User cancelled share
      }
    }
  };

  return (
    <div ref={resultRef} className="animate-slide-up space-y-6">
      <Card variant="elevated">
        {/* Verse */}
        <VerseCard verseRef={data.verse_ref} verse={data.verse} />

        {/* Content sections */}
        <div className="p-6 space-y-6">
          {/* Arjuna-Krishna dialogue */}
          <DialogueBlock
            arjunaQuestion={data.arjuna_question}
            krishnaAnswer={data.krishna_answer}
            lang={lang}
          />

          {/* Meaning */}
          {data.meaning && (
            <section>
              <h3 className="text-[10px] text-[var(--accent-gold)] uppercase tracking-[0.2em] mb-2 font-bold">
                {strings.labels.meaning}
              </h3>
              <p className="text-[var(--text-primary)] leading-relaxed text-base">
                {data.meaning}
              </p>
            </section>
          )}

          {/* Personal connection */}
          {data.meaning_for_you && (
            <section>
              <h3 className="text-[10px] text-[var(--accent-gold)] uppercase tracking-[0.2em] mb-2 font-bold">
                {strings.labels.relates}
              </h3>
              <p className="text-[var(--text-primary)] opacity-90 leading-relaxed font-medium italic">
                {data.meaning_for_you}
              </p>
            </section>
          )}

          {/* Divider */}
          <div className="h-px w-full bg-[var(--border)]" />

          {/* Action items */}
          <ActionList actions={data.action} lang={lang} />
        </div>
      </Card>

      {/* Action buttons */}
      <div className="flex gap-3 justify-center pb-10">
        <Button
          variant="secondary"
          onClick={onAskAgain}
          icon={<RotateCcw size={14} />}
        >
          {strings.askAgain}
        </Button>
        <Button
          variant="secondary"
          onClick={handleCopy}
          icon={copied ? <Check size={14} /> : <Copy size={14} />}
        >
          {copied ? strings.copied : strings.copy}
        </Button>
        {typeof navigator !== "undefined" && "share" in navigator && (
          <Button
            variant="secondary"
            onClick={handleShare}
            icon={<Share2 size={14} />}
          >
            {strings.share}
          </Button>
        )}
      </div>
    </div>
  );
}
