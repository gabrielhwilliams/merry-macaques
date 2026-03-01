import { GoogleGenerativeAI, SchemaType, type Schema } from "@google/generative-ai";
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
                                ingredientId: { type: SchemaType.STRING },
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

const systemInstruction = 
    "You are a helpful assistant that compares prices of items across different stores and provides the information in a structured JSON format according to the provided schema. The input will be a list of ingredients with their quantities and units of measure, and you should return a list of stores with the prices for each ingredient. Make sure that the items you are commparing are the same across stores, and if you cannot find a price for an item at a store, include it with a price of null rather than omitting it from the store's list of items. Be as specific as possible in your comparisons and name them specifically, and ensure that the JSON you return strictly adheres to the schema provided. Always include all ingredients for each store, even if the price is not available. Make sure the unit of measurement is consistent across stores for the same ingredient. For the stores of walmart wegmans and aldis. Make sure your numbers are correct and that you are using the same package size and that you are using the generic serving size";

const generativeAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const model = generativeAI.getGenerativeModel({ 
        model: "gemini-2.5-pro", 
        systemInstruction: systemInstruction,
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: geminiSchema,
        }
     });

export async function comparePrices(ingredients: Ingredient[]): Promise<Stores> {
        const prompt = `Compare prices of the following items across different stores: ${JSON.stringify(ingredients)}`;
        try {
            const result = await model.generateContent(prompt);
            return JSON.parse(result.response.text()) as Stores;
        } catch (error) {
            console.error("Error generating content:", error);
            throw error;
        }
    };
