
import { GoogleGenAI } from "@google/genai";
import { ImageSize } from "../types.ts";

// Note: Using the provided API key from process.env.API_KEY
// For gemini-3-pro-image-preview, the user selection is checked in UI

export async function generateLuckAvatar(prompt: string, size: ImageSize): Promise<string | null> {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [{ text: `Generate a high-detail luck-themed avatar or shield: ${prompt}. Artistic style: Neon Cyberpunk.` }]
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
          imageSize: size
        }
      }
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("AI Generation Error:", error);
    return null;
  }
}
