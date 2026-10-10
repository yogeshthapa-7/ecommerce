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
  return products
    .map((p: any) => {
      const name = p.name || "Unknown";
      const price = `${p.currency || "$"}${p.price}`;
      const colors = Array.isArray(p.colors) && p.colors.length > 0
        ? p.colors
            .map((c: any) => `${c?.name || "?"} (stock: ${c?.stockQuantity ?? 0})`)
            .join(", ")
        : "no color variants";
      const sizes = Array.isArray(p.sizes) && p.sizes.length > 0
        ? p.sizes.join(", ")
        : "not listed";
      const gender = p.gender || "Unisex";
      const category = p.category || "Uncategorized";
      const totalStock = Array.isArray(p.colors)
        ? p.colors.reduce((sum: number, c: any) => sum + (c?.stockQuantity || 0), 0)
        : (p.stockQuantity || 0);
      const stockLabel =
        totalStock > 0 ? `IN STOCK (${totalStock} units)` : "OUT OF STOCK";
      return `- ${name} | ${category} | ${gender} | ${price} | ${stockLabel} | colors: ${colors} | sizes: ${sizes}`;
    })
    .join("\n");
}

function computeInventoryStats(products: unknown[]) {
  let inStockCount = 0;
  let outOfStockCount = 0;
  let inStockUnits = 0;
  const outOfStockNames: string[] = [];

  for (const p of products as any[]) {
    const totalStock = Array.isArray(p.colors)
      ? p.colors.reduce((sum: number, c: any) => sum + (c?.stockQuantity || 0), 0)
      : (p.stockQuantity || 0);
    if (totalStock > 0) {
      inStockCount += 1;
      inStockUnits += totalStock;
    } else {
      outOfStockCount += 1;
      outOfStockNames.push(p.name || "Unknown");
    }
  }

  return { inStockCount, outOfStockCount, inStockUnits, outOfStockNames };
}

const SIZE_PATTERN = /\b(\d{1,2}(?:\.\d)?)\b/;

function findProductByName(name: string, products: any[]) {
  const needle = normalizeText(name).toLowerCase();
  if (!needle) return null;
  let best: any = null;
  let bestScore = 0;
  for (const p of products) {
    const pname = normalizeText(p.name).toLowerCase();
    if (!pname) continue;
    if (pname === needle) return p;
    if (pname.includes(needle) || needle.includes(pname)) {
      const score = Math.min(pname.length, needle.length);
      if (score > bestScore) {
        bestScore = score;
        best = p;
      }
    }
  }
  return best;
}

function findColorByName(colorName: string, product: any) {
  const needle = normalizeText(colorName).toLowerCase();
  if (!needle || !Array.isArray(product.colors)) return null;
  for (const c of product.colors) {
    const cname = normalizeText(c?.name).toLowerCase();
    if (!cname) continue;
    if (cname === needle || cname.includes(needle) || needle.includes(cname)) {
      return c;
    }
  }
  return null;
}

function findSize(sizeName: string, product: any) {
  const needle = normalizeText(sizeName).toLowerCase();
  if (!needle || !Array.isArray(product.sizes)) return null;
  for (const s of product.sizes) {
    if (String(s).toLowerCase() === needle) return s;
  }
  return null;
}

interface ResolvedContext {
  product: any;
  color: any;
  size: any;
  missing: string[];
}

function resolveConversationContext(
  history: ChatMessage[],
  currentQuery: string,
  products: any[]
): ResolvedContext | null {
  const combined = [...history.map((m) => m.content), currentQuery]
    .join(" ")
    .toLowerCase();

  let product: any = null;
  for (const p of products) {
    const pname = normalizeText(p.name).toLowerCase();
    if (pname && combined.includes(pname)) {
      if (!product || pname.length > normalizeText(product.name).toLowerCase().length) {
        product = p;
      }
    }
  }
  if (!product) return null;

  let color: any = null;
  for (const c of product.colors || []) {
    const cname = normalizeText(c?.name).toLowerCase();
    if (cname && combined.includes(cname)) {
      color = c;
      break;
    }
  }

  let size: any = null;
  const sizeMatch = currentQuery.match(SIZE_PATTERN) ||
    [...history].reverse().map((m) => m.content).find((c) => SIZE_PATTERN.test(c))?.match(SIZE_PATTERN);
  if (sizeMatch) {
    size = findSize(sizeMatch[1], product);
  }

  const missing: string[] = [];
  if (!color) missing.push("color");
  if (!size) missing.push("size");

  return { product, color, size, missing };
}

function extractCartAction(responseText: string, products: unknown[]) {
  const match = responseText.match(/\[cartAction\]([\s\S]*?)\[\/cartAction\]/);
  if (!match) return null;

  let parsed: any;
  try {
    parsed = JSON.parse(match[1]);
  } catch {
    return null;
  }

  const productName = normalizeText(parsed.productName);
  const colorName = normalizeText(parsed.color);
  const size = normalizeText(parsed.size);
  const quantity = Number.isFinite(Number(parsed.quantity))
    ? Math.max(1, Math.min(10, Math.floor(Number(parsed.quantity))))
    : 1;

  if (!productName || !colorName || !size) return null;

  const product = (products as any[]).find(
    (p) =>
      normalizeText(p.name).toLowerCase() === productName.toLowerCase()
  );
  if (!product) return null;

  const color = (product.colors || []).find(
    (c: any) => normalizeText(c?.name).toLowerCase() === colorName.toLowerCase()
  );
  if (!color || (color.stockQuantity || 0) <= 0) return null;

  const validSizes = Array.isArray(product.sizes) ? product.sizes : [];
  const sizeMatch = validSizes.find(
    (s: any) => String(s).toLowerCase() === size.toLowerCase()
  );
  if (!sizeMatch) return null;

  return {
    product: {
      _id: product._id,
      name: product.name,
      price: product.price,
      currency: product.currency || "$",
      image_url: color.image_url || product.image_url,
      category: product.category,
    },
    selectedColor: { name: color.name, image_url: color.image_url },
    selectedSize: String(sizeMatch),
    quantity,
  };
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

    const stats = computeInventoryStats(products);

    const resolved = resolveConversationContext(
      safeHistory,
      safeQuery,
      products as any[]
    );

    let contextBlock = "";
    if (resolved) {
      const { product, color, size, missing } = resolved;
      const colorName = color ? color.name : null;
      const sizeValue = size ? String(size) : null;
      contextBlock = `
CONVERSATION CONTEXT (already established from earlier messages - do NOT re-ask these):
- Product being discussed: ${product.name}
${colorName ? `- Color already chosen: ${colorName}` : ""}
${sizeValue ? `- Size already chosen: ${sizeValue}` : ""}
${missing.length > 0 ? `- Still missing from the customer: ${missing.join(" and ")} - ask ONLY for these if they want to add to cart.` : "- All details (product, color, size) are known. If the customer wants to add to cart, confirm and return the cartAction."}
`;
    }

    const conversationContext = safeHistory
      .map((message) =>
        `${message.role === "assistant" ? "Assistant" : "Customer"}: ${message.content}`
      )
      .join("\n");

    const systemInstruction = `You are a helpful and enthusiastic AI assistant for a Nike E-Commerce store.
You are speaking directly to a customer. Use markdown for formatting.
Be concise but friendly. Do not invent products or prices.
${contextBlock}
CURRENT STORE INVENTORY (complete catalog, including out-of-stock items):
Categories available: ${categorySummary.join(", ") || "None loaded"}
Inventory summary: ${stats.inStockCount} products in stock (${stats.inStockUnits} total units), ${stats.outOfStockCount} products out of stock${stats.outOfStockNames.length ? ` (out of stock: ${stats.outOfStockNames.join(", ")})` : ""}
Products available:
${buildCatalogSummary(products) || "No products loaded"}

CORE DIRECTIVES:
1. Only answer shopping questions using the provided store inventory.
2. If a customer asks about a product we do not have, politely say we do not carry it and suggest related catalog items.
3. If asked about prices, give exact prices from the inventory.
4. STOCK QUESTIONS: When asked "how many products do you have in stock" or similar, answer with BOTH parts: (a) the number of products currently in stock and total units available, and (b) explicitly list the products that are OUT OF STOCK by name. Never count out-of-stock products as in stock.
5. MEMORY: The CONVERSATION CONTEXT block above is authoritative. If the customer's latest message is a follow-up like "black and size 9" or "add that one", combine it with the product/color/size already established in the context. NEVER re-ask for details that are already established in the CONVERSATION CONTEXT.
6. If a customer wants to add something to cart but product, color, or size is missing, ask ONLY for the missing details (e.g. "Which color and size would you like?").
7. If product, color, and size are all clear from the conversation context, confirm the exact item and add it to the cart by returning a cartAction (see OUTPUT FORMAT).
8. Do not answer unrelated non-shopping questions; steer back to shopping.

OUTPUT FORMAT:
- Reply with a friendly markdown answer.
- If and only if the customer's request fully specifies a product, a color, and a size (all present in the inventory above and in stock), ALSO return a JSON block at the very end of your reply in this exact format:
[cartAction]{"productName":"exact product name","color":"exact color name","size":"exact size","quantity":1}[/cartAction]
- Do not return a cartAction if any of product, color, or size is missing, ambiguous, or out of stock. In that case, ask for the missing details instead.`;

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

      const cartAction = extractCartAction(responseText, products);
      if (cartAction) {
        responseText = responseText
          .replace(/\[cartAction\][\s\S]*?\[\/cartAction\]/, "")
          .trim();
      }

      return NextResponse.json({
        answer: responseText,
        provider: "groq",
        latencyMs: 0,
        cartAction,
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
