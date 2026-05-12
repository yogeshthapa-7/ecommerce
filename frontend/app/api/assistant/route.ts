// app/api/assistant/route.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

type ChatMessage = {
  role: "user" | "assistant";
  text: string;
};

const toArray = (value: any) => {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.products)) return value.products;
  if (Array.isArray(value?.data)) return value.data;
  if (Array.isArray(value?.categories)) return value.categories;
  return [];
};

const normalizeText = (value: any) => String(value ?? "").trim();

const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const containsValue = (text: string, value: string) => {
  const normalized = normalizeText(value).toLowerCase();
  if (!normalized) return false;

  return new RegExp(`(^|[^a-z0-9])${escapeRegExp(normalized)}([^a-z0-9]|$)`, "i").test(text);
};

const productName = (product: any) => normalizeText(product?.name || "Nike Product");

const productHasMen = (product: any) => {
  const text = `${product?.gender || ""} ${product?.category || ""}`.toLowerCase();
  return /\bmen'?s?\b/.test(text) && !/\bwomen'?s?\b/.test(text);
};

const productHasWomen = (product: any) => {
  const text = `${product?.gender || ""} ${product?.category || ""}`.toLowerCase();
  return /\bwomen'?s?\b/.test(text);
};

const productHasKids = (product: any) => {
  const text = `${product?.gender || ""} ${product?.category || ""}`.toLowerCase();
  return /\bkids?\b|\bchildren\b/.test(text);
};

const categoryAliases: Record<string, string[]> = {
  shoes: ["shoe", "shoes", "sneaker", "sneakers", "footwear"],
  bags: ["bag", "bags", "backpack", "backpacks"],
  hoodies: ["hoodie", "hoodies"],
  accessories: ["accessory", "accessories"],
};

const getCategoryKey = (product: any) => normalizeText(product?.category).toLowerCase();

const latestMatchesCategory = (text: string) => {
  const normalizedText = normalizeText(text).toLowerCase();

  for (const [category, aliases] of Object.entries(categoryAliases)) {
    if (aliases.some((alias) => containsValue(normalizedText, alias))) {
      return category;
    }
  }

  return "";
};

const productMatchesCategory = (product: any, category: string) => {
  const productCategory = getCategoryKey(product);
  if (!category) return true;

  return productCategory === category;
};

const getColors = (product: any) =>
  Array.isArray(product?.colors)
    ? product.colors.map((color: any) => normalizeText(color?.name)).filter(Boolean)
    : [];

const getSizes = (product: any) =>
  Array.isArray(product?.sizes)
    ? product.sizes.map((size: any) => normalizeText(size)).filter(Boolean)
    : [];

const formatProductDetails = (products: any[]) =>
  products
    .slice(0, 12)
    .map((product) => {
      const colors = getColors(product);
      const sizes = getSizes(product);

      return `- **${productName(product)}**: colors: ${colors.length ? colors.join(", ") : "not listed"}; sizes: ${sizes.length ? sizes.join(", ") : "not listed"}`;
    })
    .join("\n");

const buildFallbackAnswer = (
  query: string,
  history: ChatMessage[],
  products: any[],
) => {
  const answer = (text: string, cartAction?: any) => ({ answer: text, cartAction });
  const latest = query.toLowerCase();
  const previousConversation = history.map((m) => m.text).join(" ").toLowerCase();
  const conversation = `${previousConversation} ${query}`.toLowerCase();
  const availableProducts = products.filter((product) => product?.in_stock !== false);

  if (!availableProducts.length) {
    return answer("I could not load the current product catalog right now. Please refresh the page and try again.");
  }

  const wantsCount = /\b(how many|count|total|number of)\b/.test(latest);
  const requestedCategory = latestMatchesCategory(latest);

  if (wantsCount) {
    if (/\bmen'?s?\b/.test(latest) && !/\bwomen'?s?\b/.test(latest)) {
      const menProducts = availableProducts.filter((product) =>
        productHasMen(product) && productMatchesCategory(product, requestedCategory),
      );

      if (requestedCategory) {
        return answer(`Your store currently has **${menProducts.length} men's ${requestedCategory}** available.`);
      }

      return answer(`Your store currently has **${menProducts.length} men's products** available.`);
    }

    if (/\bwomen'?s?\b/.test(latest)) {
      const womenProducts = availableProducts.filter((product) =>
        productHasWomen(product) && productMatchesCategory(product, requestedCategory),
      );

      if (requestedCategory) {
        return answer(`Your store currently has **${womenProducts.length} women's ${requestedCategory}** available.`);
      }

      return answer(`Your store currently has **${womenProducts.length} women's products** available.`);
    }

    if (/\bkids?\b/.test(latest)) {
      const kidsProducts = availableProducts.filter((product) =>
        productHasKids(product) && productMatchesCategory(product, requestedCategory),
      );

      if (requestedCategory) {
        return answer(`Your store currently has **${kidsProducts.length} kids' ${requestedCategory}** available.`);
      }

      return answer(`Your store currently has **${kidsProducts.length} kids' products** available.`);
    }

    if (requestedCategory) {
      const categoryProducts = availableProducts.filter((product) =>
        productMatchesCategory(product, requestedCategory),
      );
      return answer(`Your store currently has **${categoryProducts.length} ${requestedCategory}** available.`);
    }

    return answer(`Your store currently has **${availableProducts.length} products** available.`);
  }

  const requestedColors = Array.from(
    new Set(
      availableProducts
        .flatMap(getColors)
        .filter((color) => containsValue(conversation, color)),
    ),
  );

  const requestedSizes = Array.from(
    new Set(
      availableProducts
        .flatMap(getSizes)
        .filter((size) => containsValue(conversation, size)),
    ),
  );

  const wantsCart = /\b(add|put|place)\b/.test(conversation) && /\bcart\b/.test(conversation);
  const wantsMen = /\bmen'?s?\b/.test(conversation) && !/\bwomen'?s?\b/.test(conversation);
  const wantsWomen = /\bwomen'?s?\b/.test(conversation);
  const wantsKids = /\bkids?\b/.test(conversation);
  const latestWantsList =
    /\b(list|show|display|tell me|what are|which are)\b/.test(latest) ||
    /\bcolors?\b|\bsizes?\b/.test(latest);

  if (latestWantsList && !wantsCart) {
    const scopedProducts = wantsMen
      ? availableProducts.filter(productHasMen)
      : wantsWomen
        ? availableProducts.filter(productHasWomen)
        : wantsKids
          ? availableProducts.filter(productHasKids)
          : availableProducts;

    if (scopedProducts.length) {
      const label = wantsMen
        ? "men's products"
        : wantsWomen
          ? "women's products"
          : wantsKids
            ? "kids' products"
            : "products";

      return answer(`Here are the available **${label}** with colors and sizes:\n\n${formatProductDetails(scopedProducts)}`);
    }

    return answer("I could not find matching products for that list request right now.");
  }

  if (wantsCart) {
    const matchingProducts = availableProducts.filter((product) => {
      if (wantsMen && !productHasMen(product)) return false;
      if (wantsWomen && !productHasWomen(product)) return false;
      if (wantsKids && !productHasKids(product)) return false;

      const colors = getColors(product).map((color) => color.toLowerCase());
      const sizes = getSizes(product).map((size) => size.toLowerCase());
      const colorOk =
        requestedColors.length === 0 ||
        requestedColors.some((color) => colors.includes(color.toLowerCase()));
      const sizeOk =
        requestedSizes.length === 0 ||
        requestedSizes.some((size) => sizes.includes(size.toLowerCase()));
      return colorOk && sizeOk;
    });

    if (!requestedColors.length || !requestedSizes.length) {
      const missing = [
        !requestedColors.length ? "color" : "",
        !requestedSizes.length ? "size" : "",
      ].filter(Boolean);

      return answer(`I can help with that. Please tell me the ${missing.join(" and ")} you want.`);
    }

    const namedProduct = matchingProducts.find((product) =>
      containsValue(latest, productName(product)),
    );
    const finalProduct = namedProduct || (matchingProducts.length === 1 ? matchingProducts[0] : null);

    if (finalProduct) {
      const selectedColorName = requestedColors[0];
      const selectedSize = requestedSizes[0];
      const selectedColor =
        Array.isArray(finalProduct.colors)
          ? finalProduct.colors.find((color: any) =>
              normalizeText(color?.name).toLowerCase() === selectedColorName.toLowerCase(),
            )
          : null;

      return answer(
        `Added **${productName(finalProduct)}** in **${selectedColorName}**, size **${selectedSize}** to your cart.`,
        {
          product: finalProduct,
          selectedColor,
          selectedSize,
          quantity: 1,
        },
      );
    }

    if (matchingProducts.length === 1) {
      return answer(`I found **${productName(matchingProducts[0])}** in **${requestedColors.join(", ")}**, size **${requestedSizes.join(", ")}**. Which product should I add?`);
    }

    if (matchingProducts.length > 1) {
      return answer(`I found these products matching **${requestedColors.join(", ")}** and size **${requestedSizes.join(", ")}**:\n\n${matchingProducts
        .slice(0, 6)
        .map((product) => `- **${productName(product)}**`)
        .join("\n")}\n\nWhich one should I add to your cart?`);
    }

    return answer(`I could not find an in-stock product matching **${requestedColors.join(", ")}** and size **${requestedSizes.join(", ")}**. Try another color or size.`);
  }

  if (requestedColors.length) {
    const matchingProducts = availableProducts.filter((product) => {
      const colors = getColors(product).map((color) => color.toLowerCase());
      return requestedColors.some((color) => colors.includes(color.toLowerCase()));
    });

    return answer(matchingProducts.length
      ? `Products available in **${requestedColors.join(", ")}**:\n\n${matchingProducts
          .slice(0, 8)
          .map((product) => `- **${productName(product)}**`)
          .join("\n")}`
      : `I could not find products in **${requestedColors.join(", ")}** right now.`);
  }

  return answer(`I can still help with store inventory while the AI service is unavailable. Try asking about product counts, colors, sizes, prices, or available men's/women's/kids' products.`);
};

export async function POST(req: NextRequest) {
  try {
    const { query, history = [] } = await req.json();
    const safeQuery = normalizeText(query);
    const safeHistory = Array.isArray(history)
      ? (history as ChatMessage[])
          .filter((message) => message?.role && normalizeText(message?.text))
          .slice(-10)
      : [];

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { answer: "API key missing. Please configure OPENAI_API_KEY in .env.local." },
        { status: 500 }
      );
    }

    const openai = new OpenAI({ apiKey });
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

    let products: any[] = [];
    let categories: any[] = [];

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

    const catalogSummary = products.map((p: any) => ({
      id: p._id || p.id,
      name: p.name,
      price: `${p.price}`,
      currency: p.currency || "$",
      category: p.category,
      gender: p.gender,
      stock: p.in_stock === false ? "Out of Stock" : "In Stock",
      colors: Array.isArray(p.colors)
        ? p.colors.map((c: any) => c?.name).filter(Boolean).join(", ")
        : "",
      sizes: Array.isArray(p.sizes) ? p.sizes : [],
    }));

    const categorySummary = categories
      .map((c: any) => c?.name)
      .filter(Boolean);

    const conversationContext = safeHistory
      .map((message) => `${message.role === "assistant" ? "Assistant" : "Customer"}: ${message.text}`)
      .join("\n");

    const systemInstruction = `You are a helpful and enthusiastic AI assistant for a Nike E-Commerce store.
You are speaking directly to a customer. Use markdown for formatting.
Be concise but friendly. Do not invent products or prices.

CURRENT STORE INVENTORY:
Categories available: ${categorySummary.join(", ") || "None loaded"}
Products available:
${JSON.stringify(catalogSummary, null, 2)}

CORE DIRECTIVES:
1. Only answer shopping questions using the provided store inventory.
2. If a customer asks about a product we do not have, politely say we do not carry it and suggest related catalog items.
3. If asked about prices, give exact prices from the inventory.
4. If asked about stock, colors, sizes, genders, or categories, use the inventory fields.
5. Use the conversation history. If the latest message is a follow-up like "black and size 9", connect it to the earlier product/cart request.
6. If a customer wants to add something to cart but product, color, or size is missing, ask only for the missing details.
7. If product, color, and size are all clear, confirm the exact item and tell them you can add it to the cart from this chat.
8. Do not answer unrelated non-shopping questions; steer back to shopping.`;

    try {
      const response = await openai.responses.create({
        model: "gpt-5-nano",
        input: `${systemInstruction}

RECENT CONVERSATION:
${conversationContext || "No previous messages."}

LATEST CUSTOMER MESSAGE:
${safeQuery}`,
        store: true,
      });

      const responseText =
        response.output_text || "Unable to get a response. Please try again.";

      return NextResponse.json({ answer: responseText });
    } catch (error: any) {
      console.error("Assistant OpenAI Error:", error);

      const fallbackAnswer = buildFallbackAnswer(safeQuery, safeHistory, products);
      return NextResponse.json({
        ...fallbackAnswer,
        fallback: true,
      });
    }
  } catch (error: any) {
    console.error("Assistant API Error:", error);

    return NextResponse.json(
      {
        answer:
          "Experiencing technical difficulties connecting to the AI assistant. Please try again later.",
      },
      { status: 500 }
    );
  }
}
