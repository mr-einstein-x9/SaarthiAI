import { GenerativeModel, GenerateContentRequest, GenerateContentResult } from "@google/generative-ai";

/**
 * Wraps model.generateContent with retry logic for 503 errors using exponential backoff.
 */
export async function safe_generate(
  model: GenerativeModel,
  prompt: string | GenerateContentRequest
): Promise<GenerateContentResult> {
  const maxRetries = 5;
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      return await model.generateContent(prompt);
    } catch (error: any) {
      const errorMessage = error?.message?.toString() || "";
      const errorStr = error?.toString() || "";
      
      if (errorMessage.includes("503") || errorStr.includes("503")) {
        attempt++;
        if (attempt >= maxRetries) {
          throw new Error("Krishna is not available right now. Please try again shortly.");
        }
        
        // Exponential backoff: 2^attempt seconds
        const delaySeconds = Math.pow(2, attempt);
        console.warn(`[Gemini API] 503 error. Retrying in ${delaySeconds} seconds... (Attempt ${attempt}/${maxRetries})`);
        
        await new Promise(resolve => setTimeout(resolve, delaySeconds * 1000));
      } else {
        // Raise other errors normally
        throw error;
      }
    }
  }
  
  // This should be unreachable due to throw new Error above
  throw new Error("Krishna is not available right now. Please try again shortly.");
}
