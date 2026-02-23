// app/api/assistant/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();
    const q = query.toLowerCase();

    let answer = "Sorry, I couldn't understand your request. Try asking about products, categories, orders, or customers.";

    // Get the base URL - use relative URLs for same-origin requests
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || req.nextUrl.origin;

    // --- PRODUCT INTENTS ---
    if (q.includes("product") || q.includes("shoe") || q.includes("sneaker") || q.includes("nike")) {
      try {
        const res = await fetch(`${baseUrl}/api/products`, {
          cache: 'no-store',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!res.ok) {
          throw new Error(`API responded with status: ${res.status}`);
        }
        
        const data = await res.json();
        answer = data.length
          ? `👟 We have ${data.length} products available. Example: ${data[0]?.name || data[0]?.title || 'Nike Shoe'}`
          : "No products found at the moment.";
      } catch (err) {
        console.error("Products API Error:", err);
        answer = "⚠️ Unable to fetch products right now. Please try again later.";
      }
    }

    // --- CATEGORY INTENTS ---
    else if (q.includes("category") || q.includes("section") || q.includes("collection")) {
      try {
        const res = await fetch(`${baseUrl}/api/categories`, {
          cache: 'no-store',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!res.ok) {
          throw new Error(`API responded with status: ${res.status}`);
        }
        
        const data = await res.json();
        answer = data.length
          ? `📂 Available categories: ${data.map((c: any) => c.name || c.title).join(", ")}`
          : "No categories available at the moment.";
      } catch (err) {
        console.error("Categories API Error:", err);
        answer = "⚠️ Unable to fetch categories right now. Please try again later.";
      }
    }

    // --- CUSTOMER INTENTS ---
    else if (q.includes("customer") || q.includes("account") || q.includes("user") || q.includes("profile")) {
      try {
        const res = await fetch(`${baseUrl}/api/customers`, {
          cache: 'no-store',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!res.ok) {
          throw new Error(`API responded with status: ${res.status}`);
        }
        
        const data = await res.json();
        answer = `👤 Total registered customers: ${data.length}`;
      } catch (err) {
        console.error("Customers API Error:", err);
        answer = "⚠️ Unable to fetch customer data right now. Please try again later.";
      }
    }

    // --- ORDER INTENTS ---
    else if (q.includes("order") || q.includes("purchase") || q.includes("buy") || q.includes("cart")) {
      try {
        const res = await fetch(`${baseUrl}/api/orders`, {
          cache: 'no-store',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!res.ok) {
          throw new Error(`API responded with status: ${res.status}`);
        }
        
        const data = await res.json();
        answer = data.length
          ? `🛒 Total orders: ${data.length}. Latest order ID: ${data[0]?.id || data[0]?._id || 'N/A'}`
          : "No orders found.";
      } catch (err) {
        console.error("Orders API Error:", err);
        answer = "⚠️ Unable to fetch orders right now. Please try again later.";
      }
    }

    // --- SHIPPING & DELIVERY ---
    else if (q.includes("shipping") || q.includes("delivery") || q.includes("ship")) {
      answer = "📦 Shipping info:\n• Free standard shipping on orders $150+\n• Express shipping (2-3 days)\n• Next-day delivery in select areas\n• Track your order anytime!";
    }

    // --- RETURN & EXCHANGE ---
    else if (q.includes("return") || q.includes("exchange") || q.includes("refund")) {
      answer = "🔄 Return policy:\n• 30-day return window\n• Free returns\n• Items must be unworn with tags\n• Refunds in 5-7 business days";
    }

    // --- SIZE & FIT ---
    else if (q.includes("size") || q.includes("fit") || q.includes("sizing")) {
      answer = "📏 Size guide:\n• Check size chart on product pages\n• True to size for most styles\n• Half sizes available\n• Need help? Try our size finder!";
    }

    // --- CONTACT & SUPPORT ---
    else if (q.includes("contact") || q.includes("support") || q.includes("help")) {
      answer = "📞 Contact us:\n• Live chat: 24/7\n• Email: support@nike.com\n• Phone: 1-800-806-6453\n• Average response: 24 hours";
    }

    // --- GREETING ---
    else if (q.includes("hello") || q.includes("hi") || q.includes("hey")) {
      answer = "👋 Hello! I can help you with:\n• Products & inventory\n• Orders & shipping\n• Returns & exchanges\n• Size & fit\n\nWhat would you like to know?";
    }

    return NextResponse.json({ answer });

  } catch (error) {
    console.error("Assistant API Error:", error);
    return NextResponse.json(
      { answer: "⚠️ Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}