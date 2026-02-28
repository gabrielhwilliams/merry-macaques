import { GoogleGenerativeAI, SchemaType, type Schema } from "@google/generative-ai";
import { useState } from "react";
import { comparePrices } from "./GeminiUtility";

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

const generativeAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const model = generativeAI.getGenerativeModel({ 
        model: "gemini-2.5-flash", 
        systemInstruction: 
            "You are a helpful assistant that compares prices of items across different stores and provides the information in a structured JSON format according to the provided schema.",
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: geminiSchema,
        }
     });
console.log("key", import.meta.env.VITE_GEMINI_API_KEY);
export function GeminiComponent() {
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(false);

    const handleGenerate = async () => {
        setLoading(true);
        try {
            const result = await comparePrices([
                {
                    ingredientId: "Ground Beef",
                    quantity: 1,
                    unit_of_measure: "pound",
                    price: null,
                }
            ]);
            setResponse(JSON.stringify(result, null, 2));
        } catch (error) {
            console.error("Error generating content:", error);
            setResponse("Failed to generate content.");
        } finally {
            setLoading(false);
        }    
    };

    return (
        <div>
            <button onClick={handleGenerate} disabled={loading}>
                {loading ? "Generating..." : "Generate Price Comparison"}
            </button>
            <p>{response}</p>
        </div>
    );
}
