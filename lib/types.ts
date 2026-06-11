// ── Core Types ─────────────────────────────────────────────────────────────

export type Language = "en" | "hi";

export interface Verse {
  id: string;
  chapter: number;
  verse: number;
  sanskrit: string;
  transliteration: string;
  meaning_en: string;
  meaning_hi: string;
  keywords_en: string[];
  keywords_hi: string[];
  theme: string;
}

export interface GuidanceData {
  verse_ref: string;
  verse: string;
  arjuna_question: string;
  krishna_answer: string;
  meaning: string;
  meaning_for_you: string;
  action: string[];
}

export interface GuidanceResponse {
  success: true;
  data: GuidanceData;
  source: "gemini" | "cache";
  latency_ms: number;
}

export interface GuidanceError {
  success: false;
  error: string;
  retry_after_seconds?: number;
}

export type ApiResponse = GuidanceResponse | GuidanceError;

export interface AskRequest {
  query: string;
  language: Language;
}

// ── Chapter metadata for browse ────────────────────────────────────────────

export interface ChapterInfo {
  number: number;
  name_en: string;
  name_hi: string;
  name_sanskrit: string;
  description_en: string;
  description_hi: string;
  verse_count: number;
}

export const CHAPTERS: ChapterInfo[] = [
  { number: 1, name_en: "Arjuna's Dilemma", name_hi: "अर्जुन विषाद योग", name_sanskrit: "अर्जुनविषादयोग", description_en: "Arjuna's grief and moral crisis on the battlefield", description_hi: "युद्धभूमि पर अर्जुन का शोक और नैतिक संकट", verse_count: 47 },
  { number: 2, name_en: "Transcendental Knowledge", name_hi: "सांख्य योग", name_sanskrit: "सांख्ययोग", description_en: "The nature of the soul, duty, and equanimity", description_hi: "आत्मा, कर्तव्य और समता का स्वरूप", verse_count: 72 },
  { number: 3, name_en: "Path of Action", name_hi: "कर्म योग", name_sanskrit: "कर्मयोग", description_en: "The importance of selfless action and duty", description_hi: "निस्वार्थ कर्म और कर्तव्य का महत्व", verse_count: 43 },
  { number: 4, name_en: "Path of Knowledge", name_hi: "ज्ञान कर्म सन्यास योग", name_sanskrit: "ज्ञानकर्मसन्न्यासयोग", description_en: "Divine knowledge and the nature of action", description_hi: "दिव्य ज्ञान और कर्म का स्वरूप", verse_count: 42 },
  { number: 5, name_en: "Path of Renunciation", name_hi: "कर्म सन्यास योग", name_sanskrit: "कर्मसन्न्यासयोग", description_en: "Renunciation through wisdom and action", description_hi: "ज्ञान और कर्म द्वारा संन्यास", verse_count: 29 },
  { number: 6, name_en: "Path of Meditation", name_hi: "ध्यान योग", name_sanskrit: "ध्यानयोग", description_en: "Self-mastery through discipline and meditation", description_hi: "अनुशासन और ध्यान द्वारा आत्म-नियंत्रण", verse_count: 47 },
  { number: 7, name_en: "Knowledge & Wisdom", name_hi: "ज्ञान विज्ञान योग", name_sanskrit: "ज्ञानविज्ञानयोग", description_en: "Knowledge of the Absolute and the material world", description_hi: "परम सत्य और भौतिक जगत का ज्ञान", verse_count: 30 },
  { number: 8, name_en: "Path to the Supreme", name_hi: "अक्षर ब्रह्म योग", name_sanskrit: "अक्षरब्रह्मयोग", description_en: "Attaining the eternal through devotion", description_hi: "भक्ति द्वारा शाश्वत की प्राप्ति", verse_count: 28 },
  { number: 9, name_en: "Royal Knowledge", name_hi: "राज विद्या राज गुह्य योग", name_sanskrit: "राजविद्याराजगुह्ययोग", description_en: "The most confidential knowledge of devotion", description_hi: "भक्ति का सबसे गोपनीय ज्ञान", verse_count: 34 },
  { number: 10, name_en: "Divine Manifestations", name_hi: "विभूति योग", name_sanskrit: "विभूतियोग", description_en: "God's infinite divine manifestations", description_hi: "भगवान की अनंत दिव्य विभूतियाँ", verse_count: 42 },
  { number: 11, name_en: "Universal Form", name_hi: "विश्वरूप दर्शन योग", name_sanskrit: "विश्वरूपदर्शनयोग", description_en: "Arjuna witnesses the cosmic universal form", description_hi: "अर्जुन विराट विश्वरूप का दर्शन करते हैं", verse_count: 55 },
  { number: 12, name_en: "Path of Devotion", name_hi: "भक्ति योग", name_sanskrit: "भक्तियोग", description_en: "The supreme path of loving devotion", description_hi: "प्रेमपूर्ण भक्ति का सर्वोच्च मार्ग", verse_count: 20 },
  { number: 13, name_en: "Nature & the Enjoyer", name_hi: "क्षेत्र क्षेत्रज्ञ विभाग योग", name_sanskrit: "क्षेत्रक्षेत्रज्ञविभागयोग", description_en: "The field of the body and the knower of the field", description_hi: "शरीर रूपी क्षेत्र और क्षेत्रज्ञ", verse_count: 35 },
  { number: 14, name_en: "Three Qualities of Nature", name_hi: "गुणत्रय विभाग योग", name_sanskrit: "गुणत्रयविभागयोग", description_en: "Sattva, Rajas, and Tamas — the three gunas", description_hi: "सत्व, रजस और तमस — तीन गुण", verse_count: 27 },
  { number: 15, name_en: "The Supreme Person", name_hi: "पुरुषोत्तम योग", name_sanskrit: "पुरुषोत्तमयोग", description_en: "The eternal tree and the Supreme Being", description_hi: "शाश्वत वृक्ष और परम पुरुष", verse_count: 20 },
  { number: 16, name_en: "Divine & Demonic Natures", name_hi: "दैवासुर सम्पद विभाग योग", name_sanskrit: "दैवासुरसम्पद्विभागयोग", description_en: "Distinguishing divine from demonic qualities", description_hi: "दैवी और आसुरी गुणों का विभाजन", verse_count: 24 },
  { number: 17, name_en: "Three Divisions of Faith", name_hi: "श्रद्धात्रय विभाग योग", name_sanskrit: "श्रद्धात्रयविभागयोग", description_en: "Faith, food, sacrifice, and austerity in three modes", description_hi: "तीन प्रकार की श्रद्धा, भोजन, यज्ञ और तप", verse_count: 28 },
  { number: 18, name_en: "Liberation Through Renunciation", name_hi: "मोक्ष सन्यास योग", name_sanskrit: "मोक्षसन्न्यासयोग", description_en: "Final teachings — surrender and liberation", description_hi: "अंतिम उपदेश — समर्पण और मुक्ति", verse_count: 78 },
];
