// app/api/assistant/route.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

type ChatRole = "user" | "assistant";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

function getAuthToken(req: NextRequest): string | null {
  const fromCookie = req.cookies.get("token")?.value || null;
  if (fromCookie) return fromCookie;
  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7).trim();
  }
  return null;
}

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 10;

function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  if (!record || now > record.resetAt) {
    rateLimitMap.set(identifier, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }

  record.count += 1;
  return true;
}

const toArray = (value: unknown): unknown[] => {
  if (Array.isArray(value)) return value;
  if (Array.isArray((value as any)?.products)) return (value as any).products;
  if (Array.isArray((value as any)?.data)) return (value as any).data;
  if (Array.isArray((value as any)?.categories)) return (value as any).categories;
  return [];
};

const normalizeText = (value: unknown): string =>
  String(value ?? "").trim();

function buildCatalogSummary(products: unknown[]): string {
  const inStock = products.filter((p: any) => p.in_stock !== false);
  return inStock
    .map((p: any) => {
      const name = p.name || "Unknown";
      const price = `${p.currency || "$"}${p.price}`;
      const stock = p.in_stock === false ? "Out of Stock" : "In Stock";
      const colors = Array.isArray(p.colors)
        ? p.colors.map((c: any) => c?.name).filter(Boolean).join(", ")
        : "not listed";
      const sizes = Array.isArray(p.sizes) ? p.sizes.join(", ") : "not listed";
      return `- ${name} | ${price} | ${stock} | colors: ${colors} | sizes: ${sizes}`;
    })
    .join("\n");
}

export async function POST(req: NextRequest) {
  try {
    const token = getAuthToken(req);
    if (!token) {
      return NextResponse.json(
        { answer: "Authentication required. Please log in to use the assistant." },
        { status: 401 }
      );
    }

    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";

    if (!checkRateLimit(clientIp)) {
      return NextResponse.json(
        { answer: "Too many requests. Please slow down and try again shortly." },
        { status: 429 }
      );
    }

    const { query, history = [] } = await req.json();
    const safeQuery = normalizeText(query);
    const safeHistory: ChatMessage[] = Array.isArray(history)
      ? (history as ChatMessage[])
          .filter((message) => message?.role && normalizeText(message?.content))
          .slice(-10)
          .map((message) => ({
            role: message.role as ChatRole,
            content: normalizeText(message.content),
          }))
      : [];

    if (!safeQuery) {
      return NextResponse.json(
        { answer: "Please send a message to get started." },
        { status: 400 }
      );
    }

    const groqKey = process.env.GROQ_API_KEY;
    if (!groqKey) {
      return NextResponse.json(
        { answer: "AI service is not configured. Please set GROQ_API_KEY." },
        { status: 500 }
      );
    }

    const openai = new OpenAI({
      apiKey: groqKey,
      baseURL: "https://api.groq.com/openai/v1",
    });
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

    let products: unknown[] = [];
    let categories: unknown[] = [];

    try {
      const [prodRes, catRes] = await Promise.all([
        fetch(`${baseUrl}/products?includeOutOfStock=true&limit=100`, {
          cache: "no-store",
        }),
        fetch(`${baseUrl}/categories`, { cache: "no-store" }),
      ]);

      const [productData, categoryData] = await Promise.all([
        prodRes.json(),
        catRes.json(),
      ]);

      products = toArray(productData);
      categories = toArray(categoryData);
    } catch (err) {
      console.error("Failed to fetch store context:", err);
    }

    const categorySummary = (categories as any[])
      .map((c: any) => c?.name)
      .filter(Boolean);

    const conversationContext = safeHistory
      .map((message) =>
        `${message.role === "assistant" ? "Assistant" : "Customer"}: ${message.content}`
      )
      .join("\n");

    const systemInstruction = `You are a helpful and enthusiastic AI assistant for a Nike E-Commerce store.
You are speaking directly to a customer. Use markdown for formatting.
Be concise but friendly. Do not invent products or prices.

CURRENT STORE INVENTORY:
Categories available: ${categorySummary.join(", ") || "None loaded"}
Products available (IN STOCK ONLY):
${buildCatalogSummary(products) || "No products loaded"}

CORE DIRECTIVES:
1. Only answer shopping questions using the provided store inventory.
2. If a customer asks about a product we do not have, politely say we do not carry it and suggest related catalog items.
3. If asked about prices, give exact prices from the inventory.
4. If asked about stock, colors, sizes, genders, or categories, use the inventory fields. Count ONLY items marked "In Stock" when answering stock/count questions.
5. Use the conversation history. If the latest message is a follow-up like "black and size 9", connect it to the earlier product/cart request.
6. If a customer wants to add something to cart but product, color, or size is missing, ask only for the missing details.
7. If product, color, and size are all clear, confirm the exact item and tell them you can add it to the cart from this chat.
8. Do not answer unrelated non-shopping questions; steer back to shopping.`;

    try {
      const callGroq = async () => {
        const response = await openai.chat.completions.create({
          model: "openai/gpt-oss-20b",
          messages: [
            { role: "system", content: systemInstruction },
            ...safeHistory.map((msg) => ({
              role: msg.role,
              content: msg.content,
            })),
            { role: "user", content: safeQuery },
          ],
        temperature: 0.7,
        max_tokens: 512,
        });

        console.log("Groq raw response:", JSON.stringify({
          finishReason: response.choices[0]?.finish_reason,
          content: response.choices[0]?.message?.content,
          usage: response.usage,
        }, null, 2));
        return response;
      };

      let response = await callGroq();
      let responseText = response.choices[0]?.message?.content;

      if (!responseText || !responseText.trim()) {
        console.warn("Groq returned empty content, retrying once...");
        response = await callGroq();
        responseText = response.choices[0]?.message?.content;
      }

      responseText =
        responseText || "Unable to get a response. Please try again.";

      return NextResponse.json({
        answer: responseText,
        provider: "groq",
        latencyMs: 0,
      });
    } catch (error: any) {
      console.error("Assistant Groq Error:", error);
      return NextResponse.json(
        {
          answer:
            "Experiencing technical difficulties connecting to the AI assistant. Please try again later.",
          provider: "groq",
          fallback: true,
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Assistant API Error:", error);

    return NextResponse.json(
      {
        answer:
          "Experiencing technical difficulties connecting to the AI assistant. Please try again later.",
        provider: "groq",
      },
      { status: 500 }
    );
  }
}
