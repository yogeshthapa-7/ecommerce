"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import EcomNavbar from "@/components/ecomnavbar";
import EcomFooter from "@/components/ecomfooter";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

const STATUSES = ["Processing", "Shipped", "Delivered"] as const;

type Status = typeof STATUSES[number];

type CancelAction = "accepted" | "rejected";

const TestEmailPage = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [previewHtml, setPreviewHtml] = useState<string>("");
    const [subject, setSubject] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [cancelAction, setCancelAction] = useState<CancelAction | null>(null);
    const [cancelPreviewHtml, setCancelPreviewHtml] = useState<string>("");
    const [cancelSubject, setCancelSubject] = useState<string>("");
    const [log, setLog] = useState<string[]>([]);
    const [countdown, setCountdown] = useState(5);
    const countdownRef = useRef<NodeJS.Timeout | null>(null);

    const currentStatus = STATUSES[currentIndex];

    const addLog = useCallback((message: string) => {
        const timestamp = new Date().toLocaleTimeString();
        setLog((prev) => [`[${timestamp}] ${message}`, ...prev].slice(0, 20));
    }, []);

    const fetchPreview = useCallback(async (status: Status) => {
        setLoading(true);
        try {
            const res = await fetch("/api/preview-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            });
            const data = await res.json();
            if (data.success) {
                setPreviewHtml(data.html);
                setSubject(data.subject);
                addLog(`Loaded preview for: ${status}`);
            } else {
                addLog(`Preview failed: ${data.error}`);
            }
        } catch (err) {
            addLog(`Preview error: ${err instanceof Error ? err.message : "Unknown error"}`);
        } finally {
            setLoading(false);
        }
    }, [addLog]);

    useEffect(() => {
        fetchPreview(currentStatus);
        setCancelAction(null);
    }, [currentStatus, fetchPreview]);

    useEffect(() => {
        if (!cancelAction) return;
        setLoading(true);
        fetch("/api/preview-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                status: "Cancelled",
                cancelReason: cancelAction === "accepted" ? "Customer request accepted" : "Customer request rejected",
                refundAmount: cancelAction === "accepted" ? 150 : 0,
                refundMethod: cancelAction === "accepted" ? "Original payment method" : "N/A",
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setCancelPreviewHtml(data.html);
                    setCancelSubject(data.subject);
                }
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [cancelAction]);

    useEffect(() => {
        countdownRef.current = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    setCurrentIndex((idx) => (idx + 1) % STATUSES.length);
                    return 5;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            if (countdownRef.current) clearInterval(countdownRef.current);
        };
    }, []);

    const handleSend = useCallback(async () => {
        if (sending) return;
        setSending(true);
        addLog(`Sending ${currentStatus} email...`);
        try {
            const res = await fetch("/api/send-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: "yogsthapa@gmail.com",
                    customerName: "Test User",
                    orderId: `NX-TEST-${Date.now()}`,
                    status: currentStatus,
                    items: [
                        { name: "Nike Air Max", price: 150, quantity: 1, size: "US 10", color: "Black/White", currency: "$" }
                    ],
                    trackingNumber: currentStatus === "Shipped" ? "TRK" + Math.floor(Math.random() * 1000000000) : undefined,
                    carrier: currentStatus === "Shipped" ? "DHL" : undefined,
                    estimatedDelivery: currentStatus === "Shipped" ? "2026-09-18" : undefined,
                    cancelReason: currentStatus === "Cancelled" ? "Item out of stock" : undefined,
                    refundAmount: currentStatus === "Cancelled" ? 150 : undefined,
                    refundMethod: currentStatus === "Cancelled" ? "Original payment method" : undefined,
                }),
            });
            const data = await res.json();
            if (data.success) {
                addLog(`✓ ${currentStatus} email sent successfully (${data.messageId})`);
            } else {
                addLog(`✗ Send failed: ${data.error}`);
            }
        } catch (err) {
            addLog(`✗ Send error: ${err instanceof Error ? err.message : "Unknown error"}`);
        } finally {
            setSending(false);
        }
    }, [currentStatus, sending, addLog]);

    const handleCancellation = useCallback(async (action: CancelAction) => {
        if (sending) return;
        setSending(true);
        setCancelAction(action);
        addLog(`Admin ${action} cancellation request...`);
        try {
            const res = await fetch("/api/send-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: "yogsthapa@gmail.com",
                    customerName: "Test User",
                    orderId: `NX-TEST-${Date.now()}`,
                    status: "Cancelled",
                    items: [
                        { name: "Nike Air Max", price: 150, quantity: 1, size: "US 10", color: "Black/White", currency: "$" }
                    ],
                    cancelReason: action === "accepted" ? "Customer request accepted" : "Customer request rejected",
                    refundAmount: action === "accepted" ? 150 : 0,
                    refundMethod: action === "accepted" ? "Original payment method" : "N/A",
                }),
            });
            const data = await res.json();
            if (data.success) {
                addLog(`✓ Cancellation ${action} email sent (${data.messageId})`);
            } else {
                addLog(`✗ Cancellation ${action} failed: ${data.error}`);
            }
        } catch (err) {
            addLog(`✗ Cancellation ${action} error: ${err instanceof Error ? err.message : "Unknown error"}`);
        } finally {
            setSending(false);
            setCancelAction(null);
        }
    }, [sending, addLog, setCancelAction]);

    const handleSendRef = useRef(handleSend)
    handleSendRef.current = handleSend

    const prevStatusRef = useRef<string | null>(null)

    useEffect(() => {
        if (currentStatus === "Processing") {
            prevStatusRef.current = currentStatus
            return
        }
        if (prevStatusRef.current === currentStatus) return
        prevStatusRef.current = currentStatus
        handleSendRef.current()
    }, [currentStatus])

    return (
        <div className="min-h-screen bg-black text-white">
            <EcomNavbar />
            <main className="relative px-4 pb-16 pt-28">
                <div className="relative mx-auto max-w-[1400px]">
                    <div className="mb-12">
                        <p className="mb-4 text-xs font-black uppercase tracking-[0.32em] text-red-500">
                            Email Testing Lab
                        </p>
                        <h1 className="text-5xl font-black uppercase leading-none tracking-tight md:text-7xl">
                            Test
                            <span className="block text-zinc-500">Email Templates</span>
                        </h1>
                    </div>

                    <div className="grid gap-8 lg:grid-cols-2">
                        <div className="space-y-6">
                            <div className="rounded-3xl border border-white/10 bg-zinc-950 p-6 shadow-xl shadow-black/30 md:p-8">
                                <h2 className="text-2xl font-black uppercase tracking-tight">Auto Cycle</h2>
                                <p className="mt-2 text-sm font-semibold text-zinc-500">
                                    Status changes every 5 seconds. Preview updates automatically.
                                </p>

                                <div className="mt-6 flex items-center gap-4">
                                    <div className="flex-1">
                                        <div className="h-3 w-full overflow-hidden rounded-full bg-zinc-900">
                                            <div
                                                className="h-full bg-red-500 transition-all duration-1000 ease-linear"
                                                style={{ width: `${(countdown / 5) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                    <span className="text-sm font-black text-zinc-400">{countdown}s</span>
                                </div>

                                <div className="mt-6 grid grid-cols-3 gap-3">
                                    {STATUSES.map((status) => (
                                        <button
                                            key={status}
                                            onClick={() => {
                                                setCurrentIndex(STATUSES.indexOf(status));
                                            }}
                                            className={`rounded-2xl border px-4 py-3 text-xs font-black uppercase tracking-widest transition-all ${
                                                currentStatus === status
                                                    ? "border-white bg-white text-black"
                                                    : "border-white/10 bg-black text-zinc-500 hover:border-white/40 hover:text-white"
                                            }`}
                                        >
                                            {status}
                                        </button>
                                    ))}
                                </div>

                                <div className="mt-4">
                                    <p className="mb-2 text-xs font-black uppercase tracking-widest text-zinc-500">Admin Cancellation Actions</p>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            onClick={() => handleCancellation("accepted")}
                                            disabled={sending}
                                            className="rounded-2xl border border-green-500/40 bg-green-500/10 px-4 py-3 text-xs font-black uppercase tracking-widest text-green-400 transition-all hover:bg-green-500 hover:text-black disabled:opacity-50"
                                        >
                                            {cancelAction === "accepted" && sending ? "Sending..." : "Accept Cancellation"}
                                        </button>
                                        <button
                                            onClick={() => handleCancellation("rejected")}
                                            disabled={sending}
                                            className="rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-xs font-black uppercase tracking-widest text-red-400 transition-all hover:bg-red-500 hover:text-black disabled:opacity-50"
                                        >
                                            {cancelAction === "rejected" && sending ? "Sending..." : "Reject Cancellation"}
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <Button
                                        onClick={handleSend}
                                        disabled={sending}
                                        className="h-14 w-full rounded-full bg-white text-sm font-black uppercase tracking-[0.2em] text-black transition-transform hover:scale-[1.01] hover:bg-red-500 hover:text-white active:scale-[0.99]"
                                    >
                                        {sending ? (
                                            "Sending..."
                                        ) : (
                                            <span className="flex items-center gap-2">
                                                <Send className="h-4 w-4" />
                                                Send {currentStatus} Email
                                            </span>
                                        )}
                                    </Button>
                                </div>

                                <div className="mt-6">
                                    <h3 className="text-sm font-black uppercase tracking-widest text-zinc-500">Activity Log</h3>
                                    <div className="mt-3 max-h-48 space-y-2 overflow-y-auto rounded-2xl border border-white/10 bg-black p-4">
                                        {log.length === 0 && (
                                            <p className="text-xs font-semibold text-zinc-600">No activity yet.</p>
                                        )}
                                        {log.map((entry, i) => (
                                            <p key={i} className="text-xs font-mono text-zinc-400">
                                                {entry}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="rounded-3xl border border-white/10 bg-zinc-950 p-6 shadow-xl shadow-black/30 md:p-8">
                                <div className="mb-4 flex items-center justify-between">
                                    <div>
                                        <h2 className="text-2xl font-black uppercase tracking-tight">Preview</h2>
                                        <p className="mt-1 text-sm font-semibold text-zinc-500">
                                            {cancelAction ? cancelSubject : (subject || `Subject for ${currentStatus}`)}
                                        </p>
                                    </div>
                                    <span className="rounded-full border border-white/10 px-4 py-2 text-xs font-black uppercase text-zinc-400">
                                        {cancelAction ? `Cancelled (${cancelAction})` : currentStatus}
                                    </span>
                                </div>

                                <div className="rounded-2xl border border-white/10 bg-white p-2">
                                    {loading ? (
                                        <div className="flex h-96 items-center justify-center">
                                            <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-black" />
                                        </div>
                                    ) : (
                                        <iframe
                                            srcDoc={cancelAction ? cancelPreviewHtml : previewHtml}
                                            title="Email Preview"
                                            className="h-[600px] w-full rounded-xl border border-zinc-200"
                                            sandbox=""
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <EcomFooter />
        </div>
    );
};

export default TestEmailPage;
