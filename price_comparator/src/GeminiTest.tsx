import { GoogleGenerativeAI, SchemaType, type Schema } from "@google/generative-ai";
import { useState } from "react";

const geminiSchema: Schema = {
    description: "list of prices for items across different stores",
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
                        quantity: { type: SchemaType.STRING },
                        price: { type: SchemaType.STRING },
                    },
                    required: ["ingredientId", "quantity", "price"],
                },
            },
        },
        required: ["name", "items"],
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
            const result = await model.generateContent("compare prices of ground beef at walmart vs wegmans");
            setResponse(result.response.text());
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
