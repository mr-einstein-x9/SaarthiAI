<div align="center">
  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Om_symbol.svg/100px-Om_symbol.svg.png" width="80" alt="Om Symbol" />
  <h1>SaarathiAI (सारथी) 🦚</h1>
  <p><em>Wisdom from the Bhagavad Gita, for your life today.</em></p>

[//]: # (Add badges here as appropriate, e.g., Next.js, MIT License, etc.)

</div>

---

**SaarathiAI** is a comprehensive, modern Next.js 14 web application designed to act as your spiritual charioteer. By matching your real-life problems and emotional states to the timeless verses of the Bhagavad Gita, it generates deeply customized, compassionate, and actionable guidance powered by the **Google Gemini 2.5 Flash** model.

## ✨ Key Features

- **🧠 Deep Personalization via Gemini 2.5 Flash**: Processes user difficulties (fear, anger, career blocks, overthinking) and leverages the Gemini API to draw out practical wisdom anchored strictly to relevant Shlokas.
- **🛡️ Strict AI Grounding**: System prompts constrain the AI to specific verses, ensuring philosophically accurate, non-generic advice that avoids hallucinating non-Gita teachings.
- **🌐 Seamless Bilingual Experience**: Full support for both **English** and **Hindi**. Context-aware generation translates meanings, explanations, and advice into the user's preferred language, while safely maintaining the authenticity of original Sanskrit verses (Devanagari/Transliteration).
- **🛡️ Bulletproof API Resilience**: Enforces strict `application/json` output schemas, auto-retries on empty responses, and incorporates graceful fallbacks to localized deterministic UI structures if requests fail.
- **🎨 Glassmorphic & Spiritual UI**: A beautiful, fluid interface built with TailwindCSS, featuring smooth CSS micro-animations, copy-to-clipboard functionality, and intuitive text expanding.
- **📊 Local Keyword Engine**: Built-in Shloka selection mechanism dynamically pulls from a local structured JSON pool utilizing context matching based on underlying human emotions before handing the query to the LLM. 

## 🛠️ Technology Stack

- **Frontend**: [Next.js 14](https://nextjs.org/) (App Router), React 18
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **AI/LLM**: [Google Generative AI SDK (`gemini-2.5-flash`)](https://ai.google.dev/)
- **Language**: TypeScript

---

## 🚀 Getting Started (Local Development)

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) (v18 or higher) and `npm` installed. You will also need a free [Gemini API Key](https://aistudio.google.com/app/apikey) from Google AI Studio.

### 1. Clone the repository
```bash
git clone https://github.com/mr-einstein-x9/SaarthiAI.git
cd SaarthiAI
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure the Environment
Create a `.env.local` file at the root of the directory and securely add your Gemini API Key:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to start seeking guidance!

---

## ☁️ Deployment Instructions (Vercel)

Deploying SaarathiAI to production is simple using Vercel:

1. Push your latest code to your GitHub repository.
2. Go to your [Vercel Dashboard](https://vercel.com/) -> **Add New Project** -> **Import GitHub repo**.
3. In the project configuration step, open the **Environment Variables** panel and add:
   - **Key**: `GEMINI_API_KEY` 
   - **Value**: *your_gemini_api_key*
4. Click **Deploy**. Vercel will handle the rest!

---

## 🧩 How It Works

1. **Input Phase**: The user types out their specific struggle in plain language (e.g., *"I'm terrified of failing my upcoming exams"*).
2. **Retrieve Phase**: A local shloka matching utility cross-references the problem against categorized themes (Anxiety, Anger, Doubt, Overthinking) to find the most relevant verse.
3. **Generate Phase**: The selected verse and the user's problem are securely funneled to the **Gemini 2.5 Flash** API via the Next.js API Routes.
4. **Parse Phase**: The AI replies with structurally validated, personalized JSON describing *why* the verse applies out of context, complete with *practical next steps* and *daily practices*.
5. **Display Phase**: The frontend cleanly renders the Sanskrit, English/Hindi translations, actionable guidance, and deep wisdom. 

## ⚖️ Disclaimer
*SaarathiAI provides spiritual and psychological guidance historically anchored in the Bhagavad Gita. It is an exploration project for applying AI responsibly to philosophical texts and is **not** a substitute for professional mental healthcare, therapy, or medical advice.*

---
<div align="center">
  <p><i>Built with dedication. Rooted in the Gita.</i></p>
</div>
