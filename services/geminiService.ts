
import { GoogleGenAI, Modality, Part } from "@google/genai";

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateImage = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: '16:9',
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const image = response.generatedImages[0];
      if (image.image && image.image.imageBytes) {
        return image.image.imageBytes;
      }
    }
    throw new Error('No image was generated.');
  } catch (error) {
    console.error('Error generating image with Gemini:', error);
    throw new Error('Failed to generate image from API.');
  }
};


export const editImage = async (prompt: string, imagePart: Part): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          imagePart,
          { text: prompt },
        ],
      },
      config: {
          responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });
    
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData && part.inlineData.data) {
        return part.inlineData.data;
      }
    }
    
    throw new Error('No image was returned from the edit operation.');

  } catch (error) {
    console.error('Error editing image with Gemini:', error);
    throw new Error('Failed to edit image from API.');
  }
};
