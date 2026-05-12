"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ChevronDown,
  Filter,
  Heart,
  Search,
  ShoppingBag,
  Star,
} from "lucide-react";
import useSWR from "swr";
import EcomFooter from "@/components/ecomfooter";
import EcomNavbar from "@/components/ecomnavbar";

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
};

type ProductsByCategory = Record<string, Product[]>;

const heroShoeImages = [
  "/assets/nike-hero/nike6-transparent.png",
  "/assets/nike-hero/nike3-transparent.png",
  "/assets/nike-hero/nike2-transparent.png",
  "/assets/nike-hero/nike1-transparent.png",
];

const fallbackHeroImages = heroShoeImages;

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

const getProductId = (product: Product) => product._id || product.id || "";

const ProductCard = ({ product, index }: { product: Product; index: number }) => {
  const productId = getProductId(product);

  return (
    <Link
      href={`/nike/products/${productId}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-white/10 bg-zinc-950 shadow-xl shadow-black/30 transition-transform duration-300 hover:-translate-y-1 hover:border-red-400/60"
    >
        <button
          type="button"
          aria-label={`Add ${product.name || "product"} to wishlist`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log("Added to wishlist:", productId);
          }}
          className="absolute right-4 top-4 z-20 grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-black/65 text-white transition-colors hover:border-red-400 hover:bg-red-500"
        >
          <Heart className="h-5 w-5 transition-colors group-hover:fill-white" />
        </button>

        <div className="relative aspect-[1.02] overflow-hidden bg-zinc-900">
          <img
            src={product.image_url || fallbackHeroImages[index % fallbackHeroImages.length]}
            alt={product.name || "Product"}
            loading="lazy"
            decoding="async"
            className="relative z-10 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/5 to-transparent" />

          {product.status === "active" && product.in_stock && (
            <div className="absolute left-4 top-4 z-10 rounded-full border border-emerald-300/30 bg-emerald-400 px-3 py-1 text-xs font-black uppercase text-black">
              New
            </div>
          )}
          {product.in_stock === false && (
            <div className="absolute left-4 top-4 z-10 rounded-full border border-red-300/30 bg-red-500 px-3 py-1 text-xs font-black uppercase text-white">
              Sold Out
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
                  className={`h-2.5 w-2.5 rounded-full ${
                    product.in_stock ? "bg-emerald-400" : "bg-red-500"
                  }`}
                />
                <span className="text-xs font-bold uppercase text-gray-400">
                  {product.in_stock ? "In Stock" : "Out of Stock"}
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="block text-2xl font-black text-white">
                {formatPrice(product)}
              </span>
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

const ProductsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

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

  const productsByCategory = useMemo<ProductsByCategory>(() => {
    return safeProducts.reduce<ProductsByCategory>((acc, product) => {
      if (!product) return acc;

      const category = product.category || "Other";
      acc[category] = acc[category] || [];
      acc[category].push(product);

      return acc;
    }, {});
  }, [safeProducts]);

  const allCategories = useMemo(() => {
    const orderedCategories = ["Shoes", "Bags", "Hoodies"].filter(
      (cat) => productsByCategory[cat],
    );
    const otherCategories = Object.keys(productsByCategory).filter(
      (cat) => !orderedCategories.includes(cat),
    );

    return [...orderedCategories, ...otherCategories];
  }, [productsByCategory]);

  const filteredProductsByCategory = useMemo<ProductsByCategory>(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return allCategories.reduce<ProductsByCategory>((acc, category) => {
      if (selectedCategory !== "All" && selectedCategory !== category) {
        return acc;
      }

      const categoryProducts = productsByCategory[category] || [];
      const matchingProducts = categoryProducts.filter((product) => {
        const productName = product.name?.toLowerCase() || "";
        const productGender = product.gender?.toLowerCase() || "";
        const productCategory = product.category?.toLowerCase() || "";

        return (
          !normalizedSearch ||
          productName.includes(normalizedSearch) ||
          productGender.includes(normalizedSearch) ||
          productCategory.includes(normalizedSearch)
        );
      });

      if (matchingProducts.length) {
        acc[category] = matchingProducts;
      }

      return acc;
    }, {});
  }, [allCategories, productsByCategory, searchTerm, selectedCategory]);

  const visibleCategories = Object.keys(filteredProductsByCategory);
  const visibleCount = visibleCategories.reduce(
    (total, category) => total + filteredProductsByCategory[category].length,
    0,
  );

  const heroImages = heroShoeImages;

  return (
    <div className="min-h-screen overflow-hidden bg-black text-white">
      <EcomNavbar />

      <section className="relative min-h-[88vh] overflow-hidden bg-black pt-28">
        <div className="absolute inset-0">
          <img
            src="https://img3.wallspic.com/crops/5/5/2/6/4/146255/146255-shoe-black-darkness-nike-graphic_design-3840x2160.jpg"
            alt=""
            className="h-full w-full scale-105 object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,#000_0%,rgba(0,0,0,0.78)_42%,rgba(0,0,0,0.35)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(239,68,68,0.26),transparent_28%),linear-gradient(180deg,transparent_55%,#000_100%)]" />
        </div>

        <div className="relative z-10 mx-auto grid min-h-[calc(88vh-7rem)] max-w-7xl grid-cols-1 items-center gap-12 px-6 pb-16 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 border-b border-red-500 pb-2 text-xs font-black uppercase tracking-[0.32em] text-red-400">
              <span className="h-1.5 w-8 rounded-full bg-red-500" />
              Shop the latest edit
            </div>

            <div className="space-y-5">
              <h1 className="max-w-4xl text-6xl font-black uppercase leading-[0.82] tracking-tight sm:text-7xl lg:text-8xl">
                Shop
                <span className="block text-red-500">Collection</span>
              </h1>
              <p className="max-w-xl text-base leading-8 text-gray-300 sm:text-lg">
                Premium athletic footwear, apparel, and gear built into one
                sharp collection experience.
              </p>
            </div>

            <div className="grid max-w-xl grid-cols-3 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.06]">
              {[
                { value: safeProducts.length, label: "Products" },
                { value: allCategories.length, label: "Categories" },
                {
                  value: safeProducts.filter((product) => product.in_stock).length,
                  label: "In Stock",
                },
              ].map((stat) => (
                <div key={stat.label} className="border-r border-white/10 p-4 last:border-r-0">
                  <div className="text-2xl font-black">{stat.value}</div>
                  <div className="text-xs font-bold uppercase text-gray-500">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href="#collection"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-4 text-sm font-black uppercase text-black transition hover:scale-105 hover:bg-red-500 hover:text-white"
              >
                Browse Drops
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#shop-controls"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 py-4 text-sm font-black uppercase text-white transition hover:border-white hover:bg-white/10"
              >
                Filter Collection
                <ChevronDown className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="relative min-h-[500px] overflow-hidden">
            <div className="absolute left-1/2 top-1/2 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-red-500/10" />
            <div className="absolute left-1/2 top-1/2 h-[470px] w-[470px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />
            <div className="absolute inset-y-0 left-0 flex items-center overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
              <div className="flex w-max items-center hero-shoe-marquee">
                {[0, 1].map((setIndex) => (
                  <div
                    key={setIndex}
                    aria-hidden={setIndex === 1}
                    className="flex shrink-0 items-center gap-12 pr-12"
                  >
                    {heroImages.map((image, index) => (
                      <img
                        key={`${image}-${setIndex}-${index}`}
                        src={image}
                        alt={setIndex === 0 ? "Nike shoe" : ""}
                        loading={setIndex === 0 && index === 0 ? "eager" : "lazy"}
                        decoding="async"
                        className={`h-auto shrink-0 object-contain drop-shadow-[0_34px_50px_rgba(0,0,0,0.75)] ${
                          index === 0
                            ? "w-[360px] rotate-[-8deg] sm:w-[460px]"
                            : index === 1
                              ? "w-[300px] rotate-[-3deg] sm:w-[390px]"
                              : index === 2
                                ? "w-[430px] rotate-[5deg] sm:w-[560px]"
                                : "w-[340px] rotate-[7deg] sm:w-[440px]"
                        }`}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .hero-shoe-marquee {
          animation: hero-shoe-marquee 26s linear infinite;
          will-change: transform;
        }

        @keyframes hero-shoe-marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-shoe-marquee {
            animation: none;
            transform: translateX(0);
          }
        }
      `}</style>

      <section
        id="shop-controls"
        className="sticky top-[72px] z-30 border-y border-white/10 bg-black/95 py-5"
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search shoes, bags, hoodies..."
              className="h-[52px] w-full rounded-full border border-white/10 bg-white/[0.06] py-4 pl-12 pr-4 text-sm font-semibold text-white outline-none transition placeholder:text-gray-500 focus:border-red-400 focus:bg-white/[0.09]"
            />
          </div>

          <div className="flex items-center gap-3 overflow-x-auto pb-1">
            <div className="hidden items-center gap-2 text-sm font-black uppercase text-gray-500 lg:flex">
              <Filter className="h-4 w-4" />
              Category
            </div>
            {["All", ...allCategories].map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`shrink-0 rounded-full px-5 py-3 text-sm font-black uppercase transition ${
                  selectedCategory === category
                    ? "bg-red-500 text-white shadow-lg shadow-red-500/30"
                    : "border border-white/10 bg-white/[0.04] text-gray-400 hover:border-white/30 hover:text-white"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="text-sm font-bold uppercase text-gray-500">
            {visibleCount} items shown
          </div>
        </div>
      </section>

      <main id="collection" className="bg-black py-16">
        {loading ? (
          <div className="mx-auto max-w-7xl px-6 py-20 text-center">
            <div className="mx-auto h-14 w-14 rounded-full border-4 border-red-500 border-t-transparent animate-spin" />
            <p className="mt-5 text-sm font-bold uppercase text-gray-400">
              Loading the collection...
            </p>
          </div>
        ) : error ? (
          <div className="mx-auto max-w-3xl px-6 py-24 text-center">
            <ShoppingBag className="mx-auto mb-5 h-14 w-14 text-red-500" />
            <h2 className="text-3xl font-black uppercase">Products did not load</h2>
            <p className="mt-3 text-gray-400">
              Please check the products API and refresh the shop page.
            </p>
          </div>
        ) : visibleCategories.length === 0 ? (
          <div className="mx-auto max-w-3xl px-6 py-24 text-center">
            <Search className="mx-auto mb-5 h-14 w-14 text-gray-700" />
            <h2 className="text-3xl font-black uppercase">No matching products</h2>
            <p className="mt-3 text-gray-400">
              Try another search term or switch back to all categories.
            </p>
          </div>
        ) : (
          <div className="space-y-24">
            {visibleCategories.map((category, categoryIndex) => {
              const categoryProducts = filteredProductsByCategory[category] || [];

              return (
                <section
                  key={category}
                  className="relative [contain-intrinsic-size:900px] [content-visibility:auto]"
                >
                  <div className="absolute inset-x-0 top-24 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                  <div className="mx-auto max-w-7xl px-6">
                    <div className="mb-9 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                      <div className="space-y-3">
                        <p className="text-xs font-black uppercase tracking-[0.32em] text-red-400">
                          Drop {String(categoryIndex + 1).padStart(2, "0")}
                        </p>
                        <h2 className="text-5xl font-black uppercase leading-none tracking-tight md:text-6xl">
                          {category}
                        </h2>
                        <p className="max-w-2xl text-gray-400">
                          {categoryProducts.length}{" "}
                          {categoryProducts.length === 1 ? "item" : "items"} available
                          in this edit.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {categoryProducts.map((product, index) => (
                        <ProductCard
                          key={getProductId(product) || `${category}-${index}`}
                          product={product}
                          index={index}
                        />
                      ))}
                    </div>

                  </div>
                </section>
              );
            })}
          </div>
        )}
      </main>

      <section className="relative overflow-hidden border-y border-white/10 bg-zinc-950 py-14">
        <div className="absolute inset-0 bg-[linear-gradient(100deg,rgba(239,68,68,0.22),transparent_45%,rgba(255,255,255,0.08))]" />
        <div className="relative mx-auto flex max-w-7xl flex-col gap-6 px-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-black uppercase md:text-5xl">
              Built for the next move.
            </h2>
            <p className="mt-3 max-w-2xl text-gray-400">
              Explore fresh silhouettes, everyday gear, and high-performance
              essentials from your live product catalog.
            </p>
          </div>
          <Link
            href="/nike"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-red-500 px-7 py-4 text-sm font-black uppercase text-white transition hover:scale-105 hover:bg-white hover:text-black"
          >
            Back to Nike Home
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <EcomFooter />
    </div>
  );
};

export default ProductsPage;
