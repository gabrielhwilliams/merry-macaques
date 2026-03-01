import { GoogleGenerativeAI, SchemaType, type Schema, type Tool } from "@google/generative-ai";
import type { Ingredient } from "./schemas/ingredients.type";
import type { Stores } from "./schemas/stores.type";

const geminiSchema: Schema = {
    description: "list of prices for items across different stores",
    type: SchemaType.OBJECT,
    properties: {
        stores: {
            type: SchemaType.ARRAY,
            items: {
                type: SchemaType.OBJECT,
                properties: {
                    name: { type: SchemaType.STRING },
                    items: {
                        type: SchemaType.ARRAY,
                        items: {
                            type: SchemaType.OBJECT,
                            properties: {
                                ingredientId: { type: SchemaType.STRING, description: "the name of the ingredient being compared" },
                                unit_of_measure: { type: SchemaType.STRING },
                                quantity: { type: SchemaType.NUMBER },
                                price: { type: SchemaType.NUMBER },
                            },
                            required: ["ingredientId", "quantity", "price"],
                        },
                    },
                },
                required: ["name", "items"],
            },
        },
    },
}

const systemInstruction2 = "you are a Real-Time Grocery Price Comparison Agent. Your goal is to take a list of ingredients and find the current, live prices at the nearest physical grocery stores (e.g., Walmart, Kroger, Target, Safeway). CONSTRAINTS: 1. Always use the Google Search Tool to find 'live prices' for the specific year and month. 2. Specify a location (City, State or Zip) in your search queries to get local results. 3. Compare at least three different retailers for each item. 4. If a specific brand is not mentioned, find the cheapest 'store brand' option. 5. Calculate the total 'Basket Price' for each store. 6. Output the data in a clean Markdown table with columns: [Ingredient], [Store A Price], [Store B Price], [Store C Price]. 7. Make sure to pull the live, localized, up to date values 8. Try to use standard pack size. Use the provided schema to return the data in a structured JSON format";

const generativeAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

const model = generativeAI.getGenerativeModel({ 
        model: "gemini-3-flash-preview",
        tools: [{ googleSearch: {} }],
        systemInstruction: systemInstruction2,
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: geminiSchema,
        }
     });

export async function comparePrices(ingredients: Ingredient[]): Promise<Stores> {
        const prompt = `Use the stores of wegmans, walmart, and aldis to compare at 14623 henrietta the prices of the following items across different stores: ${JSON.stringify(ingredients)}`;
        try {
            const result = await model.generateContent(prompt);
            return JSON.parse(result.response.text()) as Stores;
        } catch (error) {
            console.error("Error generating content:", error);
            throw error;
        }
    };
