"use client";

import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent, HTMLAttributes, ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  CheckCircle,
  CreditCard,
  Lock,
  Package,
  Shield,
  Smartphone,
} from "lucide-react";
import { useCart } from "@/app/context/CartContext";
import EcomFooter from "@/components/ecomfooter";
import EcomNavbar from "@/components/ecomnavbar";
import { Button } from "@/components/ui/button";

type FormData = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
  esewaId: string;
  bankAccountName: string;
  bankAccountNumber: string;
  bankName: string;
};

type PaymentMethod = "card" | "esewa" | "bank";

type CartItem = {
  cartItemId?: string;
  productId?: string;
  name: string;
  price: number;
  quantity: number;
  color?: string;
  size?: string;
  image?: string;
  currency?: string;
};

const initialFormData: FormData = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  zipCode: "",
  country: "",
  cardNumber: "",
  cardName: "",
  expiryDate: "",
  cvv: "",
  esewaId: "",
  bankAccountName: "",
  bankAccountNumber: "",
  bankName: "",
};

const inputClass =
  "h-[52px] w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm font-semibold text-white outline-none transition-colors placeholder:text-zinc-600 focus:border-white";

const labelClass = "text-xs font-black uppercase tracking-[0.18em] text-zinc-500";

const Field = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
  maxLength,
  autoComplete,
  inputMode,
}: {
  label: string;
  name: keyof FormData;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder: string;
  required?: boolean;
  maxLength?: number;
  autoComplete?: string;
  inputMode?: HTMLAttributes<HTMLInputElement>["inputMode"];
}) => (
  <div className="space-y-2">
    <label htmlFor={name} className={labelClass}>
      {label}
    </label>
    <input
      id={name}
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className={inputClass}
      placeholder={placeholder}
      required={required}
      maxLength={maxLength}
      autoComplete={autoComplete}
      inputMode={inputMode}
    />
  </div>
);

const SectionPanel = ({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) => (
  <section className="rounded-3xl border border-white/10 bg-zinc-950 p-5 shadow-xl shadow-black/30 md:p-7">
    <div className="mb-7 border-b border-white/10 pb-5">
      <h2 className="text-2xl font-black uppercase tracking-tight text-white">{title}</h2>
      <p className="mt-1 text-sm font-semibold text-zinc-500">{subtitle}</p>
    </div>
    {children}
  </section>
);

const PaymentDetailsPage = () => {
  const router = useRouter();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [orderPlaced, setOrderPlaced] = useState(false);

  const subtotal = getCartTotal();
  const shipping = 0;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;
  const typedCartItems = cartItems as CartItem[];

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!userStr || !token) {
      router.push("/login?redirect=/nike/payment-details");
      return;
    }

    try {
      const userData = JSON.parse(userStr);
      setFormData((prev) => ({
        ...prev,
        fullName: `${userData.firstName || ""} ${userData.lastName || ""}`.trim(),
        email: userData.email || prev.email,
      }));
    } catch (e) {
      console.error("Error parsing user data", e);
    }
  }, [router]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const requiredFields: Array<keyof FormData> = [
      "fullName",
      "email",
      "phone",
      "address",
      "city",
      "zipCode",
    ];

    if (paymentMethod === "card") {
      requiredFields.push("cardNumber", "cardName", "expiryDate", "cvv");
    } else if (paymentMethod === "esewa") {
      requiredFields.push("esewaId");
    } else {
      requiredFields.push("bankAccountName");
    }

    const emptyFields = requiredFields.filter((field) => !formData[field]);

    if (emptyFields.length > 0) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const userStr = localStorage.getItem("user");
      let userId = null;

      if (userStr) {
        try {
          const userData = JSON.parse(userStr);
          userId = userData._id || userData.id || null;
        } catch (e) {
          console.error("Error parsing user data", e);
        }
      }

      const orderData = {
        userId,
        customer: {
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
        },
        items: typedCartItems.map((item) => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          color: item.color || "",
          size: item.size || "",
          image: item.image || "",
        })),
        total,
        paymentStatus: "Paid",
        paymentMethod,
        shippingInfo: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
        },
      };

      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(orderData),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Order creation error:", errorText);
        throw new Error(`Failed to create order: ${errorText}`);
      }

      const createdOrder = await res.json();
      setOrderPlaced(true);

      fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          customerName: formData.fullName,
          orderId: createdOrder?.orderId,
          orderDate: createdOrder?.date,
          paymentMethod,
          subtotal,
          tax,
          shipping,
          discount: 0,
          totalAmount: total,
          items: typedCartItems,
        }),
      }).catch((err) => console.error("Error sending email:", err));
    } catch (error) {
      console.error("Checkout Error:", error);
      alert("Something went wrong with your order. Please try again.");
    }
  };

  if (cartItems.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen bg-black text-white">
        <EcomNavbar />
        <main className="flex min-h-screen items-center justify-center px-6 pt-20">
          <div className="max-w-md text-center">
            <div className="mx-auto mb-8 grid h-24 w-24 place-items-center rounded-full border border-white/10 bg-zinc-950">
              <Package className="h-11 w-11 text-zinc-600" />
            </div>
            <h1 className="text-4xl font-black uppercase tracking-tight">Cart Empty</h1>
            <p className="mt-3 text-sm font-semibold text-zinc-500">
              Add products to continue your checkout.
            </p>
            <Link href="/nike/products">
              <Button className="mt-8 h-12 rounded-full bg-white px-8 font-black uppercase tracking-widest text-black hover:bg-red-500 hover:text-white">
                Shop Now
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <EcomNavbar />

      <main className="px-4 pb-16 pt-28">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-9">
            <Link
              href="/nike/products"
              className="group mb-6 inline-flex items-center gap-2 text-sm font-black uppercase tracking-wider text-zinc-500 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Continue Shopping
            </Link>

            <div className="grid gap-6 border-b border-white/10 pb-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <p className="mb-3 text-xs font-black uppercase tracking-[0.32em] text-red-500">
                  Secure Nike Checkout
                </p>
                <h1 className="text-5xl font-black uppercase leading-none tracking-tight md:text-7xl">
                  Payment
                  <span className="block text-zinc-500">Details</span>
                </h1>
              </div>
              <div className="flex w-fit items-center gap-3 rounded-full border border-white/10 bg-zinc-950 px-5 py-3">
                <Shield className="h-5 w-5 text-emerald-400" />
                <span className="text-xs font-black uppercase tracking-widest text-zinc-400">
                  SSL Secured
                </span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-5">
            <div className="space-y-6 lg:col-span-3">
              <SectionPanel title="Delivery" subtitle="Where should we send your order?">
                <div className="grid gap-5 md:grid-cols-2">
                  <Field
                    label="Full Name *"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    required
                    autoComplete="name"
                  />
                  <Field
                    label="Email *"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="john@nike.com"
                    required
                    autoComplete="email"
                  />
                </div>

                <div className="mt-5 space-y-5">
                  <Field
                    label="Phone *"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter valid phone number with country code"
                    required
                    autoComplete="tel"
                    inputMode="tel"
                  />
                  <Field
                    label="Address *"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Tinkune"
                    required
                    autoComplete="street-address"
                  />
                </div>

                <div className="mt-5 grid grid-cols-2 gap-5 md:grid-cols-4">
                  <div className="col-span-2">
                    <Field
                      label="City *"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Kathmandu"
                      required
                      autoComplete="address-level2"
                    />
                  </div>
                  <Field
                    label="State"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="NY"
                    autoComplete="address-level1"
                  />
                  <Field
                    label="ZIP *"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    placeholder="45800"
                    required
                    autoComplete="postal-code"
                  />
                </div>

                <div className="mt-5">
                  <Field
                    label="Country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    placeholder="Nepal"
                    autoComplete="country-name"
                  />
                </div>
              </SectionPanel>

              <SectionPanel title="Payment" subtitle="Choose how you want to pay.">
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: "card" as const, label: "Card", Icon: CreditCard },
                    { id: "esewa" as const, label: "eSewa", Icon: Smartphone },
                    { id: "bank" as const, label: "Bank", Icon: Building2 },
                  ].map(({ id, label, Icon }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setPaymentMethod(id)}
                      className={`flex min-h-24 flex-col items-center justify-center gap-2 rounded-2xl border p-4 transition-colors ${
                        paymentMethod === id
                          ? "border-white bg-white text-black"
                          : "border-white/10 bg-black text-zinc-500 hover:border-white/40 hover:text-white"
                      }`}
                    >
                      <Icon className="h-6 w-6" />
                      <span className="text-xs font-black uppercase tracking-widest">{label}</span>
                    </button>
                  ))}
                </div>

                <div className="mt-7">
                  {paymentMethod === "card" && (
                    <div className="space-y-5">
                      <Field
                        label="Card Number *"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        required
                        autoComplete="cc-number"
                        inputMode="numeric"
                      />
                      <Field
                        label="Cardholder Name *"
                        name="cardName"
                        value={formData.cardName}
                        onChange={handleInputChange}
                        placeholder="JOHN DOE"
                        required
                        autoComplete="cc-name"
                      />
                      <div className="grid grid-cols-2 gap-5">
                        <Field
                          label="Expiry *"
                          name="expiryDate"
                          value={formData.expiryDate}
                          onChange={handleInputChange}
                          placeholder="MM/YY"
                          maxLength={5}
                          required
                          autoComplete="cc-exp"
                          inputMode="numeric"
                        />
                        <Field
                          label="CVV *"
                          name="cvv"
                          value={formData.cvv}
                          onChange={handleInputChange}
                          placeholder="123"
                          maxLength={4}
                          required
                          autoComplete="cc-csc"
                          inputMode="numeric"
                        />
                      </div>
                    </div>
                  )}

                  {paymentMethod === "esewa" && (
                    <div className="space-y-5">
                      <div className="rounded-2xl border border-[#60bb46]/30 bg-[#60bb46]/10 p-5">
                        <h3 className="font-black uppercase tracking-tight">eSewa Payment</h3>
                        <p className="mt-1 text-xs font-bold uppercase tracking-wider text-[#77d65a]">
                          Instant verification
                        </p>
                      </div>
                      <Field
                        label="eSewa ID *"
                        name="esewaId"
                        value={formData.esewaId}
                        onChange={handleInputChange}
                        placeholder="98XXXXXXXX"
                        maxLength={10}
                        required
                        inputMode="numeric"
                      />
                      <p className="text-xs font-semibold leading-6 text-zinc-500">
                        After placing the order, complete the transaction through the eSewa
                        gateway.
                      </p>
                    </div>
                  )}

                  {paymentMethod === "bank" && (
                    <div className="space-y-5">
                      <div className="rounded-2xl border border-blue-500/25 bg-blue-500/10 p-5">
                        <h3 className="font-black uppercase tracking-tight">Bank Transfer</h3>
                        <p className="mt-1 text-xs font-bold uppercase tracking-wider text-blue-400">
                          Manual verification
                        </p>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-black p-5">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div>
                            <p className={labelClass}>Bank Name</p>
                            <p className="mt-1 text-sm font-black">NIC ASIA Bank Ltd.</p>
                          </div>
                          <div>
                            <p className={labelClass}>Account Name</p>
                            <p className="mt-1 text-sm font-black">NIKE STORE NEPAL</p>
                          </div>
                        </div>
                        <div className="mt-4">
                          <p className={labelClass}>Account Number</p>
                          <p className="mt-1 text-lg font-black tracking-wider text-blue-400">
                            2945783910562001
                          </p>
                        </div>
                      </div>
                      <Field
                        label="Your Account Name *"
                        name="bankAccountName"
                        value={formData.bankAccountName}
                        onChange={handleInputChange}
                        placeholder="Your Name on Bank Account"
                        required
                      />
                      <p className="text-xs font-semibold leading-6 text-zinc-500">
                        Transfer the exact total amount. Your order will be processed
                        after receipt verification.
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-7 flex items-center gap-3 rounded-2xl border border-white/10 bg-black p-4 text-xs font-bold uppercase tracking-wider text-zinc-500">
                  <Lock className="h-4 w-4 shrink-0" />
                  256-bit SSL encryption
                </div>
              </SectionPanel>
            </div>

            <aside className="lg:col-span-2">
              <div className="sticky top-24 rounded-3xl border border-white/10 bg-zinc-950 p-5 shadow-xl shadow-black/30 md:p-7">
                <div className="mb-6 flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-black uppercase tracking-tight">
                      Order Summary
                    </h2>
                    <p className="mt-1 text-sm font-semibold text-zinc-500">
                      {typedCartItems.length} {typedCartItems.length === 1 ? "item" : "items"}
                    </p>
                  </div>
                  <div className="rounded-full border border-white/10 px-4 py-2 text-xs font-black uppercase text-zinc-400">
                    Free Ship
                  </div>
                </div>

                <div className="custom-scrollbar mb-6 max-h-[360px] space-y-4 overflow-y-auto pr-2">
                  {typedCartItems.map((item, index) => (
                    <div
                      key={item.cartItemId || `${item.productId}-${index}`}
                      className="flex gap-4 border-b border-white/10 pb-4 last:border-0"
                    >
                      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-black">
                        <img
                          src={item.image || "/assets/products.png"}
                          alt={item.name}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-contain"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-sm font-black uppercase tracking-tight">
                          {item.name}
                        </h3>
                        <p className="mt-1 text-xs font-semibold text-zinc-500">
                          {[item.color, item.size, `Qty ${item.quantity}`]
                            .filter(Boolean)
                            .join(" / ")}
                        </p>
                        <p className="mt-2 text-base font-black">
                          {item.currency || "$"}
                          {(Number(item.price) * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mb-6 space-y-4 rounded-2xl border border-white/10 bg-black p-5">
                  <div className="flex justify-between text-sm">
                    <span className="font-bold uppercase tracking-wider text-zinc-500">
                      Subtotal
                    </span>
                    <span className="font-black">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-bold uppercase tracking-wider text-zinc-500">
                      Shipping
                    </span>
                    <span className="font-black text-emerald-400">FREE</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-bold uppercase tracking-wider text-zinc-500">Tax</span>
                    <span className="font-black">${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-white/10 pt-4">
                    <div className="flex items-end justify-between">
                      <span className="font-black uppercase tracking-wider">Total</span>
                      <span className="text-4xl font-black">${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="h-16 w-full rounded-full bg-white text-sm font-black uppercase tracking-[0.2em] text-black transition-transform hover:scale-[1.01] hover:bg-red-500 hover:text-white active:scale-[0.99]"
                >
                  Place Order
                </Button>

                <p className="mt-5 text-center text-xs font-bold uppercase tracking-wider text-zinc-600">
                  Secure checkout powered by Nike
                </p>
              </div>
            </aside>
          </form>
        </div>
      </main>

      <EcomFooter />

      {orderPlaced && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4">
          <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 p-8 text-center shadow-2xl shadow-black md:p-12">
            <div className="mx-auto mb-8 grid h-24 w-24 place-items-center rounded-full bg-red-500 shadow-xl shadow-red-500/20">
              <CheckCircle className="h-12 w-12 text-white" strokeWidth={3} />
            </div>

            <h2 className="text-5xl font-black uppercase italic leading-none tracking-tight">
              Just
              <br />
              <span className="text-red-500">Done It.</span>
            </h2>

            <p className="mt-4 text-sm font-bold uppercase tracking-widest text-zinc-500">
              Order received successfully
            </p>

            <div className="my-9 rounded-2xl border border-white/10 bg-black p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-widest text-zinc-500">
                  Amount Paid
                </span>
                <span className="text-3xl font-black">${total.toFixed(2)}</span>
              </div>
            </div>

            <Button
              onClick={() => {
                clearCart();
                router.push("/nike/products");
              }}
              className="h-14 w-full rounded-full bg-white text-sm font-black uppercase tracking-[0.2em] text-black hover:bg-red-500 hover:text-white"
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      )}

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
    </div>
  );
};

export default PaymentDetailsPage;
