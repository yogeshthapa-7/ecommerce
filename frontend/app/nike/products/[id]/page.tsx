"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  Heart,
  Minus,
  Plus,
  RotateCcw,
  ShieldCheck,
  ShoppingCart,
  Star,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import EcomFooter from "@/components/ecomfooter";
import EcomNavbar from "@/components/ecomnavbar";
import { useCart } from "@/app/context/CartContext";

type ProductColor = {
  name?: string;
  image_url?: string;
};

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
  description?: string;
  colors?: ProductColor[];
  sizes?: string[];
};

const fallbackProductImage = "/assets/nike-hero/nike6-transparent.png";

const getProductId = (product: Product) => product._id || product.id || "";

const parseWishlist = (): Product[] => {
  try {
    const parsed = JSON.parse(localStorage.getItem("wishlist") || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const formatPrice = (product: Product) => {
  const price = Number(product.price ?? 0);
  const safePrice = Number.isFinite(price) ? price : 0;

  return `${product.currency || "$"}${safePrice.toFixed(2)}`;
};

const ProductDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [currentImage, setCurrentImage] = useState("");
  const [addedToCart, setAddedToCart] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        const foundProduct = (await res.json()) as Product;

        if (!res.ok || !foundProduct) {
          setProduct(null);
          return;
        }

        const defaultColor = foundProduct.colors?.[0] || null;

        setProduct(foundProduct);
        setSelectedColor(defaultColor);
        setCurrentImage(
          defaultColor?.image_url || foundProduct.image_url || fallbackProductImage,
        );

        const wishlist = parseWishlist();
        setIsWishlisted(
          wishlist.some(
            (item) => getProductId(item) === getProductId(foundProduct),
          ),
        );
      } catch (error) {
        console.error("Error fetching product:", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  const availableColors = product?.colors || [];
  const availableSizes = product?.sizes || [];
  const productImage = currentImage || product?.image_url || fallbackProductImage;

  const selectedMeta = useMemo(() => {
    if (!product) return "";

    return [product.category || "Performance", product.gender].filter(Boolean).join(" / ");
  }, [product]);

  const handleAddToCart = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login?redirect=/nike/products/" + id);
      return;
    }

    if (availableSizes.length > 0 && !selectedSize) {
      alert("Please select a size");
      return;
    }

    if (!product) return;

    addToCart(product, selectedColor, selectedSize, quantity);
    setAddedToCart(true);
    window.setTimeout(() => setAddedToCart(false), 1800);
  };

  const handleColorChange = (color: ProductColor) => {
    setSelectedColor(color);
    setCurrentImage(color.image_url || product?.image_url || fallbackProductImage);
  };

  const toggleWishlist = () => {
    if (!product) return;

    const wishlist = parseWishlist();
    const productId = getProductId(product);

    if (isWishlisted) {
      const updatedWishlist = wishlist.filter((item) => getProductId(item) !== productId);
      localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
      setIsWishlisted(false);
      return;
    }

    wishlist.push({
      _id: product._id,
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      currency: product.currency,
    });
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    setIsWishlisted(true);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="h-12 w-12 rounded-full border-4 border-red-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-black uppercase">Product Not Found</h1>
          <Link
            href="/nike/products"
            className="text-sm font-black uppercase tracking-[0.24em] text-red-400 hover:text-white"
          >
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-hidden bg-black text-white">
      <EcomNavbar />

      <main className="relative pt-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_62%_18%,rgba(255,255,255,0.06),transparent_28%),linear-gradient(180deg,#0a0a0a_0%,#000000_68%,#000000_100%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <section className="relative mx-auto grid min-h-[calc(100vh-6rem)] max-w-7xl grid-cols-1 gap-10 px-6 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-16">
          <div className="relative">
            <Link
              href="/nike/products"
              className="mb-8 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.24em] text-white/50 transition hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to collection
            </Link>

            <div className="relative min-h-[430px] overflow-hidden rounded-[2rem] border border-white/10 bg-[#0a0a0a] px-6 py-10 shadow-2xl shadow-black/60 sm:min-h-[590px] sm:px-10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.08),transparent_50%)]" />
              <div className="absolute left-1/2 top-1/2 h-[70%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.03] blur-3xl" />

              <button
                type="button"
                onClick={toggleWishlist}
                aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                className="absolute right-5 top-5 z-20 grid h-12 w-12 place-items-center rounded-full border border-white/10 bg-white/5 text-white shadow-lg shadow-black/40 transition hover:border-white/20 hover:bg-white hover:text-black"
              >
                <Heart
                  className={`h-5 w-5 ${isWishlisted ? "fill-white text-white" : ""}`}
                />
              </button>

              {!product.in_stock && (
                <div className="absolute left-5 top-5 z-20 rounded-full bg-red-500 px-4 py-2 text-xs font-black uppercase text-white">
                  Sold Out
                </div>
              )}

              <div className="relative z-10 flex h-full min-h-[340px] items-center justify-center sm:min-h-[480px]">
                <div className="absolute left-1/2 top-1/2 h-[60%] w-[60%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.06] blur-3xl" />
                <img
                  src={productImage}
                  alt={product.name || "Product"}
                  loading="eager"
                  decoding="async"
                  className="relative z-10 max-h-[440px] w-full max-w-[760px] object-contain [filter:contrast(1.05)_saturate(1.05)_drop-shadow(0_30px_50px_rgba(0,0,0,0.6))] sm:max-h-[560px]"
                />
              </div>
            </div>

            {availableColors.length > 0 && (
              <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-white/[0.02] p-4 shadow-xl shadow-black/20">
                <p className="mb-4 text-[10px] font-black uppercase tracking-[0.24em] text-white/50">
                  Choose Color
                </p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {availableColors.map((color, index) => {
                    const isSelected = selectedColor === color;
                    const colorImage = color.image_url || product.image_url || fallbackProductImage;

                    return (
                      <button
                        key={`${color.name || "color"}-${index}`}
                        type="button"
                        onClick={() => handleColorChange(color)}
                        className={`group flex items-center gap-4 rounded-[1.25rem] border p-3 text-left transition ${
                          isSelected
                            ? "border-white bg-white text-black shadow-[0_16px_35px_rgba(255,255,255,0.15)]"
                            : "border-white/10 bg-white/[0.04] text-white/70 hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
                        }`}
                      >
                        <span
                          className={`grid h-16 w-20 shrink-0 place-items-center overflow-hidden rounded-2xl ${
                            isSelected ? "bg-black/10" : "bg-white/5"
                          }`}
                        >
                          <img
                            src={colorImage}
                            alt=""
                            loading="lazy"
                            decoding="async"
                            className="h-full w-full object-contain p-1.5"
                          />
                        </span>
                        <span className="min-w-0 text-sm font-black uppercase leading-tight">
                          {(color.name || `Color ${index + 1}`)
                            .split("/")
                            .map((part, partIndex) => (
                              <span key={`${part}-${partIndex}`} className="block">
                                {part}
                              </span>
                            ))}
                        </span>
                        {isSelected && (
                          <Check className="ml-auto h-5 w-5 shrink-0 text-black" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <aside className="relative">
            <div className="border-y border-white/10 py-8 lg:border-y-0 lg:border-l lg:py-0 lg:pl-10">
              <div className="mb-5 flex flex-wrap items-center gap-3 text-xs font-black uppercase tracking-[0.24em] text-white/50">
                <span>{selectedMeta}</span>
                {product.status === "active" && (
                  <span className="rounded-full bg-white px-3 py-1 text-[10px] text-black">
                    New Edit
                  </span>
                )}
              </div>

              <h1 className="max-w-2xl text-5xl font-black uppercase leading-[0.88] tracking-tight sm:text-6xl lg:text-7xl">
                {product.name || "Nike Product"}
              </h1>

              <div className="mt-6 flex flex-wrap items-end justify-between gap-5">
                <div>
                  <div className="text-4xl font-black text-white">
                    {formatPrice(product)}
                  </div>
                  {Number(product.reviews_count) > 0 && (
                    <p className="mt-2 text-sm text-white/40">
                      {product.reviews_count} verified reviews
                    </p>
                  )}
                </div>

                {Number(product.rating) > 0 && (
                  <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-3">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-black">{product.rating}</span>
                  </div>
                )}
              </div>

              <div className="mt-6 flex items-center gap-3">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    product.in_stock ? "bg-emerald-400" : "bg-red-500"
                  }`}
                />
                <span
                  className={`text-sm font-black uppercase ${
                    product.in_stock ? "text-emerald-300" : "text-red-400"
                  }`}
                >
                  {product.in_stock ? "In Stock" : "Out of Stock"}
                </span>
              </div>

              {!product.in_stock && isWishlisted && (
                <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-white/40">
                  <Check className="h-4 w-4 text-red-400" />
                  Added to wishlist. We will notify you when it is back in stock.
                </p>
              )}

              <p className="mt-7 max-w-xl text-base leading-8 text-white/60">
                {product.description ||
                  "Premium quality product designed for comfort, daily movement, and sharp athletic style."}
              </p>

              {availableSizes.length > 0 && (
                <div className="mt-9">
                  <div className="mb-3 flex items-center justify-between">
                    <h2 className="text-xs font-black uppercase tracking-[0.24em] text-white/50">
                      Select Size
                    </h2>
                    {selectedSize && (
                      <span className="text-xs font-bold uppercase text-red-400">
                        {selectedSize}
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-4 gap-3 sm:grid-cols-6">
                    {availableSizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`h-12 rounded-full border text-sm font-black uppercase transition ${
                          selectedSize === size
                            ? "border-white bg-white text-black"
                            : "border-white/10 bg-white/[0.04] text-gray-300 hover:border-white/20 hover:bg-white/[0.08]"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <div className="flex h-14 w-full items-center justify-between rounded-full border border-white/10 bg-white/[0.04] px-2 sm:w-40">
                  <button
                    type="button"
                    onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                    className="grid h-10 w-10 place-items-center rounded-full text-gray-400 transition hover:bg-white/10 hover:text-white"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="text-sm font-black">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((value) => Math.min(10, value + 1))}
                    className="grid h-10 w-10 place-items-center rounded-full text-gray-400 transition hover:bg-white/10 hover:text-white"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                {product.in_stock ? (
                  <Button
                    onClick={handleAddToCart}
                    disabled={availableSizes.length > 0 && !selectedSize}
                    className={`h-14 flex-1 rounded-full px-8 text-sm font-black uppercase tracking-[0.18em] text-white transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 ${
                      addedToCart
                        ? "bg-emerald-600 hover:bg-emerald-700"
                        : "bg-white text-black hover:bg-white/90"
                    }`}
                  >
                    {addedToCart ? (
                      <span className="flex items-center gap-2">
                        <Check className="h-5 w-5" />
                        Added
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <ShoppingCart className="h-5 w-5" />
                        Add to Cart
                      </span>
                    )}
                  </Button>
                ) : (
                  <Button
                    onClick={toggleWishlist}
                    className={`h-14 flex-1 rounded-full px-8 text-sm font-black uppercase tracking-[0.18em] transition active:scale-[0.99] ${
                      isWishlisted
                        ? "bg-white text-black hover:bg-white/90"
                        : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Heart className={`h-5 w-5 ${isWishlisted ? "fill-white" : ""}`} />
                      {isWishlisted ? "Wishlisted" : "Add to Wishlist"}
                    </span>
                  </Button>
                )}
              </div>

              <div className="mt-9 grid gap-3 text-sm text-white/60 sm:grid-cols-3">
                {[
                  { icon: Truck, label: "Fast delivery" },
                  { icon: ShieldCheck, label: "Secure checkout" },
                  { icon: RotateCcw, label: "Easy returns" },
                ].map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4"
                  >
                    <Icon className="h-5 w-5 text-white/70" />
                    <span className="font-bold">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </section>
      </main>

      <section className="relative border-y border-white/10 bg-zinc-950 py-12 [contain-intrinsic-size:320px] [content-visibility:auto]">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-black uppercase md:text-4xl">
              Complete the rotation.
            </h2>
            <p className="mt-3 max-w-2xl text-gray-400">
              Return to the collection to compare more silhouettes from your live catalog.
            </p>
          </div>
          <Link
            href="/nike/products"
            className="inline-flex items-center justify-center rounded-full bg-white px-7 py-4 text-sm font-black uppercase text-black transition hover:bg-red-500 hover:text-white"
          >
            Explore Collection
          </Link>
        </div>
      </section>

      <EcomFooter />
    </div>
  );
};

export default ProductDetailPage;
