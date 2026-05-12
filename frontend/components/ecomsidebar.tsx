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
          className="fixed inset-0 z-40 bg-black/72 transition-opacity"
          onClick={() => setIsCartOpen(false)}
        />
      ) : null}

      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-[460px] flex-col border-l border-white/10 bg-[#0a0a0a] text-white shadow-[0_20px_90px_rgba(0,0,0,0.55)] transition-transform duration-300 ease-out ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="border-b border-white/10 px-5 pb-4 pt-5 sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-end gap-3">
                <h2 className="text-2xl font-black uppercase tracking-tight text-white sm:text-3xl">
                  Cart
                </h2>
                <span className="pb-0.5 text-xs font-black uppercase tracking-[0.16em] text-white/45">
                  {getCartCount()} item{getCartCount() === 1 ? "" : "s"}
                </span>
              </div>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-white/36">
                Quick bag review
              </p>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/65 transition-colors hover:border-white/20 hover:bg-white hover:text-black"
              aria-label="Close cart"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4 sm:px-6">
          {cartItems.length === 0 ? (
            <div className="flex min-h-full flex-col items-center justify-center rounded-[28px] border border-dashed border-white/10 bg-white/[0.025] px-8 py-12 text-center">
              <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-white/[0.04]">
                <ShoppingBag className="h-10 w-10 text-white/22" />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tight text-white">Your Cart Is Empty</h3>
              <p className="mt-3 max-w-xs text-sm font-medium leading-6 text-white/42">
                Add a few pieces and your Nike checkout summary will show up here.
              </p>
              {cartMessage ? (
                <p className="mt-5 text-xs font-black uppercase tracking-[0.16em] text-lime-300">{cartMessage}</p>
              ) : null}
            </div>
          ) : (
            <div className="space-y-3">
              {cartItems.map((item) => (
                <article
                  key={item.cartItemId}
                  className="rounded-[22px] border border-white/10 bg-white/[0.03] p-3 transition-colors hover:border-white/20"
                >
                  <div className="flex gap-4">
                    <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-[#151515] sm:h-32 sm:w-32">
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
                          <h3 className="truncate text-lg font-black text-white">{item.name}</h3>
                          <div className="mt-2 flex flex-wrap gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-white/42">
                            {item.color ? <span>{item.color}</span> : null}
                            {item.size ? <span>Size {item.size}</span> : null}
                          </div>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.cartItemId)}
                          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-red-400/20 bg-red-500/10 text-red-300 transition-colors hover:bg-red-500 hover:text-white"
                          title="Remove item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="mt-5 flex items-end justify-between gap-3">
                        <div className="inline-flex items-center rounded-full border border-white/10 bg-black px-1.5 py-1">
                          <button
                            onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-white/75 transition-colors hover:bg-white/[0.08] hover:text-white"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="min-w-[34px] text-center text-sm font-black text-white">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-white/75 transition-colors hover:bg-white/[0.08] hover:text-white"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <div className="text-right">
                          <p className="text-xl font-black text-white">
                            {formatMoney(item.currency, item.price * item.quantity)}
                          </p>
                          {item.quantity > 1 ? (
                            <p className="text-xs font-semibold text-white/38">
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

        <div className="border-t border-white/10 bg-[#090909] px-5 pb-5 pt-4 sm:px-6">
          {cartMessage ? (
            <p className="mb-3 text-center text-[11px] font-black uppercase tracking-[0.16em] text-lime-300">
              {cartMessage}
            </p>
          ) : null}

          {cartItems.length > 0 ? (
            <>
              <div className="mb-4 rounded-[20px] border border-white/10 bg-white/[0.03] p-4">
                <div className="flex items-end justify-between gap-4">
                  <span className="text-xs font-black uppercase tracking-[0.16em] text-white/48">Total</span>
                  <span className="text-3xl font-black tracking-tight text-white">
                    {formatMoney(currency, subtotal)}
                  </span>
                </div>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-white/34">
                  Free shipping included
                </p>
              </div>

              <Button
                onClick={handleCheckout}
                className="h-14 w-full rounded-full bg-white text-sm font-black uppercase tracking-[0.18em] text-black transition-colors hover:bg-lime-300"
              >
                Proceed To Checkout
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
    </>
  );
};

export default CartSidebar;
