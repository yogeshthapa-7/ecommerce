"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Flame,
  Gift,
  Search,
  ShoppingBag,
  Star,
  Timer,
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
      href={`/nike/products/${productId}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-zinc-900/90 to-zinc-950 shadow-2xl transition-all duration-500 hover:-translate-y-1.5 hover:border-red-500/50 hover:shadow-red-500/10"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-zinc-900">
        <img
          src={product.image_url || ""}
          alt={product.name || "Product"}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-80" />

        <div className="absolute left-3 top-3 z-10 flex flex-wrap gap-2">
          {discount > 0 && (
            <span className="rounded-full bg-red-600 px-3 py-1 text-[11px] font-black tracking-wider uppercase text-white shadow-md shadow-red-600/30">
              -{discount}% OFF
            </span>
          )}
          {!inStock && (
            <span className="rounded-full bg-zinc-800/90 border border-white/20 px-3 py-1 text-[11px] font-black tracking-wider uppercase text-zinc-300 backdrop-blur-md">
              Sold Out
            </span>
          )}
          {inStock && discount >= 30 && (
            <span className="rounded-full bg-amber-400 px-3 py-1 text-[11px] font-black tracking-wider uppercase text-black shadow-md shadow-amber-400/20">
              Hot Deal
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between p-5">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold tracking-wider text-red-500 uppercase">
            <span>{product.category || "Uncategorized"}</span>
            <span className="rounded-md bg-white/5 px-2 py-0.5 text-[10px] text-zinc-400 border border-white/5">
              {product.gender || "Unisex"}
            </span>
          </div>
          <h3 className="line-clamp-2 text-lg font-black tracking-tight text-white group-hover:text-red-400 transition-colors">
            {product.name || "Untitled Product"}
          </h3>
        </div>

        <div className="mt-5 pt-4 border-t border-white/10 flex items-end justify-between gap-3">
          <div className="space-y-1.5">
            {Number(product.rating) > 0 && (
              <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                <span className="font-bold text-white">{product.rating}</span>
                <span className="text-[10px] text-zinc-500">({product.reviews_count || 0})</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <span className={`h-2 w-2 rounded-full ${inStock ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`} />
              <span className="text-[11px] font-medium tracking-wide text-zinc-400 uppercase">
                {inStock ? "In Stock" : "Out of Stock"}
              </span>
            </div>
          </div>

          <div className="text-right">
            {discount > 0 ? (
              <div className="space-y-0.5">
                <span className="block text-xs font-semibold text-zinc-500 line-through">
                  {formatPrice(product)}
                </span>
                <span className="block text-xl font-black text-red-500 tracking-tight">
                  {product.currency || "$"}{salePrice.toFixed(2)}
                </span>
              </div>
            ) : (
              <span className="block text-xl font-black text-white tracking-tight">
                {formatPrice(product)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

const SalePage = () => {
  const [activeFestival, setActiveFestival] = useState("dashain");
  const [searchTerm, setSearchTerm] = useState("");
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

  const saleProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    return safeProducts.filter((product) => {
      if (!product) return false;
      const discount = Number(product.discount ?? 0);
      if (discount <= 0) return false;

      const productFestival = (product.saleFestival || "").toLowerCase();
      const matchesFestival =
        !productFestival || productFestival === activeFestival;

      const productName = product.name?.toLowerCase() || "";
      const productCategory = product.category?.toLowerCase() || "";
      const matchesSearch =
        !normalizedSearch ||
        productName.includes(normalizedSearch) ||
        productCategory.includes(normalizedSearch);

      return matchesFestival && matchesSearch;
    });
  }, [safeProducts, activeFestival, searchTerm]);

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
    <div className="min-h-screen bg-black text-white selection:bg-red-600 selection:text-white">
      {/* HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden pt-28 pb-16">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=1920&q=85"
            alt="Festival celebration"
            className="h-full w-full object-cover object-center opacity-35 scale-105 animate-pulse duration-[10000ms]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60" />
          <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl w-full px-6 flex flex-col items-start justify-center gap-8">
          <div className="inline-flex items-center gap-3 rounded-full border border-red-500/30 bg-red-950/30 px-4 py-1.5 backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-red-500 animate-ping" />
            <span className="text-xs font-black uppercase tracking-[0.25em] text-red-400">
              Limited Time Festival Event
            </span>
          </div>

          <div className="space-y-4">
            <h1 className="text-6xl font-black uppercase tracking-tighter sm:text-7xl lg:text-8xl leading-[0.9]">
              Festival <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-600 to-orange-500">
                Mega Sale
              </span>
            </h1>
            <p className="max-w-xl text-zinc-400 text-base sm:text-lg font-medium leading-relaxed">
              Celebrate Nepal's greatest festivals with elite drops and exclusive price cuts. Get up to <span className="text-white font-bold">{maxDiscount}% off</span> selected signature footwear and apparel.
            </p>
          </div>

          {/* COUNTDOWN WIDGET */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-zinc-400">
              <Timer className="h-4 w-4 text-red-500" />
              <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                Offer Ends In
              </span>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {timeUnits.map((unit) => (
                <div
                  key={unit.label}
                  className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-zinc-900/80 px-4 py-3 backdrop-blur-xl shadow-xl min-w-[70px]"
                >
                  <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {String(unit.value).padStart(2, "0")}
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mt-0.5">
                    {unit.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-4 pt-2">
            <a
              href="#sale-collection"
              className="inline-flex items-center justify-center gap-3 rounded-full bg-red-600 px-8 py-4 text-sm font-black uppercase tracking-wider text-white shadow-lg shadow-red-600/30 transition-all duration-300 hover:bg-white hover:text-black hover:scale-105"
            >
              Shop Festival Deals
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#festivals"
              className="inline-flex items-center justify-center gap-3 rounded-full border border-white/20 bg-white/5 px-8 py-4 text-sm font-black uppercase tracking-wider text-white backdrop-blur-md transition-all duration-300 hover:bg-white/10 hover:border-white"
            >
              Explore Festivals
            </a>
          </div>
        </div>
      </section>

      {/* FESTIVAL IMAGE STRIP */}
      <section className="relative overflow-hidden border-y border-white/10 bg-zinc-950 py-10">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-sm font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
              <Gift className="h-4 w-4 text-red-500" /> Featured Celebrations
            </h3>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
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
                className={`group relative overflow-hidden rounded-2xl border transition-all duration-500 text-left ${
                  activeFestival === fest.id
                    ? "border-red-500 ring-2 ring-red-500/30 shadow-xl shadow-red-500/10"
                    : "border-white/10 hover:border-white/30"
                }`}
              >
                <div className="absolute inset-0 bg-zinc-900">
                  <img
                    src={fest.src}
                    alt={fest.alt}
                    loading="lazy"
                    className="h-44 w-full object-cover object-center transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-90"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <div className="relative z-10 p-5 h-44 flex flex-col justify-end">
                  <span className="text-[10px] font-black uppercase tracking-widest text-red-400 mb-1">
                    Special Event
                  </span>
                  <span className="text-xl font-black uppercase tracking-tight text-white">
                    {fest.label} Drop
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FESTIVAL TABS */}
      <section
        id="festivals"
        className="sticky top-0 z-40 border-b border-white/10 bg-black/90 backdrop-blur-xl py-4 shadow-2xl"
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-red-500" />
              <span className="text-xs font-black uppercase tracking-widest text-zinc-400">
                Select Festival Category
              </span>
            </div>
            <span className="text-xs text-zinc-500 hidden sm:inline">
              {activeFestivalData?.tagline}
            </span>
          </div>
          <div className="flex gap-2.5 overflow-x-auto pb-1 no-scrollbar">
            {FESTIVALS.map((festival) => (
              <button
                key={festival.id}
                type="button"
                onClick={() => setActiveFestival(festival.id)}
                className={`shrink-0 rounded-full px-6 py-2.5 text-xs font-black uppercase tracking-wider transition-all duration-300 ${
                  activeFestival === festival.id
                    ? "bg-red-600 text-white shadow-lg shadow-red-600/30 scale-105"
                    : "border border-white/10 bg-zinc-900/60 text-zinc-400 hover:border-white/30 hover:text-white"
                }`}
              >
                {festival.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* SALE COLLECTION */}
      <main id="sale-collection" className="bg-black py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between border-b border-white/10 pb-8">
            <div className="space-y-2">
              <span className="text-xs font-black uppercase tracking-[0.3em] text-red-500">
                {activeFestivalData?.label} Collection
              </span>
              <h2 className="text-4xl font-black uppercase tracking-tight md:text-5xl">
                {sortedSaleProducts.length} Exclusive Deals
              </h2>
              <p className="max-w-xl text-zinc-400 text-sm">
                {activeFestivalData?.tagline}. Discounts applied automatically. Stock is strictly limited.
              </p>
            </div>

            <div className="relative w-full md:w-80">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search festival deals..."
                className="h-12 w-full rounded-full border border-white/10 bg-zinc-900/80 py-3 pl-11 pr-4 text-sm font-semibold text-white outline-none transition placeholder:text-zinc-500 focus:border-red-500 focus:bg-zinc-900 shadow-inner"
              />
            </div>
          </div>

          {loading ? (
            <div className="mx-auto max-w-7xl px-6 py-32 text-center">
              <div className="mx-auto h-12 w-12 rounded-full border-2 border-red-600 border-t-transparent animate-spin" />
              <p className="mt-4 text-xs font-bold uppercase tracking-widest text-zinc-500">
                Loading festival deals...
              </p>
            </div>
          ) : error ? (
            <div className="mx-auto max-w-md px-6 py-28 text-center rounded-3xl border border-white/10 bg-zinc-900/50">
              <ShoppingBag className="mx-auto mb-4 h-12 w-12 text-red-500" />
              <h2 className="text-2xl font-black uppercase tracking-tight">Deals unavailable</h2>
              <p className="mt-2 text-sm text-zinc-400">
                Please check the products API connection and try again.
              </p>
            </div>
          ) : sortedSaleProducts.length === 0 ? (
            <div className="mx-auto max-w-md px-6 py-28 text-center rounded-3xl border border-white/10 bg-zinc-900/50">
              <Flame className="mx-auto mb-4 h-12 w-12 text-zinc-600" />
              <h2 className="text-2xl font-black uppercase tracking-tight">No active deals found</h2>
              <p className="mt-2 text-sm text-zinc-400">
                Festival offers for {activeFestivalData?.label} are dropping soon. Try searching another term or festival.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {sortedSaleProducts.map((product, index) => (
                <SaleProductCard key={getProductId(product) || `${index}`} product={product} index={index} />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* CTA STRIP */}
      <section className="relative overflow-hidden border-t border-white/10 bg-gradient-to-b from-zinc-950 to-black py-20">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1552346154-21d32810aba3?w=1920&q=80"
            alt="Sneakers collection"
            className="h-full w-full object-cover opacity-15"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
        </div>
        <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-8 px-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-red-500 text-xs font-black uppercase tracking-widest">
              <Zap className="h-4 w-4" /> Final Hours
            </div>
            <h2 className="text-3xl font-black uppercase tracking-tight sm:text-4xl md:text-5xl">
              Don't Miss Out On <br />
              <span className="text-red-500">The Drop.</span>
            </h2>
            <p className="max-w-xl text-zinc-400 text-sm sm:text-base">
              Festival prices are valid only while supplies last. Once the countdown hits zero, regular pricing returns.
            </p>
          </div>
          <Link
            href="/nike/products"
            className="inline-flex items-center justify-center gap-3 rounded-full bg-white px-8 py-4 text-sm font-black uppercase tracking-wider text-black shadow-xl transition-all duration-300 hover:bg-red-600 hover:text-white hover:scale-105 shrink-0"
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