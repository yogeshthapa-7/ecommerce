"use client";

import { useState } from "react";
import { useCart } from "@/app/context/CartContext";
import { X, Plus, Minus, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const formatMoney = (currency: string | undefined, value: number) =>
  `${currency || "$"}${value.toFixed(2)}`;

const CartSidebar = () => {
  const router = useRouter();
  const [cartMessage, setCartMessage] = useState("");
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    getCartTotal,
    getCartCount,
  } = useCart();

  const subtotal = getCartTotal();
  const currency = cartItems[0]?.currency || "$";

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      setCartMessage("Your cart is empty.");
      return;
    }

    setCartMessage("");
    setIsCartOpen(false);
    router.push("/nike/payment-details");
  };

  return (
    <>
      {isCartOpen ? (
        <div
          className="fixed inset-0 z-40 bg-black/80 transition-opacity"
          onClick={() => setIsCartOpen(false)}
        />
      ) : null}

      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-[420px] flex-col border-l border-white/10 bg-[#050505] text-white shadow-2xl shadow-black/60 transition-transform duration-300 ease-out ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="border-b border-white/10 px-5 pb-5 pt-6 sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-black uppercase tracking-tight text-white">
                Your Cart
              </h2>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-white/40">
                {getCartCount()} item{getCartCount() === 1 ? "" : "s"} — review before checkout
              </p>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/60 transition-colors hover:border-white/20 hover:bg-white hover:text-black"
              aria-label="Close cart"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-5 py-5 sm:px-6">
          {cartItems.length === 0 ? (
            <div className="flex min-h-full flex-col items-center justify-center rounded-[28px] border border-dashed border-white/10 bg-white/[0.02] px-8 py-14 text-center">
              <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-white/[0.04]">
                <ShoppingBag className="h-9 w-9 text-white/20" />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight text-white">
                Your Cart Is Empty
              </h3>
              <p className="mt-3 max-w-xs text-sm font-medium leading-6 text-white/40">
                Add a few pieces and your checkout summary will show up here.
              </p>
              {cartMessage ? (
                <p className="mt-5 text-xs font-black uppercase tracking-[0.16em] text-lime-300">
                  {cartMessage}
                </p>
              ) : null}
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <article
                  key={item.cartItemId}
                  className="group rounded-[22px] border border-white/[0.08] bg-white/[0.02] p-3 transition-colors hover:border-white/20"
                >
                  <div className="flex gap-4">
                    <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a]">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-contain p-2"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="truncate text-[15px] font-black text-white">
                            {item.name}
                          </h3>
                          <div className="mt-2 flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-white/38">
                            {item.color ? <span>{item.color}</span> : null}
                            {item.size ? <span>Size {item.size}</span> : null}
                          </div>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.cartItemId)}
                          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/50 transition-colors hover:border-red-400/40 hover:bg-red-500 hover:text-white"
                          title="Remove item"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <div className="mt-5 flex items-end justify-between gap-3">
                        <div className="inline-flex items-center rounded-full border border-white/10 bg-black">
                          <button
                            onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/[0.08] hover:text-white"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="min-w-[32px] text-center text-sm font-black text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/[0.08] hover:text-white"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <div className="text-right">
                          <p className="text-lg font-black text-white">
                            {formatMoney(item.currency, item.price * item.quantity)}
                          </p>
                          {item.quantity > 1 ? (
                            <p className="text-[11px] font-semibold text-white/35">
                              {formatMoney(item.currency, item.price)} each
                            </p>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-white/10 bg-[#020202] px-5 pb-6 pt-4 sm:px-6">
          {cartMessage ? (
            <p className="mb-3 text-center text-[11px] font-black uppercase tracking-[0.16em] text-lime-300">
              {cartMessage}
            </p>
          ) : null}

          {cartItems.length > 0 ? (
            <>
              <div className="mb-5 rounded-[20px] border border-white/10 bg-white/[0.02] p-5">
                <div className="flex items-end justify-between gap-4">
                  <span className="text-[11px] font-black uppercase tracking-[0.16em] text-white/50">
                    Subtotal
                  </span>
                  <span className="text-3xl font-black tracking-tight text-white">
                    {formatMoney(currency, subtotal)}
                  </span>
                </div>
                <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/30">
                  Shipping and taxes calculated at checkout
                </p>
              </div>

              <Button
                onClick={handleCheckout}
                className="h-14 w-full rounded-full bg-white text-sm font-black uppercase tracking-[0.18em] text-black transition-colors hover:bg-lime-300"
              >
                Checkout
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </>
          ) : (
            <Button
              onClick={() => setIsCartOpen(false)}
              className="h-14 w-full rounded-full bg-white text-sm font-black uppercase tracking-[0.18em] text-black transition-colors hover:bg-lime-300"
            >
              Continue Shopping
            </Button>
          )}
        </div>
      </aside>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: #000;
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #333;
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
    </>
  );
};

export default CartSidebar;
