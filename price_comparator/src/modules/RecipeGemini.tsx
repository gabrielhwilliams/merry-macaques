import { GoogleGenerativeAI, SchemaType, type Schema } from "@google/generative-ai";

const geminiSchema: Schema = {
    type: SchemaType.OBJECT,
    properties: {
        recipes: {
            type: SchemaType.ARRAY,
            items: {
                type: SchemaType.OBJECT,
                properties: {
                    name: { type: SchemaType.STRING },
                    description: { type: SchemaType.STRING },
                    items: {
                        type: SchemaType.ARRAY,
                        items: {
                            type: SchemaType.OBJECT,
                            properties: {
                                name: { type: SchemaType.STRING },
                                quantity: { type: SchemaType.NUMBER },
                                unit_of_measure: { type: SchemaType.STRING },
                            },
                            required: ["name", "quantity", "unit_of_measure"],
                        },
                    },
                },
                required: ["name", "quantity", "unit_of_measure"],
            },
        },
    },
}

const systemInstruction = "Please come up with 5 recipes that I can make for a cost effective meal plan. Take into account my other requirements as stipulated below.";

const generativeAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const model = generativeAI.getGenerativeModel({ 
    model: "gemini-2.5-flash", 
    systemInstruction: systemInstruction,
    generationConfig: {
        responseMimeType: "application/json",
        responseSchema: geminiSchema,
    }
});

export async function generateRecipes(userPrompt: string): Promise<any> {
    const prompt = userPrompt;
    try {
        const result = await model.generateContent(prompt);
        return JSON.parse(result.response.text()) as any;
    } catch (error) {
        console.error("Error generating content:", error);
        throw error;
    }
};
