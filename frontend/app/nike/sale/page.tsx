"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Fuse from "fuse.js";
import {
  ArrowRight,
  Flame,
  Gift,
  Search,
  ShoppingBag,
  Star,
  Timer,
  TrendingUp,
  Zap,
} from "lucide-react";
import useSWR from "swr";
import EcomFooter from "@/components/ecomfooter";

type Product = {
  _id?: string;
  id?: string;
  name?: string;
  category?: string;
  gender?: string;
  image_url?: string;
  rating?: number;
  reviews_count?: number;
  in_stock?: boolean;
  status?: string;
  currency?: string;
  price?: number | string;
  discount?: number;
  saleFestival?: string;
  colors?: Array<{ stockQuantity?: number }>;
  stockQuantity?: number;
};

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }
  return res.json();
};

const formatPrice = (product: Product) => {
  const price = Number(product.price ?? 0);
  const safePrice = Number.isFinite(price) ? price : 0;
  return `${product.currency || "$"}${safePrice.toFixed(2)}`;
};

const getTotalStock = (product: Product) => {
  const colorStock = (product.colors || []).reduce(
    (sum, c) => sum + (c.stockQuantity || 0),
    0
  );
  return colorStock + (product.stockQuantity || 0);
};

const getProductId = (product: Product) => product._id || product.id || "";

const getDiscountedPrice = (product: Product) => {
  const price = Number(product.price ?? 0);
  const discount = Number(product.discount ?? 0);
  if (!Number.isFinite(price) || discount <= 0) return price;
  return price - price * (discount / 100);
};

// Nepali festivals
const FESTIVALS = [
  { id: "dashain", label: "Dashain", tagline: "The biggest festival of Nepal — celebrate with exclusive drops" },
  { id: "tihar", label: "Tihar", tagline: "Festival of lights — illuminate your collection" },
  { id: "holi", label: "Holi", tagline: "Festival of colors — play in style" },
  { id: "teej", label: "Teej", tagline: "Festival of women — festive essentials" },
  { id: "chhath", label: "Chhath", tagline: "Festival of the sun — rise with new gear" },
  { id: "maghi", label: "Maghi", tagline: "Tharu New Year — fresh starts, fresh kicks" },
];

// Sale end date (set ~2 weeks from now for demo purposes)
const SALE_END = new Date();
SALE_END.setDate(SALE_END.getDate() + 14);
SALE_END.setHours(23, 59, 59, 999);

const useCountdown = (target: Date) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const tick = () => {
      const now = new Date().getTime();
      const diff = target.getTime() - now;
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [target]);

  return timeLeft;
};

const SaleProductCard = ({ product, index }: { product: Product; index: number }) => {
  const productId = getProductId(product);
  const discount = Number(product.discount ?? 0);
  const originalPrice = Number(product.price ?? 0);
  const salePrice = getDiscountedPrice(product);
  const inStock = product.in_stock !== false && getTotalStock(product) > 0;

  return (
    <Link
      href={`/nike/products/${productId}?redirect=/nike/sale`}
      className="group relative flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-white/10 bg-zinc-950 shadow-xl shadow-black/30 transition-transform duration-300 hover:-translate-y-1 hover:border-red-400/60"
    >
      <div className="relative aspect-[1.02] overflow-hidden bg-zinc-900">
        <img
          src={product.image_url || ""}
          alt={product.name || "Product"}
          loading="lazy"
          decoding="async"
          className="relative z-10 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/5 to-transparent" />

        {discount > 0 && (
          <div className="absolute left-4 top-4 z-10 rounded-full border border-red-300/30 bg-red-500 px-3 py-1 text-xs font-black uppercase text-white shadow-lg shadow-red-500/30">
            -{discount}%
          </div>
        )}
        {!inStock && (
          <div className="absolute left-4 top-4 z-10 rounded-full border border-red-300/30 bg-red-500 px-3 py-1 text-xs font-black uppercase text-white">
            Sold Out
          </div>
        )}
        {inStock && discount >= 30 && (
          <div className="absolute right-4 top-4 z-10 rounded-full border border-amber-300/30 bg-amber-400 px-3 py-1 text-xs font-black uppercase text-black">
            Hot Deal
          </div>
        )}
      </div>

      <div className="relative z-10 flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-start justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-black uppercase text-red-400">
              {product.category || "Uncategorized"}
            </p>
            <h3 className="line-clamp-2 text-xl font-black leading-tight text-white">
              {product.name || "Untitled Product"}
            </h3>
          </div>
          <span className="shrink-0 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-bold text-gray-200">
            {product.gender || "Unisex"}
          </span>
        </div>

        <div className="mt-auto flex items-end justify-between gap-4 pt-5">
          <div className="space-y-2">
            {Number(product.rating) > 0 && (
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-bold text-white">{product.rating}</span>
                <span className="text-xs text-gray-500">
                  {product.reviews_count || 0} reviews
                </span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <span
                className={`h-2.5 w-2.5 rounded-full ${inStock ? "bg-emerald-400" : "bg-red-500"}`}
              />
              <span className="text-xs font-bold uppercase text-gray-400">
                {inStock ? "In Stock" : "Out of Stock"}
              </span>
            </div>
          </div>

          <div className="text-right">
            {discount > 0 ? (
              <div className="space-y-1">
                <span className="block text-sm font-bold text-gray-500 line-through">
                  {formatPrice(product)}
                </span>
                <span className="block text-2xl font-black text-red-400">
                  {product.currency || "$"}{salePrice.toFixed(2)}
                </span>
              </div>
            ) : (
              <span className="block text-2xl font-black text-white">
                {formatPrice(product)}
              </span>
            )}
            <span className="inline-flex items-center gap-1 text-xs font-bold uppercase text-red-400 opacity-0 transition-opacity group-hover:opacity-100">
              View
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

const SalePage = () => {
  const router = useRouter();
  const [activeFestival, setActiveFestival] = useState("dashain");
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const countdown = useCountdown(SALE_END);

  const {
    data: products = [],
    isLoading: loading,
    error,
  } = useSWR<Product[]>("/api/products", fetcher, {
    refreshInterval: 10000,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
  });

  const safeProducts = Array.isArray(products) ? products : [];

  // Close suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
        setHighlightedIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Hybrid suggestions: popular sale items when empty, fuzzy matching when typing
  const suggestions = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    // Only suggest products that are on sale (discount > 0)
    const onSaleProducts = safeProducts.filter(
      (p) => p && Number(p.discount ?? 0) > 0
    );

    if (!normalizedSearch) {
      // Show popular sale items (sorted by reviews_count, then rating)
      return [...onSaleProducts]
        .filter((p) => p.in_stock !== false)
        .sort((a, b) => {
          const reviewsDiff = (b.reviews_count || 0) - (a.reviews_count || 0);
          if (reviewsDiff !== 0) return reviewsDiff;
          return (b.rating || 0) - (a.rating || 0);
        })
        .slice(0, 6);
    }

    // Fuzzy search with Fuse.js (typo-tolerant) on sale products only
    const fuse = new Fuse(onSaleProducts, {
      keys: [
        { name: "name", weight: 0.5 },
        { name: "category", weight: 0.25 },
        { name: "gender", weight: 0.25 },
      ],
      threshold: 0.4, // allows typos (0 = exact, 1 = match anything)
      distance: 100,
      minMatchCharLength: 1,
      ignoreLocation: true,
      includeScore: true,
    });

    const results = fuse.search(normalizedSearch);

    // Sort matches: in-stock first, then by reviews_count
    return results
      .map((r) => r.item)
      .sort((a, b) => {
        const aInStock = a.in_stock !== false ? 1 : 0;
        const bInStock = b.in_stock !== false ? 1 : 0;
        if (aInStock !== bInStock) return bInStock - aInStock;
        return (b.reviews_count || 0) - (a.reviews_count || 0);
      })
      .slice(0, 6);
  }, [safeProducts, searchTerm]);

  // Group suggestions by category
  const groupedSuggestions = useMemo(() => {
    const groups: Record<string, Product[]> = {};
    suggestions.forEach((p) => {
      if (!p) return;
      const cat = p.category || "Other";
      groups[cat] = groups[cat] || [];
      groups[cat].push(p);
    });
    return groups;
  }, [suggestions]);

  const handleSuggestionClick = (product: Product) => {
    const productId = product._id || product.id || "";
    setShowSuggestions(false);
    setHighlightedIndex(-1);
    if (productId) {
      router.push(`/nike/products/${productId}?redirect=/nike/sale`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : suggestions.length - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
        handleSuggestionClick(suggestions[highlightedIndex]);
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      setHighlightedIndex(-1);
    }
  };

  // Products on sale (discount > 0), filtered by festival
  const saleProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    return safeProducts.filter((product) => {
      if (!product) return false;
      const discount = Number(product.discount ?? 0);
      if (discount <= 0) return false;

      // Festival filter: match saleFestival or show all if no festival set
      const productFestival = (product.saleFestival || "").toLowerCase();
      const matchesFestival =
        !productFestival || productFestival === activeFestival;

      // Search filter
      const productName = product.name?.toLowerCase() || "";
      const productCategory = product.category?.toLowerCase() || "";
      const matchesSearch =
        !normalizedSearch ||
        productName.includes(normalizedSearch) ||
        productCategory.includes(normalizedSearch);

      return matchesFestival && matchesSearch;
    });
  }, [safeProducts, activeFestival, searchTerm]);

  // Sort by discount descending
  const sortedSaleProducts = useMemo(() => {
    return [...saleProducts].sort(
      (a, b) => Number(b.discount ?? 0) - Number(a.discount ?? 0)
    );
  }, [saleProducts]);

  const activeFestivalData = FESTIVALS.find((f) => f.id === activeFestival);
  const maxDiscount = useMemo(() => {
    return safeProducts.reduce(
      (max, p) => Math.max(max, Number(p.discount ?? 0)),
      0
    );
  }, [safeProducts]);

  const timeUnits = [
    { value: countdown.days, label: "Days" },
    { value: countdown.hours, label: "Hours" },
    { value: countdown.minutes, label: "Mins" },
    { value: countdown.seconds, label: "Secs" },
  ];

  return (
    <div className="min-h-screen overflow-hidden bg-black text-white">
      {/* HERO */}
      <section className="relative min-h-[70vh] overflow-hidden bg-black pt-28">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=1920&q=80"
            alt="Festival celebration"
            className="h-full w-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,#000_0%,rgba(0,0,0,0.85)_45%,rgba(220,38,38,0.25)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(239,68,68,0.35),transparent_45%)]" />
        </div>

        <div className="relative z-10 mx-auto flex min-h-[calc(70vh-7rem)] max-w-7xl flex-col items-start justify-center gap-8 px-6">
          <div className="inline-flex items-center gap-2 border-b border-red-500 pb-2 text-xs font-black uppercase tracking-[0.32em] text-red-400">
            <span className="h-1.5 w-8 rounded-full bg-red-500" />
            Limited Time Offer
          </div>

          <h1 className="max-w-4xl text-6xl font-black uppercase leading-[0.82] tracking-tight sm:text-7xl lg:text-8xl">
            Festival
            <span className="block text-red-500">Sale</span>
          </h1>

          <p className="max-w-xl text-base leading-8 text-gray-300 sm:text-lg">
            Celebrate Nepal's festivals with exclusive offers on premium athletic
            footwear, apparel, and gear. Up to {maxDiscount}% off selected items.
          </p>

          {/* COUNTDOWN */}
          <div className="flex items-center gap-3">
            <Timer className="h-5 w-5 text-red-400" />
            <span className="text-xs font-black uppercase tracking-[0.2em] text-white/50">
              Sale ends in
            </span>
          </div>
          <div className="flex gap-3">
            {timeUnits.map((unit) => (
              <div
                key={unit.label}
                className="flex min-w-[72px] flex-col items-center rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 backdrop-blur-sm"
              >
                <span className="text-3xl font-black text-white">
                  {String(unit.value).padStart(2, "0")}
                </span>
                <span className="mt-1 text-[10px] font-black uppercase tracking-[0.18em] text-white/40">
                  {unit.label}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-col gap-4 sm:flex-row">
            <a
              href="#sale-collection"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-red-500 px-7 py-4 text-sm font-black uppercase text-white transition hover:scale-105 hover:bg-white hover:text-black"
            >
              Shop the Sale
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#festivals"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 py-4 text-sm font-black uppercase text-white transition hover:border-white hover:bg-white/10"
            >
              Browse Festivals
            </a>
          </div>
        </div>
      </section>

      {/* FESTIVAL IMAGE STRIP */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-6 py-8 sm:grid-cols-3">
          {[
            {
              src: "/dashain.jpg",
              alt: "Dashain celebration",
              label: "Dashain",
              id: "dashain",
            },
            {
              src: "/tihar.jpg",
              alt: "Tihar lights",
              label: "Tihar",
              id: "tihar",
            },
            {
              src: "/holi.jpg",
              alt: "Festival colors",
              label: "Holi",
              id: "holi",
            },
          ].map((fest) => (
            <button
              key={fest.label}
              type="button"
              onClick={() => setActiveFestival(fest.id)}
              className="group relative overflow-hidden rounded-2xl border border-white/10"
            >
              <img
                src={fest.src}
                alt={fest.alt}
                loading="lazy"
                className="h-40 w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              <span className="absolute bottom-3 left-4 text-sm font-black uppercase tracking-[0.18em] text-white">
                {fest.label}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* FESTIVAL TABS */}
      <section
        id="festivals"
        className="sticky top-[72px] z-30 border-y border-white/10 bg-black/95 py-5"
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6">
          <div className="flex items-center gap-3">
            <Gift className="h-5 w-5 text-red-400" />
            <span className="text-sm font-black uppercase tracking-[0.18em] text-white/60">
              Festival Offers
            </span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {FESTIVALS.map((festival) => (
              <button
                key={festival.id}
                type="button"
                onClick={() => setActiveFestival(festival.id)}
                className={`shrink-0 rounded-full px-5 py-3 text-sm font-black uppercase transition ${
                  activeFestival === festival.id
                    ? "bg-red-500 text-white shadow-lg shadow-red-500/30"
                    : "border border-white/10 bg-white/[0.04] text-gray-400 hover:border-white/30 hover:text-white"
                }`}
              >
                {festival.label}
              </button>
            ))}
          </div>
          <p className="text-sm font-medium text-white/45">
            {activeFestivalData?.tagline}
          </p>
        </div>
      </section>

      {/* SALE COLLECTION */}
      <main id="sale-collection" className="bg-black py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-9 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="space-y-3">
              <p className="text-xs font-black uppercase tracking-[0.32em] text-red-400">
                {activeFestivalData?.label} Edition
              </p>
              <h2 className="text-5xl font-black uppercase leading-none tracking-tight md:text-6xl">
                {sortedSaleProducts.length} Deals
              </h2>
              <p className="max-w-2xl text-gray-400">
                Handpicked offers for {activeFestivalData?.label}. Prices include
                festival discounts — while stock lasts.
              </p>
            </div>

            <div className="relative w-full lg:max-w-md" ref={searchContainerRef}>
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowSuggestions(true);
                  setHighlightedIndex(-1);
                }}
                onFocus={() => setShowSuggestions(true)}
                onKeyDown={handleKeyDown}
                placeholder="Search deals..."
                className="h-[52px] w-full rounded-full border border-white/10 bg-white/[0.06] py-4 pl-12 pr-4 text-sm font-semibold text-white outline-none transition placeholder:text-gray-500 focus:border-red-400 focus:bg-white/[0.09]"
              />

              {/* SUGGESTIONS DROPDOWN */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-full z-50 mt-3 overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b0b] shadow-2xl shadow-black/60 backdrop-blur-md">
                  {/* Header */}
                  <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.03] px-5 py-3">
                    {searchTerm.trim() ? (
                      <>
                        <Search className="h-3.5 w-3.5 text-red-400" />
                        <span className="text-[10px] font-black uppercase tracking-[0.18em] text-white/50">
                          Deal Suggestions
                        </span>
                      </>
                    ) : (
                      <>
                        <TrendingUp className="h-3.5 w-3.5 text-red-400" />
                        <span className="text-[10px] font-black uppercase tracking-[0.18em] text-white/50">
                          Popular Deals
                        </span>
                      </>
                    )}
                  </div>

                  {/* Grouped suggestions */}
                  <div className="max-h-[380px] overflow-y-auto">
                    {Object.entries(groupedSuggestions).map(
                      ([category, items]) => (
                        <div key={category}>
                          {/* Category label */}
                          <div className="px-5 pt-3 pb-1">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/35">
                              {category}
                            </span>
                          </div>

                          {items.map((product) => {
                            const globalIndex = suggestions.indexOf(product);
                            const isHighlighted = globalIndex === highlightedIndex;
                            const productId = product._id || product.id || "";
                            const discount = Number(product.discount ?? 0);

                            return (
                              <button
                                key={productId || product.name}
                                type="button"
                                onClick={() => handleSuggestionClick(product)}
                                onMouseEnter={() => setHighlightedIndex(globalIndex)}
                                className={`flex w-full items-center gap-4 px-5 py-3 text-left transition-colors ${
                                  isHighlighted
                                    ? "bg-red-500/10"
                                    : "hover:bg-white/[0.04]"
                                }`}
                              >
                                {/* Product image */}
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-[#0a0a0a]">
                                  {product.image_url ? (
                                    <img
                                      src={product.image_url}
                                      alt={product.name || "Product"}
                                      className="h-full w-full object-contain"
                                      loading="lazy"
                                      decoding="async"
                                    />
                                  ) : (
                                    <ShoppingBag className="h-4 w-4 text-white/30" />
                                  )}
                                </div>

                                {/* Name + meta */}
                                <div className="min-w-0 flex-1">
                                  <p className="truncate text-sm font-bold text-white">
                                    {product.name || "Untitled Product"}
                                  </p>
                                  <div className="mt-1 flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-white/35">
                                    <span>{product.gender || "Unisex"}</span>
                                    {Number(product.rating) > 0 && (
                                      <span className="inline-flex items-center gap-1">
                                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                        {product.rating}
                                      </span>
                                    )}
                                    {(product.reviews_count || 0) > 0 && (
                                      <span>
                                        {product.reviews_count} reviews
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {/* Price / discount */}
                                <div className="shrink-0 text-right">
                                  {discount > 0 ? (
                                    <div className="space-y-0.5">
                                      <span className="block text-[11px] font-bold text-white/35 line-through">
                                        {product.currency || "$"}
                                        {Number(product.price ?? 0).toFixed(2)}
                                      </span>
                                      <span className="block text-sm font-black text-red-400">
                                        {product.currency || "$"}
                                        {(
                                          Number(product.price ?? 0) -
                                          (Number(product.price ?? 0) * discount) / 100
                                        ).toFixed(2)}
                                      </span>
                                    </div>
                                  ) : (
                                    <span className="block text-sm font-black text-white">
                                      {product.currency || "$"}
                                      {Number(product.price ?? 0).toFixed(2)}
                                    </span>
                                  )}
                                </div>

                                {/* Arrow */}
                                <ArrowRight
                                  className={`h-4 w-4 shrink-0 transition-colors ${
                                    isHighlighted
                                      ? "text-red-400"
                                      : "text-white/20"
                                  }`}
                                />
                              </button>
                            );
                          })}
                        </div>
                      )
                    )}
                  </div>

                  {/* Footer hint */}
                  <div className="border-t border-white/10 bg-white/[0.02] px-5 py-2.5">
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/30">
                      Use ↑ ↓ to navigate · Enter to select · Esc to close
                    </p>
                  </div>
                </div>
              )}

              {/* No results dropdown */}
              {showSuggestions &&
                searchTerm.trim() &&
                suggestions.length === 0 && (
                  <div className="absolute left-0 right-0 top-full z-50 mt-3 overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b0b] px-5 py-6 text-center shadow-2xl shadow-black/60 backdrop-blur-md">
                    <Flame className="mx-auto mb-2 h-6 w-6 text-white/20" />
                    <p className="text-sm font-bold text-white/60">
                      No deals for "{searchTerm}"
                    </p>
                    <p className="mt-1 text-xs text-white/35">
                      Try a different name, category, or gender
                    </p>
                  </div>
                )}
            </div>
          </div>

          {loading ? (
            <div className="mx-auto max-w-7xl px-6 py-20 text-center">
              <div className="mx-auto h-14 w-14 rounded-full border-4 border-red-500 border-t-transparent animate-spin" />
              <p className="mt-5 text-sm font-bold uppercase text-gray-400">
                Loading festival deals...
              </p>
            </div>
          ) : error ? (
            <div className="mx-auto max-w-3xl px-6 py-24 text-center">
              <ShoppingBag className="mx-auto mb-5 h-14 w-14 text-red-500" />
              <h2 className="text-3xl font-black uppercase">Deals did not load</h2>
              <p className="mt-3 text-gray-400">
                Please check the products API and refresh the sale page.
              </p>
            </div>
          ) : sortedSaleProducts.length === 0 ? (
            <div className="mx-auto max-w-3xl px-6 py-24 text-center">
              <Flame className="mx-auto mb-5 h-14 w-14 text-gray-700" />
              <h2 className="text-3xl font-black uppercase">No deals yet</h2>
              <p className="mt-3 text-gray-400">
                Festival offers for {activeFestivalData?.label} are being prepared.
                Check back soon or browse other festivals.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {sortedSaleProducts.map((product, index) => (
                <SaleProductCard key={getProductId(product) || `${index}`} product={product} index={index} />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* CTA STRIP */}
      <section className="relative overflow-hidden border-y border-white/10 bg-zinc-950 py-14">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1552346154-21d32810aba3?w=1920&q=80"
            alt="Sneakers collection"
            className="h-full w-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-[linear-gradient(100deg,rgba(239,68,68,0.22),transparent_45%,rgba(255,255,255,0.08))]" />
        </div>
        <div className="relative mx-auto flex max-w-7xl flex-col gap-6 px-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="flex items-center gap-3 text-3xl font-black uppercase md:text-5xl">
              <Zap className="h-8 w-8 text-red-500" />
              Don't miss out.
            </h2>
            <p className="mt-3 max-w-2xl text-gray-400">
              Festival prices are available for a limited time. Stock is limited
              and discounts end when the timer hits zero.
            </p>
          </div>
          <Link
            href="/nike/products"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-red-500 px-7 py-4 text-sm font-black uppercase text-white transition hover:scale-105 hover:bg-white hover:text-black"
          >
            Browse All Products
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <EcomFooter />
    </div>
  );
};

export default SalePage;
