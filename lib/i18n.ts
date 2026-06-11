import type { Language } from "./types";

// ── Translation System ─────────────────────────────────────────────────────

interface Translations {
  subtitle: string;
  tagline: string;
  heading: string;
  submit: string;
  loading: string;
  loadingExtended: string;
  loadingTimeout: string;
  chips: string[];
  labels: {
    battlefield: string;
    meaning: string;
    relates: string;
    action: string;
  };
  askAgain: string;
  copy: string;
  copied: string;
  share: string;
  footer: string;
  browse: string;
  browseTitle: string;
  browseSubtitle: string;
  chapters: string;
  verses: string;
  backToChapters: string;
  askKrishna: string;
  placeholder: string[];
  errors: {
    empty: string;
    tooLong: string;
    network: string;
    generic: string;
  };
}

const translations: Record<Language, Translations> = {
  en: {
    subtitle: "सारथी",
    tagline: "Wisdom from the Gita, for your life today",
    heading: "Tell me, what is troubling your heart?",
    submit: "Seek Guidance",
    loading: "Krishna is listening...",
    loadingExtended: "Searching ancient wisdom...",
    loadingTimeout: "Taking longer than usual. You may retry.",
    chips: [
      "I feel stuck in my career",
      "I can't stop overthinking",
      "I'm scared of failing",
      "I'm angry at someone I love",
    ],
    labels: {
      battlefield: "On The Battlefield",
      meaning: "Meaning",
      relates: "For You",
      action: "Your Path Forward",
    },
    askAgain: "Ask Krishna again",
    copy: "Copy Wisdom",
    copied: "Copied!",
    share: "Share",
    footer: "SaarathiAI provides spiritual guidance rooted in the Bhagavad Gita. It is not a substitute for professional therapy.",
    browse: "Browse the Gita",
    browseTitle: "The Bhagavad Gita",
    browseSubtitle: "Explore the 18 chapters of divine wisdom",
    chapters: "Chapters",
    verses: "Verses",
    backToChapters: "Back to chapters",
    askKrishna: "Ask Krishna",
    placeholder: [
      '"Arise, O Arjuna!"\nShare what is on your mind.',
      '"Do not fear."\nTell me what troubles you.',
    ],
    errors: {
      empty: "Please share what's on your mind first.",
      tooLong: "Please keep your message under 2000 characters.",
      network: "Connection lost. Please check your internet and try again.",
      generic: "Spiritual connection interrupted. Please try again.",
    },
  },
  hi: {
    subtitle: "सारथी",
    tagline: "गीता का ज्ञान, आज के जीवन के लिए",
    heading: "कहो मित्र, मन में क्या दुविधा है?",
    submit: "मार्गदर्शन पाएं",
    loading: "कृष्ण सुन रहे हैं...",
    loadingExtended: "प्राचीन ज्ञान खोज रहे हैं...",
    loadingTimeout: "सामान्य से अधिक समय लग रहा है। पुनः प्रयास करें।",
    chips: [
      "मेरा करियर रुका हुआ लगता है",
      "मैं बहुत ज़्यादा सोचता हूं",
      "मुझे असफलता का डर है",
      "मुझे किसी प्रियजन पर गुस्सा है",
    ],
    labels: {
      battlefield: "कुरुक्षेत्र की रणभूमि पर",
      meaning: "अर्थ",
      relates: "आपके लिए",
      action: "आपका मार्ग",
    },
    askAgain: "कृष्ण से फिर पूछें",
    copy: "कॉपी करें",
    copied: "कॉपी हो गया!",
    share: "साझा करें",
    footer: "SaarathiAI भगवद्गीता पर आधारित आध्यात्मिक मार्गदर्शन है। यह पेशेवर चिकित्सा का विकल्प नहीं है।",
    browse: "गीता पढ़ें",
    browseTitle: "श्रीमद्भगवद्गीता",
    browseSubtitle: "दिव्य ज्ञान के 18 अध्यायों का अन्वेषण करें",
    chapters: "अध्याय",
    verses: "श्लोक",
    backToChapters: "अध्यायों पर वापस",
    askKrishna: "कृष्ण से पूछें",
    placeholder: [
      '"उठो पार्थ!"\nअपने मन की बात साझा करो।',
      '"डरो मत।"\nअपनी चिंता मुझसे साझा करो।',
    ],
    errors: {
      empty: "पहले अपने मन की बात साझा करें।",
      tooLong: "कृपया अपना संदेश 2000 अक्षरों से कम रखें।",
      network: "कनेक्शन टूट गया। अपना इंटरनेट जांचें और पुनः प्रयास करें।",
      generic: "आध्यात्मिक संपर्क बाधित हो गया। कृपया पुनः प्रयास करें।",
    },
  },
};

export function t(lang: Language): Translations {
  return translations[lang];
}

export function getPlaceholder(lang: Language): string {
  const placeholders = translations[lang].placeholder;
  return placeholders[Math.floor(Math.random() * placeholders.length)];
}
