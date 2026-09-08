"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    CheckCircle,
    Clock,
    RotateCcw,
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
}

const ExchangesPage = () => {
    const [user, setUser] = useState<any>(null);
    const [exchanges, setExchanges] = useState<Exchange[]>([]);
    const [loading, setLoading] = useState(true);
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
                        <Link href="/nike/profile">
                            <button className="mt-7 rounded-full bg-white px-8 py-3 text-sm font-black uppercase text-black transition-colors hover:bg-red-500 hover:text-white">
                                Go to Profile
                            </button>
                        </Link>
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
                                        <div className="space-y-1">
                                            {exc.requestedItems?.map((item: any, idx: number) => (
                                                <p key={idx} className="text-xs text-zinc-400">
                                                    {item.quantity}x {item.name || "Product"}
                                                    {item.color ? ` (${item.color}` : ""}
                                                    {item.size ? ` / ${item.size}` : ""}
                                                    {item.color ? ")" : ""}
                                                </p>
                                            ))}
                                        </div>
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
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <EcomFooter />
        </div>
    );
};

export default ExchangesPage;
