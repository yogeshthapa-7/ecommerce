"use client";

import { useEffect, useMemo, useState } from "react";
import { Activity, ArrowUpRight, Box, Globe2, Smartphone, Zap } from "lucide-react";

type Category = {
  _id?: string;
  id?: string;
  name?: string;
  products?: number;
};

const trafficSeries = [
  { label: "Mon", revenue: 34, visitors: 42 },
  { label: "Tue", revenue: 48, visitors: 52 },
  { label: "Wed", revenue: 41, visitors: 49 },
  { label: "Thu", revenue: 66, visitors: 71 },
  { label: "Fri", revenue: 74, visitors: 68 },
  { label: "Sat", revenue: 58, visitors: 83 },
  { label: "Sun", revenue: 88, visitors: 91 },
];

const channelTrackers = [
  { label: "Nike.com", value: "48.2K", trend: "+18%", progress: 86, icon: Globe2 },
  { label: "Mobile App", value: "32.8K", trend: "+24%", progress: 74, icon: Smartphone },
  { label: "SNKRS Drop", value: "11.4K", trend: "+31%", progress: 62, icon: Zap },
];

const productTrackers = [
  { name: "Air Max Pulse", stock: 84, velocity: "High" },
  { name: "Pegasus Trail 5", stock: 61, velocity: "Rising" },
  { name: "Dunk Low Retro", stock: 39, velocity: "Watch" },
];

const linePoints = trafficSeries
  .map((point, index) => {
    const x = 18 + index * 44;
    const y = 112 - point.visitors;
    return `${x},${y}`;
  })
  .join(" ");

const BarGraph = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        setCategories(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const categorySummary = useMemo(() => {
    const safeCategories = categories.length
      ? categories
      : [
          { name: "Running", products: 38 },
          { name: "Lifestyle", products: 27 },
          { name: "Basketball", products: 21 },
          { name: "Training", products: 16 },
        ];

    const maxProducts = Math.max(...safeCategories.map((category) => category.products || 0), 1);
    const totalProducts = safeCategories.reduce((sum, category) => sum + (category.products || 0), 0);

    return { safeCategories, maxProducts, totalProducts };
  }, [categories]);

  if (isLoading) {
    return (
      <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#101010] p-6">
        <div className="animate-pulse space-y-5">
          <div className="h-8 w-64 rounded-full bg-white/10" />
          <div className="grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
            <div className="h-72 rounded-3xl bg-white/10" />
            <div className="h-72 rounded-3xl bg-white/10" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#0f0f0f] shadow-2xl shadow-black/40">
      <div className="grid gap-px bg-white/10 lg:grid-cols-[1.35fr_0.65fr]">
        <div className="bg-[#0f0f0f] p-6 md:p-8">
          <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-3 text-xs font-black uppercase tracking-[0.28em] text-lime-300">
                <Activity size={16} />
                Commerce Pulse
              </div>
              <h2 className="max-w-xl text-4xl font-black uppercase leading-none tracking-tight text-white md:text-5xl">
                Digital demand is moving fast
              </h2>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white px-5 py-4 text-black">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-black/50">Portfolio SKUs</p>
              <p className="mt-1 text-4xl font-black tracking-tight">{categorySummary.totalProducts}</p>
            </div>
          </div>

          <div className="relative h-72 overflow-hidden rounded-[1.5rem] border border-white/10 bg-black p-5">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.055)_1px,transparent_1px)] bg-[size:44px_44px]" />
            <div className="relative flex h-full items-end gap-4">
              {trafficSeries.map((point) => (
                <div key={point.label} className="flex h-full flex-1 flex-col justify-end gap-3">
                  <div className="relative flex flex-1 items-end justify-center">
                    <div
                      className="w-full max-w-9 rounded-t-full bg-white transition-all duration-500 hover:bg-lime-300"
                      style={{ height: `${point.revenue}%` }}
                    />
                  </div>
                  <p className="text-center text-[11px] font-black uppercase tracking-widest text-white/45">
                    {point.label}
                  </p>
                </div>
              ))}
            </div>
            <svg
              className="pointer-events-none absolute inset-x-5 top-10 h-36 w-[calc(100%-2.5rem)] overflow-visible"
              viewBox="0 0 300 130"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <polyline
                points={linePoints}
                fill="none"
                stroke="#bef264"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {trafficSeries.map((point, index) => (
                <circle key={point.label} cx={18 + index * 44} cy={112 - point.visitors} r="4.5" fill="#ffffff" />
              ))}
            </svg>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {channelTrackers.map((tracker) => (
              <div key={tracker.label} className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
                <div className="mb-4 flex items-center justify-between">
                  <tracker.icon size={18} className="text-white/60" />
                  <span className="flex items-center gap-1 text-xs font-black text-lime-300">
                    {tracker.trend}
                    <ArrowUpRight size={13} />
                  </span>
                </div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/45">{tracker.label}</p>
                <p className="mt-1 text-2xl font-black text-white">{tracker.value}</p>
                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-lime-300" style={{ width: `${tracker.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="bg-[#151515] p-6 md:p-8">
          <div className="mb-7">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-white/40">Product Trackers</p>
            <h3 className="mt-2 text-2xl font-black uppercase tracking-tight text-white">Drop readiness</h3>
          </div>

          <div className="space-y-4">
            {productTrackers.map((product) => (
              <div key={product.name} className="rounded-3xl border border-white/10 bg-black/35 p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-black">
                      <Box size={18} />
                    </div>
                    <div>
                      <p className="font-black text-white">{product.name}</p>
                      <p className="text-xs font-bold uppercase tracking-widest text-white/40">{product.velocity}</p>
                    </div>
                  </div>
                  <span className="text-lg font-black text-white">{product.stock}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-white" style={{ width: `${product.stock}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 space-y-4">
            {categorySummary.safeCategories.slice(0, 4).map((category, index) => {
              const value = category.products || 0;
              const width = Math.max((value / categorySummary.maxProducts) * 100, 8);

              return (
                <div key={category._id || category.id || category.name || index}>
                  <div className="mb-2 flex items-center justify-between text-xs font-black uppercase tracking-widest">
                    <span className="text-white/55">{category.name || "Category"}</span>
                    <span className="text-white">{value}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-lime-300" style={{ width: `${width}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </aside>
      </div>
    </section>
  );
};

export default BarGraph;
