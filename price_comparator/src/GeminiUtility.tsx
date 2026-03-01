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

const STORES = [
  "Wegmans - 650 Hylan Dr, Henrietta, NY",
  "ALDI - 615 Jefferson Rd, Henrietta, NY",
  "Walmart - 1200 Marketplace Dr, Henrietta, NY",
  "Target - 2325 Marketplace Dr, Henrietta, NY",
  "Tops - 1215 Jefferson Rd, Henrietta, NY",
  "BJ's - 400 Jay Scutti Blvd, Rochester, NY",
  "Costco - 335 Westfall Rd, Rochester, NY",
];

function buildGroceryPricePrompt(ingredients: Ingredient[], schema: string): string {
  const ingredientList = ingredients
    .map((i) => `- ${i.ingredientId}: ${i.quantity} ${i.unit_of_measure}`)
    .join("\n");

  return `
Find current, live prices for the following grocery items at these specific store locations near Henrietta, NY.

Stores:
${STORES.join("\n")}

Ingredients:
${ingredientList}

Rules:
- Match the same product tier (store-brand to store-brand where possible), form, and size across all stores.
- Always normalize to a unit price (per lb, per oz, per gallon) for fair comparison.
- For bulk retailers (BJ's, Costco), note the package size and include the normalized unit price.
- Default to conventional (non-organic) unless specified.
- If a price is unavailable or the item is not carried, set "found" to false and "price" to null.
- ALDI and Tops do not list prices online — use Instacart or Flipp as your source.
- Only use prices observed from a live web source during this session. Do not estimate.

Return valid JSON only, no prose, using this schema:
${schema}
`.trim();
}

const systemInstruction2 = `
You are a grocery price comparison assistant with access to real-time web search and browsing tools. Your job is to find accurate, current prices for grocery items across multiple stores.

## YOUR TASK

When given a list of grocery stores and ingredients, you will:
1. Search each store's website or app for each ingredient
2. Find the best comparable product match across all stores
3. Return structured pricing data in the provided JSON schema

## SEARCH STRATEGY

For each ingredient at each store, follow this approach:

**Step 1 — Search the store's website directly**
Use search queries like:
- 'site:walmart.com "whole milk" gallon price'
- 'site:kroger.com chicken breast price per lb'
- Or navigate to the store's online shopping portal (e.g., walmart.com/grocery, target.com/grocery, kroger.com, instacart.com)

**Step 2 — Use Instacart or Google Shopping as a fallback**
If a store's direct site doesn't surface clear prices, search:
- '"[store name]" "[ingredient]" price site:instacart.com'
- '"[ingredient]" "[store name]" price instock 2024'

**Step 3 — Verify recency**
Prefer prices from pages that appear current (recently indexed, showing "Add to Cart" buttons, not archived/cached pages). Discard prices that appear outdated or from a different region.

## COMPARABILITY RULES

When matching products across stores, maintain strict comparability:
- **Same unit size** — if one store sells a 32 oz container, find the 32 oz (or closest equivalent) at other stores. Always normalize to a per-unit price (e.g., price per oz, per lb, per liter) for fair comparison.
- **Same product tier** — match store-brand to store-brand OR name-brand to name-brand. If the user doesn't specify, default to **name-brand** and note the brand selected.
- **Same form** — e.g., if an ingredient is "chicken breast," match boneless skinless across all stores. Do not mix fresh vs. frozen unless noted.
- **Organic vs. conventional** — default to conventional unless the user specifies organic.

If an exact match is impossible at a store, find the **closest equivalent** and flag it in the 'notes' field.

## ACCURACY STANDARDS

- **Never fabricate or estimate prices.** Only return prices you have directly observed from a web source in this session.
- If you cannot find a live price for an item at a store, return 'null' for that price and set '"found": false'.
- Include the source URL and the exact product name as listed on the store's site so the user can verify.
- If a store doesn't carry the item or doesn't have online pricing, note that explicitly.

## OUTPUT FORMAT

Return only valid JSON matching the schema provided by the user. Do not include any explanation or prose outside the JSON block.

## IMPORTANT REMINDERS

- Always fetch prices in real time during this session. Do not rely on training data for prices, as grocery prices change frequently.
- Regional pricing may vary. If you can detect the user's region from context, use it. Otherwise, default to a major metro area and note it in the output.
- If an item is on sale, capture the **sale price** but note both the sale and regular price in 'notes'.
- Be thorough — users are relying on this data to make real purchasing decisions.
`;

const generativeAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

const model = generativeAI.getGenerativeModel({ 
        model: "gemini-3-flash-preview",
        tools: [{ googleSearchRetrieval: {} }],
        systemInstruction: systemInstruction2,
        generationConfig: {
            temperature: 0.1,
            responseMimeType: "application/json",
            responseSchema: geminiSchema,
        }
     });

export async function comparePrices(ingredients: Ingredient[]): Promise<Stores> {
        const prompt = buildGroceryPricePrompt(ingredients, JSON.stringify(geminiSchema));
        try {
            const result = await model.generateContent(prompt);
            return JSON.parse(result.response.text()) as Stores;
        } catch (error) {
            console.error("Error generating content:", error);
            throw error;
        }
    };
