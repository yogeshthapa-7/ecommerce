// app/api/assistant/route.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();

    // Initialize OpenAI - API key should be in .env.local as OPENAI_API_KEY
    // Get your free key at: https://platform.openai.com/api-keys
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ answer: "⚠️ API Key missing. Please configure OPENAI_API_KEY in .env.local" }, { status: 500 });
    }

    const openai = new OpenAI({ apiKey });

    // Get the base URL for fetching data
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

    // Fetch live store context
    let products = [];
    let categories = [];
    try {
      const [prodRes, catRes] = await Promise.all([
        fetch(`${baseUrl}/products`, { cache: 'no-store' }),
        fetch(`${baseUrl}/categories`, { cache: 'no-store' })
      ]);
      products = await prodRes.json();
      categories = await catRes.json();
    } catch (err) {
      console.error("Failed to fetch store context:", err);
    }

    // Prepare a concise summary of the catalog
    const catalogSummary = products.map((p: any) => ({
      name: p.name,
      price: `${p.price}`,
      category: p.category,
      gender: p.gender,
      stock: p.in_stock ? 'In Stock' : 'Out of Stock',
      colors: p.colors?.map((c: any) => c.name).join(', '),
      sizes: p.sizes || []
    }));

    const categorySummary = categories.map((c: any) => c.name);

    // Build the system prompt
    const systemInstruction = `You are a helpful and enthusiastic AI assistant for a Nike E-Commerce store. 
You are speaking directly to a customer. Use markdown for formatting (bolding, lists, etc).
Be concise but friendly. Do not invent products or prices. 

CURRENT STORE INVENTORY:
Categories available: ${categorySummary.join(", ")}
Products available:
${JSON.stringify(catalogSummary, null, 2)}

CORE DIRECTIVES:
1. Only answer questions based on the provided store inventory.
2. If a customer asks about a product we don't have, politely inform them we don't carry it but suggest related items from our catalog.
3. If asked about prices, give the exact price from the provided data.
4. If asked about stock/colors/sizes/genders, refer to the provided data. When customers ask about specific sizes (like US Men's size 9), check the sizes array for that product.
5. Do not answer non-shopping/non-Nike related queries. If asked about politics, coding, etc., steer them back to shopping.
6. For out-of-stock items, mention they are currently unavailable.
7. When a customer asks about a specific size for a product, confirm availability if that size exists in the product's sizes array.`;

    const response = await openai.responses.create({
      model: "gpt-5-nano",
      input: systemInstruction + "\n\nUser Question: " + query,
      store: true,
    });

    const responseText = response.output_text || "⚠️ Unable to get a response. Please try again.";

    return NextResponse.json({ answer: responseText });

  } catch (error: any) {
    console.error("Assistant API Error:", error);

    // Handle specific error types
    if (error.code === 'insufficient_quota') {
      return NextResponse.json(
        { answer: "⚠️ API quota exceeded. Please check your OpenAI account at https://platform.openai.com/account/limits" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { answer: "⚠️ Experiencing technical difficulties connecting to the AI brain. Please try again later." },
      { status: 500 }
    );
  }
}
