"use client";

import { useState, useEffect } from "react";
import type { Language, GuidanceData } from "@/lib/types";
import { t } from "@/lib/i18n";
import Background from "@/components/layout/Background";
import Header from "@/components/layout/Header";
import AskForm from "@/components/input/AskForm";
import LoadingState from "@/components/guidance/LoadingState";
import GuidanceResult from "@/components/guidance/GuidanceResult";

type AppState = "IDLE" | "LOADING" | "RESULT";

export default function Home() {
  const [lang, setLang] = useState<Language>("en");
  const [appState, setAppState] = useState<AppState>("IDLE");
  const [problem, setProblem] = useState("");
  const [guidance, setGuidance] = useState<GuidanceData | null>(null);
  const [error, setError] = useState("");

  const strings = t(lang);

  // Sync lang selection and check for URL query params on mount
  useEffect(() => {
    const saved = localStorage.getItem("saarathi-lang");
    const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
    const queryParam = params?.get("query");

    Promise.resolve().then(() => {
      if (saved === "en" || saved === "hi") {
        setLang(saved);
      }
      if (queryParam) {
        setProblem(queryParam);
      }
    });

    if (queryParam && typeof window !== "undefined") {
      const newUrl = window.location.pathname;
      window.history.replaceState({}, "", newUrl);
    }
  }, []);

  const handleToggleLang = () => {
    const nextLang = lang === "en" ? "hi" : "en";
    setLang(nextLang);
    localStorage.setItem("saarathi-lang", nextLang);
  };

  const handleAsk = async () => {
    if (!problem.trim()) {
      setError(strings.errors.empty);
      return;
    }

    if (!navigator.onLine) {
      setError(strings.errors.network);
      return;
    }

    setError("");
    setAppState("LOADING");

    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: problem, language: lang }),
      });

      const json = await response.json();

      if (json.success) {
        setGuidance(json.data);
        setAppState("RESULT");
      } else {
        setError(json.error || strings.errors.generic);
        setAppState("IDLE");
      }
    } catch {
      setError(strings.errors.generic);
      setAppState("IDLE");
    }
  };

  const handleAskAgain = () => {
    setProblem("");
    setGuidance(null);
    setAppState("IDLE");
  };

  return (
    <div className="min-h-screen flex flex-col justify-between p-4 selection:bg-[var(--accent-gold-glow)]">
      {/* Cinematic background */}
      <Background dimmed={appState !== "IDLE"} />

      {/* Main Container */}
      <div className="w-full max-w-lg mx-auto flex flex-col items-center flex-1 gap-8">
        <Header
          lang={lang}
          onToggleLang={handleToggleLang}
          compact={appState !== "IDLE"}
        />

        {/* Content Box */}
        <main className="w-full flex-1 flex flex-col justify-center max-w-md md:max-w-lg">
          {appState === "IDLE" && (
            <AskForm
              lang={lang}
              problem={problem}
              onProblemChange={setProblem}
              onSubmit={handleAsk}
              loading={false}
              error={error}
            />
          )}

          {appState === "LOADING" && (
            <LoadingState
              lang={lang}
              onTimeout={() => {
                // Allows user to see retry prompt in progressive messages if timeout occurs
              }}
            />
          )}

          {appState === "RESULT" && guidance && (
            <GuidanceResult
              data={guidance}
              lang={lang}
              onAskAgain={handleAskAgain}
            />
          )}
        </main>
      </div>

      {/* Footer Disclaimer */}
      <footer className="w-full max-w-md mx-auto text-center py-4 text-[10px] text-[var(--text-muted)] tracking-wide leading-relaxed mt-8">
        {strings.footer}
      </footer>
    </div>
  );
}
