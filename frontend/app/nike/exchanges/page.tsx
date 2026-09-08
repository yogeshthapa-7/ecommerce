"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    CheckCircle,
    Clock,
    Package,
    RotateCcw,
    Search,
    XCircle,
} from "lucide-react";
import EcomFooter from "@/components/ecomfooter";
import EcomNavbar from "@/components/ecomnavbar";

const panelClass = "rounded-3xl border border-white/10 bg-zinc-950 p-5 shadow-xl shadow-black/30 md:p-6";
const labelClass = "text-xs font-black uppercase tracking-[0.18em] text-zinc-500";

interface Exchange {
    _id: string;
    exchangeId: string;
    orderId: { orderId?: string; _id?: string } | string;
    customerName: string;
    customerEmail: string;
    originalItems: any[];
    requestedItems: any[];
    reason: string;
    description: string;
    priceDifference: number;
    status: string;
    resolution: string;
    resolvedAt: string;
    allRequestedItemsAvailable?: boolean;
    unavailableRequestedItems?: any[];
}

const ExchangesPage = () => {
    const [user, setUser] = useState<any>(null);
    const [exchanges, setExchanges] = useState<Exchange[]>([]);
    const [loading, setLoading] = useState(true);
    const [pickerExchangeId, setPickerExchangeId] = useState<string | null>(null);
    const [pickerProducts, setPickerProducts] = useState<any[]>([]);
    const [selectedReplacement, setSelectedReplacement] = useState<any>(null);
    const [pickerSearchQuery, setPickerSearchQuery] = useState("");
    const [pickerLoading, setPickerLoading] = useState(false);
    const [submittingReplacement, setSubmittingReplacement] = useState(false);
    const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);
    const router = useRouter();

    useEffect(() => {
        const userStr = localStorage.getItem("user");
        if (!userStr) {
            router.push("/login");
            return;
        }
        try {
            const userData = JSON.parse(userStr);
            setUser(userData);
            fetchExchanges(userData._id || userData.id);
        } catch (e) {
            router.push("/login");
        }
    }, [router]);

    const fetchExchanges = async (userId: string) => {
        if (!userId) {
            setLoading(false);
            return;
        }

        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/exchanges/user/${userId}`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });
            if (res.ok) {
                const data = await res.json();
                setExchanges(data);
            }
        } catch (error) {
            console.error("Error fetching exchanges:", error);
        } finally {
            setLoading(false);
        }
    };

    const openPicker = (exchangeId: string) => {
        setPickerExchangeId(exchangeId);
        setPickerProducts([]);
        setSelectedReplacement(null);
        setPickerSearchQuery("");
    };

    const closePicker = () => {
        setPickerExchangeId(null);
        setPickerProducts([]);
        setSelectedReplacement(null);
        setPickerSearchQuery("");
    };

    const fetchPickerProducts = async (query: string) => {
        setPickerLoading(true);
        try {
            let apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
            if (apiBaseUrl.endsWith("/api")) {
                apiBaseUrl = apiBaseUrl.slice(0, -4);
            }
            const url = query
                ? `${apiBaseUrl}/api/products/search?q=${encodeURIComponent(query)}&inStock=true`
                : `${apiBaseUrl}/api/products?showAll=true&limit=20`;
            const res = await fetch(url);
            if (res.ok) {
                const data = await res.json();
                setPickerProducts(data.products || data || []);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setPickerLoading(false);
        }
    };

    const submitReplacement = async () => {
        if (!pickerExchangeId || !selectedReplacement) return;
        setSubmittingReplacement(true);

        try {
            const token = localStorage.getItem("token");
            const exchange = exchanges.find((e) => e._id === pickerExchangeId);
            if (!exchange) return;

            const originalQty = exchange.originalItems[0]?.quantity || 1;
            const requestedItems = [
                {
                    productId: selectedReplacement._id || selectedReplacement.id,
                    name: selectedReplacement.name,
                    price: Number(selectedReplacement.price || 0),
                    quantity: originalQty,
                    color: selectedReplacement.colors?.[0]?.name || exchange.originalItems[0]?.color || "",
                    size: selectedReplacement.sizes?.[0] || exchange.originalItems[0]?.size || "",
                    image: selectedReplacement.image_url || exchange.originalItems[0]?.image || "",
                },
            ];

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/exchanges/${pickerExchangeId}/request-items`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({ requestedItems }),
            });

            if (res.ok) {
                const updated = await res.json();
                setExchanges((prev) => prev.map((e) => (e._id === pickerExchangeId ? updated : e)));
                closePicker();
                setNotification({ message: "Replacement item selected successfully", type: "success" });
            } else {
                const err = await res.json();
                setNotification({ message: err.message || "Failed to select replacement", type: "error" });
            }
        } catch (error) {
            console.error("Error submitting replacement:", error);
            setNotification({ message: "Something went wrong", type: "error" });
        } finally {
            setSubmittingReplacement(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Approved":
                return "border-emerald-400/30 bg-emerald-400/10 text-emerald-300";
            case "Rejected":
                return "border-red-400/30 bg-red-400/10 text-red-300";
            case "Completed":
                return "border-blue-400/30 bg-blue-400/10 text-blue-300";
            case "Cancelled":
                return "border-red-500/30 bg-red-500/10 text-red-300";
            default:
                return "border-amber-300/30 bg-amber-300/10 text-amber-200";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "Approved":
                return <CheckCircle className="h-4 w-4" />;
            case "Rejected":
                return <XCircle className="h-4 w-4" />;
            case "Completed":
                return <CheckCircle className="h-4 w-4" />;
            case "Cancelled":
                return <XCircle className="h-4 w-4" />;
            default:
                return <Clock className="h-4 w-4" />;
        }
    };

    const getOrderId = (orderId: any) => {
        if (!orderId) return "—";
        if (typeof orderId === "object") return orderId.orderId || orderId._id || "—";
        return orderId;
    };

    return (
        <div className="min-h-screen bg-black text-white">
            <EcomNavbar />

            <section className="border-b border-white/10 bg-[linear-gradient(120deg,#09090b_0%,#000_52%,rgba(239,68,68,0.16)_100%)] pt-28">
                <div className="mx-auto max-w-7xl px-6 py-12">
                    <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
                        <div>
                            <p className="mb-3 text-xs font-black uppercase tracking-[0.32em] text-red-500">
                                Nike Member
                            </p>
                            <h1 className="text-5xl font-black uppercase leading-none tracking-tight md:text-7xl">
                                My
                                <span className="block text-zinc-500">Exchanges</span>
                            </h1>
                            <p className="mt-5 max-w-2xl text-sm font-semibold leading-7 text-zinc-400 md:text-base">
                                Track and manage your exchange requests. Exchanges are only available for orders that have been successfully delivered.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <main className="mx-auto max-w-7xl px-6 py-8">
                <div className="mb-6">
                    <Link
                        href="/nike/profile"
                        className="inline-flex items-center gap-2 text-sm font-black uppercase text-zinc-500 transition-colors hover:text-white"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Profile
                    </Link>
                </div>

                <div className={`${panelClass} mb-6 flex items-center justify-between`}>
                    <div>
                        <p className={labelClass}>Account Section</p>
                        <h2 className="mt-1 text-3xl font-black uppercase tracking-tight text-white">
                            Exchanges
                        </h2>
                    </div>
                    <RotateCcw className="hidden h-8 w-8 text-zinc-700 sm:block" />
                </div>

                {loading ? (
                    <div className="flex justify-center py-16">
                        <div className="h-12 w-12 animate-spin rounded-full border-4 border-red-500 border-t-transparent" />
                    </div>
                ) : exchanges.length === 0 ? (
                    <div className={`${panelClass} py-16 text-center`}>
                        <div className="mx-auto mb-5 grid h-20 w-20 place-items-center rounded-full border border-white/10 bg-black">
                            <RotateCcw className="h-10 w-10 text-zinc-600" />
                        </div>
                        <p className="text-xl font-black uppercase text-white">No exchanges yet</p>
                        <p className="mt-2 text-sm text-zinc-500">
                            Once you receive a delivered order, you can request an exchange from the Orders tab in your profile.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {exchanges.map((exc) => (
                            <div
                                key={exc._id}
                                className="rounded-2xl border border-white/10 bg-zinc-950 px-5 py-4"
                            >
                                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm font-black uppercase text-white">
                                            {exc.status === "Approved"
                                                ? "Exchange Approved"
                                                : exc.status === "Rejected"
                                                    ? "Exchange Rejected"
                                                    : exc.status === "Requested"
                                                        ? "Exchange Requested"
                                                        : exc.status === "Completed"
                                                            ? "Exchange Completed"
                                                            : exc.status === "Cancelled"
                                                                ? "Exchange Cancelled"
                                                                : exc.exchangeId || exc._id}
                                        </p>
                                        <p className="text-xs text-zinc-500">
                                            Order: {getOrderId(exc.orderId)}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span
                                            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-black uppercase ${getStatusColor(
                                                exc.status
                                            )}`}
                                        >
                                            {getStatusIcon(exc.status)}
                                            {exc.status}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <p className="text-xs font-black uppercase tracking-wider text-zinc-400 mb-2">
                                            Original Items
                                        </p>
                                        <div className="space-y-1">
                                            {exc.originalItems?.map((item: any, idx: number) => (
                                                <p key={idx} className="text-xs text-zinc-400">
                                                    {item.quantity}x {item.name || "Product"}
                                                    {item.color ? ` (${item.color}` : ""}
                                                    {item.size ? ` / ${item.size}` : ""}
                                                    {item.color ? ")" : ""}
                                                </p>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-xs font-black uppercase tracking-wider text-zinc-400 mb-2">
                                            Requested Items
                                        </p>
                                        {exc.requestedItems && exc.requestedItems.length > 0 ? (
                                            <div className="space-y-1">
                                                {exc.requestedItems.map((item: any, idx: number) => (
                                                    <p key={idx} className="text-xs text-zinc-400">
                                                        {item.quantity}x {item.name || "Product"}
                                                        {item.color ? ` (${item.color}` : ""}
                                                        {item.size ? ` / ${item.size}` : ""}
                                                        {item.color ? ")" : ""}
                                                    </p>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="rounded-xl border border-blue-400/20 bg-blue-400/5 px-3 py-2">
                                                <p className="text-xs text-blue-300">
                                                    Awaiting your selection. Choose a replacement product below.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-3 flex flex-col gap-1">
                                    <p className="text-xs text-zinc-500">
                                        Price Difference: <span className="font-bold text-white">${Number(exc.priceDifference || 0).toFixed(2)}</span>
                                    </p>
                                    <p className="text-xs text-zinc-500">
                                        Reason: {exc.reason || "—"}
                                    </p>
                                    {exc.description && (
                                        <p className="text-xs text-zinc-400">
                                            {exc.description}
                                        </p>
                                    )}
                                    {exc.resolution && (
                                        <p className="text-xs text-zinc-400">
                                            Resolution: {exc.resolution}
                                        </p>
                                    )}
                                </div>

                                {exc.status === "Approved" && (
                                    <div className="mt-4 rounded-2xl border border-blue-400/20 bg-blue-400/5 p-4">
                                        <p className="text-xs font-black uppercase tracking-wider text-blue-300 mb-3">
                                            Select Your Replacement
                                        </p>
                                        {selectedReplacement && pickerExchangeId === exc._id ? (
                                            <div className="flex items-center justify-between rounded-xl border border-white/10 bg-black px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-zinc-900">
                                                        {selectedReplacement.image_url ? (
                                                            <img
                                                                src={selectedReplacement.image_url}
                                                                alt={selectedReplacement.name}
                                                                className="h-full w-full object-contain"
                                                            />
                                                        ) : (
                                                            <div className="grid h-full w-full place-items-center">
                                                                <Package className="h-5 w-5 text-zinc-700" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black uppercase text-white">{selectedReplacement.name}</p>
                                                        <p className="text-xs text-emerald-300">
                                                            ${Number(selectedReplacement.price || 0).toFixed(2)}
                                                        </p>
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setPickerExchangeId(null);
                                                        setSelectedReplacement(null);
                                                        setPickerProducts([]);
                                                        setPickerSearchQuery("");
                                                    }}
                                                    className="text-xs font-black uppercase text-red-400 transition-colors hover:text-red-300"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => openPicker(exc._id)}
                                                className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-blue-300 transition-colors hover:bg-blue-400/20"
                                            >
                                                Choose Replacement Product
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Product Picker Modal */}
            {pickerExchangeId && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/85 p-4">
                    <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 shadow-2xl shadow-black/60">
                        <div className="border-b border-white/10 px-6 py-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-black uppercase text-white">Select Replacement</h3>
                                    <p className="text-xs font-semibold text-zinc-500">
                                        Choose a product to exchange for
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={closePicker}
                                    className="text-xs font-black uppercase text-zinc-500 transition-colors hover:text-white"
                                >
                                    Close
                                </button>
                            </div>
                        </div>

                        <div className="px-6 py-5 space-y-4">
                            <div>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                                    <input
                                        type="text"
                                        value={pickerSearchQuery}
                                        onChange={(e) => setPickerSearchQuery(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                fetchPickerProducts(pickerSearchQuery);
                                            }
                                        }}
                                        placeholder="Search products..."
                                        className="w-full rounded-xl border border-white/10 bg-black pl-9 pr-4 py-3 text-sm font-medium text-white outline-none transition-colors placeholder:text-white/25 focus:border-white/40"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => fetchPickerProducts(pickerSearchQuery)}
                                    disabled={pickerLoading}
                                    className="mt-2 w-full rounded-full bg-white px-4 py-2 text-xs font-black uppercase text-black transition-colors hover:bg-lime-300 disabled:opacity-50"
                                >
                                    {pickerLoading ? "Searching..." : "Search Products"}
                                </button>
                            </div>

                            <div className="max-h-64 space-y-2 overflow-y-auto">
                                {pickerProducts.length === 0 && !pickerLoading ? (
                                    <p className="py-4 text-center text-xs text-zinc-500">
                                        Search for a product to select as replacement.
                                    </p>
                                ) : (
                                    pickerProducts.map((product: any) => (
                                        <button
                                            key={product._id || product.id}
                                            type="button"
                                            onClick={() => setSelectedReplacement(product)}
                                            className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2 text-left transition-colors ${
                                                selectedReplacement?._id === product._id || selectedReplacement?.id === product.id
                                                    ? "border-white bg-white text-black"
                                                    : "border-white/10 bg-black text-zinc-300 hover:border-white/20"
                                            }`}
                                        >
                                            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-zinc-900">
                                                {product.image_url ? (
                                                    <img
                                                        src={product.image_url}
                                                        alt={product.name}
                                                        className="h-full w-full object-contain"
                                                        loading="lazy"
                                                    />
                                                ) : (
                                                    <div className="grid h-full w-full place-items-center">
                                                        <Package className="h-5 w-5 text-zinc-700" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-black uppercase text-white">{product.name}</p>
                                                <p className="text-xs text-zinc-500">
                                                    {product.in_stock === false ? (
                                                        <span className="text-red-400">Out of stock</span>
                                                    ) : (
                                                        <span className="text-emerald-300">In stock</span>
                                                    )}
                                                </p>
                                            </div>
                                            <p className="text-sm font-black text-white">
                                                ${Number(product.price || 0).toFixed(2)}
                                            </p>
                                        </button>
                                    ))
                                )}
                            </div>

                            {selectedReplacement && (() => {
                                const exchange = exchanges.find((e) => e._id === pickerExchangeId);
                                if (!exchange) return null;
                                const originalQty = exchange.originalItems[0]?.quantity || 1;
                                const originalTotal = exchange.originalItems.reduce(
                                    (sum, item) => sum + Number(item.price) * Number(item.quantity),
                                    0,
                                );
                                const replacementTotal = Number(selectedReplacement.price || 0) * originalQty;
                                const diff = replacementTotal - originalTotal;
                                return (
                                    <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-4">
                                        <p className="text-xs font-black uppercase tracking-wider text-emerald-300 mb-2">
                                            Price Difference Preview
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-semibold text-zinc-300">
                                                {diff > 0 ? "You pay" : diff < 0 ? "You receive" : "No difference"}
                                            </span>
                                            <span className={`text-lg font-black ${diff > 0 ? "text-red-300" : diff < 0 ? "text-emerald-300" : "text-white"}`}>
                                                {diff > 0 ? "+" : ""}${diff.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })()}
                        </div>

                        <div className="flex items-center justify-end gap-3 border-t border-white/10 px-6 py-4">
                            <button
                                type="button"
                                onClick={closePicker}
                                className="h-11 rounded-full border border-white/10 px-5 text-sm font-black uppercase text-zinc-300 transition-colors hover:border-white/20 hover:text-white"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={submitReplacement}
                                disabled={!selectedReplacement || submittingReplacement}
                                className="h-11 rounded-full bg-blue-500 px-5 text-sm font-black uppercase text-white transition-colors hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {submittingReplacement ? "Submitting..." : "Confirm Replacement"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Notification */}
            {notification && (
                <div className="fixed inset-0 z-[130] flex items-center justify-center bg-black/80 p-4">
                    <div className="w-full max-w-sm overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 shadow-2xl shadow-black/60">
                        <div className={`border-b border-white/10 px-6 py-5 ${notification.type === "success" ? "bg-emerald-500/10" : "bg-red-500/10"}`}>
                            <div className="flex items-center gap-3">
                                <div
                                    className={`grid h-10 w-10 place-items-center rounded-full border ${
                                        notification.type === "success"
                                            ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
                                            : "border-red-400/30 bg-red-400/10 text-red-300"
                                    }`}
                                >
                                    {notification.type === "success" ? (
                                        <CheckCircle className="h-5 w-5" />
                                    ) : (
                                        <XCircle className="h-5 w-5" />
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-lg font-black uppercase text-white">
                                        {notification.type === "success" ? "Success" : "Error"}
                                    </h3>
                                    <p className="text-xs font-semibold text-zinc-500">{notification.message}</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-end gap-3 border-t border-white/10 px-6 py-4">
                            <button
                                onClick={() => setNotification(null)}
                                className={`h-11 rounded-full px-5 text-sm font-black uppercase transition-colors ${
                                    notification.type === "success"
                                        ? "border border-white/10 bg-white text-black hover:bg-emerald-400"
                                        : "border border-white/10 bg-white text-black hover:bg-red-500 hover:text-white"
                                }`}
                            >
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <EcomFooter />
        </div>
    );
};

export default ExchangesPage;
