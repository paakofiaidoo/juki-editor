import { GoogleGenAI, Type } from "@google/genai";
import type {Theme} from '@/types';

class GeminiService {
  private ai: GoogleGenAI | null = null;

  constructor() {
    const apiKey = process.env.API_KEY;
    if (apiKey) {
      this.ai = new GoogleGenAI({ apiKey });
    } else {
        console.warn("API_KEY environment variable not found. AI features will be disabled.");
    }
  }

  isConfigured(): boolean {
      return !!this.ai;
  }

  async generateText(prompt: string, systemInstruction?: string): Promise<string> {
    if (!this.ai) return "API Key not configured.";
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { systemInstruction }
      });
      return response.text;
    } catch (error) {
      console.error("Gemini text generation error:", error);
      return `Error: ${(error as Error).message}`;
    }
  }

  async generateImage(prompt: string): Promise<string> {
    if (!this.ai) return "API Key not configured.";
    try {
        const response = await this.ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
              numberOfImages: 1,
              outputMimeType: 'image/png',
              aspectRatio: '1:1',
            },
        });
        const base64ImageBytes = response.generatedImages[0].image.imageBytes;
        return `data:image/png;base64,${base64ImageBytes}`;
    } catch (error) {
        console.error("Gemini image generation error:", error);
        return `Error: ${(error as Error).message}`;
    }
  }
  
  async generateTheme(projectName: string, projectDescription: string): Promise<Theme> {
    if (!this.ai) throw new Error("API Key not configured.");
    
    const prompt = `
      Generate a color palette and font pairing for a website project with the following details:
      - Name: "${projectName}"
      - Description: "${projectDescription}"

      Provide a theme that is visually appealing and appropriate for the project's subject matter.
      The response must be a JSON object with the exact structure specified in the schema.
      - Colors should be in hex format (e.g., "#RRGGBB").
      - Fonts should be common Google Fonts or standard web-safe font stacks (e.g., "Inter, sans-serif").
    `;
    
    const themeSchema = {
      type: Type.OBJECT,
      properties: {
        colors: {
          type: Type.OBJECT,
          properties: {
            primary: { type: Type.STRING, description: "The primary action color (buttons, links)." },
            secondary: { type: Type.STRING, description: "A secondary color for backgrounds or sections." },
            accent: { type: Type.STRING, description: "An accent color for highlights or special elements." },
            text: { type: Type.STRING, description: "The main text color." },
            background: { type: Type.STRING, description: "The main background color of the page." },
          },
          required: ['primary', 'secondary', 'accent', 'text', 'background'],
        },
        fonts: {
          type: Type.OBJECT,
          properties: {
            body: { type: Type.STRING, description: "The font stack for body text." },
            heading: { type: Type.STRING, description: "The font stack for headings." },
          },
          required: ['body', 'heading'],
        },
      },
      required: ['colors', 'fonts'],
    };

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: themeSchema,
        },
      });

      return JSON.parse(response.text) as Theme;
    } catch (error) {
      console.error("Gemini theme generation error:", error);
      throw new Error(`AI failed to generate theme: ${(error as Error).message}`);
    }
  }

  private getCanvasItemSchema(): any {
    // Define the base schema for a canvas item, but without the recursive 'content' property.
    // This object is non-circular and can be safely referenced to describe nested items.
    const baseCanvasItemSchema = {
        type: Type.OBJECT,
        properties: {
            id: { type: Type.STRING, description: 'A unique identifier for the element.' },
            name: { type: Type.STRING, description: 'A descriptive name for the element (e.g., "Hero Title").' },
            type: { type: Type.STRING, enum: ['ELEMENT'], description: 'The type of the item, must be "ELEMENT".' },
            tag: { type: Type.STRING, description: 'The HTML tag name (e.g., "div", "h1", "p").' },
            props: {
                type: Type.OBJECT,
                description: 'HTML attributes, especially `className` for styling.',
                properties: {
                    className: { type: Type.STRING, nullable: true }
                }
            },
        },
        required: ['id', 'name', 'type', 'tag', 'props'],
    };

    // Create the final schema by cloning the base properties and adding the recursive 'content' property.
    const finalCanvasItemSchema = {
      type: Type.OBJECT,
      properties: {
        ...baseCanvasItemSchema.properties,
        content: {
          oneOf: [
            { type: Type.STRING, description: 'Text content for the element.' },
            {
              type: Type.ARRAY,
              description: 'An array of nested child elements.',
              // To prevent a "circular structure" error during JSON serialization, we reference
              // the non-recursive base schema here. This satisfies the API's validation
              // while avoiding a client-side crash.
              items: baseCanvasItemSchema,
            },
          ],
          nullable: true,
        },
      },
      required: baseCanvasItemSchema.required,
    };

    // The final schema for the API call is an array of these items.
    return {
      type: Type.ARRAY,
      description: "The root array of canvas items.",
      items: finalCanvasItemSchema,
    };
  }
}

export const geminiService = new GeminiService();