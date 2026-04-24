"use client";

import { useState, useRef, useEffect } from "react";
import { Copy, Sparkles, Languages, RotateCcw } from "lucide-react";

type Language = 'en' | 'hi';

export default function Home() {
  const [isInteracted, setIsInteracted] = useState(false);
  const [lang, setLang] = useState<Language>('en');
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    setQuoteIndex(Math.floor(Math.random() * 4));
  }, []);
  
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
        insight: "Krishna's Insight",
        meaning: "For You",
        action: "Your Path",
      },
      askAgain: "Ask Krishna again",
      copy: "Copy Wisdom",
      copied: "Copied!",
      footer: "SaarathiAI is spiritual guidance, not professional therapy."
    },
    hi: {
      subtitle: "सारथी",
      tagline: "गीता का ज्ञान, आज के जीवन के लिए",
      heading: "कहो मित्र, मन में क्या दुविधा है?",
      submit: "मार्गदर्शन पाएं",
      loading: "कृष्ण सुन रहे हैं...",
      chips: ["मेरा करियर रुका हुआ लगता है", "मैं बहुत ज़्यादा सोचता हूं", "मुझे असफलता का डर है", "मुझे किसी प्रियजन पर गुस्सा है"],
      labels: {
        insight: "कृष्ण की अंतर्दृष्टि",
        meaning: "आपके लिए",
        action: "आपका मार्ग",
      },
      askAgain: "कृष्ण से फिर पूछें",
      copy: "कॉपी करें",
      copied: "कॉपी हो गया!",
      footer: "SaarathiAI आध्यात्मिक मार्गदर्शन है, चिकित्सा नहीं।"
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
      if (data.success) setResponse(data);
      else throw new Error("Connection lost");
    } catch (err: any) { setError(err.message); } finally { setLoading(false); }
  };

  useEffect(() => {
    if (response && responseRef.current) {
      setTimeout(() => responseRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  }, [response]);

  const handleCopy = () => {
    if (!response?.data) return;
    const d = response.data;
    const text = `${d.verse_ref}\n${d.verse}\n\nInsight: ${d.insight}\nFor You: ${d.meaning_for_you}\nAction: ${d.action?.join(", ")}`;
    navigator.clipboard.writeText(text);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className={`krishna-scene min-h-screen overflow-hidden ${isInteracted ? 'krishna-scene--active' : 'krishna-scene--landed'}`}>
      <div className="krishna-scene__image" aria-hidden="true"></div>
      <div className="saarathi-content relative z-10 min-h-screen flex flex-col pt-8 pb-16 overflow-x-hidden transition-all duration-1000">
        
        {/* HEADER */}
        <div className={`flex flex-col items-center transition-all duration-700 ${isInteracted ? 'mt-4' : 'mt-[15vh]'}`}>
          <img src="/saarthi-symbol.png" alt="Saarthi" className="w-24 h-24 sm:w-32 sm:h-32 object-contain" />
          <h1 className="text-3xl sm:text-4xl font-bold">SaarathiAI <span className="font-spiritual text-accent-gold">{currentT.subtitle}</span></h1>
          {!isInteracted && (
            <button onClick={() => setIsInteracted(true)} className="mt-8 bg-accent-gold px-8 py-3 rounded-full text-black font-bold shadow-xl transition-all hover:scale-105">
              Ask Krishna
            </button>
          )}
        </div>

        <main className={`flex-grow w-full max-w-xl mx-auto px-4 transition-all duration-1000 ${isInteracted ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div className="flex justify-end mb-4">
             <button onClick={() => setLang(lang === 'en' ? 'hi' : 'en')} className="bg-card px-3 py-1 rounded-full text-xs border border-border">
                <Languages size={14} className="inline mr-1" /> {lang === 'en' ? 'HI' : 'EN'}
             </button>
          </div>

          {!response && !loading && (
            <div className="animate-fade-in">
              <h2 className="text-lg font-medium mb-4 text-center">{currentT.heading}</h2>
              <textarea
                ref={textareaRef}
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                placeholder={placeholders[lang][quoteIndex % 2]}
                className="w-full bg-card border border-border rounded-2xl p-5 text-lg min-h-[140px] outline-none shadow-inner"
              />
              <div className="flex flex-wrap gap-2 mt-4 justify-center">
                {currentT.chips.map((c, i) => <button key={i} onClick={() => setProblem(c)} className="bg-card/40 border border-border px-3 py-1 rounded-full text-xs hover:border-accent-gold transition-colors">{c}</button>)}
              </div>
              <button onClick={() => fetchGuidance(lang)} disabled={!problem.trim()} className="mt-8 w-full bg-accent-gold text-black font-bold h-12 rounded-full shadow-lg disabled:opacity-50">
                {currentT.submit}
              </button>
              {error && <p className="mt-4 text-red-400 text-center text-sm">{error}</p>}
            </div>
          )}

          {loading && (
            <div className="py-20 text-center animate-pulse">
              <span className="text-5xl text-accent-gold">ॐ</span>
              <p className="mt-4 text-secondary text-sm">{currentT.loading}</p>
            </div>
          )}

          {response && !loading && (
            <div ref={responseRef} className="animate-slide-up space-y-6">
              <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-2xl">
                <div className="p-6 text-center bg-card-hover/30 border-b border-border">
                  <span className="text-[10px] text-accent-gold font-bold tracking-widest uppercase">{response.data.verse_ref}</span>
                  <p className="mt-2 font-spiritual text-xl md:text-2xl text-accent-gold-light leading-relaxed">{response.data.verse}</p>
                </div>
                
                <div className="p-6 space-y-6">
                  <section>
                    <h3 className="text-[10px] text-accent-gold uppercase tracking-widest mb-2 font-bold">{currentT.labels.insight}</h3>
                    <p className="text-[#e8e2d7] leading-relaxed text-lg">{response.data.insight}</p>
                  </section>

                  <section>
                    <h3 className="text-[10px] text-accent-gold uppercase tracking-widest mb-2 font-bold">{currentT.labels.meaning}</h3>
                    <p className="text-[#e8e2d7] opacity-90 leading-relaxed font-medium italic">{response.data.meaning_for_you}</p>
                  </section>

                  <div className="h-px w-full bg-border/30"></div>

                  <section>
                    <h3 className="text-[10px] text-success uppercase tracking-widest mb-3 font-bold">{currentT.labels.action}</h3>
                    <ul className="space-y-2">
                      {response.data.action?.map((a: string, i: number) => (
                        <li key={i} className="flex gap-2 text-[#e8e2d7] text-sm">
                          <span className="text-success">•</span> {a}
                        </li>
                      ))}
                    </ul>
                  </section>
                </div>
              </div>

              <div className="flex gap-3 justify-center pb-10">
                <button onClick={() => {setResponse(null); setProblem("");}} className="flex items-center gap-2 px-5 py-2 rounded-full bg-card border border-border text-xs hover:border-accent-gold transition-colors"><RotateCcw size={14} /> {currentT.askAgain}</button>
                <button onClick={handleCopy} className="flex items-center gap-2 px-5 py-2 rounded-full bg-card border border-border text-xs hover:border-accent-gold transition-colors"><Copy size={14} /> {copied ? currentT.copied : currentT.copy}</button>
              </div>
            </div>
          )}
        </main>

        <footer className="mt-auto text-center p-8 text-muted text-[10px] opacity-40">
          <p>{currentT.footer}</p>
        </footer>
      </div>
    </section>
  );
}
