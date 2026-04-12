# SaarathiAI (सारथी)

Wisdom from the Bhagavad Gita, for your life today. 
This is a comprehensive Next.js 14 web application that maps user-provided life problems to relevant Bhagavad Gita shlokas and generates customized, context-aware guidance using Google's Gemini 2.5 Flash model.

## Features
- **Local DB with Retrieve-and-Rank**: Uses advanced synonym matching, stopword removal, and emotion-weighted keyword scoring.
- **Strict Grounding**: System prompts limit Gemini strictly to the shloka in context, ensuring accurate philosophical anchoring without wandering.
- **Bilingual**: Seamless toggle between Hindi and English across the entire UI and AI Generation.
- **Resilient AI**: Enforces JSON schema constraint, auto-retries on bad schema, and falls back to a clean deterministic UI layout if the API fails entirely.

## Project Setup Local

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment:
   Create a `.env.local` file at the root:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000)

## Deployment Instructions (Vercel)

1. Initialize Git and commit your files:
   ```bash
   git init
   git add .
   git commit -m "Initial SaarathiAI build"
   ```

2. Push to your GitHub repository.

3. Go to [vercel.com](https://vercel.com/) -> **Add New Project** -> **Import GitHub repo**.

4. In the configuration before deployment, go to **Environment Variables** and add:
   - Key: `GEMINI_API_KEY` 
   - Value: `your_gemini_api_key`

5. Click **Deploy**.
