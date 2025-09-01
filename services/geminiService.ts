import { GoogleGenAI, Modality } from "@google/genai";

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateAdImage(
  images: Array<{ base64: string, mimeType: string }>,
  prompt: string,
  productDescription: string,
  isHighRes: boolean
): Promise<{ imageUrl: string; text: string | null; }> {
  try {
    let textPrompt: string;
    
    const imageCountText = images.length > 1 ? 'images of their products' : 'an image of their product';

    if (productDescription.trim()) {
        textPrompt = `A user has provided ${imageCountText}, described as "${productDescription}". Your task is to take the product(s) from the image(s) and realistically place them into the following scene: "${prompt}". Ensure the product(s) are seamlessly integrated, matching the lighting, perspective, and style of the environment. Do not add any text overlays unless specified in the scene prompt. If multiple products are provided, arrange them naturally within the scene.`;
    } else {
        textPrompt = `Please realistically place the product(s) from the following image(s) into this scene: "${prompt}". Ensure the product(s) are seamlessly integrated, matching the lighting, perspective, and style of the environment. Do not add any text overlays unless specified in the prompt. If multiple products are provided, arrange them naturally within the scene.`;
    }

    if (isHighRes) {
      textPrompt += " Generate the final image in high-resolution, 4K, with photorealistic detail.";
    }

    const imageParts = images.map(image => ({
        inlineData: {
            data: image.base64,
            mimeType: image.mimeType,
        },
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: {
        parts: [...imageParts, { text: textPrompt }],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    let imageUrl: string | null = null;
    let text: string | null = null;

    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && !imageUrl) {
          const imageMimeType = part.inlineData.mimeType;
          const imageBase64 = part.inlineData.data;
          imageUrl = `data:${imageMimeType};base64,${imageBase64}`;
        } else if (part.text) {
          text = part.text;
        }
      }
    }

    if (!imageUrl) {
      throw new Error("API 未返回图片。可能因安全政策而被阻止。");
    }

    return { imageUrl, text };
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("生成广告图片失败。请尝试不同的图片或提示。");
  }
}