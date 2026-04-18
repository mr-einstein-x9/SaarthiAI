"use client";

import { useState, useRef, useEffect } from "react";
import { Copy, Sparkles, Languages, RotateCcw } from "lucide-react";

type Language = 'en' | 'hi';
type LockedVerse = {
  chapter_verse?: string;
  shloka_sanskrit?: string;
};

export default function Home() {
  const [lang, setLang] = useState<Language>('en');
  const [problem, setProblem] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  
  const responseRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const t = {
    en: {
      subtitle: "सारथी",
      tagline: "Wisdom from the Gita, for your life today",
      heading: "What is troubling you?",
      placeholder: "Describe what you're going through...\n(e.g. I feel stuck in my career, I'm angry at someone I love)",
      submit: "Seek Guidance",
      loading: "Krishna is listening...",
      chips: [
        "I feel stuck in my career",
        "I can't stop overthinking",
        "I'm scared of failing",
        "I'm angry at someone I love"
      ],
      meaning: "What this means",
      teaching: "What Krishna is telling you",
      firstWord: "Krishna's first word",
      situation: "For your situation",
      step: "Your step today",
      whyFits: "Why this shloka fits",
      deeperWisdom: "Deeper wisdom",
      dailyPractice: "Daily Practice",
      reflection: "Reflection",
      also: "Also relevant:",
      askAgain: "Ask another question",
      regenerate: "Regenerate Response",
      copy: "Copy this wisdom",
      copied: "Copied!",
      footer: "SaarathiAI is spiritual guidance, not a substitute for professional mental health support.",
      builtWith: "Built with love. Rooted in the Gita."
    },
    hi: {
      subtitle: "सारथी",
      tagline: "गीता का ज्ञान, आज के जीवन के लिए",
      heading: "आपको क्या परेशान कर रहा है?",
      placeholder: "अपनी परेशानी बताएं...\n(जैसे: मुझे अपने करियर में दिशा नहीं मिल रही)",
      submit: "मार्गदर्शन पाएं",
      loading: "कृष्ण सुन रहे हैं...",
      chips: [
        "मेरा करियर रुका हुआ लगता है",
        "मैं बहुत ज़्यादा सोचता हूं",
        "मुझे असफलता का डर है",
        "मुझे किसी प्रियजन पर गुस्सा है"
      ],
      meaning: "अर्थ",
      teaching: "कृष्ण आपसे क्या कह रहे हैं",
      firstWord: "\u0915\u0943\u0937\u094d\u0923 \u0915\u093e \u092a\u0939\u0932\u093e \u0935\u091a\u0928",
      situation: "आपकी स्थिति में",
      step: "आज का कदम",
      whyFits: "\u092f\u0939 \u0936\u094d\u0932\u094b\u0915 \u0915\u094d\u092f\u094b\u0902 \u0909\u092a\u092f\u0941\u0915\u094d\u0924 \u0939\u0948",
      deeperWisdom: "\u0917\u0939\u0930\u093e \u091c\u094d\u091e\u093e\u0928",
      dailyPractice: "\u0906\u091c \u0915\u093e \u0905\u092d\u094d\u092f\u093e\u0938",
      reflection: "\u0935\u093f\u091a\u093e\u0930",
      also: "अन्य प्रासंगिक श्लोक:",
      askAgain: "दूसरा प्रश्न पूछें",
      regenerate: "पुनः विचार करें",
      copy: "यह ज्ञान कॉपी करें",
      copied: "कॉपी हो गया!",
      footer: "SaarathiAI आध्यात्मिक मार्गदर्शन है, पेशेवर मानसिक स्वास्थ्य सहायता का विकल्प नहीं।",
      builtWith: "प्रेम से निर्मित। गीता में समाहित।"
    }
  };

  const currentT = t[lang];
  const data = response?.data || {};
  const openingLine = data.opening_line || data.core_message || "";
  const problemReflection = data.problem_reflection || data.their_problem || "";
  const krishnaGuidance = data.krishna_guidance || data.how_it_applies || "";
  const whyThisFits = data.how_it_applies || data.krishna_guidance || "";
  const practicalSteps = Array.isArray(data.practical_steps)
    ? data.practical_steps.slice(0, 3)
    : [];

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.max(120, textareaRef.current.scrollHeight) + "px";
    }
  }, [problem]);

  useEffect(() => {
    if (textareaRef.current && !response && !loading) {
      textareaRef.current.focus();
    }
  }, [response, loading]);

  useEffect(() => {
    if (response && responseRef.current) {
      setTimeout(() => {
        responseRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [response]);

  const fetchGuidance = async (targetLang: Language, lockedVerse?: LockedVerse) => {
    if (!problem.trim() || problem.length > 500) return;
    
    setLoading(true);
    setError("");
    setResponse(null);
    setCopied(false);
    
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problem,
          language: targetLang,
          ...(lockedVerse?.shloka_sanskrit ? { lockedVerse } : {})
        })
      });
      
      const data = await res.json();
      
      if (!res.ok || data.success === false) {
        throw new Error(data.message || data.error || "Failed to fetch guidance");
      }

      if (lockedVerse?.shloka_sanskrit && data.data) {
        data.data.shloka_sanskrit = lockedVerse.shloka_sanskrit;
      }
      
      setResponse(data);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    fetchGuidance(lang);
  };

  const handleLanguageToggle = () => {
    const nextLang = lang === 'en' ? 'hi' : 'en';
    setLang(nextLang);

    if (response && problem.trim()) {
      fetchGuidance(nextLang, {
        chapter_verse: response.data?.chapter_verse,
        shloka_sanskrit: response.data?.shloka_sanskrit
      });
    }
  };

  const handleCopy = () => {
    if (!response || !response.data) return;
    const guidance = response.data;
    const copyOpening = guidance.opening_line || guidance.core_message || "";
    const copyProblem = guidance.problem_reflection || guidance.their_problem || "";
    const copyGuidance = guidance.krishna_guidance || guidance.how_it_applies || "";
    const copyWhyFits = guidance.how_it_applies || guidance.krishna_guidance || "";
    
    const stepsString = Array.isArray(guidance.practical_steps) && guidance.practical_steps.length
      ? guidance.practical_steps.slice(0, 3).map((s: string) => `  * ${s}`).join("\n")
      : "";

    const text = `${guidance.chapter_verse || ""}

${guidance.shloka_sanskrit || ""}

Meaning:
${guidance.shloka_english || ""}

Guidance:
* Krishna's first word:
  ${copyOpening}
* Core teaching:
  ${guidance.core_message || ""}
* For your situation:
  ${copyProblem}
  ${copyGuidance}
* Your step today:
${stepsString}
* Daily Practice:
  ${guidance.daily_practice || ""}
* Why this shloka fits:
  ${copyWhyFits}

"${guidance.deeper_wisdom || ""}"

${guidance.reflection_question || ""}`;
    
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setProblem("");
    setResponse(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="krishna-scene min-h-screen overflow-hidden">
      <div className="krishna-scene__image" aria-hidden="true"></div>
      <div className="krishna-scene__warmth" aria-hidden="true"></div>
      <div className="krishna-scene__haze" aria-hidden="true"></div>
      <div className="krishna-scene__canopy" aria-hidden="true"></div>

      <div className="saarathi-content relative z-10 min-h-screen flex flex-col pt-8 pb-16 overflow-x-hidden">
      {/* HEADER */}
      <header className="flex flex-col items-center justify-center text-center py-10 relative w-full">
        <button 
          onClick={handleLanguageToggle}
          disabled={loading}
          className="absolute top-0 right-0 flex items-center gap-2 bg-card border border-border px-3 py-1.5 rounded-full text-sm font-medium hover:bg-card-hover transition-colors disabled:opacity-50"
        >
          <Languages size={16} className="text-accent-gold" />
          {lang === 'en' ? 'HI' : 'EN'}
        </button>
        
        <div className="w-16 h-16 rounded-full bg-accent-gold/10 flex items-center justify-center mb-6">
          <span className="text-4xl text-accent-gold font-serif">ॐ</span>
        </div>
        
        <h1 className="max-w-full text-3xl sm:text-4xl font-bold tracking-tight mb-2 leading-tight break-words">
          SaarathiAI <span className="block sm:inline text-accent-gold-light opacity-80 font-spiritual">{currentT.subtitle}</span>
        </h1>
        <p className="text-secondary text-base sm:text-lg max-w-[18rem] sm:max-w-none mx-auto leading-snug break-words">{currentT.tagline}</p>
      </header>

      {/* INPUT SECTION */}
      <main className="flex-grow w-full min-w-0 flex flex-col">
        {!response && !loading && (
          <div className="w-full min-w-0 flex-grow flex flex-col justify-center pb-20 animate-fade-in">
            <h2 className="text-2xl font-medium mb-4 text-center">{currentT.heading}</h2>
            <div className="relative w-full max-w-full min-w-0 shadow-lg">
              <textarea
                ref={textareaRef}
                value={problem}
                onChange={(e) => setProblem(e.target.value.substring(0, 500))}
                placeholder={currentT.placeholder}
                className="w-full max-w-full min-w-0 box-border bg-card border border-border rounded-2xl p-5 text-lg resize-none focus:outline-none focus:ring-1 focus:ring-accent-gold focus:border-accent-gold transition-all min-h-[120px]"
                disabled={loading}
              />
              <div className="absolute bottom-4 right-4 text-xs font-mono text-muted">
                {problem.length}/500
              </div>
            </div>

            {/* CHIPS */}
            <div className="flex flex-wrap gap-2 mt-4 justify-center w-full max-w-full min-w-0 overflow-hidden">
              {currentT.chips.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => setProblem(chip)}
                  disabled={loading}
                  className="max-w-full min-w-0 whitespace-normal break-words bg-card/50 border border-border px-3 py-1.5 rounded-full text-sm text-secondary text-center hover:text-primary hover:border-accent-gold/50 transition-colors"
                >
                  {chip}
                </button>
              ))}
            </div>

            {error && (
              <div className="mt-6 p-4 bg-red-900/20 border border-red-900/50 rounded-xl text-red-200 text-center">
                {error}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={!problem.trim() || loading}
              className="mt-8 w-full max-w-sm mx-auto bg-accent-gold hover:bg-accent-gold-light text-black font-semibold h-14 rounded-full flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:hover:bg-accent-gold"
            >
              <Sparkles size={18} />
              {currentT.submit}
            </button>
          </div>
        )}

        {/* LOADING STATE */}
        {loading && (
          <div className="w-full flex-grow flex flex-col items-center justify-center py-20 animate-fade-in">
            <div className="relative">
              <span className="text-6xl text-accent-gold font-serif animate-pulse-slow">ॐ</span>
              <div className="absolute inset-0 bg-accent-gold/20 blur-xl rounded-full animate-pulse-slow"></div>
            </div>
            <p className="mt-8 text-xl text-secondary animate-pulse">{currentT.loading}</p>
          </div>
        )}

        {/* RESPONSE CARD */}
        {response && !loading && (
          <div ref={responseRef} className="w-full animate-slide-up pb-10">
            <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-2xl relative">
              {/* Card Header Content */}
              <div className="p-6 md:p-8 text-center bg-gradient-to-b from-card-hover to-card border-b border-border">
                <span className="inline-block px-3 py-1 bg-accent-gold/10 text-accent-gold text-xs font-semibold tracking-widest uppercase rounded-full mb-6">
                  {response.data?.chapter_verse}
                </span>
                
                <div className="mb-4">
                  <p className="font-spiritual text-2xl md:text-3xl text-accent-gold-light leading-relaxed whitespace-pre-wrap">
                    {response.data?.shloka_sanskrit}
                  </p>
                </div>
              </div>

              {/* Card Body Content */}
              <div className="px-6 md:px-10 py-8 space-y-8">
                
                <section>
                  <h3 className="text-xs text-accent-gold uppercase tracking-wider mb-2 font-semibold">
                    {currentT.firstWord}
                  </h3>
                  <p className="font-spiritual text-2xl text-accent-gold-light leading-snug">
                    {openingLine}
                  </p>
                  {data.core_message && data.core_message !== openingLine && (
                    <p className="mt-3 leading-relaxed text-secondary">
                      {data.core_message}
                    </p>
                  )}
                </section>

                <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent"></div>

                <section>
                  <h3 className="text-xs text-accent-gold uppercase tracking-wider mb-2 font-semibold">
                    {currentT.situation}
                  </h3>
                  <div className="space-y-3 leading-relaxed text-[#e8e2d7]">
                    {problemReflection && (
                      <p className="italic opacity-85">"{problemReflection}"</p>
                    )}
                    <p>{krishnaGuidance}</p>
                  </div>
                </section>

                <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent"></div>

                <section>
                  <h3 className="text-xs text-success uppercase tracking-wider mb-4 font-semibold flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-success"></div>
                    {currentT.step}
                  </h3>
                  <ul className="leading-relaxed font-medium space-y-2 mb-4">
                    {practicalSteps.map((step: string, idx: number) => (
                      <li key={idx} className="flex gap-2 before:text-success before:opacity-70 before:content-['-'] [&>span:first-child]:hidden">
                        <span className="text-success opacity-70">•</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-sm border-t border-border/30 pt-3 text-secondary mt-3">
                    <strong className="text-accent-gold">{currentT.dailyPractice}:</strong> {data.daily_practice}
                  </p>
                </section>

                <div className="space-y-0 border-y border-border/40 divide-y divide-border/40">
                  <details>
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 py-4 text-xs text-muted uppercase tracking-wider font-semibold hover:text-accent-gold transition-colors">
                      <span>{currentT.whyFits}</span>
                      <span aria-hidden="true" className="text-accent-gold">+</span>
                    </summary>
                    <div className="pb-5 space-y-3 text-secondary leading-relaxed">
                      {data.shloka_english && <p>{data.shloka_english}</p>}
                      {whyThisFits && <p>{whyThisFits}</p>}
                    </div>
                  </details>

                  <details>
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 py-4 text-xs text-muted uppercase tracking-wider font-semibold hover:text-accent-gold transition-colors">
                      <span>{currentT.deeperWisdom}</span>
                      <span aria-hidden="true" className="text-accent-gold">+</span>
                    </summary>
                    <div className="pb-5 space-y-4">
                      {data.deeper_wisdom && (
                        <p className="font-serif italic text-accent-gold-light text-lg leading-relaxed">
                          "{data.deeper_wisdom}"
                        </p>
                      )}
                      {data.reflection_question && (
                        <p className="text-sm text-secondary leading-relaxed">
                          <strong className="text-accent-gold">{currentT.reflection}:</strong> {data.reflection_question}
                        </p>
                      )}
                    </div>
                  </details>
                </div>

              </div>
            </div>

            {/* Actions below card */}
            <div className="flex flex-col sm:flex-row gap-4 mt-6 justify-center">
              <button 
                onClick={handleSubmit}
                disabled={loading || !problem.trim()}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-card border border-border hover:border-accent-gold/50 transition-colors disabled:opacity-50"
               >
                <RotateCcw size={16} className="text-secondary" />
                <span>{currentT.regenerate}</span>
              </button>
              <button 
                onClick={handleCopy}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-card border border-border hover:border-accent-gold/50 transition-colors"
               >
                <Copy size={16} className="text-secondary" />
                <span>{copied ? currentT.copied : currentT.copy}</span>
              </button>
              <button 
                onClick={handleReset}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-card border border-border hover:border-accent-gold/50 transition-colors"
               >
                <Sparkles size={16} className="text-secondary" />
                <span>{currentT.askAgain}</span>
              </button>
            </div>

            {/* Trust Element */}
            <div className="mt-10 text-center text-xs font-medium text-muted uppercase tracking-widest opacity-60">
              {lang === 'en' ? "Rooted in Bhagavad Gita wisdom" : "भगवद गीता के ज्ञान पर आधारित"}
            </div>
            
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="mt-auto text-center pt-8 border-t border-border/50 text-muted text-xs">
        <p className="mb-1 max-w-sm mx-auto leading-relaxed">{currentT.footer}</p>
        <p>{currentT.builtWith}</p>
      </footer>

      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
        .animate-slide-up { animation: slide-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
      </div>
    </section>
  );
}
