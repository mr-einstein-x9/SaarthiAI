"use client";

import { useState, useRef, useEffect } from "react";
import { Copy, Sparkles, Languages, RotateCcw } from "lucide-react";

type Language = 'en' | 'hi';
type LockedVerse = {
  chapter_verse?: string;
  shloka_sanskrit?: string;
};

export default function Home() {
  const [isInteracted, setIsInteracted] = useState(false);
  const [scrollOpacity, setScrollOpacity] = useState(1);
  const [lang, setLang] = useState<Language>('en');
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    setQuoteIndex(Math.floor(Math.random() * 4));
  }, []);
  
  useEffect(() => {
    const handleScroll = () => {
      if (!isInteracted) return;
      const scrollY = window.scrollY;
      const newOpacity = Math.max(0, Math.min(1, 1 - (scrollY - 10) / 50));
      setScrollOpacity(newOpacity);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isInteracted]);

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
      heading: "Tell me, what is troubling your heart?",
      submit: "Seek Guidance",
      loading: "Krishna is listening...",
      chips: ["I feel stuck in my career", "I can't stop overthinking", "I'm scared of failing", "I'm angry at someone I love"],
      labels: {
        relevance: "Why this verse fits",
        explanation: "Krishna's Guidance",
        action: "Your Path Forward",
        translation: "Translation"
      },
      askAgain: "Ask another question",
      copy: "Copy this wisdom",
      copied: "Copied!",
      footer: "SaarathiAI is spiritual guidance, not a substitute for professional mental health support."
    },
    hi: {
      subtitle: "सारथी",
      tagline: "गीता का ज्ञान, आज के जीवन के लिए",
      heading: "कहो मित्र, मन में क्या दुविधा है?",
      submit: "मार्गदर्शन पाएं",
      loading: "कृष्ण सुन रहे हैं...",
      chips: ["मेरा करियर रुका हुआ लगता है", "मैं बहुत ज़्यादा सोचता हूं", "मुझे असफलता का डर है", "मुझे किसी प्रियजन पर गुस्सा है"],
      labels: {
        relevance: "यह श्लोक क्यों उपयुक्त है",
        explanation: "कृष्ण का मार्गदर्शन",
        action: "आपका मार्ग",
        translation: "अनुवाद"
      },
      askAgain: "दूसरा प्रश्न पूछें",
      copy: "कॉपी करें",
      copied: "कॉपी हो गया!",
      footer: "SaarathiAI आध्यात्मिक मार्गदर्शन है, पेशेवर मानसिक स्वास्थ्य सहायता का विकल्प नहीं।"
    }
  };

  const currentT = t[lang];
  const placeholders = {
    en: ['"Arise, O Arjuna!"\nShare what is on your mind.', '"Do not fear."\nTell me what troubles you.'],
    hi: ['"उठो पार्थ!"\nअपने मन की बात साझा करो।', '"डरो मत।"\nअपनी चिंता मुझसे साझा करो।']
  };

  const fetchGuidance = async (targetLang: Language) => {
    if (!problem.trim()) return;
    setLoading(true); setError(""); setResponse(null); setCopied(false);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      const endpoint = baseUrl ? `${baseUrl}/ask` : "/api/ask";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problem, query: problem, language: targetLang })
      });
      let data = await res.json();
      if (baseUrl && !res.ok) {
        const fb = await fetch("/api/ask", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ problem, language: targetLang })
        });
        data = await fb.json();
      }
      if (!res.ok && !data.success) throw new Error("Failed to fetch guidance");
      setResponse(data);
    } catch (err: any) { setError(err.message); } finally { setLoading(false); }
  };

  const handleCopy = () => {
    if (!response?.data) return;
    const d = response.data;
    const text = `${d.verse?.chapter}:${d.verse?.verse}\n${d.verse?.text}\n\nExplanation: ${d.explanation}\nAction: ${Array.isArray(d.action) ? d.action.join(", ") : d.action}`;
    navigator.clipboard.writeText(text);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className={`krishna-scene min-h-screen overflow-hidden ${isInteracted ? 'krishna-scene--active' : 'krishna-scene--landed'}`}>
      <div className="krishna-scene__image" aria-hidden="true"></div>
      <div className="saarathi-content relative z-10 min-h-screen flex flex-col pt-8 pb-16 overflow-x-hidden transition-all duration-1000">
        
        {/* LOGO SECTION */}
        <div className={`flex flex-col items-center transition-all duration-700 ${isInteracted ? 'mt-4' : 'mt-[15vh]'}`}>
          <img src="/saarthi-symbol.png" alt="SaarthiAI" className="w-24 h-24 sm:w-32 sm:h-32 object-contain mb-2" />
          <h1 className="text-3xl sm:text-4xl font-bold text-center">SaarathiAI <span className="font-spiritual text-accent-gold">{currentT.subtitle}</span></h1>
          {!isInteracted && (
            <button onClick={() => setIsInteracted(true)} className="mt-8 bg-accent-gold px-8 py-3 rounded-full text-black font-bold flex items-center gap-2 transition-all hover:scale-105">
              <Sparkles size={18} /> Ask Krishna
            </button>
          )}
        </div>

        <main className={`flex-grow w-full max-w-2xl mx-auto px-4 transition-all duration-1000 ${isInteracted ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div className="flex justify-end mb-4">
             <button onClick={() => setLang(lang === 'en' ? 'hi' : 'en')} className="bg-card px-3 py-1 rounded-full text-xs border border-border">
                <Languages size={14} className="inline mr-1" /> {lang === 'en' ? 'HI' : 'EN'}
             </button>
          </div>

          {!response && !loading && (
            <div className="animate-fade-in">
              <h2 className="text-xl font-medium mb-4 text-center">{currentT.heading}</h2>
              <textarea
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                placeholder={placeholders[lang][quoteIndex % 2]}
                className="w-full bg-card border border-border rounded-2xl p-5 text-lg min-h-[150px] focus:ring-1 focus:ring-accent-gold outline-none"
              />
              <div className="flex flex-wrap gap-2 mt-4 justify-center">
                {currentT.chips.map((c, i) => <button key={i} onClick={() => setProblem(c)} className="bg-card/50 border border-border px-3 py-1 rounded-full text-sm hover:border-accent-gold transition-colors">{c}</button>)}
              </div>
              <button onClick={() => fetchGuidance(lang)} disabled={!problem.trim()} className="mt-8 w-full bg-accent-gold text-black font-bold h-14 rounded-full flex items-center justify-center gap-2 disabled:opacity-50">
                <Sparkles size={18} /> {currentT.submit}
              </button>
            </div>
          )}

          {loading && (
            <div className="py-20 text-center animate-pulse">
              <span className="text-6xl text-accent-gold">ॐ</span>
              <p className="mt-4 text-secondary">{currentT.loading}</p>
            </div>
          )}

          {response && !loading && (
            <div ref={responseRef} className="animate-slide-up space-y-6">
              <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-2xl">
                <div className="p-8 text-center bg-gradient-to-b from-card-hover to-card border-b border-border">
                  <span className="text-xs text-accent-gold font-bold tracking-widest uppercase">BG {response.data.verse?.chapter}.{response.data.verse?.verse}</span>
                  <p className="mt-4 font-spiritual text-2xl md:text-3xl text-accent-gold-light leading-relaxed">{response.data.verse?.text}</p>
                </div>
                
                <div className="p-8 space-y-8">
                  <section>
                    <h3 className="text-xs text-accent-gold uppercase tracking-widest mb-2 font-bold">{currentT.labels.relevance}</h3>
                    <p className="italic text-[#e8e2d7] opacity-90 leading-relaxed">"{response.data.relevance}"</p>
                  </section>

                  <div className="h-px w-full bg-border/40"></div>

                  <section>
                    <h3 className="text-xs text-accent-gold uppercase tracking-widest mb-2 font-bold">{currentT.labels.explanation}</h3>
                    <p className="leading-relaxed text-[#e8e2d7] whitespace-pre-line">{response.data.explanation}</p>
                  </section>

                  <div className="h-px w-full bg-border/40"></div>

                  <section>
                    <h3 className="text-xs text-success uppercase tracking-widest mb-3 font-bold">{currentT.labels.action}</h3>
                    <ul className="space-y-2">
                      {Array.isArray(response.data.action) ? response.data.action.map((a: string, i: number) => (
                        <li key={i} className="flex gap-2 text-[#e8e2d7] font-medium">
                          <span className="text-success">•</span> {a}
                        </li>
                      )) : <li className="text-[#e8e2d7]">{response.data.action}</li>}
                    </ul>
                  </section>

                  <details className="border-t border-border/40 pt-4">
                    <summary className="text-xs text-muted uppercase font-bold cursor-pointer hover:text-accent-gold">{currentT.labels.translation}</summary>
                    <p className="mt-2 text-sm text-secondary leading-relaxed">{response.data.verse?.translation}</p>
                  </details>
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <button onClick={() => {setResponse(null); setProblem("");}} className="flex items-center gap-2 px-6 py-2 rounded-full bg-card border border-border hover:border-accent-gold transition-colors"><RotateCcw size={16} /> {currentT.askAgain}</button>
                <button onClick={handleCopy} className="flex items-center gap-2 px-6 py-2 rounded-full bg-card border border-border hover:border-accent-gold transition-colors"><Copy size={16} /> {copied ? currentT.copied : currentT.copy}</button>
              </div>
            </div>
          )}
        </main>

        <footer className="mt-auto text-center p-8 text-muted text-xs opacity-60">
          <p>{currentT.footer}</p>
        </footer>
      </div>
    </section>
  );
}
